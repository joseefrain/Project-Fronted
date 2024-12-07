import { IUser } from '../app/slices/login';
import { IStatus } from './branchInterfaces';
import { IEntities } from './entitiesInterfaces';
import {
  IPaymentMethod,
  IProductSale,
  ITypeTransaction,
} from './salesInterfaces';

export interface ICreditsState {
  creditSelected: ICredit | null;
  credits: ICredit[];
  status: IStatus;
  error: string | null;
}

type TypeCredito = 'VENTA' | 'COMPRA';
export type ModalidadCredito = 'PLAZO' | 'PAGO';
type TypeEstadoCredito = 'ABIERTO' | 'CERRADO';
type EstadoPagoCuata = 'PENDIENTE' | 'PAGADO' | 'ATRASADO';

export interface IPagoCredito {
  montoPago: number;
  saldoPendiente: number;
  fechaPago: Date;
}

export interface ICuotasCredito {
  numeroCuota: number;
  montoCuota: { $numberDecimal: number };
  montoCapital: { $numberDecimal: number };
  fechaVencimiento: Date;
  estadoPago: EstadoPagoCuata;
  fechaCuota: Date;
}

export interface ICredit {
  _id: string;
  sucursalId: string;
  entidadId: IEntities;
  tipoCredito: TypeCredito;
  modalidadCredito: ModalidadCredito;
  saldoCredito: { $numberDecimal: number };
  saldoPendiente: { $numberDecimal: number };
  estadoCredito: TypeEstadoCredito;
  fecheInicio: Date;
  transaccionId: ICreditSale;
  deleted_at: Date | null;
  plazoCredito: number;
  cuotaMensual: { $numberDecimal: number };
  fechaVencimiento: Date;
  pagoMinimoMensual: { $numberDecimal: number };
  pagosCredito: IPagoCredito[];
  cuotasCredito: ICuotasCredito[];
}

export interface ICreditSale {
  usuarioId: IUser;
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
}

export interface IPostPagoCredito {
  creditoIdStr: string;
  montoPago: number;
  modalidadCredito: ModalidadCredito;
}
