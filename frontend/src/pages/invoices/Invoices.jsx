import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  Plus,
  Trash2,
  FileText,
  CheckCircle2,
  IndianRupee,
  Package,
  Users,
  Search,
  Check,
  Download,
  ReceiptText,
  Sparkles,
} from "lucide-react";

const Invoices = () => {
  const userRole = localStorage.getItem("billstack_role");
  const isCustomer = userRole === "Customer";

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [settings, setSettings] = useState(null);

  const [customerId, setCustomerId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [discount, setDiscount] = useState("");

  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [items, setItems] = useState([{ product_id: "", quantity: 1 }]);

  const [toast, setToast] = useState({ show: false, message: "" });

  const imageBaseUrl = "http://127.0.0.1:8000/storage/";

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    fetchInvoices();
    fetchSettings();
  }, []);

  const getImageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    return `${imageBaseUrl}${image}`;
  };

 const getImageBase64 = async (path) => {
  try {
    const response = await api.get("/settings/image-base64", {
      params: {
        path,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("Image base64 failed:", error);
    return null;
  }
};

  const fetchCustomers = async () => {
    try {
      const response = await api.get("/customers");
      setCustomers(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await api.get("/invoices");
      setInvoices(response.data.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch invoices");
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await api.get("/settings");
      setSettings(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const showToast = (message) => {
    setToast({ show: true, message });

    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 2500);
  };

  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(
    invoices.length + 1
  ).padStart(3, "0")}`;

  const selectedCustomer = customers.find(
    (customer) => String(customer.id) === String(customerId)
  );

  const getProduct = (productId) => {
    return products.find((product) => String(product.id) === String(productId));
  };

  const calculatedItems = items.map((item) => {
    const product = getProduct(item.product_id);

    const price = product ? Number(product.selling_price) : 0;
    const gstPercent = product ? Number(product.gst_percent) : 0;
    const qty = Number(item.quantity) || 0;

    const subtotal = price * qty;
    const gstAmount = (subtotal * gstPercent) / 100;
    const total = subtotal + gstAmount;

    return {
      ...item,
      product,
      price,
      gstPercent,
      subtotal,
      gstAmount,
      total,
    };
  });

  const subtotal = useMemo(() => {
    return calculatedItems.reduce((sum, item) => sum + item.subtotal, 0);
  }, [calculatedItems]);

  const totalGst = useMemo(() => {
    return calculatedItems.reduce((sum, item) => sum + item.gstAmount, 0);
  }, [calculatedItems]);

  const grandTotal = subtotal + totalGst;
  const finalTotal = grandTotal - Number(discount || 0);

  const addRow = () => {
    setItems([...items, { product_id: "", quantity: 1 }]);
  };

  const removeRow = (index) => {
    setItems(items.filter((_, itemIndex) => itemIndex !== index));
  };

  const updateItem = (index, field, value) => {
    setItems(
      items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  };

  const validateInvoice = () => {
    if (!customerId) {
      alert("Please select customer");
      return false;
    }

    for (const item of calculatedItems) {
      if (!item.product_id) {
        alert("Please select product");
        return false;
      }

      if (!item.quantity || Number(item.quantity) <= 0) {
        alert("Please enter valid quantity");
        return false;
      }

      if (item.product && Number(item.quantity) > Number(item.product.stock)) {
        alert(`${item.product.name} has only ${item.product.stock} stock left`);
        return false;
      }
    }

    return true;
  };

  const saveInvoice = async () => {
    if (!validateInvoice()) return;

    const payload = {
      customer_id: customerId,
      payment_status: paymentStatus,
      discount: Number(discount || 0),
      items: items.map((item) => ({
        product_id: item.product_id,
        quantity: Number(item.quantity),
      })),
    };

    try {
      await api.post("/invoices", payload);

      await fetchInvoices();
      await fetchProducts();

      setCustomerId("");
      setPaymentStatus("Pending");
      setDiscount("");
      setItems([{ product_id: "", quantity: 1 }]);

      showToast("Invoice created successfully");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Invoice creation failed");
    }
  };

  const markInvoicePaid = async (invoiceId) => {
    try {
      await api.put(`/invoices/${invoiceId}`, {
        payment_status: "Paid",
      });

      await fetchInvoices();
      showToast("Invoice marked as paid");
    } catch (error) {
      console.error(error);
      alert("Failed to update invoice");
    }
  };

  const deleteInvoice = async (invoiceId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this invoice?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/invoices/${invoiceId}`);
      await fetchInvoices();
      showToast("Invoice deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to delete invoice");
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const searchText = invoiceSearch.toLowerCase();

    const matchesSearch =
      invoice.invoice_number?.toLowerCase().includes(searchText) ||
      invoice.customer?.name?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" || invoice.payment_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const downloadInvoicePdf = async (invoice) => {
    const doc = new jsPDF();

    const logoBase64 = settings?.logo
  ? await getImageBase64(settings.logo)
  : null;

const signatureBase64 = settings?.signature
  ? await getImageBase64(settings.signature)
  : null;

    if (logoBase64) {
  doc.addImage(logoBase64, 14, 10, 25, 25);
}

    doc.setFontSize(22);
    doc.text(
      `${settings?.business_name || "BillStack"} Invoice`,
      logoBase64 ? 45 : 14,
      20
    );

    doc.setFontSize(10);
    doc.text(`GST: ${settings?.gst_number || "-"}`, 14, 42);
    doc.text(`Phone: ${settings?.phone || "-"}`, 14, 48);
    doc.text(`Email: ${settings?.email || "-"}`, 14, 54);
    doc.text(`Address: ${settings?.address || "-"}`, 14, 60);

    doc.setFontSize(12);
    doc.text(`Invoice No: ${invoice.invoice_number}`, 14, 75);
    doc.text(`Date: ${invoice.invoice_date}`, 14, 83);
    doc.text(`Customer: ${invoice.customer?.name || "-"}`, 14, 91);
    doc.text(`Company: ${invoice.customer?.company || "-"}`, 14, 99);
    doc.text(`Customer GST: ${invoice.customer?.gst_number || "-"}`, 14, 107);

    const tableData = invoice.items.map((item) => [
      item.product?.name || "-",
      item.quantity,
      `Rs.${Number(item.price).toFixed(2)}`,
      `${item.gst_percent}%`,
      `Rs.${Number(item.total).toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 118,
      head: [["Product", "Qty", "Price", "GST", "Total"]],
      body: tableData,
    });

    const finalY = doc.lastAutoTable.finalY + 15;

    doc.setFontSize(11);
    doc.text(`Subtotal: Rs.${Number(invoice.subtotal).toFixed(2)}`, 14, finalY);
    doc.text(
      `GST Total: Rs.${Number(invoice.gst_total).toFixed(2)}`,
      14,
      finalY + 8
    );
    doc.text(
      `Discount: Rs.${Number(invoice.discount).toFixed(2)}`,
      14,
      finalY + 16
    );

    doc.setFontSize(16);
    doc.text(
      `Grand Total: Rs.${Number(invoice.grand_total).toFixed(2)}`,
      14,
      finalY + 32
    );

   let signatureY = finalY + 5;

if (signatureY > 250) {
  doc.addPage();
  signatureY = 30;
}

if (signatureBase64) {
  doc.addImage(signatureBase64, 140, signatureY, 45, 25);
}

doc.setFontSize(10);
doc.text("Authorized Signature", 145, signatureY + 35);

    doc.save(`${invoice.invoice_number}.pdf`);
  };

  return (
    <div>
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Invoices
          </h1>

          <p className="text-slate-500 mt-2">
            {isCustomer
              ? "View and download your invoices."
              : "Create GST invoices, manage payments and reduce stock automatically."}
          </p>
        </div>

        {!isCustomer && (
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-4 rounded-[24px] shadow-lg shadow-blue-200">
            <ReceiptText size={22} />
            <div>
              <p className="text-xs text-blue-100">Next Invoice</p>
              <p className="font-bold">{invoiceNumber}</p>
            </div>
          </div>
        )}
      </div>

      {!isCustomer && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Customers</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-2">
                    {customers.length}
                  </h3>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <Users className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Products</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-2">
                    {products.length}
                  </h3>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                  <Package className="text-purple-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Current Total</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-2">
                    ₹{finalTotal.toFixed(2)}
                  </h3>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                  <IndianRupee className="text-green-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 2xl:grid-cols-3 gap-5 md:gap-8">
            <div className="2xl:col-span-2 space-y-6">
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                    <Sparkles className="text-blue-600" size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Create Invoice
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Select customer, add products and generate final GST
                      invoice.
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="text-sm font-semibold text-slate-700">
                        Customer
                      </label>
                      <select
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                        className="mt-2 w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      >
                        <option value="">Select Customer</option>
                        {customers.map((customer) => (
                          <option key={customer.id} value={customer.id}>
                            {customer.name} -{" "}
                            {customer.company || "No Company"}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-700">
                        Payment Status
                      </label>
                      <select
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                        className="mt-2 w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      >
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Partial">Partial</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-700">
                        Discount ₹
                      </label>
                      <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        placeholder="0.00"
                        className="mt-2 w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {items.map((item, index) => {
                      const product = getProduct(item.product_id);

                      return (
                        <div
                          key={index}
                          className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-slate-50 rounded-[28px] p-4 border border-slate-100"
                        >
                          <div className="lg:col-span-5">
                            <label className="text-sm font-semibold text-slate-700">
                              Product
                            </label>
                            <select
                              value={item.product_id}
                              onChange={(e) =>
                                updateItem(
                                  index,
                                  "product_id",
                                  e.target.value
                                )
                              }
                              className="mt-2 w-full h-14 rounded-2xl border border-slate-200 bg-white px-4 outline-none focus:border-blue-500"
                            >
                              <option value="">Select Product</option>
                              {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                  {product.name} - Stock {product.stock}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="lg:col-span-2">
                            <label className="text-sm font-semibold text-slate-700">
                              Qty
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItem(index, "quantity", e.target.value)
                              }
                              className="mt-2 w-full h-14 rounded-2xl border border-slate-200 bg-white px-4 outline-none focus:border-blue-500"
                            />
                          </div>

                          <div className="lg:col-span-2">
                            <label className="text-sm font-semibold text-slate-700">
                              Price
                            </label>
                            <div className="mt-2 h-14 rounded-2xl bg-white border border-slate-200 px-4 flex items-center font-semibold text-slate-700">
                              ₹
                              {product
                                ? Number(product.selling_price).toFixed(2)
                                : "0.00"}
                            </div>
                          </div>

                          <div className="lg:col-span-2">
                            <label className="text-sm font-semibold text-slate-700">
                              Total
                            </label>
                            <div className="mt-2 h-14 rounded-2xl bg-white border border-slate-200 px-4 flex items-center font-bold text-slate-900">
                              ₹{calculatedItems[index].total.toFixed(2)}
                            </div>
                          </div>

                          <div className="lg:col-span-1 flex lg:items-end">
                            <button
                              onClick={() => removeRow(index)}
                              disabled={items.length === 1}
                              className="w-full h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 disabled:opacity-40"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={addRow}
                    className="mt-5 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl font-semibold"
                  >
                    <Plus size={20} />
                    Add Product Row
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-200 h-fit sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Invoice Preview
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Logo and signature from settings
                  </p>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <FileText className="text-blue-600" size={22} />
                </div>
              </div>

              <div className="border border-slate-200 rounded-[28px] p-5">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex gap-3">
                    {settings?.logo && (
                      <img
                        src={getImageUrl(settings.logo)}
                        alt="Logo"
                        className="w-12 h-12 rounded-2xl object-cover border"
                      />
                    )}

                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {settings?.business_name || "BillStack"}
                      </h3>
                      <p className="text-sm text-slate-500">GST Invoice</p>
                      <p className="text-xs text-slate-500">
                        GST: {settings?.gst_number || "-"}
                      </p>
                      <p className="text-xs text-slate-500">
                        Phone: {settings?.phone || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-slate-900">{invoiceNumber}</p>
                    <p className="text-sm text-slate-500">
                      {new Date().toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 mb-5">
                  <p className="text-xs uppercase font-bold text-slate-400">
                    Bill To
                  </p>
                  <h4 className="font-bold text-slate-900 mt-1">
                    {selectedCustomer?.name || "Customer Name"}
                  </h4>
                  <p className="text-sm text-slate-500">
                    {selectedCustomer?.company || "Company"}
                  </p>
                  <p className="text-sm text-slate-500">
                    GST: {selectedCustomer?.gst_number || "-"}
                  </p>
                </div>

                <div className="space-y-3 mb-5">
                  {calculatedItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between gap-4 border-b border-slate-100 pb-3"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">
                          {item.product?.name || "Product"}
                        </p>
                        <p className="text-xs text-slate-500">
                          Qty: {item.quantity} × ₹{item.price.toFixed(2)} + GST{" "}
                          {item.gstPercent}%
                        </p>
                      </div>

                      <p className="font-bold text-slate-900">
                        ₹{item.total.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Total GST</span>
                    <span>₹{totalGst.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Discount</span>
                    <span>₹{Number(discount || 0).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-2xl font-bold text-slate-900 border-t border-slate-200 pt-4">
                    <span>Total</span>
                    <span>₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 border-t pt-4">
                  <p className="text-xs text-slate-500 mb-2">
                    Authorized Signature
                  </p>
                  {settings?.signature ? (
                    <img
                      src={getImageUrl(settings.signature)}
                      alt="Signature"
                      className="h-16 object-contain"
                    />
                  ) : (
                    <p className="text-sm text-slate-400">No signature</p>
                  )}
                </div>

                <button
                  onClick={saveInvoice}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-4 rounded-2xl font-bold shadow-lg shadow-blue-200"
                >
                  Save Invoice
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {isCustomer ? "My Invoices" : "Invoice History"}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {isCustomer
                  ? "Download your invoices here."
                  : "View, download and manage all generated invoices."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 bg-slate-100 rounded-2xl px-4 py-3">
                <Search className="text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search invoice/customer..."
                  value={invoiceSearch}
                  onChange={(e) => setInvoiceSearch(e.target.value)}
                  className="bg-transparent outline-none w-full"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-100 rounded-2xl px-4 py-3 outline-none"
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <table className="w-full min-w-[900px]">
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
                <th className="text-left p-4 font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center">
                          <FileText className="text-blue-600" size={20} />
                        </div>

                        <div>
                          <p className="font-bold text-slate-900">
                            {invoice.invoice_number}
                          </p>
                          <p className="text-xs text-slate-500">
                            GST Invoice
                          </p>
                        </div>
                      </div>
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

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {!isCustomer && invoice.payment_status !== "Paid" && (
                          <button
                            onClick={() => markInvoicePaid(invoice.id)}
                            className="w-9 h-9 rounded-xl bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition"
                            title="Mark as Paid"
                          >
                            <Check size={17} />
                          </button>
                        )}

                        <button
                          onClick={() => downloadInvoicePdf(invoice)}
                          className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition"
                          title="Download PDF"
                        >
                          <Download size={17} />
                        </button>

                        {!isCustomer && (
                          <button
                            onClick={() => deleteInvoice(invoice.id)}
                            className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition"
                            title="Delete Invoice"
                          >
                            <Trash2 size={17} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-20">
                    <FileText
                      className="mx-auto text-slate-400 mb-3"
                      size={42}
                    />

                    <h3 className="text-xl font-semibold text-slate-800">
                      No Invoices Found
                    </h3>

                    <p className="text-slate-500 mt-2">
                      {isCustomer
                        ? "No invoices are linked with your account yet."
                        : "Create your first invoice to see history."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {toast.show && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-5 py-4 rounded-2xl shadow-xl flex items-center gap-3 z-[100]">
          <CheckCircle2 size={22} />
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default Invoices;