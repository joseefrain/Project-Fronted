import { useAppSelector } from '@/app/hooks';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IProductoGroups, ITablaBranch } from '@/interfaces/branchInterfaces';
import React, { useEffect, useState } from 'react';
import './styles.scss';
import { BarcodeScanner } from '../../../shared/components/ui/BarScanner';

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
  | 'puntoReCompra'
  | 'costoUnitario';

const ProductForm = ({
  initialData,
  onSubmit,
  sucursalId,
  handleSelectChange,
  selectedGroup,
  groups,
}: ProductFormProps) => {
  const DEFAULT_MONEDA_ID = '6788969390f63a009f1bea40';
  const [loading, setLoading] = useState(false);
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
    monedaId: DEFAULT_MONEDA_ID,
    puntoReCompra: initialData?.puntoReCompra || '',
    barCode: initialData?.barCode || '',
    costoUnitario: initialData?.costoUnitario || 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        _id: initialData.id || '',
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        precio: initialData.precio?.$numberDecimal || '',
        stock: initialData.stock ?? '',
        sucursalId: initialData.sucursalId || '',
        puntoReCompra: initialData.puntoReCompra || '',
        barCode: initialData?.barCode || '',
        costoUnitario: initialData?.costoUnitario || 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === 'precio' || name === 'puntoReCompra' || name === 'stock'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const productData: ITablaBranch = {
      ...initialData,
      grupoId: selectedGroup?._id || '',
      monedaId: DEFAULT_MONEDA_ID,
      sucursalId: selectedBranch ?? '',
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      //@ts-ignore
      precio: parseFloat(formData.precio?.toString() ?? '0'),
      stock: parseInt(formData.stock.toString()),
      puntoReCompra: parseInt(formData.puntoReCompra.toString()),
      barCode: formData?.barCode || '',
      //@ts-ignore
      costoUnitario: parseFloat(formData?.costoUnitario?.toString() ?? '0'),
    };

    onSubmit(productData);
  };

  const fields: {
    id: FormFieldKeys;
    label: string;
    type: string;
    step?: string;
    min?: string;
    readOnly?: boolean;
  }[] = [
    {
      id: 'nombre',
      label: 'Nombre',
      type: 'text',
      readOnly: !!initialData,
    },
    {
      id: 'descripcion',
      label: 'Descripcion',
      type: 'text',
      readOnly: !!initialData,
    },
    { id: 'precio', label: 'Precio', type: 'number' },
    { id: 'stock', label: 'Stock', type: 'number', min: '0' },
    { id: 'puntoReCompra', label: 'Minimo Stock', type: 'number' },
    { id: 'costoUnitario', label: 'Costo unitario', type: 'number' },
  ];

  const handleBarcodeScanned = (barcode: string) => {
    setFormData((prevData) => ({
      ...prevData,
      barCode: barcode,
    }));
    console.log(barcode);
  };

  return (
    <>
      {!initialData && (
        <BarcodeScanner onBarcodeScanned={handleBarcodeScanned} />
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          {fields.map(({ id, label, type, step, min, readOnly }) => (
            <div key={id} className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor={id} className="text-right">
                {label}
              </Label>
              <Input
                id={id}
                name={id}
                type={type}
                value={formData[id] as string | number}
                onChange={handleInputChange}
                step={step}
                min={min}
                className={`col-span-3 ${
                  initialData && (id === 'nombre' || id === 'descripcion')
                    ? 'disabled'
                    : ''
                }`}
                required
                readOnly={readOnly}
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
          {!initialData && (
            <div className="flex items-center justify-end gap-4">
              <Label htmlFor="branch-select" className="text-right">
                Categorias
              </Label>
              <Select
                disabled={!selectedBranch}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger className="w-[74.3%]">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent className="flex flex-col gap-2">
                  {groups.map((branch) => (
                    <SelectItem
                      key={branch._id}
                      value={branch._id as string}
                      className="font-onest"
                    >
                      {branch.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" disabled={loading || !selectedGroup}>
            {initialData ? 'Guardar Cambios' : 'Agregar Producto'}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};

export default ProductForm;
