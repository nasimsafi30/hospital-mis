"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Trash2, FlaskConical, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const statusColors: any = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function LaboratoryPage() {
  const router = useRouter();
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patientId: "1", doctorId: "1", testName: "", category: "", priority: "normal" });

  useEffect(() => {
    if (!localStorage.getItem("token")) { router.push("/login"); return; }
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await fetch("/api/laboratory");
      const data = await res.json();
      setTests(Array.isArray(data) ? data : []);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/laboratory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, patientId: parseInt(form.patientId), doctorId: parseInt(form.doctorId) })
      });
      if (res.ok) { toast.success("Test added!"); setShowForm(false); fetchTests(); }
      else { toast.error("Failed"); }
    } catch { toast.error("Error"); }
  };

  const updateStatus = async (id: number, status: string, result?: string) => {
    const res = await fetch(`/api/laboratory/${id}/results`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result: result || "Completed", status })
    });
    if (res.ok) { toast.success("Updated!"); fetchTests(); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete?")) return;
    await fetch(`/api/laboratory/${id}`, { method: "DELETE" });
    toast.success("Deleted");
    fetchTests();
  };

  if (loading) return <div className="p-6 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" /></div>;

  const filtered = tests.filter((t: any) =>
    `${t.testName} ${t.patient?.firstName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-3xl font-bold">Laboratory</h1><p className="text-muted-foreground">{tests.length} tests</p></div>
        <Button onClick={() => setShowForm(true)} className="gap-2"><Plus className="h-4 w-4" />New Test</Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input title="Input field" placeholder="Search tests..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid gap-4">
        {filtered.map((test: any) => (
          <Card key={test.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <FlaskConical className="h-8 w-8 text-purple-500" />
                  <div>
                    <h3 className="font-semibold">{test.testName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Patient: {test.patient?.firstName} {test.patient?.lastName} | 
                      Doctor: Dr. {test.doctor?.firstName} {test.doctor?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{test.testNumber} | {format(new Date(test.createdAt), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={statusColors[test.status] || ""}>{test.status}</Badge>
                  {test.result && <span className="text-sm font-medium">{test.result} {test.unit}</span>}
                  {test.status === "pending" && (
                    <Button size="sm" onClick={() => updateStatus(test.id, "completed", "Normal")}>Complete</Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(test.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">New Lab Test</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input title="Input field" type="number" placeholder="Patient ID" value={form.patientId} onChange={e => setForm({...form, patientId: e.target.value})} required />
              <Input title="Input field" type="number" placeholder="Doctor ID" value={form.doctorId} onChange={e => setForm({...form, doctorId: e.target.value})} required />
              <Input title="Input field" placeholder="Test Name *" value={form.testName} onChange={e => setForm({...form, testName: e.target.value})} required />
              <Input title="Input field" placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
              <select aria-label="Select option" title="Select option" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="w-full p-2 border rounded-lg">
                <option value="normal">Normal</option><option value="urgent">Urgent</option><option value="stat">STAT</option>
              </select>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit">Add Test</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}