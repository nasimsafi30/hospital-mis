"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, UserMinus } from "lucide-react";
import { toast } from "sonner";

const dischargeSchema = z.object({
  notes: z.string().optional(),
});

type DischargeFormValues = z.infer<typeof dischargeSchema>;

interface DischargeFormProps {
  admissionId: number;
  patientName: string;
  onSubmit: (data: DischargeFormValues) => void;
  onClose: () => void;
}

export function DischargeForm({ admissionId, patientName, onSubmit, onClose }: DischargeFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<DischargeFormValues>({
    resolver: zodResolver(dischargeSchema),
    defaultValues: {
      notes: "",
    },
  });

  const handleSubmit = async (data: DischargeFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      toast.error("Failed to discharge patient");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserMinus className="h-5 w-5" />
            Discharge Patient
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-sm">
            Are you sure you want to discharge <strong>{patientName}</strong>?
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            This action will free up the bed and mark the admission as completed.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Discharge Notes</Label>
            <Textarea
              {...form.register("notes")}
              rows={4}
              placeholder="Enter discharge summary, follow-up instructions, etc..."
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Discharge
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}