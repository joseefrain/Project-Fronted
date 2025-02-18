import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../app/hooks';
import {
  getHistoryCashiers,
  ICajaBrach,
} from '../../../../app/slices/cashRegisterSlice';
import { store } from '../../../../app/store';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IRoleAccess } from '../../../../interfaces/roleInterfaces';
import { CardFooter } from '../../../../components/ui/card';
import Pagination from '../../../../shared/components/ui/Pagination/Pagination';
import { getFormatedDate } from '../../../../shared/helpers/transferHelper';

interface IHistoryCahier {
  data: ICajaBrach;
  access: IRoleAccess;
}

export const HistoryCahierCount = ({ data, access }: IHistoryCahier) => {
  const dataHisotry = useAppSelector((state) => state.boxes.historyCashier);

  const [currentPage, setCurrentPage] = useState(1);
  console.log(dataHisotry, 'dataHisotry');

  useEffect(() => {
    store.dispatch(getHistoryCashiers(data._id as string)).unwrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataHisotry?.slice(indexOfFirstItem, indexOfLastItem);
  const paginatedData = Math.ceil(dataHisotry?.length / itemsPerPage);
  return (
    <>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-center">Total Ventas</TableHead>
              {(access.update || access.delete) && (
                <>
                  <TableHead className="text-center">Total Compras</TableHead>
                  <TableHead className="text-center">Monto Esperado</TableHead>
                </>
              )}
              <TableHead className="text-center">Total Egreso</TableHead>
              <TableHead className="text-center">Total Ingreso</TableHead>
              <TableHead className="text-center">Compras</TableHead>
              <TableHead className="text-center">Ventas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataHisotry?.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>
                  {entry.fecha ? getFormatedDate(new Date(entry.fecha)) : 'N/A'}
                </TableCell>
                <TableCell className="text-center">
                  C$
                  {entry.totalVentas?.$numberDecimal?.toString()}
                </TableCell>
                <TableCell className="text-center">
                  {entry.totalCompras?.$numberDecimal?.toString()}
                </TableCell>
                <TableCell className="text-center">
                  {entry.montoFinalSistema?.$numberDecimal?.toString()}
                </TableCell>
                <TableCell className="text-center">
                  {entry.totalEgresos?.$numberDecimal?.toString()}
                </TableCell>
                <TableCell className="text-center">
                  {entry.totalIngresos?.$numberDecimal?.toString()}
                </TableCell>
                <TableCell className="text-center">
                  {entry.compras.length}
                </TableCell>
                <TableCell className="text-center">
                  {entry.ventas.length}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <CardFooter className="flex items-center justify-between pt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={paginatedData}
            onPageChange={setCurrentPage}
          />
        </CardFooter>
      </div>
    </>
  );
};
