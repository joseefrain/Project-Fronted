import { useAppSelector } from '@/app/hooks';
import {
  clearTransferDataReceived,
  receiveTransfer,
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
import { ListOrdered } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MapIndex } from './table';
import { ROLE } from '../../../interfaces/roleInterfaces';
import {
  findBranchById,
  getSelectedBranchFromLocalStorage,
} from '../../../shared/helpers/branchHelpers';
import { updateSelectedBranch } from '../../../app/slices/branchSlice';
import { GetBranches } from '../../../shared/helpers/Branchs';
import { Button } from '../../../components/ui/button';
import { Branch } from '../../../interfaces/branchInterfaces';
import Pagination from '../../../shared/components/ui/Pagination/Pagination';

const orderStatusOptions = [
  { value: 'Todos', label: 'Ver Todos' },
  { value: 'En Proceso', label: 'Pendiente' },
  { value: 'Terminado', label: 'Recibido' },
  { value: 'Terminado incompleto', label: 'Incompleto' },
  { value: 'Solicitado', label: 'Solicitado' },
];

export const BranchReceived = () => {
  const DataAlls = useAppSelector((state) => state.transfer.dataBranchReceived);
  const branches = useAppSelector((state) => state.branches.data);
  const { selectedBranch } = useAppSelector((state) => state.branches);
  const userRoles = useAppSelector((state) => state.auth.signIn.user);
  const [sourceBranch, setSourceBranch] = useState<Branch | null>(null);
  const branchIdFromLocalStorage = getSelectedBranchFromLocalStorage();
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (selectedBranch) {
      store.dispatch(clearTransferDataReceived());

      store.dispatch(receiveTransfer(selectedBranch._id ?? '')).unwrap();
    }
  }, [selectedBranch]);

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  const filteredProducts = DataAlls?.filter((product) => {
    const matchesNombre = product?.nombre
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSucursalDestino = product?.sucursalDestinoId?.nombre
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSucursalOrigen = product?.sucursalOrigenId?.nombre
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'Todos' || product.estatusTraslado === selectedStatus;

    return (
      (matchesNombre || matchesSucursalDestino || matchesSucursalOrigen) &&
      matchesStatus
    );
  });

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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const paginatedData = Math.ceil(filteredProducts.length / itemsPerPage);
  console.log(currentItems, 'currentItems');
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
            <div className="flex space-x-2">
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
              {userRoles?.role === ROLE.ROOT && (
                <Button
                  type="button"
                  className="w-[200px] px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-none hover:shadow-none"
                  disabled={!sourceBranch}
                >
                  {sourceBranch
                    ? sourceBranch.nombre
                    : userRoles?.sucursalId?.nombre || 'Seleccionar Sucursal'}
                </Button>
              )}
            </div>
          </div>

          <>
            {' '}
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems && currentItems.length > 0 ? (
                  currentItems.map((order) => (
                    <MapIndex order={order} key={order._id} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No hay órdenes para mostrar.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <CardFooter className="flex items-center justify-between">
              <Pagination
                currentPage={currentPage}
                totalPages={paginatedData}
                onPageChange={setCurrentPage}
              />
            </CardFooter>
          </>
        </CardContent>
      </Card>
    </div>
  );
};
