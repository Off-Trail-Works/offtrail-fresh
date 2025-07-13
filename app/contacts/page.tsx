import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ContactsPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get advisor info
  const { data: advisor } = await supabase
    .from("advisors")
    .select("*, firm:firms(*)")
    .eq("id", user.id)
    .single();

  if (!advisor) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You need to be registered as an advisor to access this page.</p>
        <p className="mt-4">
          <a href="/create-advisor" className="text-blue-600 hover:underline">
            Register as an advisor →
          </a>
        </p>
      </div>
    );
  }

  // Get contacts for this firm
  const { data: contacts, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("firm_id", advisor.firm_id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching contacts:", error);
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <p className="text-gray-600 mt-2">
          Firm: {advisor.firm?.name} | Role: {advisor.role}
        </p>
      </div>

      {contacts && contacts.length > 0 ? (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {contact.first_name} {contact.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{contact.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{contact.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        contact.status === "active"
                          ? "bg-green-100 text-green-800"
                          : contact.status === "prospect"
                          ? "bg-blue-100 text-blue-800"
                          : contact.status === "inactive"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {contact.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="bg-gray-50 px-6 py-3">
            <p className="text-sm text-gray-500">
              Showing {contacts.length} contacts {contacts.length === 50 ? "(limited to 50)" : ""}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
          <p className="text-gray-500">This firm doesn&apos;t have any contacts yet.</p>
        </div>
      )}
    </div>
  );
}