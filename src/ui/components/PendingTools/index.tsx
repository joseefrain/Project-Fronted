import { useEffect, useState } from 'react';
import { Eye, ArrowDown, Search, FolderSync } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  getFormatedDate,
  incomingShipmentTableHeaders,
} from '@/shared/helpers/transferHelper';
import { store } from '@/app/store';
import { getPendingTransfers } from '@/app/slices/transferSlice';
import { useAppSelector } from '@/app/hooks';
import { IPendingTransfer } from '@/interfaces/transferInterfaces';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import DetallesEnvio from '@/shared/components/ui/Details';
import { Skeleton } from '@/components/ui/skeleton';
import './styles.scss';
import { IStatus } from '@/interfaces/branchInterfaces';

export default function PendingTools() {
  const user = useAppSelector((state) => state.auth.signIn.user);
  const { pending: pendingTransfer, status } = useAppSelector(
    (state) => state.transfer
  );
  const [searchTerm, setSearchTerm] = useState('');

  const filteredShipments = pendingTransfer?.filter(
    (shipment) =>
      (shipment.consecutivo &&
        shipment.consecutivo?.toString().includes(searchTerm)) ||
      shipment.sucursalDestinoId.nombre
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      shipment.usuarioIdEnvia.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!user?.sucursalId) return;
    store.dispatch(getPendingTransfers(user.sucursalId._id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto ">
      <Tabs defaultValue="receive">
        <Card className="product__list">
          <CardHeader>
            <div className="flex items-center gap-3">
              <FolderSync size={20} />
              <CardTitle>Products</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Consecutivo, bodega, enviado por..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <IncomingShipmentTable
              shipments={filteredShipments}
              status={status}
            />
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}

const IncomingShipmentTable = ({
  shipments,
  status,
}: {
  shipments: IPendingTransfer[];
  status: IStatus;
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {incomingShipmentTableHeaders.map((header) => (
            <TableHead
              key={header.key}
              className={`${['acciones'].includes(header.key) ? 'flex items-center justify-center' : ''}`}
            >
              {header.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {status === 'loading' &&
          [1, 2, 3, 4, 5].map((item) => <ShipmentSkeleton key={item} />)}

        {status === 'succeeded' &&
          shipments?.map((shipment) => (
            <TableRow key={shipment._id}>
              <TableCell>
                <Badge
                  variant={
                    shipment.estatusTraslado === 'En Proceso'
                      ? 'secondary'
                      : shipment.estatusTraslado === 'Terminado'
                        ? 'default'
                        : 'outline'
                  }
                >
                  {shipment.estatusTraslado === 'En Proceso'
                    ? 'Pendiente'
                    : shipment.estatusTraslado === 'Terminado'
                      ? 'Recibido'
                      : shipment.estatusTraslado === 'Terminado incompleto'
                        ? 'Incompleto'
                        : 'Solicitado'}
                </Badge>
              </TableCell>
              <TableCell>{shipment.consecutivo}</TableCell>
              <TableCell>{shipment.sucursalOrigenId.nombre}</TableCell>
              <TableCell>{getFormatedDate(shipment.fechaEnvio)}</TableCell>
              <TableCell>{shipment.usuarioIdEnvia.username}</TableCell>
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
                      <DetallesEnvio
                        pedidoId={shipment.consecutivo?.toString() ?? ''}
                        fechaCreacion={shipment.fechaRegistro}
                        origen={shipment.sucursalOrigenId.nombre}
                        destino={shipment.sucursalDestinoId.nombre}
                        fechaEnvio={shipment.fechaEnvio}
                        fechaRecepcion={null}
                        productos={[
                          shipment.firmaEnvio ?? '',
                          ...(shipment.archivosAdjuntos ?? []),
                        ]}
                        firmaRecepcion={null}
                        comentarioEnvio={shipment.comentarioEnvio ?? ''}
                      />
                    </DialogContent>
                  </Dialog>
                  <Link
                    to={`/transfer/pending/${shipment._id}/itemdepedido`}
                    state={{ id: shipment._id }}
                  >
                    <Button size="sm" className="text-white">
                      Recibir
                      <ArrowDown />
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

const ShipmentSkeleton = () => {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="skeleton" />
      </TableCell>
      <TableCell>
        <Skeleton className="skeleton" />
      </TableCell>
      <TableCell>
        <Skeleton className="skeleton" />
      </TableCell>
      <TableCell>
        <Skeleton className="skeleton" />
      </TableCell>
      <TableCell>
        <Skeleton className="skeleton" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="skeleton" />
      </TableCell>
    </TableRow>
  );
};
