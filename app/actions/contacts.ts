'use server';

import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db/server";
import { contacts as contactsTable, advisors as advisorsTable, firms as firmsTable } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import type { Contact, Advisor, Firm } from "@/lib/db/schema";

interface AdvisorWithFirm extends Advisor {
  firm?: Firm;
}

export async function getContactsData(): Promise<{
  contacts: Contact[];
  advisor: AdvisorWithFirm | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { contacts: [], advisor: null, error: "Please sign in to access contacts" };
    }

    // Get advisor info with firm data using Drizzle
    const advisorData = await db
      .select()
      .from(advisorsTable)
      .leftJoin(firmsTable, eq(advisorsTable.firmId, firmsTable.id))
      .where(eq(advisorsTable.id, user.id))
      .limit(1);

    if (!advisorData || advisorData.length === 0) {
      return { contacts: [], advisor: null, error: "You need to be registered as an advisor to access this page." };
    }

    const advisor = advisorData[0];
    const advisorWithFirm: AdvisorWithFirm = {
      ...advisor.advisors,
      firm: advisor.firms || undefined
    };

    // Get contacts for this firm using Drizzle
    const contactsData = await db
      .select()
      .from(contactsTable)
      .where(eq(contactsTable.firmId, advisor.advisors.firmId))
      .orderBy(desc(contactsTable.createdAt));

    return {
      contacts: contactsData,
      advisor: advisorWithFirm,
      error: null
    };
  } catch (error) {
    console.error('Error in getContactsData:', error);
    return {
      contacts: [],
      advisor: null,
      error: "Error loading data: " + (error instanceof Error ? error.message : 'Unknown error')
    };
  }
}