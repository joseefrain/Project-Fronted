import { useAppSelector } from '@/app/hooks';
import { getPurchasesByBranch } from '@/app/slices/salesSlice';
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

export const PurchaseHistory = () => {
  const user = useAppSelector((state) => state.auth.signIn.user);
  const branchStoraged = getSelectedBranchFromLocalStorage();
  const purchasesHistory = useAppSelector(
    (state) => state.sales.branchPurchases
  );

  useEffect(() => {
    store
      .dispatch(
        getPurchasesByBranch(user?.sucursalId?._id ?? branchStoraged ?? '')
      )
      .unwrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="mt-4 h-[34rem] font-onest">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History />
          Historial de Compras
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
              <TableHead>Total</TableHead>
              <TableHead>Productos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchasesHistory.map((sale, index) => (
              <TableRow key={index} className="h-[50px]">
                <TableCell>{sale.userId}</TableCell>
                <TableCell>{getFormatedDate(new Date())}</TableCell>
                <TableCell>${sale.subtotal.toFixed(2)}</TableCell>
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
                              Tipo de proveedor
                            </TableHead>
                            <TableHead className="text-center">
                              Cantidad
                            </TableHead>
                            <TableHead className="text-center">
                              Precio
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
                                ${item.price.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-center">
                                $
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
