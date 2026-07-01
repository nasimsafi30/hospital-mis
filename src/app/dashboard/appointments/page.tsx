"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  Video,
  Phone,
  MapPin,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import { AppointmentForm } from "@/components/forms/appointment-form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const statusColors = {
  scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  in_progress: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  completed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  no_show: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
};

const typeIcons = {
  consultation: <Phone className="h-4 w-4" />,
  follow_up: <ArrowRight className="h-4 w-4" />,
  emergency: <AlertCircle className="h-4 w-4" />,
  surgery: <MapPin className="h-4 w-4" />,
  video: <Video className="h-4 w-4" />,
};

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/appointments");
      if (!response.ok) throw new Error("Failed to fetch appointments");
      const data = await response.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  };

  // FIXED: Updated URL to use /status endpoint
  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/appointments/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      toast.success(`Appointment ${newStatus.replace('_', ' ')}`);
      fetchAppointments();
    } catch (error) {
      toast.error("Failed to update appointment status");
    }
  };

  const upcomingAppointments = appointments.filter(
    (a: any) => new Date(a.appointmentDate) >= new Date()
  );
  
  const todayAppointments = appointments.filter(
    (a: any) => 
      new Date(a.appointmentDate).toDateString() === new Date().toDateString()
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">
            Manage and track patient appointments
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => {
            setSelectedAppointment(null);
            setShowForm(true);
          }} className="gap-2">
            <Plus className="h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Appointments</p>
                <p className="text-2xl font-bold">{todayAppointments.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-bold">
                  {todayAppointments.filter((a: any) => a.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold">
                  {todayAppointments.filter((a: any) => a.status === 'cancelled').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="today" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search appointments..."
                className="pl-10 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        <TabsContent value="today" className="space-y-4">
          {todayAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Appointments Today</h3>
                <p className="text-muted-foreground">
                  There are no appointments scheduled for today.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {todayAppointments
                .filter((a: any) =>
                  `${a.patient?.firstName} ${a.patient?.lastName}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((appointment: any) => (
                  <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={appointment.patient?.avatar} />
                            <AvatarFallback>
                              {appointment.patient?.firstName?.[0]}
                              {appointment.patient?.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">
                              {appointment.patient?.firstName} {appointment.patient?.lastName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {appointment.patient?.phone}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{appointment.appointmentTime}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-medium">
                              Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {appointment.doctor?.specialization}
                            </p>
                          </div>
                          
                          <Badge className={cn(statusColors[appointment.status as keyof typeof statusColors])}>
                            {appointment.status.replace('_', ' ')}
                          </Badge>
                          
                          {typeIcons[appointment.type as keyof typeof typeIcons]}
                          
                          <div className="flex gap-2">
                            {appointment.status === 'scheduled' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-500"
                                  onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                              </>
                            )}
                            {appointment.status === 'confirmed' && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(appointment.id, 'in_progress')}
                              >
                                <ArrowRight className="h-4 w-4 mr-1" />
                                Start
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming">
          <div className="grid gap-4">
            {upcomingAppointments
              .filter((a: any) =>
                `${a.patient?.firstName} ${a.patient?.lastName}`
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .map((appointment: any) => (
                <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-3 rounded-full",
                          new Date(appointment.appointmentDate).toDateString() === new Date().toDateString()
                            ? "bg-blue-100 dark:bg-blue-900"
                            : "bg-gray-100 dark:bg-card"
                        )}>
                          <Calendar className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {appointment.patient?.firstName} {appointment.patient?.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName} - {appointment.doctor?.specialization}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">
                            {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.appointmentTime}
                          </p>
                        </div>
                        <Badge className={cn(statusColors[appointment.status as keyof typeof statusColors])}>
                          {appointment.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardContent className="p-6">
              <CalendarView
                appointments={appointments}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Appointment Form Modal */}
      {showForm && (
        <AppointmentForm
          appointment={selectedAppointment}
          onSubmit={async (data) => {
            try {
              const url = selectedAppointment
                ? `/api/appointments/${selectedAppointment.id}`
                : "/api/appointments";
              const method = selectedAppointment ? "PUT" : "POST";

              const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });

              if (!response.ok) throw new Error("Failed to save appointment");

              toast.success(
                selectedAppointment
                  ? "Appointment updated successfully"
                  : "Appointment created successfully"
              );
              
              setShowForm(false);
              fetchAppointments();
            } catch (error) {
              toast.error("Failed to save appointment");
            }
          }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

// Calendar View Component
function CalendarView({ appointments, selectedDate, onDateChange }: { appointments: any[]; selectedDate: Date; onDateChange: (date: Date) => void }) {
  const daysInMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newDate = new Date(selectedDate);
            newDate.setMonth(newDate.getMonth() - 1);
            onDateChange(newDate);
          }}
        >
          Previous
        </Button>
        <h2 className="text-xl font-semibold">
          {format(selectedDate, 'MMMM yyyy')}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newDate = new Date(selectedDate);
            newDate.setMonth(newDate.getMonth() + 1);
            onDateChange(newDate);
          }}
        >
          Next
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="bg-muted p-2 text-center text-sm font-medium">
            {day}
          </div>
        ))}
        
        {blanks.map((blank) => (
          <div key={`blank-${blank}`} className="bg-background p-2 min-h-[100px]" />
        ))}
        
        {days.map((day) => {
          const date = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            day
          );
          const dayAppointments = (appointments as any[]).filter(
            (a: any) =>
              new Date(a.appointmentDate).toDateString() === date.toDateString()
          );

          return (
            <div
              key={day}
              className={cn(
                "bg-background p-2 min-h-[100px] cursor-pointer hover:bg-muted/50 transition-colors",
                date.toDateString() === new Date().toDateString() && "bg-blue-50 dark:bg-blue-900/20"
              )}
              onClick={() => onDateChange(date)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={cn(
                  "text-sm font-medium",
                  date.toDateString() === new Date().toDateString() && "text-blue-600"
                )}>
                  {day}
                </span>
                {dayAppointments.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {dayAppointments.length}
                  </Badge>
                )}
              </div>
              <div className="space-y-1">
                {dayAppointments.slice(0, 3).map((apt: any) => (
                  <div
                    key={apt.id}
                    className={cn(
                      "text-xs p-1 rounded truncate",
                      statusColors[apt.status as keyof typeof statusColors]
                    )}
                  >
                    {apt.appointmentTime} - {apt.patient?.firstName}
                  </div>
                ))}
                {dayAppointments.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    +{dayAppointments.length - 3} more
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}