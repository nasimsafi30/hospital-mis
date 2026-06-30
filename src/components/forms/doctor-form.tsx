"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, UserCheck } from "lucide-react";
import { toast } from "sonner";

// FIXED: Make isActive required, not optional
const doctorFormSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  specialization: z.string().min(2, "Specialization is required"),
  qualification: z.string().optional(),
  licenseNumber: z.string().min(1, "License number is required"),
  experience: z.number().min(0).optional(),
  departmentId: z.number().optional(),
  consultationFee: z.string().optional(),
  availableDays: z.array(z.string()).optional(),
  availableTimeStart: z.string().optional(),
  availableTimeEnd: z.string().optional(),
  maxPatientsPerDay: z.number().min(1).optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  isActive: z.boolean(), // FIXED: Required, not optional
  bio: z.string().optional(),
});

type DoctorFormValues = z.infer<typeof doctorFormSchema>;

interface DoctorFormProps {
  doctor?: any;
  onSubmit: (data: DoctorFormValues) => void;
  onClose: () => void;
}

export function DoctorForm({ doctor, onSubmit, onClose }: DoctorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]); // FIXED: Type as any[]

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      firstName: doctor?.firstName || "",
      lastName: doctor?.lastName || "",
      specialization: doctor?.specialization || "",
      qualification: doctor?.qualification || "",
      licenseNumber: doctor?.licenseNumber || "",
      experience: doctor?.experience || undefined,
      departmentId: doctor?.departmentId || undefined,
      consultationFee: doctor?.consultationFee || "",
      availableDays: doctor?.availableDays || ["Monday", "Wednesday", "Friday"],
      availableTimeStart: doctor?.availableTimeStart || "09:00",
      availableTimeEnd: doctor?.availableTimeEnd || "17:00",
      maxPatientsPerDay: doctor?.maxPatientsPerDay || 20,
      phone: doctor?.phone || "",
      email: doctor?.email || "",
      isActive: doctor?.isActive ?? true, // FIXED: Always provide default
      bio: doctor?.bio || "",
    },
  });

  useEffect(() => {
    fetch("/api/departments")
      .then(r => r.json())
      .then((d: any[]) => {
        if (Array.isArray(d)) {
          setDepartments(d);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (data: DoctorFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      toast.error("Failed to save doctor");
    } finally {
      setIsLoading(false);
    }
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            {doctor ? "Edit Doctor" : "Add New Doctor"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" {...form.register("firstName")} />
              {form.formState.errors.firstName && (
                <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" {...form.register("lastName")} />
              {form.formState.errors.lastName && (
                <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization *</Label>
              <Input id="specialization" {...form.register("specialization")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input id="qualification" {...form.register("qualification")} placeholder="MD, PhD" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License Number *</Label>
              <Input id="licenseNumber" {...form.register("licenseNumber")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience (years)</Label>
              <Input
                id="experience"
                type="number"
                {...form.register("experience", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="consultationFee">Consultation Fee ($)</Label>
              <Input id="consultationFee" {...form.register("consultationFee")} placeholder="200.00" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPatientsPerDay">Max Patients/Day</Label>
              <Input
                id="maxPatientsPerDay"
                type="number"
                {...form.register("maxPatientsPerDay", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="departmentId">Department</Label>
              <Select
                onValueChange={(v) => form.setValue("departmentId", parseInt(v))}
                defaultValue={form.getValues("departmentId")?.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d: any) => (
                    <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...form.register("phone")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Available Days</Label>
            <div className="flex flex-wrap gap-2">
              {days.map((day) => (
                <label key={day} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={day}
                    checked={form.watch("availableDays")?.includes(day) || false}
                    onChange={(e) => {
                      const currentDays = form.getValues("availableDays") || [];
                      if (e.target.checked) {
                        form.setValue("availableDays", [...currentDays, day]);
                      } else {
                        form.setValue("availableDays", currentDays.filter(d => d !== day));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{day.substring(0, 3)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="availableTimeStart">Available From</Label>
              <Input id="availableTimeStart" type="time" {...form.register("availableTimeStart")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="availableTimeEnd">Available To</Label>
              <Input id="availableTimeEnd" type="time" {...form.register("availableTimeEnd")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" {...form.register("bio")} rows={3} />
          </div>

          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Active Status</Label>
              <p className="text-sm text-muted-foreground">Set whether this doctor is currently active</p>
            </div>
            <Switch
              id="isActive"
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
              {doctor ? "Update Doctor" : "Add Doctor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}