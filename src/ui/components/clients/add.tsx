'use client';

import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  IClientContactInfo,
  IClientGeneralInfo,
} from '../../../interfaces/clientsInterfaces';

export interface IAddClient {
  generalInformation: IClientGeneralInfo;
  contactInformation: IClientContactInfo;
}

export default function FormularioContactoDinamico() {
  const [tipoContacto, setTipoContacto] = useState('cliente');
  const [formData, setFormData] = useState<
    IClientGeneralInfo & IClientContactInfo
  >({
    identificationNumber: '',
    department: '',
    country: '',
    address: '',
    Name: '',
    email: '',
    mobilePhone: '',
    telephone: '',
  });

  // eslint-disable-next-line no-undef
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //   const handleSelectChange = (name: string) => (value: string) => {
  //     setFormData((prev) => ({ ...prev, [name]: value }));
  //   };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Nuevo contacto</h2>
        <Button variant="ghost" size="icon" aria-label="Cerrar">
          <X className="h-6 w-6" />
        </Button>
      </div>

      <form className="p-6 space-y-6">
        {/* Tipo de contacto */}
        <div className="flex rounded-md overflow-hidden border">
          <Button
            className={`flex-1 rounded-none ${tipoContacto === 'cliente' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
            onClick={() => setTipoContacto('cliente')}
            type="button"
          >
            Cliente
          </Button>
          <Button
            className={`flex-1 rounded-none ${tipoContacto === 'proveedor' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
            onClick={() => setTipoContacto('proveedor')}
            type="button"
          >
            Proveedor
          </Button>
        </div>

        {/* Form fields */}
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
          <Label htmlFor="name">nombre completo *</Label>
          <Input
            id="name"
            name="name"
            value={formData.Name}
            onChange={handleInputChange}
          />
        </div>

        {/* Contact Info */}
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
          <Button variant="outline" className="flex items-center" type="button">
            Ir a formulario avanzado
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white">
            Crear contacto
          </Button>
        </div>
      </form>
    </div>
  );
}
