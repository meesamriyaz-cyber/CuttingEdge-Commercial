import useSnapNavigation from "../../hooks/useSnapNavigation";
import { useAuthStore } from "../../store/authStore";
import RoleGate from "../../components/RoleGate";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import BrandTrustStrip from "../../components/BrandTrustStrip";

import {
  ShoppingCart,
  PackageSearch,
  ClipboardList,
  Wrench,
  Quote,
  Inbox,
  FileCheck,
} from "lucide-react";

import { fadeInVariants, containerVariants } from "../../utils/animations";

import LayoutContainer from "../../components/LayoutContainer";
import gemLogo from "../../assets/images/gem_logo.webp";
import genuineProducts from "../../assets/images/genuine.png";

/* ---------------- HERO CONTENT ---------------- */

const HERO_CONTENT = {
  PUBLIC: {
    badge: "Government & Institutional Procurement",
    heading: "Compliant Procurement & Professional Services",
    subText:
      "Procure products, manage quotations, and request professional services — aligned with government norms and institutional requirements.",
    seo: {
      title:
        "Government Procurement & Institutional Services | Cutting Edge Enterprises",
      description:
        "Trusted partner for government procurement, institutional IT supply, professional services, compliant quotations, and structured delivery.",
    },
  },

  PRIVATE: {
    badge: "Business & Individual Solutions",
    heading: "Shopping & Professional Services Made Simple",
    subText:
      "Buy genuine products, Book service requests — trusted by individuals and growing businesses.",
    seo: {
      title: "Buy Products & Professional Services | Cutting Edge Enterprises",
      description:
        "Shop genuine products, manage orders, request quotations, and access professional services for businesses and individuals.",
    },
  },

  DEFAULT: {
    badge: "Unified Commerce Platform",
    heading: "Products, Quotations & Professional Services",
    subText:
      "A trusted platform to purchase products, manage quotations, and deliver professional services for private and government clients.",
    seo: {
      title:
        "Products, Quotations & Professional Services | Cutting Edge Enterprises",
      description:
        "Unified platform for product procurement, quotation management, and professional services for private and government customers.",
    },
  },
};

