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
import { Branch, ITablaBranch } from '@/interfaces/branchInterfaces';
import { IProductSale } from '@/interfaces/salesInterfaces';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Plus, ShoppingBag } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ProductSale } from '../Sales/ProductSale';
import { AddProduct } from '../Table/sear';
import { store } from '../../../app/store';
import { toast, Toaster } from 'sonner';
import { getAllGroupsSlice } from '../../../app/slices/groups';
import './style.scss';
import { useRoleAccess } from '../../../shared/hooks/useRoleAccess';
import { PAGES_MODULES } from '../../../shared/helpers/roleHelper';
import { createProduct } from '../../../app/slices/productsSlice';
import { getSelectedBranchFromLocalStorage } from '../../../shared/helpers/branchHelpers';
import { GetBranches } from '../../../shared/helpers/Branchs';
import {
  fetchBranchById,
  updateSelectedBranch,
} from '../../../app/slices/branchSlice';
import { getDiscountsByBranch } from '../../../app/slices/salesSlice';

export interface ISaleProps {
  productSale: IProductSale[];
  setProductSale: React.Dispatch<React.SetStateAction<IProductSale[]>>;
}

export const Purchase = ({ productSale, setProductSale }: ISaleProps) => {
  const cashierId = useAppSelector((state) => state.auth.signIn.cajaId);
  const user = useAppSelector((state) => state.auth.signIn.user);
  const branchStoraged = getSelectedBranchFromLocalStorage();
  const [products, setProducts] = useState<ITablaBranch[]>([]);

  const access = useRoleAccess(PAGES_MODULES.PRODUCTOS);
  const selectedBranch = useAppSelector(
    (state) => state.branches.selectedBranch
  );
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<ITablaBranch | null>(
    null
  );
  const [buffer, setBuffer] = useState<string>('');

  const handleSelectProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId);

    if (!product) return setSelectedProduct(null);

    setSelectedProduct(product);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    product ? setQuantity(quantity) : setQuantity(0);
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
      groupId: '',
      clientType: 'Proveedor',
      inventarioSucursalId: selectedProduct?.inventarioSucursalId ?? '',
      //@ts-ignore
      costoUnitario: price,
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

    if (isExistentProduct) {
      const updatedProductSale = productSale.map((item) =>
        item.productId === newProductSale.productId &&
        item.price === newProductSale.price
          ? newProductSale
          : item
      );
      setProductSale(updatedProductSale);
    } else {
      setProductSale([...productSale, newProductSale]);
    }
  };

  const handleRemoveProductSale = (productId: string, quantity: number) => {
    const updatedProductSale = productSale.filter((item) => {
      if (item.productId === productId && item.quantity === quantity) {
        return false;
      }
      return true;
    });
    setProductSale(updatedProductSale);
  };

  const cleanFieldsByBranchChange = () => {
    setProductSale([]);
    setQuantity(0);
    setPrice(0);
    setSelectedProduct(null);
  };

  useEffect(() => {
    cleanFieldsByBranchChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBranch]);

  useEffect(() => {
    store.dispatch(getAllGroupsSlice()).unwrap();
  }, []);

  const GroupsAll = useAppSelector((state) => state.categories.groups);
  const [selectedGroup, setSelectedGroup] = useState<{
    nombre: string;
    _id: string;
  } | null>(null);

  const handleSelectChange = (value: string) => {
    const selectedBranchId = value;
    const branch = GroupsAll.find((b) => b._id === selectedBranchId);

    if (branch) {
      setSelectedGroup({ nombre: branch.nombre, _id: branch._id ?? '' });
    }
  };

  const handleAddProduct = async (newProduct: ITablaBranch) => {
    try {
      const request = store
        .dispatch(createProduct(newProduct))
        .unwrap()
        .catch(() => {
          return Promise.reject();
        })
        .then((res) => {
          const price = res.precio as unknown as number;

          setProducts((prevProducts) => [
            ...prevProducts,
            {
              ...res,
              precio: { $numberDecimal: price },
            },
          ]);
        });

      toast.promise(request, {
        loading: 'Procesando...',
        success: `Producto ${newProduct.nombre} creado exitosamente`,
        error: 'Error al procesar la venta',
      });
    } catch (error) {
      toast.error('Error al crear producto:' + error);
    }
  };

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

  return (
    <Card className="font-onest">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag />
            Gestionar Productos
          </CardTitle>
        </div>
        {access.create && (
          <AddProduct
            groups={GroupsAll}
            sucursalId={selectedBranch?._id}
            selectedGroup={selectedGroup}
            onAddProduct={handleAddProduct}
            handleSelectChange={handleSelectChange}
          />
        )}
      </CardHeader>
      <CardContent className="h-[80%]">
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
          <div className="flex flex-col gap-1 w-[30%]">
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
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-1 w-[30%]">
            <Label className="text-xs">Precio</Label>
            <Input
              type="number"
              id="branch-select"
              value={selectedProduct ? price : 0}
              disabled={!selectedProduct}
              onChange={(e) =>
                handlePriceChange(selectedProduct?.id!, Number(e.target.value))
              }
              min={0}
              className="w-full"
            />
          </div>
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
            type="COMPRA"
            products={productSale}
            handleRemoveProductSale={handleRemoveProductSale}
          />
        </div>
      </CardContent>
      <Toaster richColors position="bottom-right" />
    </Card>
  );
};
