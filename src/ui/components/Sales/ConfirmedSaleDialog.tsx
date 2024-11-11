import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getFormatedDate } from '@/shared/helpers/transferHelper';
import {
  BadgeDollarSign,
  BadgeMinus,
  Banknote,
  CalendarCheck,
  Captions,
  Coins,
  FileDown,
  Printer,
  Receipt,
  Store,
  User,
} from 'lucide-react';
import { handlePrintInvoice } from '@/shared/helpers/salesHelper';
import { IProductSale } from '@/interfaces/salesInterfaces';
import { ISaleSummary } from './Inventory';

export interface IReportField {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface IConfirmedSaleDialog {
  isModalOpen: boolean;
  customer: string;
  branchName: string;
  transactionDate: Date | null;
  cashReceived: number;
  username: string;
  customers: Array<any>;
  customerType: string;
  productSale: Array<IProductSale>;
  paymentMethod: string;
  saleSummary: ISaleSummary;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleCloseModal: () => void;
}

export const ConfirmedSaleDialog = ({
  setIsModalOpen,
  handleCloseModal,
  isModalOpen,
  branchName,
  customer,
  transactionDate,
  cashReceived,
  saleSummary,
  username,
  customerType,
  customers,
  productSale,
  paymentMethod,
}: IConfirmedSaleDialog) => {
  const onPrintInvoice = () => {
    handlePrintInvoice({
      branchSelected: branchName,
      transactionDate: transactionDate!,
      customer,
      customerType,
      customers,
      paymentMethod,
      cashReceived,
      saleSummary,
      productSale,
    });
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) =>
        open ? setIsModalOpen(open) : handleCloseModal()
      }
    >
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            Venta procesada con éxito
          </DialogTitle>
          <DialogDescription>Resumen de la transacción</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-start gap-4 my-4">
          <ReportField
            label="Sucursal"
            value={branchName ?? ''}
            icon={<Store className="mr-3" />}
          />
          <ReportField
            label="Cliente"
            value={customer ? customer.toUpperCase() : '---'}
            icon={<User className="mr-3" />}
          />
          <ReportField
            label="Cajero"
            value={username.toUpperCase() ?? ''}
            icon={<User className="mr-3" />}
          />
          <ReportField
            label="Fecha y Hora"
            value={getFormatedDate(transactionDate!, true).toUpperCase()}
            icon={<CalendarCheck className="mr-3" />}
          />
          <ReportField
            label="Método de Pago"
            value="EFECTIVO"
            icon={<Receipt className="mr-3" />}
          />
          <ReportField
            label="Subtotal"
            value={`$${saleSummary.total.toFixed(2)}`}
            icon={<Captions className="mr-3" />}
          />
          <ReportField
            label="Descuento"
            value={`$${saleSummary.totalDiscount.toFixed(2)}`}
            icon={<BadgeMinus className="mr-3" />}
          />
          <ReportField
            label="Total"
            value={`$${saleSummary.total.toFixed(2)}`}
            icon={<BadgeDollarSign className="mr-3" />}
          />
          <ReportField
            label="Efectivo"
            value={`$${cashReceived}`}
            icon={<Banknote className="mr-3" />}
          />
          <ReportField
            label="Cambio"
            value={`$${saleSummary.change.toFixed(2)}`}
            icon={<Coins className="mr-3" />}
          />
        </div>
        <DialogFooter className="saled__btn">
          <Button onClick={onPrintInvoice}>
            <Printer className="w-4 h-4 mr-2" />
            Imprimir factura
          </Button>
          <Button onClick={onPrintInvoice} variant="outline">
            <FileDown className="w-4 h-4 mr-2" />
            Descargar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ReportField = ({ icon, label, value }: IReportField) => {
  return (
    <div className="flex items-center justify-between w-full gap-4">
      <Label htmlFor={label} className="flex items-center w-[30%]">
        {icon}
        {label}
      </Label>
      <Input id={label} value={value} className="bg-muted w-[70%]" readOnly />
    </div>
  );
};
