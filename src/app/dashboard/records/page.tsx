"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText, Plus, Search, Eye, Download, Printer,
  Calendar, User, Stethoscope, Pill, Activity,
  Pencil, Trash2, QrCode,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";

export default function MedicalRecordsPage() {
  const router = useRouter();
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [qrRecord, setQrRecord] = useState<any>(null);
  const [form, setForm] = useState({
    patientId: "", doctorId: "", diagnosis: "", symptoms: "", treatment: "", notes: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch("/api/medical-records");
      if (!response.ok) throw new Error("Failed to fetch records");
      const data = await response.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load medical records");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedRecord(null);
    setForm({ patientId: "", doctorId: "", diagnosis: "", symptoms: "", treatment: "", notes: "" });
    setShowForm(true);
  };

  const handleEdit = (record: any) => {
    setSelectedRecord(record);
    setForm({
      patientId: record.patientId?.toString() || "",
      doctorId: record.doctorId?.toString() || "",
      diagnosis: record.diagnosis || "",
      symptoms: record.symptoms || "",
      treatment: record.treatment || "",
      notes: record.notes || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      await fetch(`/api/medical-records/${id}`, { method: "DELETE" });
      toast.success("Record deleted");
      fetchRecords();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = selectedRecord
        ? `/api/medical-records/${selectedRecord.id}`
        : "/api/medical-records";
      const method = selectedRecord ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: parseInt(form.patientId),
          doctorId: parseInt(form.doctorId),
          diagnosis: form.diagnosis,
          symptoms: form.symptoms,
          treatment: form.treatment,
          notes: form.notes
        }),
      });

      if (!res.ok) throw new Error("Failed to save");
      
      toast.success(selectedRecord ? "Record updated" : "Record created");
      setShowForm(false);
      fetchRecords();
    } catch {
      toast.error("Failed to save record");
    }
  };

  const handlePrint = (record: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head><title>Medical Record - ${record.recordNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #1a365d; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
          .info { margin: 10px 0; }
          .label { font-weight: bold; color: #4a5568; }
          .section { margin: 20px 0; padding: 15px; background: #f7fafc; border-radius: 8px; }
          .qr-section { text-align: center; margin-top: 30px; padding: 20px; border: 2px dashed #cbd5e0; border-radius: 12px; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <h1>📋 Medical Record</h1>
        
        <div class="section">
          <p><span class="label">Record #:</span> ${record.recordNumber}</p>
          <p><span class="label">Date:</span> ${format(new Date(record.createdAt), 'MMM dd, yyyy')}</p>
        </div>
        
        <div class="section">
          <p><span class="label">Patient:</span> ${record.patient?.firstName} ${record.patient?.lastName}</p>
          <p><span class="label">Patient ID:</span> ${record.patient?.patientId || 'N/A'}</p>
          <p><span class="label">Doctor:</span> Dr. ${record.doctor?.firstName} ${record.doctor?.lastName}</p>
        </div>
        
        <div class="section">
          <p><span class="label">Diagnosis:</span> ${record.diagnosis || 'N/A'}</p>
          <p><span class="label">Symptoms:</span> ${record.symptoms || 'N/A'}</p>
          <p><span class="label">Treatment:</span> ${record.treatment || 'N/A'}</p>
          <p><span class="label">Notes:</span> ${record.notes || 'N/A'}</p>
        </div>
        
        ${record.followUpDate ? `
        <div class="section">
          <p><span class="label">Follow-up Date:</span> ${format(new Date(record.followUpDate), 'MMM dd, yyyy')}</p>
        </div>` : ''}
        
        <div class="qr-section">
          <h3>Scan QR Code for Digital Record</h3>
          <div id="qrcode" style="display: flex; justify-content: center; margin: 20px 0;"></div>
          <p style="font-size: 12px; color: #718096;">Record ID: ${record.id} | ${record.recordNumber}</p>
        </div>
        
        <br/>
        <button onclick="window.print()" style="padding: 12px 24px; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
          🖨️ Print Record
        </button>
        <button onclick="window.close()" style="padding: 12px 24px; background: #e2e8f0; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; margin-left: 10px;">
          Close
        </button>
        
        <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js"></script>
        <script>
          QRCode.toCanvas(document.getElementById('qrcode'), '${JSON.stringify({
            id: record.id,
            recordNumber: record.recordNumber,
            patient: record.patient?.firstName + ' ' + record.patient?.lastName,
            doctor: 'Dr. ' + record.doctor?.firstName + ' ' + record.doctor?.lastName,
            diagnosis: record.diagnosis
          }).replace(/'/g, "\\'")}', {width: 150});
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Medical Records</h1>
          <p className="text-muted-foreground">View and manage patient medical records</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" /> Add Record
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input title="Input field" placeholder="Search records..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="grid gap-4">
        {records
          .filter((r: any) =>
            `${r.patient?.firstName} ${r.patient?.lastName} ${r.diagnosis}`
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          )
          .map((record: any) => (
            <Card key={record.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                        <FileText className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {record.patient?.firstName} {record.patient?.lastName}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(record.createdAt), 'MMM dd, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Stethoscope className="h-3 w-3" />
                            Dr. {record.doctor?.firstName} {record.doctor?.lastName}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-12">
                      <p className="text-sm"><strong>Diagnosis:</strong> {record.diagnosis || 'N/A'}</p>
                      <p className="text-sm"><strong>Treatment:</strong> {record.treatment || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => setQrRecord(record)} title="QR Code">
                      <QrCode className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handlePrint(record)}>
                      <Printer className="h-4 w-4 mr-1" /> Print
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(record)}>
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-500" onClick={() => handleDelete(record.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Add/Edit Record Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">{selectedRecord ? "Edit Record" : "Add Record"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Patient ID</label>
                  <Input title="Input field" type="number" value={form.patientId} onChange={e => setForm({...form, patientId: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Doctor ID</label>
                  <Input title="Input field" type="number" value={form.doctorId} onChange={e => setForm({...form, doctorId: e.target.value})} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Diagnosis</label>
                <Input title="Input field" value={form.diagnosis} onChange={e => setForm({...form, diagnosis: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Symptoms</label>
                <Input title="Input field" value={form.symptoms} onChange={e => setForm({...form, symptoms: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Treatment</label>
                <Input title="Input field" value={form.treatment} onChange={e => setForm({...form, treatment: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <Input title="Input field" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit">{selectedRecord ? "Update" : "Create"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setQrRecord(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold">Medical Record QR</h2>
            <p className="text-sm text-muted-foreground mb-2">{qrRecord.recordNumber}</p>
            <p className="text-sm mb-4">{qrRecord.patient?.firstName} {qrRecord.patient?.lastName}</p>
            <div className="bg-white p-4 rounded-xl inline-block border-2 border-gray-200">
              <QRCodeSVG value={JSON.stringify({
                id: qrRecord.id,
                recordNumber: qrRecord.recordNumber,
                patient: `${qrRecord.patient?.firstName} ${qrRecord.patient?.lastName}`,
                doctor: `Dr. ${qrRecord.doctor?.firstName} ${qrRecord.doctor?.lastName}`,
                diagnosis: qrRecord.diagnosis,
                date: qrRecord.createdAt
              })} size={200} level="H" includeMargin />
            </div>
            <div className="mt-4 text-sm space-y-1">
              <p><strong>Patient:</strong> {qrRecord.patient?.firstName} {qrRecord.patient?.lastName}</p>
              <p><strong>Doctor:</strong> Dr. {qrRecord.doctor?.firstName} {qrRecord.doctor?.lastName}</p>
              <p><strong>Diagnosis:</strong> {qrRecord.diagnosis || 'N/A'}</p>
            </div>
            <div className="flex gap-2 justify-center mt-4">
              <Button onClick={() => window.print()}>
                <Printer className="h-4 w-4 mr-1" />Print QR
              </Button>
              <Button variant="outline" onClick={() => setQrRecord(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}