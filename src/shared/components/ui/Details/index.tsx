import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  getFormatedDate,
  getTimeElapsed,
} from '@/shared/helpers/transferHelper';
import {
  ArrowRight,
  Package,
  Warehouse,
  Calendar,
  MessageSquare,
  PenTool,
  SquarePen,
} from 'lucide-react';

interface DetallesEnvioProps {
  pedidoId: string;
  fechaCreacion: Date;
  origen: string;
  destino: string;
  fechaEnvio: Date;
  fechaRecepcion: Date | null;
  productos: string[];
  comentarioEnvio: string;
  firmaRecepcion: string | null;
}

export default function DetallesEnvio({
  pedidoId,
  fechaCreacion,
  origen,
  destino,
  fechaEnvio,
  fechaRecepcion,
  productos,
  comentarioEnvio,
  firmaRecepcion,
}: DetallesEnvioProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden rounded-lg shadow-lg">
      <CardContent className="p-0">
        <Header pedidoId={pedidoId} />
        <div className="grid gap-4 p-6 bg-gray-50 dark:bg-black overflow-scroll max-h-[500px]">
          <FechaCreacion fecha={getTimeElapsed(fechaCreacion)} />
          <FechasEnvioRecepcion
            fechaEnvio={getFormatedDate(fechaEnvio)}
            fechaRecepcion={
              fechaRecepcion ? getFormatedDate(fechaRecepcion) : 'Pendiente'
            }
          />
          <Separator className="border-gray-300 dark:border-white" />
          <Ubicaciones origen={origen} destino={destino} />
          <Separator className="border-gray-300" />
          <ListaProductos images={productos} />
          <Separator className="border-gray-300" />
          <Comentario comentario={comentarioEnvio} />
          {firmaRecepcion && (
            <>
              <Separator className="border-gray-300" />
              <FirmaRecepcion firma={firmaRecepcion} />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Header({ pedidoId }: { pedidoId: string }) {
  return (
    <div className="p-4 text-white bg-black dark:bg-white dark:text-black">
      <h2 className="mb-2 text-2xl font-semibold uppercase font-onest">
        Detalles del Envío
      </h2>
      <p className="text-base uppercase opacity-90">{pedidoId}</p>
    </div>
  );
}

function FechaCreacion({ fecha }: { fecha: string }) {
  return (
    <div className="flex items-center justify-between text-gray-600">
      <div className="flex items-center space-x-2 text-sm">
        <SquarePen className="w-5 h-5 dark:text-white" />
        <span className="uppercase dark:text-white">
          Creado:
          <span className="ml-1 font-semibold text-black dark:text-white">
            {fecha}
          </span>
        </span>
      </div>
    </div>
  );
}

function Ubicaciones({ origen, destino }: { origen: string; destino: string }) {
  return (
    <div className="flex items-center justify-between text-gray-600">
      <div className="space-y-1 w-[120px] ">
        <Ubicacion label="Origen" ubicacion={origen} />
      </div>
      <ArrowRight className="w-6 h-6 text-indigo-500" />
      <div className="space-y-1 w-[150px]">
        <Ubicacion label="Destino" ubicacion={destino} />
      </div>
    </div>
  );
}

function Ubicacion({ label, ubicacion }: { label: string; ubicacion: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Warehouse className="w-5 h-5 dark:text-white" />
        <span className="uppercase dark:text-white">{label}</span>
      </div>
      <p className="font-semibold text-gray-800 dark:text-white">{ubicacion}</p>
    </div>
  );
}

function FechasEnvioRecepcion({
  fechaEnvio,
  fechaRecepcion,
}: {
  fechaEnvio: string;
  fechaRecepcion: string;
}) {
  return (
    <div className="flex items-center justify-between text-gray-600">
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="w-5 h-5 dark:text-white" />
          <span className="uppercase dark:text-white">Fecha de Envío</span>
        </div>
        <p className="font-semibold text-gray-800 dark:text-white">
          {fechaEnvio}
        </p>
      </div>
      <ArrowRight className="w-6 h-6 text-indigo-500" />
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-sm">
          <Package className="w-5 h-5 dark:text-white" />
          <span className="uppercase dark:text-white">Fecha de Recepción</span>
        </div>
        <p className="font-semibold text-gray-800 dark:text-white">
          {fechaRecepcion}
        </p>
      </div>
    </div>
  );
}

function ListaProductos({ images }: { images: string[] }) {
  return (
    <div>
      <h3 className="mb-4 text-base font-semibold text-gray-800 uppercase dark:text-white">
        Archivos
      </h3>
      <div
        className={`grid gap-4 ${images.length > 2 ? 'grid-cols-3' : 'grid-cols-2'}`}
      >
        {images.map((producto, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center p-2 transition duration-200 border rounded-lg shadow-sm hover:shadow-md max-h-fit"
          >
            <img
              src={producto}
              className="object-cover w-full h-auto mb-2 rounded-md"
              alt={`Producto ${idx + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function Comentario({ comentario }: { comentario: string }) {
  const comentarioSplit = comentario.split(/\s+/);
  const comentarioLimitado = comentarioSplit.slice(0, 20);

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <MessageSquare className="w-5 h-5 dark:text-white" />
        <span className="font-semibold text-black uppercase dark:text-white">
          Comentario de Envío
        </span>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="w-full p-4 text-[15px] font-sans font-normal text-left text-gray-700 bg-gray-100 rounded-lg">
            {comentarioLimitado.join(' ')}
            {comentarioSplit.length > 20 && '...'}
          </TooltipTrigger>
          <TooltipContent className="flex flex-nowrap max-w-[400px] text-sm dark:text-white">
            {comentario}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

function FirmaRecepcion({ firma }: { firma: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <PenTool className="w-5 h-5 dark:text-white" />
        <span className="dark:text-white font-onest">Firma de Recepción</span>
      </div>
      <div className="flex justify-center bg-gray-100 border rounded-lg">
        <img
          src={firma}
          alt="Firma de recepción"
          className="max-w-full h-[160px] object-contain"
        />
      </div>
    </div>
  );
}
