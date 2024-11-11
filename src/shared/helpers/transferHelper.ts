import { ITransferDetails } from '@/interfaces/transferInterfaces';
import { toast } from 'sonner';

export const isValidTransfer = (
  toolTransfer: ITransferDetails,
  shipmentToolsLength: number
) => {
  if (!toolTransfer.sucursalOrigenId) {
    toast.warning('Seleccione una origen de envío');
    return false;
  }

  if (!toolTransfer.sucursalDestinoId) {
    toast.warning('Seleccione un destino de envío');
    return false;
  }

  if (shipmentToolsLength === 0) {
    toast.warning('No hay herramientas para enviar');
    return false;
  }

  if (!toolTransfer.firmaEnvio) {
    toast.warning('Escriba una firma para realizar la transferencia');
    return false;
  }

  return true;
};

export const isValidReceivedTransfer = (
  signature: string,
  everyProductHasStatus: boolean
) => {
  if (signature === '') {
    toast.warning('Escriba una firma para realizar la transferencia');
    return false;
  }

  if (!everyProductHasStatus) {
    toast.warning('Estableza el estado de cada producto');
    return false;
  }

  return true;
};

export const incomingShipmentTableHeaders = [
  { key: 'estado', label: 'Estado' },
  { key: 'consecutivo', label: 'Consecutivo' },
  { key: 'bodegaEnvia', label: 'Bodega que envía' },
  { key: 'fechaEnvio', label: 'Fecha de envío' },
  { key: 'enviadoPor', label: 'Enviado por' },
  { key: 'acciones', label: 'Acciones' },
];

export const getFormatedDate = (date: Date, incluirHora: boolean = false) => {
  if (date === null) return '-';
  const fecha = new Date(date);
  const opciones: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(incluirHora && { hour: '2-digit', minute: '2-digit', hour12: true }),
  };
  const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
  return fechaFormateada;
};

export const getTimeElapsed = (date: Date): string => {
  const fecha = new Date(date);
  const ahora = new Date();
  const segundos = Math.floor((ahora.getTime() - fecha.getTime()) / 1000);

  const unidades = [
    { nombre: 'año', segundos: 31536000 },
    { nombre: 'mes', segundos: 2592000 },
    { nombre: 'día', segundos: 86400 },
    { nombre: 'hora', segundos: 3600 },
    { nombre: 'minuto', segundos: 60 },
    { nombre: 'segundo', segundos: 1 },
  ];

  for (let unidad of unidades) {
    const intervalo = Math.floor(segundos / unidad.segundos);
    if (intervalo >= 1) {
      return `Hace ${intervalo} ${unidad.nombre}${intervalo > 1 ? 's' : ''}`;
    }
  }

  return 'Hace unos segundos';
};
