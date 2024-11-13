import { useAppSelector } from '@/app/hooks';
import { getSalesByBranch } from '@/app/slices/salesSlice';
import { store } from '@/app/store';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getFormatedDate } from '@/shared/helpers/transferHelper';
import { Eye, History, ShoppingBasket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSelectedBranchFromLocalStorage } from '../../../shared/helpers/branchHelpers';
import Pagination from '../../../shared/components/ui/Pagination/Pagination';

export const SaleHistory = () => {
  const selectedBranchFromLocalStorage = getSelectedBranchFromLocalStorage();
  const salesHistory = useAppSelector((state) => state.sales.branchSales);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    store
      .dispatch(getSalesByBranch(selectedBranchFromLocalStorage ?? ''))
      .unwrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = salesHistory?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((salesHistory ?? []).length / itemsPerPage);

  return (
    <div className="flex flex-col w-full">
      <main className="flex-1 p-4 md:p-6">
        <Card className="mt-4 h-[36rem]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History />
              Historial de ventas
            </CardTitle>
            <CardDescription>
              Ver los detalles de las ventas realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead>Descuento</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Productos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((sale, index) => (
                  <TableRow key={index} className="h-[50px]">
                    <TableCell>{sale.userId}</TableCell>
                    <TableCell>{getFormatedDate(new Date())}</TableCell>
                    <TableCell>${sale.subtotal.toFixed(2)}</TableCell>
                    <TableCell>${sale.discount.toFixed(2)}</TableCell>
                    <TableCell>${sale.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl rounded-[4px] min-h-[12.5rem]">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 uppercase">
                              <ShoppingBasket />
                              Productos
                            </DialogTitle>
                          </DialogHeader>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Producto</TableHead>
                                <TableHead className="text-center">
                                  Tipo de cliente
                                </TableHead>
                                <TableHead className="text-center">
                                  Cantidad
                                </TableHead>
                                <TableHead className="text-center">
                                  Precio
                                </TableHead>
                                <TableHead className="text-center">
                                  Descuento
                                </TableHead>
                                <TableHead className="text-center">
                                  Total
                                </TableHead>
                              </TableRow>
                            </TableHeader>

                            <TableBody>
                              {sale.products.map((item) => (
                                <TableRow key={item.productId}>
                                  <TableCell>{item.productName}</TableCell>
                                  <TableCell className="text-center">
                                    {item.clientType}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {item.quantity}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    ${item.price.toFixed(2)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {item.discount &&
                                    item.discount?.amount > 0 ? (
                                      <span className="text-green-600">
                                        $
                                        {(
                                          item.quantity * item.discount.amount
                                        ).toFixed(2)}{' '}
                                      </span>
                                    ) : (
                                      '-'
                                    )}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    $
                                    {(
                                      item.price * item.quantity -
                                      (item.discount?.amount || 0) *
                                        item.quantity
                                    ).toFixed(2)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};
