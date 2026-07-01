"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface FinanceFormProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export function FinanceForm({ onSubmit, onClose }: FinanceFormProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    type: "income",
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
  });

  const incomeCategories = ["Consultation", "Pharmacy", "Laboratory", "Room Charges", "Procedure", "Other Income"];
  const expenseCategories = ["Salaries", "Supplies", "Equipment", "Utilities", "Maintenance", "Insurance", "Other Expense"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.amount || !form.category) {
      toast.error("Please fill all required fields");
      return;
    }

    if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...form,
        amount: parseFloat(form.amount),
      });
      onClose();
    } catch {
      toast.error("Failed to save transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Add Transaction
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selection */}
          <div>
            <Label>Transaction Type *</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => setForm({ ...form, type: "income", category: "" })}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  form.type === "income"
                    ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                💰 Income
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, type: "expense", category: "" })}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  form.type === "expense"
                    ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    : "border-gray-200 hover:border-red-300"
                }`}
              >
                💸 Expense
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <Label>Category *</Label>
            <select aria-label="Select option" title="Select option"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full p-2.5 border rounded-lg bg-background mt-1"
              required
            >
              <option value="">Select category</option>
              {(form.type === "income" ? incomeCategories : expenseCategories).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <Label>Amount ($) *</Label>
            <div className="relative mt-1">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Input
              placeholder="Optional description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1"
            />
          </div>

          {/* Date */}
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="mt-1"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}