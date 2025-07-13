CREATE TYPE "public"."advisor_role" AS ENUM('owner', 'advisor', 'assistant');--> statement-breakpoint
CREATE TYPE "public"."contact_status" AS ENUM('prospect', 'active', 'inactive', 'former');--> statement-breakpoint
CREATE TABLE "advisors" (
	"id" uuid PRIMARY KEY NOT NULL,
	"firm_id" uuid NOT NULL,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"role" "advisor_role" DEFAULT 'advisor' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "advisors_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "advisors" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firm_id" uuid NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text,
	"phone" text,
	"status" "contact_status" DEFAULT 'prospect' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contacts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "firms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "firms_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "firms" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "advisors" ADD CONSTRAINT "advisors_firm_id_firms_id_fk" FOREIGN KEY ("firm_id") REFERENCES "public"."firms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_firm_id_firms_id_fk" FOREIGN KEY ("firm_id") REFERENCES "public"."firms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "advisors_view_own" ON "advisors" AS PERMISSIVE FOR SELECT TO public USING (id = auth.uid());--> statement-breakpoint
CREATE POLICY "advisors_view_same_firm" ON "advisors" AS PERMISSIVE FOR SELECT TO public USING (firm_id IN (SELECT firm_id FROM advisors WHERE id = auth.uid()));--> statement-breakpoint
CREATE POLICY "advisors_update_own" ON "advisors" AS PERMISSIVE FOR UPDATE TO public USING (id = auth.uid());--> statement-breakpoint
CREATE POLICY "contacts_view_same_firm" ON "contacts" AS PERMISSIVE FOR SELECT TO public USING (firm_id IN (SELECT firm_id FROM advisors WHERE id = auth.uid()));--> statement-breakpoint
CREATE POLICY "contacts_insert_same_firm" ON "contacts" AS PERMISSIVE FOR INSERT TO public WITH CHECK (firm_id IN (SELECT firm_id FROM advisors WHERE id = auth.uid()));--> statement-breakpoint
CREATE POLICY "contacts_update_same_firm" ON "contacts" AS PERMISSIVE FOR UPDATE TO public USING (firm_id IN (SELECT firm_id FROM advisors WHERE id = auth.uid()));--> statement-breakpoint
CREATE POLICY "contacts_delete_same_firm" ON "contacts" AS PERMISSIVE FOR DELETE TO public USING (firm_id IN (SELECT firm_id FROM advisors WHERE id = auth.uid()));--> statement-breakpoint
CREATE POLICY "firms_view_own" ON "firms" AS PERMISSIVE FOR SELECT TO public USING (id IN (SELECT firm_id FROM advisors WHERE id = auth.uid()));