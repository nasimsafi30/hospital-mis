"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Users, UserCheck, Calendar, DollarSign, TrendingUp, TrendingDown,
  Activity, Pill, FlaskConical, BedDouble, Clock, ArrowRight,
  Heart, Stethoscope, Building2, Package, Star, Zap,
  ChevronRight, Bell, Search, Menu, BarChart3,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";
import { format } from "date-fns";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) { router.push("/login"); return; }
    setUser(JSON.parse(u));
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const statsCards = [
    { title: "Total Patients", value: "12,543", change: "+12.5%", trend: "up", icon: Users, color: "from-blue-500 to-cyan-500", bgColor: "bg-blue-500/10" },
    { title: "Total Doctors", value: "345", change: "+4.2%", trend: "up", icon: UserCheck, color: "from-green-500 to-emerald-500", bgColor: "bg-green-500/10" },
    { title: "Appointments Today", value: "156", change: "-2.8%", trend: "down", icon: Calendar, color: "from-purple-500 to-pink-500", bgColor: "bg-purple-500/10" },
    { title: "Revenue Today", value: "$45,890", change: "+18.3%", trend: "up", icon: DollarSign, color: "from-orange-500 to-red-500", bgColor: "bg-orange-500/10" },
  ];

  const appointmentData = [
    { name: "Mon", appointments: 45, consultations: 32 },
    { name: "Tue", appointments: 52, consultations: 38 },
    { name: "Wed", appointments: 48, consultations: 35 },
    { name: "Thu", appointments: 61, consultations: 48 },
    { name: "Fri", appointments: 55, consultations: 42 },
    { name: "Sat", appointments: 38, consultations: 28 },
    { name: "Sun", appointments: 25, consultations: 18 },
  ];

  const departmentData = [
    { name: "Cardiology", value: 30, color: "#3B82F6" },
    { name: "Neurology", value: 25, color: "#10B981" },
    { name: "Orthopedics", value: 20, color: "#F59E0B" },
    { name: "Pediatrics", value: 15, color: "#EF4444" },
    { name: "Others", value: 10, color: "#8B5CF6" },
  ];

  const recentActivities = [
    { id: 1, action: "New patient registered", patient: "John Doe", time: "2 min ago", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
    { id: 2, action: "Appointment scheduled", patient: "Jane Smith", time: "15 min ago", icon: Calendar, color: "text-purple-400", bg: "bg-purple-500/10" },
    { id: 3, action: "Prescription issued", patient: "Robert Johnson", time: "1 hour ago", icon: Pill, color: "text-green-400", bg: "bg-green-500/10" },
    { id: 4, action: "Lab results uploaded", patient: "Emily Brown", time: "2 hours ago", icon: FlaskConical, color: "text-orange-400", bg: "bg-orange-500/10" },
    { id: 5, action: "Payment received", patient: "Michael Wilson", time: "3 hours ago", icon: DollarSign, color: "text-red-400", bg: "bg-red-500/10" },
  ];

  const quickActions = [
    { label: "New Patient", icon: Users, href: "/dashboard/patients/new", color: "from-blue-500 to-blue-600" },
    { label: "Appointment", icon: Calendar, href: "/dashboard/appointments", color: "from-purple-500 to-purple-600" },
    { label: "Invoice", icon: DollarSign, href: "/dashboard/billing", color: "from-green-500 to-green-600" },
    { label: "Medicine", icon: Pill, href: "/dashboard/pharmacy", color: "from-orange-500 to-orange-600" },
    { label: "Lab Test", icon: FlaskConical, href: "/dashboard/laboratory", color: "from-pink-500 to-pink-600" },
    { label: "Admit", icon: BedDouble, href: "/dashboard/inpatients", color: "from-indigo-500 to-indigo-600" },
  ];

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 min-h-screen">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{user?.firstName || "User"}</span>
          </h1>
          <p className="text-gray-400 mt-1">
            {format(currentTime, 'EEEE, MMMM dd, yyyy')} • {format(currentTime, 'hh:mm a')}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">
            <Search className="h-4 w-4 mr-2" /> Search
          </Button>
          <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card className="border-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                    {stat.trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {stat.change}
                  </div>
                </div>
                <p className="text-sm text-gray-400">{stat.title}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                Weekly Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={appointmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" />
                  <YAxis stroke="rgba(255,255,255,0.3)" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                  <Legend />
                  <Bar dataKey="appointments" fill="url(#colorBlue)" name="Appointments" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="consultations" fill="url(#colorGreen)" name="Consultations" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3B82F6"/><stop offset="100%" stopColor="#1D4ED8"/></linearGradient>
                    <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10B981"/><stop offset="100%" stopColor="#047857"/></linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-400" />
                Department Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={departmentData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 md:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="md:col-span-1">
          <Card className="border-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Link key={action.label} href={action.href}>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-xl bg-gradient-to-br ${action.color} text-white text-center cursor-pointer shadow-lg hover:shadow-xl transition-all`}
                    >
                      <action.icon className="h-6 w-6 mx-auto mb-2" />
                      <p className="text-xs font-medium">{action.label}</p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="md:col-span-2">
          <Card className="border-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-cyan-400" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <div className={`p-2 rounded-lg ${activity.bg}`}>
                      <activity.icon className={`h-5 w-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{activity.action}</p>
                      <p className="text-xs text-gray-400">Patient: {activity.patient}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}