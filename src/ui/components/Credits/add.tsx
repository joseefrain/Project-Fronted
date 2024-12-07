import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChangeEvent, useEffect, useState } from 'react';
import { addEntity } from '../../../app/slices/entities';
import { store } from '../../../app/store';
import {
  IEntities,
  IEntitiesContactInfo,
  IEntitiesGeneralInfo,
  IEntityType,
} from '../../../interfaces/entitiesInterfaces';

interface AddContactProps {
  initialData: IEntities | null;
  onClose: () => void;
}

export const AddContact = ({ initialData, onClose }: AddContactProps) => {
  const fields = [
    { label: 'Número de identificación *', name: 'identificationNumber' },
    { label: 'Departamento *', name: 'department' },
    { label: 'País *', name: 'country' },
    { label: 'Dirección *', name: 'address' },
    { label: 'Nombre completo *', name: 'name' },
    { label: 'Correo electrónico', name: 'email', type: 'email' },
    { label: 'Teléfono móvil', name: 'mobilePhone', type: 'tel' },
    { label: 'Teléfono fijo', name: 'telephone', type: 'tel' },
  ];

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
  const dataType = entityType === 'supplier' ? 'Proveedor' : 'Cliente';
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        identificationNumber:
          initialData.generalInformation.identificationNumber || '',
        department: initialData.generalInformation.department || '',
        country: initialData.generalInformation.country || '',
        address: initialData.generalInformation.address || '',
        name: initialData.generalInformation.name || '',
        email: initialData.contactInformation.email || '',
        mobilePhone: initialData.contactInformation.mobilePhone || '',
        telephone: initialData.contactInformation.telephone || '',
      });
    } else {
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
    }
  }, [initialData]);

  const handleAddingEntity = async () => {
    setLoading(true);

    try {
      if (initialData) {
        const entidadAEnviar: IEntities = {
          ...initialData,
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
          entities: dataType,
          type: entityType,
        };

        await store.dispatch(addEntity(entidadAEnviar)).unwrap();
      } else {
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
          entities: dataType,
          type: entityType,
        };

        //updateEntity(entidadAEnviar); remp
        await store.dispatch(addEntity(entidadAEnviar)).unwrap();
      }

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
      onClose();
    } catch (error) {
      console.error('Error al crear o actualizar la entidad:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Nuevo contacto</h2>
      </div>

      <form className="p-6 space-y-6">
        <div className="flex overflow-hidden border rounded-md">
          <Button
            className={`flex-1 rounded-none ${
              entityType === 'customer'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background text-black hover:text-white'
            }`}
            onClick={() => setEntityType('customer')}
            type="button"
          >
            Cliente
          </Button>
          <Button
            className={`flex-1 rounded-none ${
              entityType === 'supplier'
                ? 'bg-primary text-primary-foreground hover:bg-primary'
                : 'bg-background text-black hover:text-white'
            }`}
            onClick={() => setEntityType('supplier')}
            type="button"
          >
            Proveedor
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {fields.map((field) => (
            <div className="space-y-2" key={field.name}>
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                name={field.name as keyof typeof formData}
                type={field.type || 'text'}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleInputChange}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center w-full h-full pt-6">
          <Button
            onClick={handleAddingEntity}
            className="text-white bg-black"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear contacto'}
          </Button>
        </div>
      </form>
    </div>
  );
};
