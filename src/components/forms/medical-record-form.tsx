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
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, FileText } from "lucide-react";
import { toast } from "sonner";

const recordFormSchema = z.object({
  patientId: z.number().min(1, "Patient is required"),
  doctorId: z.number().min(1, "Doctor is required"),
  diagnosis: z.string().optional(),
  symptoms: z.string().optional(),
  prescription: z.string().optional(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
  followUpDate: z.string().optional(),
  isConfidential: z.boolean(),
});

type RecordFormValues = z.infer<typeof recordFormSchema>;

interface MedicalRecordFormProps {
  record?: any;
  onSubmit: (data: RecordFormValues) => void;
  onClose: () => void;
}

export function MedicalRecordForm({ record, onSubmit, onClose }: MedicalRecordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  

  const form = useForm<RecordFormValues>({
    resolver: zodResolver(recordFormSchema),
    defaultValues: record || {
      patientId: 0,
      doctorId: 0,
      isConfidential: false,
    },
  });

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/patients?limit=200");
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Failed to fetch patients");
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/doctors");
      const data = await response.json();
      setDoctors(data.filter((d: any) => d.isActive));
    } catch (error) {
      console.error("Failed to fetch doctors");
    }
  };

  const handleSubmit = async (data: RecordFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      toast.error("Failed to save medical record");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {record ? "Edit Medical Record" : "New Medical Record"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Patient *</Label>
              <Select
                onValueChange={(value) => form.setValue("patientId", parseInt(value))}
                defaultValue={form.getValues("patientId")?.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p: any) => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {p.firstName} {p.lastName} ({p.patientId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Doctor *</Label>
              <Select
                onValueChange={(value) => form.setValue("doctorId", parseInt(value))}
                defaultValue={form.getValues("doctorId")?.toString()}
              >
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
            </div>
          </div>

          <div className="space-y-2">
            <Label>Diagnosis</Label>
            <Textarea {...form.register("diagnosis")} rows={2} placeholder="Enter diagnosis..." />
          </div>

          <div className="space-y-2">
            <Label>Symptoms</Label>
            <Textarea {...form.register("symptoms")} rows={2} placeholder="Describe symptoms..." />
          </div>

          <div className="space-y-2">
            <Label>Prescription</Label>
            <Textarea {...form.register("prescription")} rows={2} placeholder="Prescribed medications..." />
          </div>

          <div className="space-y-2">
            <Label>Treatment Plan</Label>
            <Textarea {...form.register("treatment")} rows={2} placeholder="Treatment plan..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Follow-up Date</Label>
              <Input type="date" {...form.register("followUpDate")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea {...form.register("notes")} rows={2} placeholder="Additional notes..." />
          </div>

          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <div className="space-y-0.5">
              <Label>Confidential Record</Label>
              <p className="text-sm text-muted-foreground">Mark as confidential if contains sensitive information</p>
            </div>
            <Switch
              checked={form.watch("isConfidential")}
              onCheckedChange={(checked) => form.setValue("isConfidential", checked)}
              className="ml-auto"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {record ? "Update Record" : "Create Record"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
