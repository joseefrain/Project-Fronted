import {
  IListDescuentoResponse,
  IProductSale,
} from '@/interfaces/salesInterfaces';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { getFormatedDate } from './transferHelper';
import { ISaleSummary } from '@/ui/components/Sales/Inventory';

export const applyDiscounts = (
  sucursalId: string,
  producto: IProductSale,
  descuentos: IListDescuentoResponse
): IProductSale => {
  const { productId, groupId, price, quantity } = producto;

  let precioFinal = price;
  let descuentoAplicado = 0;
  let porcentajeAplicado = 0;

  const descuentosProducto = descuentos.descuentosPorProductosGenerales
    .concat(descuentos.descuentosPorProductosEnSucursal)
    .filter(
      (d) =>
        d.productId?.toString() === productId &&
        (!d.sucursalId || d.sucursalId === sucursalId) &&
        d.descuentoId.activo &&
        (price * quantity >= d.descuentoId.minimoCompra.$numberDecimal ||
          quantity >= d.descuentoId.minimoCantidad)
    );

  const descuentosGrupo = descuentos.descuentosPorGruposGenerales
    .concat(descuentos.descuentosPorGruposEnSucursal)
    .filter(
      (d) =>
        d.grupoId === groupId &&
        (!d.sucursalId || d.sucursalId === sucursalId) &&
        d.descuentoId.activo &&
        (price * quantity >= d.descuentoId.minimoCompra.$numberDecimal ||
          quantity >= d.descuentoId.minimoCantidad)
    );

  const descuentoAplicable =
    descuentosProducto.length > 0
      ? descuentosProducto[0].descuentoId
      : descuentosGrupo.length > 0
        ? descuentosGrupo[0].descuentoId
        : null;

  const discountType =
    descuentosProducto.length > 0
      ? 'producto'
      : descuentosGrupo.length > 0
        ? 'grupo'
        : null;

  if (descuentoAplicable) {
    if (descuentoAplicable.tipoDescuento === 'porcentaje') {
      porcentajeAplicado = descuentoAplicable.valorDescuento;
      descuentoAplicado = precioFinal * quantity * (porcentajeAplicado / 100);
    } else if (descuentoAplicable.tipoDescuento === 'valor') {
      descuentoAplicado = descuentoAplicable.valorDescuento;
      porcentajeAplicado = (descuentoAplicado / (precioFinal * quantity)) * 100;
    }

    // precioFinal = Math.max(precioFinal, 0);
  }

  return {
    ...producto,
    discount: discountType
      ? {
          id: descuentoAplicable?._id ?? '',
          name: descuentoAplicable?.nombre ?? '',
          type: discountType,
          amount: descuentoAplicado,
          percentage: porcentajeAplicado,
        }
      : null,
  };
};

export const handleProductSaleAlerts = (
  nombre: string,
  stock: number,
  puntoRecompra: number
) => {
  if (stock <= 0) {
    toast.warning(`El stock de ${nombre} se ha agotado`);
  }

  if (puntoRecompra >= stock) {
    toast.warning(`El stock de ${nombre} es menor o igual al punto recompra`);
  }
};

export interface IPrintInvoice {
  branchSelected: string;
  transactionDate: Date;
  customer: string;
  customerType: string;
  customers: Array<any>;
  paymentMethod: string;
  cashReceived: number;
  saleSummary: ISaleSummary;
  productSale: Array<IProductSale>;
}

export const handlePrintInvoice = ({
  branchSelected,
  transactionDate,
  customers,
  customer,
  customerType,
  paymentMethod,
  cashReceived,
  saleSummary,
}: IPrintInvoice) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('Factura', 105, 15, { align: 'center' });
  doc.setFontSize(12);
  doc.text(branchSelected ?? '', 105, 25, { align: 'center' });
  doc.text('Fecha: ' + getFormatedDate(transactionDate!), 105, 35, {
    align: 'center',
  });

  doc.text(
    'Cliente: ' +
      (customers.find((c) => c.id === customer)?.name ?? customer ?? '---'),
    20,
    50
  );

  doc.text(
    'Tipo: ' + (customerType === 'registered' ? 'Registrado' : 'General'),
    20,
    60
  );

  // const tableColumn = ['Producto', 'Cantidad', 'Precio', 'Total'];
  // const tableRows = productSale.map((item) => [
  //   item.productName,
  //   item.quantity,
  //   `$${item.price.toFixed(2)}`,
  //   `$${(item.price * item.quantity).toFixed(2)}`,
  // ]);


  // doc.autoTable({
  //   startY: 70,
  //   head: [tableColumn],
  //   body: tableRows,
  // });

  const finalY = (doc as any).lastAutoTable.finalY || 70;
  doc.text(`Total: $${saleSummary.total.toFixed(2)}`, 20, finalY + 10);
  doc.text(
    `Método de pago: ${paymentMethod === 'cash' ? 'Efectivo' : 'Crédito'}`,
    20,
    finalY + 20
  );

  if (paymentMethod === 'cash') {
    doc.text(`Efectivo recibido: $${cashReceived}`, 20, finalY + 30);
    doc.text(`Cambio: $${saleSummary.change.toFixed(2)}`, 20, finalY + 40);
  }

  doc.text('¡Gracias por su compra!', 105, 280, { align: 'center' });
  doc.save('factura.pdf');
};
