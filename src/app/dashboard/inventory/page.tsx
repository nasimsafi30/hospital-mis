"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Trash2, FlaskConical } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function LaboratoryPage() {
  const router = useRouter();
  const [tests, setTests] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [patientId, setPatientId] = useState("1");
  const [doctorId, setDoctorId] = useState("1");
  const [testName, setTestName] = useState("");
  const [category, setCategory] = useState("");

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

  const handleAddTest = async () => {
    if (!testName) { toast.error("Enter test name"); return; }
    
    try {
      const res = await fetch("/api/laboratory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: parseInt(patientId),
          doctorId: parseInt(doctorId),
          testName: testName,
          category: category
        })
      });
      
      if (res.ok) {
        toast.success("Test requested!");
        setShowForm(false);
        setTestName("");
        setCategory("");
        fetchTests();
      } else {
        toast.error("Failed to create test");
      }
    } catch { toast.error("Error"); }
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

  const statusColors: any = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-3xl font-bold">Laboratory</h1><p className="text-muted-foreground">{tests.length} tests</p></div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />New Test Request
        </Button>
      </div>

      {/* Add Test Form */}
      {showForm && (
        <Card className="mb-6 border-2 border-purple-300">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-lg">New Lab Test Request</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium">Patient ID</label>
                <Input title="Input field" type="number" value={patientId} onChange={e => setPatientId(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium">Doctor ID</label>
                <Input title="Input field" type="number" value={doctorId} onChange={e => setDoctorId(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium">Test Name *</label>
              <Input title="Input field" placeholder="e.g. Complete Blood Count (CBC)" value={testName} onChange={e => setTestName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium">Category</label>
              <Input title="Input field" placeholder="e.g. Hematology" value={category} onChange={e => setCategory(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddTest} className="flex-1">Submit Request</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

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
                    <p className="text-xs text-muted-foreground">{test.testNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={statusColors[test.status] || ""}>{test.status}</Badge>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(test.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <FlaskConical className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No lab tests found</p>
          </div>
        )}
      </div>
    </div>
  );
}