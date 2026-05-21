import { useEffect, useState } from "react";
import api from "../../services/api";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  FileText,
  IndianRupee,
  CheckCircle2,
  Clock,
  Download,
} from "lucide-react";

const CustomerDashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [settings, setSettings] = useState(null);

  const loggedUser = JSON.parse(localStorage.getItem("billstack_user"));

  useEffect(() => {
    fetchCustomerInvoices();
    fetchSettings();
  }, []);

  const imageBaseUrl = "http://127.0.0.1:8000/storage/";

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

  const fetchCustomerInvoices = async () => {
    try {
      const response = await api.get("/invoices");
      setInvoices(response.data.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch customer invoices");
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
    doc.text(`GST Total: Rs.${Number(invoice.gst_total).toFixed(2)}`, 14, finalY + 8);
    doc.text(`Discount: Rs.${Number(invoice.discount).toFixed(2)}`, 14, finalY + 16);

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

  const totalSpent = invoices
    .filter((invoice) => invoice.payment_status === "Paid")
    .reduce((sum, invoice) => sum + Number(invoice.grand_total), 0);

  const pendingDues = invoices
    .filter((invoice) => invoice.payment_status !== "Paid")
    .reduce((sum, invoice) => sum + Number(invoice.grand_total), 0);

  const paidInvoices = invoices.filter(
    (invoice) => invoice.payment_status === "Paid"
  ).length;

  const pendingInvoices = invoices.filter(
    (invoice) => invoice.payment_status !== "Paid"
  ).length;

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            My Dashboard
          </h1>

          <p className="text-slate-500 mt-2">
            View your invoices, payment status and billing history.
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-4 rounded-[24px] shadow-lg shadow-blue-200">
          <p className="text-xs text-blue-100">Logged in as</p>
          <p className="font-bold">{loggedUser?.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">My Invoices</p>
          <div className="flex items-center justify-between mt-3">
            <h3 className="text-3xl font-bold text-slate-900">
              {invoices.length}
            </h3>
            <FileText className="text-blue-600" size={30} />
          </div>
        </div>

        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Total Paid</p>
          <div className="flex items-center justify-between mt-3">
            <h3 className="text-3xl font-bold text-slate-900">
              ₹{totalSpent.toFixed(2)}
            </h3>
            <IndianRupee className="text-green-600" size={30} />
          </div>
        </div>

        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Paid Invoices</p>
          <div className="flex items-center justify-between mt-3">
            <h3 className="text-3xl font-bold text-slate-900">
              {paidInvoices}
            </h3>
            <CheckCircle2 className="text-emerald-600" size={30} />
          </div>
        </div>

        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Pending Dues</p>
          <div className="flex items-center justify-between mt-3">
            <h3 className="text-3xl font-bold text-slate-900">
              ₹{pendingDues.toFixed(2)}
            </h3>
            <Clock className="text-red-600" size={30} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900">My Invoices</h2>
          <p className="text-sm text-slate-500 mt-1">
            Only invoices linked to your email are shown here.
          </p>
        </div>

        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <table className="w-full min-w-[850px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 font-semibold text-slate-700">
                  Invoice No
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
                  Download
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
                      <button
                        onClick={() => downloadInvoicePdf(invoice)}
                        className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition"
                      >
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-20">
                    <FileText
                      className="mx-auto text-slate-400 mb-3"
                      size={42}
                    />

                    <h3 className="text-xl font-semibold text-slate-800">
                      No Invoices Found
                    </h3>

                    <p className="text-slate-500 mt-2">
                      No invoices are linked with your account yet.
                    </p>
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

export default CustomerDashboard;