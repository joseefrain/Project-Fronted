import { ReactNode } from 'react';
import './styles.scss';
import { Header } from '../../../../ui/components/header';
import { Sidebar } from '../Sidebar/index';
import { Toaster } from '@/components/ui/toaster';
import {
  BadgeDollarSign,
  Box,
  CreditCard,
  Group,
  House,
  Repeat,
  ShoppingBag,
  ShoppingCart,
  SquareUser,
  Store,
  UserPlus,
  Waypoints,
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const sidebarLinks = [
    {
      name: 'INICIO',
      path: '/',
      icon: <House />,
    },
    { name: 'SUCURSALES', path: '/branches', icon: <Store /> },
    { name: 'TRANSACCIÓN', path: '/sales', icon: <ShoppingBag /> },
    { name: 'CRÉDITOS', path: '/credits', icon: <CreditCard /> },
    { name: 'PRODUCTOS', path: '/products', icon: <ShoppingCart /> },
    { name: 'CATEGORÍAS', path: '/categories', icon: <Group /> },
    { name: 'DESCUENTOS', path: '/DiscountManager', icon: <BadgeDollarSign /> },
    { name: 'TRASLADOS', path: '/orders', icon: <Repeat /> },
    { name: 'USUARIOS', path: '/register', icon: <UserPlus /> },
    { name: 'CONTACTOS', path: '/contacts', icon: <SquareUser /> },
    { name: 'ROLES', path: '/roles', icon: <Waypoints /> },
    { name: 'CAJAS', path: '/cashRegister', icon: <Box /> },
  ];

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar className="hidden capitalize md:block" links={sidebarLinks} />
        <div className="container-Layout">{children}</div>
        <Toaster />
      </div>
    </div>
  );
};
