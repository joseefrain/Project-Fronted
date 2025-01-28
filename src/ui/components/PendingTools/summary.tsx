import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IProductoTraslado } from '@/interfaces/transferInterfaces';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { MessageSquareMore } from 'lucide-react';
import Images from '../ToolShipment/photo';
import Comment from '../ToolShipment/comment';
import { Badge } from '@/components/ui/badge';
import { IStatus } from '@/interfaces/branchInterfaces';
import { Skeleton } from '@/components/ui/skeleton';
import './styles.scss';
import { Switch } from '../../../components/ui/switch';
import { useState } from 'react';

const productStates = [
  { id: 1, value: 'Buen estado' },
  { id: 2, value: 'Regular' },
  { id: 3, value: 'Malo' },
  { id: 4, value: 'Incompleto' },
  { id: 5, value: 'Extraviado' },
];

export interface ISummaryPendingTools {
  status: IStatus;
  shipments: IProductoTraslado[];
  handleChangeQuantityReceived: (id: string, quantity: number) => void;
  handleChangePricing: (id: string, price: number) => void;
  handleChangeBuyback: (id: string, priceBuyback: number) => void;
  handleChangeProductState: (id: string, state: string) => void;
  handleSaveImages: (id: string, images: string[]) => void;
  handleSaveComment: (id: string, comment: string) => void;
  handleRemoveComment: (id: string) => void;
}

export const SummaryPendingTools = ({
  status,
  shipments,
  handleChangeQuantityReceived,
  handleChangePricing,
  handleChangeProductState,
  handleSaveImages,
  handleSaveComment,
  handleRemoveComment,
  handleChangeBuyback,
}: ISummaryPendingTools) => {
  const [supplierMode, setSupplierMode] = useState(false);

  const handleChangeToogle = () => {
    setSupplierMode(!supplierMode);
  };

  return (
    <Card className="branch__transfer__list">
      <CardHeader>
        <CardTitle>Productos a recibir</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[12%]">Código</TableHead>
              <TableHead className="w-[15%]">Nombre</TableHead>
              <TableHead className="w-[10%]">Enviado</TableHead>
              <TableHead className="w-[10%]">Recibido</TableHead>
              <TableHead className="w-[10%]">Precio ud.</TableHead>
              <TableHead className="w-[10%]">MinimoStock</TableHead>
              <TableHead className="w-[13%]">Estado</TableHead>
              <TableHead className=" text-center w-[15%]">Detalles</TableHead>
              <TableHead className="text-center w-[15%]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {status === 'loading' &&
              [1, 2, 3].map((item) => <ShipmentSkeleton key={item} />)}
            {status === 'succeeded' &&
              shipments.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {product.id.slice(0, 10)}
                          ...
                        </TooltipTrigger>
                        <TooltipContent>{product.id}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>{product.nombre}</TableCell>
                  <TableCell>
                    <Badge
                      variant={'secondary'}
                      className="flex items-center justify-center h-[36px] w-[50%]"
                    >
                      {product.cantidadEnviada}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={0}
                      className="text-center w-[60%]"
                      value={product.cantidad}
                      onChange={(e) =>
                        handleChangeQuantityReceived(
                          product.id,
                          parseInt(e.target.value)
                        )
                      }
                      disabled={!supplierMode}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={0}
                      className="text-center w-[80px] max-w-full"
                      value={product.precio}
                      onChange={(e) =>
                        handleChangePricing(
                          product.id,
                          parseInt(e.target.value)
                        )
                      }
                      disabled={!supplierMode}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={0}
                      className="text-center w-[60%]"
                      value={product?.puntoReCompra}
                      onChange={(e) =>
                        handleChangeBuyback(
                          product.id,
                          parseInt(e.target.value)
                        )
                      }
                      disabled={!supplierMode}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={product.estadoProducto}
                      onValueChange={(state) =>
                        handleChangeProductState(product.id, state)
                      }
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        {productStates.map((state) => (
                          <SelectItem key={state.id} value={state.value}>
                            {state.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Images
                        savedImages={product.archivosAdjuntosEnviado ?? []}
                        readonly
                      />
                      <Comment
                        comment={product.comentarioEnvio ?? ''}
                        placeholder="No hay comentario"
                        readonly
                      >
                        <Button variant="outline" size="sm">
                          <MessageSquareMore className="w-4 h-4 mr-1" />
                        </Button>
                      </Comment>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Switch
                        className="p-0"
                        checked={supplierMode}
                        onCheckedChange={setSupplierMode}
                        onClick={handleChangeToogle}
                      />
                      <Images
                        savedImages={product.archivosAdjuntosRecibido ?? []}
                        handleSaveImages={(images) =>
                          handleSaveImages(product.id, images)
                        }
                      />
                      <Comment
                        comment={product.comentarioRecibido ?? ''}
                        handleRemoveComment={() =>
                          handleRemoveComment(product.id)
                        }
                        handleSaveComment={(comment) =>
                          handleSaveComment(product.id, comment)
                        }
                        buttonText=""
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const ShipmentSkeleton = () => {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="product__skeleton" />
      </TableCell>
      <TableCell>
        <Skeleton className="product__skeleton" />
      </TableCell>
      <TableCell>
        <Skeleton className="product__skeleton" />
      </TableCell>
      <TableCell>
        <Skeleton className="product__skeleton" />
      </TableCell>
      <TableCell>
        <Skeleton className="product__skeleton" />
      </TableCell>
      <TableCell>
        <Skeleton className="product__skeleton" />
      </TableCell>
      <TableCell>
        <Skeleton className="product__skeleton" />
      </TableCell>
      <TableCell>
        <Skeleton className="product__skeleton" />
      </TableCell>
    </TableRow>
  );
};
