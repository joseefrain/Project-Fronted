import { Navigate, Route, Routes } from 'react-router-dom';
import { Page404 } from '../pages/404';
import { Layout } from '../shared/components/ui/Layout';
import { HeaderTable } from '../shared/components/ui/TabsListTable/orders';
import BranchDashboard from '../ui/components/Branches';
import { DataTableDemo } from '../ui/components/Table';
import {
  AlreadyAuthenticated,
  RequireAuth,
} from '../shared/helpers/login.Helper';
import { PagesCategories } from '@/pages/Categories';
import { OrdersReceived } from '@/ui/components/OrdersReceived';
import PendingProductsByTransfer from '@/ui/components/PendingTools/products';
import { ViewProucts } from '@/shared/components/ui/TabsListTable/products';
import DiscountManager from '@/ui/components/Discount';
import SalesInventorySystem from '@/ui/components/Sales';
import Dashboard from '@/ui/components/Dashboard';
import { ViewEntities } from '../shared/components/ui/TabsListTable/entities';
import { Contacts } from '../ui/components/clients';
import { CreditPaymentSystem } from '../ui/components/Payments/CreditPaymentSystem';
import { Credits } from '../shared/components/ui/TabsListTable/credits';
import { Roles } from '../ui/components/Roles';
import { Users } from '../ui/components/Login/Users';
import { CashRegister } from '../ui/components/CashRegister/page';

export const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<AlreadyAuthenticated />} />
      <Route path="/" element={<RequireAuth />}>
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
      </Route>
      <Route path="/branches" element={<RequireAuth />}>
        <Route
          path="/branches"
          element={
            <Layout>
              <BranchDashboard />
            </Layout>
          }
        />
      </Route>
      <Route path="/products" element={<RequireAuth />}>
        <Route
          path="/products"
          element={
            <Layout>
              <ViewProucts />
            </Layout>
          }
        />
      </Route>
      <Route path="/branches/:Id/products" element={<RequireAuth />}>
        <Route
          path="/branches/:Id/products"
          element={
            <Layout>
              <DataTableDemo />
            </Layout>
          }
        />
      </Route>
      <Route
        path="/transfer/recibido/:Id/itemdepedido"
        element={<RequireAuth />}
      >
        <Route
          path="/transfer/recibido/:Id/itemdepedido"
          element={
            <Layout>
              <OrdersReceived />
            </Layout>
          }
        />
      </Route>
      <Route path="/orders" element={<RequireAuth />}>
        <Route
          path="/orders"
          element={
            <Layout>
              <HeaderTable />
            </Layout>
          }
        />
      </Route>
      <Route path="/register" element={<RequireAuth />}>
        <Route
          path="/register"
          element={
            <Layout>
              <Users />
            </Layout>
          }
        />
      </Route>
      <Route path="/contacts/:id/" element={<RequireAuth />}>
        <Route
          path="/contacts/:id/"
          element={
            <Layout>
              <Contacts />
            </Layout>
          }
        />
      </Route>
      <Route path="/categories" element={<RequireAuth />}>
        <Route
          path="/categories"
          element={
            <Layout>
              <PagesCategories />
            </Layout>
          }
        />
      </Route>

      <Route
        path="/transfer/pending/:id/itemdepedido"
        element={<RequireAuth />}
      >
        <Route
          path="/transfer/pending/:id/itemdepedido"
          element={
            <Layout>
              <PendingProductsByTransfer />
            </Layout>
          }
        />
      </Route>
      <Route path="/DiscountManager" element={<RequireAuth />}>
        <Route
          path="/DiscountManager"
          element={
            <Layout>
              <DiscountManager />
            </Layout>
          }
        />
      </Route>

      <Route path="/sales" element={<RequireAuth />}>
        <Route
          path="/sales"
          element={
            <Layout>
              <SalesInventorySystem />
            </Layout>
          }
        />
      </Route>
      <Route path="/Contacts" element={<RequireAuth />}>
        <Route
          path="/Contacts"
          element={
            <Layout>
              <ViewEntities />
            </Layout>
          }
        />
      </Route>
      <Route path="/credits" element={<RequireAuth />}>
        <Route
          path="/credits"
          element={
            <Layout>
              <Credits />
            </Layout>
          }
        />
      </Route>
      <Route path="/credits/:id" element={<RequireAuth />}>
        <Route
          path="/credits/:id"
          element={
            <Layout>
              <CreditPaymentSystem />
            </Layout>
          }
        />
      </Route>

      <Route path="/roles" element={<RequireAuth />}>
        <Route
          path="/roles"
          element={
            <Layout>
              <Roles />
            </Layout>
          }
        />
      </Route>
      <Route path="/cashRegister" element={<RequireAuth />}>
        <Route
          path="/cashRegister"
          element={
            <Layout>
              <CashRegister />
            </Layout>
          }
        />
      </Route>

      <Route path="/404" element={<Page404 />} />
      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  );
};
