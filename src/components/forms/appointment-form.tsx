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
import { Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";

// FIXED: Make priority required, not optional with default
const appointmentFormSchema = z.object({
  patientId: z.number().min(1, "Patient is required"),
  doctorId: z.number().min(1, "Doctor is required"),
  departmentId: z.number().optional(),
  appointmentDate: z.string().min(1, "Date is required"),
  appointmentTime: z.string().min(1, "Time is required"),
  type: z.string().optional(),
  symptoms: z.string().optional(),
  notes: z.string().optional(),
  priority: z.string(), // FIXED: Required, not .default("normal")
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

interface AppointmentFormProps {
  appointment?: any;
  onSubmit: (data: AppointmentFormValues) => void;
  onClose: () => void;
}

export function AppointmentForm({ appointment, onSubmit, onClose }: AppointmentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState<any[]>([]); // FIXED
  const [doctors, setDoctors] = useState<any[]>([]); // FIXED

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientId: appointment?.patientId || 0,
      doctorId: appointment?.doctorId || 0,
      appointmentDate: appointment?.appointmentDate || new Date().toISOString().split('T')[0],
      appointmentTime: appointment?.appointmentTime || "09:00",
      type: appointment?.type || "consultation",
      priority: appointment?.priority || "normal", // FIXED: Always provide default
      symptoms: appointment?.symptoms || "",
      notes: appointment?.notes || "",
      departmentId: appointment?.departmentId || undefined,
    },
  });

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/patients?limit=100");
      const data = await response.json();
      if (Array.isArray(data)) setPatients(data);
    } catch (error) {
      console.error("Failed to fetch patients");
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/doctors");
      const data = await response.json();
      if (Array.isArray(data)) setDoctors(data.filter((d: any) => d.isActive));
    } catch (error) {
      console.error("Failed to fetch doctors");
    }
  };

  const handleSubmit = async (data: AppointmentFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      toast.error("Failed to save appointment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {appointment ? "Edit Appointment" : "Schedule Appointment"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Patient *</Label>
              <Select
                onValueChange={(value) => form.setValue("patientId", parseInt(value))}
                defaultValue={form.getValues("patientId")?.toString() || undefined}
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
                defaultValue={form.getValues("doctorId")?.toString() || undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((d: any) => (
                    <SelectItem key={d.id} value={d.id.toString()}>
                      Dr. {d.firstName} {d.lastName} - {d.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date *</Label>
              <Input type="date" {...form.register("appointmentDate")} />
            </div>

            <div className="space-y-2">
              <Label>Time *</Label>
              <Input type="time" {...form.register("appointmentTime")} />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                onValueChange={(value) => form.setValue("type", value)}
                defaultValue={form.getValues("type")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="follow_up">Follow-up</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="checkup">Regular Checkup</SelectItem>
                  <SelectItem value="surgery">Surgery</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                onValueChange={(value) => form.setValue("priority", value)}
                defaultValue={form.getValues("priority")}
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
          </div>

          <div className="space-y-2">
            <Label>Symptoms</Label>
            <Textarea {...form.register("symptoms")} rows={3} placeholder="Describe symptoms..." />
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea {...form.register("notes")} rows={2} placeholder="Additional notes..." />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {appointment ? "Update Appointment" : "Schedule Appointment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}