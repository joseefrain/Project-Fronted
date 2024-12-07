import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PaymentHistory() {
  const payments = [
    { date: '01/06/2023', amount: 500, type: 'Cuota', status: 'Pagado' },
    { date: '15/05/2023', amount: 200, type: 'Abono', status: 'Procesado' },
    { date: '01/05/2023', amount: 500, type: 'Cuota', status: 'Pagado' },
    { date: '20/04/2023', amount: 100, type: 'Abono', status: 'Procesado' },
    { date: '01/04/2023', amount: 500, type: 'Cuota', status: 'Pagado' },
    { date: '01/06/2023', amount: 500, type: 'Cuota', status: 'Pagado' },
    { date: '15/05/2023', amount: 200, type: 'Abono', status: 'Procesado' },
    { date: '01/05/2023', amount: 500, type: 'Cuota', status: 'Pagado' },
    { date: '20/04/2023', amount: 100, type: 'Abono', status: 'Procesado' },
    { date: '01/04/2023', amount: 500, type: 'Cuota', status: 'Pagado' },
  ];

  return (
    <Card className="h-[38%]">
      <CardHeader>
        <CardTitle>Historial de Pagos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 h-[84.5%]  overflow-y-scroll">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment, index) => (
              <TableRow key={index}>
                <TableCell>{payment.date}</TableCell>
                <TableCell>${payment.amount}</TableCell>
                <TableCell>{payment.type}</TableCell>
                <TableCell>{payment.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
