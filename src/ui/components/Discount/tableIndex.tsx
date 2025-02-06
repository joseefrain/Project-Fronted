import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { getFormatedDate } from '@/shared/helpers/transferHelper';
import { Button } from '../../../components/ui/button';
import { IDescuentoMapeadoExtendido } from '../../../interfaces/salesInterfaces';

interface TableIndexProps {
  currentItems: IDescuentoMapeadoExtendido[];
  removeDiscount: (id: string) => void;
  editDescuentoById: (_id: string) => void;
  access: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
}

export const TableIndex = ({
  currentItems,
  removeDiscount,
  editDescuentoById,
  access,
}: TableIndexProps) => {
  return (
    <Table className="min-w-full divide-y divide-gray-200">
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Tipo de Descuento</TableHead>
          <TableHead>Tipo Descuento</TableHead>
          <TableHead>Valor Descuento</TableHead>
          <TableHead>Minimo Tipo</TableHead>
          <TableHead>Valor Minimo</TableHead>
          <TableHead>Fecha Inicio</TableHead>
          <TableHead>Fecha Fin</TableHead>
          {(access.update || access.delete) && (
            <TableHead className="text-center">Acciones</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentItems.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="text-center w-full">
              No hay descuentos
            </TableCell>
          </TableRow>
        )}
        {currentItems.map((discount) => (
          <TableRow key={discount.descuentoId._id}>
            <TableCell className="px-4 py-2">
              {discount.descuentoId.nombre}
            </TableCell>
            <TableCell className="px-4 py-2">
              {discount.tipoDescuento}
            </TableCell>
            <TableCell className="px-4 py-2">
              {discount.descuentoId.tipoDescuento}
            </TableCell>
            <TableCell className="px-4 py-2">
              {discount.descuentoId.valorDescuento}
            </TableCell>
            <TableCell className="px-4 py-2">
              {discount.descuentoId.minimiType}
            </TableCell>
            <TableCell className="px-4 py-2">
              {discount.descuentoId.minimiType === 'compra'
                ? discount.descuentoId?.minimoCompra?.$numberDecimal
                : discount.descuentoId.minimoCantidad}
            </TableCell>
            <TableCell className="px-4 py-2">
              {getFormatedDate(discount.descuentoId.fechaInicio)}
            </TableCell>
            <TableCell className="px-4 py-2">
              {getFormatedDate(discount.descuentoId.fechaFin)}
            </TableCell>
            {(access.update || access.delete) && (
              <TableCell className="flex items-center justify-center gap-2 px-4 py-2">
                {access.update && (
                  <Button
                    onClick={() => editDescuentoById(discount.descuentoId._id)}
                    variant="outline"
                    size="sm"
                    className="text-blue-600"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                )}
                {access.delete && (
                  <Button
                    onClick={() => removeDiscount(discount.descuentoId._id)}
                    className="w-8 h-8"
                    variant="outline"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
