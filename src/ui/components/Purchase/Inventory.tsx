('use client');

import { store } from '@/app/store';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  ICreditMethod,
  ICustomerType,
  IPaymentMethod,
  IProductSale,
  ISale,
  ITypeTransaction,
} from '@/interfaces/salesInterfaces';
import { cn } from '@/lib/utils';
import {
  Banknote,
  CalendarClock,
  Check,
  ChevronsUpDown,
  Clock,
  CreditCard,
  HandCoins,
  Phone,
  Receipt,
  User,
  Users,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { createPurchase } from '../../../app/slices/salesSlice';
import { useAppSelector } from '../../../app/hooks';
import { getEntities } from '../../../app/slices/entities';
import { ConfirmedPurchaseDialog } from './ConfirmedPurchaseDialog';
import './style.scss';
import { useRoleAccess } from '../../../shared/hooks/useRoleAccess';
import { PAGES_MODULES } from '../../../shared/helpers/roleHelper';

export interface ISaleSummary {
  subTotal: number;
  totalDiscount: number;
  total: number;
  change: number;
  totalDiscountPercentage: number;
}

export interface ICashierProps {
  productSale: IProductSale[];
  setProductSale: React.Dispatch<React.SetStateAction<IProductSale[]>>;
}

export const PurchaseCashier = ({
  productSale,
  setProductSale,
}: ICashierProps) => {
  const access = useRoleAccess(PAGES_MODULES.CREDITOS);
  const caja = store.getState().boxes.boxState;
  const user = store.getState().auth.signIn.user;
  const branchSelected = store.getState().branches.selectedBranch;
  const allEntities = useAppSelector((state) => state.entities.data);
  const selectedCoin = useAppSelector(
    (state) => state.coins.selectedCoin?.simbolo
  );

  const registeredCustomers = allEntities.filter(
    (entity) => entity.type === 'supplier'
  );

  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getEntities()).unwrap();
    };
    fetchData();
  }, []);

  const [cashInRegister, setCashInRegister] = useState(0);

  const [customerType, setCustomerType] = useState<ICustomerType>(
    ICustomerType.GENERAL
  );
  const [paymentMethod, setPaymentMethod] = useState<IPaymentMethod>(
    IPaymentMethod.CASH
  );
  const [creditMethod, setCreditMethod] = useState<ICreditMethod>(
    ICreditMethod.PLAZO
  );

  const [open, setOpen] = useState(false);
  const [cashReceived, setCashReceived] = useState<string>('');
  const [months, setMonths] = useState<string>('');
  const [customer, setCustomer] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionDate, setTransactionDate] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [processingSale, setProcessingSale] = useState(false);

  const saleSummary: ISaleSummary = useMemo(() => {
    if (productSale.length === 0)
      return {
        subTotal: 0,
        totalDiscount: 0,
        total: 0,
        change: 0,
        totalDiscountPercentage: 0,
      };

    const subTotal = productSale.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalDiscount = productSale.reduce(
      (sum, item) => sum + (item.discount?.amount || 0),
      0
    );

    const totalDiscountPercentage = (totalDiscount / subTotal) * 100;
    const total = subTotal - totalDiscount;
    const change = cashReceived ? Number(cashReceived) - total : 0;

    return {
      subTotal,
      totalDiscount,
      total,
      change,
      totalDiscountPercentage,
    };
  }, [productSale, cashReceived]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleProcessSale = () => {
    if (!caja || caja.length === 0) {
      toast.error('Debe abrir una caja para procesar la venta.');
      return;
    }

    setProcessingSale(true);
    setTransactionDate(new Date());

    const newSale: ISale = {
      userId: user?._id || '',
      sucursalId: user?.sucursalId?._id || branchSelected?._id || '',
      products: productSale,
      subtotal: saleSummary.subTotal,
      total: saleSummary.total,
      discount: saleSummary.totalDiscount,
      cambioCliente: saleSummary.change,
      monto: Number(cashReceived),
      cajaId: caja && caja[0] ? caja[0]._id : '',
      paymentMethod,
      tipoTransaccion: ITypeTransaction.COMPRA,
    };

    if (paymentMethod === IPaymentMethod.CREDIT) {
      newSale.entidadId = customer ?? '';
      newSale.credito = {
        modalidadCredito: creditMethod,
        plazoCredito: Number(months),
        cuotaMensual: 0,
        pagoMinimoMensual: 0,
      };
    }

    const request = store
      .dispatch(createPurchase(newSale))
      .unwrap()
      .catch(() => {
        setProcessingSale(false);
        return Promise.reject();
      })
      .then(() => {
        setTimeout(() => {
          setIsModalOpen(true);
          paymentMethod !== IPaymentMethod.CREDIT &&
            setCashInRegister((prev) => prev - newSale.total);
        }, 500);
      });

    toast.promise(request, {
      loading: 'Procesando...',
      success: 'Compra procesada exitosamente',
      error: 'Error al procesar la compra',
    });
  };

  const handleCloseModal = () => {
    setCashReceived('');
    setCustomer('');
    setTransactionDate(null);
    setProductSale([]);
    setProcessingSale(false);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!caja) return;
    setCashInRegister(
      parseFloat(caja[0]?.montoEsperado.$numberDecimal.toString()) ?? 0
    );
  }, [caja]);

  return (
    <>
      <Card className="shadow-lg bg-white/80 font-onest dark:bg-gray-800">
        <CardHeader className="flex flex-col justify-between gap-2 pb-4">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-bold text-primary">
              <Receipt />
              {user?.username.toUpperCase()}
            </CardTitle>
            <div className="flex items-center text-sm">
              <Phone className="w-4 h-4 mr-2" />
              <span className="font-semibold">
                {user?.sucursalId?.telefono ?? branchSelected?.telefono}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-2" />
              <span className="font-semibold">
                {currentTime.toLocaleTimeString().toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center w-full gap-4 p-2 m-auto font-sans font-semibold text-center text-black rounded-md shadow-md bg-sky-100">
            <span className="font-medium text-blue-900 uppercase font-onest">
              Efectivo en caja
            </span>
            <span className="font-bold font-onest">
              $
              {!isNaN(cashInRegister)
                ? cashInRegister.toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                  })
                : '0'}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="customer-type">
                Tipo de proveedor
                <span className="text-red-600">*</span>
              </Label>
              <Select
                onValueChange={(value: ICustomerType) => {
                  setCustomerType(value);
                  setCustomer('');
                  value === ICustomerType.GENERAL &&
                    setPaymentMethod(IPaymentMethod.CASH);
                }}
                disabled={processingSale}
              >
                <SelectTrigger id="customer-type">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent className="font-onest">
                  <SelectItem value={ICustomerType.REGISTERED}>
                    <User className="inline w-4 h-4 mr-2" />
                    Registrado
                  </SelectItem>
                  <SelectItem value={ICustomerType.GENERAL}>
                    <Users className="inline w-4 h-4 mr-2" />
                    General
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {customerType === ICustomerType.REGISTERED ? (
              <div className="space-y-2">
                <Label htmlFor="registered-customer">
                  Proveedor
                  <span className="text-red-600">*</span>
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      disabled={processingSale}
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="justify-between w-full"
                    >
                      {customer
                        ? registeredCustomers.find((c) => c._id === customer)
                            ?.generalInformation.name
                        : 'Seleccionar proveedor'}
                      <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput
                        placeholder="Buscar proveedor"
                        className="font-onest"
                      />
                      <CommandList className="product__list">
                        <CommandEmpty className="p-4 text-sm text-gray-800 font-onest">
                          Proveedor no encontrado.
                        </CommandEmpty>
                        <CommandGroup>
                          {registeredCustomers.map((client) => (
                            <CommandItem
                              key={client._id}
                              value={client.generalInformation.name}
                              onSelect={() => {
                                setCustomer(
                                  client._id === customer ? '' : client._id!
                                );
                                setOpen(false);
                              }}
                              className="font-onest"
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  customer === client._id
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {client.generalInformation.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="customer-name">Nombre (Opcional)</Label>
                <Input
                  id="customer-name"
                  placeholder="Proveedor general"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between w-full">
            <div className="space-y-2 w-[47.5%]">
              <Label>
                Método de pago
                <span className="text-red-600">*</span>
              </Label>
              <Select
                onValueChange={(value: IPaymentMethod) =>
                  setPaymentMethod(value)
                }
                value={paymentMethod}
                disabled={processingSale}
              >
                <SelectTrigger id="customer-type">
                  <SelectValue
                    placeholder="Seleccionar"
                    className="flex items-center gap-2"
                  />
                </SelectTrigger>
                <SelectContent className="font-onest">
                  <SelectItem
                    value={IPaymentMethod.CASH}
                    className="flex items-center gap-2"
                  >
                    <Banknote className="inline w-4 h-4 mr-2" />
                    Efectivo
                  </SelectItem>
                  {customerType === ICustomerType.REGISTERED &&
                    access.create && (
                      <SelectItem
                        value={IPaymentMethod.CREDIT}
                        className="flex items-center gap-2"
                      >
                        <CreditCard className="inline w-4 h-4 mr-2" />
                        Crédito
                      </SelectItem>
                    )}
                </SelectContent>
              </Select>
            </div>

            {paymentMethod === IPaymentMethod.CASH && (
              <div className="space-y-2 w-[47.5%]">
                <Label htmlFor="cash-received">
                  Efectivo recibido
                  <span className="text-red-600">*</span>
                </Label>
                <div className="relative">
                  <Banknote className="absolute text-green-600 transform -translate-y-1/2 left-2 top-1/2 " />
                  <Input
                    id="cash-received"
                    type="number"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    placeholder="0.00"
                    className="pl-10 text-lg font-semibold bg-white font-onest dark:bg-[#09090A]"
                    disabled={processingSale}
                  />
                </div>
              </div>
            )}

            {paymentMethod === IPaymentMethod.CREDIT && (
              <div className="w-[47.5%] flex justify-between items-center gap-4">
                <div className="w-full space-y-2">
                  <Label>
                    Tipo de crédito
                    <span className="text-red-600">*</span>
                  </Label>
                  <Select
                    onValueChange={(value: ICreditMethod) =>
                      setCreditMethod(value)
                    }
                    value={creditMethod}
                    disabled={processingSale}
                  >
                    <SelectTrigger id="credit-type">
                      <SelectValue
                        placeholder="Seleccionar"
                        className="flex items-center gap-2"
                      />
                    </SelectTrigger>
                    <SelectContent className="font-onest">
                      <SelectItem
                        value={ICreditMethod.PLAZO}
                        className="flex items-center gap-2"
                      >
                        <CalendarClock className="inline w-4 h-4 mr-2" />
                        Plazos
                      </SelectItem>
                      <SelectItem
                        value={ICreditMethod.PAGO}
                        className="flex items-center gap-2"
                      >
                        <HandCoins className="inline w-4 h-4 mr-2" />
                        Pagos
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentMethod === IPaymentMethod.CREDIT &&
                  creditMethod === ICreditMethod.PLAZO && (
                    <div className="w-[50%] space-y-2">
                      <Label htmlFor="cash-received">
                        Meses
                        <span className="text-red-600">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="cash-received"
                          type="number"
                          value={months}
                          onChange={(e) => setMonths(e.target.value)}
                          placeholder="0"
                          className="font-semibold text-center bg-white font-onest"
                          disabled={processingSale}
                        />
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>

          <Separator />

          <div className="p-4 space-y-2 rounded-lg bg-primary/5">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>
                {selectedCoin}
                {saleSummary.subTotal.toFixed(2)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold text-primary">
              <span>Total a pagar:</span>
              <span>
                {selectedCoin}
                {saleSummary.total.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between p-2 text-sm bg-green-100 rounded shadow-md dark:bg-black">
              <span>Cambio:</span>
              <span className="font-medium">
                {selectedCoin}
                {saleSummary.change.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            className="w-full bg-gradient-to-r hover:from-primary-dark hover:to-primary dark:bg-gray-950 dark:text-white"
            size="lg"
            disabled={
              productSale.length === 0 ||
              processingSale ||
              (customerType === ICustomerType.REGISTERED && !customer) ||
              (paymentMethod === IPaymentMethod.CASH &&
                Number(cashReceived ?? 0) < saleSummary.total) ||
              (paymentMethod === IPaymentMethod.CREDIT &&
                creditMethod === ICreditMethod.PLAZO &&
                Number(months ?? 0) <= 0)
            }
            onClick={handleProcessSale}
          >
            <CreditCard className="w-4 h-4 mr-2 " /> Procesar compra
          </Button>
        </CardFooter>
      </Card>
      <ConfirmedPurchaseDialog
        isModalOpen={isModalOpen}
        customer={
          customerType === ICustomerType.REGISTERED
            ? (registeredCustomers.find((c) => c._id === customer)
                ?.generalInformation.name ?? '')
            : customer
        }
        branchName={branchSelected?.nombre ?? ''}
        transactionDate={transactionDate}
        cashReceived={Number(cashReceived)}
        saleSummary={saleSummary}
        username={user?.username ?? ''}
        setIsModalOpen={setIsModalOpen}
        handleCloseModal={handleCloseModal}
        customerType={customerType}
        customers={registeredCustomers}
        productSale={productSale}
        paymentMethod={paymentMethod}
        creditMethod={creditMethod}
        months={months}
      />
      <Toaster richColors />
    </>
  );
};
