"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Building2, Plus, Search, Pencil, Trash2,
  Phone, Mail, MapPin, Users, UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { DepartmentForm } from "@/components/forms/department-form";

export default function DepartmentsPage() {
  const [session, setSession] = useState<any>(null); const [status, setStatus] = useState('loading'); useEffect(() => { const u = localStorage.getItem('user'); if (u) { setSession({ user: JSON.parse(u) }); setStatus('authenticated'); } else { setStatus('unauthenticated'); } }, []);
  const router = useRouter();
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedDept, setSelectedDept] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    fetchDepartments();
  }, [status, router]);

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/departments");
      if (!response.ok) throw new Error("Failed to fetch departments");
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      toast.error("Failed to load departments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedDept(null);
    setShowForm(true);
  };

  const handleEdit = (dept: any) => {
    setSelectedDept(dept);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this department?")) return;
    try {
      const response = await fetch(`/api/departments/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete department");
      toast.success("Department deleted successfully");
      fetchDepartments();
    } catch (error) {
      toast.error("Failed to delete department");
    }
  };

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
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-muted-foreground">Manage hospital departments</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" /> Add Department
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Departments</p>
                <p className="text-2xl font-bold">{departments.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {departments.filter(d => d.isActive).length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Doctors</p>
                <p className="text-2xl font-bold text-purple-600">
                  {departments.reduce((sum, d) => sum + (d._count?.doctors || 0), 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search departments..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Departments Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {departments
          .filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((dept) => (
            <Card key={dept.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <Building2 className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{dept.name}</CardTitle>
                      <Badge variant={dept.isActive ? "default" : "secondary"} className="mt-1">
                        {dept.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(dept)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(dept.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {dept.description && (
                  <p className="text-sm text-muted-foreground">{dept.description}</p>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{dept.floor || 'N/A'} • {dept.building || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{dept.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{dept.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{dept._count?.doctors || 0} Doctors</span>
                </div>
                {dept.headDoctor && (
                  <div className="flex items-center gap-2 text-sm">
                    <UserCheck className="h-4 w-4 text-blue-500" />
                    <span>Head: Dr. {dept.headDoctor?.firstName} {dept.headDoctor?.lastName}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Department Form Modal */}
      {showForm && (
        <DepartmentForm
          department={selectedDept}
          onSubmit={async (data) => {
            try {
              const url = selectedDept ? `/api/departments/${selectedDept.id}` : "/api/departments";
              const method = selectedDept ? "PUT" : "POST";
              const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });
              if (!response.ok) throw new Error("Failed to save department");
              toast.success(selectedDept ? "Department updated" : "Department created");
              setShowForm(false);
              fetchDepartments();
            } catch (error) {
              toast.error("Failed to save department");
            }
          }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}