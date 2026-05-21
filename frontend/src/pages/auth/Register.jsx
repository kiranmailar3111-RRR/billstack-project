import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, UserCog, Sparkles } from "lucide-react";
import api from "../../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "Admin",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert("Name, email and password are required");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/register", formData);

      localStorage.setItem("billstack_auth", "true");
      localStorage.setItem("billstack_token", response.data.token);
      localStorage.setItem("billstack_user", JSON.stringify(response.data.user));
      localStorage.setItem("billstack_role", response.data.user.role);

      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">BillStack</h1>
            <p className="text-blue-100 text-sm">Start your SaaS journey</p>
          </div>
        </div>

        <div>
          <h2 className="text-5xl font-bold leading-tight">
            Create your billing workspace in minutes.
          </h2>
          <p className="text-blue-100 text-lg mt-6 max-w-xl">
            Manage products, customers, invoices, reports, GST and stock with a
            clean modern dashboard.
          </p>
        </div>

        <div className="bg-white/10 rounded-[32px] p-6">
          <p className="text-blue-100 text-sm">Portfolio Level Project</p>
          <h3 className="text-3xl font-bold mt-2">
            React + Laravel + MySQL
          </h3>
        </div>
      </div>

      <div className="flex items-center justify-center p-5">
        <div className="w-full max-w-md bg-white rounded-[32px] shadow-sm border border-slate-200 p-8">
          <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-5">
              <User size={26} />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Create account
            </h1>
            <p className="text-slate-500 mt-2">
              Register and start using BillStack.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 h-14 border border-slate-200 bg-slate-50 rounded-2xl px-4 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
              <User className="text-slate-400" size={20} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="outline-none w-full bg-transparent"
              />
            </div>

            <div className="flex items-center gap-3 h-14 border border-slate-200 bg-slate-50 rounded-2xl px-4 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
              <Mail className="text-slate-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="outline-none w-full bg-transparent"
              />
            </div>

            <div className="flex items-center gap-3 h-14 border border-slate-200 bg-slate-50 rounded-2xl px-4 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
              <Lock className="text-slate-400" size={20} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="outline-none w-full bg-transparent"
              />
            </div>

            <div className="flex items-center gap-3 h-14 border border-slate-200 bg-slate-50 rounded-2xl px-4 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
              <Phone className="text-slate-400" size={20} />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="outline-none w-full bg-transparent"
              />
            </div>

            <div className="flex items-center gap-3 h-14 border border-slate-200 bg-slate-50 rounded-2xl px-4 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
              <UserCog className="text-slate-400" size={20} />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="outline-none w-full bg-transparent"
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Customer">Customer</option>
              </select>
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-2xl font-semibold shadow-lg shadow-blue-200"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;