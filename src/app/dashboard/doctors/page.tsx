"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UserCheck,
  Plus,
  Search,
  Filter,
  Star,
  Clock,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Pencil,
  Trash2,
  Eye,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DoctorForm } from "@/components/forms/doctor-form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function DoctorsPage() {
  const [session, setSession] = useState<any>(null); const [status, setStatus] = useState('loading'); useEffect(() => { const u = localStorage.getItem('user'); if (u) { setSession({ user: JSON.parse(u) }); setStatus('authenticated'); } else { setStatus('unauthenticated'); } }, []);
  // Permission check
  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) {
      const user = JSON.parse(u);
      const allowed = ['admin'];
      if (!allowed.includes(user.role) && user.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, []);
  const router = useRouter();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    fetchDoctors();
  }, [status, router]);

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/doctors");
      if (!response.ok) throw new Error("Failed to fetch doctors");
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      toast.error("Failed to load doctors");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;

    try {
      const response = await fetch(`/api/doctors/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete doctor");

      toast.success("Doctor deleted successfully");
      fetchDoctors();
    } catch (error) {
      toast.error("Failed to delete doctor");
    }
  };

  const specializations = [...new Set(doctors.map((d: any) => d.specialization))] as string[];

  const filteredDoctors = doctors
    .filter((d: any) => filterSpecialization === "all" || d.specialization === filterSpecialization)
    .filter((d: any) =>
      `${d.firstName} ${d.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
          <h1 className="text-3xl font-bold">Doctors</h1>
          <p className="text-muted-foreground">
            Manage doctors, schedules, and departments
          </p>
        </div>
        <Button onClick={() => { setSelectedDoctor(null); setShowForm(true); }} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Doctor
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Doctors</p>
                <p className="text-2xl font-bold">{doctors.length}</p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">
                  {doctors.filter((d: any) => d.isActive).length}
                </p>
              </div>
              <Star className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Today</p>
                <p className="text-2xl font-bold">
                  {doctors.filter((d: any) => {
                    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                    return d.availableDays?.includes(today) && d.isActive;
                  }).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Experience</p>
                <p className="text-2xl font-bold">
                  {doctors.length > 0
                    ? Math.round(doctors.reduce((sum: number, d: any) => sum + (d.experience || 0), 0) / doctors.length)
                    : 0} yrs
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search doctors..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filterSpecialization === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterSpecialization("all")}
          >
            All
          </Button>
          {specializations.map((spec) => (
            <Button
              key={spec}
              variant={filterSpecialization === spec ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterSpecialization(spec)}
            >
              {spec}
            </Button>
          ))}
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDoctors.map((doctor: any) => (
          <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={doctor.avatar} />
                    <AvatarFallback className="text-lg">
                      {doctor.firstName[0]}{doctor.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </h3>
                    <Badge variant="secondary" className="mt-1">
                      {doctor.specialization}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => { setSelectedDoctor(doctor); setShowForm(true); }}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(doctor.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4" />
                  <span>{doctor.qualification}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{doctor.experience} years experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Dept. of {doctor.department?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{doctor.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Consultation Fee</span>
                  <span className="font-semibold">${doctor.consultationFee}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Max Patients/Day</span>
                  <span className="font-semibold">{doctor.maxPatientsPerDay}</span>
                </div>
                {doctor.availableDays && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1">Available Days:</p>
                    <div className="flex flex-wrap gap-1">
                      {doctor.availableDays.map((day: string) => (
                        <Badge key={day} variant="outline" className="text-xs">
                          {day.substring(0, 3)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  Schedule
                </Button>
                <Button size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showForm && (
        <DoctorForm
          doctor={selectedDoctor}
          onSubmit={async (data) => {
            try {
              const url = selectedDoctor
                ? `/api/doctors/${selectedDoctor.id}`
                : "/api/doctors";
              const method = selectedDoctor ? "PUT" : "POST";

              const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });

              if (!response.ok) throw new Error("Failed to save doctor");

              toast.success(
                selectedDoctor ? "Doctor updated successfully" : "Doctor added successfully"
              );
              
              setShowForm(false);
              fetchDoctors();
            } catch (error) {
              toast.error("Failed to save doctor");
            }
          }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}