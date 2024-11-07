import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import './style.scss';
import { Branch, ITablaBranch } from '@/interfaces/branchInterfaces';
import { Check, ChevronsUpDown, PackageSearch } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/app/hooks';
import { cn } from '@/lib/utils';
import { store } from '@/app/store';
import { fetchBranches } from '@/app/slices/branchSlice';

export interface InventoryProps {
  products: ITablaBranch[];
  handleLoadBranch: (branch: Branch | undefined) => void;
}

export const Inventory = ({ products, handleLoadBranch }: InventoryProps) => {
  const user = useAppSelector((state) => state.auth.signIn.user);
  return (
    <Card className="inventory__card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <PackageSearch />
            Inventario
          </CardTitle>
          <CardDescription>Estado actual del inventario</CardDescription>
        </div>
        {!user?.sucursalId && (
          <BranchSelector handleLoadBranch={handleLoadBranch} />
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Producto</TableHead>
              <TableHead className="w-[20%] text-center">Precio</TableHead>
              <TableHead className="w-[20%] text-center">Stock</TableHead>
              <TableHead className="w-[20%] text-center">
                Punto Recompra
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="h-[50px]">
                <TableCell>{product.nombre}</TableCell>
                <TableCell className="text-center">
                  ${product.precio.$numberDecimal}
                </TableCell>
                <TableCell className="text-center">{product.stock}</TableCell>
                <TableCell className="text-center">
                  {product.puntoReCompra}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export interface BranchSelectorProps {
  handleLoadBranch: (branch: Branch | undefined) => void;
}

export const BranchSelector = ({ handleLoadBranch }: BranchSelectorProps) => {
  const branches = useAppSelector((state) => state.branches.data);
  const [open, setOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | undefined>();

  const handleSelectBranch = (branch: Branch | undefined) => {
    setSelectedBranch(branch);
    setOpen(false);
    handleLoadBranch(branch);
  };

  useEffect(() => {
    store.dispatch(fetchBranches()).unwrap();
  }, []);

  return (
    <div className="flex items-center w-[30%]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full"
          >
            {selectedBranch
              ? branches.find((branch) => branch._id === selectedBranch?._id)
                  ?.nombre
              : 'Selecciona sucursal'}
            <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[100%] p-0">
          <Command>
            <CommandInput placeholder="Buscar sucursal" />
            <CommandList className="product__list">
              <CommandEmpty>Sucursal no encontrada.</CommandEmpty>
              <CommandGroup>
                {branches.map((branch) => (
                  <CommandItem
                    key={branch._id}
                    value={branch.nombre}
                    onSelect={() => {
                      handleSelectBranch(
                        branch._id === selectedBranch?._id ? undefined : branch
                      );
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedBranch?._id === branch._id
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {branch.nombre}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
