export interface IListDescuentoResponse {
  descuentosPorProductosGenerales: IDescuentosProductos[];
  descuentosPorProductosEnSucursal: IDescuentosProductos[];
  descuentosPorGruposGenerales: IDescuentoGrupo[];
  descuentosPorGruposEnSucursal: IDescuentoGrupo[];
}

export interface IDescuentosProductos {
  descuentoId: IDescuento;
  productId: string;
  sucursalId?: string;
  deleted_at: Date | null;
}

export interface IDescuentoGrupo {
  descuentoId: IDescuento;
  grupoId: string;
  sucursalId?: string;
  deleted_at: Date | null;
}

export interface IDescuento {
  _id: string;
  nombre: string;
  tipoDescuento: IDisccountType;
  valorDescuento: number;
  fechaInicio: Date;
  fechaFin: Date;
  minimoCompra: { $numberDecimal: number };
  minimoCantidad: number;
  activo: boolean;
  moneda_id: string;
  codigoDescunto: string;
  deleted_at: Date | null;
}

export interface IDescuentoCreate {
  nombre: string;
  tipoDescuento: 'porcentaje' | 'valor';
  valorDescuento: number;
  fechaInicio: Date;
  fechaFin: Date;
  minimoCompra: number;
  minimoCantidad: number;
  activo: boolean;
  moneda_id: string;
  codigoDescunto: string;
  deleted_at: Date | null;
  tipoDescuentoEntidad: 'Product' | 'Group';
  productId: string;
  groupId: string;
  sucursalId: string;
}

export type IDisccountType = 'porcentaje' | 'valor';

export interface IProductSale {
  productId: string;
  groupId: string;
  clientType: 'Regular' | 'Proveedor';
  productName: string;
  quantity: number;
  price: number;
  discount: null | {
    id: string;
    name: string;
    type: 'producto' | 'grupo';
    amount: number;
    percentage: number;
  };
}

export interface ISale {
  userId: string;
  sucursalId: string;
  products: IProductSale[];
  subtotal: number;
  total: number;
  discount: number;
}
