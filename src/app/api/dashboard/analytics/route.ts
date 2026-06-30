import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    overview: {
      totalPatients: 100,
      appointmentsToday: 25,
      totalRevenue: 50000,
      todayRevenue: 5000,
    },
    timestamp: new Date().toISOString(),
  });
}
