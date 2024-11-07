import { ReactNode } from 'react';
import './styles.scss';
import { Header } from '../../../../ui/components/header';
import { Sidebar } from '../Sidebar/index';
import { useAppSelector } from '@/app/hooks';
import { Toaster } from '@/components/ui/toaster';
import {
  BadgeDollarSign,
  Group,
  House,
  Repeat,
  ShoppingBag,
  ShoppingCart,
  Store,
  UserPlus,
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
    { name: 'VENTAS', path: '/sales', icon: <ShoppingBag /> },
    { name: 'PRODUCTOS', path: '/products', icon: <ShoppingCart /> },
    { name: 'CATEGORÍAS', path: '/categories', icon: <Group /> },
    { name: 'DESCUENTOS', path: '/DiscountManager', icon: <BadgeDollarSign /> },
    { name: 'TRASLADOS', path: '/orders', icon: <Repeat /> },
    ...(roleUsers === 'root' || roleUsers === 'admin'
      ? [{ name: 'USUARIOS', path: '/register', icon: <UserPlus /> }]
      : []),
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
