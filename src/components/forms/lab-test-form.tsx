"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, FlaskConical } from "lucide-react";
import { toast } from "sonner";

const labTestSchema = z.object({
  patientId: z.number().min(1, "Patient is required"),
  doctorId: z.number().min(1, "Doctor is required"),
  testName: z.string().min(2, "Test name is required"),
  category: z.string().optional(),
  priority: z.enum(['normal', 'urgent', 'stat']),
  instructions: z.string().optional(),
});

type LabTestFormValues = z.infer<typeof labTestSchema>;

interface LabTestFormProps {
  onSubmit: (data: LabTestFormValues) => void;
  onClose: () => void;
}

const commonTests = [
  "Complete Blood Count (CBC)",
  "Basic Metabolic Panel (BMP)",
  "Lipid Panel",
  "Liver Function Test",
  "Thyroid Function Test",
  "Hemoglobin A1c",
  "Urinalysis",
  "Blood Culture",
  "Chest X-Ray",
  "ECG/EKG",
  "MRI Brain",
  "CT Scan",
  "D-Dimer",
  "Troponin I",
  "Vitamin D Test",
  "COVID-19 PCR Test",
  "Stool Analysis",
  "PT/INR",
  "Arterial Blood Gas",
  "Cardiac Enzyme Panel",
];

export function LabTestForm({ onSubmit, onClose }: LabTestFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  const form = useForm<LabTestFormValues>({
    resolver: zodResolver(labTestSchema),
    defaultValues: {
      patientId: 0,
      doctorId: 0,
      testName: "",
      category: "",
      priority: "normal",
      instructions: "",
    },
  });

  useEffect(() => {
    fetch("/api/patients?limit=200")
      .then(r => r.json())
      .then(setPatients)
      .catch(() => {});
    
    fetch("/api/doctors")
      .then(r => r.json())
      .then((d: any[]) => setDoctors(Array.isArray(d) ? d.filter((x: any) => x.isActive) : []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (data: LabTestFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      toast.error("Failed to create lab test");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5" />
            New Lab Test Request
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Patient *</Label>
              <Select onValueChange={(v) => form.setValue("patientId", parseInt(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p: any) => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {p.firstName} {p.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.patientId && (
                <p className="text-sm text-red-500">{form.formState.errors.patientId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Doctor *</Label>
              <Select onValueChange={(v) => form.setValue("doctorId", parseInt(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((d: any) => (
                    <SelectItem key={d.id} value={d.id.toString()}>
                      Dr. {d.firstName} {d.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.doctorId && (
                <p className="text-sm text-red-500">{form.formState.errors.doctorId.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Test Name *</Label>
            <Select onValueChange={(v) => form.setValue("testName", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select test" />
              </SelectTrigger>
              <SelectContent>
                {commonTests.map((test) => (
                  <SelectItem key={test} value={test}>{test}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.testName && (
              <p className="text-sm text-red-500">{form.formState.errors.testName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Input {...form.register("category")} placeholder="Hematology, Chemistry, Microbiology, etc." />
          </div>

          <div className="space-y-2">
            <Label>Priority *</Label>
            <Select
              onValueChange={(v: 'normal' | 'urgent' | 'stat') => form.setValue("priority", v)}
              defaultValue="normal"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="stat">STAT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Instructions</Label>
            <Textarea
              {...form.register("instructions")}
              rows={2}
              placeholder="Special instructions for sample collection, handling, etc..."
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Request Test
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}