'use client'

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { getContactsData } from "@/app/actions/contacts";
import type { Contact, Advisor, Firm } from "@/lib/db/client";
import { 
  Search, 
  Filter, 
  Users, 
  Phone, 
  Mail, 
  MoreVertical,
  Plus,
  Download,
  TrendingUp,
  UserCheck,
  UserX,
  Clock
} from "lucide-react";

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic';

interface AdvisorWithFirm extends Advisor {
  firm?: Firm;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [advisor, setAdvisor] = useState<AdvisorWithFirm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const result = await getContactsData();
        
        if (result.error) {
          setError(result.error);
        } else {
          setContacts(result.contacts);
          setAdvisor(result.advisor);
        }
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredContacts = contacts.filter((contact) => {
    // Filter by status
    const statusMatch = filterBy === 'all' || contact.status === filterBy;

    // Filter by search query
    const searchMatch =
      !searchQuery ||
      contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.email && contact.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (contact.phone && contact.phone.includes(searchQuery));

    return statusMatch && searchMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-financial-gray-50">
        <Header />
        <div className="flex h-[calc(100vh-80px)]">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 bg-financial-blue-200 rounded-full animate-pulse mx-auto mb-4"></div>
              <p className="text-financial-gray-600 font-medium">Loading contacts...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-financial-gray-50">
        <Header />
        <div className="flex h-[calc(100vh-80px)]">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-md w-full">
              <div className="bg-white rounded-xl border border-financial-red-200 p-6 shadow-financial">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-financial-red-100 rounded-lg flex items-center justify-center mr-3">
                    <UserX className="h-5 w-5 text-financial-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-financial-gray-900">Access Error</h3>
                </div>
                <p className="text-financial-gray-600 mb-6">{error}</p>
                <a 
                  href="/create-advisor" 
                  className="inline-flex items-center px-4 py-2 bg-financial-blue-600 text-white font-medium rounded-lg hover:bg-financial-blue-700 transition-colors"
                >
                  Register as an advisor →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-financial-gray-50">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />
        {/* Main Content */}
        <div className="flex-1 lg:ml-72 p-6 lg:p-8 overflow-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-financial-gray-900 mb-2">Client Portfolio</h1>
                <p className="text-financial-gray-600">
                  Manage and track your client relationships
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="inline-flex items-center px-4 py-2 bg-white border border-financial-gray-300 rounded-lg text-financial-gray-700 hover:bg-financial-gray-50 transition-colors shadow-sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
                <button className="inline-flex items-center px-4 py-2 bg-financial-blue-600 text-white rounded-lg hover:bg-financial-blue-700 transition-colors shadow-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Client
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-financial border border-financial-gray-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-financial-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-financial-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-financial-gray-900">{contacts.length}</p>
                    <p className="text-sm text-financial-gray-600">Total Clients</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-financial border border-financial-gray-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-financial-green-100 rounded-lg flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-financial-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-financial-gray-900">
                      {contacts.filter(c => c.status === 'active').length}
                    </p>
                    <p className="text-sm text-financial-gray-600">Active Clients</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-financial border border-financial-gray-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-financial-amber-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-financial-amber-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-financial-gray-900">
                      {contacts.filter(c => c.status === 'prospect').length}
                    </p>
                    <p className="text-sm text-financial-gray-600">Prospects</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-financial border border-financial-gray-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-financial-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-financial-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-financial-gray-900">+12%</p>
                    <p className="text-sm text-financial-gray-600">Growth Rate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Firm Information */}
            <div className="bg-gradient-to-r from-financial-blue-600 to-financial-blue-700 rounded-xl p-6 text-white mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{advisor?.firm?.name}</h3>
                  <p className="text-financial-blue-100">Role: {advisor?.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{filteredContacts.length}</p>
                  <p className="text-financial-blue-100 text-sm">Active Contacts</p>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl p-6 shadow-financial border border-financial-gray-200 mb-6">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-financial-gray-400" />
                  <input
                    type="text"
placeholder="Search by name, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-financial-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-financial-blue-500 focus:border-financial-blue-500 transition-colors"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-financial-gray-400" />
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="pl-10 pr-8 py-3 border border-financial-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-financial-blue-500 focus:border-financial-blue-500 bg-white min-w-40"
                  >
                    <option value="all">All Status</option>
                    <option value="prospect">Prospect</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="former">Former</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {filteredContacts.length > 0 ? (
            <div className="space-y-4">
              {/* Desktop Table View */}
              <div className="hidden lg:block bg-white rounded-xl shadow-financial border border-financial-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-financial-gray-50 border-b border-financial-gray-200">
                  <h3 className="text-lg font-semibold text-financial-gray-900">Client Directory</h3>
                  <p className="text-sm text-financial-gray-600 mt-1">
                    Showing {filteredContacts.length} of {contacts.length} clients
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-financial-gray-200">
                    <thead className="bg-financial-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-financial-gray-700 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-financial-gray-700 uppercase tracking-wider">
                          Contact Information
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-financial-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-financial-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-financial-gray-200">
                      {filteredContacts.map((contact) => (
                        <tr key={contact.id} className="hover:bg-financial-gray-50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-financial-blue-500 to-financial-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                {contact.firstName?.[0] || ''}{contact.lastName?.[0] || ''}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-semibold text-financial-gray-900">
                                  {contact.firstName} {contact.lastName}
                                </div>
                                <div className="text-xs text-financial-gray-500">
                                  Client ID: {contact.id.slice(0, 8)}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              {contact.email && (
                                <div className="flex items-center text-sm text-financial-gray-600">
                                  <Mail className="h-3 w-3 mr-2 text-financial-gray-400" />
                                  {contact.email}
                                </div>
                              )}
                              {contact.phone && (
                                <div className="flex items-center text-sm text-financial-gray-600">
                                  <Phone className="h-3 w-3 mr-2 text-financial-gray-400" />
                                  {contact.phone}
                                </div>
                              )}
                              {!contact.email && !contact.phone && (
                                <span className="text-sm text-financial-gray-400">No contact info</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                contact.status === "active"
                                  ? "bg-financial-green-100 text-financial-green-800"
                                  : contact.status === "prospect"
                                  ? "bg-financial-blue-100 text-financial-blue-800"
                                  : contact.status === "inactive"
                                  ? "bg-financial-amber-100 text-financial-amber-800"
                                  : "bg-financial-gray-100 text-financial-gray-800"
                              }`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                contact.status === "active"
                                  ? "bg-financial-green-600"
                                  : contact.status === "prospect"
                                  ? "bg-financial-blue-600"
                                  : contact.status === "inactive"
                                  ? "bg-financial-amber-600"
                                  : "bg-financial-gray-600"
                              }`}></div>
                              {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="p-2 text-financial-gray-400 hover:text-financial-gray-600 hover:bg-financial-gray-100 rounded-lg transition-colors">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {filteredContacts.map((contact) => (
                  <div key={contact.id} className="bg-white rounded-xl p-6 shadow-financial border border-financial-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-financial-blue-500 to-financial-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {contact.firstName?.[0] || ''}{contact.lastName?.[0] || ''}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-financial-gray-900">
                            {contact.firstName} {contact.lastName}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold mt-1 ${
                              contact.status === "active"
                                ? "bg-financial-green-100 text-financial-green-800"
                                : contact.status === "prospect"
                                ? "bg-financial-blue-100 text-financial-blue-800"
                                : contact.status === "inactive"
                                ? "bg-financial-amber-100 text-financial-amber-800"
                                : "bg-financial-gray-100 text-financial-gray-800"
                            }`}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                              contact.status === "active"
                                ? "bg-financial-green-600"
                                : contact.status === "prospect"
                                ? "bg-financial-blue-600"
                                : contact.status === "inactive"
                                ? "bg-financial-amber-600"
                                : "bg-financial-gray-600"
                            }`}></div>
                            {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <button className="p-2 text-financial-gray-400 hover:text-financial-gray-600 hover:bg-financial-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {contact.email && (
                        <div className="flex items-center text-sm text-financial-gray-600">
                          <Mail className="h-4 w-4 mr-3 text-financial-gray-400" />
                          <span>{contact.email}</span>
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center text-sm text-financial-gray-600">
                          <Phone className="h-4 w-4 mr-3 text-financial-gray-400" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                      {!contact.email && !contact.phone && (
                        <p className="text-sm text-financial-gray-400 italic">No contact information available</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-financial border border-financial-gray-200 p-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-financial-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-financial-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-financial-gray-900 mb-3">
                  {searchQuery || filterBy !== 'all' ? 'No matching clients' : 'No clients yet'}
                </h3>
                <p className="text-financial-gray-600 mb-8 max-w-md mx-auto">
                  {searchQuery || filterBy !== 'all' 
                    ? 'Try adjusting your search criteria or filter settings to find the clients you\'re looking for.'
                    : 'Start building your client portfolio by adding your first client to the platform.'
                  }
                </p>
                {!searchQuery && filterBy === 'all' && (
                  <button className="inline-flex items-center px-6 py-3 bg-financial-blue-600 text-white font-medium rounded-lg hover:bg-financial-blue-700 transition-colors shadow-sm">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Your First Client
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}