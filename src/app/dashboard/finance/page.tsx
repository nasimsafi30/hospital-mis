"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, DollarSign, TrendingUp, TrendingDown, Download, ArrowUpRight, ArrowDownRight, Clock, Pencil, Trash2, X, Check, Loader2 } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { toast } from "sonner";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#FF6B6B"];

// ==================== TYPE DEFINITIONS ====================
interface Transaction {
  id: number;
  type: 'income' | 'expense';
  category: string;
  amount: string | number;
  description: string;
  date: string;
  status?: string;
}

interface FormData {
  type: 'income' | 'expense';
  category: string;
  amount: string;
  description: string;
  date: string;
}

// ==================== HELPER FUNCTIONS ====================
const parseAmount = (amount: string | number): number => {
  if (typeof amount === 'number') return amount;
  return parseFloat(amount) || 0;
};

const formatCurrency = (amount: number): string => {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// ==================== MAIN COMPONENT ====================
export default function FinancePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>({
    type: "income",
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (!localStorage.getItem("token")) { 
      router.push("/login"); 
      return; 
    }
    fetchTransactions();
  }, [router]);

  // FETCH from API/Database
  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/finance");
      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  // ADD or UPDATE transaction
  const handleSave = async () => {
    if (!form.amount || !form.category) {
      toast.error("Fill required fields");
      return;
    }
    if (saving) return;
    
    setSaving(true);
    try {
      const url = editingId ? `/api/finance?id=${editingId}` : "/api/finance";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: parseFloat(form.amount),
        }),
      });

      if (res.ok) {
        toast.success(editingId ? "Transaction updated!" : "Transaction added!");
        resetForm();
        fetchTransactions();
      } else {
        toast.error("Failed to save");
      }
    } catch {
      toast.error("Error");
    } finally {
      setSaving(false);
    }
  };

  // DELETE transaction
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this transaction?")) return;
    try {
      const res = await fetch(`/api/finance?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted");
        fetchTransactions();
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Error");
    }
  };

  // EDIT - populate form
  const handleEdit = (t: Transaction) => {
    setEditingId(t.id);
    setForm({
      type: t.type,
      category: t.category,
      amount: parseAmount(t.amount).toString(),
      description: t.description || "",
      date: t.date || new Date().toISOString().split('T')[0],
    });
    setShowForm(true);
  };

  // CANCEL - reset form
  const handleCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setForm({
      type: "income",
      category: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split('T')[0]
    });
  };

  // ✅ FIXED: Use parseAmount helper to safely parse amounts
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + parseAmount(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + parseAmount(t.amount), 0);

  const balance = totalIncome - totalExpense;

  const monthlyData = [
    { month: "Jan", income: 45000, expense: 32000 },
    { month: "Feb", income: 52000, expense: 38000 },
    { month: "Mar", income: 48000, expense: 35000 },
    { month: "Apr", income: 61000, expense: 42000 },
    { month: "May", income: 55000, expense: 40000 },
    { month: "Jun", income: 67000, expense: 45000 },
  ];

  const expenseCategories = [
    { name: "Salaries", value: 40 },
    { name: "Supplies", value: 25 },
    { name: "Equipment", value: 15 },
    { name: "Utilities", value: 12 },
    { name: "Other", value: 8 },
  ];

  if (loading) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Finance Management</h1>
          <p className="text-muted-foreground">Track income, expenses, and financial reports</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null);
            setShowForm(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(totalIncome)}
                </p>
              </div>
              <ArrowUpRight className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-3xl font-bold text-red-600">
                  {formatCurrency(totalExpense)}
                </p>
              </div>
              <ArrowDownRight className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Balance</p>
                <p className={`text-3xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(balance)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-3xl font-bold">{transactions.length}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#10B981" name="Income" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" fill="#EF4444" name="Expense" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {expenseCategories.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="border-2 border-blue-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{editingId ? "Edit Transaction" : "Add Transaction"}</span>
              <Button variant="ghost" size="icon" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <select
                  className="w-full p-2 border rounded-lg mt-1"
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value as 'income' | 'expense', category: "" })}
                  aria-label="Transaction type"
                >
                  <option value="income">💰 Income</option>
                  <option value="expense">💸 Expense</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Category *</label>
                <select
                  className="w-full p-2 border rounded-lg mt-1"
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  required
                  aria-label="Transaction category"
                >
                  <option value="">Select</option>
                  {form.type === "income" ? (
                    <>
                      <option value="Consultation">Consultation</option>
                      <option value="Pharmacy">Pharmacy</option>
                      <option value="Laboratory">Laboratory</option>
                      <option value="Room">Room Charges</option>
                      <option value="Procedure">Procedure</option>
                      <option value="Other">Other</option>
                    </>
                  ) : (
                    <>
                      <option value="Salaries">Salaries</option>
                      <option value="Supplies">Supplies</option>
                      <option value="Equipment">Equipment</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Other">Other</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Amount ($) *</label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Optional description"
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                {editingId ? "Update" : "Save"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                    {t.type === 'income' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{t.category}</p>
                    <p className="text-xs text-muted-foreground">{t.description || t.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'income' ? '+' : '-'}
                      {formatCurrency(parseAmount(t.amount))}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.date}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(t)}>
                      <Pencil className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <p className="text-center py-8 text-muted-foreground">
                No transactions yet. Click &quot;Add Transaction&quot; to get started.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}