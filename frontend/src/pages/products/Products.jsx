import { useEffect, useState } from "react";
import api from "../../services/api";

import Modal from "../../components/ui/Modal";
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/SelectField";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  CheckCircle2,
  AlertTriangle,
  Boxes,
  Activity,
  RotateCcw,
  Eye,
  RefreshCw,
  X,
} from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [detailsDrawer, setDetailsDrawer] = useState(false);
  const [stockModal, setStockModal] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const [sortBy, setSortBy] = useState("default");
  const [sortOrder, setSortOrder] = useState("asc");

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [stockAction, setStockAction] = useState("add");
  const [stockQty, setStockQty] = useState("");

  const [imagePreview, setImagePreview] = useState("");

  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    sku: "",
    purchase_price: "",
    selling_price: "",
    gst_percent: "",
    stock: "",
    min_stock_alert: "",
    status: "Active",
    image: null,
  });

  const imageBaseUrl = "http://127.0.0.1:8000/storage/";

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const getImageUrl = (image) => {
    if (!image) {
      return "https://images.unsplash.com/photo-1587033411391-5d9e51cce126?q=80&w=400";
    }

    if (image.startsWith("blob:") || image.startsWith("http")) {
      return image;
    }

    return `${imageBaseUrl}${image}`;
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch products");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      category_id: "",
      name: "",
      sku: "",
      purchase_price: "",
      selling_price: "",
      gst_percent: "",
      stock: "",
      min_stock_alert: "",
      status: "Active",
      image: null,
    });

    setImagePreview("");
  };

  const showToast = (message) => {
    setToast({
      show: true,
      message,
    });

    setTimeout(() => {
      setToast({
        show: false,
        message: "",
      });
    }, 2500);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData({
        ...formData,
        image: file,
      });

      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert("Product name is required");
      return false;
    }

    if (!formData.sku.trim()) {
      alert("SKU code is required");
      return false;
    }

    if (!formData.selling_price || Number(formData.selling_price) <= 0) {
      alert("Valid selling price is required");
      return false;
    }

    if (formData.stock === "" || Number(formData.stock) < 0) {
      alert("Valid stock quantity is required");
      return false;
    }

    return true;
  };

  const handleAddOrUpdateProduct = async () => {
    if (!validateForm()) return;

    const payload = new FormData();

    payload.append("category_id", formData.category_id || "");
    payload.append("name", formData.name);
    payload.append("sku", formData.sku);
    payload.append("purchase_price", formData.purchase_price || 0);
    payload.append("selling_price", formData.selling_price);
    payload.append("gst_percent", formData.gst_percent || 0);
    payload.append("stock", formData.stock || 0);
    payload.append("min_stock_alert", formData.min_stock_alert || 10);
    payload.append("status", formData.status || "Active");

    if (formData.image) {
      payload.append("image", formData.image);
    }

    try {
      if (isEdit) {
        payload.append("_method", "PUT");

        await api.post(`/products/${editId}`, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        showToast("Product updated successfully");
      } else {
        await api.post("/products", payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        showToast("Product added successfully");
      }

      await fetchProducts();

      resetForm();
      setShowModal(false);
      setIsEdit(false);
      setEditId(null);
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong");
      }
    }
  };

  const handleEdit = (product) => {
    setIsEdit(true);
    setEditId(product.id);

    setFormData({
      category_id: product.category_id || "",
      name: product.name || "",
      sku: product.sku || "",
      purchase_price: product.purchase_price || "",
      selling_price: product.selling_price || "",
      gst_percent: product.gst_percent || "",
      stock: product.stock || "",
      min_stock_alert: product.min_stock_alert || "",
      status: product.status || "Active",
      image: null,
    });

    setImagePreview(getImageUrl(product.image));
    setShowModal(true);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/products/${selectedProduct.id}`);

      await fetchProducts();

      setDeleteModal(false);
      setSelectedProduct(null);

      showToast("Product deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to delete product");
    }
  };

  const openStockModal = (product) => {
    setSelectedProduct(product);
    setStockAction("add");
    setStockQty("");
    setStockModal(true);
  };

  const updateStock = async () => {
    if (!stockQty || Number(stockQty) <= 0) {
      alert("Please enter valid quantity");
      return;
    }

    const currentStock = Number(selectedProduct.stock);

    let newStock =
      stockAction === "add"
        ? currentStock + Number(stockQty)
        : currentStock - Number(stockQty);

    if (newStock < 0) {
      newStock = 0;
    }

    const payload = new FormData();

    payload.append("_method", "PUT");
    payload.append("category_id", selectedProduct.category_id || "");
    payload.append("name", selectedProduct.name);
    payload.append("sku", selectedProduct.sku);
    payload.append("purchase_price", selectedProduct.purchase_price || 0);
    payload.append("selling_price", selectedProduct.selling_price);
    payload.append("gst_percent", selectedProduct.gst_percent || 0);
    payload.append("stock", newStock);
    payload.append("min_stock_alert", selectedProduct.min_stock_alert || 10);
    payload.append(
      "status",
      newStock < Number(selectedProduct.min_stock_alert || 10)
        ? "Low Stock"
        : "Active"
    );

    try {
      await api.post(`/products/${selectedProduct.id}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchProducts();

      setStockModal(false);
      setSelectedProduct(null);
      setStockQty("");

      showToast("Stock updated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to update stock");
    }
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setDetailsDrawer(true);
  };

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("All");
    setStatusFilter("All");
    setCurrentPage(1);
    setSortBy("default");
    setSortOrder("asc");
  };

  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      product.name?.toLowerCase().includes(searchText) ||
      product.sku?.toLowerCase().includes(searchText);

    const matchesCategory =
      categoryFilter === "All" ||
      String(product.category_id) === String(categoryFilter);

    const currentStatus =
      Number(product.stock) < Number(product.min_stock_alert || 10)
        ? "Low Stock"
        : "Active";

    const matchesStatus =
      statusFilter === "All" || currentStatus === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }

    if (sortBy === "price") {
      return sortOrder === "asc"
        ? Number(a.selling_price) - Number(b.selling_price)
        : Number(b.selling_price) - Number(a.selling_price);
    }

    if (sortBy === "stock") {
      return sortOrder === "asc"
        ? Number(a.stock) - Number(b.stock)
        : Number(b.stock) - Number(a.stock);
    }

    return 0;
  });

  const totalProducts = products.length;

  const activeProducts = products.filter(
    (product) => Number(product.stock) >= Number(product.min_stock_alert || 10)
  ).length;

  const lowStockProducts = products.filter(
    (product) => Number(product.stock) < Number(product.min_stock_alert || 10)
  ).length;

  const totalStock = products.reduce(
    (total, product) => total + Number(product.stock),
    0
  );

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage) || 1;

  const startIndex = (currentPage - 1) * productsPerPage;

  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Products
          </h1>
          <p className="text-slate-500 mt-2">
            Manage products, stock, pricing, GST and inventory alerts.
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
          Add Product
        </button>
      </div>

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Products</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {totalProducts}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
              <Package className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active Products</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {activeProducts}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
              <Activity className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Low Stock Items</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {lowStockProducts}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Stock Qty</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {totalStock}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
              <Boxes className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[28px] p-4 shadow-sm border border-slate-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="flex items-center gap-3 bg-slate-100 rounded-2xl px-4 py-3">
            <Search className="text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent outline-none w-full"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-100 rounded-2xl px-4 py-3 outline-none"
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-100 rounded-2xl px-4 py-3 outline-none"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Low Stock">Low Stock</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-100 rounded-2xl px-4 py-3 outline-none"
          >
            <option value="default">Sort By</option>
            <option value="name">Product Name</option>
            <option value="price">Price</option>
            <option value="stock">Stock</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-slate-100 rounded-2xl px-4 py-3 outline-none"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>

          <button
            onClick={clearFilters}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-4 py-3 font-semibold transition"
          >
            <RotateCcw size={18} />
            Clear
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-[28px] shadow-sm border border-slate-200 overflow-hidden">
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
                  Purchase
                </th>
                <th className="text-left p-4 font-semibold text-slate-700">
                  Selling
                </th>
                <th className="text-left p-4 font-semibold text-slate-700">
                  GST
                </th>
                <th className="text-left p-4 font-semibold text-slate-700">
                  Stock
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
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => {
                  const currentStatus =
                    Number(product.stock) <
                    Number(product.min_stock_alert || 10)
                      ? "Low Stock"
                      : "Active";

                  return (
                    <tr
                      key={product.id}
                      className="border-t border-slate-100 hover:bg-slate-50 transition"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-slate-100"
                          />

                          <div>
                            <h3 className="font-semibold text-slate-900">
                              {product.name}
                            </h3>
                            <p className="text-sm text-slate-500">
                              Min Alert: {product.min_stock_alert}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-slate-600">{product.sku}</td>

                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                          {product.category?.name || "-"}
                        </span>
                      </td>

                      <td className="p-4 text-slate-600">
                        ₹{Number(product.purchase_price).toFixed(2)}
                      </td>

                      <td className="p-4 font-semibold text-slate-900">
                        ₹{Number(product.selling_price).toFixed(2)}
                      </td>

                      <td className="p-4 text-slate-600">
                        {product.gst_percent}%
                      </td>

                      <td className="p-4">
                        <span
                          className={`font-semibold ${
                            currentStatus === "Low Stock"
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            currentStatus === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {currentStatus}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openStockModal(product)}
                            className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center hover:bg-purple-200 transition"
                          >
                            <RefreshCw size={17} />
                          </button>

                          <button
                            onClick={() => handleViewProduct(product)}
                            className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            onClick={() => handleEdit(product)}
                            className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() => handleDeleteClick(product)}
                            className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-16">
                    <Package
                      className="mx-auto text-slate-400 mb-3"
                      size={42}
                    />
                    <h3 className="text-xl font-semibold text-slate-700">
                      No Products Found
                    </h3>
                    <p className="text-slate-500 mt-2">
                      Add your first product to continue.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {sortedProducts.length > 0 && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-slate-200 rounded-[28px] p-4 mt-5">
          <p className="text-sm text-slate-500">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + productsPerPage, sortedProducts.length)} of{" "}
            {sortedProducts.length} products
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-4 py-2 rounded-2xl border border-slate-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              Previous
            </button>

            <span className="px-4 py-2 rounded-2xl bg-blue-600 text-white text-sm font-semibold">
              {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-4 py-2 rounded-2xl border border-slate-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Premium Add/Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={isEdit ? "Edit Product" : "Add Product"}
        subtitle="Manage product details, GST, stock and category."
        width="max-w-6xl"
      >
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-slate-50 rounded-[28px] p-6 border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  label="Product Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter product name"
                  required
                />

                <InputField
                  label="SKU"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  placeholder="Enter SKU code"
                  required
                />

                <SelectField
                  label="Category"
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category_id: e.target.value,
                    })
                  }
                  options={[
                    { value: "", label: "Select Category" },
                    ...categories.map((category) => ({
                      value: category.id,
                      label: category.name,
                    })),
                  ]}
                />

                <SelectField
                  label="Status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  options={[
                    { value: "Active", label: "Active" },
                    { value: "Inactive", label: "Inactive" },
                  ]}
                />
              </div>
            </div>

            <div className="bg-slate-50 rounded-[28px] p-6 border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">
                Pricing & GST
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <InputField
                  label="Purchase Price"
                  type="number"
                  value={formData.purchase_price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      purchase_price: e.target.value,
                    })
                  }
                  placeholder="0.00"
                />

                <InputField
                  label="Selling Price"
                  type="number"
                  value={formData.selling_price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      selling_price: e.target.value,
                    })
                  }
                  placeholder="0.00"
                  required
                />

                <InputField
                  label="GST %"
                  type="number"
                  value={formData.gst_percent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gst_percent: e.target.value,
                    })
                  }
                  placeholder="18"
                />
              </div>
            </div>

            <div className="bg-slate-50 rounded-[28px] p-6 border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">
                Inventory
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  label="Stock Quantity"
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  placeholder="0"
                  required
                />

                <InputField
                  label="Min Stock Alert"
                  type="number"
                  value={formData.min_stock_alert}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      min_stock_alert: e.target.value,
                    })
                  }
                  placeholder="5"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 rounded-[28px] p-6 border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-5">
                Product Image
              </h3>

              <div className="border-2 border-dashed border-slate-200 rounded-[28px] p-5 text-center bg-white">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-60 object-cover rounded-[24px]"
                  />
                ) : (
                  <div className="h-60 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-3xl mb-4">
                      📦
                    </div>

                    <p className="text-slate-500">Upload product image</p>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="mt-5 w-full text-sm"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[28px] p-6 text-white shadow-xl shadow-blue-200">
              <p className="text-blue-100 text-sm">Product Preview</p>

              <h3 className="text-2xl font-bold mt-3">
                {formData.name || "Product Name"}
              </h3>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-100">Selling Price</span>
                  <span className="font-bold">
                    ₹{formData.selling_price || 0}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-blue-100">GST</span>
                  <span className="font-bold">
                    {formData.gst_percent || 0}%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-blue-100">Stock</span>
                  <span className="font-bold">{formData.stock || 0}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddOrUpdateProduct}
              className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition-all shadow-lg shadow-blue-200"
            >
              {isEdit ? "Update Product" : "Save Product"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Stock Update Modal */}
      {stockModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-[28px] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Update Stock
              </h2>
              <button
                onClick={() => setStockModal(false)}
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>

            <p className="font-semibold text-slate-800 mb-2">
              {selectedProduct.name}
            </p>
            <p className="text-sm text-slate-500 mb-5">
              Current Stock: {selectedProduct.stock}
            </p>

            <div className="space-y-4">
              <select
                value={stockAction}
                onChange={(e) => setStockAction(e.target.value)}
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none"
              >
                <option value="add">Add Stock</option>
                <option value="remove">Remove Stock</option>
              </select>

              <input
                type="number"
                value={stockQty}
                onChange={(e) => setStockQty(e.target.value)}
                placeholder="Enter quantity"
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setStockModal(false)}
                className="px-5 py-3 rounded-2xl border border-slate-300 font-medium"
              >
                Cancel
              </button>

              <button
                onClick={updateStock}
                className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-medium"
              >
                Update Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Drawer */}
      {detailsDrawer && selectedProduct && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Product Details
              </h2>

              <button
                onClick={() => setDetailsDrawer(false)}
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>

            <img
              src={getImageUrl(selectedProduct.image)}
              alt={selectedProduct.name}
              className="w-full h-56 rounded-[28px] object-cover mb-6"
            />

            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Product Name</p>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedProduct.name}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-100 rounded-2xl p-4">
                  <p className="text-sm text-slate-500">SKU</p>
                  <h4 className="font-semibold text-slate-800">
                    {selectedProduct.sku}
                  </h4>
                </div>

                <div className="bg-slate-100 rounded-2xl p-4">
                  <p className="text-sm text-slate-500">Category</p>
                  <h4 className="font-semibold text-slate-800">
                    {selectedProduct.category?.name || "-"}
                  </h4>
                </div>

                <div className="bg-slate-100 rounded-2xl p-4">
                  <p className="text-sm text-slate-500">Purchase</p>
                  <h4 className="font-semibold text-slate-800">
                    ₹{Number(selectedProduct.purchase_price).toFixed(2)}
                  </h4>
                </div>

                <div className="bg-slate-100 rounded-2xl p-4">
                  <p className="text-sm text-slate-500">Selling</p>
                  <h4 className="font-semibold text-slate-800">
                    ₹{Number(selectedProduct.selling_price).toFixed(2)}
                  </h4>
                </div>
              </div>

              <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                <p className="text-sm text-slate-500">Current Stock</p>
                <h4 className="text-2xl font-bold text-green-600">
                  {selectedProduct.stock} Qty
                </h4>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-[28px] p-6">
            <div className="text-center">
              <Trash2 className="mx-auto text-red-600 mb-4" size={42} />
              <h2 className="text-2xl font-bold text-slate-900">
                Delete Product
              </h2>
              <p className="text-slate-500 mt-3">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-700">
                  {selectedProduct.name}
                </span>
                ?
              </p>
            </div>

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
        </div>
      )}

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

export default Products;