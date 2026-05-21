import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  IndianRupee,
  FileText,
  Package,
  AlertTriangle,
  Printer,
  CheckCircle2,
  Clock,
  BarChart3,
} from "lucide-react";

const Reports = () => {
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      const [productsRes, invoicesRes] = await Promise.all([
        api.get("/products"),
        api.get("/invoices"),
      ]);

      setProducts(productsRes.data.data);
      setInvoices(invoicesRes.data.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch reports data");
    }
  };

  const paidInvoices = invoices.filter(
    (invoice) => invoice.payment_status === "Paid"
  );

  const pendingInvoices = invoices.filter(
    (invoice) => invoice.payment_status === "Pending"
  );

  const partialInvoices = invoices.filter(
    (invoice) => invoice.payment_status === "Partial"
  );

  const totalRevenue = paidInvoices.reduce(
    (sum, invoice) => sum + Number(invoice.grand_total),
    0
  );

  const pendingAmount = pendingInvoices.reduce(
    (sum, invoice) => sum + Number(invoice.grand_total),
    0
  );

  const partialAmount = partialInvoices.reduce(
    (sum, invoice) => sum + Number(invoice.grand_total),
    0
  );

  const lowStockProducts = products.filter(
    (product) => Number(product.stock) < Number(product.min_stock_alert || 10)
  );

  const totalStock = products.reduce(
    (sum, product) => sum + Number(product.stock),
    0
  );

  const printReport = () => {
    window.print();
  };

  return (
    <div>
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Reports
          </h1>
          <p className="text-slate-500 mt-2">
            Live revenue, invoice and stock reports from your database.
          </p>
        </div>

        <button
          onClick={printReport}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl font-semibold transition"
        >
          <Printer size={20} />
          Print Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-[28px] p-6 text-white shadow-xl shadow-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Paid Revenue</p>
              <h3 className="text-3xl font-bold mt-2">
                ₹{totalRevenue.toFixed(2)}
              </h3>
            </div>
            <IndianRupee size={32} />
          </div>
        </div>

        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Invoices</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {invoices.length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
              <FileText className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Low Stock</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {lowStockProducts.length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Stock Qty</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {totalStock}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
              <Package className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Paid</h2>
              <p className="text-sm text-slate-500">Completed invoices</p>
            </div>
          </div>

          <p className="text-3xl font-bold text-slate-900">
            {paidInvoices.length}
          </p>
          <p className="text-slate-500 mt-2">
            Amount: ₹{totalRevenue.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
              <Clock className="text-red-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Pending</h2>
              <p className="text-sm text-slate-500">Awaiting payment</p>
            </div>
          </div>

          <p className="text-3xl font-bold text-slate-900">
            {pendingInvoices.length}
          </p>
          <p className="text-slate-500 mt-2">
            Amount: ₹{pendingAmount.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center">
              <BarChart3 className="text-yellow-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Partial</h2>
              <p className="text-sm text-slate-500">Partially collected</p>
            </div>
          </div>

          <p className="text-3xl font-bold text-slate-900">
            {partialInvoices.length}
          </p>
          <p className="text-slate-500 mt-2">
            Amount: ₹{partialAmount.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900">Stock Report</h2>
          <p className="text-sm text-slate-500 mt-1">
            Track remaining quantity and low stock alerts.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 font-semibold text-slate-700">
                  Product
                </th>
                <th className="text-left p-4 font-semibold text-slate-700">
                  SKU
                </th>
                <th className="text-left p-4 font-semibold text-slate-700">
                  Category
                </th>
                <th className="text-left p-4 font-semibold text-slate-700">
                  Stock
                </th>
                <th className="text-left p-4 font-semibold text-slate-700">
                  Alert Qty
                </th>
                <th className="text-left p-4 font-semibold text-slate-700">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {products.length > 0 ? (
                products.map((product) => {
                  const isLowStock =
                    Number(product.stock) <
                    Number(product.min_stock_alert || 10);

                  return (
                    <tr
                      key={product.id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="p-4 font-semibold text-slate-900">
                        {product.name}
                      </td>
                      <td className="p-4 text-slate-600">{product.sku}</td>
                      <td className="p-4 text-slate-600">
                        {product.category?.name || "-"}
                      </td>
                      <td className="p-4 font-bold text-slate-900">
                        {product.stock}
                      </td>
                      <td className="p-4 text-slate-600">
                        {product.min_stock_alert}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            isLowStock
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {isLowStock ? "Low Stock" : "Active"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-16">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900">Invoice Report</h2>
          <p className="text-sm text-slate-500 mt-1">
            Complete list of invoice payment status.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 font-semibold text-slate-700">
                  Invoice
                </th>
                <th className="text-left p-4 font-semibold text-slate-700">
                  Customer
                </th>
                <th className="text-left p-4 font-semibold text-slate-700">
                  Date
                </th>
                <th className="text-left p-4 font-semibold text-slate-700">
                  Amount
                </th>
                <th className="text-left p-4 font-semibold text-slate-700">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="p-4 font-semibold text-slate-900">
                      {invoice.invoice_number}
                    </td>
                    <td className="p-4 text-slate-600">
                      {invoice.customer?.name || "-"}
                    </td>
                    <td className="p-4 text-slate-600">
                      {invoice.invoice_date}
                    </td>
                    <td className="p-4 font-bold text-slate-900">
                      ₹{Number(invoice.grand_total).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          invoice.payment_status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : invoice.payment_status === "Partial"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {invoice.payment_status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-16">
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;