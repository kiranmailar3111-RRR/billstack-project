import { useEffect, useState } from "react";
import api from "../../services/api";

import Modal from "../../components/ui/Modal";
import InputField from "../../components/ui/InputField";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Users,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Building2,
  BadgeIndianRupee,
} from "lucide-react";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    gst_number: "",
    email: "",
    phone: "",
    state: "",
    address: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get("/customers");
      setCustomers(response.data.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch customers");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      gst_number: "",
      email: "",
      phone: "",
      state: "",
      address: "",
    });
  };

  const showToast = (message) => {
    setToast({ show: true, message });

    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 2500);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert("Customer name is required");
      return false;
    }

    if (!formData.phone.trim()) {
      alert("Phone number is required");
      return false;
    }

    if (!formData.email.trim()) {
      alert("Email is required");
      return false;
    }

    return true;
  };

  const handleAddOrUpdateCustomer = async () => {
    if (!validateForm()) return;

    try {
      if (isEdit) {
        await api.put(`/customers/${editId}`, formData);
        showToast("Customer updated successfully");
      } else {
        await api.post("/customers", formData);
        showToast("Customer added successfully");
      }

      await fetchCustomers();

      resetForm();
      setShowModal(false);
      setIsEdit(false);
      setEditId(null);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (customer) => {
    setIsEdit(true);
    setEditId(customer.id);

    setFormData({
      name: customer.name || "",
      company: customer.company || "",
      gst_number: customer.gst_number || "",
      email: customer.email || "",
      phone: customer.phone || "",
      state: customer.state || "",
      address: customer.address || "",
    });

    setShowModal(true);
  };

  const handleDeleteClick = (customer) => {
    setSelectedCustomer(customer);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/customers/${selectedCustomer.id}`);

      await fetchCustomers();

      setDeleteModal(false);
      setSelectedCustomer(null);

      showToast("Customer deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to delete customer");
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchText = search.toLowerCase();

    return (
      customer.name?.toLowerCase().includes(searchText) ||
      customer.company?.toLowerCase().includes(searchText) ||
      customer.phone?.toLowerCase().includes(searchText) ||
      customer.gst_number?.toLowerCase().includes(searchText)
    );
  });

  const totalCustomers = customers.length;

  const gstCustomers = customers.filter(
    (customer) => customer.gst_number && customer.gst_number.trim() !== ""
  ).length;

  const statesCount = new Set(
    customers
      .map((customer) => customer.state)
      .filter((state) => state && state.trim() !== "")
  ).size;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Customers
          </h1>

          <p className="text-slate-500 mt-2">
            Manage customer profiles, GST details, contact records and billing
            addresses.
          </p>
        </div>

        <button
          onClick={() => {
            setShowModal(true);
            setIsEdit(false);
            setEditId(null);
            resetForm();
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold transition shadow-lg shadow-blue-200"
        >
          <Plus size={20} />
          Add Customer
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Customers</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {totalCustomers}
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
              <p className="text-sm text-slate-500">GST Customers</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {gstCustomers}
              </h3>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
              <BadgeIndianRupee className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">States Covered</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {statesCount}
              </h3>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
              <MapPin className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Customer List
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Search, edit and manage your customer database.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-100 rounded-2xl px-4 py-3 w-full lg:w-80">
              <Search className="text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none w-full"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 font-semibold text-slate-700">
                  Customer
                </th>
                <th className="text-left p-4 font-semibold text-slate-700">
                  Company
                </th>
                <th className="text-left p-4 font-semibold text-slate-700">
                  GST
                </th>
                <th className="text-left p-4 font-semibold text-slate-700">
                  Phone
                </th>
                <th className="text-left p-4 font-semibold text-slate-700">
                  State
                </th>
                <th className="text-left p-4 font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-t border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-100">
                          {customer.name?.charAt(0)}
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {customer.name}
                          </h3>

                          <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                            <Mail size={14} />
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-slate-600">
                      {customer.company || "-"}
                    </td>

                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                        {customer.gst_number || "No GST"}
                      </span>
                    </td>

                    <td className="p-4 text-slate-600">
                      <span className="flex items-center gap-2">
                        <Phone size={16} />
                        {customer.phone || "-"}
                      </span>
                    </td>

                    <td className="p-4 text-slate-600">
                      {customer.state || "-"}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(customer)}
                          className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => handleDeleteClick(customer)}
                          className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-20">
                    <Users className="mx-auto text-slate-400 mb-3" size={42} />
                    <h3 className="text-xl font-semibold text-slate-800">
                      No Customers Found
                    </h3>
                    <p className="text-slate-500 mt-2">
                      Add your first customer to continue.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={isEdit ? "Edit Customer" : "Add Customer"}
        subtitle="Add customer contact, GST and billing address information."
        width="max-w-5xl"
      >
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-slate-50 rounded-[28px] p-6 border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  label="Customer Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter customer name"
                  required
                />

                <InputField
                  label="Company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  placeholder="Enter company name"
                />

                <InputField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter email"
                  required
                />

                <InputField
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            <div className="bg-slate-50 rounded-[28px] p-6 border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">
                GST & Address
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  label="GST Number"
                  value={formData.gst_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gst_number: e.target.value,
                    })
                  }
                  placeholder="Enter GST number"
                />

                <InputField
                  label="State"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  placeholder="Enter state"
                />

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Address
                  </label>

                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: e.target.value,
                      })
                    }
                    rows="4"
                    placeholder="Enter address"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[28px] p-6 text-white shadow-xl shadow-blue-200">
              <p className="text-blue-100 text-sm">Customer Preview</p>

              <div className="w-16 h-16 rounded-3xl bg-white/20 flex items-center justify-center font-bold text-2xl mt-5">
                {formData.name?.charAt(0) || "C"}
              </div>

              <h3 className="text-2xl font-bold mt-4">
                {formData.name || "Customer Name"}
              </h3>

              <p className="text-blue-100 mt-1">
                {formData.company || "Company Name"}
              </p>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  {formData.email || "email@example.com"}
                </div>

                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  {formData.phone || "Phone"}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  {formData.state || "State"}
                </div>
              </div>
            </div>

            <button
              onClick={handleAddOrUpdateCustomer}
              className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition-all shadow-lg shadow-blue-200"
            >
              {isEdit ? "Update Customer" : "Save Customer"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Customer"
        subtitle="This action cannot be undone."
        width="max-w-md"
      >
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-red-100 flex items-center justify-center mx-auto mb-5">
            <Trash2 className="text-red-600" size={36} />
          </div>

          <p className="text-slate-500">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-700">
              {selectedCustomer?.name}
            </span>
            ?
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setDeleteModal(false)}
              className="px-5 py-3 rounded-2xl border border-slate-300 font-medium"
            >
              Cancel
            </button>

            <button
              onClick={confirmDelete}
              className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      {toast.show && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-5 py-4 rounded-2xl shadow-xl flex items-center gap-3 z-[100]">
          <CheckCircle2 size={22} />
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default Customers;