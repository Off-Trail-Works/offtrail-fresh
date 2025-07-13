'use client'

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import Link from "next/link";

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic';

export default function Home() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [advisor, setAdvisor] = useState<{
    id: string;
    first_name: string;
    last_name: string;
    role: string;
    firm?: { id: string; name: string; slug: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Check if user is an advisor
        const { data: advisorData } = await supabase
          .from("advisors")
          .select(`
            *,
            firm:firms(*)
          `)
          .eq("id", user.id)
          .single();
        
        setAdvisor(advisorData);
      }

      setLoading(false);
    }

    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Welcome to OffTrail CRM
              </h1>
              {advisor ? (
                <p className="text-slate-600">
                  Welcome back, {advisor.first_name}! You&apos;re connected to {advisor.firm?.name}.
                </p>
              ) : user ? (
                <p className="text-slate-600">
                  You&apos;re signed in but need to be registered as an advisor to access the CRM features.
                </p>
              ) : (
                <p className="text-slate-600">
                  Your financial relationship management platform built with modern tools.
                </p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {user && advisor && (
                <Link 
                  href="/contacts"
                  className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-slate-200/50 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 616 0zm6 3a2 2 0 11-4 0 2 2 0 414 0zM7 10a2 2 0 11-4 0 2 2 0 414 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">View Contacts</h3>
                      <p className="text-sm text-slate-600">Manage your client relationships</p>
                    </div>
                  </div>
                </Link>
              )}

              {!advisor && (
                <Link 
                  href="/create-advisor"
                  className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-slate-200/50 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Create Advisor Account</h3>
                      <p className="text-sm text-slate-600">Join a firm and access contacts</p>
                    </div>
                  </div>
                </Link>
              )}

              {!user && (
                <Link 
                  href="/auth/login"
                  className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-slate-200/50 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Sign In</h3>
                      <p className="text-sm text-slate-600">Access your account</p>
                    </div>
                  </div>
                </Link>
              )}

              <Link 
                href="/protected"
                className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-slate-200/50 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 818 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Profile</h3>
                    <p className="text-sm text-slate-600">Manage your account settings</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-slate-200/50">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Getting Started</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium text-slate-600 mt-0.5">1</div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Create an advisor account</p>
                      <p className="text-xs text-slate-500">Join an existing firm to access contacts</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium text-slate-600 mt-0.5">2</div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Browse contacts</p>
                      <p className="text-xs text-slate-500">View and manage client relationships</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium text-slate-600 mt-0.5">3</div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Manage your firm</p>
                      <p className="text-xs text-slate-500">Access firm-specific data and settings</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-slate-200/50">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-slate-700">Multi-tenant firm structure</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-slate-700">Row-level security</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-slate-700">Contact management</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-slate-700">Branch database support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
