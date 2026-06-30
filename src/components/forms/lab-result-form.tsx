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
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

const labResultSchema = z.object({
  result: z.string().min(1, "Result is required"),
  resultValue: z.number().optional(),
  resultNotes: z.string().optional(),
});

type LabResultFormValues = z.infer<typeof labResultSchema>;

interface LabResultFormProps {
  testId: number;
  testName: string;
  normalRange?: string;
  unit?: string;
  onSubmit: (data: LabResultFormValues) => void;
  onClose: () => void;
}

export function LabResultForm({ testId, testName, normalRange, unit, onSubmit, onClose }: LabResultFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  

  const form = useForm<LabResultFormValues>({
    resolver: zodResolver(labResultSchema),
  });

  const handleSubmit = async (data: LabResultFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      toast.error("Failed to upload results");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Lab Results
          </DialogTitle>
        </DialogHeader>

        <div className="p-3 bg-muted rounded-lg mb-4">
          <p className="font-medium">{testName}</p>
          {normalRange && (
            <p className="text-sm text-muted-foreground mt-1">
              Normal Range: {normalRange} {unit}
            </p>
          )}
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Result *</Label>
            <Input {...form.register("result")} placeholder="Normal / Abnormal / Value" />
          </div>

          <div className="space-y-2">
            <Label>Numeric Value {unit && `(${unit})`}</Label>
            <Input
              type="number"
              step="any"
              {...form.register("resultValue", { valueAsNumber: true })}
              placeholder="Enter numeric value"
            />
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea {...form.register("resultNotes")} rows={3} placeholder="Additional notes..." />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Results
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
