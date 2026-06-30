"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type Doctor = {
  id: number;
  firstName: string;
  lastName: string;
  specialization: string;
  qualification: string;
  licenseNumber: string;
  experience: number;
  consultationFee: string;
  isActive: boolean;
};

export const columns: ColumnDef<Doctor>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    cell: ({ row }) => `Dr. ${row.getValue("lastName")}`,
  },
  {
    accessorKey: "specialization",
    header: "Specialization",
    cell: ({ row }) => <Badge variant="secondary">{row.getValue("specialization")}</Badge>,
  },
  {
    accessorKey: "qualification",
    header: "Qualification",
  },
  {
    accessorKey: "experience",
    header: "Experience",
    cell: ({ row }) => `${row.getValue("experience")} years`,
  },
  {
    accessorKey: "consultationFee",
    header: "Fee",
    cell: ({ row }) => `$${row.getValue("consultationFee")}`,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.getValue("isActive") ? "default" : "secondary"}>
        {row.getValue("isActive") ? "Active" : "Inactive"}
      </Badge>
    ),
  },
];