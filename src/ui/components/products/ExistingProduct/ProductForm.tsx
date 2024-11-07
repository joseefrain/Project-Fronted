import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { IProductoGroups, ITablaBranch } from '@/interfaces/branchInterfaces';
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InventarioSucursal } from '@/interfaces/transferInterfaces';
import { useAppSelector } from '@/app/hooks';

interface ProductFormProps {
  initialData?: InventarioSucursal;
  onSubmit: (data: ITablaBranch) => void;
  sucursalId: string;
  handleSelectChange: (value: string) => void;
  selectedGroup: {
    nombre: string;
    _id: string;
  } | null;
  groups: IProductoGroups[];
}

type FormFieldKeys =
  | 'nombre'
  | 'descripcion'
  | 'precio'
  | 'stock'
  | 'puntoReCompra';

const fields: {
  id: FormFieldKeys;
  label: string;
  type: string;
  step?: string;
  min?: string;
  readOnly?: boolean;
  disabled?: boolean;
}[] = [
  {
    id: 'nombre',
    label: 'Nombre',
    type: 'text',
    readOnly: true,
    disabled: true,
  },
  {
    id: 'descripcion',
    label: 'Descripcion',
    type: 'text',
    readOnly: true,
    disabled: true,
  },
  { id: 'precio', label: 'Precio', type: 'number' },
  { id: 'stock', label: 'Stock', type: 'number', min: '0' },
  { id: 'puntoReCompra', label: 'Punto de ReCompra', type: 'number', min: '0' },
];

const ProductForm = ({
  initialData,
  onSubmit,
  sucursalId,
  handleSelectChange,
  selectedGroup,
  groups,
}: ProductFormProps) => {
  const user = useAppSelector((state) => state.auth.signIn.user);
  const [formData, setFormData] = useState({
    sucursalId: sucursalId,
    nombre: initialData?.productoId.nombre || '',
    descripcion: initialData?.productoId.descripcion || '',
    precio: initialData?.precio?.$numberDecimal || 0,
    stock: initialData?.stock ?? 0,
    grupoId: selectedGroup?._id || '',
    monedaId: '671342d4664051db7c1f8792',
    puntoReCompra: initialData?.puntoReCompra || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData: ITablaBranch = {
      ...formData,
      grupoId: selectedGroup?._id || '',
      monedaId: '671342d4664051db7c1f8792',
      sucursalId: user?.sucursalId?._id ?? '',
      //@ts-ignore
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock.toString(), 10),
      nombre: initialData?.productoId.nombre || '',
      descripcion: initialData?.productoId.descripcion || '',
      puntoReCompra: parseInt(formData?.puntoReCompra.toString(), 10),
    };

    onSubmit(productData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="grid gap-4 py-4">
          {fields.map(({ id, label, type, step, min, readOnly, disabled }) => (
            <div key={id} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={id} className="text-right">
                {label}
              </Label>
              <Input
                id={id}
                name={id}
                type={type}
                value={formData[id]}
                onChange={handleInputChange}
                step={step}
                min={min}
                className="col-span-3"
                required
                readOnly={readOnly}
                disabled={disabled}
              />
            </div>
          ))}
          <div className="items-center gap-4 flex">
            <Label htmlFor="branch-select" className="text-right">
              Categorias
            </Label>
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent className="flex flex-col gap-2">
                {groups.map((branch) => (
                  <SelectItem key={branch._id} value={branch._id as string}>
                    {branch.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">
            {initialData ? 'Save Changes' : 'Add Product'}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};

export default ProductForm;
