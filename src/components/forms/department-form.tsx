"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Building2 } from "lucide-react";
import { toast } from "sonner";

// FIXED: Make isActive required in schema (not optional)
const departmentSchema = z.object({
  name: z.string().min(2, "Department name is required"),
  description: z.string().optional(),
  headDoctorId: z.number().optional().nullable(),
  floor: z.string().optional(),
  building: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  isActive: z.boolean(), // FIXED: Required, not optional
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

interface DepartmentFormProps {
  department?: any;
  onSubmit: (data: DepartmentFormValues) => void;
  onClose: () => void;
}

export function DepartmentForm({ department, onSubmit, onClose }: DepartmentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]); // FIXED: Type as any[]

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: department?.name || "",
      description: department?.description || "",
      floor: department?.floor || "",
      building: department?.building || "",
      phone: department?.phone || "",
      email: department?.email || "",
      isActive: department?.isActive ?? true, // FIXED: Always provide default
      headDoctorId: department?.headDoctorId || null,
    },
  });

  useEffect(() => {
    fetch("/api/doctors")
      .then(r => r.json())
      .then((d: any[]) => {
        if (Array.isArray(d)) {
          setDoctors(d.filter((x: any) => x.isActive));
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (data: DepartmentFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      toast.error("Failed to save department");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {department ? "Edit Department" : "Add Department"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Department Name *</Label>
            <Input {...form.register("name")} placeholder="Cardiology" />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea {...form.register("description")} rows={2} placeholder="Department description..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Floor</Label>
              <Input {...form.register("floor")} placeholder="2nd Floor" />
            </div>
            <div className="space-y-2">
              <Label>Building</Label>
              <Input {...form.register("building")} placeholder="Main Building" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input {...form.register("phone")} placeholder="+1-555-0000" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input {...form.register("email")} placeholder="dept@hospital.com" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Head Doctor</Label>
            <Select
              onValueChange={(v) => form.setValue("headDoctorId", v === "none" ? null : parseInt(v))}
              defaultValue={form.getValues("headDoctorId")?.toString() || "none"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select head doctor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {doctors.map((d: any) => (
                  <SelectItem key={d.id} value={d.id.toString()}>
                    Dr. {d.firstName} {d.lastName} - {d.specialization}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <div className="space-y-0.5">
              <Label>Active Status</Label>
              <p className="text-sm text-muted-foreground">Department is operational</p>
            </div>
            <Switch
              checked={form.watch("isActive")}
              onCheckedChange={(checked) => form.setValue("isActive", checked)}
              className="ml-auto"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {department ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}