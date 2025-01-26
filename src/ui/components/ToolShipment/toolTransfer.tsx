import { Button } from '@/components/ui/button';
import Signature from './signature';
import Comment from './comment';
import { Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import Images from './photo';
import {
  ITransferDetails,
  IToolTransferProps,
} from '@/interfaces/transferInterfaces';
import {
  createProductTransfer,
  updateStatus,
} from '@/app/slices/transferSlice';
import { store } from '@/app/store';
import { Toaster, toast } from 'sonner';
import { isValidTransfer } from '@/shared/helpers/transferHelper';

export const ToolTransfer = ({
  destinationBranchId,
  sourceBranchId,
  shipmentTools,
  userId,
  setShipmentTools,
}: IToolTransferProps) => {
  const [hasStockIssues, setHasStockIssues] = useState(false);

  useEffect(() => {
    const stockIssues = shipmentTools.some(
      (tool) => tool.stock < tool?.puntoReCompra!
    );
    setHasStockIssues(stockIssues);
  }, [shipmentTools]);

  const [sending, setSending] = useState(false);
  const [toolTransfer, setToolTransfer] = useState<ITransferDetails>({
    comentarioEnvio: null,
    firmaEnvio: '',
    sucursalOrigenId: '',
    sucursalDestinoId: '',
    archivosAdjuntos: [],
    usuarioIdEnvia: '',
  });

  const handleSaveComment = (comment: string) => {
    setToolTransfer({
      ...toolTransfer,
      comentarioEnvio: comment,
    });
  };

  const handleRemoveComment = () => {
    setToolTransfer({
      ...toolTransfer,
      comentarioEnvio: null,
    });
  };

  const handleSendTransfer = async () => {
    setSending(true);
    const validTransfer = isValidTransfer(toolTransfer, shipmentTools.length);
    if (!validTransfer) return setSending(false);

    const formattedTools = shipmentTools.map((tool) => ({
      inventarioSucursalId: tool.inventarioSucursalId,
      cantidad: tool.quantityToSend,
      comentarioEnvio: tool.comment,
      archivosAdjuntos: tool.gallery,
    }));

    const request = store
      .dispatch(
        createProductTransfer({
          ...toolTransfer,
          listDetalleTraslado: formattedTools,
        })
      )
      .unwrap()
      .catch((err) => {
        store.dispatch(updateStatus('idle'));
        setSending(false);
        return Promise.reject(err);
      })
      .then(() => {
        setTimeout(() => {
          store.dispatch(updateStatus('idle'));
          setShipmentTools([]);
          setToolTransfer({
            ...toolTransfer,
            comentarioEnvio: null,
            firmaEnvio: '',
            archivosAdjuntos: [],
          });
          setSending(false);
        }, 1000);
      });

    toast.promise(request, {
      loading: 'Enviando...',
      success: hasStockIssues
        ? '¡Transferencia enviada, pero algunos productos no tienen stock suficiente!'
        : '¡Transferencia enviada!',
      error: (err) => `Error al enviar transferencia: ${err}`,
    });
  };

  const handleSignature = (signature: string | null) => {
    setToolTransfer({
      ...toolTransfer,
      firmaEnvio: signature,
    });
  };

  const handleSaveImages = (images: string[]) => {
    setToolTransfer({
      ...toolTransfer,
      archivosAdjuntos: images,
    });
  };

  useEffect(() => {
    setToolTransfer({
      ...toolTransfer,
      sucursalOrigenId: sourceBranchId ?? '',
      sucursalDestinoId: destinationBranchId,
      usuarioIdEnvia: userId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceBranchId, destinationBranchId]);

  return (
    <>
      <div className="flex justify-between">
        <Comment
          comment={toolTransfer.comentarioEnvio}
          handleSaveComment={handleSaveComment}
          handleRemoveComment={handleRemoveComment}
        />
        <Images
          savedImages={toolTransfer.archivosAdjuntos}
          handleSaveImages={(images) => handleSaveImages(images)}
          className="h-[36px]"
          showTitle
        />
        <Signature
          savedSignature={toolTransfer.firmaEnvio}
          handleSignature={handleSignature}
        />
        <Button
          disabled={sending}
          onClick={handleSendTransfer}
          className="uppercase"
        >
          <Send className="w-4 h-4" />
          <div className="hidden lg:block">Enviar</div>
        </Button>
      </div>
      <Toaster richColors position="bottom-right" />
    </>
  );
};
