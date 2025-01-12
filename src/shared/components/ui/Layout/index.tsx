import { ReactNode } from 'react';
import './styles.scss';
import { Header } from '../../../../ui/components/header';
import { Sidebar } from '../Sidebar/index';
import { useAppSelector } from '@/app/hooks';
import { Toaster } from '@/components/ui/toaster';
import {
  BadgeDollarSign,
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
  const roleUsers = useAppSelector((state) => state.auth.signIn.user?.role);
  const sidebarLinks = [
    {
      name: 'INICIO',
      path: '/',
      icon: <House />,
    },
    ...(roleUsers === 'root' || roleUsers === 'admin'
      ? [{ name: 'SUCURSALES', path: '/branches', icon: <Store /> }]
      : []),
    { name: 'TRANSACCIÓN', path: '/sales', icon: <ShoppingBag /> },
    { name: 'CRÉDITOS', path: '/credits', icon: <CreditCard /> },
    { name: 'PRODUCTOS', path: '/products', icon: <ShoppingCart /> },
    { name: 'CATEGORÍAS', path: '/categories', icon: <Group /> },
    { name: 'DESCUENTOS', path: '/DiscountManager', icon: <BadgeDollarSign /> },
    { name: 'TRASLADOS', path: '/orders', icon: <Repeat /> },
    ...(roleUsers === 'root' || roleUsers === 'admin'
      ? [{ name: 'USUARIOS', path: '/register', icon: <UserPlus /> }]
      : []),
    { name: 'CONTACTOS', path: '/contacts', icon: <SquareUser /> },
    { name: 'ROLES', path: '/roles', icon: <Waypoints /> },
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
