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
     style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}
    >
     <Plus className="h-4 w-4" />Add Bed
    </button>
   </div>

   {showForm && (
    <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '2px solid #2563eb' }}>
     <h3 style={{ marginBottom: '15px', fontWeight: 'bold' }}>Add New Bed</h3>
     <Input title="Input field" 
      placeholder="Bed Number (e.g. 101-B1)" 
      value={bedNumber} 
      onChange={e => setBedNumber(e.target.value)}
      style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
     />
     <select aria-label="Select room" title="Select room" 
      value={roomId} 
      onChange={e => setRoomId(e.target.value)}
      style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
     >
      <option value="">Select Room</option>
      {rooms.map((r: any) => (
       <option key={r.id} value={r.id}>Room {r.roomNumber} ({r.roomType})</option>
      ))}
     </select>
     <div style={{ display: 'flex', gap: '10px' }}>
      <button 
       onClick={addBed}
       style={{ flex: 1, padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
      >
       Save Bed
      </button>
      <button 
       onClick={() => setShowForm(false)}
       style={{ flex: 1, padding: '10px', background: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
      >
       Cancel
      </button>
     </div>
    </div>
   )}

   <div style={{ marginBottom: '20px' }}>
    <Search className="absolute" style={{ marginTop: '12px', marginLeft: '12px' }} />
    <Input title="Input field" 
     placeholder="Search beds..." 
     style={{ paddingLeft: '40px' }} 
     value={search} 
     onChange={e => setSearch(e.target.value)} 
    />
   </div>

   <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
    <thead>
     <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
      <th style={{ padding: '12px', textAlign: 'left' }}>Bed #</th>
      <th style={{ padding: '12px', textAlign: 'left' }}>Room</th>
      <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
      <th style={{ padding: '12px', textAlign: 'right' }}>Action</th>
     </tr>
    </thead>
    <tbody>
     {filtered.map((bed: any) => (
      <tr key={bed.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
       <td style={{ padding: '12px' }}><BedDouble style={{ display: 'inline', marginRight: '8px' }} />{bed.bedNumber}</td>
       <td style={{ padding: '12px' }}><DoorOpen style={{ display: 'inline', marginRight: '8px' }} />{bed.room?.roomNumber || 'N/A'}</td>
       <td style={{ padding: '12px' }}>
        <Badge variant={bed.isOccupied ? "destructive" : "default"}>{bed.isOccupied ? "Occupied" : "Available"}</Badge>
       </td>
       <td style={{ padding: '12px', textAlign: 'right' }}>
        <Button variant="ghost" size="icon" onClick={() => deleteBed(bed.id)}>
         <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
       </td>
      </tr>
     ))}
    </tbody>
   </table>
   {filtered.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No beds found</p>}
  </div>
 );
}
