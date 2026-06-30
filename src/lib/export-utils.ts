import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function exportToCSV(data: any[], filename: string) {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const cell = row[header]?.toString() || '';
        return cell.includes(',') ? `"${cell}"` : cell;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(data: any[], columns: any[], title: string) {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  
  // Add timestamp
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 25);

  // Prepare table data
  const tableData = data.map(row => 
    columns.map(col => row[col.accessorKey]?.toString() || '')
  );

  // Add table
  (doc as any).autoTable({
    head: [columns.map(col => col.header)],
    body: tableData,
    startY: 30,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [0, 136, 254],
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
  });

  // Save PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString()}.pdf`);
}

export function printTable(tableId: string) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const table = document.getElementById(tableId);
  if (!table) return;

  const styles = `
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; }
      @media print {
        .no-print { display: none; }
      }
    </style>
  `;

  printWindow.document.write(`
    <html>
      <head>
        <title>Print Table</title>
        ${styles}
      </head>
      <body>
        <h1>Hospital MIS - Report</h1>
        <p>Printed: ${new Date().toLocaleString()}</p>
        ${table.outerHTML}
        <button class="no-print" onclick="window.print()" style="margin-top: 20px;">
          Print
        </button>
      </body>
    </html>
  `);
  
  printWindow.document.close();
}