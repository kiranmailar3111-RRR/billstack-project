import { Link } from "react-router-dom";
import { Mail, Sparkles } from "lucide-react";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen bg-[#f5f7fb] grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex bg-gradient-to-br from-slate-950 to-slate-800 text-white p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">BillStack</h1>
            <p className="text-slate-400 text-sm">Secure account recovery</p>
          </div>
        </div>

        <div>
          <h2 className="text-5xl font-bold leading-tight">
            Reset access to your billing workspace.
          </h2>
          <p className="text-slate-400 text-lg mt-6">
            Enter your registered email and continue your account recovery flow.
          </p>
        </div>

        <div className="bg-white/10 rounded-[32px] p-6">
          <p className="text-slate-400 text-sm">Secure SaaS Flow</p>
          <h3 className="text-3xl font-bold mt-2">Password Recovery</h3>
        </div>
      </div>

      <div className="flex items-center justify-center p-5">
        <div className="w-full max-w-md bg-white rounded-[32px] shadow-sm border border-slate-200 p-8">
          <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-5">
              <Mail size={26} />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Forgot Password
            </h1>
            <p className="text-slate-500 mt-2">
              Enter your email to receive reset instructions.
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
                  placeholder="Enter email address"
                  className="outline-none w-full bg-transparent"
                />
              </div>
            </div>

            <button className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold shadow-lg shadow-blue-200">
              Send Reset Link
            </button>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Back to{" "}
            <Link to="/login" className="text-blue-600 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;