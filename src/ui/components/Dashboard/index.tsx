import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CreditCardIcon,
  PackageIcon,
  ShoppingBagIcon,
  UsersIcon,
} from 'lucide-react';
import { ReactNode } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BranchDrawer } from '../ModalBranchs';

export default function Dashboard() {
  const salesData = [
    { name: 'Sept 10', total: 65 },
    { name: 'Sept 11', total: 59 },
    { name: 'Sept 12', total: 80 },
    { name: 'Sept 13', total: 81 },
    { name: 'Sept 14', total: 56 },
    { name: 'Sept 15', total: 55 },
    { name: 'Sept 16', total: 40 },
  ];

  const marketingData = [
    { name: 'Adquisición', value: 300 },
    { name: 'Compra', value: 50 },
    { name: 'Retención', value: 100 },
  ];

  const COLORS = ['#8b5cf6', '#3b82f6', '#f59e0b'];

  return (
    <div className="">
      <div className="mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-9 font-onest">
          Dashboard
        </h1>
        <BranchDrawer />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Ventas"
            value="$4,000,000.00"
            subValue="450"
            subLabel="Volumen"
            change={20.0}
            icon={<CreditCardIcon className="w-6 h-6 text-blue-500" />}
          />
          <StatCard
            title="Clientes"
            value="1,250"
            subValue="1,180"
            subLabel="Activos"
            change={15.8}
            icon={<UsersIcon className="w-6 h-6 text-green-500" />}
          />
          <StatCard
            title="Pedidos"
            value="450"
            subValue="5"
            subLabel="Pendientes"
            change={-4.9}
            icon={<ShoppingBagIcon className="w-6 h-6 text-purple-500" />}
          />
          <StatCard
            title="Productos"
            value="45"
            subValue="32"
            subLabel="Activos"
            change={24}
            icon={<PackageIcon className="w-6 h-6 text-yellow-500" />}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="text-xl font-semibold font-onest">
                Resumen de Ventas
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80 font-onest">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold font-onest">
                Marketing
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center font-onest h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={marketingData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {marketingData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  subValue: string;
  subLabel: string;
  change: number;
  icon: ReactNode;
}

function StatCard({
  title,
  value,
  subValue,
  subLabel,
  change,
  icon,
}: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium font-onest">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-onest">{value}</div>
        <div className="flex items-center mt-2 text-xs text-muted-foreground font-onest">
          <span className="font-onest">
            {subValue} {subLabel}
          </span>
          <span
            className={`font-onest ml-2 flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {change >= 0 ? (
              <ArrowUpIcon className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 mr-1" />
            )}
            {Math.abs(change)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
