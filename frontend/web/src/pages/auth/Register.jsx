import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { registerApi } from "../../api/auth";
import HeroLeftContent from "../../components/HeroLeftContent";

import {
  ArrowRight,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clientType, setClientType] = useState("PRIVATE");
  const [orgName, setOrgName] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = { name, email, password, clientType };

      if (clientType === "PUBLIC") {
        payload.departmentName = orgName;
        payload.officialEmail = officialEmail;
      }

      await registerApi(payload);
      setSuccess("Account created successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Left Side - Hero Content */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-teal-500/20 rounded-full blur-[120px]" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 w-full h-full flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-lg">
            <HeroLeftContent hideCTA={true} />
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-4 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </Link>
          </div>

          {/* Form Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white">Create Account</h1>
              <p className="text-slate-400 mt-2">Register as a private customer or government user</p>
            </div>

            {/* Error/Success Alerts */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 text-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3"
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 text-sm bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-4 py-3"
                >
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name & Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                  <input
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              {/* Client Type Toggle */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Account Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setClientType("PRIVATE")}
                    className={`px-4 py-4 rounded-xl border font-medium transition-all flex items-center justify-center gap-2 ${
                      clientType === "PRIVATE"
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                        : "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    Private
                  </button>

                  <button
                    type="button"
                    onClick={() => setClientType("PUBLIC")}
                    className={`px-4 py-4 rounded-xl border font-medium transition-all flex items-center justify-center gap-2 ${
                      clientType === "PUBLIC"
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                        : "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    Government
                  </button>
                </div>
              </div>

              {/* Government Fields */}
              {clientType === "PUBLIC" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Department</label>
                    <input
                      placeholder="Department Name"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      required
                      className="w-full px-4 py-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Official Email</label>
                    <input
                      type="email"
                      placeholder="official@gov.in"
                      value={officialEmail}
                      onChange={(e) => setOfficialEmail(e.target.value)}
                      required
                      className="w-full px-4 py-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <>
                    Create Account <ArrowRight size={20} />
                  </>
                )}
              </motion.button>

              {/* Government Note */}
              {clientType === "PUBLIC" && (
                <p className="text-xs text-center text-amber-400">
                  Government accounts require verification before activation.
                </p>
              )}
            </form>

            {/* Login Link */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-center text-slate-400">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
