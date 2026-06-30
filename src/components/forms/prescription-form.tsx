"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Pill } from "lucide-react";
import { toast } from "sonner";

const prescriptionSchema = z.object({
  medicineName: z.string().min(2, "Medicine name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  duration: z.string().min(1, "Duration is required"),
  instructions: z.string().optional(),
  quantity: z.number().min(1, "Quantity is required"),
  refills: z.number(),
});

type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

interface PrescriptionFormProps {
  onSubmit: (data: PrescriptionFormValues) => void;
  onClose: () => void;
}

export function PrescriptionForm({ onSubmit, onClose }: PrescriptionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  

  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      medicineName: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      quantity: 0,
      refills: 0,
    },
  });

  const handleSubmit = async (data: PrescriptionFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      toast.error("Failed to save prescription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Add Prescription
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Medicine Name *</Label>
            <Input {...form.register("medicineName")} placeholder="Paracetamol 500mg" />
            {form.formState.errors.medicineName && (
              <p className="text-sm text-red-500">{form.formState.errors.medicineName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Dosage *</Label>
              <Input {...form.register("dosage")} placeholder="500mg" />
            </div>
            <div className="space-y-2">
              <Label>Frequency *</Label>
              <Input {...form.register("frequency")} placeholder="Twice daily" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Duration *</Label>
              <Input {...form.register("duration")} placeholder="7 days" />
            </div>
            <div className="space-y-2">
              <Label>Quantity *</Label>
              <Input type="number" {...form.register("quantity", { valueAsNumber: true })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Refills</Label>
            <Input type="number" {...form.register("refills", { valueAsNumber: true })} defaultValue={0} />
          </div>

          <div className="space-y-2">
            <Label>Instructions</Label>
            <Textarea {...form.register("instructions")} rows={2} placeholder="Take after meals..." />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Prescription
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
