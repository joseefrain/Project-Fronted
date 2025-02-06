import {
  IDescountTypePV,
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

  const descuentosProducto = descuentos.descuentosPorProductosEnSucursal
    ?.concat(descuentos.descuentosPorProductosGenerales)
    .filter((d) =>
      validateDiscountByProduct(
        {
          sucursalId: d.sucursalId ?? '',
          minimoCompra: Number(d.descuentoId.minimoCompra?.$numberDecimal ?? 0),
          minimoCantidad: Number(d.descuentoId.minimoCantidad),
          activo: d.descuentoId.activo,
          fechaInicio: String(d.descuentoId.fechaInicio),
          fechaFin: String(d.descuentoId.fechaFin),
          productId: d.productId,
          minimiType: d.descuentoId.minimiType,
        },
        productId,
        sucursalId,
        price,
        quantity
      )
    );

  const descuentosGrupo = descuentos.descuentosPorGruposEnSucursal
    ?.concat(descuentos.descuentosPorGruposGenerales)
    .filter((d) =>
      validateDiscountByGroup(
        {
          sucursalId: d.sucursalId ?? '',
          minimoCompra: Number(d.descuentoId.minimoCompra?.$numberDecimal ?? 0),
          minimoCantidad: Number(d.descuentoId.minimoCantidad),
          activo: d.descuentoId.activo,
          fechaInicio: String(d.descuentoId.fechaInicio),
          fechaFin: String(d.descuentoId.fechaFin),
          groupId: d.grupoId,
          minimiType: d.descuentoId.minimiType,
        },
        groupId,
        sucursalId,
        price,
        quantity
      )
    );

  console.log(descuentosGrupo, 'descuentosGrupo');

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
            minimiType: descuentoAplicable.minimiType,
            minimoCompra: {
              $numberDecimal: (
                descuentoAplicable.minimoCompra?.$numberDecimal ?? 0
              ).toString(),
            },
            minimoCantidad: descuentoAplicable.minimoCantidad,
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
      minimoCompra: Number(castDiscount.minimoCompra?.$numberDecimal ?? 0),
      minimoCantidad: castDiscount.minimoCantidad,
      activo: castDiscount.activo,
      fechaInicio: castDiscount.fechaInicio,
      fechaFin: castDiscount.fechaFin,
      minimiType: castDiscount.minimiType,
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
    minimoCompra: Number(castDiscount.minimoCompra?.$numberDecimal ?? 0),
    minimoCantidad: castDiscount.minimoCantidad,
    activo: castDiscount.activo,
    fechaInicio: castDiscount.fechaInicio,
    fechaFin: castDiscount.fechaFin,
    minimiType: castDiscount.minimiType,
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
        isGeneralORSucursal(sucursalId, discount.sucursalId) &&
        discount.activo &&
        isCurrentDateInRange(
          String(discount.fechaInicio),
          String(discount.fechaFin)
        ) &&
        meetPurchaseORQuantity(
          productPrice,
          productQuantity,
          Number(discount.minimoCompra),
          discount.minimoCantidad,
          discount.minimiType
        )
    : discount?.groupId === groupId &&
        isGeneralORSucursal(sucursalId, discount.sucursalId) &&
        discount.activo &&
        meetPurchaseORQuantity(
          productPrice,
          productQuantity,
          Number(discount.minimoCompra),
          discount.minimoCantidad,
          discount.minimiType
        );
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
    ? discount.productId?.toString() === productId &&
        isGeneralORSucursal(sucursalId, discount.sucursalId) &&
        discount.activo &&
        isCurrentDateInRange(
          String(discount.fechaInicio),
          String(discount.fechaFin)
        ) &&
        meetPurchaseORQuantity(
          price,
          newQuantity,
          Number(discount.minimoCompra),
          discount.minimoCantidad,
          discount.minimiType
        )
    : discount.productId?.toString() === productId &&
        isGeneralORSucursal(sucursalId, discount.sucursalId) &&
        discount.activo &&
        meetPurchaseORQuantity(
          price,
          newQuantity,
          Number(discount.minimoCompra),
          discount.minimoCantidad,
          discount.minimiType
        );
};

export const meetPurchaseORQuantity = (
  price: number,
  newQuantity: number,
  minimoCompra: number,
  minimoCantidad: number,
  type: IDescountTypePV
) => {
  if (type === 'compra') {
    return price * newQuantity >= minimoCompra;
  }

  return newQuantity >= minimoCantidad;
};

export const isGeneralORSucursal = (
  productSucursalId: string,
  discountSucursalId?: string
) => !discountSucursalId || discountSucursalId === productSucursalId;

export const getProductUnitPrice = (product: IProductSale) => {
  if (!product.discount) return product.price;

  const productSubtotal = product.quantity * product.price;
  const productTotalSale = productSubtotal - product.discount.amount;
  const productPriceWithDiscount = productTotalSale / product.quantity;

  return productPriceWithDiscount;
};

export const getPriceAdjustment = (
  product: IProductSale,
  newQuantity: number
) => {
  const unityPriceWithDiscount = getProductUnitPrice(product);
  const unityPrice = product.price;
  const newSubtotalWithDiscount = newQuantity * unityPriceWithDiscount;
  const newSubtotalWithOutDiscount = newQuantity * unityPrice;
  const discountAmount = newSubtotalWithOutDiscount - newSubtotalWithDiscount;

  return Math.abs(discountAmount);
};
