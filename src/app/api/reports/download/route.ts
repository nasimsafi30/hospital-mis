import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { reportType, template, dateRange, format } = await request.json();

    const generateResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: request.headers.get('cookie') || '' },
      body: JSON.stringify({ reportType, template, dateRange }),
    });

    const reportData = await generateResponse.json();
    const headers = (reportData.columns || []).join(',');
    const rows = (reportData.tableData || []).map((row: any) =>
      (reportData.columns || []).map((col: string) => `"${row[col] || ''}"`).join(',')
    );
    const csv = [headers, ...rows].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="report.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}
