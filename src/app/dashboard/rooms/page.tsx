"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BedDouble, Plus, Search, Filter, Pencil, Trash2,
  CheckCircle, XCircle, Building2, DoorOpen,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { RoomForm } from "@/components/forms/room-form";
import { BedForm } from "@/components/forms/bed-form";

const roomTypeColors: Record<string, string> = {
  general: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  semi_private: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  private: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  icu: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  deluxe: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
};

export default function RoomsPage() {
  const [session, setSession] = useState<any>(null); const [status, setStatus] = useState('loading'); useEffect(() => { const u = localStorage.getItem('user'); if (u) { setSession({ user: JSON.parse(u) }); setStatus('authenticated'); } else { setStatus('unauthenticated'); } }, []);
  const router = useRouter();
  const [rooms, setRooms] = useState<any[]>([]);
  const [beds, setBeds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [showBedForm, setShowBedForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    fetchRooms();
    fetchBeds();
  }, [status, router]);

  const fetchRooms = async () => {
    try {
      const response = await fetch("/api/rooms");
      if (!response.ok) throw new Error("Failed to fetch rooms");
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      toast.error("Failed to load rooms");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBeds = async () => {
    try {
      const response = await fetch("/api/beds");
      if (!response.ok) throw new Error("Failed to fetch beds");
      const data = await response.json();
      setBeds(data);
    } catch (error) {
      toast.error("Failed to load beds");
    }
  };

  const handleAddRoom = () => {
    setSelectedRoom(null);
    setShowRoomForm(true);
  };

  const handleEditRoom = (room: any) => {
    setSelectedRoom(room);
    setShowRoomForm(true);
  };

  const handleDeleteRoom = async (id: number) => {
    if (!confirm("Are you sure you want to delete this room?")) return;
    try {
      const response = await fetch(`/api/rooms/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete room");
      toast.success("Room deleted successfully");
      fetchRooms();
    } catch (error) {
      toast.error("Failed to delete room");
    }
  };

  const handleAddBed = () => {
    setShowBedForm(true);
  };

  const handleDeleteBed = async (id: number) => {
    if (!confirm("Are you sure you want to delete this bed?")) return;
    try {
      const response = await fetch(`/api/beds/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete bed");
      toast.success("Bed deleted successfully");
      fetchBeds();
    } catch (error) {
      toast.error("Failed to delete bed");
    }
  };

  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(b => b.isOccupied).length;
  const availableBeds = totalBeds - occupiedBeds;
  const occupancyRate = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : "0";

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Room Management</h1>
          <p className="text-muted-foreground">Manage rooms, beds, and occupancy</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddRoom} className="gap-2">
            <Plus className="h-4 w-4" /> Add Room
          </Button>
          <Button onClick={handleAddBed} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" /> Add Bed
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Rooms</p>
                <p className="text-2xl font-bold">{rooms.length}</p>
              </div>
              <DoorOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Beds</p>
                <p className="text-2xl font-bold">{totalBeds}</p>
              </div>
              <BedDouble className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Occupied</p>
                <p className="text-2xl font-bold text-red-600">{occupiedBeds}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-green-600">{availableBeds}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Occupancy Bar */}
      <Card>
        <CardHeader><CardTitle>Bed Occupancy Rate: {occupancyRate}%</CardTitle></CardHeader>
        <CardContent>
          <div className="w-full bg-muted rounded-full h-4">
            <div
              className="bg-primary h-4 rounded-full transition-all"
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>{occupiedBeds} occupied</span>
            <span>{availableBeds} available</span>
            <span>{totalBeds} total</span>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search rooms..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Rooms Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rooms
          .filter(r => r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) || r.roomType.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((room) => {
            const roomBeds = beds.filter(b => b.roomId === room.id);
            const occupiedInRoom = roomBeds.filter(b => b.isOccupied).length;
            
            return (
              <Card key={room.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <DoorOpen className="h-5 w-5" />
                        Room {room.roomNumber}
                      </CardTitle>
                      <Badge className={cn("mt-1", roomTypeColors[room.roomType] || "")}>
                        {room.roomType?.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditRoom(room)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteRoom(room.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    {room.floor} • {room.building}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BedDouble className="h-4 w-4" />
                    {roomBeds.length} beds • {occupiedInRoom} occupied • {roomBeds.length - occupiedInRoom} available
                  </div>
                  <div className="text-sm font-semibold">
                    ${room.dailyRate}/day
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Beds:</p>
                    <div className="flex flex-wrap gap-1">
                      {roomBeds.map((bed) => (
                        <Badge
                          key={bed.id}
                          variant={bed.isOccupied ? "destructive" : "default"}
                          className="text-xs cursor-pointer"
                          onClick={() => handleDeleteBed(bed.id)}
                          title={bed.isOccupied ? "Occupied" : "Available"}
                        >
                          {bed.bedNumber}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {/* Room Form Modal */}
      {showRoomForm && (
        <RoomForm
          room={selectedRoom}
          onSubmit={async (data) => {
            try {
              const url = selectedRoom ? `/api/rooms/${selectedRoom.id}` : "/api/rooms";
              const method = selectedRoom ? "PUT" : "POST";
              const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });
              if (!response.ok) throw new Error("Failed to save room");
              toast.success(selectedRoom ? "Room updated" : "Room created");
              setShowRoomForm(false);
              fetchRooms();
            } catch (error) {
              toast.error("Failed to save room");
            }
          }}
          onClose={() => setShowRoomForm(false)}
        />
      )}

      {/* Bed Form Modal */}
      {showBedForm && (
        <BedForm
          rooms={rooms}
          onSubmit={async (data) => {
            try {
              const response = await fetch("/api/beds", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });
              if (!response.ok) throw new Error("Failed to add bed");
              toast.success("Bed added successfully");
              setShowBedForm(false);
              fetchBeds();
            } catch (error) {
              toast.error("Failed to add bed");
            }
          }}
          onClose={() => setShowBedForm(false)}
        />
      )}
    </div>
  );
}