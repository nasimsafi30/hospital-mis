import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const patientSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"]),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  patientType: z.enum(["inpatient", "outpatient", "emergency"]).default("outpatient"),
})

export type PatientFormValues = z.infer<typeof patientSchema>

export const doctorSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  specialization: z.string().min(2, "Specialization is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
})

export type DoctorFormValues = z.infer<typeof doctorSchema>

export const appointmentSchema = z.object({
  patientId: z.number().min(1, "Patient is required"),
  doctorId: z.number().min(1, "Doctor is required"),
  appointmentDate: z.string().min(1, "Date is required"),
  appointmentTime: z.string().min(1, "Time is required"),
  priority: z.enum(["normal", "urgent", "stat"]).default("normal"),
})

export type AppointmentFormValues = z.infer<typeof appointmentSchema>
