import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, Mail, Phone, MapPin, User, Calendar } from 'lucide-react';
import React, { useEffect } from 'react';
import { IEntities } from '../../../interfaces/entitiesInterfaces';
// import { useAppSelector } from '../../../app/hooks';
import { store } from '../../../app/store';
import { getEntities } from '../../../app/slices/entities';

const client: IEntities = {
  generalInformation: {
    identificationNumber: '123456789',
    department: 'Antioquia',
    country: 'Colombia',
    address: '123 Main Street',
    name: 'Juan Perez',
  },
  contactInformation: {
    email: 'client@example.com',
    mobilePhone: '3001234567',
    telephone: '6041234567',
  },
  commercialInformation: {
    paymentTerm: 'Immediate',
    seller: 'John Doe',
  },
  state: {
    amountReceivable: { $numberDecimal: 10000 },
    advancesReceipts: { $numberDecimal: 2000 },
    advancesDelivered: { $numberDecimal: 1500 },
    amountPayable: { $numberDecimal: 5000 },
  },
  entities: 'Client',
  type: 'customer',
};

export const Contacts = () => {
  //   const allEntities = useAppSelector((state) => state.entities.data);

  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getEntities()).unwrap();
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src="/placeholder-avatar.jpg"
                  alt="Client Avatar"
                />
                <AvatarFallback>
                  {client.generalInformation.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {client.generalInformation.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Client since 2023
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-sm">
              Client
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {client.state && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoCard
                  icon={Building2}
                  label="Amount Receivable"
                  value={`$${client.state.amountReceivable}`}
                />
                <InfoCard
                  icon={Building2}
                  label="Advances Received"
                  value={`$${client.state.advancesReceipts}`}
                />
                <InfoCard
                  icon={Building2}
                  label="Advances Delivered"
                  value={`$${client.state.advancesDelivered}`}
                />
                <InfoCard
                  icon={Building2}
                  label="Amount Payable"
                  value={`$${client.state.amountPayable}`}
                />
              </div>
            )}
            <Separator />
            <Section title="General Information">
              <div className="grid gap-4 md:grid-cols-2">
                <InfoItem
                  icon={User}
                  label="Identification Number"
                  value={client.generalInformation.identificationNumber}
                />
                <InfoItem
                  icon={MapPin}
                  label="Department"
                  value={client.generalInformation.department}
                />
                <InfoItem
                  icon={MapPin}
                  label="Country"
                  value={client.generalInformation.country}
                />
                <InfoItem
                  icon={MapPin}
                  label="Address"
                  value={client.generalInformation.address}
                />
              </div>
            </Section>

            <Separator />

            <Section title="Contact Information">
              <div className="grid gap-4 md:grid-cols-3">
                <InfoItem
                  icon={Mail}
                  label="Email"
                  value={client.contactInformation.email}
                />
                <InfoItem
                  icon={Phone}
                  label="Mobile Phone"
                  value={client.contactInformation.mobilePhone}
                />
                <InfoItem
                  icon={Phone}
                  label="Telephone"
                  value={client.contactInformation.telephone}
                />
              </div>
            </Section>

            <Separator />

            <Section title="Commercial Information">
              <div className="grid gap-4 md:grid-cols-2">
                <InfoItem
                  icon={Calendar}
                  label="Payment Term"
                  value={client.commercialInformation.paymentTerm}
                />
                <InfoItem
                  icon={User}
                  label="Seller"
                  value={client.commercialInformation.seller}
                />
              </div>
            </Section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center space-x-3">
      <Icon className="w-5 h-5 text-muted-foreground" />
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-6">
        <Icon className="w-8 h-8 mb-2 text-primary" />
        <p className="text-sm text-center text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
