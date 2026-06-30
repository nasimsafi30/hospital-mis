"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Shield, Clock, User } from "lucide-react";
import { format } from "date-fns";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([
    { id: 1, action: "LOGIN", entity: "USER", entityId: 1, userEmail: "admin@hospital.com", ipAddress: "127.0.0.1", timestamp: new Date().toISOString() },
    { id: 2, action: "CREATE", entity: "PATIENT", entityId: 5, userEmail: "john.smith@hospital.com", ipAddress: "127.0.0.1", timestamp: new Date().toISOString() },
    { id: 3, action: "UPDATE", entity: "APPOINTMENT", entityId: 10, userEmail: "reception1@hospital.com", ipAddress: "127.0.0.1", timestamp: new Date().toISOString() },
    { id: 4, action: "DELETE", entity: "BILL", entityId: 3, userEmail: "admin@hospital.com", ipAddress: "127.0.0.1", timestamp: new Date().toISOString() },
    { id: 5, action: "VIEW", entity: "MEDICAL_RECORD", entityId: 8, userEmail: "sarah.johnson@hospital.com", ipAddress: "127.0.0.1", timestamp: new Date().toISOString() },
  ]);
  const [search, setSearch] = useState("");

  const filtered = logs.filter((l: any) =>
    `${l.action} ${l.entity} ${l.userEmail}`.toLowerCase().includes(search.toLowerCase())
  );

  const actionColors: any = {
    CREATE: "bg-green-100 text-green-800", UPDATE: "bg-blue-100 text-blue-800",
    DELETE: "bg-red-100 text-red-800", VIEW: "bg-gray-100 text-gray-800",
    LOGIN: "bg-purple-100 text-purple-800", LOGOUT: "bg-orange-100 text-orange-800",
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2"><Shield className="h-8 w-8" />Audit Logs</h1>
        <p className="text-muted-foreground">{logs.length} system activities recorded</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input title="Input field" placeholder="Search logs..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b bg-muted/50"><th className="text-left p-3">Action</th><th className="text-left p-3">Entity</th><th className="text-left p-3">Entity ID</th><th className="text-left p-3">User</th><th className="text-left p-3">IP Address</th><th className="text-left p-3">Time</th></tr></thead>
              <tbody>
                {filtered.map((log: any, i: number) => (
                  <tr key={i} className="border-b hover:bg-muted/50">
                    <td className="p-3"><Badge className={actionColors[log.action] || ""}>{log.action}</Badge></td>
                    <td className="p-3 text-sm">{log.entity}</td>
                    <td className="p-3 text-sm">#{log.entityId}</td>
                    <td className="p-3 text-sm flex items-center gap-1"><User className="h-3 w-3" />{log.userEmail}</td>
                    <td className="p-3 text-sm text-muted-foreground">{log.ipAddress}</td>
                    <td className="p-3 text-sm text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{log.timestamp ? format(new Date(log.timestamp), 'MMM dd, HH:mm') : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}