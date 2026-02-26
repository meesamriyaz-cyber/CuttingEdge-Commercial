import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyGovtCodeApi } from "../../api/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  cardHoverVariants,
  containerVariants,
  heroTextVariants,
} from "../../utils/animations";
import { useAuthStore } from "../../store/authStore";

export default function PostLoginVerification() {
  const navigate = useNavigate();
  const { user, updateUser, setSession } = useAuthStore(); 


  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const data = await verifyGovtCodeApi({ code });
     updateUser(data.user);
    navigate("/enquiries", { replace: true });
  } catch (err) {
    setError(err.message || "Verification failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <motion.div
      className="min-h-screen bg-surface flex items-center justify-center px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="relative theme-card backdrop-blur-2xl border border-white/30
                     rounded-3xl shadow-2xl p-8"
          variants={cardHoverVariants}
          whileHover="hover"
        >
          {/* Header */}
          <motion.div className="text-center mb-6">
            <motion.h2
              className="text-2xl font-bold bg-gradient-to-r
                         from-indigo-600 via-cyan-600 to-pink-600
                         bg-clip-text text-transparent"
              variants={heroTextVariants}
            >
              Complete Account Verification
            </motion.h2>
            <p className="text-sm text-slate-600 mt-2">
              Enter the verification code sent to your official email
            </p>
          </motion.div>

          {/* Alerts */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="mb-4 text-sm text-red-700 bg-red-100
                           border border-red-200 rounded-lg px-4 py-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                className="mb-4 text-sm text-green-700 bg-green-100
                           border border-green-200 rounded-lg px-4 py-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={user?.officialEmail || user?.email}
                readOnly
                className="w-full px-4 py-2 bg-slate-100 border rounded-lg
                           text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Verification Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                required
                className="w-full px-4 py-2 border rounded-lg text-sm"
                placeholder="Enter 6-digit code"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg font-semibold
                         bg-indigo-600 text-white hover:bg-indigo-700
                         transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Complete Verification"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-slate-600">
            Didn’t receive the code?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-semibold text-indigo-600 hover:underline"
            >
              Logout
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
