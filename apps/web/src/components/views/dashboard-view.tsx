import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { mockDashboardStats, mockOrders } from "../../lib/mock-data";
import { StatusBadge } from "../status-badge";
import { PageHeader } from "../page-header";

export function DashboardView() {
  const stats = mockDashboardStats;
  const recentOrders = mockOrders.slice(0, 5);

  const statCards = [
    {
      title: "Ingresos Totales",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: stats.revenueChange,
      icon: DollarSign,
    },
    {
      title: "Órdenes",
      value: stats.totalOrders.toLocaleString(),
      change: stats.ordersChange,
      icon: ShoppingCart,
    },
    {
      title: "Usuarios",
      value: stats.totalUsers.toLocaleString(),
      change: stats.usersChange,
      icon: Users,
    },
    {
      title: "Valor Promedio de Orden",
      value: `$${stats.averageOrderValue.toFixed(2)}`,
      change: stats.aovChange,
      icon: TrendingUp,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Panel"
        description="Vista general del rendimiento de tu tienda"
        breadcrumbs={[{ label: 'Panel' }]}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;
          
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl">{stat.value}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {isPositive ? (
                      <ArrowUpRight className="h-3 w-3 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-600" />
                    )}
                    <span className={isPositive ? "text-green-600" : "text-red-600"}>
                      {Math.abs(stat.change)}%
                    </span>
                    <span className="text-muted-foreground">vs mes anterior</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle>Órdenes Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p>{order.orderNumber}</p>
                      <StatusBadge status={order.status} type="order" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.buyer?.name || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p>${order.total.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle>Distribución de Estados de Orden</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { status: 'entregado', count: 543, color: 'bg-green-500' },
                { status: 'enviado', count: 198, color: 'bg-blue-500' },
                { status: 'procesando', count: 312, color: 'bg-amber-500' },
                { status: 'pendiente', count: 156, color: 'bg-gray-500' },
                { status: 'cancelado', count: 38, color: 'bg-red-500' },
              ].map((item) => (
                <div key={item.status} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize">{item.status}</span>
                    <span className="text-muted-foreground">{item.count}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color}`}
                      style={{ width: `${(item.count / 1247) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}