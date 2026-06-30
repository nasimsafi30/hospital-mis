"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) { router.push("/login"); return; }
    setUser(JSON.parse(u));
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await fetch("/api/patients");
      const data = await res.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch (e) { toast.error("Failed to load patients"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this patient?")) return;
    try {
      await fetch(`/api/patients/${id}`, { method: "DELETE" });
      toast.success("Patient deleted");
      fetchPatients();
    } catch { toast.error("Failed to delete"); }
  };

  const handleAdd = () => router.push("/dashboard/patients/new");
  const handleEdit = (id: number) => router.push(`/dashboard/patients/${id}/edit`);

  if (loading) return <div className="p-6">Loading...</div>;

  const filtered = patients.filter((p: any) => 
    `${p.firstName} ${p.lastName} ${p.patientId}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Patients</h1>
          <p className="text-muted-foreground">Total: {patients.length}</p>
        </div>
        <Link href="/dashboard/patients/new">
          <Button className="gap-2"><Plus className="h-4 w-4" />Add Patient</Button>
        </Link>
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
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(p.id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm"><strong>Phone:</strong> {p.phone}</p>
              <p className="text-sm"><strong>Gender:</strong> {p.gender}</p>
              <p className="text-sm"><strong>Blood:</strong> {p.bloodGroup || "N/A"}</p>
              <Badge className="mt-2">{p.patientType}</Badge>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">No patients found</div>
        )}
      </div>
    </div>
  );
}
