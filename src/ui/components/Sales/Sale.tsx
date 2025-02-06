import { useAppSelector } from '@/app/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Branch, ITablaBranch } from '@/interfaces/branchInterfaces';
import { IProductSale } from '@/interfaces/salesInterfaces';
import { cn } from '@/lib/utils';
import {
  applyDiscounts,
  handleProductSaleAlerts,
} from '@/shared/helpers/salesHelper';
import { Check, ChevronsUpDown, Plus, ShoppingBag, Truck } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ProductSale } from './ProductSale';
import './style.scss';
import { toast, Toaster } from 'sonner';
import { GetBranches } from '../../../shared/helpers/Branchs';
import {
  fetchBranchById,
  updateSelectedBranch,
} from '../../../app/slices/branchSlice';
import { store } from '../../../app/store';
import { getDiscountsByBranch } from '../../../app/slices/salesSlice';
import { getSelectedBranchFromLocalStorage } from '../../../shared/helpers/branchHelpers';

export interface ISaleProps {
  productSale: IProductSale[];
  setProductSale: React.Dispatch<React.SetStateAction<IProductSale[]>>;
}

export const Sale = ({ productSale, setProductSale }: ISaleProps) => {
  const [products, setProducts] = useState<ITablaBranch[]>([]);
  const cashierId = useAppSelector((state) => state.auth.signIn.cajaId);
  const user = useAppSelector((state) => state.auth.signIn.user);
  const branchStoraged = getSelectedBranchFromLocalStorage();

  const selectedBranch = useAppSelector(
    (state) => state.branches.selectedBranch
  );
  const discounts = useAppSelector((state) => state.sales.discounts);
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [supplierMode, setSupplierMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ITablaBranch | null>(
    null
  );
  const [buffer, setBuffer] = useState<string>('');

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
      groupId: selectedProduct?.groupId ?? '',
      clientType: supplierMode ? 'Proveedor' : 'Regular',
      inventarioSucursalId: selectedProduct?.inventarioSucursalId ?? '',
      costoUnitario: selectedProduct?.costoUnitario ?? { $numberDecimal: 0 },
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
      discounts ?? {
        descuentosPorProductosGenerales: [],
        descuentosPorGruposGenerales: [],
        descuentosPorGruposEnSucursal: [],
        descuentosPorProductosEnSucursal: [],
      }
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
      const newStock = item.stock - quantity;

      if (item.id === productWithDiscount.productId) {
        handleProductSaleAlerts(
          item.nombre,
          newStock,
          selectedProduct?.puntoReCompra ?? 0
        );
      }

      return item.id === productWithDiscount.productId
        ? { ...item, stock: newStock }
        : item;
    });

    setSelectedProduct((prev) =>
      prev ? { ...prev, stock: prev.stock - quantity } : null
    );

    setProducts(updatedProducts);
    setQuantity(0);
  };

  const handleRemoveProductSale = (productId: string, quantity: number) => {
    let quantityUpd = 0;
    const updatedProductSale = productSale.filter((item) => {
      if (item.productId === productId && item.quantity === quantity) {
        quantityUpd = item.quantity;
        return false;
      }
      return true;
    });
    setProductSale(updatedProductSale);

    const updatedProducts = products.map((item) =>
      item.id === productId
        ? { ...item, stock: item.stock + quantityUpd }
        : item
    );
    setProducts(updatedProducts);
    setSelectedProduct((prev) =>
      prev ? { ...prev, stock: prev.stock + quantityUpd } : null
    );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBranch]);

  const loadProductsByBranch = async (branch: Branch) => {
    const response = await GetBranches(branch._id ?? '');

    store.dispatch(
      updateSelectedBranch({
        ...branch,
        products: response,
      })
    );
    setProducts(response);
    await store.dispatch(getDiscountsByBranch(branch._id ?? ''));
  };

  const handleLoadBranch = (branch: Branch | undefined) => {
    if (branch) {
      loadProductsByBranch(branch);
    } else {
      store.dispatch(updateSelectedBranch(null));
      setProducts([]);
    }
  };

  useEffect(() => {
    const branchId = !user?.sucursalId
      ? (branchStoraged ?? '')
      : (user?.sucursalId._id ?? '');

    store.dispatch(fetchBranchById(branchId)).then((response) => {
      handleLoadBranch(response.payload as Branch);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.sucursalId, cashierId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      if (key === 'Enter') {
        const product = products.find((p) => p.barCode === String(buffer));

        if (product) {
          console.log(product);
          handleSelectProduct(product.id ?? '');
          toast.success(
            `Producto seleccionado: ${product.nombre.toUpperCase()}`
          );
        } else {
          toast.error('Producto no encontrado, intente nuevamente');
        }

        setBuffer('');
      } else {
        setBuffer((prev) => prev + key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buffer, products]);

  return (
    <Card className="font-onest">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag />
          Gestionar Productos
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[80%]">
        <div className="flex items-center mb-4 space-x-2">
          <Switch
            className="p-0"
            checked={supplierMode}
            onCheckedChange={setSupplierMode}
          />
          <Label className="flex items-center">
            <Truck className="w-4 h-4 mr-2" />
            Modo Proveedor
          </Label>
        </div>
        <div className="containerInputs">
          <div className="flex flex-col w-full gap-1">
            <Label className="text-xs">Producto</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  disabled={products.length === 0}
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="justify-between w-full"
                >
                  {selectedProduct
                    ? selectedProduct.nombre
                    : 'Selecciona producto'}
                  <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput
                    placeholder="Buscar producto"
                    className="font-onest"
                  />
                  <CommandList className="product__list">
                    <CommandEmpty className="p-4 text-sm text-gray-800 font-onest">
                      Producto no encontrado.
                    </CommandEmpty>
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
                          className="font-onest"
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
            <Label className="text-xs">Disponible</Label>
            <Input
              className="w-full text-center"
              value={selectedProduct ? selectedProduct.stock : 0}
              disabled
            />
          </div>
          <div className="flex flex-col gap-1 w-[20%]">
            <Label className="text-xs">Cantidad</Label>
            <Input
              type="number"
              id="branch-select"
              value={selectedProduct ? quantity : 0}
              disabled={!selectedProduct}
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
            <div className="flex flex-col gap-1 w-[25%]">
              <Label className="text-xs">Precio</Label>
              <Input
                type="number"
                id="branch-select"
                value={selectedProduct ? price : 0}
                disabled={!selectedProduct}
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
              disabled={!selectedProduct || quantity <= 0 || price <= 0}
              onClick={handleAddProductSale}
            >
              <Plus />
            </Button>
          </div>
        </div>
        <div className="product__sale__list">
          <ProductSale
            products={productSale}
            handleRemoveProductSale={handleRemoveProductSale}
          />
        </div>
      </CardContent>
      <Toaster richColors />
    </Card>
  );
};
