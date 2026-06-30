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
import { Loader2, BedDouble } from "lucide-react";
import { toast } from "sonner";

const admissionSchema = z.object({
  patientId: z.number().min(1, "Patient is required"),
  doctorId: z.number().min(1, "Doctor is required"),
  roomId: z.number().optional(),
  bedId: z.number().optional(),
  diagnosis: z.string().optional(),
  notes: z.string().optional(),
  diet: z.string().optional(),
  precautions: z.array(z.string()).optional(),
});

type AdmissionFormValues = z.infer<typeof admissionSchema>;

interface AdmissionFormProps {
  onSubmit: (data: AdmissionFormValues) => void;
  onClose: () => void;
}

export function AdmissionForm({ onSubmit, onClose }: AdmissionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);

  const form = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      patientId: 0,
      doctorId: 0,
      diagnosis: "",
      notes: "",
      diet: "Regular",
    },
  });

  useEffect(() => {
    fetch("/api/patients?limit=200").then(r => r.json()).then(setPatients).catch(() => {});
    fetch("/api/doctors").then(r => r.json()).then((d: any[]) => setDoctors(Array.isArray(d) ? d.filter((x: any) => x.isActive) : [])).catch(() => {});
    fetch("/api/rooms").then(r => r.json()).then(setRooms).catch(() => {});
  }, []);

  const handleSubmit = async (data: AdmissionFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      toast.error("Failed to admit patient");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BedDouble className="h-5 w-5" />
            Admit Patient
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

            <div className="space-y-2">
              <Label>Room</Label>
              <Select onValueChange={(v) => form.setValue("roomId", parseInt(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.filter((r: any) => r.isActive && !r.isOccupied).map((r: any) => (
                    <SelectItem key={r.id} value={r.id.toString()}>
                      Room {r.roomNumber} ({r.roomType?.replace('_', ' ')})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Bed Number</Label>
              <Input type="number" {...form.register("bedId", { valueAsNumber: true })} placeholder="Bed ID" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Diagnosis</Label>
            <Textarea {...form.register("diagnosis")} rows={2} placeholder="Enter diagnosis..." />
          </div>

          <div className="space-y-2">
            <Label>Diet</Label>
            <Select onValueChange={(v) => form.setValue("diet", v)} defaultValue="Regular">
              <SelectTrigger>
                <SelectValue placeholder="Select diet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Regular">Regular</SelectItem>
                <SelectItem value="Low Sodium">Low Sodium</SelectItem>
                <SelectItem value="Diabetic">Diabetic</SelectItem>
                <SelectItem value="Soft">Soft</SelectItem>
                <SelectItem value="Liquid">Liquid</SelectItem>
                <SelectItem value="NPO">NPO</SelectItem>
              </SelectContent>
            </Select>
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
              Admit Patient
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}