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
import { Loader2, DollarSign } from "lucide-react";
import { toast } from "sonner";

const paymentSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  method: z.string().min(1, "Payment method is required"),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  billId: number;
  totalAmount: string;
  paidAmount: string;
  onSubmit: (data: PaymentFormValues) => void;
  onClose: () => void;
}

export function PaymentForm({ billId, totalAmount, paidAmount, onSubmit, onClose }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  

  const remainingAmount = (parseFloat(totalAmount) - parseFloat(paidAmount)).toFixed(2);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: remainingAmount,
      method: "cash",
      referenceNumber: "",
      notes: "",
    },
  });

  const handleSubmit = async (data: PaymentFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      toast.error("Payment processing failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Record Payment
          </DialogTitle>
        </DialogHeader>

        <div className="p-3 bg-muted rounded-lg mb-4">
          <div className="flex justify-between text-sm">
            <span>Total Amount:</span>
            <span className="font-semibold">${totalAmount}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>Already Paid:</span>
            <span className="font-semibold text-green-600">${paidAmount}</span>
          </div>
          <div className="flex justify-between text-sm mt-1 pt-2 border-t">
            <span>Remaining:</span>
            <span className="font-semibold text-red-600">${remainingAmount}</span>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Amount *</Label>
            <Input {...form.register("amount")} type="number" step="0.01" />
          </div>

          <div className="space-y-2">
            <Label>Payment Method *</Label>
            <Select
              onValueChange={(value) => form.setValue("method", value)}
              defaultValue={form.getValues("method")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="online">Online Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Reference Number</Label>
            <Input {...form.register("referenceNumber")} placeholder="Optional reference" />
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Input {...form.register("notes")} placeholder="Payment notes..." />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Process Payment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
