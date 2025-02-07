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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Branch } from '@/interfaces/branchInterfaces';
import {
  IDescountTypePV,
  IDescuentoCreate,
} from '@/interfaces/salesInterfaces';
import { cn } from '@/lib/utils';
import { SelectSearch } from '@/shared/components/ui/SelectSearch';
import { format } from 'date-fns';
import React from 'react';
import { ROLE } from '../../../interfaces/roleInterfaces';
import { toast } from 'sonner';

interface IndexModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  editingId: string | null;
  updateFormState: (field: keyof IDescuentoCreate, value: string) => void;
  formState: IDescuentoCreate;
  handleSubmit: (e: React.FormEvent) => void;
  handleSelectChangeCategory: (value: string) => void;
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
  opcionesProductos:
    | {
        id: string;
        nombre: string;
      }[]
    | undefined;
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
  handleSelectChangeCategory,
  handleSelectChangeBranch,
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
        <DialogContent className="w-[92%] rounded-[8px]">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Editar Descuento' : 'Crear Descuento'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="flex flex-col justify-center w-full gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  className="w-full"
                  id="nombre"
                  value={formState.nombre}
                  onChange={(e) => updateFormState('nombre', e.target.value)}
                />
              </div>
              <div className="flex flex-col justify-center w-full gap-2">
                <Label htmlFor="tipoDescuento">Tipo</Label>
                <div className="w-full">
                  <Select
                    value={formState.tipoDescuentoEntidad}
                    onValueChange={(value) => {
                      updateFormState('tipoDescuentoEntidad', value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Opciones</SelectLabel>
                        <SelectItem value="Product">Producto</SelectItem>
                        <SelectItem value="Group">Categoría</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex w-full gap-4 max-sm:flex-col">
                <div className="flex flex-col w-full gap-1">
                  <Label htmlFor="tipoDescuento">Seleccion</Label>
                  <SelectSearch
                    classStyles="w-fit"
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
                      stateProduct ? handleProducts : handleSelectChangeCategory
                    }
                  />
                </div>
                {userRoles?.role === ROLE.ROOT && (
                  <div className="flex flex-col w-full gap-1">
                    <Label htmlFor="tipoDescuento">Sucursal</Label>
                    <SelectSearch
                      classStyles="w-fit"
                      options={[
                        { id: 'Todos', nombre: 'Todos' },
                        ...options.map((b) => ({
                          id: b.id,
                          nombre: b.nombre,
                        })),
                      ]}
                      placeholder="Seleccione una sucursal"
                      initialValue={formState.sucursalId || 'Todos'}
                      onChange={handleSelectChangeBranch}
                    />
                  </div>
                )}
              </div>
              <div className="flex w-full gap-4">
                <div className="w-full">
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
                <div className="w-full">
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
              </div>
              <div className="flex w-full gap-4">
                <div className="flex flex-col justify-center w-full gap-2">
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
                          if (date && date >= new Date()) {
                            updateFormState('fechaInicio', date.toISOString());
                          } else {
                            toast.error(
                              'La fecha inicial no puede ser menor a la fecha actual.'
                            );
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex flex-col justify-center w-full gap-2">
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
                          if (date && date >= new Date()) {
                            updateFormState('fechaFin', date.toISOString());
                          } else {
                            toast.error(
                              'La fecha final no puede ser a la fecha Inicial'
                            );
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex w-full gap-4">
                <div className="flex flex-col w-full gap-2">
                  <Label htmlFor="tipoDescuento"> Tipo del Minimo</Label>
                  <Select
                    value={formState.minimiType}
                    onValueChange={(value) =>
                      updateFormState('minimiType', value as IDescountTypePV)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compra">Compra</SelectItem>
                      <SelectItem value="cantidad">Cantidad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formState.minimiType === 'compra' && (
                  <div className="flex flex-col w-full gap-2">
                    <Label htmlFor="minimoCompra">Mínimo Compra</Label>
                    <Input
                      id="minimoCompra"
                      type="number"
                      value={formState?.minimoCompra?.$numberDecimal}
                      onChange={(e) =>
                        updateFormState('minimoCompra', e.target.value)
                      }
                    />
                  </div>
                )}
                {formState.minimiType === 'cantidad' && (
                  <div className="flex flex-col w-full gap-2">
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
                )}
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
              <Button type="submit">{editingId ? 'Editar' : 'Crear'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
