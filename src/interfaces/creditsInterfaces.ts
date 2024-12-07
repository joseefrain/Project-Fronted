import { IStatus } from './branchInterfaces';
import { IEntities } from './entitiesInterfaces';
import { ISale } from './salesInterfaces';

export interface ICreditsState {
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
  montoCuota: number;
  montoCapital: number;
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
  saldoCredito: number;
  estadoCredito: TypeEstadoCredito;
  fecheInicio: Date;
  transaccionId: ISale;
  deleted_at: Date | null;
  plazoCredito: number;
  cuotaMensual: number;
  fechaVencimiento: Date;
  pagoMinimoMensual: number;
  pagosCredito: IPagoCredito[];
  cuotasCredito: ICuotasCredito[];
}
