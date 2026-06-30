"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DoctorForm } from "@/components/forms/doctor-form";
import { toast } from "sonner";

export default function EditDoctorPage() {
  const params = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDoctor();
  }, [params.id]);

  const fetchDoctor = async () => {
    try {
      const response = await fetch(`/api/doctors/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch doctor");
      const data = await response.json();
      setDoctor(data);
    } catch (error) {
      toast.error("Failed to load doctor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(`/api/doctors/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update doctor");

      toast.success("Doctor updated successfully");
      router.push(`/dashboard/doctors/${params.id}`);
    } catch (error) {
      toast.error("Failed to update doctor");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/doctors/${params.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Doctor</h1>
      </div>
      
      {doctor && (
        <DoctorForm
          doctor={doctor}
          onSubmit={handleSubmit}
          onClose={() => router.push(`/dashboard/doctors/${params.id}`)}
        />
      )}
    </div>
  );
}