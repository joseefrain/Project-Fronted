import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Check,
  ChevronsUpDown,
  CirclePlus,
  ShoppingBag,
  ShoppingCart,
  Truck,
} from 'lucide-react';
import { ProductSale } from './ProductSale';
import { ITablaBranch } from '@/interfaces/branchInterfaces';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import './style.scss';
import { useAppSelector } from '@/app/hooks';
import {
  applyDiscounts,
  handleProductSaleAlerts,
} from '@/shared/helpers/salesHelper';
import { toast, Toaster } from 'sonner';
import { IProductSale, ISale } from '@/interfaces/salesInterfaces';
import { createSale } from '@/app/slices/salesSlice';
import { store } from '@/app/store';

export interface ISaleProps {
  products: ITablaBranch[];
  setProducts: React.Dispatch<React.SetStateAction<ITablaBranch[]>>;
}

export const Sale = ({ products, setProducts }: ISaleProps) => {
  const user = useAppSelector((state) => state.auth.signIn.user);
  const selectedBranch = useAppSelector(
    (state) => state.branches.selectedBranch
  );
  const discounts = useAppSelector((state) => state.sales.branchDiscounts);

  const [procesingSale, setProcesingSale] = useState(false);
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [supplierMode, setSupplierMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ITablaBranch | null>(
    null
  );
  const [productSale, setProductSale] = useState<IProductSale[]>([]);

  const handleSelectProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId);

    if (!product) return setSelectedProduct(null);

    setSelectedProduct(product);
    setPrice(Number(product.precio.$numberDecimal));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    product
      ? setQuantity(quantity > product.stock ? product.stock : quantity)
      : setQuantity(0);
  };

  const handlePriceChange = (productId: string, price: number) => {
    const product = products.find((p) => p.id === productId);
    product ? setPrice(price) : setPrice(0);
  };

  const handleAddProductSale = () => {
    const newProductSale: IProductSale = {
      productId: selectedProduct?.id ?? '',
      productName: selectedProduct?.nombre ?? '',
      quantity: quantity,
      price: price,
      discount: null,
      groupId: selectedProduct?.grupoId ?? '',
      clientType: supplierMode ? 'Proveedor' : 'Regular',
    };

    const isExistentProduct = productSale.find(
      (p) =>
        p.productId === newProductSale.productId &&
        p.price === newProductSale.price
    );

    if (isExistentProduct) {
      newProductSale.quantity =
        newProductSale.quantity + isExistentProduct.quantity;
    }

    const productWithDiscount = applyDiscounts(
      selectedProduct?.sucursalId ?? '',
      newProductSale,
      discounts
    );

    if (isExistentProduct) {
      const updatedProductSale = productSale.map((item) =>
        item.productId === productWithDiscount.productId &&
        item.price === productWithDiscount.price
          ? productWithDiscount
          : item
      );
      setProductSale(updatedProductSale);
    } else {
      setProductSale([...productSale, productWithDiscount]);
    }

    const updatedProducts = products.map((item) => {
      const newStock = item.stock - productWithDiscount.quantity;

      handleProductSaleAlerts(
        item.nombre,
        newStock,
        selectedProduct?.puntoReCompra ?? 0
      );

      return item.id === productWithDiscount.productId
        ? { ...item, stock: newStock }
        : item;
    });

    setProducts(updatedProducts);
    setQuantity(0);
  };

  const handleRemoveProductSale = (productId: string) => {
    let quantity = 0;
    const updatedProductSale = productSale.filter((item) => {
      if (item.productId === productId) {
        quantity = item.quantity;
        return false;
      }
      return true;
    });
    setProductSale(updatedProductSale);

    const updatedProducts = products.map((item) =>
      item.id === productId ? { ...item, stock: item.stock + quantity } : item
    );
    setProducts(updatedProducts);
  };

  const saleSummary = useMemo(() => {
    if (productSale.length === 0)
      return { subTotal: 0, totalDiscount: 0, total: 0 };

    const subTotal = productSale.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalDiscount = productSale.reduce(
      (sum, item) => sum + (item.discount?.amount || 0),
      0
    );
    const total = subTotal - totalDiscount;

    return {
      subTotal,
      totalDiscount,
      total,
    };
  }, [productSale]);

  const handleProccessSale = () => {
    setProcesingSale(true);
    const newSale: ISale = {
      userId: user?._id ?? '',
      sucursalId: user?.sucursalId?._id ?? selectedBranch?._id,
      products: productSale,
      subtotal: saleSummary.subTotal,
      total: saleSummary.total,
      discount: saleSummary.totalDiscount,
    };

    const request = store
      .dispatch(createSale(newSale))
      .unwrap()
      .catch(() => {
        setProcesingSale(false);
        return Promise.reject();
      })
      .then(() => {
        setTimeout(() => {
          setProductSale([]);
          setProcesingSale(false);
        }, 1000);
      });

    toast.promise(request, {
      loading: 'Procesando...',
      success: 'Venta procesada exitosamente',
      error: 'Error al procesar la venta',
    });
  };

  const cleanFieldsByBranchChange = () => {
    setProductSale([]);
    setQuantity(0);
    setPrice(0);
    setSupplierMode(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    cleanFieldsByBranchChange();
  }, [selectedBranch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag />
          Gestionar venta
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[80%]">
        <div className="flex items-center mb-4 space-x-2">
          <Switch
            className="p-0"
            disabled={procesingSale}
            checked={supplierMode}
            onCheckedChange={setSupplierMode}
          />
          <Label className="flex items-center">
            <Truck className="w-4 h-4 mr-2" />
            Modo Proveedor
          </Label>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex flex-col w-full gap-1">
            <Label className="text-xs">Producto</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  disabled={procesingSale || products.length === 0}
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="justify-between w-full"
                >
                  {selectedProduct
                    ? products.find(
                        (product) => product.id === selectedProduct.id
                      )?.nombre
                    : 'Selecciona producto'}
                  <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Buscar producto" />
                  <CommandList className="product__list">
                    <CommandEmpty>Producto no encontrado.</CommandEmpty>
                    <CommandGroup>
                      {products.map((product) => (
                        <CommandItem
                          key={product.id}
                          value={product.nombre}
                          onSelect={() => {
                            handleSelectProduct(
                              product.id === selectedProduct?.id
                                ? ''
                                : product.id!
                            );
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              selectedProduct?.id === product.id
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {product.nombre}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-1 w-[20%]">
            <Label className="text-xs">Cantidad</Label>
            <Input
              type="number"
              id="branch-select"
              value={selectedProduct ? quantity : 0}
              disabled={!selectedProduct || procesingSale}
              onChange={(e) =>
                handleQuantityChange(
                  selectedProduct?.id!,
                  Number(e.target.value)
                )
              }
              min={0}
              max={selectedProduct?.stock ?? 0}
              className="w-full"
            />
          </div>
          {supplierMode && (
            <div className="flex flex-col gap-1 w-[20%]">
              <Label className="text-xs">Precio</Label>
              <Input
                type="number"
                id="branch-select"
                value={selectedProduct ? price : 0}
                disabled={!selectedProduct || procesingSale}
                onChange={(e) =>
                  handlePriceChange(
                    selectedProduct?.id!,
                    Number(e.target.value)
                  )
                }
                min={0}
                className="w-full"
              />
            </div>
          )}
          <div className="flex flex-col justify-end gap-1 w-[10%]">
            <Button
              className="w-full text-xs"
              disabled={
                !selectedProduct || quantity <= 0 || price <= 0 || procesingSale
              }
              onClick={handleAddProductSale}
            >
              <CirclePlus />
            </Button>
          </div>
        </div>
        <div className="product__sale__list">
          <ProductSale
            procesingSale={procesingSale}
            products={productSale}
            handleRemoveProductSale={handleRemoveProductSale}
          />
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between py-0 px-[1.5rem]">
        <span>Subtotal: ${saleSummary.subTotal.toFixed(2)}</span>
        <span className="text-green-600">
          Descuento: ${saleSummary.totalDiscount.toFixed(2)}
        </span>
        <span className="font-bold">
          Total: ${saleSummary.total.toFixed(2)}
        </span>
        <Button
          disabled={productSale.length === 0 || procesingSale}
          onClick={handleProccessSale}
          className="h-[2rem]"
        >
          Procesar
          <ShoppingCart />
        </Button>
      </CardFooter>
      <Toaster richColors />
    </Card>
  );
};
