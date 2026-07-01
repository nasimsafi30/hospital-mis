"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, Activity, RefreshCw, Download } from "lucide-react";
import { toast } from "sonner";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#FF6B6B", "#4ECDC4"];

export default function AnalyticsPage() {
  const router = useRouter();
  const [period, setPeriod] = useState("month");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) { 
      router.push("/login"); 
      return; 
    }
    setLoading(false);
  }, [router]);

  const monthlyStats = [
    { month: "Jan", patients: 65, appointments: 120, revenue: 45000 },
    { month: "Feb", patients: 78, appointments: 145, revenue: 52000 },
    { month: "Mar", patients: 82, appointments: 138, revenue: 48000 },
    { month: "Apr", patients: 90, appointments: 160, revenue: 61000 },
    { month: "May", patients: 95, appointments: 155, revenue: 55000 },
    { month: "Jun", patients: 100, appointments: 170, revenue: 67000 },
  ];

  const departmentData = [
    { name: "Cardiology", value: 30 }, 
    { name: "Neurology", value: 25 },
    { name: "Orthopedics", value: 20 }, 
    { name: "Pediatrics", value: 15 }, 
    { name: "Other", value: 10 },
  ];

  const handleRefresh = () => {
    toast.success("Data refreshed successfully");
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleExport = () => {
    toast.info("Exporting analytics data...");
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Hospital performance metrics</p>
        </div>
        <div className="flex gap-2">
          {/* ✅ Fixed: Using shadcn/ui Select correctly */}
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="gap-2" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <p className="text-3xl font-bold">12,543</p>
                <div className="flex items-center gap-1 mt-1 text-green-500 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  +12.5%
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Appointments</p>
                <p className="text-3xl font-bold">1,890</p>
                <div className="flex items-center gap-1 mt-1 text-green-500 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  +8.2%
                </div>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-3xl font-bold">$89,450</p>
                <div className="flex items-center gap-1 mt-1 text-green-500 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  +18.3%
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bed Occupancy</p>
                <p className="text-3xl font-bold">78%</p>
                <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                  <TrendingDown className="h-4 w-4" />
                  -3.1%
                </div>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => [`$${value?.toLocaleString() || "0"}`, "Revenue"]} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884D8" 
                  fill="#8884D8" 
                  fillOpacity={0.3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884D8"
                  dataKey="value"
                  label
                >
                  {departmentData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}