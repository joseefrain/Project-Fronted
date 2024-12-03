import { ChangeEvent, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store } from '../../../app/store';
import { addEntity, getEntities } from '../../../app/slices/entities';
import {
  IEntities,
  IEntitiesContactInfo,
  IEntitiesGeneralInfo,
  IEntityType,
} from '../../../interfaces/entitiesInterfaces';
import { useAppSelector } from '../../../app/hooks';

export const FormularioContactoDinamico = () => {
  const [formData, setFormData] = useState<
    IEntitiesContactInfo & IEntitiesGeneralInfo
  >({
    identificationNumber: '',
    department: '',
    country: '',
    address: '',
    name: '',
    email: '',
    mobilePhone: '',
    telephone: '',
  });

  const [entityType, setEntityType] = useState<IEntityType>('customer');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddingEntity = async () => {
    setLoading(true);

    try {
      const entidadAEnviar: IEntities = {
        generalInformation: {
          identificationNumber: formData.identificationNumber,
          department: formData.department,
          country: formData.country,
          address: formData.address,
          name: formData.name,
        },
        contactInformation: {
          email: formData.email,
          mobilePhone: formData.mobilePhone,
          telephone: formData.telephone,
        },
        commercialInformation: {
          paymentTerm: '',
          seller: '',
        },
        state: undefined,
        Products: [],
        entities: 'cliente',
        type: entityType,
      };

      await store.dispatch(addEntity(entidadAEnviar)).unwrap();

      setFormData({
        identificationNumber: '',
        department: '',
        country: '',
        address: '',
        name: '',
        email: '',
        mobilePhone: '',
        telephone: '',
      });
    } catch (error) {
      console.error('Error al crear la entidad:', error);
    } finally {
      setLoading(false);
    }
  };

  const allEntities = useAppSelector((state) => state.entities.data);
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getEntities()).unwrap();
    };
    fetchData();
  }, []);
  console.log(allEntities, 'allEntities');

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Nuevo contacto</h2>
        <Button variant="ghost" size="icon" aria-label="Cerrar">
          <X className="h-6 w-6" />
        </Button>
      </div>

      <form className="p-6 space-y-6">
        <div className="flex rounded-md overflow-hidden border">
          <Button
            className={`flex-1 rounded-none ${
              entityType === 'customer'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background'
            }`}
            onClick={() => setEntityType('customer')}
            type="button"
          >
            Cliente
          </Button>
          <Button
            className={`flex-1 rounded-none ${
              entityType === 'supplier'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background'
            }`}
            onClick={() => setEntityType('supplier')}
            type="button"
          >
            Proveedor
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="identificationNumber">
              Número de identificación *
            </Label>
            <Input
              id="identificationNumber"
              name="identificationNumber"
              value={formData.identificationNumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Departamento *</Label>
            <Input
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">País *</Label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Dirección *</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="Name">Nombre completo *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Ejemplo@email.com"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobilePhone">Teléfono móvil</Label>
            <Input
              id="mobilePhone"
              name="mobilePhone"
              type="tel"
              value={formData.mobilePhone}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="telephone">Teléfono fijo</Label>
          <Input
            id="telephone"
            name="telephone"
            type="tel"
            value={formData.telephone}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            onClick={handleAddingEntity}
            className="bg-teal-600 hover:bg-teal-700 text-white"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear contacto'}
          </Button>
        </div>
      </form>
    </div>
  );
};
