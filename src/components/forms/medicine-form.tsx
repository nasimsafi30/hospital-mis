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

const medicineSchema = z.object({
  itemName: z.string().min(2, "Medicine name is required"),
  category: z.string(),
  description: z.string().optional(),
  quantity: z.number().min(0),
  unit: z.string(),
  unitPrice: z.string().min(1, "Price is required"),
  supplier: z.string().optional(),
  reorderLevel: z.number(),
  expiryDate: z.string().optional(),
  batchNumber: z.string().optional(),
  location: z.string().optional(),
});

type MedicineFormValues = z.infer<typeof medicineSchema>;

interface MedicineFormProps {
  medicine?: any;
  onSubmit: (data: MedicineFormValues) => void;
  onClose: () => void;
}

export function MedicineForm({ medicine, onSubmit, onClose }: MedicineFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<MedicineFormValues>({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      itemName: medicine?.itemName || "",
      category: medicine?.category || "Medicine",
      description: medicine?.description || "",
      quantity: medicine?.quantity || 0,
      unit: medicine?.unit || "tablets",
      unitPrice: medicine?.unitPrice || "",
      supplier: medicine?.supplier || "",
      reorderLevel: medicine?.reorderLevel || 10,
      expiryDate: medicine?.expiryDate || "",
      batchNumber: medicine?.batchNumber || "",
      location: medicine?.location || "",
    },
  });

  const handleSubmit = async (data: MedicineFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      toast.error("Failed to save medicine");
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
            {medicine ? "Edit Medicine" : "Add Medicine"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Medicine Name *</Label>
            <Input {...form.register("itemName")} placeholder="Paracetamol 500mg" />
            {form.formState.errors.itemName && (
              <p className="text-sm text-red-500">{form.formState.errors.itemName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Quantity *</Label>
              <Input type="number" {...form.register("quantity", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label>Unit *</Label>
              <Input {...form.register("unit")} placeholder="tablets, bottles, etc." />
            </div>
            <div className="space-y-2">
              <Label>Unit Price ($) *</Label>
              <Input {...form.register("unitPrice")} placeholder="0.50" />
            </div>
            <div className="space-y-2">
              <Label>Reorder Level</Label>
              <Input type="number" {...form.register("reorderLevel", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label>Batch Number</Label>
              <Input {...form.register("batchNumber")} />
            </div>
            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <Input type="date" {...form.register("expiryDate")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Supplier</Label>
            <Input {...form.register("supplier")} placeholder="Supplier name" />
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input {...form.register("location")} placeholder="Shelf A-1" />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea {...form.register("description")} rows={2} placeholder="Description..." />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {medicine ? "Update" : "Add Medicine"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}