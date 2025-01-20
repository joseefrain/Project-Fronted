import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Branch } from '@/interfaces/branchInterfaces';
import { IDescuentoCreate } from '@/interfaces/salesInterfaces';
import { cn } from '@/lib/utils';
import { SelectSearch } from '@/shared/components/ui/SelectSearch';
import { format } from 'date-fns';
import React from 'react';
import { ROLE } from '../../../interfaces/roleInterfaces';

interface IndexModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  editingId: string | null;
  updateFormState: (field: keyof IDescuentoCreate, value: string) => void;
  formState: IDescuentoCreate;
  handleSubmit: (e: React.FormEvent) => void;
  handleSelectChange: (value: string) => void;
  handleSelectChangeBranch: (value: string) => void;
  selectedBranch: {
    _id: string;
    nombre: string;
  } | null;
  options: {
    id: string;
    nombre: string;
  }[];
  groupsAllOptions: {
    id: any;
    nombre: any;
  }[];
  stateProduct: boolean;
  opcionesProductos: {
    id: string;
    nombre: string;
  }[];
  userRoles?: {
    _id: string;
    username: string;
    role: ROLE;
    sucursalId?: Branch;
  };
  handleProducts: (value: string) => void;
}

export const IndexModal = ({
  isModalOpen,
  setIsModalOpen,
  editingId,
  updateFormState,
  formState,
  handleSubmit,
  handleSelectChange,
  handleSelectChangeBranch,
  selectedBranch,
  options,
  groupsAllOptions,
  stateProduct,
  opcionesProductos,
  userRoles,
  handleProducts,
}: IndexModalProps) => {
  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="font-onest">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Discount' : 'Add Discount'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  className="w-full"
                  id="nombre"
                  value={formState.nombre}
                  onChange={(e) => updateFormState('nombre', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="tipoDescuento">Tipo</Label>
                <Select
                  value={formState.tipoDescuentoEntidad || ''}
                  onValueChange={(value) => {
                    updateFormState('tipoDescuentoEntidad', value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Product">Producto</SelectItem>
                    <SelectItem value="Group">Categoría</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-full gap-4">
                <div className={'w-full'}>
                  <Label htmlFor="tipoDescuento">Seleccion</Label>
                  <SelectSearch
                    key={formState.tipoDescuentoEntidad}
                    options={
                      stateProduct ? opcionesProductos : groupsAllOptions
                    }
                    placeholder={
                      stateProduct
                        ? 'Seleccione un producto'
                        : 'Seleccione una categoría'
                    }
                    initialValue={
                      stateProduct
                        ? formState.productId || ''
                        : formState.groupId || ''
                    }
                    onChange={
                      stateProduct ? handleProducts : handleSelectChange
                    }
                  />
                </div>
                {userRoles?.role === ROLE.ROOT && (
                  <div>
                    <Label htmlFor="tipoDescuento">Sucursal</Label>
                    <SelectSearch
                      options={options}
                      placeholder="Selecione Sucursal"
                      initialValue={selectedBranch?._id ?? ''}
                      onChange={handleSelectChangeBranch}
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="tipoDescuento">Tipo Descuento</Label>
                <Select
                  value={formState.tipoDescuento}
                  onValueChange={(value) =>
                    updateFormState(
                      'tipoDescuento',
                      value as 'porcentaje' | 'valor'
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="porcentaje">Porcentaje</SelectItem>
                    <SelectItem value="valor">Valor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="valorDescuento">Valor Descuento</Label>
                <Input
                  id="valorDescuento"
                  type="number"
                  value={formState.valorDescuento}
                  onChange={(e) =>
                    updateFormState('valorDescuento', e.target.value)
                  }
                />
              </div>
              <div className="flex w-full gap-4">
                <div>
                  <Label>Fecha Inicio</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          formState.fechaInicio && 'text-muted-foreground'
                        )}
                      >
                        {formState.fechaInicio ? (
                          format(formState.fechaInicio, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formState.fechaInicio}
                        onSelect={(date) => {
                          if (date) {
                            updateFormState('fechaInicio', date.toISOString());
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Fecha Fin</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          formState.fechaFin && 'text-muted-foreground'
                        )}
                      >
                        {formState.fechaFin ? (
                          format(formState.fechaFin, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formState.fechaFin}
                        onSelect={(date) => {
                          if (date) {
                            updateFormState('fechaFin', date.toISOString());
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label htmlFor="minimoCompra">Mínimo Compra</Label>
                <Input
                  id="minimoCompra"
                  type="number"
                  value={formState.minimoCompra}
                  onChange={(e) =>
                    updateFormState('minimoCompra', e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="minimoCantidad">Mínimo Cantidad</Label>
                <Input
                  id="minimoCantidad"
                  type="number"
                  value={formState.minimoCantidad}
                  onChange={(e) =>
                    updateFormState('minimoCantidad', e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="codigoDescunto">Código Descuento</Label>
                <Input
                  id="codigoDescunto"
                  value={formState.codigoDescunto}
                  onChange={(e) =>
                    updateFormState('codigoDescunto', e.target.value)
                  }
                />
              </div>
              <Button
                disabled={
                  formState.minimoCantidad === 0 ||
                  formState.minimoCompra === 0 ||
                  formState.valorDescuento <= 0
                }
                type="submit"
              >
                {editingId ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
