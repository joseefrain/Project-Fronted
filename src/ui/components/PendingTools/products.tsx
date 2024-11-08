import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Tabs } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { store } from '@/app/store';
import {
  getPendingProductsByTransfer,
  setPendingSelected,
} from '@/app/slices/transferSlice';
import { useAppSelector } from '@/app/hooks';
import { SummaryPendingTools } from './summary';
import { PendingProductsActions } from './actions';
import { useParams } from 'react-router-dom';
import { IProductoTraslado } from '@/interfaces/transferInterfaces';

export default function PendingProductsByTransfer() {
  const { id } = useParams<{ id: string }>();
  const { selectedPending: pendingTransfer, status } = useAppSelector(
    (state) => state.transfer
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [shipments, setShipments] = useState<IProductoTraslado[]>([]);

  const ShipmentList = shipments.filter(
    (shipment) =>
      shipment.inventarioSucursalId &&
      shipment.nombre
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleChangeQuantityReceived = (id: string, quantity: number) => {
    const isReceived = quantity > 0;

    const updatedShipments = shipments.map((shipment) =>
      shipment.id === id
        ? { ...shipment, cantidad: quantity, recibido: isReceived }
        : shipment
    );
    setShipments(updatedShipments);
  };

  const handleChangePricing = (id: string, price: number) => {
    const updatedShipments = shipments.map((shipment) =>
      shipment.id === id ? { ...shipment, precio: price } : shipment
    );
    setShipments(updatedShipments);
  };
  const handleChangeBuyback = (id: string, priceBuyback: number) => {
    const updatedShipments = shipments.map((shipment) =>
      shipment.id === id
        ? { ...shipment, puntoReCompra: priceBuyback }
        : shipment
    );
    setShipments(updatedShipments);
  };

  const handleChangeProductState = (id: string, state: string) => {
    const updatedShipments = shipments.map((shipment) =>
      shipment.id === id
        ? { ...shipment, estadoProducto: state, estadoEquipo: state }
        : shipment
    );
    setShipments(updatedShipments);
  };

  const handleSaveImages = (id: string, images: string[]) => {
    console.log(images);
    const updatedShipments = shipments.map((shipment) =>
      shipment.id === id
        ? { ...shipment, archivosAdjuntosRecibido: images }
        : shipment
    );
    setShipments(updatedShipments);
  };

  const handleSaveComment = (id: string, comment: string) => {
    const updatedShipments = shipments.map((shipment) =>
      shipment.id === id
        ? { ...shipment, comentarioRecibido: comment }
        : shipment
    );
    setShipments(updatedShipments);
  };

  const handleRemoveComment = (id: string) => {
    const updatedShipments = shipments.map((shipment) =>
      shipment.id === id ? { ...shipment, comentarioRecibido: null } : shipment
    );
    setShipments(updatedShipments);
  };

  useEffect(() => {
    if (!id) return;
    store.dispatch(getPendingProductsByTransfer(id));

    return () => {
      store.dispatch(setPendingSelected(null));
    };
  }, [id]);

  useEffect(() => {
    if (!pendingTransfer) return;

    const formattedShipmentData: IProductoTraslado[] =
      pendingTransfer.listItemDePedido.map((shipment) => ({
        id: shipment.inventarioSucursalId.productoId._id,
        nombre: shipment.inventarioSucursalId.productoId.nombre,
        archivosAdjuntosEnviado: shipment.archivosAdjuntos ?? [],
        comentarioEnvio: shipment.comentarioEnvio ?? '',
        cantidadEnviada: shipment.cantidad,
        inventarioSucursalId: shipment.inventarioSucursalId._id,
        cantidad: shipment.cantidad,
        archivosAdjuntosRecibido: [],
        comentarioRecibido: '',
        estadoEquipo: '',
        precio: Number(shipment.inventarioSucursalId.precio.$numberDecimal),
        recibido: true,
        estadoProducto: '',
        puntoReCompra: Number(shipment.inventarioSucursalId.puntoReCompra),
      }));

    setShipments(formattedShipmentData);
  }, [pendingTransfer]);

  return (
    <div className="container mx-auto ">
      <Tabs defaultValue="receive">
        <Card className="product__list">
          <br />
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <SummaryPendingTools
              shipments={ShipmentList}
              status={status}
              handleChangeQuantityReceived={handleChangeQuantityReceived}
              handleChangePricing={handleChangePricing}
              handleChangeBuyback={handleChangeBuyback}
              handleChangeProductState={handleChangeProductState}
              handleSaveImages={handleSaveImages}
              handleSaveComment={handleSaveComment}
              handleRemoveComment={handleRemoveComment}
            />
            <PendingProductsActions
              trasladoId={id ?? ''}
              shipments={shipments}
            />
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
