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
  ArrowRight,
  Star,
} from "lucide-react";

import { fadeInVariants, containerVariants } from "../../utils/animations";

import LayoutContainer from "../../components/LayoutContainer";
import gemLogo from "../../assets/images/gem_logo.webp";
import genuineProducts from "../../assets/images/genuine.png";

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

  const cardBase =
    "bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 flex flex-col justify-between min-h-[200px] shadow-md hover:shadow-xl transition-all duration-300";

  return (
    <LayoutContainer>
      <motion.div
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
        <Helmet>
          <title>{hero.seo.title}</title>
          <meta name="description" content={hero.seo.description} />
        </Helmet>

        {/* HERO */}
        <motion.section
          data-section
          className="min-h-[75vh] sm:min-h-[65vh] flex items-center bg-white dark:bg-slate-900 rounded-3xl mt-3 w-[95%] sm:w-[90%] max-w-7xl mx-auto overflow-hidden shadow-xl"
          variants={containerVariants}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-teal-100 to-emerald-100 dark:from-teal-900/20 dark:from-emerald-900/20 rounded-full blur-3xl opacity-50"></div>
          </div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-24 px-4 sm:px-6 py-8 sm:py-10 lg:p-12 min-h-full lg:min-h-[70vh] items-start overflow-hidden w-full">
            {/* LEFT - Content */}
            <motion.div className="flex flex-col items-center lg:items-start justify-start lg:justify-start text-center lg:text-left">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold mb-6"
              >
                <Star
                  size={14}
                  className="text-emerald-500"
                  fill="currentColor"
                />
                {hero.badge}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-slate-800 dark:text-white leading-[1.1]"
              >
                {hero.heading}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 max-w-xl text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed"
              >
                {hero.subText}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 sm:gap-5 w-full items-center justify-center lg:justify-start"
              >
                <Link
                  to="/products"
                  className="group inline-flex items-center gap-2 px-7 py-4 sm:px-8 sm:py-4.5 rounded-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto justify-center"
                >
                  <PackageSearch size={20} />
                  Browse Products
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>

                <Link
                  to="/services"
                  className="group inline-flex items-center gap-2 px-7 py-4 sm:px-8 sm:py-4.5 rounded-xl font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300 w-full sm:w-auto justify-center"
                >
                  <Wrench size={20} />
                  Explore Services
                </Link>
              </motion.div>
            </motion.div>

            {/* RIGHT - Feature Cards */}
            <motion.div
              className="hidden lg:flex flex-col items-start"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="relative w-full max-w-md lg:max-w-lg space-y-5 mt-16 lg:mt-24">
                {/* Trust Badge */}
                <img
                  src={clientType === "PUBLIC" ? gemLogo : genuineProducts}
                  alt="Trust badge"
                  className="absolute -top-16 right-0 w-24 object-contain opacity-90 z-10"
                />

                <motion.div
                  className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-l-4 border-l-emerald-500 shadow-lg"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <PackageSearch
                        className="text-emerald-600 dark:text-emerald-400"
                        size={24}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-white text-lg">
                        {clientType === "PUBLIC"
                          ? "Government Procurement"
                          : "Quality Products"}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {clientType === "PUBLIC"
                          ? "GeM compliant purchasing"
                          : "Genuine products with warranty"}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {clientType === "PUBLIC"
                      ? "Structured listings and enquiry-driven procurement."
                      : "Browse categories, compare prices, and shop with confidence."}
                  </p>
                </motion.div>

                <motion.div
                  className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-l-4 border-l-teal-500 shadow-lg"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                      <Wrench
                        className="text-teal-600 dark:text-teal-400"
                        size={24}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-white text-lg">
                        Professional Services
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Installation, Repairs & AMC
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Expert-led installation, maintenance, and SLA-backed
                    support.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* BRAND TRUST STRIP - Full Width Below Hero */}
        <div className="w-full">
          <BrandTrustStrip clientType={clientType} />
        </div>

        {/* QUICK ACCESS */}
        <motion.section
          data-section
          className="bg-white dark:bg-slate-900 rounded-3xl w-[90%] max-w-7xl mx-auto mt-6 py-12 sm:py-16 shadow-xl"
          variants={containerVariants}
        >
          <div className="text-center mb-10 px-4">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold mb-4"
            >
              Quick Access
            </motion.span>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-600"
            >
              Continue Where You Left Off
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-2 text-slate-600 dark:text-slate-400"
            >
              Shortcuts tailored to your account & activity
            </motion.p>
          </div>

          <RoleGate allow={["PRIVATE"]}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto mb-16 px-4 sm:px-0">
              <motion.div whileHover={{ y: -4 }} className={cardBase}>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                    <ShoppingCart
                      className="text-emerald-600 dark:text-emerald-400"
                      size={24}
                    />
                  </div>
                  <h4 className="font-bold text-lg text-slate-800 dark:text-white mb-2">
                    Shopping Cart
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    View and manage your selected items
                  </p>
                </div>
                <Link
                  to="/cart"
                  className="mt-6 inline-flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all"
                >
                  View Cart →
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -4 }} className={cardBase}>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-4">
                    <ClipboardList
                      className="text-teal-600 dark:text-teal-400"
                      size={24}
                    />
                  </div>
                  <h4 className="font-bold text-lg text-slate-800 dark:text-white mb-2">
                    My Orders
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Track your orders and history
                  </p>
                </div>
                <Link
                  to="/orders"
                  className="mt-6 inline-flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all"
                >
                  My Orders →
                </Link>
              </motion.div>
            </div>
          </RoleGate>

          <RoleGate allow={["PUBLIC"]}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto mb-16 px-4 sm:px-0">
              <motion.div whileHover={{ y: -4 }} className={cardBase}>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                    <Inbox
                      className="text-emerald-600 dark:text-emerald-400"
                      size={24}
                    />
                  </div>
                  <h4 className="font-bold text-lg text-slate-800 dark:text-white mb-2">
                    My Enquiries
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Track your procurement requests
                  </p>
                </div>
                <Link
                  to="/enquiries"
                  className="mt-6 inline-flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all"
                >
                  View Enquiries →
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -4 }} className={cardBase}>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-4">
                    <Quote
                      className="text-teal-600 dark:text-teal-400"
                      size={24}
                    />
                  </div>
                  <h4 className="font-bold text-lg text-slate-800 dark:text-white mb-2">
                    My Quotes
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Review received quotations
                  </p>
                </div>
                <Link
                  to="/quotes"
                  className="mt-6 inline-flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all"
                >
                  View Quotes →
                </Link>
              </motion.div>
            </div>
          </RoleGate>

          <div className="mt-16 sm:mt-20">
            <motion.h4
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xl font-bold text-center mb-6 flex items-center justify-center gap-2 text-emerald-600"
            >
              <Wrench className="text-emerald-500" /> Service Management
            </motion.h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto px-4 sm:px-0">
              <motion.div whileHover={{ y: -4 }} className={cardBase}>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                    <Inbox
                      className="text-emerald-600 dark:text-emerald-400"
                      size={24}
                    />
                  </div>
                  <h5 className="font-semibold text-slate-800 dark:text-white mb-1">
                    My Service Enquiries
                  </h5>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Track submitted service requests and AMC calls.
                  </p>
                </div>
                <Link
                  to="/service-enquiries"
                  className="mt-6 inline-flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all"
                >
                  View Enquiries →
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -4 }} className={cardBase}>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-4">
                    <FileCheck
                      className="text-teal-600 dark:text-teal-400"
                      size={24}
                    />
                  </div>
                  <h5 className="font-semibold text-slate-800 dark:text-white mb-1">
                    My Service Quotes
                  </h5>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Review quotations & service pricing proposals.
                  </p>
                </div>
                <Link
                  to="/service-quotes"
                  className="mt-6 inline-flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all"
                >
                  View Quotes →
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </LayoutContainer>
  );
}
