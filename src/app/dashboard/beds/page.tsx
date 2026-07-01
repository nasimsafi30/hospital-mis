"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Trash2, BedDouble, DoorOpen } from "lucide-react";
import { toast } from "sonner";

export default function BedsPage() {
 const router = useRouter();
 const [beds, setBeds] = useState<any[]>([]);
 const [saving, setSaving] = useState(false);
 const [errors, setErrors] = useState([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState("");
 const [showForm, setShowForm] = useState(false);
 const [bedNumber, setBedNumber] = useState("");
 const [roomId, setRoomId] = useState("");
 const [rooms, setRooms] = useState<any[]>([]);

 useEffect(() => {
  if (!localStorage.getItem("token")) { router.push("/login"); return; }
  loadData();
 }, []);

 const loadData = async () => {
  const [bedsRes, roomsRes] = await Promise.all([
   fetch("/api/beds"), fetch("/api/rooms")
  ]);
  const bedsData = await bedsRes.json();
  const roomsData = await roomsRes.json();
  setBeds(Array.isArray(bedsData) ? bedsData : []);
  setRooms(Array.isArray(roomsData) ? roomsData : []);
  setLoading(false);
 };

 const addBed = async () => {
  if (!bedNumber || !roomId) { toast.error("Fill all fields"); return; }
  const res = await fetch("/api/beds", {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ bedNumber, roomId: parseInt(roomId) })
  });
  if (res.ok) {
   toast.success("Bed added!");
   setShowForm(false);
   setBedNumber("");
   setRoomId("");
   loadData();
  } else { toast.error("Failed"); }
 };

 const deleteBed = async (id: number) => {
  if (!confirm("Delete?")) return;
  await fetch(`/api/beds/${id}`, { method: "DELETE" });
  toast.success("Deleted");
  loadData();
 };

 if (loading) return <div className="p-6 text-center">Loading...</div>;

 const filtered = beds.filter((b: any) => b.bedNumber?.toLowerCase().includes(search.toLowerCase()));

 return (
  <div className="p-6">
   <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold">Beds ({beds.length})</h1>
    <button 
     onClick={() => { console.log("Button clicked!"); setShowForm(true); }}
    
    >
     <Plus className="h-4 w-4" />Add Bed
    </button>
   </div>

   {showForm && (
    <div>
     <h3>Add New Bed</h3>
     <Input title="Input field" 
      placeholder="Bed Number (e.g. 101-B1)" 
      value={bedNumber} 
      onChange={e => setBedNumber(e.target.value)}
     
     />
     <select aria-label="Select room" title="Select room" 
      value={roomId} 
      onChange={e => setRoomId(e.target.value)}
     
     >
      <option value="">Select Room</option>
      {rooms.map((r: any) => (
       <option key={r.id} value={r.id}>Room {r.roomNumber} ({r.roomType})</option>
      ))}
     </select>
     <div>
      <button 
       onClick={addBed}
      
      >
       Save Bed
      </button>
      <button 
       onClick={() => setShowForm(false)}
      
      >
       Cancel
      </button>
     </div>
    </div>
   )}

   <div>
    <Search className="absolute" />
    <Input title="Input field" 
     placeholder="Search beds..." 
     
     value={search} 
     onChange={e => setSearch(e.target.value)} 
    />
   </div>

   <table>
    <thead>
     <tr>
      <th>Bed #</th>
      <th>Room</th>
      <th>Status</th>
      <th>Action</th>
     </tr>
    </thead>
    <tbody>
     {filtered.map((bed: any) => (
      <tr key={bed.id}>
       <td><BedDouble />{bed.bedNumber}</td>
       <td><DoorOpen />{bed.room?.roomNumber || 'N/A'}</td>
       <td>
        <Badge variant={bed.isOccupied ? "destructive" : "default"}>{bed.isOccupied ? "Occupied" : "Available"}</Badge>
       </td>
       <td>
        <Button variant="ghost" size="icon" onClick={() => deleteBed(bed.id)}>
         <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
       </td>
      </tr>
     ))}
    </tbody>
   </table>
   {filtered.length === 0 && <p>No beds found</p>}
  </div>
 );
}
