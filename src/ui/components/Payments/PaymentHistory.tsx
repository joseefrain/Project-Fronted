import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import './styles.scss';
import { ICredit } from '../../../interfaces/creditsInterfaces';
import { getFormatedDate } from '../../../shared/helpers/transferHelper';

export interface IPaymentHistoryProps {
  creditSelected: ICredit | null;
}

export function PaymentHistory({ creditSelected }: IPaymentHistoryProps) {
  return (
    <Card className="credit__history">
      <CardHeader>
        <CardTitle className="font-onest">Historial de Pagos</CardTitle>
      </CardHeader>
      <CardContent className="card__content">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center font-onest"># Cuota</TableHead>
              <TableHead className="text-center font-onest">Fecha</TableHead>
              <TableHead className="text-center font-onest">Monto</TableHead>
              <TableHead className="text-center font-onest">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {creditSelected?.cuotasCredito
              .filter((cuota) => cuota.estadoPago === 'PAGADO')
              .map((payment, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center font-onest">
                    {payment.numeroCuota}
                  </TableCell>
                  <TableCell className="text-center font-onest">
                    {getFormatedDate(payment.fechaCuota)}
                  </TableCell>
                  <TableCell className="text-center font-onest">
                    ${payment.montoCuota.$numberDecimal}
                  </TableCell>
                  <TableCell className="text-center font-onest">
                    {payment.estadoPago}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
