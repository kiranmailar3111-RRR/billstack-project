import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  IndianRupee,
  Package,
  AlertTriangle,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";

import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const productsRes = await api.get("/products");
      const customersRes = await api.get("/customers");
      const invoicesRes = await api.get("/invoices");

      setProducts(productsRes.data.data);
      setCustomers(customersRes.data.data);
      setInvoices(invoicesRes.data.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch dashboard data");
    }
  };

  const totalRevenue = invoices
    .filter((invoice) => invoice.payment_status === "Paid")
    .reduce((sum, invoice) => sum + Number(invoice.grand_total), 0);

  const paidInvoices = invoices.filter(
    (invoice) => invoice.payment_status === "Paid"
  ).length;

  const pendingInvoices = invoices.filter(
    (invoice) => invoice.payment_status === "Pending"
  ).length;

  const partialInvoices = invoices.filter(
    (invoice) => invoice.payment_status === "Partial"
  ).length;

  const lowStockProducts = products.filter(
    (product) => Number(product.stock) < Number(product.min_stock_alert || 10)
  );

  const recentInvoices = invoices.slice(0, 5);

  const paidAmount = invoices
    .filter((invoice) => invoice.payment_status === "Paid")
    .reduce((sum, invoice) => sum + Number(invoice.grand_total), 0);

  const pendingAmount = invoices
    .filter((invoice) => invoice.payment_status === "Pending")
    .reduce((sum, invoice) => sum + Number(invoice.grand_total), 0);

  const partialAmount = invoices
    .filter((invoice) => invoice.payment_status === "Partial")
    .reduce((sum, invoice) => sum + Number(invoice.grand_total), 0);

  const statusChartData = [
    { name: "Paid", value: paidAmount },
    { name: "Pending", value: pendingAmount },
    { name: "Partial", value: partialAmount },
  ];

  const monthlyMap = {};

  invoices.forEach((invoice) => {
    if (invoice.payment_status === "Paid") {
      const month = new Date(invoice.invoice_date).toLocaleString("default", {
        month: "short",
      });

      if (!monthlyMap[month]) {
        monthlyMap[month] = 0;
      }

      monthlyMap[month] += Number(invoice.grand_total);
    }
  });

  const monthlyRevenueData = Object.keys(monthlyMap).map((month) => ({
    month,
    revenue: monthlyMap[month],
  }));

  const chartData =
    monthlyRevenueData.length > 0
      ? monthlyRevenueData
      : [
          { month: "Jan", revenue: 0 },
          { month: "Feb", revenue: 0 },
          { month: "Mar", revenue: 0 },
          { month: "Apr", revenue: 0 },
        ];

  const pieColors = ["#3b82f6", "#10b981", "#f59e0b"];

  const dashboardCards = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toFixed(2)}`,
      icon: IndianRupee,
      color: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      title: "Total Invoices",
      value: invoices.length,
      icon: FileText,
      color: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Paid Invoices",
      value: paidInvoices,
      icon: CheckCircle2,
      color: "bg-emerald-100",
      textColor: "text-emerald-600",
    },
    {
      title: "Pending Invoices",
      value: pendingInvoices,
      icon: Clock,
      color: "bg-yellow-100",
      textColor: "text-yellow-600",
    },
    {
      title: "Products",
      value: products.length,
      icon: Package,
      color: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      title: "Customers",
      value: customers.length,
      icon: Users,
      color: "bg-orange-100",
      textColor: "text-orange-600",
    },
    {
      title: "Low Stock",
      value: lowStockProducts.length,
      icon: AlertTriangle,
      color: "bg-red-100",
      textColor: "text-red-600",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>

          <p className="text-slate-500 mt-2">
            Live overview of revenue, invoices, stock and customers.
          </p>
        </div>

        <div className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-4 rounded-[24px] shadow-lg shadow-blue-200">
          <TrendingUp size={22} />
          <div>
            <p className="text-xs text-blue-100">Live Revenue</p>
            <p className="font-bold">₹{totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {dashboardCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm">{card.title}</p>
                  <h2 className="text-2xl font-bold text-slate-900 mt-3">
                    {card.value}
                  </h2>
                </div>

                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.color}`}
                >
                  <Icon className={card.textColor} size={28} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-white rounded-[28px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Revenue Analytics
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Monthly paid invoice revenue overview
              </p>
            </div>

            <div className="w-fit px-4 py-2 rounded-2xl bg-blue-50 text-blue-600 text-sm font-bold">
              Live Data
            </div>
          </div>

          <div className="h-[300px] md:h-[340px] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />

                <XAxis
                  dataKey="month"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "18px",
                    border: "none",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">
              Invoice Status
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Paid, pending and partial overview
            </p>
          </div>

          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={5}
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={pieColors[index % pieColors.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      borderRadius: "18px",
                      border: "none",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full px-6 md:px-8 space-y-3 mt-2">
              {statusChartData.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: pieColors[index % pieColors.length],
                      }}
                    />

                    <span className="text-sm font-medium text-slate-700">
                      {item.name}
                    </span>
                  </div>

                  <span className="text-sm font-bold text-slate-900">
                    ₹{Number(item.value).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lower Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Invoices */}
        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-5">
            Recent Invoices
          </h2>

          <div className="space-y-4">
            {recentInvoices.length > 0 ? (
              recentInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between border-b border-slate-100 pb-3"
                >
                  <div>
                    <h3 className="font-semibold text-slate-700">
                      {invoice.invoice_number}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {invoice.customer?.name || "Customer"}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-green-600 font-bold">
                      ₹{Number(invoice.grand_total).toFixed(2)}
                    </span>

                    <p
                      className={`text-xs mt-1 ${
                        invoice.payment_status === "Paid"
                          ? "text-green-600"
                          : invoice.payment_status === "Partial"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {invoice.payment_status}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <FileText className="mx-auto text-slate-400 mb-3" size={38} />
                <p className="text-slate-500">No invoices created yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-5">
            Low Stock Alerts
          </h2>

          <div className="space-y-4">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between bg-red-50 border border-red-100 rounded-2xl p-4"
                >
                  <div>
                    <h3 className="font-semibold text-slate-700">
                      {product.name}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {product.category?.name || "-"}
                    </p>
                  </div>

                  <span className="text-red-600 font-bold">
                    {product.stock} Left
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <Package className="mx-auto text-slate-400 mb-3" size={38} />
                <p className="text-slate-500">No low stock products.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
