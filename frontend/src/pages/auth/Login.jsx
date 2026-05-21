import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, LogIn, Sparkles } from "lucide-react";
import api from "../../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      alert("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/login", formData);

      localStorage.setItem("billstack_auth", "true");
      localStorage.setItem("billstack_token", response.data.token);
      localStorage.setItem("billstack_user", JSON.stringify(response.data.user));
      localStorage.setItem("billstack_role", response.data.user.role);

      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex bg-gradient-to-br from-slate-950 to-slate-800 text-white p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">BillStack</h1>
            <p className="text-slate-400 text-sm">Inventory Billing SaaS</p>
          </div>
        </div>

        <div>
          <h2 className="text-5xl font-bold leading-tight">
            Manage billing, GST, stock and invoices in one place.
          </h2>
          <p className="text-slate-400 text-lg mt-6 max-w-xl">
            A modern React + Laravel SaaS dashboard for small business billing
            and inventory management.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-3xl p-5">
            <p className="text-3xl font-bold">GST</p>
            <p className="text-slate-400 text-sm mt-1">Invoice ready</p>
          </div>
          <div className="bg-white/10 rounded-3xl p-5">
            <p className="text-3xl font-bold">Stock</p>
            <p className="text-slate-400 text-sm mt-1">Auto reduce</p>
          </div>
          <div className="bg-white/10 rounded-3xl p-5">
            <p className="text-3xl font-bold">API</p>
            <p className="text-slate-400 text-sm mt-1">Laravel backend</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-5">
        <div className="w-full max-w-md bg-white rounded-[32px] shadow-sm border border-slate-200 p-8">
          <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-5">
              <LogIn size={26} />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-500 mt-2">
              Login to manage your BillStack account.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <div className="mt-2 flex items-center gap-3 h-14 border border-slate-200 bg-slate-50 rounded-2xl px-4 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                <Mail className="text-slate-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@test.com"
                  className="outline-none w-full bg-transparent"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Password
              </label>

              <div className="mt-2 flex items-center gap-3 h-14 border border-slate-200 bg-slate-50 rounded-2xl px-4 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                <Lock className="text-slate-400" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="123456"
                  className="outline-none w-full bg-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline font-semibold"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
            >
              <LogIn size={20} />
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-blue-600 font-semibold">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;