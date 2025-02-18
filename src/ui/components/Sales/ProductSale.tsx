import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { BadgeInfo, CircleDollarSign, Trash2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { dataCoins, IProductSale } from '@/interfaces/salesInterfaces';
import { store } from '../../../app/store';

export interface IProductSaleProps {
  type?: 'VENTA' | 'COMPRA';
  products: IProductSale[];
  handleRemoveProductSale: (productId: string, quantity: number) => void;
}

export const ProductSale = ({
  type = 'VENTA',
  products,
  handleRemoveProductSale,
}: IProductSaleProps) => {
  const coin = dataCoins.currentS;
  const isRoot = store.getState().auth.signIn.user?.role === 'ROOT';

  return (
    <Table className="">
      <TableHeader>
        <TableRow>
          <TableHead>Producto</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead className="text-center">Cantidad</TableHead>
          {((type === 'VENTA' && isRoot) || type === 'COMPRA') && (
            <TableHead className="text-center">Costo unitario</TableHead>
          )}
          <TableHead className="text-center">Precio ud.</TableHead>
          {type === 'VENTA' && (
            <TableHead className="text-center">Descuento</TableHead>
          )}
          <TableHead className="text-center">Total</TableHead>
          <TableHead className="text-center"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((item) => (
          <TableRow key={item.productId + item.price} className="h-[50px]">
            <TableCell>{item.productName}</TableCell>
            <TableCell className="text-center">
              {item.groupName ?? '-'}
            </TableCell>
            <TableCell>{item.descripcion}</TableCell>
            <TableCell className="text-center">{item.quantity}</TableCell>
            {((type === 'VENTA' && isRoot) || type === 'COMPRA') && (
              <TableCell className="text-center">
                {coin}
                {typeof item?.costoUnitario === 'object' &&
                item?.costoUnitario?.$numberDecimal
                  ? parseFloat(item.costoUnitario.$numberDecimal.toString())
                  : Number(item?.costoUnitario)}
              </TableCell>
            )}
            <TableCell className="text-center">
              {coin}
              {item.price.toFixed(2)}
            </TableCell>
            {type === 'VENTA' && (
              <TableCell className="text-center">
                {item.discount ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-green-600">
                      ${item.discount.amount.toFixed(2)} (
                      {item.discount.percentage.toFixed(2)}
                      %)
                    </span>
                    <Popover>
                      <PopoverTrigger className="p-0">
                        <BadgeInfo size={18} />
                      </PopoverTrigger>
                      <PopoverContent className="flex items-center w-auto gap-1 font-sans text-sm">
                        <CircleDollarSign color="green" size={18} />
                        <span>{item.discount.name.toUpperCase()}</span>
                        <span className="font-bold text-green-600">
                          {item.discount.percentage.toFixed(2)}%
                        </span>
                      </PopoverContent>
                    </Popover>
                  </div>
                ) : (
                  '-'
                )}
              </TableCell>
            )}
            <TableCell className="text-center">
              {coin}
              {(
                item.price * item.quantity -
                (item.discount?.amount || 0)
              ).toFixed(2)}
            </TableCell>
            <TableCell className="text-center">
              <Button
                className="border-red-500"
                variant="outline"
                size="icon"
                onClick={() =>
                  handleRemoveProductSale(item.productId, item.quantity)
                }
              >
                <Trash2 color="red" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
