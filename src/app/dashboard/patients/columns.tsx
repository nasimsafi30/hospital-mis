"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search, QrCode } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [qrPatient, setQrPatient] = useState<any>(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) { router.push("/login"); return; }
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await fetch("/api/patients");
      const data = await res.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete?")) return;
    await fetch(`/api/patients/${id}`, { method: "DELETE" });
    toast.success("Deleted");
    fetchPatients();
  };

  if (loading) return <div className="p-6 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" /></div>;

  const filtered = patients.filter((p: any) =>
    `${p.firstName} ${p.lastName} ${p.patientId}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-3xl font-bold">Patients</h1><p className="text-muted-foreground">{patients.length} patients</p></div>
        <Link href="/dashboard/patients/new"><Button className="gap-2"><Plus className="h-4 w-4" />Add Patient</Button></Link>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input title="Input field" placeholder="Search patients..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p: any) => (
          <Card key={p.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{p.firstName} {p.lastName}</CardTitle>
                  <Badge variant="outline" className="mt-1">{p.patientId}</Badge>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setQrPatient(p)} title="QR Code">
                    <QrCode className="h-4 w-4" />
                  </Button>
                  <Link href={`/dashboard/patients/${p.id}/edit`}>
                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p><strong>Phone:</strong> {p.phone}</p>
              <p><strong>Gender:</strong> {p.gender} | <strong>Blood:</strong> {p.bloodGroup || 'N/A'}</p>
              <Badge className="mt-2">{p.patientType || 'outpatient'}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* QR Modal */}
      {qrPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setQrPatient(null)}>
          <div className="bg-white dark:bg-card rounded-2xl p-8 text-center shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold">{qrPatient.firstName} {qrPatient.lastName}</h2>
            <p className="text-sm text-muted-foreground mb-4">{qrPatient.patientId}</p>
            <div className="bg-white p-4 rounded-xl inline-block">
              <QRCodeSVG value={JSON.stringify({
                id: qrPatient.id, name: `${qrPatient.firstName} ${qrPatient.lastName}`,
                patientId: qrPatient.patientId, blood: qrPatient.bloodGroup, phone: qrPatient.phone
              })} size={200} level="H" />
            </div>
            <div className="mt-4 text-sm space-y-1">
              <p><strong>Blood:</strong> {qrPatient.bloodGroup || 'N/A'}</p>
              <p><strong>Phone:</strong> {qrPatient.phone}</p>
              <p><strong>Gender:</strong> {qrPatient.gender}</p>
            </div>
            <div className="flex gap-2 justify-center mt-4">
              <Button onClick={() => window.print()}>🖨️ Print QR</Button>
              <Button variant="outline" onClick={() => setQrPatient(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}