"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({ quantity: z.number().min(1), notes: z.string().optional() });
type FormValues = z.infer<typeof schema>;

interface Props { medicine: { id: number; itemName: string; quantity: number; unit: string }; onSubmit: (data: FormValues) => void; onClose: () => void; }

export function DispenseForm({ medicine, onSubmit, onClose }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { quantity: 1 } });

  const handleSubmit = async (data: FormValues) => {
    if (data.quantity > medicine.quantity) { toast.error("Insufficient stock"); return; }
    setIsLoading(true); try { await onSubmit(data); onClose(); } catch { toast.error("Failed"); } finally { setIsLoading(false); }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" />Dispense</DialogTitle></DialogHeader>
        <div className="p-3 bg-muted rounded-lg"><p className="font-medium">{medicine.itemName}</p><p className="text-sm text-muted-foreground">Available: {medicine.quantity} {medicine.unit}</p></div>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2"><Label>Quantity *</Label><Input type="number" {...form.register("quantity", { valueAsNumber: true })} max={medicine.quantity} /></div>
          <div className="space-y-2"><Label>Notes</Label><Input {...form.register("notes")} /></div>
          <div className="flex justify-end gap-4"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit" disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Dispense</Button></div>
        </form>
      </DialogContent>
    </Dialog>
  );
}