export default function Home() {
  const user = useAuthStore((state) => state.user);
  const clientType = user?.clientType;
  const hero = HERO_CONTENT[clientType] || HERO_CONTENT.DEFAULT;
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.roles?.includes("admin") && !user.clientType) {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  useSnapNavigation();

  /* ---------------- QUICK ACCESS CARD BASE ---------------- */

  const cardBase = `
    theme-card rounded-3xl bg-surface
    border border-white/40 shadow-lg
    p-4 sm:p-6
    flex flex-col justify-between
    min-h-[200px] sm:min-h-[220px]
    transition-transform
    active:scale-[0.98]
  `;

  return (
    <LayoutContainer>
      <motion.div
        className="space-y-14"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
        <Helmet>
          <title>{hero.seo.title}</title>
          <meta name="description" content={hero.seo.description} />
        </Helmet>

        {/* ================= HERO ================= */}
        <motion.section
          data-section
          className="
           min-h-[100svh] sm:min-h-[80svh] lg:min-h-screen
          flex items-center lg:items-center
          theme-card bg-surface
          rounded-3xl border border-white/30 shadow-2xl
          mt-3
          w-[95%] sm:w-[90%] max-w-7xl mx-auto
          snap-center lg:snap-start
          "
          variants={containerVariants}
        >
          <div
            className="grid lg:grid-cols-2 gap-8 lg:gap-12
  px-6 py-10 sm:px-8 sm:py-12 lg:p-16
  min-h-full lg:min-h-[80vh]"
          >
            {/* LEFT */}
            <motion.div
              className="flex flex-col items-center
  justify-center lg:justify-center
  text-center"
            >
              <span className="hero-gradient-badge px-4 py-2 rounded-full text-xs font-semibold uppercase shadow-sm">
                {hero.badge}
              </span>

              <h1
                className="mt-6
  text-3xl sm:text-4xl md:text-5xl lg:text-6xl
  font-extrabold hero-gradient-text
  leading-tight"
              >
                {hero.heading}
              </h1>

              <p className="mt-4 sm:mt-6 max-w-xl text-base sm:text-lg text-slate-600 leading-relaxed">
                {hero.subText}
              </p>

              <div
                className=" mt-8 sm:mt-10
  flex flex-col sm:flex-row
  gap-4 sm:gap-5
  w-full items-center justify-center"
              >
                <Link
                  to="/products"
                  className="btn-theme-primary animate-gradient
px-7 py-4 sm:px-8 sm:py-4.5
rounded-xl font-semibold
flex items-center gap-2 w-full sm:w-auto justify-center text-base"
                >
                  <PackageSearch size={20} />
                  Browse Products
                </Link>

                <Link
                  to="/services"
                  className="btn-theme-primary animate-gradient
px-7 py-4 sm:px-8 sm:py-4.5
rounded-xl font-semibold
flex items-center gap-2 w-full sm:w-auto justify-center text-base"
                >
                  <Wrench size={20} />
                  Explore Services
                </Link>
              </div>

              <div className="mt-8">
                <BrandTrustStrip clientType={clientType} />
              </div>
            </motion.div>

            {/* RIGHT — RESTORED COMPLETELY */}
            <motion.div
              className="hidden lg:flex relative items-center justify-center"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
            >
              {/* Trust Badge */}
              <img
                src={clientType === "PUBLIC" ? gemLogo : genuineProducts}
                alt="Trust badge"
                className="absolute top-0 right-0 w-28 object-contain opacity-90"
              />

              <div className="relative w-full max-w-md space-y-8">
                {/* PROCUREMENT CARD */}
                <motion.div
                  className="theme-card rounded-3xl bg-surface border border-white/40 shadow-lg p-6"
                  whileHover={{ y: -6, scale: 1.02 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                      <PackageSearch className="text-indigo-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold hero-gradient-text text-base leading-tight">
                        {clientType === "PUBLIC"
                          ? "Government Procurement"
                          : "Individual and Enterprise Procurement"}
                      </h4>
                      <p className="text-sm text-slate-500">
                        {clientType === "PUBLIC"
                          ? "GeM compliant institutional purchasing"
                          : "Diverse products with competitive pricing"}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600">
                    {clientType === "PUBLIC"
                      ? "Structured listings and enquiry-driven procurement."
                      : "Product purchases and order management."}
                  </p>
                </motion.div>

                {/* SERVICES CARD */}
                <motion.div
                  className="theme-card rounded-3xl bg-surface border border-white/40 shadow-lg p-6"
                  whileHover={{ y: -6, scale: 1.02 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <Wrench className="text-emerald-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold hero-gradient-text text-base leading-tight">
                        Installation, Repairs & AMC
                      </h4>
                      <p className="text-sm text-slate-500">
                        Services for products & enterprise solutions
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600">
                    Expert-led installation, maintenance, and SLA-backed
                    support.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ================= QUICK ACCESS ================= */}
        <motion.section
          data-section
          className="
            min-h-screen
            theme-card bg-surface border border-white/30
            rounded-3xl backdrop-blur-2xl shadow-2xl
            w-[90%] max-w-7xl mx-auto mt-6
            py-12 sm:py-20
            snap-center lg:snap-start
          "
          variants={containerVariants}
        >
          <div className="text-center mb-10">
            <span className="hero-gradient-badge px-3 py-1 rounded-full text-xs font-semibold uppercase shadow-sm">
              Quick Access Panel
            </span>

            <h3 className="mt-4 text-3xl md:text-4xl font-extrabold hero-gradient-text">
              Continue Where You Left Off
            </h3>

            <p className="mt-2 text-slate-600">
              Shortcuts tailored to your account & activity
            </p>
          </div>

          {/* PRIVATE */}
          <RoleGate allow={["PRIVATE"]}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto mb-16 px-4 sm:px-0">
              <div className={cardBase}>
                <div>
                  <ShoppingCart className="text-indigo-500 mb-3" />
                  <h4 className="font-bold text-lg mb-2">Shopping Cart</h4>
                </div>
                <Link
                  to="/cart"
                  className="btn-theme-primary px-5 py-2 rounded-xl font-semibold self-start"
                >
                  View Cart →
                </Link>
              </div>

              <div className={cardBase}>
                <div>
                  <ClipboardList className="text-indigo-500 mb-3" />
                  <h4 className="font-bold text-lg mb-2">My Orders</h4>
                </div>
                <Link
                  to="/orders"
                  className="btn-theme-primary px-5 py-2 rounded-xl font-semibold self-start"
                >
                  My Orders →
                </Link>
              </div>
            </div>
          </RoleGate>

          {/* PUBLIC */}
          <RoleGate allow={["PUBLIC"]}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto mb-16 px-4 sm:px-0">
              <div className={cardBase}>
                <div>
                  <Inbox className="text-indigo-500 mb-3" />
                  <h4 className="font-bold text-lg mb-2">My Enquiries</h4>
                </div>
                <Link
                  to="/enquiries"
                  className="btn-theme-primary px-5 py-2 rounded-xl font-semibold self-start"
                >
                  View Enquiries →
                </Link>
              </div>

              <div className={cardBase}>
                <div>
                  <Quote className="text-indigo-500 mb-3" />
                  <h4 className="font-bold text-lg mb-2">My Quotes</h4>
                </div>
                <Link
                  to="/quotes"
                  className="btn-theme-primary px-5 py-2 rounded-xl font-semibold self-start"
                >
                  View Quotes →
                </Link>
              </div>
            </div>
          </RoleGate>

          {/* SERVICE MANAGEMENT */}
          <div className="mt-16 sm:mt-20">
            <h4 className="text-xl font-bold text-center mb-4 sm:mb-6 flex items-center justify-center gap-2">
              <Wrench className="text-indigo-500" />
              Service Management
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto px-4 sm:px-0">
              <div className={cardBase}>
                <div>
                  <Inbox className="text-indigo-500 mb-2" />
                  <h5 className="font-semibold mb-1">My Service Enquiries</h5>
                  <p className="text-sm text-slate-600">
                    Track submitted service requests and AMC calls.
                  </p>
                </div>
                <Link
                  to="/service-enquiries"
                  className="btn-theme-primary px-4 py-2 rounded-xl font-semibold self-start"
                >
                  View Enquiries →
                </Link>
              </div>

              <div className={cardBase}>
                <div>
                  <FileCheck className="text-indigo-500 mb-2" />
                  <h5 className="font-semibold mb-1">My Service Quotes</h5>
                  <p className="text-sm text-slate-600">
                    Review quotations & service pricing proposals.
                  </p>
                </div>
                <Link
                  to="/service-quotes"
                  className="btn-theme-primary px-4 py-2 rounded-xl font-semibold self-start"
                >
                  View Quotes →
                </Link>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </LayoutContainer>
  );
}
