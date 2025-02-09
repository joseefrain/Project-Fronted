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
import SalesInventorySystem from '@/ui/components/Sales/indexSale';
import { ViewEntities } from '../shared/components/ui/TabsListTable/entities';
import { Contacts } from '../ui/components/clients';
import { CreditPaymentSystem } from '../ui/components/Payments/CreditPaymentSystem';
import { Credits } from '../shared/components/ui/TabsListTable/credits';
import { Roles } from '../ui/components/Roles';
import { Users } from '../ui/components/Login/Users';
import { CashRegister } from '../ui/components/CashRegister/page';
import { PAGES_MODULES } from '../shared/helpers/roleHelper';
import { PurchaseSale } from '../ui/components/Sales/indexPurchaseSale';
import { ProductsCategories } from '../ui/components/Categories/ProductsCategories';
import LoginForm from '@/ui/components/Login/LoginForm';
import { ViewDashboard } from '../shared/components/ui/TabsListTable/dashboard';
import PageWorkHours from '../ui/components/WorkHours';
import { OutTime } from '../pages/OutTime';

export const Router = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AlreadyAuthenticated>
            <LoginForm />
          </AlreadyAuthenticated>
        }
      />
      <Route
        path="/"
        element={<RequireAuth module={PAGES_MODULES.DASHBOARD} />}
      >
        <Route
          path="/"
          element={
            <Layout>
              <ViewDashboard />
            </Layout>
          }
        />
      </Route>
      <Route
        path="/branches"
        element={<RequireAuth module={PAGES_MODULES.SUCURSALES} />}
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
        element={<RequireAuth module={PAGES_MODULES.PRODUCTOS} />}
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
        element={<RequireAuth module={PAGES_MODULES.PRODUCTOS} />}
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
        element={<RequireAuth module={PAGES_MODULES.TRASLADOS} />}
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
        element={<RequireAuth module={PAGES_MODULES.TRASLADOS} />}
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
        element={<RequireAuth module={PAGES_MODULES.USUARIOS} />}
      >
        <Route
          path="/register"
          element={
            <Layout>
              <Users />
            </Layout>
          }
        />
      </Route>
      <Route
        path="/contacts/:id/"
        element={<RequireAuth module={PAGES_MODULES.CONTACTOS} />}
      >
        <Route
          path="/contacts/:id/"
          element={
            <Layout>
              <Contacts />
            </Layout>
          }
        />
      </Route>
      <Route
        path="/categories"
        element={<RequireAuth module={PAGES_MODULES.CATEGORIAS} />}
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
        path="/groups/:id/products/:idbranch"
        element={<RequireAuth module={PAGES_MODULES.CATEGORIAS} />}
      >
        <Route
          path="/groups/:id/products/:idbranch"
          element={
            <Layout>
              <ProductsCategories />
            </Layout>
          }
        />
      </Route>
      <Route
        path="/transfer/pending/:id/itemdepedido"
        element={<RequireAuth module={PAGES_MODULES.TRASLADOS} />}
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
        element={<RequireAuth module={PAGES_MODULES.DESCUENTOS} />}
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
        element={<RequireAuth module={PAGES_MODULES.VENTAS} />}
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
        path="/Purchase"
        element={<RequireAuth module={PAGES_MODULES.COMPRAS} />}
      >
        <Route
          path="/Purchase"
          element={
            <Layout>
              <PurchaseSale />
            </Layout>
          }
        />
      </Route>
      <Route
        path="/Contacts"
        element={<RequireAuth module={PAGES_MODULES.CONTACTOS} />}
      >
        <Route
          path="/Contacts"
          element={
            <Layout>
              <ViewEntities />
            </Layout>
          }
        />
      </Route>
      <Route
        path="/credits"
        element={<RequireAuth module={PAGES_MODULES.CREDITOS} />}
      >
        <Route
          path="/credits"
          element={
            <Layout>
              <Credits />
            </Layout>
          }
        />
      </Route>
      <Route
        path="/credits/:id"
        element={<RequireAuth module={PAGES_MODULES.CREDITOS} />}
      >
        <Route
          path="/credits/:id"
          element={
            <Layout>
              <CreditPaymentSystem />
            </Layout>
          }
        />
      </Route>
      <Route
        path="/roles"
        element={<RequireAuth module={PAGES_MODULES.ROLES} />}
      >
        <Route
          path="/roles"
          element={
            <Layout>
              <Roles />
            </Layout>
          }
        />
      </Route>
      <Route
        path="/cashRegister"
        element={<RequireAuth module={PAGES_MODULES.CASHREGISTER} />}
      >
        <Route
          path="/cashRegister"
          element={
            <Layout>
              <CashRegister />
            </Layout>
          }
        />
      </Route>
      <Route
        path="/hours"
        element={<RequireAuth module={PAGES_MODULES.HOURS} />}
      >
        <Route
          path="/hours"
          element={
            <Layout>
              <PageWorkHours />
            </Layout>
          }
        />
      </Route>

      <Route path="/out-time">
        <Route path="/out-time" element={<OutTime />} />
      </Route>

      <Route path="/404" element={<Page404 />} />
      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  );
};
