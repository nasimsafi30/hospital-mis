"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Package } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  itemName: z.string().min(2), category: z.string(), quantity: z.number().min(0),
  unit: z.string(), unitPrice: z.string(), supplier: z.string().optional(),
  reorderLevel: z.number(), expiryDate: z.string().optional(),
  batchNumber: z.string().optional(), location: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props { item?: any; onSubmit: (data: FormValues) => void; onClose: () => void; }

export function InventoryForm({ item, onSubmit, onClose }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: item || { quantity: 0, reorderLevel: 10, unitPrice: "", category: "Medicine", unit: "pieces" } });

  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true); try { await onSubmit(data); onClose(); } catch { toast.error("Failed"); } finally { setIsLoading(false); }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><Package className="h-5 w-5" />{item ? "Edit Item" : "Add Item"}</DialogTitle></DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2"><Label>Name *</Label><Input {...form.register("itemName")} /></div>
            <div className="space-y-2"><Label>Category</Label><Select onValueChange={v => form.setValue("category", v)} defaultValue={form.getValues("category")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Medicine">Medicine</SelectItem><SelectItem value="Supplies">Supplies</SelectItem><SelectItem value="Equipment">Equipment</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Unit</Label><Input {...form.register("unit")} /></div>
            <div className="space-y-2"><Label>Quantity</Label><Input type="number" {...form.register("quantity", { valueAsNumber: true })} /></div>
            <div className="space-y-2"><Label>Price ($)</Label><Input {...form.register("unitPrice")} /></div>
            <div className="space-y-2"><Label>Reorder Level</Label><Input type="number" {...form.register("reorderLevel", { valueAsNumber: true })} /></div>
            <div className="space-y-2"><Label>Supplier</Label><Input {...form.register("supplier")} /></div>
            <div className="space-y-2"><Label>Batch</Label><Input {...form.register("batchNumber")} /></div>
            <div className="space-y-2"><Label>Expiry</Label><Input type="date" {...form.register("expiryDate")} /></div>
            <div className="space-y-2"><Label>Location</Label><Input {...form.register("location")} /></div>
          </div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{item ? "Update" : "Add"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}