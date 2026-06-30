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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, DoorOpen } from "lucide-react";
import { toast } from "sonner";

const roomSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  roomType: z.enum(['general', 'semi_private', 'private', 'icu', 'deluxe']),
  floor: z.string().min(1, "Floor is required"),
  building: z.string().optional(),
  departmentId: z.number().optional(),
  dailyRate: z.string().min(1, "Daily rate is required"),
  notes: z.string().optional(),
  isActive: z.boolean(),
});

type RoomFormValues = z.infer<typeof roomSchema>;

interface RoomFormProps {
  room?: any;
  onSubmit: (data: RoomFormValues) => void;
  onClose: () => void;
}

export function RoomForm({ room, onSubmit, onClose }: RoomFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: room || {
      roomNumber: "",
      roomType: "general",
      floor: "",
      building: "",
      dailyRate: "",
      isActive: true,
    },
  });

  useEffect(() => {
    fetch("/api/departments").then(r => r.json()).then(setDepartments).catch(() => {});
  }, []);

  const handleSubmit = async (data: RoomFormValues) => {
    setIsLoading(true);
    try { await onSubmit(data); onClose(); } catch (error) { toast.error("Failed to save room"); } finally { setIsLoading(false); }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DoorOpen className="h-5 w-5" />{room ? "Edit Room" : "Add Room"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Room Number *</Label><Input {...form.register("roomNumber")} placeholder="101" /></div>
            <div className="space-y-2"><Label>Room Type *</Label>
              <Select onValueChange={(v: any) => form.setValue("roomType", v)} defaultValue={form.getValues("roomType")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="semi_private">Semi-Private</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="icu">ICU</SelectItem>
                  <SelectItem value="deluxe">Deluxe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Floor *</Label><Input {...form.register("floor")} placeholder="1st Floor" /></div>
            <div className="space-y-2"><Label>Building</Label><Input {...form.register("building")} placeholder="Main Building" /></div>
            <div className="space-y-2"><Label>Department</Label>
              <Select onValueChange={(v) => form.setValue("departmentId", parseInt(v))} defaultValue={form.getValues("departmentId")?.toString()}>
                <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>
                  {departments.map((d: any) => <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Daily Rate ($) *</Label><Input {...form.register("dailyRate")} placeholder="150.00" /></div>
          </div>
          <div className="space-y-2"><Label>Notes</Label><Textarea {...form.register("notes")} rows={2} /></div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{room ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
