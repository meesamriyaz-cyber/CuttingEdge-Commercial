import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Building2,
  ClipboardCheck,
  LifeBuoy,
  PackageSearch,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { registerApi } from "../../api/auth";
import HeroLeftContent from "../../components/HeroLeftContent";
import { Button, Input } from "../../components/ui";
import {
  authPageVariants,
  heroSideVariants,
  formSideVariants,
} from "../../utils/animations";

const ACCOUNT_TYPES = [
  {
    id: "PRIVATE",
    title: "Private customer",
    description: "Cart, checkout, orders, wishlist, and post-purchase support.",
    icon: UserRound,
  },
  {
    id: "PUBLIC",
    title: "Government customer",
    description: "Procurement enquiries, quotations, and institutional workflow tracking.",
    icon: Building2,
  },
];

const SETUP_POINTS = [
  {
    icon: PackageSearch,
    label: "Catalogue",
    text: "Products and categories",
  },
  {
    icon: ClipboardCheck,
    label: "Workflow",
    text: "Orders or quotations",
  },
  {
    icon: LifeBuoy,
    label: "Support",
    text: "Services and follow-up",
  },
];

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

      const data = await registerApi(payload);
      const emailNeedsResend =
        clientType === "PUBLIC" && data.emailDelivery?.sent === false;

      setSuccess(
        emailNeedsResend
          ? "Account created, but the verification email could not be delivered. Sign in and use Resend code on the verification screen."
          : "Account created successfully. Redirecting to sign in...",
      );
      setTimeout(() => navigate("/login"), emailNeedsResend ? 3200 : 1800);
    } catch (err) {
      const deliveryError = err.payload?.emailDelivery?.error;
      setError(
        deliveryError
          ? `${err.message} Reason: ${deliveryError}`
          : err.message || "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Motion.div
      className="flex min-h-[calc(100vh-4rem)] items-center bg-page px-4 py-8 sm:px-6 sm:py-10"
      variants={authPageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="hero-shell overflow-hidden rounded-lg p-2 shadow-[0_28px_64px_-44px_rgba(8,16,29,0.48)] sm:p-3">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.02fr_0.98fr]">
            <Motion.div
              variants={heroSideVariants}
              className="hidden rounded-lg tech-panel px-8 py-10 lg:block"
            >
              <HeroLeftContent hideCTA />
            </Motion.div>

            <Motion.div variants={formSideVariants}>
              <div className="theme-card rounded-lg p-6 sm:p-8 lg:p-10">
                <div className="mb-7">
                  <div className="signal-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    <ShieldCheck size={13} />
                    Account setup
                  </div>

                  <div className="mt-5">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                      Create your account
                    </h1>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      Choose the workflow that fits your organization and get access to products, services, and the right post-login experience.
                    </p>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <Motion.div
                      className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-200"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {error}
                    </Motion.div>
                  )}

                  {success && (
                    <Motion.div
                      className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-200"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {success}
                    </Motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {ACCOUNT_TYPES.map((type) => {
                      const Icon = type.icon;
                      const active = clientType === type.id;

                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setClientType(type.id)}
                          className={`auth-mode-tile ${active ? "auth-mode-tile-active" : ""}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-cyan-500 dark:text-slate-950">
                              <Icon size={18} />
                            </div>
                            <span
                              className={`mt-1 h-2.5 w-2.5 rounded-full ${
                                active ? "bg-cyan-600 dark:bg-cyan-300" : "bg-slate-300 dark:bg-slate-700"
                              }`}
                            />
                          </div>
                          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                            {type.title}
                          </h2>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {type.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="panel-muted space-y-4 p-4 sm:p-5">
                    <div className="grid gap-4 sm:grid-cols-2">
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

                    <Input
                      label="Password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {clientType === "PUBLIC" && (
                    <div className="panel-muted space-y-4 p-4 sm:p-5">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                          Procurement contact details
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          Used for verification and quotation communication after registration.
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
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
                          placeholder="name@department.gov.in"
                          value={officialEmail}
                          onChange={(e) => setOfficialEmail(e.target.value)}
                          helperText="Use a department-issued government email. Public mailboxes such as Gmail, Yahoo, and Outlook are not accepted."
                          required
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    isLoading={loading}
                    className="w-full"
                  >
                    Create Account
                    {!loading && <ArrowRight size={16} />}
                  </Button>

                  {clientType === "PUBLIC" && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Government accounts require an approved official domain and email code verification before procurement features are enabled.
                    </p>
                  )}

                  <div className="grid gap-3 sm:grid-cols-3">
                    {SETUP_POINTS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="auth-access-tile">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                            <Icon size={16} className="text-cyan-700 dark:text-cyan-300" />
                            {item.label}
                          </div>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {item.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </form>

                <div className="mt-7 border-t border-slate-200/80 pt-5 dark:border-slate-800">
                  <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                    Already registered?{" "}
                    <Link
                      to="/login"
                      className="font-semibold text-cyan-700 transition-colors hover:text-orange-600 dark:text-cyan-300 dark:hover:text-orange-300"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </Motion.div>
          </div>
        </div>
      </div>
    </Motion.div>
  );
}
