('use client');

import React, { useEffect, useMemo, useState } from 'react';
import { store } from '@/app/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ChevronsUpDown, Receipt, User, Users } from 'lucide-react';
import { CreditCard, Banknote, MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { IProductSale, ISale } from '@/interfaces/salesInterfaces';
import { toast, Toaster } from 'sonner';
import { createSale } from '@/app/slices/salesSlice';
import { ConfirmedSaleDialog } from './ConfirmedSaleDialog';
import './style.scss';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

export const Cashier = ({ productSale, setProductSale }: ICashierProps) => {
  const caja = store.getState().sales.caja;
  const user = store.getState().auth.signIn.user;
  const branchSelected = store.getState().branches.selectedBranch;

  const [cashInRegister, setCashInRegister] = useState(0);
  const [registeredCustomers] = useState([
    { id: '1', name: 'Arleys Gatica', credit: 1000, creditUsed: 0 },
    { id: '2', name: 'Carlos Duarte', credit: 1500, creditUsed: 500 },
    { id: '3', name: 'Junior Hurtado', credit: 500, creditUsed: 200 },
  ]);

  const [customerType, setCustomerType] = useState<'registered' | 'general'>(
    'general'
  );
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit'>('cash');

  const [open, setOpen] = useState(false);
  const [cashReceived, setCashReceived] = useState<string>('');
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
      cajaId: caja?._id ?? '',
    };

    const request = store
      .dispatch(createSale(newSale))
      .unwrap()
      .catch(() => {
        setProcessingSale(false);
        return Promise.reject();
      })
      .then(() => {
        setTimeout(() => {
          setIsModalOpen(true);
          setCashInRegister((prev) => prev + newSale.total);
        }, 500);
      });

    toast.promise(request, {
      loading: 'Procesando...',
      success: 'Venta procesada exitosamente',
      error: 'Error al procesar la venta',
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
    setCashInRegister(Number(caja.montoEsperado.$numberDecimal));
  }, [caja]);

  return (
    <>
      <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-col justify-between gap-2 pb-4">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-bold text-primary">
              <Receipt />
              Caja - {user?.username.toUpperCase()}
            </CardTitle>

            <div className="flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="font-semibold">
                {user?.sucursalId?.nombre ?? branchSelected?.nombre}
              </span>
            </div>
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
            <span className="font-medium text-blue-900 uppercase">
              Efectivo en caja
            </span>
            <span className="font-bold">${cashInRegister.toFixed(2)}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="customer-type">
                Tipo de cliente
                <span className="text-red-600">*</span>
              </Label>
              <Select
                onValueChange={(value: 'registered' | 'general') => {
                  setCustomerType(value);
                  setCustomer('');
                  value === 'general' && setPaymentMethod('cash');
                }}
                disabled={processingSale}
              >
                <SelectTrigger id="customer-type">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="registered">
                    <User className="inline w-4 h-4 mr-2" />
                    Registrado
                  </SelectItem>
                  <SelectItem value="general">
                    <Users className="inline w-4 h-4 mr-2" />
                    General
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {customerType === 'registered' ? (
              <div className="space-y-2">
                <Label htmlFor="registered-customer">
                  Cliente
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
                        ? registeredCustomers.find((c) => c.id === customer)
                            ?.name
                        : 'Seleccionar cliente'}
                      <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Buscar cliente" />
                      <CommandList className="product__list">
                        <CommandEmpty>Producto no encontrado.</CommandEmpty>
                        <CommandGroup>
                          {registeredCustomers.map((client) => (
                            <CommandItem
                              key={client.id}
                              value={client.name}
                              onSelect={() => {
                                setCustomer(
                                  client.id === customer ? '' : client.id!
                                );
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  customer === client.id
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {client.name}
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
                  placeholder="Cliente general"
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
                onValueChange={(value: 'cash' | 'credit') =>
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
                <SelectContent>
                  <SelectItem value="cash" className="flex items-center gap-2">
                    <Banknote className="inline w-4 h-4 mr-2" />
                    Efectivo
                  </SelectItem>
                  {customerType === 'registered' && (
                    <SelectItem
                      value="credit"
                      className="flex items-center gap-2"
                    >
                      <CreditCard className="inline w-4 h-4 mr-2" />
                      Crédito
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {paymentMethod === 'cash' && (
              <div className="space-y-2 w-[47.5%]">
                <Label htmlFor="cash-received">
                  Efectivo recibido
                  <span className="text-red-600">*</span>
                </Label>
                <div className="relative">
                  <Banknote className="absolute text-green-600 transform -translate-y-1/2 left-2 top-1/2" />
                  <Input
                    id="cash-received"
                    type="number"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    placeholder="0.00"
                    className="pl-10 font-sans text-lg font-semibold bg-white"
                    disabled={processingSale}
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="p-4 space-y-2 rounded-lg bg-primary/5">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${saleSummary.subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Descuento ({saleSummary.totalDiscountPercentage}%):</span>
              <span>${saleSummary.totalDiscount.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold text-primary">
              <span>Total a pagar:</span>
              <span>${saleSummary.total.toFixed(2)}</span>
            </div>

            <div className="flex justify-between p-2 text-sm bg-green-100 rounded shadow-md">
              <span>Cambio:</span>
              <span className="font-medium">
                ${saleSummary.change.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary"
            size="lg"
            disabled={
              productSale.length === 0 ||
              processingSale ||
              (customerType === 'registered' && !customer) ||
              (paymentMethod === 'cash' &&
                Number(cashReceived ?? 0) < saleSummary.total)
            }
            onClick={handleProcessSale}
          >
            <CreditCard className="w-4 h-4 mr-2" /> Procesar venta
          </Button>
        </CardFooter>
      </Card>
      <ConfirmedSaleDialog
        isModalOpen={isModalOpen}
        customer={customer}
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
      />
      <Toaster richColors />
    </>
  );
};
