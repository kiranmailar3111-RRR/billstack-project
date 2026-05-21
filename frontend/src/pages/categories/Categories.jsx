import { useEffect, useState } from "react";
import api from "../../services/api";

import Modal from "../../components/ui/Modal";
import InputField from "../../components/ui/InputField";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Layers3,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [toast, setToast] = useState({ show: false, message: "" });

  const [formData, setFormData] = useState({
    name: "",
    status: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch categories");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", status: true });
  };

  const showToast = (message) => {
    setToast({ show: true, message });

    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 2500);
  };

  const handleAddOrUpdateCategory = async () => {
    if (!formData.name.trim()) {
      alert("Category name is required");
      return;
    }

    try {
      if (isEdit) {
        await api.put(`/categories/${editId}`, formData);
        showToast("Category updated successfully");
      } else {
        await api.post("/categories", formData);
        showToast("Category added successfully");
      }

      await fetchCategories();

      resetForm();
      setShowModal(false);
      setIsEdit(false);
      setEditId(null);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (category) => {
    setIsEdit(true);
    setEditId(category.id);

    setFormData({
      name: category.name || "",
      status: Boolean(category.status),
    });

    setShowModal(true);
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/categories/${selectedCategory.id}`);

      await fetchCategories();

      setDeleteModal(false);
      setSelectedCategory(null);

      showToast("Category deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to delete category");
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCategories = categories.filter((category) => category.status)
    .length;

  const inactiveCategories = categories.filter((category) => !category.status)
    .length;

  return (
    <div>
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Categories
          </h1>

          <p className="text-slate-500 mt-2">
            Organize products into clean inventory categories.
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
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Categories</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {categories.length}
              </h3>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
              <Layers3 className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {activeCategories}
              </h3>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Inactive</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {inactiveCategories}
              </h3>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
              <XCircle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Category List
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Manage active and inactive product categories.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-100 rounded-2xl px-4 py-3 w-full lg:w-80">
              <Search className="text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search categories..."
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
                  Category
                </th>
                <th className="text-left p-4 font-semibold text-slate-700">
                  Status
                </th>
                <th className="text-left p-4 font-semibold text-slate-700">
                  Created
                </th>
                <th className="text-left p-4 font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-t border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-100">
                          <Layers3 size={22} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {category.name}
                          </h3>
                          <p className="text-sm text-slate-500 mt-1">
                            Category ID: #{category.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          category.status
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {category.status ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="p-4 text-slate-600">
                      {new Date(category.created_at).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => handleDeleteClick(category)}
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
                  <td colSpan="4" className="text-center py-20">
                    <Layers3
                      className="mx-auto text-slate-400 mb-3"
                      size={42}
                    />
                    <h3 className="text-xl font-semibold text-slate-800">
                      No Categories Found
                    </h3>
                    <p className="text-slate-500 mt-2">
                      Add your first category to continue.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={isEdit ? "Edit Category" : "Add Category"}
        subtitle="Create categories to organize your product inventory."
        width="max-w-xl"
      >
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-[28px] p-6 border border-slate-100">
            <InputField
              label="Category Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter category name"
              required
            />

            <label className="flex items-center gap-3 mt-6">
              <input
                type="checkbox"
                checked={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.checked })
                }
                className="w-5 h-5"
              />

              <span className="text-slate-700 font-semibold">
                Active Category
              </span>
            </label>
          </div>

          <button
            onClick={handleAddOrUpdateCategory}
            className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition-all shadow-lg shadow-blue-200"
          >
            {isEdit ? "Update Category" : "Save Category"}
          </button>
        </div>
      </Modal>

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Category"
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
              {selectedCategory?.name}
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

      {toast.show && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-5 py-4 rounded-2xl shadow-xl flex items-center gap-3 z-[100]">
          <CheckCircle2 size={22} />
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default Categories;