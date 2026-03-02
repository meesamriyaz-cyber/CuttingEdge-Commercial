import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { registerApi } from "../../api/auth";

import HeroLeftContent from "../../components/HeroLeftContent";

import {
  authPageVariants,
  heroSideVariants,
  formSideVariants,
  cardHoverVariants,
  buttonHoverVariants,
} from "../../utils/animations";

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
    <motion.div
      className="min-h-screen bg-surface text-text flex items-center justify-center px-6"
      variants={authPageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* HERO */}
        <motion.div variants={heroSideVariants}>
          <HeroLeftContent hideCTA />
        </motion.div>

        {/* FORM */}
        <motion.div className="flex justify-center" variants={formSideVariants}>
          <motion.div
            className="
              w-full max-w-md
              theme-card bg-surface
              rounded-3xl
              border border-white/40
              shadow-2xl
              p-8
            "
            variants={cardHoverVariants}
            whileHover="hover"
          >
            <h2 className="text-2xl font-bold text-center hero-gradient-text">
              Create your account
            </h2>

            <p className="text-sm text-center text-slate-600">
              Register as a private customer or government user
            </p>

            <AnimatePresence>
              {error && (
                <motion.div
                  className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  className="mt-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="theme-input w-full px-4 py-3 rounded-xl border-0 shadow-2xl"
                />
                <input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="theme-input w-full px-4 py-3 rounded-xl border-0 shadow-2xl"
                />
              </div>

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="theme-input w-full px-4 py-3 rounded-xl border-0 shadow-2xl"
              />

              {/* Client Type */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setClientType("PRIVATE")}
                  className={`
                    px-4 py-3 rounded-xl border font-medium
                    ${
                      clientType === "PRIVATE"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-white/40 bg-surface"
                    }
                  `}
                >
                  Private
                </button>

                <button
                  type="button"
                  onClick={() => setClientType("PUBLIC")}
                  className={`
                    px-4 py-3 rounded-xl border font-medium
                    ${
                      clientType === "PUBLIC"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-white/40 bg-surface"
                    }
                  `}
                >
                  Government
                </button>
              </div>

              {clientType === "PUBLIC" && (
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    placeholder="Department / Organization"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    required
                    className="theme-input px-4 py-3 rounded-xl border-0 shadow-2xl"
                  />
                  <input
                    placeholder="Official Email"
                    value={officialEmail}
                    onChange={(e) => setOfficialEmail(e.target.value)}
                    required
                    className="theme-input px-4 py-3 rounded-xl border-0 shadow-2xl"
                  />
                </div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3 btn-theme-primary rounded-xl font-semibold animate-gradient"
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {loading ? "Creating account..." : "Create Account"}
              </motion.button>

              {clientType === "PUBLIC" && (
                <p
                  className="
                    text-xs text-center italic
                    bg-gradient-to-r from-emerald-600 via-teal-600 to-teal-500
                    bg-clip-text text-transparent
                  "
                >
                  Government accounts require verification before activation.
                </p>
              )}
            </form>

            <p className="mt-6 text-sm text-center text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-emerald-600">
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
