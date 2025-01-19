import { useAppSelector } from '@/app/hooks';
import { getSalesByBranch } from '@/app/slices/salesSlice';
import { store } from '@/app/store';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
import { useEffect } from 'react';
import { getSelectedBranchFromLocalStorage } from '../../../shared/helpers/branchHelpers';

export const SaleHistory = () => {
  const branchStoraged = getSelectedBranchFromLocalStorage();
  const user = useAppSelector((state) => state.auth.signIn.user);
  const salesHistory = useAppSelector((state) => state.sales.branchSales);
  const selectCoins = useAppSelector(
    (state) => state.coins.selectedCoin?.simbolo
  );

  useEffect(() => {
    store
      .dispatch(getSalesByBranch(user?.sucursalId?._id ?? branchStoraged ?? ''))
      .unwrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="mt-4 h-[34rem] font-onest">
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
            {salesHistory.map((sale, index) => (
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
                    <DialogContent className="font-onest max-w-3xl rounded-[4px] min-h-[12.5rem]">
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
                            <TableHead className="text-center">Total</TableHead>
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
                                {selectCoins} {item.price.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-center">
                                {item.discount && item.discount?.amount > 0 ? (
                                  <span className="text-green-600">
                                    {selectCoins}
                                    {(
                                      item.quantity * item.discount.amount
                                    ).toFixed(2)}{' '}
                                  </span>
                                ) : (
                                  '-'
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                {selectCoins}
                                {(
                                  item.price * item.quantity -
                                  (item.discount?.amount || 0) * item.quantity
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
    </Card>
  );
};
