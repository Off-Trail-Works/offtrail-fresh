'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/contacts');
  }, [router]);

  return (
    <div className="min-h-screen bg-financial-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 bg-financial-blue-200 rounded-full animate-pulse mx-auto mb-4"></div>
        <p className="text-financial-gray-600 font-medium">Redirecting...</p>
      </div>
    </div>
  );
}