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
import { IProductSale } from '@/interfaces/salesInterfaces';
import { useAppSelector } from '../../../app/hooks';

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
  const selectedCoin = useAppSelector(
    (state) => state.coins.selectedCoin?.simbolo
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Producto</TableHead>
          <TableHead className="text-center">Cantidad</TableHead>
          <TableHead className="text-center">Costo unitario</TableHead>
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
          <TableRow key={item.productId + item.price}>
            <TableCell>{item.productName}</TableCell>
            <TableCell className="text-center">{item.quantity}</TableCell>
            <TableCell className="text-center">
              {selectedCoin}
              {item?.costoUnitario?.$numberDecimal}
            </TableCell>
            <TableCell className="text-center">
              {selectedCoin}
              {item.price.toFixed(2)}
            </TableCell>
            {type === 'VENTA' && (
              <TableCell className="text-center">
                {item.discount && item.discount?.amount > 0 ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-green-600">
                      {selectedCoin} {item.discount.amount.toFixed(2)} (
                      {item.discount.percentage}
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
                          {item.discount.percentage}%
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
              {selectedCoin}
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
