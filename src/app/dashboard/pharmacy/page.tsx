"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Pill, Plus, Search, Trash2, ShoppingCart, QrCode, Scan, Printer } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

export default function PharmacyPage() {
  const router = useRouter();
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [qty, setQty] = useState("100");
  const [price, setPrice] = useState("5.00");
  const [unit, setUnit] = useState("tablets");
  const [batch, setBatch] = useState("");
  const [expiry, setExpiry] = useState("");
  const [saving, setSaving] = useState(false);
  const [qrMedicine, setQrMedicine] = useState<any>(null);
  const [scanMode, setScanMode] = useState(false);
  const [lastScan, setLastScan] = useState("");
  const scanBuffer = useRef("");

  useEffect(() => {
    if (!localStorage.getItem("token")) { router.push("/login"); return; }
    fetch("/api/pharmacy").then(r => r.json()).then(d => {
      setMedicines(Array.isArray(d) ? d : []);
      setLoading(false);
    });
  }, []);

  // Hardware Scanner Listener
  useEffect(() => {
    let buffer = "";
    let timer: any;

    const handleScannerInput = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === "Enter" && buffer.length > 0) {
        const scannedData = buffer.trim();
        setLastScan(scannedData);
        
        try {
          // Try to parse as JSON (from QR code)
          const data = JSON.parse(scannedData);
          const found = medicines.find((m: any) => m.id === data.id);
          
          if (found) {
            if (scanMode) {
              // Auto-dispense in scan mode
              handleDispense(found);
            } else {
              toast.success(`Scanned: ${found.itemName}`);
              setSearch(found.itemName);
            }
          } else {
            toast.error("Medicine not found");
          }
        } catch {
          // Not JSON - search by name
          const found = medicines.find((m: any) => 
            m.itemName?.toLowerCase().includes(scannedData.toLowerCase()) ||
            m.batchNumber?.toLowerCase() === scannedData.toLowerCase()
          );
          
          if (found) {
            if (scanMode) {
              handleDispense(found);
            } else {
              toast.success(`Found: ${found.itemName}`);
              setSearch(found.itemName);
            }
          }
        }
        
        buffer = "";
      } else if (e.key.length === 1) {
        buffer += e.key;
      }
      
      clearTimeout(timer);
      timer = setTimeout(() => { buffer = ""; }, 150);
    };

    window.addEventListener("keydown", handleScannerInput);
    return () => window.removeEventListener("keydown", handleScannerInput);
  }, [medicines, scanMode]);

  const addMedicine = async () => {
    if (!name) { toast.error("Enter medicine name"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/pharmacy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemName: name, category: "Medicine", quantity: parseInt(qty),
          unit: unit, unitPrice: price, batchNumber: batch,
          expiryDate: expiry || null, reorderLevel: 10
        })
      });
      if (res.ok) {
        toast.success("Medicine added!");
        setName(""); setQty("100"); setPrice("5.00"); setBatch(""); setExpiry(""); setShowAdd(false);
        refreshList();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed");
      }
    } catch { toast.error("Error"); }
    finally { setSaving(false); }
  };

  const refreshList = async () => {
    const data = await fetch("/api/pharmacy").then(r => r.json());
    setMedicines(Array.isArray(data) ? data : []);
  };

  const deleteMedicine = async (id: number) => {
    if (!confirm("Delete this medicine?")) return;
    await fetch(`/api/pharmacy/${id}`, { method: "DELETE" });
    toast.success("Deleted");
    refreshList();
  };

  const handleDispense = async (med: any) => {
    const q = scanMode ? "1" : prompt("Quantity to dispense:", "1");
    if (!q) return;
    
    const res = await fetch(`/api/pharmacy/${med.id}/dispense`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: parseInt(q) })
    });
    
    if (res.ok) {
      toast.success(`Dispensed: ${med.itemName} x${q}`);
      refreshList();
    } else {
      const err = await res.json();
      toast.error(err.error || "Failed");
    }
  };

  const qrData = (med: any) => JSON.stringify({
    id: med.id, name: med.itemName, batch: med.batchNumber,
    expiry: med.expiryDate, price: med.unitPrice
  });

  const printLabel = (med: any) => {
    const w = window.open('', '_blank', 'width=350,height=400');
    if (!w) return;
    w.document.write(`
      <html><head><title>Medicine Label</title>
      <style>
        body { font-family: Arial; text-align: center; padding: 20px; }
        .label { border: 2px dashed #000; padding: 20px; max-width: 250px; margin: 0 auto; }
        @media print { .no-print { display: none; } }
      </style></head>
      <body>
        <div class="label">
          <h2>${med.itemName}</h2>
          <p>Batch: ${med.batchNumber || 'N/A'}</p>
          <p>Expiry: ${med.expiryDate || 'N/A'}</p>
          <p>Price: $${med.unitPrice}</p>
          <div id="qr"></div>
        </div>
        <br/>
        <button class="no-print" onclick="window.print()">🖨️ Print Label</button>
        <button class="no-print" onclick="window.close()">Close</button>
        <script>
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js';
          script.onload = () => QRCode.toCanvas(document.getElementById('qr'), '${JSON.stringify({id:med.id, name:med.itemName})}'.replace(/'/g, "\\'"), {width:120});
          document.head.appendChild(script);
        </script>
      </body></html>
    `);
  };

  if (loading) return <div className="p-6 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" /></div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Pharmacy Management</h1>
          <p className="text-muted-foreground">{medicines.length} medicines in stock</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
            <Scan className="h-4 w-4" />
            <Label className="text-sm">Scan Mode</Label>
            <Switch checked={scanMode} onCheckedChange={setScanMode} />
          </div>
          <Button onClick={() => setShowAdd(!showAdd)} className="gap-2">
            <Plus className="h-4 w-4" />Add Medicine
          </Button>
        </div>
      </div>

      {/* Scan Mode Alert */}
      {scanMode && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 border border-green-300 rounded-lg flex items-center gap-2">
          <Scan className="h-5 w-5 text-green-600 animate-pulse" />
          <span className="text-sm font-medium">Scan Mode Active - Scan QR code or barcode to dispense automatically</span>
        </div>
      )}

      {/* Last Scan */}
      {lastScan && (
        <div className="mb-4 p-2 bg-muted rounded text-xs text-muted-foreground">
          Last scan: {lastScan}
        </div>
      )}

      {/* Add Form */}
      {showAdd && (
        <Card className="mb-6">
          <CardHeader><CardTitle>Add New Medicine</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input title="Input field" placeholder="Medicine Name *" value={name} onChange={e => setName(e.target.value)} />
            <div className="grid grid-cols-3 gap-3">
              <Input title="Input field" type="number" placeholder="Quantity" value={qty} onChange={e => setQty(e.target.value)} />
              <Input title="Input field" placeholder="Unit (tablets, bottles)" value={unit} onChange={e => setUnit(e.target.value)} />
              <Input title="Input field" placeholder="Price ($)" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input title="Input field" placeholder="Batch Number" value={batch} onChange={e => setBatch(e.target.value)} />
              <Input title="Input field" type="date" placeholder="Expiry Date" value={expiry} onChange={e => setExpiry(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button onClick={addMedicine} disabled={saving} className="flex-1">
                {saving ? "Saving..." : "Save Medicine"}
              </Button>
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input title="Input field" placeholder="Search medicines or scan barcode..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Medicine Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {medicines.filter((m: any) => m.itemName?.toLowerCase().includes(search.toLowerCase())).map((med: any) => (
          <Card key={med.id} className={scanMode ? "border-2 border-green-300" : ""}>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Pill className="h-5 w-5 text-blue-500" />
                  {med.itemName}
                </CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setQrMedicine(med)} title="View QR Code">
                    <QrCode className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => printLabel(med)} title="Print Label">
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteMedicine(med.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Qty: <strong className={med.quantity <= 10 ? "text-red-500" : ""}>{med.quantity} {med.unit}</strong></span>
                <span>Price: <strong>${med.unitPrice}</strong></span>
              </div>
              {med.batchNumber && <p className="text-xs text-muted-foreground">Batch: {med.batchNumber}</p>}
              {med.expiryDate && <p className="text-xs text-muted-foreground">Expiry: {med.expiryDate}</p>}
              <Button size="sm" className="w-full" onClick={() => handleDispense(med)} disabled={med.quantity <= 0}>
                <ShoppingCart className="h-4 w-4 mr-1" />Dispense
              </Button>
            </CardContent>
          </Card>
        ))}
        {medicines.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No medicines in stock</p>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {qrMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setQrMedicine(null)}>
          <div className="bg-white dark:bg-card rounded-2xl p-8 text-center shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-2">{qrMedicine.itemName}</h2>
            <p className="text-sm text-muted-foreground mb-4">Scan with barcode scanner or phone</p>
            <div className="bg-white p-4 rounded-xl inline-block border-2 border-gray-200">
              <QRCodeSVG value={qrData(qrMedicine)} size={200} level="H" includeMargin />
            </div>
            <div className="mt-4 text-sm text-muted-foreground space-y-1">
              <p><strong>Batch:</strong> {qrMedicine.batchNumber || 'N/A'}</p>
              <p><strong>Expiry:</strong> {qrMedicine.expiryDate || 'N/A'}</p>
              <p><strong>Price:</strong> ${qrMedicine.unitPrice}</p>
              <p className="text-xs mt-2 text-gray-400">Data: {qrData(qrMedicine).substring(0, 50)}...</p>
            </div>
            <div className="flex gap-2 justify-center mt-4">
              <Button onClick={() => { window.print(); }} size="sm">
                <Printer className="h-4 w-4 mr-1" />Print QR
              </Button>
              <Button variant="outline" size="sm" onClick={() => setQrMedicine(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}