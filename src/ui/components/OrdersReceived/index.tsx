import { OrdersReceivedById } from '@/app/slices/transferSlice';
import { store } from '@/app/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IDetalleSelected } from '@/interfaces/transferInterfaces';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuxiliarMap } from './auxiMap';
import { Loader } from '@/shared/components/ui/Loader';

export const OrdersReceived = () => {
  const [items, setItems] = useState<IDetalleSelected | null>(null);
  const dataGeneral = items?.listItemDePedido;
  const dataAuxiliar = items?.traslado;
  const { Id } = useParams<{ Id: string }>();
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!Id) return;
    const response = await store.dispatch(OrdersReceivedById(Id));
    setItems(response.payload as IDetalleSelected);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [Id]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = dataGeneral?.filter((product) =>
    product.inventarioSucursalId.productoId.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-4">
              <div className="flex space-x-2">
                <Button variant="outline">Order History</Button>
              </div>
              <div className="flex  space-x-2">
                <Input
                  type="text"
                  placeholder="Search..."
                  className="max-w-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Recibido</TableCell>
                  <TableCell>Estatus</TableCell>
                  {<TableCell>Acciones</TableCell>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <div className="loader">
                    <Loader />
                  </div>
                ) : filteredProducts && filteredProducts.length > 0 ? (
                  filteredProducts.map((order) => (
                    <AuxiliarMap
                      dataTable={order}
                      dataAuxiliar={dataAuxiliar}
                      key={order._id}
                    />
                  ))
                ) : (
                  <div>No hay datos disponibles.</div>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
