import { useAppSelector } from '@/app/hooks';
import {
  clearTransferData,
  getAllProductTransfer,
  OrdersReceivedById,
} from '@/app/slices/transferSlice';
import { store } from '@/app/store';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IDetalleSelected } from '@/interfaces/transferInterfaces';
import { Loader } from '@/shared/components/ui/Loader';
import Pagination from '@/shared/components/ui/Pagination/Pagination';
import { ListOrdered } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import {
  findBranchById,
  getSelectedBranchFromLocalStorage,
} from '../../../shared/helpers/branchHelpers';
import { MapIndex } from './mapIndex';
import { Branch } from '../../../interfaces/branchInterfaces';
import { updateSelectedBranch } from '../../../app/slices/branchSlice';
import { GetBranches } from '../../../shared/helpers/Branchs';

const orderStatusOptions = [
  { value: 'Todos', label: 'Ver Todos' },
  { value: 'En Proceso', label: 'Pendiente' },
  { value: 'Terminado', label: 'Recibido' },
  { value: 'Terminado incompleto', label: 'Incompleto' },
  { value: 'Solicitado', label: 'Solicitado' },
];

export const ShippedOrders = () => {
  const DataAlls = useAppSelector((state) => state.transfer.data);
  const branches = useAppSelector((state) => state.branches.data);
  const { selectedBranch, loading } = useAppSelector((state) => state.branches);
  const [items, setItems] = useState<IDetalleSelected | null>(null);
  const { Id } = useParams<{ Id: string }>();
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (selectedBranch) {
      store.dispatch(clearTransferData());
      store.dispatch(getAllProductTransfer(selectedBranch._id ?? '')).unwrap();
    }
  }, [selectedBranch]);

  const fetchData = async () => {
    if (!Id) return;
    const response = await store.dispatch(OrdersReceivedById(Id));
    setItems(response.payload as IDetalleSelected);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Id]);

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  const filteredProducts = DataAlls?.filter((product) => {
    const matchesNombre = product.nombre
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSucursalDestino = product.sucursalDestinoId.nombre
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSucursalOrigen = product.sucursalOrigenId.nombre
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'Todos' || product.estatusTraslado === selectedStatus;

    const matchesSucursal = selectedBranch
      ? product.sucursalDestinoId._id === selectedBranch._id ||
        product.sucursalOrigenId._id === selectedBranch._id
      : true;

    return (
      (matchesNombre || matchesSucursalDestino || matchesSucursalOrigen) &&
      matchesStatus &&
      matchesSucursal
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const paginatedData = Math.ceil(filteredProducts.length / itemsPerPage);

  const user = useAppSelector((state) => state.auth.signIn.user);
  const [sourceBranch, setSourceBranch] = useState<Branch | null>(null);
  const branchIdFromLocalStorage = getSelectedBranchFromLocalStorage();

  useEffect(() => {
    if (branchIdFromLocalStorage) {
      const branch = findBranchById(branches, branchIdFromLocalStorage);
      if (branch) {
        setSourceBranch(branch);
        handleLoadBranch(branch);
      }
    }
  }, [branches, branchIdFromLocalStorage]);

  const handleLoadBranch = async (branch: Branch | null) => {
    if (!branch) return store.dispatch(updateSelectedBranch(null));

    const response = await GetBranches(branch._id ?? '');
    store.dispatch(
      updateSelectedBranch({
        ...branch,
        products: response,
      })
    );
  };

  return (
    <div className="container mx-auto space-y-6 font-onest">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <ListOrdered size={20} />
            <CardTitle>Products</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4 max-sm:flex-col max-sm:gap-3">
            <div className="flex space-x-2 ">
              <Select onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent className="font-onest">
                  <SelectGroup>
                    <SelectLabel>Estados de Pedido</SelectLabel>
                    {orderStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Search..."
                className="max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button
                type="button"
                className="w-[200px] px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-none hover:shadow-none"
                disabled={!sourceBranch}
              >
                {sourceBranch
                  ? sourceBranch.nombre
                  : user?.sucursalId?.nombre || 'Seleccionar Sucursal'}
              </Button>
            </div>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader />
            </div>
          ) : selectedBranch ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Fecha de envío</TableCell>
                  <TableCell>Sucursal Envia</TableCell>
                  <TableCell>Sucursal Destino</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Enviado por</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems &&
                  currentItems.length > 0 &&
                  currentItems.map((order) => (
                    <MapIndex order={order} items={items} key={order._id} />
                  ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center h-40 text-red-600">
              No hay productos enviados en esta sucursal
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Pagination
            currentPage={currentPage}
            totalPages={paginatedData}
            onPageChange={setCurrentPage}
          />
        </CardFooter>
      </Card>
    </div>
  );
};
