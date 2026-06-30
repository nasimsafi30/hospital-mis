"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Activity } from "lucide-react";

export default function InpatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inpatients").then(r => r.json()).then(data => {
      setPatients(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Inpatients</h1>
          <p className="text-muted-foreground">Total admitted: {patients.length}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {patients.map((p: any) => (
          <Card key={p.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{p.patient?.firstName} {p.patient?.lastName}</CardTitle>
                  <p className="text-sm text-muted-foreground">{p.admissionId}</p>
                </div>
                <Badge>{p.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Doctor:</strong> Dr. {p.doctor?.firstName} {p.doctor?.lastName}</p>
                <p><strong>Room:</strong> {p.room?.roomNumber || "N/A"} | <strong>Bed:</strong> {p.bed?.bedNumber || "N/A"}</p>
                <p><strong>Diagnosis:</strong> {p.diagnosis || "N/A"}</p>
                <p><strong>Diet:</strong> {p.diet || "N/A"}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span className="text-xs text-muted-foreground">
                    Admitted: {new Date(p.admissionDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {patients.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">No inpatients found</div>
        )}
      </div>
    </div>
  );
}
