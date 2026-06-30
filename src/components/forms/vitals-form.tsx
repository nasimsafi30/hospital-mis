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
import { Loader2, Activity } from "lucide-react";
import { toast } from "sonner";

const vitalsSchema = z.object({
  temperature: z.number().optional(),
  heartRate: z.number().optional(),
  bloodPressureSystolic: z.number().optional(),
  bloodPressureDiastolic: z.number().optional(),
  oxygenLevel: z.number().optional(),
  respiratoryRate: z.number().optional(),
  bloodSugar: z.number().optional(),
  notes: z.string().optional(),
});

type VitalsFormValues = z.infer<typeof vitalsSchema>;

interface VitalsFormProps {
  admissionId: number;
  onSubmit: (data: VitalsFormValues) => void;
  onClose: () => void;
}

export function VitalsForm({ admissionId, onSubmit, onClose }: VitalsFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<VitalsFormValues>({
    resolver: zodResolver(vitalsSchema),
    defaultValues: {
      temperature: undefined,
      heartRate: undefined,
      bloodPressureSystolic: undefined,
      bloodPressureDiastolic: undefined,
      oxygenLevel: undefined,
      respiratoryRate: undefined,
      bloodSugar: undefined,
      notes: "",
    },
  });

  const handleSubmit = async (data: VitalsFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      toast.error("Failed to record vitals");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Record Vitals
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Temperature (°F)</Label>
              <Input type="number" step="0.1" {...form.register("temperature", { valueAsNumber: true })} placeholder="98.6" />
            </div>
            <div className="space-y-2">
              <Label>Heart Rate (bpm)</Label>
              <Input type="number" {...form.register("heartRate", { valueAsNumber: true })} placeholder="72" />
            </div>
            <div className="space-y-2">
              <Label>Blood Pressure (Systolic)</Label>
              <Input type="number" {...form.register("bloodPressureSystolic", { valueAsNumber: true })} placeholder="120" />
            </div>
            <div className="space-y-2">
              <Label>Blood Pressure (Diastolic)</Label>
              <Input type="number" {...form.register("bloodPressureDiastolic", { valueAsNumber: true })} placeholder="80" />
            </div>
            <div className="space-y-2">
              <Label>Oxygen Level (%)</Label>
              <Input type="number" step="0.1" {...form.register("oxygenLevel", { valueAsNumber: true })} placeholder="98" />
            </div>
            <div className="space-y-2">
              <Label>Respiratory Rate</Label>
              <Input type="number" {...form.register("respiratoryRate", { valueAsNumber: true })} placeholder="16" />
            </div>
            <div className="space-y-2">
              <Label>Blood Sugar (mg/dL)</Label>
              <Input type="number" step="0.1" {...form.register("bloodSugar", { valueAsNumber: true })} placeholder="100" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea {...form.register("notes")} rows={2} placeholder="Additional observations..." />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Vitals
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}