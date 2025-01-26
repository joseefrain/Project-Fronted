import Images from '../ToolShipment/photo';
import Comment from '../ToolShipment/comment';
import Signature from '../ToolShipment/signature';
import { toast, Toaster } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { useState } from 'react';
import { useAppSelector } from '@/app/hooks';
import { IUser } from '@/app/slices/login';
import {
  IProductoTraslado,
  IDetalleTrasladoRecepcion,
  ITrasladoRecepcion,
} from '@/interfaces/transferInterfaces';
import { store } from '@/app/store';
import { createProductReceived } from '@/app/slices/transferSlice';
import { useNavigate } from 'react-router-dom';
import { isValidReceivedTransfer } from '@/shared/helpers/transferHelper';
import { uploadFile, uploadFiles } from '@/shared/helpers/firebase';

export interface ITransferDetails {
  comentarioRecepcion: string | null;
  firmaRecepcion: string | null;
  archivosAdjuntosRecibido: string[];
  usuarioIdRecibe: IUser | null;
}

export interface IPendingProductsActionsProps {
  trasladoId: string;
  shipments: IProductoTraslado[];
}

export const PendingProductsActions = ({
  trasladoId,
  shipments,
}: IPendingProductsActionsProps) => {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const user = useAppSelector((state) => state.auth.signIn.user);
  const [toolReceiving, setToolReceiving] = useState<ITransferDetails>({
    comentarioRecepcion: null,
    firmaRecepcion: '',
    archivosAdjuntosRecibido: [],
    usuarioIdRecibe: null,
  });

  const handleSaveComment = (comment: string) => {
    setToolReceiving({
      ...toolReceiving,
      comentarioRecepcion: comment,
    });
  };

  const handleRemoveComment = () => {
    setToolReceiving({
      ...toolReceiving,
      comentarioRecepcion: null,
    });
  };

  const processAttachments = async (attachments: string[] | null): Promise<string[]> => {
    return attachments ? (await uploadFiles(attachments) as string[]) : [];
};

  const handleReceiveTransfer = async () => {
    setSending(true);
    const everyProductHasStatus = shipments.every(
      (shipment) => shipment.estadoProducto && shipment.estadoProducto !== ''
    );

    const validTransfer = isValidReceivedTransfer(
      toolReceiving.firmaRecepcion ?? '',
      everyProductHasStatus
    );
    if (!validTransfer) return setSending(false);

    let archivosAdjuntosRecibido: string[] = await uploadFiles(toolReceiving.archivosAdjuntosRecibido) as string[];
    let firmaRecepcion: string = await uploadFile(toolReceiving.firmaRecepcion as string) as string;

    const formattedShipments: IDetalleTrasladoRecepcion[] = await Promise.all(
      shipments.map(async (shipment) => {
        const archivosAdjuntosRecibido = await processAttachments(
          shipment.archivosAdjuntosRecibido
        );
        return {
          archivosAdjuntosRecibido: archivosAdjuntosRecibido,
          comentarioRecibido: shipment.comentarioRecibido ?? '',
          estadoEquipo: shipment.estadoEquipo,
          inventarioSucursalId: shipment.inventarioSucursalId,
          cantidad: shipment.cantidad,
          precio: shipment.precio,
          recibido: shipment.recibido,
          estadoProducto: shipment.estadoProducto,
          puntoReCompra: shipment.puntoReCompra,
        };
      })
    );

    const formattedReceivingData: ITrasladoRecepcion = {
      ...toolReceiving,
      trasladoId,
      usuarioIdRecibe: user?._id ?? '',
      estatusTraslado: 'Terminado',
      listDetalleTraslado: formattedShipments,
      firmaRecepcion,
      comentarioRecepcion: toolReceiving.comentarioRecepcion ?? '',
      archivosAdjuntosRecibido
    };

    const request = store
      .dispatch(createProductReceived(formattedReceivingData))
      .unwrap()
      .catch((err) => {
        setSending(false);
        return Promise.reject(err);
      })
      .then(() => {
        setTimeout(() => {
          setSending(false);
          navigate('/orders');
        }, 1000);
      });

    toast.promise(request, {
      loading: 'Recibiendo...',
      success: '¡Productos recibidos!',
      error: (err) => `Error al recibir productos: ${err}`,
    });
  };

  const handleSignature = (signature: string | null) => {
    setToolReceiving({
      ...toolReceiving,
      firmaRecepcion: signature,
    });
  };

  const handleSaveImages = (images: string[]) => {
    setToolReceiving({
      ...toolReceiving,
      archivosAdjuntosRecibido: images,
    });
  };

  return (
    <>
      <div className="flex justify-between mt-6">
        <Comment
          comment={toolReceiving.comentarioRecepcion}
          handleSaveComment={handleSaveComment}
          handleRemoveComment={handleRemoveComment}
        />
        <Images
          savedImages={toolReceiving.archivosAdjuntosRecibido}
          handleSaveImages={(images) => handleSaveImages(images)}
          className="h-[36px]"
          showTitle
        />
        <Signature
          savedSignature={toolReceiving.firmaRecepcion}
          handleSignature={handleSignature}
        />
        <Button
          disabled={sending}
          onClick={handleReceiveTransfer}
          className="uppercase"
        >
          <ArrowDown />
          <span className=" hidden lg:block">Recibir</span>
        </Button>
      </div>
      <Toaster richColors position="bottom-right" />
    </>
  );
};
