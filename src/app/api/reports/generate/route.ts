import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { patients, appointments, bills } from '@/lib/db/schema';
import { and, gte, lte } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { reportType, template, dateRange } = await request.json();
    const startDate = new Date(dateRange.from);
    const endDate = new Date(dateRange.to);

    let reportData: any = { title: '', dateRange, generatedAt: new Date().toISOString() };

    if (reportType === 'patient') {
      const patientList = await db.query.patients.findMany({
        where: and(gte(patients.createdAt, startDate), lte(patients.createdAt, endDate)),
      });
      reportData = { ...reportData, title: 'Patient Report', summary: { totalPatients: patientList.length }, tableData: patientList, columns: ['patientId', 'firstName', 'lastName', 'gender', 'phone', 'createdAt'] };
    } else if (reportType === 'appointment') {
      const list = await db.query.appointments.findMany({
        where: and(gte(appointments.appointmentDate, startDate.toISOString().split('T')[0]), lte(appointments.appointmentDate, endDate.toISOString().split('T')[0])),
        with: { patient: true, doctor: true },
      });
      reportData = { ...reportData, title: 'Appointment Report', summary: { total: list.length }, tableData: list.map(a => ({ appointmentNumber: a.appointmentNumber, time: a.appointmentTime, patientName: `${a.patient?.firstName || ''} ${a.patient?.lastName || ''}`, doctorName: `Dr. ${a.doctor?.firstName || ''} ${a.doctor?.lastName || ''}`, status: a.status })), columns: ['appointmentNumber', 'time', 'patientName', 'doctorName', 'status'] };
    } else if (reportType === 'financial') {
      const list = await db.query.bills.findMany({
        where: and(gte(bills.billDate, startDate.toISOString().split('T')[0]), lte(bills.billDate, endDate.toISOString().split('T')[0])),
        with: { patient: true },
      });
      reportData = { ...reportData, title: 'Financial Report', summary: { totalBills: list.length }, tableData: list.map(b => ({ billNumber: b.billNumber, patient: `${b.patient?.firstName || ''} ${b.patient?.lastName || ''}`, total: b.totalAmount, status: b.paymentStatus })), columns: ['billNumber', 'patient', 'total', 'status'] };
    }

    return NextResponse.json(reportData);
  } catch (error) {
    return NextResponse.json({ error: 'Report generation failed' }, { status: 500 });
  }
}
