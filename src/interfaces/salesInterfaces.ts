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
  minimiType: IDescountTypePV;
}

export interface IDescuentoMapeado {
  descuentoId: IDescuento;
  productId?: string;
  sucursalId?: string;
  deleted_at: Date | null;
  grupoId?: string;
  tipoEntidad: 'Product' | 'Group';
  minimiType: IDescountTypePV;
}

export interface IDescuentoMapeadoExtendido extends IDescuentoMapeado {
  tipo:
    | 'descuentosPorGruposEnSucursal'
    | 'descuentosPorProductosEnSucursal'
    | 'descuentosPorGruposGenerales'
    | 'descuentosPorProductosGenerales';
  tipoDescuento: string;
}

export interface IDescuentoCreate {
  _id?: string;
  nombre: string;
  tipoDescuento: 'porcentaje' | 'valor';
  valorDescuento: number;
  fechaInicio: Date;
  fechaFin: Date;
  minimoCompra: { $numberDecimal: number };
  minimoCantidad: number;
  activo: boolean;
  moneda_id: string;
  codigoDescunto: string;
  deleted_at: Date | null;
  tipoDescuentoEntidad: 'Product' | 'Group';
  productId: string;
  groupId: string;
  sucursalId: string;
  minimiType: IDescountTypePV;
}

export type IDescountTypePV = 'cantidad' | 'compra';
export type IDisccountType = 'porcentaje' | 'valor';

export interface IProductSale {
  productId: string;
  groupId: string;
  clientType: 'Regular' | 'Proveedor';
  productName: string;
  quantity: number;
  price: number;
  inventarioSucursalId: string;
  costoUnitario: { $numberDecimal: number };
  discount: null | {
    id: string;
    name: string;
    type: 'producto' | 'grupo';
    amount: number;
    percentage: number;
    minimiType: IDescountTypePV;
    minimoCompra: { $numberDecimal: string };
    minimoCantidad: number;
  };
}

export interface IDescuentoAplicado {
  id: string;
  name: string;
  type: 'producto' | 'grupo';
  amount: number;
  percentage: number;
  productId: string | null;
  groupId: string | null;
  sucursalId: string;
  fechaInicio: string;
  fechaFin: string;
  minimoCompra: number;
  minimoCantidad: number;
  activo: boolean;
  minimiType: IDescountTypePV;
}

export interface IDescuentoGeneralAplicado {
  sucursalId: string;
  minimoCompra: number;
  minimoCantidad: number;
  activo: boolean;
  fechaInicio: string;
  fechaFin: string;
  minimiType: IDescountTypePV;
}

export interface IDescuentoGrupoAplicado extends IDescuentoGeneralAplicado {
  groupId: string;
}

export interface IDescuentoProductoAplicado extends IDescuentoGeneralAplicado {
  productId: string;
}

export enum ITypeTransaction {
  VENTA = 'VENTA',
  COMPRA = 'COMPRA',
}

export enum IPaymentMethod {
  CASH = 'cash',
  CREDIT = 'credit',
}

export enum ICreditMethod {
  PLAZO = 'PLAZO',
  PAGO = 'PAGO',
}

export enum ICustomerType {
  REGISTERED = 'registered',
  GENERAL = 'general',
}

export interface ISale {
  id: string;
  userId: string;
  sucursalId: string;
  products: IProductSale[];
  subtotal: number;
  total: number;
  discount: number;
  monto: number;
  cambioCliente: number;
  cajaId: string;
  entidadId?: string;
  paymentMethod: IPaymentMethod;
  tipoTransaccion: ITypeTransaction;
  credito?: ICredit;
  fechaRegistro?: Date;
}

export interface INewSale extends Omit<ISale, 'id'> {}

export interface ICredit {
  modalidadCredito: ICreditMethod;
  plazoCredito: number;
  cuotaMensual: number;
  pagoMinimoMensual: number;
}

export interface IProductReturn {
  quantity: number;
  productId: string;
  discountApplied: boolean;
}

export interface ITransactionReturn {
  userId: string;
  trasaccionOrigenId: string;
  cajaId: string;
  monto: number;
  montoExterno?: number | null;
  products: IProductReturn[];
}
export const dataCoins = {
  currentS: 'C$',
  idGlobal: '6788969390f63a009f1bea40',
};
