'use client'

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic';

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Advisor {
  id: string;
  firm_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  firm?: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [advisor, setAdvisor] = useState<Advisor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();

      // Check if user is authenticated
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/auth/login");
        return;
      }

      // Get advisor info
      const { data: advisorData, error: advisorError } = await supabase
        .from("advisors")
        .select(`
          *,
          firm:firms(*)
        `)
        .eq("id", user.id)
        .single();

      if (advisorError || !advisorData) {
        setError("You need to be registered as an advisor to access this page.");
        setLoading(false);
        return;
      }

      setAdvisor(advisorData);

      // Get contacts for this firm
      const { data: contactsData, error: contactsError } = await supabase
        .from("contacts")
        .select("*")
        .eq("firm_id", advisorData.firm_id)
        .order("created_at", { ascending: false });

      if (contactsError) {
        setError("Error fetching contacts: " + contactsError.message);
      } else {
        setContacts(contactsData || []);
      }

      setLoading(false);
    }

    loadData();
  }, [router]);

  const filteredContacts = contacts.filter((contact) => {
    // Filter by status
    const statusMatch = filterBy === 'all' || contact.status === filterBy;

    // Filter by search query
    const searchMatch =
      !searchQuery ||
      contact.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.email && contact.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (contact.phone && contact.phone.includes(searchQuery));

    return statusMatch && searchMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-lg font-medium text-red-800">Error</h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <p className="mt-4">
              <a href="/create-advisor" className="text-blue-600 hover:underline">
                Register as an advisor →
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />
        {/* Main Content */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold text-slate-800">Contacts</h2>
                <div className="px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-600 font-medium">
                  {filteredContacts.length} contacts
                </div>
              </div>
            </div>

            <div className="mb-4 text-sm text-slate-600">
              Firm: {advisor?.firm?.name} | Role: {advisor?.role}
            </div>

            {/* Search and Filter */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="prospect">Prospect</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="former">Former</option>
              </select>
            </div>
          </div>

          {filteredContacts.length > 0 ? (
            <div className="bg-white/95 backdrop-blur-sm shadow-sm rounded-xl overflow-hidden border border-slate-200/50">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/95 divide-y divide-slate-100">
                    {filteredContacts.map((contact) => (
                      <tr key={contact.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900">
                            {contact.first_name} {contact.last_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-600">{contact.email || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-600">{contact.phone || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              contact.status === "active"
                                ? "bg-emerald-100 text-emerald-800"
                                : contact.status === "prospect"
                                ? "bg-blue-100 text-blue-800"
                                : contact.status === "inactive"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {contact.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="bg-slate-50/50 px-6 py-3 border-t border-slate-200/50">
                <p className="text-sm text-slate-500">
                  Showing {filteredContacts.length} of {contacts.length} contacts
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 616 0zm6 3a2 2 0 11-4 0 2 2 0 414 0zM7 10a2 2 0 11-4 0 2 2 0 414 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No contacts found</h3>
                <p className="text-slate-500">
                  {searchQuery || filterBy !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'This firm doesn\'t have any contacts yet.'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}