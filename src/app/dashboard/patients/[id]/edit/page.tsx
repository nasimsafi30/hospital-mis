"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function EditPatientPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/patients/${params.id}`).then(r => r.json()).then(setForm);
  }, [params.id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/patients/${params.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form)
      });
      if (res.ok) { toast.success("Updated!"); router.push("/dashboard/patients"); }
    } catch { toast.error("Error"); }
    finally { setLoading(false); }
  };

  if (!form) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/patients"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
        <h1 className="text-2xl font-bold">Edit Patient</h1>
      </div>
      <Card>
        <CardHeader><CardTitle>{form.firstName} {form.lastName}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>First Name</Label><Input title="Input field" value={form.firstName || ""} onChange={e => setForm({...form, firstName: e.target.value})} /></div>
              <div><Label>Last Name</Label><Input title="Input field" value={form.lastName || ""} onChange={e => setForm({...form, lastName: e.target.value})} /></div>
              <div><Label>Phone</Label><Input title="Input field" value={form.phone || ""} onChange={e => setForm({...form, phone: e.target.value})} /></div>
              <div><Label>Email</Label><Input title="Input field" value={form.email || ""} onChange={e => setForm({...form, email: e.target.value})} /></div>
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <Link href="/dashboard/patients"><Button variant="outline" type="button">Cancel</Button></Link>
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Update Patient"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}