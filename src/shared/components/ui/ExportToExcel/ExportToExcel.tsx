import * as XLSX from 'xlsx';
import { Button } from '../../../../components/ui/button';

interface ExportToExcelProps {
  data: any[];
  columns: { key: string; label: string }[];
  filename: string;
  totalRow?: { label: string; value: number | string };
}

export const ExportToExcel = ({
  data,
  columns,
  filename,
  totalRow,
}: ExportToExcelProps) => {
  const handleExport = () => {
    const worksheetData = [
      columns.map((col) => col.label),
      ...data.map((row) => columns.map((col) => row[col.key])),
    ];

    if (totalRow) {
      const totalRowData = columns.map((col, index) =>
        index === columns.length - 2
          ? totalRow.label
          : index === columns.length - 1
            ? totalRow.value
            : ''
      );
      worksheetData.push(totalRowData);
    }

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();

    const range = XLSX.utils.decode_range(ws['!ref']!);
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[cellAddress]) continue;

      ws[cellAddress].s = {
        font: { bold: true, color: { rgb: '#003022' } },
        fill: { fgColor: { rgb: '#0000FF' } },
        alignment: { horizontal: 'center', vertical: 'center' },
      };
    }

    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(wb, filename);
  };

  return (
    <Button className="h-8" onClick={handleExport}>
      Exportar a Excel
    </Button>
  );
};
