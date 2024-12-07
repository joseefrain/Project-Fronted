import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, Mail, Phone, MapPin, User, Calendar } from 'lucide-react';
import React, { useEffect } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { store } from '../../../app/store';
import { getEntities } from '../../../app/slices/entities';

export const Contacts = () => {
  const allEntities = useAppSelector((state) => state.entities.selectedEntity);

  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getEntities()).unwrap();
    };
    fetchData();
  }, []);

  if (!allEntities) {
    return <p className="text-center">Loading...</p>;
  }

  const client = allEntities;

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
                <AvatarFallback className="font-bold font-onest text-[1.5rem]">
                  {client.generalInformation.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {client.generalInformation.name}
                </CardTitle>
              </div>
            </div>
            <Badge variant="outline" className="text-sm">
              {client.type === 'customer' ? 'Client' : 'Proveedor'}
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
                  value={`$${Math.floor(Number(client.state.amountReceivable?.$numberDecimal ?? 0))}`}
                />
                <InfoCard
                  icon={Building2}
                  label="Advances Received"
                  value={`$${Math.floor(Number(client.state.advancesReceipts?.$numberDecimal ?? 0))}`}
                />
                <InfoCard
                  icon={Building2}
                  label="Advances Delivered"
                  value={`$${Math.floor(Number(client.state.advancesDelivered?.$numberDecimal ?? 0))}`}
                />
                <InfoCard
                  icon={Building2}
                  label="Amount Payable"
                  value={`$${Math.floor(Number(client.state.amountPayable?.$numberDecimal ?? 0))}`}
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
