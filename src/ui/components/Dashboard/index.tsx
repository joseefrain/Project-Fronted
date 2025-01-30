import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { store } from '../../../app/store';
import { useAppSelector } from '@/app/hooks';
import { getchartsProducts } from '../../../app/slices/dashboardSlice';

export default function Dashboard() {
  const userIDBranch = useAppSelector(
    (state) => state.auth.signIn.user?.sucursalId?._id
  );

  const dataDashboard = useAppSelector((state) => state.dashboard.data);
  console.log(dataDashboard, 'idScu');

  useEffect(() => {
    store.dispatch(getchartsProducts(userIDBranch as string)).unwrap();
  }, [userIDBranch]);

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 font-onest">
      <motion.h1
        className="text-4xl font-bold mb-8 text-gray-800 dark:text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Dashboard de Ventas Interactivo
      </motion.h1>

      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Producto Más Vendido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dataDashboard?.productoMasVendido.producto}
              </div>
              <p className="text-xs text-muted-foreground">
                Cantidad: {dataDashboard?.productoMasVendido.cantidad || 0} |
                Total: {dataDashboard?.productoMasVendido.total?.$numberDecimal}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Mayor Venta Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dataDashboard?.productoConMasTotalVenidioDelDia?.producto}
              </div>
              <p className="text-xs text-muted-foreground">
                Total:{' '}
                {dataDashboard?.productoConMasTotalVenidioDelDia?.total
                  ?.$numberDecimal || 0}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Mayor Ganancia Neta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dataDashboard?.productoConMasGananciaNetaDelDia.producto}
              </div>
              <p className="text-xs text-muted-foreground">
                Ganancia:{' '}
                {
                  dataDashboard?.productoConMasGananciaNetaDelDia.gananciaNeta
                    .$numberDecimal
                }
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Detalles de Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Ventas Totales</TableHead>
                  <TableHead>Ganancia Neta</TableHead>
                  <TableHead>Costo Unitario</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataDashboard?.productos?.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {product.nombre}
                    </TableCell>
                    <TableCell>{product.cantidad}</TableCell>
                    <TableCell>{product.total.$numberDecimal}</TableCell>
                    <TableCell>{product.gananciaNeta.$numberDecimal}</TableCell>
                    <TableCell>
                      {product.costoUnitario.$numberDecimal}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
