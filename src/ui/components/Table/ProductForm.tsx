import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { IProductoGroups, ITablaBranch } from '@/interfaces/branchInterfaces';
import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppSelector } from '@/app/hooks';

interface ProductFormProps {
  initialData?: ITablaBranch;
  onSubmit: (data: ITablaBranch) => void;
  sucursalId?: string;
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

const ProductForm = ({
  initialData,
  onSubmit,
  sucursalId,
  handleSelectChange,
  selectedGroup,
  groups,
}: ProductFormProps) => {
  const branches = useAppSelector((state) => state.branches.data);
  const [selectedBranch, setSelectedBranch] = useState<string | undefined>(
    sucursalId
  );

  const [formData, setFormData] = useState({
    _id: initialData?.id || '',
    sucursalId: sucursalId,
    nombre: initialData?.nombre || '',
    descripcion: initialData?.descripcion || '',
    precio: initialData?.precio?.$numberDecimal || '',
    stock: initialData?.stock ?? '',
    grupoId: selectedGroup?._id || '',
    monedaId: '671342d4664051db7c1f8792',
    puntoReCompra: initialData?.puntoReCompra || '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        _id: initialData.id || '',
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        precio: initialData.precio?.$numberDecimal || '',
        stock: initialData.stock ?? '',
        grupoId: selectedGroup?._id || '',
        sucursalId: initialData.sucursalId || '',
        monedaId: '671342d4664051db7c1f8792',
        puntoReCompra: initialData.puntoReCompra || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData: ITablaBranch = {
      ...initialData,
      grupoId: selectedGroup?._id || '',
      monedaId: '671342d4664051db7c1f8792',
      sucursalId: selectedBranch ?? '',
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      //@ts-ignore
      precio: parseFloat(formData.precio?.toString() ?? '0'),
      stock: parseInt(formData.stock.toString()),
      puntoReCompra: parseInt(formData.puntoReCompra.toString()),
    };

    onSubmit(productData);
  };

  const fields: {
    id: FormFieldKeys;
    label: string;
    type: string;
    step?: string;
    min?: string;
  }[] = [
    { id: 'nombre', label: 'Nombre', type: 'text' },
    { id: 'descripcion', label: 'Descripcion', type: 'text' },
    { id: 'precio', label: 'Precio', type: 'number' },
    { id: 'stock', label: 'Stock', type: 'number', min: '0' },
    { id: 'puntoReCompra', label: 'Punto de compra', type: 'number' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        {fields.map(({ id, label, type, step, min }) => (
          <div key={id} className="grid items-center grid-cols-4 gap-4">
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
            />
          </div>
        ))}
        {!sucursalId && (
          <div className="flex items-center justify-end gap-4">
            <Label htmlFor="branch-select" className="text-right">
              Sucursal
            </Label>
            <Select
              value={selectedBranch}
              onValueChange={(value) => setSelectedBranch(value)}
            >
              <SelectTrigger className="w-[74.3%]">
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent className="flex flex-col gap-2">
                {branches.map((branch) => (
                  <SelectItem key={branch._id} value={branch._id as string}>
                    {branch.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex items-center justify-end gap-4">
          <Label htmlFor="branch-select" className="text-right">
            Categorias
          </Label>
          <Select disabled={!selectedBranch} onValueChange={handleSelectChange}>
            <SelectTrigger className="w-[74.3%]">
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
  );
};

export default ProductForm;
