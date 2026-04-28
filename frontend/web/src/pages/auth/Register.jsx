import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { registerApi } from "../../api/auth";

import HeroLeftContent from "../../components/HeroLeftContent";
import { Button, Input } from "../../components/ui";

import {
  authPageVariants,
  heroSideVariants,
  formSideVariants,
} from "../../utils/animations";
import { Building2, UserRound, ShieldCheck } from "lucide-react";

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
      className="min-h-screen bg-slate-50 dark:bg-[#07111f] text-text flex items-center justify-center px-4 sm:px-6 py-10"
      variants={authPageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
        {/* HERO */}
        <motion.div variants={heroSideVariants} className="hidden lg:block">
          <HeroLeftContent hideCTA />
        </motion.div>

        {/* FORM */}
        <motion.div className="flex justify-center lg:justify-end" variants={formSideVariants}>
          <motion.div
            className="
              w-full max-w-md
              tech-panel
              rounded-lg
              shadow-sm
              p-6 sm:p-8
            "
          >
            <div className="mb-7">
              <div className="signal-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide mb-4">
                <ShieldCheck size={13} />
                Create account
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-950 dark:bg-cyan-500 rounded-lg shadow-sm mb-5">
                <UserRound className="w-6 h-6 text-white dark:text-slate-950" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Create your account
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Set up your access and choose the account type that matches your organization.
              </p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  className="mt-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="rounded-lg border border-slate-200 dark:border-cyan-950/50 bg-white/70 dark:bg-slate-950/40 p-4 sm:p-5">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Full name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              </div>

              <Input
                label="Password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* Client Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Account type
                </label>
                <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={clientType === "PRIVATE" ? "primary" : "secondary"}
                  onClick={() => setClientType("PRIVATE")}
                  className="justify-center min-h-14"
                >
                  <UserRound size={16} />
                  Private
                </Button>

                <Button
                  type="button"
                  variant={clientType === "PUBLIC" ? "primary" : "secondary"}
                  onClick={() => setClientType("PUBLIC")}
                  className="justify-center min-h-14"
                >
                  <Building2 size={16} />
                  Government
                </Button>
                </div>
              </div>

              {clientType === "PUBLIC" && (
                <div className="rounded-lg border border-cyan-200/60 dark:border-cyan-900/40 bg-cyan-50/70 dark:bg-cyan-950/20 p-4 sm:p-5">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Procurement contact details
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      These details are used for verification and quotation workflows.
                    </p>
                  </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Department / organization"
                    placeholder="Department / Organization"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    required
                  />
                  <Input
                    label="Official email"
                    type="email"
                    placeholder="Official Email"
                    value={officialEmail}
                    onChange={(e) => setOfficialEmail(e.target.value)}
                    required
                  />
                </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                isLoading={loading}
                className="w-full mt-2"
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>

              {clientType === "PUBLIC" && (
                <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                  Government accounts require verification before activation.
                </p>
              )}
            </form>

            <p className="mt-7 pt-5 border-t border-slate-200 dark:border-slate-700 text-sm text-center text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-orange-600">
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
