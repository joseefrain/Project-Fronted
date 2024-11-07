import React from 'react';
import { Branch, IStatus, ITablaBranch } from './branchInterfaces';
import { IUser } from '@/app/slices/login';

export interface IShippedOrder {
  _id: string;
  nombre: string;
  fechaRegistro: Date;
  fechaRecepcion: Date;
  sucursalOrigenId: {
    _id: string;
    nombre: string;
    direccion: string;
    ciudad: string;
    pais: string;
    telefono: string;
    deleted_at: string | null;
    createdAt: string;
    updatedAt: string;
  };
  sucursalDestinoId: {
    _id: string;
    nombre: string;
    direccion: string;
    ciudad: string;
    pais: string;
    telefono: string;
    deleted_at: string | null;
    createdAt: string;
    updatedAt: string;
  };
  usuarioIdRecibe: {
    _id: string;
    username: string;
    password: string;
    role: string;
    sucursalId: string | null;
    deleted_at: string | null;
  };
  estado: boolean;
  comentarioEnvio: string;
  consecutivo: number;
  comentarioRecepcion: string;
  estatusTraslado: IStatusTransfer;
  archivosAdjuntos: string[] | null;
  firmaEnvio: string;
  firmaRecepcion: string;
  deleted_at: string | null;
  created_at: string;
  update_at: string;
  fechaEnvio: Date;
  usuarioIdEnvia: {
    _id: string;
    username: string;
    password: string;
    role: string;
    sucursalId: string | null;
    deleted_at: string | null;
  };
}

export interface ITransferSlice {
  data: IShippedOrder[];
  sent: ITransfer[];
  received: ITransfer[];
  pending: IPendingTransfer[];
  dataBranchReceived: IPendingTransfer[];
  selectedPending: IDetalleSelected | null;
  status: IStatus;
  receivedStatus: IStatus;
  error: string | null;
  selectedItem: IDetalleSelected | null;
}

export interface ITransfer extends ITransferDetails {
  _id: string;
  status: string;
  listDetalleTraslado: ITransferProduct[];
}

export interface ITransferPost extends ITransferDetails {
  listDetalleTraslado: ITransferProduct[];
}

export interface ITransferDetails {
  sucursalOrigenId: string;
  sucursalDestinoId: string | null;
  comentarioEnvio: string | null;
  firmaEnvio: string | null;
  archivosAdjuntos: string[];
  usuarioIdEnvia: string;
}

export interface ITransferProduct {
  inventarioSucursalId: string | undefined;
  cantidad: number;
  comentarioEnvio: string | null;
  archivosAdjuntos: string[];
}

export interface IToolTransferProps {
  userId: string;
  destinationBranchId: string | null;
  sourceBranchId: string;
  shipmentTools: ITool[];
  setShipmentTools: React.Dispatch<React.SetStateAction<ITool[]>>;
}

export interface ITool extends ITablaBranch {
  quantityToSend: number;
  comment: string | null;
  gallery: Array<string>;
}

export interface IPendingTransfer {
  _id: string;
  nombre: string;
  fechaRegistro: Date;
  fechaEnvio: Date;
  fechaRecepcion: Date | null;
  sucursalOrigenId: Branch;
  sucursalDestinoId: Branch;
  usuarioIdEnvia: IUser;
  usuarioIdRecibe: IUser | null;
  estado: string;
  comentarioEnvio: string;
  consecutivo?: number;
  comentarioRecepcion: string | null;
  estatusTraslado?: IStatusTransfer;
  archivosAdjuntos: string[] | null;
  firmaEnvio: string;
  firmaRecepcion: string;
  deleted_at: Date | null;
}

export type IStatusTransfer =
  | 'Solicitado'
  | 'En Proceso'
  | 'Terminado'
  | 'Terminado incompleto';

export interface IPendingShipmentDetailsProps {
  pendingShipment: IPendingTransfer;
}

export interface IProducto {
  _id: string;
  nombre: string;
  descripcion: string;
  monedaId: string;
  deleted_at: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Precio {
  $numberDecimal: string;
}

export interface InventarioSucursal {
  _id: string;
  productoId: IProducto;
  sucursalId: string;
  stock: number;
  precio: Precio;
  ultimo_movimiento: string;
  deleted_at: string | null;
  created_at: string;
  update_at: string;
  puntoReCompra?: number;
}

export interface IProductInTransit {
  nombre: string;
  descripcion: string;
  ultimoMovimiento: string;
  stock: number;
  precio: Precio;
  monedaId: string;
  consucutivoPedido: string;
  id: string;
  sucursalDestino: string;
}

export interface InventarioSucursalWithPopulated {
  _id: string;
  productoId: IProducto;
  sucursalId: Branch;
  stock: number;
  puntoReCompra?: number;
  precio: { $numberDecimal: number };
  ultimo_movimiento: string;
  deleted_at: string | null;
  created_at: string;
  update_at: string;
}

export interface ListItemDePedido {
  _id: string;
  inventarioSucursalId: InventarioSucursal;
  trasladoId: string;
  cantidad: number;
  archivosAdjuntos: string[] | null;
  comentarioRecepcion: string | null;
  comentarioEnvio: string | null;
  recibido?: boolean;
  regresado?: boolean;
}

export interface IDetalleSelected {
  traslado?: IPendingTransfer;
  listItemDePedido: ListItemDePedido[];
}

export interface IDetalleTrasladoRecepcion {
  inventarioSucursalId: string;
  cantidad: number;
  precio: number;
  comentarioRecibido: string | null;
  recibido: boolean;
  estadoEquipo: string;
  archivosAdjuntosRecibido: string[] | null;
  estadoProducto?: string;
  puntoReCompra: number;
}

export interface IProductoTraslado extends IDetalleTrasladoRecepcion {
  id: string;
  nombre: string;
  cantidadEnviada: number;
  archivosAdjuntosEnviado: string[];
  comentarioEnvio: string;
}

export interface ITrasladoRecepcion {
  trasladoId: string;
  estatusTraslado?: string;
  listDetalleTraslado: IDetalleTrasladoRecepcion[];
  archivosAdjuntosRecibido: string[] | null;

  // Datos para enviar el pedido
  firmaRecepcion: string;
  comentarioRecepcion: string;
  usuarioIdRecibe: string;
}
