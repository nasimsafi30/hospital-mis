"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  FileText,
  Download,
  Printer,
  Eye,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Pill,
  FlaskConical,
} from "lucide-react";
import { toast } from "sonner";

const reportTypes = [
  {
    id: "patient",
    name: "Patient Reports",
    description: "Patient demographics, registration, and visit history",
    icon: Users,
    templates: [
      { id: "patient-list", name: "Patient List", description: "Complete list of all patients" },
      { id: "patient-demographics", name: "Patient Demographics", description: "Age, gender, location distribution" },
      { id: "new-registrations", name: "New Registrations", description: "Recently registered patients" },
      { id: "patient-visits", name: "Patient Visit History", description: "Visit frequency and patterns" },
    ],
  },
  {
    id: "appointment",
    name: "Appointment Reports",
    description: "Appointment scheduling, attendance, and trends",
    icon: Calendar,
    templates: [
      { id: "daily-appointments", name: "Daily Appointments", description: "Today's appointment schedule" },
      { id: "appointment-summary", name: "Appointment Summary", description: "Summary by status and type" },
      { id: "no-shows", name: "No-Show Analysis", description: "Missed appointment tracking" },
      { id: "doctor-schedule", name: "Doctor Schedule", description: "Doctor-wise appointment distribution" },
    ],
  },
  {
    id: "financial",
    name: "Financial Reports",
    description: "Revenue, billing, and payment analysis",
    icon: DollarSign,
    templates: [
      { id: "revenue-summary", name: "Revenue Summary", description: "Total revenue by period" },
      { id: "outstanding-payments", name: "Outstanding Payments", description: "Pending and overdue payments" },
      { id: "department-revenue", name: "Department Revenue", description: "Revenue by department" },
      { id: "daily-collection", name: "Daily Collection", description: "Day-wise payment collection" },
    ],
  },
  {
    id: "pharmacy",
    name: "Pharmacy Reports",
    description: "Medicine inventory, dispensing, and stock analysis",
    icon: Pill,
    templates: [
      { id: "inventory-status", name: "Inventory Status", description: "Current stock levels" },
      { id: "low-stock", name: "Low Stock Alert", description: "Items below reorder level" },
      { id: "expiry-tracking", name: "Expiry Tracking", description: "Medicines nearing expiry" },
      { id: "dispensing-history", name: "Dispensing History", description: "Medicine dispensing records" },
    ],
  },
  {
    id: "laboratory",
    name: "Laboratory Reports",
    description: "Lab tests, results, and turnaround analysis",
    icon: FlaskConical,
    templates: [
      { id: "test-summary", name: "Test Summary", description: "Tests by type and status" },
      { id: "tat-analysis", name: "TAT Analysis", description: "Turnaround time analysis" },
      { id: "pending-tests", name: "Pending Tests", description: "Tests awaiting results" },
      { id: "test-trends", name: "Test Trends", description: "Monthly test volume trends" },
    ],
  },
];

const exportFormats = [
  { id: "pdf", name: "PDF", icon: FileText },
  { id: "excel", name: "Excel", icon: Download },
  { id: "csv", name: "CSV", icon: Download },
];

export function ReportGenerator() {
  const [selectedReport, setSelectedReport] = useState("patient");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });
  const [exportFormat, setExportFormat] = useState("pdf");
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const handleGenerate = async () => {
    if (!selectedTemplate) {
      toast.error("Please select a report template");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportType: selectedReport,
          template: selectedTemplate,
          dateRange,
          format: exportFormat,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate report");

      const data = await response.json();
      setPreviewData(data);

      toast.success("Report generated successfully");
    } catch (error) {
      toast.error("Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch("/api/reports/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportType: selectedReport,
          template: selectedTemplate,
          dateRange,
          format: exportFormat,
        }),
      });

      if (!response.ok) throw new Error("Failed to download report");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedTemplate}-report.${exportFormat}`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("Report downloaded successfully");
    } catch (error) {
      toast.error("Failed to download report");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Report Configuration */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Report Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Report Type Selection */}
            <div className="space-y-2">
              <Label>Report Category</Label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Template Selection */}
            <div className="space-y-2">
              <Label>Report Template</Label>
              <div className="grid gap-2">
                {reportTypes
                  .find((r) => r.id === selectedReport)
                  ?.templates.map((template) => (
                    <Button
                      key={template.id}
                      variant={selectedTemplate === template.id ? "default" : "outline"}
                      className="justify-start h-auto py-3"
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="text-left">
                        <p className="font-medium">{template.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {template.description}
                        </p>
                      </div>
                    </Button>
                  ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label>Date Range</Label>
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
              />
            </div>

            {/* Export Format */}
            <div className="space-y-2">
              <Label>Export Format</Label>
              <div className="grid grid-cols-3 gap-2">
                {exportFormats.map((format) => (
                  <Button
                    key={format.id}
                    variant={exportFormat === format.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setExportFormat(format.id)}
                    className="gap-2"
                  >
                    <format.icon className="h-4 w-4" />
                    {format.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                className="flex-1"
                onClick={handleGenerate}
                disabled={isGenerating || !selectedTemplate}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Quick Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="outline" size="sm" className="justify-start" onClick={() => {
              setSelectedReport("patient");
              setSelectedTemplate("patient-list");
            }}>
              <Users className="h-4 w-4 mr-2" />
              Today's Patient List
            </Button>
            <Button variant="outline" size="sm" className="justify-start" onClick={() => {
              setSelectedReport("financial");
              setSelectedTemplate("daily-collection");
            }}>
              <DollarSign className="h-4 w-4 mr-2" />
              Daily Collection Report
            </Button>
            <Button variant="outline" size="sm" className="justify-start" onClick={() => {
              setSelectedReport("appointment");
              setSelectedTemplate("daily-appointments");
            }}>
              <Calendar className="h-4 w-4 mr-2" />
              Today's Appointments
            </Button>
            <Button variant="outline" size="sm" className="justify-start" onClick={() => {
              setSelectedReport("pharmacy");
              setSelectedTemplate("low-stock");
            }}>
              <Pill className="h-4 w-4 mr-2" />
              Low Stock Alert
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Report Preview */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Report Preview
              </CardTitle>
              {previewData && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download {exportFormat.toUpperCase()}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!previewData ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Report Generated</h3>
                <p className="text-muted-foreground max-w-md">
                  Configure your report settings and click "Preview" to generate a report
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Report Header */}
                <div className="text-center border-b pb-4">
                  <h2 className="text-2xl font-bold">{previewData.title}</h2>
                  <p className="text-muted-foreground">
                    Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Period: {new Date(previewData.dateRange.from).toLocaleDateString()} - {new Date(previewData.dateRange.to).toLocaleDateString()}
                  </p>
                </div>

                {/* Report Summary */}
                {previewData.summary && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(previewData.summary).map(([key, value]: [string, any]) => (
                      <div key={key} className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold">{value}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Report Chart */}
                {previewData.chartData && (
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Chart visualization</span>
                  </div>
                )}

                {/* Report Table */}
                {previewData.tableData && (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted">
                          {previewData.columns.map((col: string) => (
                            <th key={col} className="p-2 text-left text-sm font-medium">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.tableData.slice(0, 10).map((row: any, index: number) => (
                          <tr key={index} className="border-t">
                            {previewData.columns.map((col: string) => (
                              <td key={col} className="p-2 text-sm">
                                {row[col]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {previewData.tableData.length > 10 && (
                      <p className="text-center text-sm text-muted-foreground mt-2">
                        Showing 10 of {previewData.tableData.length} records
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}