"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, QrCode, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

export default function BillingPage() {
  const router = useRouter();
  const [bills, setBills] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [qrBill, setQrBill] = useState<any>(null);
  const [patientId, setPatientId] = useState("1");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) { router.push("/login"); return; }
    fetch("/api/billing").then(r => r.json()).then(d => {
      setBills(Array.isArray(d) ? d : []);
      setLoading(false);
    });
  }, []);

  const handleGenerateInvoice = async () => {
    if (!amount || !patientId) { toast.error("Enter patient ID and amount"); return; }
    
    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: parseInt(patientId),
          totalAmount: amount,
          paidAmount: "0",
          description: description || "Medical services",
          billDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
          paymentStatus: "pending"
        })
      });
      
      if (res.ok) {
        toast.success("Invoice generated!");
        setShowForm(false);
        setAmount("");
        setDescription("");
        const d = await fetch("/api/billing").then(r => r.json());
        setBills(Array.isArray(d) ? d : []);
      } else {
        toast.error("Failed to generate invoice");
      }
    } catch { toast.error("Error"); }
  };

  if (loading) return <div className="p-6 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" /></div>;

  const filtered = bills.filter((b: any) =>
    `${b.billNumber} ${b.patient?.firstName}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalBilled = bills.reduce((s, b) => s + parseFloat(b.totalAmount || "0"), 0);
  const totalPaid = bills.reduce((s, b) => s + parseFloat(b.paidAmount || "0"), 0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Billing & Payments</h1>
          <p className="text-muted-foreground">{bills.length} bills</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />Generate Invoice
        </Button>
      </div>

      {/* Generate Invoice Form */}
      {showForm && (
        <Card className="mb-6 border-2 border-green-300">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-lg">Generate New Invoice</h3>
            <div>
              <label className="text-xs font-medium">Patient ID</label>
              <Input title="Input field" type="number" value={patientId} onChange={e => setPatientId(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium">Amount ($) *</label>
              <Input title="Input field" type="number" step="0.01" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium">Description</label>
              <Input title="Input field" placeholder="Medical consultation" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleGenerateInvoice} className="flex-1">Generate Invoice</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">${totalBilled.toFixed(2)}</p><p className="text-sm text-muted-foreground">Total Billed</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</p><p className="text-sm text-muted-foreground">Total Paid</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-red-600">${(totalBilled - totalPaid).toFixed(2)}</p><p className="text-sm text-muted-foreground">Outstanding</p></CardContent></Card>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input title="Input field" placeholder="Search bills..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid gap-4">
        {filtered.map((bill: any) => (
          <Card key={bill.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{bill.billNumber}</p>
                  <p className="text-sm text-muted-foreground">{bill.patient?.firstName} {bill.patient?.lastName}</p>
                  <p className="text-xs text-muted-foreground">{bill.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xl font-bold">${bill.totalAmount}</p>
                    <p className="text-xs text-muted-foreground">Paid: ${bill.paidAmount}</p>
                  </div>
                  <Badge variant={bill.paymentStatus === "paid" ? "default" : bill.paymentStatus === "pending" ? "secondary" : "destructive"}>
                    {bill.paymentStatus}
                  </Badge>
                  <Button variant="ghost" size="icon" onClick={() => setQrBill(bill)}>
                    <QrCode className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {qrBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setQrBill(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold">Invoice: {qrBill.billNumber}</h2>
            <div className="bg-white p-4 rounded-xl inline-block mt-4">
              <QRCodeSVG value={JSON.stringify({id:qrBill.id, bill:qrBill.billNumber, amount:qrBill.totalAmount, status:qrBill.paymentStatus})} size={200} level="H" />
            </div>
            <p className="text-3xl font-bold mt-4">${qrBill.totalAmount}</p>
            <Button className="mt-4" onClick={() => window.print()}>Print QR</Button>
            <Button variant="outline" className="mt-4 ml-2" onClick={() => setQrBill(null)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}