"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AddPatientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", dateOfBirth: "", gender: "male",
    phone: "", email: "", address: "", bloodGroup: "", patientType: "outpatient"
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) { toast.success("Patient added!"); router.push("/dashboard/patients"); }
      else { toast.error("Failed"); }
    } catch { toast.error("Error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/patients"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
        <h1 className="text-2xl font-bold">Add New Patient</h1>
      </div>
      <Card>
        <CardHeader><CardTitle>Patient Information</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>First Name *</Label><Input required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} /></div>
              <div><Label>Last Name *</Label><Input required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} /></div>
              <div><Label>Date of Birth *</Label><Input type="date" required value={form.dateOfBirth} onChange={e => setForm({...form, dateOfBirth: e.target.value})} /></div>
              <div><Label>Gender</Label><select aria-label="Select option" title="Select option" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} className="w-full p-2 border rounded-lg"><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
              <div><Label>Phone *</Label><Input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
              <div className="col-span-2"><Label>Address</Label><Input value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
              <div><Label>Blood Group</Label><select aria-label="Select option" title="Select option" value={form.bloodGroup} onChange={e => setForm({...form, bloodGroup: e.target.value})} className="w-full p-2 border rounded-lg"><option value="">Select</option><option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option></select></div>
              <div><Label>Patient Type</Label><select aria-label="Select option" title="Select option" value={form.patientType} onChange={e => setForm({...form, patientType: e.target.value})} className="w-full p-2 border rounded-lg"><option value="outpatient">Outpatient</option><option value="inpatient">Inpatient</option><option value="emergency">Emergency</option></select></div>
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <Link href="/dashboard/patients"><Button variant="outline" type="button">Cancel</Button></Link>
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Add Patient"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
