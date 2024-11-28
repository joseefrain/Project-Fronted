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
import RegisterForm from '@/ui/components/Login/RegisterForm';
import { PagesCategories } from '@/pages/Categories';
import { OrdersReceived } from '@/ui/components/OrdersReceived';
import PendingProductsByTransfer from '@/ui/components/PendingTools/products';
import { ViewProucts } from '@/shared/components/ui/TabsListTable/products';
import DiscountManager from '@/ui/components/Discount';
import SalesInventorySystem from '@/ui/components/Sales';
import Dashboard from '@/ui/components/Dashboard';
import { MainContacts } from '../ui/components/clients/main';
export const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<AlreadyAuthenticated />} />
      <Route
        path="/"
        element={<RequireAuth rolesAllowed={['admin', 'user', 'root']} />}
      >
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
      </Route>
      <Route
        path="/branches"
        element={<RequireAuth rolesAllowed={['root', 'admin']} />}
      >
        <Route
          path="/branches"
          element={
            <Layout>
              <BranchDashboard />
            </Layout>
          }
        />
      </Route>
      <Route
        path="/products"
        element={<RequireAuth rolesAllowed={['root', 'user', 'admin']} />}
      >
        <Route
          path="/products"
          element={
            <Layout>
              <ViewProucts />
            </Layout>
          }
        />
      </Route>
      <Route
        path="/branches/:Id/products"
        element={<RequireAuth rolesAllowed={['root', 'user', 'admin']} />}
      >
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
        element={<RequireAuth rolesAllowed={['root', 'admin', 'user']} />}
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
      <Route
        path="/orders"
        element={<RequireAuth rolesAllowed={['root', 'admin', 'user']} />}
      >
        <Route
          path="/orders"
          element={
            <Layout>
              <HeaderTable />
            </Layout>
          }
        />
      </Route>
      <Route
        path="/register"
        element={<RequireAuth rolesAllowed={['root', 'admin']} />}
      >
        <Route
          path="/register"
          element={
            <Layout>
              <RegisterForm />
            </Layout>
          }
        />
      </Route>
      {/* <Route
        path="/groups/:id/products"
        element={<RequireAuth rolesAllowed={['root', 'user', 'admin']} />}
      >
        <Route
          path="/groups/:id/products"
          element={
            <Layout>
              <ProductsCategories />
            </Layout>
          }
        />
      </Route> */}
      <Route
        path="/categories"
        element={<RequireAuth rolesAllowed={['root', 'user', 'admin']} />}
      >
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
        element={<RequireAuth rolesAllowed={['root', 'user', 'admin']} />}
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
      <Route
        path="/DiscountManager"
        element={<RequireAuth rolesAllowed={['root', 'user', 'admin']} />}
      >
        <Route
          path="/DiscountManager"
          element={
            <Layout>
              <DiscountManager />
            </Layout>
          }
        />
      </Route>

      <Route
        path="/sales"
        element={<RequireAuth rolesAllowed={['root', 'user', 'admin']} />}
      >
        <Route
          path="/sales"
          element={
            <Layout>
              <SalesInventorySystem />
            </Layout>
          }
        />
      </Route>
      <Route
        path="/Contacts"
        element={<RequireAuth rolesAllowed={['admin', 'user', 'root']} />}
      >
        <Route
          path="/Contacts"
          element={
            <Layout>
              <MainContacts />
            </Layout>
          }
        />
      </Route>
      <Route path="/404" element={<Page404 />} />
      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  );
};
