"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, User, Phone, MapPin, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const patientFormSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"]),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyName: z.string().optional(),
  relationship: z.string().optional(),
  allergies: z.string().optional(),
  medicalHistory: z.string().optional(),
  currentMedications: z.string().optional(),
  insuranceProvider: z.string().optional(),
  insuranceNumber: z.string().optional(),
  patientType: z.enum(["inpatient", "outpatient", "emergency"]),
  isActive: z.boolean(),
  notes: z.string().optional(),
  occupation: z.string().optional(),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed"]).optional(),
  preferredLanguage: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

interface PatientFormProps {
  patient?: any;
  onSubmit: (data: PatientFormValues) => void;
  onClose: () => void;
}

export function PatientForm({ patient, onSubmit, onClose }: PatientFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      firstName: patient?.firstName || "",
      lastName: patient?.lastName || "",
      dateOfBirth: patient?.dateOfBirth || "",
      gender: patient?.gender || "male",
      bloodGroup: patient?.bloodGroup || undefined,
      email: patient?.email || "",
      phone: patient?.phone || "",
      address: patient?.address || "",
      city: patient?.city || "",
      state: patient?.state || "",
      zipCode: patient?.zipCode || "",
      emergencyContact: patient?.emergencyContact || "",
      emergencyName: patient?.emergencyName || "",
      relationship: patient?.relationship || "",
      allergies: patient?.allergies || "",
      medicalHistory: patient?.medicalHistory || "",
      currentMedications: patient?.currentMedications || "",
      insuranceProvider: patient?.insuranceProvider || "",
      insuranceNumber: patient?.insuranceNumber || "",
      patientType: patient?.patientType || "outpatient",
      isActive: patient?.isActive ?? true,
      notes: patient?.notes || "",
      occupation: patient?.occupation || "",
      maritalStatus: patient?.maritalStatus || undefined,
      preferredLanguage: patient?.preferredLanguage || "",
    },
  });

  const handleSubmit = async (data: PatientFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      toast.error("Failed to save patient");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6" />
            {patient ? "Edit Patient" : "Add New Patient"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="medical">Medical</TabsTrigger>
              <TabsTrigger value="additional">Additional</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 mt-4">
              <Card>
                <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" {...form.register("firstName")} placeholder="John" />
                      {form.formState.errors.firstName && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />{form.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" {...form.register("lastName")} placeholder="Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input id="dateOfBirth" type="date" {...form.register("dateOfBirth")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select onValueChange={(v: any) => form.setValue("gender", v)} defaultValue={form.getValues("gender")}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Select onValueChange={(v: any) => form.setValue("bloodGroup", v)} defaultValue={form.getValues("bloodGroup")}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input id="occupation" {...form.register("occupation")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maritalStatus">Marital Status</Label>
                      <Select onValueChange={(v: any) => form.setValue("maritalStatus", v)} defaultValue={form.getValues("maritalStatus")}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4 mt-4">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Phone className="h-5 w-5" />Contact</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" {...form.register("email")} /></div>
                    <div className="space-y-2"><Label htmlFor="phone">Phone *</Label><Input id="phone" {...form.register("phone")} /></div>
                    <div className="space-y-2 col-span-2"><Label htmlFor="address" className="flex items-center gap-2"><MapPin className="h-4 w-4" />Address</Label><Textarea id="address" {...form.register("address")} rows={2} /></div>
                    <div className="space-y-2"><Label htmlFor="city">City</Label><Input id="city" {...form.register("city")} /></div>
                    <div className="space-y-2"><Label htmlFor="state">State</Label><Input id="state" {...form.register("state")} /></div>
                    <div className="space-y-2"><Label htmlFor="zipCode">ZIP Code</Label><Input id="zipCode" {...form.register("zipCode")} /></div>
                    <div className="space-y-2"><Label htmlFor="preferredLanguage">Language</Label>
                      <Select onValueChange={(v) => form.setValue("preferredLanguage", v)} defaultValue={form.getValues("preferredLanguage")}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-red-500" />Emergency Contact</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="emergencyName">Contact Name</Label><Input id="emergencyName" {...form.register("emergencyName")} /></div>
                    <div className="space-y-2"><Label htmlFor="emergencyContact">Contact Phone</Label><Input id="emergencyContact" {...form.register("emergencyContact")} /></div>
                    <div className="space-y-2"><Label htmlFor="relationship">Relationship</Label><Input id="relationship" {...form.register("relationship")} /></div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medical" className="space-y-4 mt-4">
              <Card>
                <CardHeader><CardTitle>Medical Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2"><Label htmlFor="allergies">Allergies</Label><Textarea id="allergies" {...form.register("allergies")} rows={2} /></div>
                  <div className="space-y-2"><Label htmlFor="medicalHistory">Medical History</Label><Textarea id="medicalHistory" {...form.register("medicalHistory")} rows={3} /></div>
                  <div className="space-y-2"><Label htmlFor="currentMedications">Current Medications</Label><Textarea id="currentMedications" {...form.register("currentMedications")} rows={2} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="insuranceProvider">Insurance Provider</Label><Input id="insuranceProvider" {...form.register("insuranceProvider")} /></div>
                    <div className="space-y-2"><Label htmlFor="insuranceNumber">Insurance Number</Label><Input id="insuranceNumber" {...form.register("insuranceNumber")} /></div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="additional" className="space-y-4 mt-4">
              <Card>
                <CardHeader><CardTitle>Additional Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientType">Patient Type *</Label>
                    <Select onValueChange={(v: any) => form.setValue("patientType", v)} defaultValue={form.getValues("patientType")}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="outpatient">Outpatient</SelectItem>
                        <SelectItem value="inpatient">Inpatient</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label htmlFor="notes">Notes</Label><Textarea id="notes" {...form.register("notes")} rows={3} /></div>
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5"><Label htmlFor="isActive">Active Status</Label></div>
                    <Switch id="isActive" checked={form.watch("isActive")} onCheckedChange={(c) => form.setValue("isActive", c)} className="ml-auto" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4 mt-6 sticky bottom-0 bg-background p-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {patient ? "Update Patient" : "Add Patient"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}