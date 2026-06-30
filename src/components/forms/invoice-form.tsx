"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Plus, Trash2, Receipt } from "lucide-react";
import { toast } from "sonner";

// FIXED: Make discount and tax required, not optional with default
const itemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity is required"),
  unitPrice: z.number().min(0, "Price is required"),
  total: z.number(),
  category: z.string(),
});

const invoiceSchema = z.object({
  patientId: z.number().min(1, "Patient is required"),
  billDate: z.string().min(1, "Date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  items: z.array(itemSchema).min(1, "At least one item is required"),
  discount: z.string(), // FIXED: Required, not .default("0")
  tax: z.string(), // FIXED: Required, not .default("0")
  description: z.string().optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface InvoiceFormProps {
  bill?: any;
  onSubmit: (data: InvoiceFormValues) => void;
  onClose: () => void;
}

export function InvoiceForm({ bill, onSubmit, onClose }: InvoiceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState<any[]>([]); // FIXED

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      patientId: bill?.patientId || 0,
      billDate: bill?.billDate || new Date().toISOString().split('T')[0],
      dueDate: bill?.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: bill?.items || [{ description: "", quantity: 1, unitPrice: 0, total: 0, category: "Consultation" }],
      discount: bill?.discount || "0", // FIXED: Always provide default
      tax: bill?.tax || "0", // FIXED: Always provide default
      description: bill?.description || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/patients?limit=200");
      const data = await response.json();
      if (Array.isArray(data)) setPatients(data);
    } catch (error) {
      console.error("Failed to fetch patients");
    }
  };

  const calculateTotal = () => {
    const items = form.watch("items") || [];
    const subtotal = items.reduce((sum, item) => sum + ((item.quantity || 0) * (item.unitPrice || 0)), 0);
    const discount = parseFloat(form.watch("discount") || "0");
    const tax = parseFloat(form.watch("tax") || "0");
    return (subtotal - discount + tax).toFixed(2);
  };

  const handleSubmit = async (data: InvoiceFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      toast.error("Failed to save invoice");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            {bill ? "Edit Invoice" : "Generate Invoice"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      {p.firstName} {p.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Bill Date *</Label>
              <Input type="date" {...form.register("billDate")} />
            </div>

            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Input type="date" {...form.register("dueDate")} />
            </div>
          </div>

          {/* Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Items *</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => append({ description: "", quantity: 1, unitPrice: 0, total: 0, category: "General" })}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 gap-2 items-end p-3 bg-muted rounded-lg">
                <div className="col-span-4 space-y-1">
                  <Label className="text-xs">Description</Label>
                  <Input {...form.register(`items.${index}.description`)} placeholder="Item description" />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Qty</Label>
                  <Input
                    type="number"
                    {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                    onChange={(e) => {
                      const qty = parseInt(e.target.value) || 0;
                      form.setValue(`items.${index}.quantity`, qty);
                      const price = form.getValues(`items.${index}.unitPrice`) || 0;
                      form.setValue(`items.${index}.total`, qty * price);
                    }}
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Unit Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...form.register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                    onChange={(e) => {
                      const price = parseFloat(e.target.value) || 0;
                      form.setValue(`items.${index}.unitPrice`, price);
                      const qty = form.getValues(`items.${index}.quantity`) || 0;
                      form.setValue(`items.${index}.total`, qty * price);
                    }}
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Total</Label>
                  <Input type="number" {...form.register(`items.${index}.total`)} readOnly className="bg-background" />
                </div>
                <div className="col-span-1 space-y-1">
                  <Label className="text-xs">Category</Label>
                  <Select
                    onValueChange={(value) => form.setValue(`items.${index}.category`, value)}
                    defaultValue={form.getValues(`items.${index}.category`)}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Consultation">Consultation</SelectItem>
                      <SelectItem value="Laboratory">Laboratory</SelectItem>
                      <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="Accommodation">Accommodation</SelectItem>
                      <SelectItem value="Procedure">Procedure</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Discount ($)</Label>
              <Input {...form.register("discount")} type="number" step="0.01" />
            </div>
            <div className="space-y-2">
              <Label>Tax ($)</Label>
              <Input {...form.register("tax")} type="number" step="0.01" />
            </div>
            <div className="space-y-2">
              <Label>Total Amount</Label>
              <div className="text-2xl font-bold">${calculateTotal()}</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input {...form.register("description")} placeholder="Additional notes..." />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {bill ? "Update Invoice" : "Generate Invoice"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}