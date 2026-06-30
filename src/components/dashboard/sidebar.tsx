"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard, Users, UserCheck, Calendar, FileText,
  Pill, FlaskConical, Package, DollarSign, BarChart3,
  Settings, HelpCircle, ChevronLeft, ChevronRight,
  BedDouble, Building2, DoorOpen, ClipboardList, Activity,
  FileSearch, Shield, Heart, Stethoscope,
} from "lucide-react";

const navigation = [
  { title: "Main", items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },{ title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 }] },
  { title: "Management", items: [
    { title: "Patients", href: "/dashboard/patients", icon: Users },{ title: "Doctors", href: "/dashboard/doctors", icon: UserCheck },
    { title: "Appointments", href: "/dashboard/appointments", icon: Calendar },{ title: "Inpatients", href: "/dashboard/inpatients", icon: BedDouble },
    { title: "Medical Records", href: "/dashboard/records", icon: FileText },{ title: "Prescriptions", href: "/dashboard/prescriptions", icon: ClipboardList },
  ]},
  { title: "Services", items: [
    { title: "Pharmacy", href: "/dashboard/pharmacy", icon: Pill },{ title: "Laboratory", href: "/dashboard/laboratory", icon: FlaskConical },
    { title: "Inventory", href: "/dashboard/inventory", icon: Package },{ title: "Billing", href: "/dashboard/billing", icon: DollarSign },
  ]},
  { title: "Facilities", items: [
    { title: "Departments", href: "/dashboard/departments", icon: Building2 },{ title: "Rooms", href: "/dashboard/rooms", icon: DoorOpen },
    { title: "Beds", href: "/dashboard/beds", icon: BedDouble },
  ]},
  { title: "Reports", items: [
    { title: "Reports", href: "/dashboard/reports", icon: FileSearch },{ title: "Audit Logs", href: "/dashboard/audit-logs", icon: Shield },
  ]},
  { title: "System", items: [
    { title: "Health", href: "/dashboard/health", icon: Heart },{ title: "API Docs", href: "/dashboard/docs", icon: Activity },
    { title: "Settings", href: "/dashboard/settings", icon: Settings },{ title: "Profile", href: "/dashboard/profile", icon: Stethoscope },
    { title: "Help", href: "/dashboard/help", icon: HelpCircle },
  ]},
];

export function Sidebar({ className, userRole }: { className?: string; userRole?: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const [user, setUser] = useState<any>({ firstName: "User", lastName: "", role: "" });
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
    const a = localStorage.getItem("avatar");
    if (a) setAvatar(a);

    // Listen for avatar changes
    const handleStorage = () => {
      const saved = localStorage.getItem("avatar");
      if (saved) setAvatar(saved);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <aside className={cn("fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300", collapsed ? "w-16" : "w-64", className)}>
      <div className="flex h-full flex-col">
        <div className={cn("flex items-center border-b px-4 py-3", collapsed ? "justify-center" : "justify-between")}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">H</span>
              </div>
              <div><h1 className="text-lg font-bold">MediCare</h1><p className="text-xs text-muted-foreground">Hospital MIS</p></div>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="hidden md:flex">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          {navigation.map((group) => (
            <div key={group.title} className="mb-6">
              {!collapsed && <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{group.title}</h3>}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button variant={pathname === item.href ? "secondary" : "ghost"} className={cn("w-full justify-start", collapsed && "justify-center px-2")} title={collapsed ? item.title : undefined}>
                      <item.icon className={cn("h-4 w-4", !collapsed && "mr-2")} />{!collapsed && item.title}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </ScrollArea>

        <div className="border-t p-4">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                {avatar && <AvatarImage src={avatar} />}
                <AvatarFallback className="bg-primary text-primary-foreground">{user?.firstName?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-muted-foreground truncate capitalize">{user?.role}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}