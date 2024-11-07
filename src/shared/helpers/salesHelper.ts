import {
  IListDescuentoResponse,
  IProductSale,
} from '@/interfaces/salesInterfaces';
import { toast } from 'sonner';

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

  if (puntoRecompra <= stock) {
    toast.warning(`El stock de ${nombre} es menor o igual al punto recompra`);
  }
};
