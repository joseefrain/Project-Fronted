import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  getFormatedDate,
  getTimeElapsed,
} from '@/shared/helpers/transferHelper';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Eye } from 'lucide-react';
import { IPendingTransfer } from '@/interfaces/transferInterfaces';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface IImageGridCardProps {
  images: string[];
  title: string;
  subtitle: string;
  description?: string;
}
interface IOrder {
  order: IPendingTransfer;
}
export const MapIndex = ({ order }: IOrder) => {
  const imageSources = [
    order.firmaEnvio ?? '',
    ...(order.archivosAdjuntos ?? []),
  ];

  const navigate = useNavigate();

  return (
    <TableRow key={order._id} className="cursor-pointer">
      <TableCell
        className="cursor-pointer"
        onClick={() => navigate(`/transfer/recibido/${order._id}/itemdepedido`)}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>{order._id.slice(0, 8)}...</TooltipTrigger>
            <TooltipContent>{order._id}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell>{order.nombre}</TableCell>
      <TableCell>{getFormatedDate(order.fechaEnvio)}</TableCell>
      <TableCell>{order.sucursalOrigenId.nombre}</TableCell>
      <TableCell>{order.sucursalDestinoId.nombre}</TableCell>
      <TableCell>
        <Badge
          variant={
            order.estatusTraslado === 'En Proceso'
              ? 'secondary'
              : order.estatusTraslado === 'Terminado'
                ? 'default'
                : 'outline'
          }
        >
          {order.estatusTraslado === 'En Proceso'
            ? 'Pendiente'
            : order.estatusTraslado === 'Terminado'
              ? 'Recibido'
              : order.estatusTraslado === 'Terminado incompleto'
                ? 'Incompleto'
                : 'Solicitado'}
        </Badge>
      </TableCell>
      <TableCell>{order.usuarioIdEnvia.username}</TableCell>
      <TableCell>
        <div className="flex items-center justify-center gap-2">
          <Dialog>
            <DialogTrigger>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                Ver detalles
              </Button>
            </DialogTrigger>
            <DialogContent className="p-3">
              <ImageGridCard
                images={imageSources ?? ''}
                title={order.usuarioIdEnvia.username}
                subtitle={getTimeElapsed(new Date(order.fechaEnvio))}
                description={order.comentarioEnvio}
              />
            </DialogContent>
          </Dialog>
        </div>
      </TableCell>
    </TableRow>
  );
};

export const ImageGridCard = ({
  images,
  title,
  subtitle,
  description,
}: IImageGridCardProps) => {
  const imageCount = images.length;

  const getGridClass = () => {
    if (imageCount === 1) return 'grid-cols-1';
    if (imageCount <= 3) return 'grid-cols-2';
    if (imageCount === 4) return 'grid-cols-2';
    return 'grid-cols-3';
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader className="flex flex-row items-center space-x-4">
        <div className="flex items-center justify-center w-12 h-12 bg-green-700 rounded-full cursor-pointer">
          <span className="text-lg font-semibold text-white">
            {title.charAt(0) ?? 'A'}
          </span>
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 overflow-scroll max-h-[550px]">
        {description && (
          <p className="text-sm"> Comentario de envío: {description}</p>
        )}
        {imageCount > 0 ? (
          <div className={`grid ${getGridClass()} gap-1`}>
            {images.slice(0, 6).map((src, index) => (
              <div
                key={index}
                className={`
                  ${imageCount === 3 && index === 2 ? 'col-span-2' : ''}
                  ${imageCount >= 5 && index >= 3 ? 'col-span-1' : ''}
                  ${imageCount === 1 ? 'col-span-1' : ''}
                  relative aspect-square overflow-hidden rounded-lg dark:bg-white
                  ${index === 0 ? 'border border-gray-300' : ''}
                `}
              >
                <img
                  src={src}
                  alt={index === 0 ? 'Firma' : `Imagen adjunta ${index}`}
                  className="object-contain w-full h-full"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No hay imágenes disponibles
          </p>
        )}
      </CardContent>
    </Card>
  );
};
