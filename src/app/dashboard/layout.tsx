"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (!token) { router.push("/login"); return; }
    
    if (userStr) {
      const u = JSON.parse(userStr);
      setUser(u);
      
      // Role-based redirect for dashboard home
      if (window.location.pathname === '/dashboard') {
        if (u.role === 'doctor') router.push('/dashboard/appointments');
        else if (u.role === 'nurse') router.push('/dashboard/inpatients');
        else if (u.role === 'pharmacist') router.push('/dashboard/pharmacy');
        else if (u.role === 'lab_technician') router.push('/dashboard/laboratory');
        else if (u.role === 'receptionist') router.push('/dashboard/patients');
      }
    }
    
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar className="hidden md:block" userRole={user?.role} />
      <div className="md:ml-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">{children}</main>
      </div>
      <MobileBottomNav />
    </div>
  );
}