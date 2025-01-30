import {
  IDescuentoAplicado,
  IDescuentoGrupoAplicado,
  IDescuentoProductoAplicado,
  IListDescuentoResponse,
  IProductSale,
} from '@/interfaces/salesInterfaces';
import { toast } from 'sonner';

export function isCurrentDateInRange(
  startDate: string,
  endDate: string
): boolean {
  const now = new Date();

  const currentDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const start = new Date(
    new Date(startDate).getFullYear(),
    new Date(startDate).getMonth(),
    new Date(startDate).getDate()
  );
  const end = new Date(
    new Date(endDate).getFullYear(),
    new Date(endDate).getMonth(),
    new Date(endDate).getDate()
  );

  return currentDate >= start && currentDate <= end;
}

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
    ?.concat(descuentos.descuentosPorProductosEnSucursal)
    .filter((d) =>
      validateDiscountByProduct(
        {
          sucursalId: d.sucursalId ?? '',
          minimoCompra: Number(d.descuentoId.minimoCompra.$numberDecimal),
          minimoCantidad: Number(d.descuentoId.minimoCantidad),
          activo: d.descuentoId.activo,
          fechaInicio: String(d.descuentoId.fechaInicio),
          fechaFin: String(d.descuentoId.fechaFin),
          productId: d.productId,
        },
        productId,
        sucursalId,
        price,
        quantity
      )
    );

  const descuentosGrupo = descuentos.descuentosPorGruposGenerales
    ?.concat(descuentos.descuentosPorGruposEnSucursal)
    .filter((d) =>
      validateDiscountByGroup(
        {
          sucursalId: d.sucursalId ?? '',
          minimoCompra: Number(d.descuentoId.minimoCompra.$numberDecimal),
          minimoCantidad: Number(d.descuentoId.minimoCantidad),
          activo: d.descuentoId.activo,
          fechaInicio: String(d.descuentoId.fechaInicio),
          fechaFin: String(d.descuentoId.fechaFin),
          groupId: d.grupoId,
        },
        groupId,
        sucursalId,
        price,
        quantity
      )
    );

  const descuentoAplicable =
    descuentosProducto?.length > 0
      ? descuentosProducto[0]?.descuentoId
      : descuentosGrupo?.length > 0
        ? descuentosGrupo[0]?.descuentoId
        : null;

  const discountType =
    descuentosProducto?.length > 0
      ? 'producto'
      : descuentosGrupo?.length > 0
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
  }

  return {
    ...producto,
    discount:
      discountType && descuentoAplicable
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

export const esFechaMayor = (fecha1: Date, fecha2: Date): boolean => {
  const f1 = new Date(
    fecha1.getFullYear(),
    fecha1.getMonth(),
    fecha1.getDate()
  );
  const f2 = new Date(
    fecha2.getFullYear(),
    fecha2.getMonth(),
    fecha2.getDate()
  );
  return f1.getTime() > f2.getTime();
};

export const NO_CASHIER_OPEN =
  'Debe abrir una caja antes de realizar una devolución';

export const isDiscountApplied = (
  sucursalId: string,
  quantityReturned: number,
  producto?: IProductSale
) => {
  if (!producto || !producto?.discount) return false;

  const { productId, groupId, price, quantity, discount } = producto;
  const newQuantity = quantity - quantityReturned;
  const castDiscount = discount as unknown as IDescuentoAplicado;

  if (castDiscount.groupId) {
    const discountFormat = {
      groupId: castDiscount.groupId ?? '',
      sucursalId: castDiscount.sucursalId,
      minimoCompra: castDiscount.minimoCompra,
      minimoCantidad: castDiscount.minimoCantidad,
      activo: castDiscount.activo,
      fechaInicio: castDiscount.fechaInicio,
      fechaFin: castDiscount.fechaFin,
    };

    const discountApplied = validateDiscountByGroup(
      discountFormat,
      groupId,
      sucursalId,
      price,
      newQuantity,
      false
    );

    return discountApplied;
  }

  const discountFormat = {
    productId: castDiscount.productId ?? '',
    sucursalId: castDiscount.sucursalId,
    minimoCompra: castDiscount.minimoCompra,
    minimoCantidad: castDiscount.minimoCantidad,
    activo: castDiscount.activo,
    fechaInicio: castDiscount.fechaInicio,
    fechaFin: castDiscount.fechaFin,
  };

  const discountApplied = validateDiscountByProduct(
    discountFormat,
    productId,
    sucursalId,
    price,
    newQuantity,
    false
  );

  return discountApplied;
};

export const validateDiscountByGroup = (
  discount: IDescuentoGrupoAplicado,
  groupId: string,
  sucursalId: string,
  productPrice: number,
  productQuantity: number,
  includeDates = true
) => {
  return includeDates
    ? discount?.groupId === groupId &&
        (!discount.sucursalId || discount.sucursalId === sucursalId) &&
        discount.activo &&
        isCurrentDateInRange(
          String(discount.fechaInicio),
          String(discount.fechaFin)
        ) &&
        (productPrice * productQuantity >= Number(discount.minimoCompra) ||
          productQuantity >= discount.minimoCantidad)
    : discount?.groupId === groupId &&
        (!discount.sucursalId || discount.sucursalId === sucursalId) &&
        discount.activo &&
        (productPrice * productQuantity >= Number(discount.minimoCompra) ||
          productQuantity >= discount.minimoCantidad);
};

export const validateDiscountByProduct = (
  discount: IDescuentoProductoAplicado,
  productId: string,
  sucursalId: string,
  price: number,
  newQuantity: number,
  includeDates = true
) => {
  return includeDates
    ? (discount.productId?.toString() === productId &&
        (!discount.sucursalId || discount.sucursalId === sucursalId) &&
        discount.activo &&
        isCurrentDateInRange(
          String(discount.fechaInicio),
          String(discount.fechaFin)
        ) &&
        price * newQuantity >= Number(discount.minimoCompra)) ||
        newQuantity >= discount.minimoCantidad
    : (discount.productId?.toString() === productId &&
        (!discount.sucursalId || discount.sucursalId === sucursalId) &&
        discount.activo &&
        price * newQuantity >= Number(discount.minimoCompra)) ||
        newQuantity >= discount.minimoCantidad;
};
