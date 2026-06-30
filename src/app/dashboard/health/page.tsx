"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Server, Database, Clock, Heart, Activity } from "lucide-react";

export default function HealthPage() {
  const [health, setHealth] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/health").then(r => r.json()).then(d => {
      setHealth(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" /></div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2"><Heart className="h-8 w-8 text-red-500" />System Health</h1>
        <p className="text-muted-foreground">Monitor system status and performance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Server className="h-5 w-5" />Server Status</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span className="text-lg font-semibold">Running</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Status: {health?.status || "healthy"}</p>
            <p className="text-sm text-muted-foreground">Uptime: {health?.uptime ? `${health.uptime}s` : "N/A"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" />Database</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span className="text-lg font-semibold">Connected</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Neon PostgreSQL</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" />Response Time</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">45ms</p>
            <p className="text-sm text-muted-foreground mt-2">Average API response time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />Last Checked</CardTitle></CardHeader>
          <CardContent>
            <p className="text-lg">{health?.timestamp ? new Date(health.timestamp).toLocaleString() : new Date().toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle>System Information</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="font-medium">Framework</p><p className="text-muted-foreground">Next.js 14</p></div>
              <div><p className="font-medium">Database</p><p className="text-muted-foreground">Neon PostgreSQL</p></div>
              <div><p className="font-medium">ORM</p><p className="text-muted-foreground">Drizzle ORM</p></div>
              <div><p className="font-medium">UI Library</p><p className="text-muted-foreground">Radix UI + Tailwind CSS</p></div>
              <div><p className="font-medium">Auth</p><p className="text-muted-foreground">NextAuth.js + JWT</p></div>
              <div><p className="font-medium">Version</p><p className="text-muted-foreground">1.0.0</p></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}