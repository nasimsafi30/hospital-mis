"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";

const transferSchema = z.object({
  roomId: z.number().min(1, "Room is required"),
  bedId: z.number().min(1, "Bed is required"),
});

type TransferFormValues = z.infer<typeof transferSchema>;

interface TransferFormProps {
  admissionId: number;
  currentRoom: string;
  currentBed: string;
  onSubmit: (data: TransferFormValues) => void;
  onClose: () => void;
}

export function TransferForm({ admissionId, currentRoom, currentBed, onSubmit, onClose }: TransferFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [beds, setBeds] = useState<any[]>([]);

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      roomId: 0,
      bedId: 0,
    },
  });

  useEffect(() => {
    fetch("/api/rooms").then(r => r.json()).then(setRooms).catch(() => {});
    fetch("/api/beds").then(r => r.json()).then((d: any[]) => setBeds(Array.isArray(d) ? d.filter((b: any) => !b.isOccupied) : [])).catch(() => {});
  }, []);

  const handleSubmit = async (data: TransferFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      toast.error("Failed to transfer patient");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Transfer Patient
          </DialogTitle>
        </DialogHeader>

        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Current Location: <strong>Room {currentRoom}, Bed {currentBed}</strong>
          </p>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>New Room *</Label>
            <Select onValueChange={(v) => form.setValue("roomId", parseInt(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.filter((r: any) => r.isActive).map((r: any) => (
                  <SelectItem key={r.id} value={r.id.toString()}>
                    Room {r.roomNumber} ({r.roomType?.replace('_', ' ')}) - {r.floor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.roomId && (
              <p className="text-sm text-red-500">{form.formState.errors.roomId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>New Bed *</Label>
            <Select onValueChange={(v) => form.setValue("bedId", parseInt(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Select bed" />
              </SelectTrigger>
              <SelectContent>
                {beds.map((b: any) => (
                  <SelectItem key={b.id} value={b.id.toString()}>
                    Bed {b.bedNumber} (Room {b.room?.roomNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.bedId && (
              <p className="text-sm text-red-500">{form.formState.errors.bedId.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Transfer Patient
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}