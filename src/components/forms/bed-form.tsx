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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, BedDouble } from "lucide-react";
import { toast } from "sonner";

const bedSchema = z.object({
  bedNumber: z.string().min(1, "Bed number is required"),
  roomId: z.number().min(1, "Room is required"),
  isOccupied: z.boolean(),
  isActive: z.boolean(),
  notes: z.string().optional(),
});

type BedFormValues = z.infer<typeof bedSchema>;

interface BedFormProps {
  rooms: any[];
  bed?: any;
  onSubmit: (data: BedFormValues) => void;
  onClose: () => void;
}

export function BedForm({ rooms, bed, onSubmit, onClose }: BedFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<BedFormValues>({
    resolver: zodResolver(bedSchema),
    defaultValues: {
      bedNumber: bed?.bedNumber || "",
      roomId: bed?.roomId || 0,
      isOccupied: bed?.isOccupied ?? false,
      isActive: bed?.isActive ?? true,
      notes: bed?.notes || "",
    },
  });

  const handleSubmit = async (data: BedFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      toast.error("Failed to save bed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BedDouble className="h-5 w-5" />
            {bed ? "Edit Bed" : "Add Bed"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Bed Number *</Label>
            <Input {...form.register("bedNumber")} placeholder="101-B1" />
            {form.formState.errors.bedNumber && (
              <p className="text-sm text-red-500">{form.formState.errors.bedNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Room *</Label>
            <Select
              onValueChange={(v) => form.setValue("roomId", parseInt(v))}
              defaultValue={form.getValues("roomId")?.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.filter((r: any) => r.isActive).map((r: any) => (
                  <SelectItem key={r.id} value={r.id.toString()}>
                    Room {r.roomNumber} ({r.roomType?.replace('_', ' ')})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.roomId && (
              <p className="text-sm text-red-500">{form.formState.errors.roomId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea {...form.register("notes")} rows={2} placeholder="Additional notes..." />
          </div>

          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <div className="space-y-0.5">
              <Label>Occupied</Label>
              <p className="text-sm text-muted-foreground">Mark bed as currently occupied</p>
            </div>
            <Switch
              checked={form.watch("isOccupied")}
              onCheckedChange={(checked) => form.setValue("isOccupied", checked)}
              className="ml-auto"
            />
          </div>

          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <div className="space-y-0.5">
              <Label>Active</Label>
              <p className="text-sm text-muted-foreground">Bed is available for use</p>
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
              {bed ? "Update" : "Add Bed"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}