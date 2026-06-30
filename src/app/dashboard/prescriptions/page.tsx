"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Trash2, Pill, Calendar, User, Download, FileText } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function PrescriptionsPage() {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    patientId: "1", doctorId: "1", medicineName: "", dosage: "",
    frequency: "", duration: "", instructions: "", quantity: "30"
  });

  useEffect(() => {
    if (!localStorage.getItem("token")) { router.push("/login"); return; }
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await fetch("/api/prescriptions");
      const data = await res.json();
      setPrescriptions(Array.isArray(data) ? data : []);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: parseInt(form.patientId),
          doctorId: parseInt(form.doctorId),
          medicineName: form.medicineName,
          dosage: form.dosage,
          frequency: form.frequency,
          duration: form.duration,
          instructions: form.instructions,
          quantity: parseInt(form.quantity),
          startDate: new Date().toISOString().split('T')[0]
        })
      });
      
      if (res.ok) {
        toast.success("Prescription added!");
        setShowForm(false);
        setForm({ patientId: "1", doctorId: "1", medicineName: "", dosage: "", frequency: "", duration: "", instructions: "", quantity: "30" });
        fetchPrescriptions(); // Refresh the list
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to add");
      }
    } catch { toast.error("Failed to add"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this prescription?")) return;
    await fetch(`/api/prescriptions/${id}`, { method: "DELETE" });
    toast.success("Deleted");
    fetchPrescriptions();
  };

  const handleDownloadPDF = async (id: number) => {
    try {
      const res = await fetch(`/api/prescriptions/${id}/pdf`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `prescription-${id}.pdf`;
        a.click();
      } else {
        // Fallback: print simple version
        const rx = prescriptions.find(p => p.id === id);
        if (rx) printPrescription(rx);
      }
    } catch {
      const rx = prescriptions.find(p => p.id === id);
      if (rx) printPrescription(rx);
    }
  };

  const printPrescription = (rx: any) => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html><head><title>Prescription</title>
      <style>body{font-family:Arial;padding:40px}h1{color:#059669}.info{margin:10px 0}@media print{button{display:none}}</style>
      </head><body>
      <h1>💊 Prescription</h1>
      <p><b>Rx #:</b> ${rx.prescriptionNumber}</p>
      <p><b>Patient:</b> ${rx.patient?.firstName} ${rx.patient?.lastName}</p>
      <p><b>Doctor:</b> Dr. ${rx.doctor?.firstName} ${rx.doctor?.lastName}</p>
      <p><b>Date:</b> ${format(new Date(rx.startDate), 'MMM dd, yyyy')}</p>
      <hr/>
      <h2>${rx.medicineName}</h2>
      <p><b>Dosage:</b> ${rx.dosage}</p>
      <p><b>Frequency:</b> ${rx.frequency}</p>
      <p><b>Duration:</b> ${rx.duration}</p>
      <p><b>Quantity:</b> ${rx.quantity}</p>
      <p><b>Instructions:</b> ${rx.instructions || 'N/A'}</p>
      <br/><button onclick="window.print()">Print</button>
      </body></html>
    `);
    w.document.close();
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>;

  const filtered = prescriptions.filter((p: any) =>
    `${p.medicineName} ${p.patient?.firstName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Prescriptions</h1>
          <p className="text-muted-foreground">Total: {prescriptions.length}</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Prescription
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input title="Input field" placeholder="Search..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((rx: any) => (
          <Card key={rx.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Pill className="h-5 w-5 text-green-500" />{rx.medicineName}
                  </CardTitle>
                  <Badge variant="outline" className="mt-1">{rx.prescriptionNumber}</Badge>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleDownloadPDF(rx.id)} title="Download PDF">
                    <Download className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(rx.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Dosage:</strong> {rx.dosage}</p>
              <p><strong>Frequency:</strong> {rx.frequency}</p>
              <p><strong>Duration:</strong> {rx.duration}</p>
              <p><strong>Qty:</strong> {rx.quantity}</p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-3 w-3" />{rx.patient?.firstName} {rx.patient?.lastName}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-3 w-3" />{rx.startDate ? format(new Date(rx.startDate), 'MMM dd, yyyy') : 'N/A'}
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">No prescriptions found</div>
        )}
      </div>

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Add Prescription</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium">Patient ID</label>
                  <Input title="Input field" type="number" value={form.patientId} onChange={e => setForm({...form, patientId: e.target.value})} required />
                </div>
                <div>
                  <label className="text-xs font-medium">Doctor ID</label>
                  <Input title="Input field" type="number" value={form.doctorId} onChange={e => setForm({...form, doctorId: e.target.value})} required />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium">Medicine Name</label>
                <Input title="Input field" placeholder="e.g. Paracetamol 500mg" value={form.medicineName} onChange={e => setForm({...form, medicineName: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium">Dosage</label>
                  <Input title="Input field" placeholder="e.g. 500mg" value={form.dosage} onChange={e => setForm({...form, dosage: e.target.value})} required />
                </div>
                <div>
                  <label className="text-xs font-medium">Frequency</label>
                  <Input title="Input field" placeholder="e.g. Twice daily" value={form.frequency} onChange={e => setForm({...form, frequency: e.target.value})} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium">Duration</label>
                  <Input title="Input field" placeholder="e.g. 7 days" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} required />
                </div>
                <div>
                  <label className="text-xs font-medium">Quantity</label>
                  <Input title="Input field" type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium">Instructions</label>
                <Input title="Input field" placeholder="e.g. Take after meals" value={form.instructions} onChange={e => setForm({...form, instructions: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Add Prescription"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}