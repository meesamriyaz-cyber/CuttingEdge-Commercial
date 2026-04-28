import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileCheck,
  Heart,
  Inbox,
  PackageSearch,
  Quote,
  ShieldCheck,
  ShoppingCart,
  Star,
  Wrench,
} from "lucide-react";

import { useAuthStore } from "../../store/authStore";
import BrandTrustStrip from "../../components/BrandTrustStrip";
import LayoutContainer from "../../components/LayoutContainer";
import { fadeInVariants, containerVariants } from "../../utils/animations";

import gemLogo from "../../assets/images/gem_logo.webp";
import genuineProducts from "../../assets/images/genuine.png";
import hpImage from "../../assets/images/hp.jpg";
import dellLogo from "../../assets/images/dell.png";
import officeNetworkImage from "../../assets/images/office-network.jpg";
import amcImage from "../../assets/images/amc.jpg";

const GUEST_HERO = {
  badge: "Unified Commerce Platform",
  heading: "Products, Quotations, and Professional Services",
  subText:
    "Browse products, discover services, and sign in to continue with the right workflow for your customer type.",
  seo: {
    title: "Products, Quotations, and Professional Services | Cutting Edge Enterprises",
    description:
      "Browse products, discover services, and continue with the right ordering or procurement workflow after sign-in.",
  },
};

const GUEST_OVERVIEW = [
  {
    title: "Product catalogue",
    text: "Browse 7+ active categories before choosing the right workflow.",
  },
  {
    title: "Private customers",
    text: "Continue with ecommerce ordering, cart, checkout, and order history after login.",
  },
  {
    title: "Government customers",
    text: "Continue with enquiry, quotation, and procurement tracking after login.",
  },
];

const PRODUCT_PREVIEWS = [
  {
    title: "Business Laptops and Desktops",
    description:
      "Reliable systems from trusted OEM brands for offices, schools, and departments.",
    image: hpImage,
    meta: "Genuine supply",
  },
  {
    title: "Printers, UPS, and Accessories",
    description:
      "Everyday IT essentials with clearer browsing, support, and post-sale coordination.",
    image: dellLogo,
    meta: "Category-led browsing",
  },
];

const SERVICE_PREVIEWS = [
  {
    title: "Network Installation",
    description:
      "Structured cabling, Wi-Fi, routers, switches, and secure office network setup.",
    image: officeNetworkImage,
    tags: ["Site survey", "Deployment", "Support"],
  },
  {
    title: "AMC and Maintenance",
    description:
      "Preventive maintenance and priority response for offices and institutions.",
    image: amcImage,
    tags: ["SLA support", "Repairs", "Reporting"],
  },
];

const GUEST_PROCESS_STEPS = [
  "Browse products or choose a service",
  "Sign in with the right account type",
  "Continue with ordering or enquiry workflow",
  "Track delivery, quotes, or service updates",
];

const CARD_TONES = {
  cyan: {
    iconBg: "bg-cyan-100 dark:bg-cyan-900/30",
    iconText: "text-cyan-700 dark:text-cyan-300",
    arrowText: "text-cyan-700 dark:text-cyan-300",
  },
  orange: {
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    iconText: "text-orange-700 dark:text-orange-300",
    arrowText: "text-orange-700 dark:text-orange-300",
  },
  emerald: {
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconText: "text-emerald-700 dark:text-emerald-300",
    arrowText: "text-emerald-700 dark:text-emerald-300",
  },
};

function getDashboardContent(user) {
  const firstName = user?.name?.trim()?.split(" ")[0] || "there";

  if (user?.clientType === "PUBLIC") {
    const isVerified = user.govtValidationStatus === "VERIFIED";

    return {
      badge: "Government procurement dashboard",
      heading: `Welcome back, ${firstName}`,
      description:
        "Manage catalogue browsing, procurement enquiries, quotations, and service requests from one workspace.",
      title: "Government Dashboard | Cutting Edge Enterprises",
      descriptionMeta:
        "Government customer dashboard for procurement browsing, enquiries, quotations, and service coordination.",
      primaryActions: [
        { label: "Browse categories", to: "/products" },
        { label: "My enquiries", to: "/enquiries", secondary: true },
      ],
      summary: [
        { label: "Account type", value: "Government customer" },
        { label: "Verification", value: isVerified ? "Verified" : "Pending review" },
        { label: "Primary flow", value: "Enquiries and quotations" },
      ],
      notice: isVerified
        ? null
        : "Verification is still pending. You can browse the catalogue now, and procurement actions will unlock after approval.",
      workspaceCards: [
        {
          title: "Browse categories",
          description:
            "Review products filtered for institutional procurement and continue from relevant product details.",
          to: "/products",
          icon: PackageSearch,
          eyebrow: "Catalogue",
          tone: "cyan",
        },
        {
          title: "My enquiries",
          description:
            "Track submitted requirements, updates, and responses from the procurement team.",
          to: "/enquiries",
          icon: Inbox,
          eyebrow: "Procurement",
          tone: "emerald",
        },
        {
          title: "My quotes",
          description:
            "Review issued quotations, compare responses, and continue the approval process.",
          to: "/quotes",
          icon: Quote,
          eyebrow: "Quotations",
          tone: "orange",
        },
      ],
      serviceCards: [
        {
          title: "Request service",
          description:
            "Open installation, AMC, repair, or support requests from the service catalogue.",
          to: "/services",
          icon: Wrench,
          eyebrow: "Service",
          tone: "orange",
        },
        {
          title: "Service enquiries",
          description:
            "See submitted service requirements and follow up on technician coordination.",
          to: "/service-enquiries",
          icon: Inbox,
          eyebrow: "Service tracking",
          tone: "emerald",
        },
        {
          title: "Service quotes",
          description:
            "Review service pricing proposals, approvals, and ongoing support coordination.",
          to: "/service-quotes",
          icon: FileCheck,
          eyebrow: "Service quotations",
          tone: "cyan",
        },
      ],
      workflow: [
        "Browse catalogue items relevant to your department",
        "Submit product enquiries from the product detail workflow",
        "Review quotations and continue service coordination from one dashboard",
      ],
    };
  }

  return {
    badge: "Private customer dashboard",
    heading: `Welcome back, ${firstName}`,
    description:
      "Continue shopping, review orders, and manage service requests from one workspace.",
    title: "Customer Dashboard | Cutting Edge Enterprises",
    descriptionMeta:
      "Private customer dashboard for product browsing, cart, orders, wishlist, and service support.",
    primaryActions: [
      { label: "Browse products", to: "/products" },
      { label: "View cart", to: "/cart", secondary: true },
    ],
    summary: [
      { label: "Account type", value: "Private customer" },
      { label: "Primary flow", value: "Ecommerce ordering" },
      { label: "Support", value: "Service requests and quotes" },
    ],
    notice: null,
    workspaceCards: [
      {
        title: "Browse products",
        description:
          "See the product categories and continue into the ecommerce catalogue built for private customers.",
        to: "/products",
        icon: PackageSearch,
        eyebrow: "Catalogue",
        tone: "cyan",
      },
      {
        title: "Shopping cart",
        description:
          "Continue from saved items and move directly into checkout when you are ready.",
        to: "/cart",
        icon: ShoppingCart,
        eyebrow: "Checkout",
        tone: "orange",
      },
      {
        title: "My orders",
        description:
          "Track placed orders, invoices, delivery status, and previous purchase history.",
        to: "/orders",
        icon: ClipboardList,
        eyebrow: "Orders",
        tone: "emerald",
      },
      {
        title: "Wishlist",
        description:
          "Keep shortlisted items ready for later review and faster repeat browsing.",
        to: "/wishlist",
        icon: Heart,
        eyebrow: "Saved items",
        tone: "cyan",
      },
    ],
    serviceCards: [
      {
        title: "Request service",
        description:
          "Open installation, AMC, repair, or support requests from the service catalogue.",
        to: "/services",
        icon: Wrench,
        eyebrow: "Service",
        tone: "orange",
      },
      {
        title: "Service enquiries",
        description:
          "Track ongoing service requests, open calls, and coordination updates in one place.",
        to: "/service-enquiries",
        icon: Inbox,
        eyebrow: "Service tracking",
        tone: "emerald",
      },
      {
        title: "Service quotes",
        description:
          "Review issued service quotations and continue approvals without leaving the dashboard.",
        to: "/service-quotes",
        icon: FileCheck,
        eyebrow: "Service quotations",
        tone: "cyan",
      },
    ],
    workflow: [
      "Browse private-customer product categories and product details",
      "Continue through cart, checkout, and order tracking",
      "Use the same workspace for installation, AMC, and support requests",
    ],
  };
}

function DashboardCard({ item }) {
  const Icon = item.icon;
  const tone = CARD_TONES[item.tone] || CARD_TONES.cyan;

  return (
    <Link
      to={item.to}
      className="group tech-panel rounded-lg p-5 sm:p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${tone.iconBg}`}
        >
          <Icon className={`h-5 w-5 ${tone.iconText}`} />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {item.eyebrow}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
        {item.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {item.description}
      </p>

      <div className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold ${tone.arrowText}`}>
        Open workspace
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

export default function Home() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.roles?.includes("admin") && !user.clientType) {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  const dashboard = user ? getDashboardContent(user) : null;

  return (
    <LayoutContainer>
      <motion.div
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
        <Helmet>
          <title>{user ? dashboard.title : GUEST_HERO.seo.title}</title>
          <meta
            name="description"
            content={user ? dashboard.descriptionMeta : GUEST_HERO.seo.description}
          />
        </Helmet>

        {user ? (
          <>
            <motion.section
              className="w-[92%] max-w-7xl mx-auto mt-10"
              variants={containerVariants}
            >
              <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6">
                <div className="tech-panel rounded-lg p-6 sm:p-8">
                  <span className="signal-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    {dashboard.badge}
                  </span>
                  <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                    {dashboard.heading}
                  </h1>
                  <p className="mt-3 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                    {dashboard.description}
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    {dashboard.primaryActions.map((action) => (
                      <Link
                        key={action.label}
                        to={action.to}
                        className={
                          action.secondary
                            ? "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
                            : "inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 dark:bg-cyan-500 px-5 py-3 text-sm font-semibold text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-cyan-400"
                        }
                      >
                        {action.label}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ))}
                  </div>

                  {dashboard.notice && (
                    <div className="mt-6 rounded-lg border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
                      {dashboard.notice}
                    </div>
                  )}
                </div>

                <div className="tech-panel rounded-lg p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                      <ShieldCheck className="h-5 w-5 text-cyan-700 dark:text-cyan-300" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Account overview
                      </p>
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Current workspace
                      </h2>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {dashboard.summary.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3"
                      >
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          {item.label}
                        </div>
                        <div className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="scan-divider my-6"></div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      What to do next
                    </h3>
                    <div className="mt-4 space-y-3">
                      {dashboard.workflow.map((step) => (
                        <div key={step} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-300" />
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              className="w-[92%] max-w-7xl mx-auto"
              variants={containerVariants}
            >
              <div className="flex items-end justify-between gap-4 mb-5">
                <div>
                  <span className="signal-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    Core workspace
                  </span>
                  <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    Product and account actions
                  </h2>
                </div>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
                {dashboard.workspaceCards.map((item) => (
                  <DashboardCard key={item.title} item={item} />
                ))}
              </div>
            </motion.section>

            <motion.section
              className="w-[92%] max-w-7xl mx-auto pb-4"
              variants={containerVariants}
            >
              <div className="flex items-end justify-between gap-4 mb-5">
                <div>
                  <span className="signal-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    Shared service workspace
                  </span>
                  <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    Service requests and support follow-up
                  </h2>
                </div>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {dashboard.serviceCards.map((item) => (
                  <DashboardCard key={item.title} item={item} />
                ))}
              </div>
            </motion.section>
          </>
        ) : (
          <>
            <motion.section
              data-section
              className="hero-shell min-h-[72vh] sm:min-h-[64vh] flex items-center rounded-lg mt-10 w-[95%] sm:w-[90%] max-w-7xl mx-auto overflow-hidden shadow-sm"
              variants={containerVariants}
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent"></div>
                <div className="accent-orbit hidden lg:block"></div>
              </div>

              <div className="relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-16 px-4 sm:px-6 py-8 sm:py-10 lg:p-12 min-h-full lg:min-h-[70vh] items-start overflow-hidden w-full">
                <motion.div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="signal-chip inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
                  >
                    <Star size={14} className="text-cyan-500" fill="currentColor" />
                    {GUEST_HERO.badge}
                  </motion.span>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-bold text-slate-900 dark:text-white leading-[1.03] max-w-3xl"
                  >
                    {GUEST_HERO.heading}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 max-w-xl text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed"
                  >
                    {GUEST_HERO.subText}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 sm:gap-5 w-full items-center justify-center lg:justify-start"
                  >
                    <Link
                      to="/products-guest"
                      className="group inline-flex items-center gap-2 px-7 py-4 rounded-lg font-bold bg-slate-950 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-sm hover:bg-slate-800 dark:hover:bg-cyan-400 w-full sm:w-auto justify-center"
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
                      className="group inline-flex items-center gap-2 px-7 py-4 rounded-lg font-bold bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 w-full sm:w-auto justify-center"
                    >
                      <Wrench size={20} />
                      Explore Services
                    </Link>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="hidden lg:flex flex-col items-start w-full"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="relative w-full max-w-lg space-y-5 mt-10">
                    <img
                      src={genuineProducts}
                      alt="Trusted supply"
                      className="absolute -top-10 right-0 w-24 object-contain opacity-90 z-10"
                    />

                    <div className="tech-panel rounded-lg p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
                            Platform overview
                          </p>
                          <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                            A single platform with role-based next steps
                          </h3>
                        </div>
                        <img
                          src={gemLogo}
                          alt="Procurement support"
                          className="w-16 shrink-0 object-contain opacity-90"
                        />
                      </div>

                      <div className="scan-divider my-5"></div>

                      <div className="grid gap-3">
                        {GUEST_OVERVIEW.map((item) => (
                          <div
                            key={item.title}
                            className="rounded-lg border border-slate-200/80 dark:border-cyan-950/50 bg-white/70 dark:bg-slate-950/45 p-4"
                          >
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">
                              {item.title}
                            </div>
                            <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                              {item.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.section>

            <BrandTrustStrip />

            <motion.section
              data-section
              className="w-[90%] max-w-7xl mx-auto grid lg:grid-cols-[0.85fr_1.15fr] gap-8 items-start"
              variants={containerVariants}
            >
              <div className="lg:sticky lg:top-24">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-semibold uppercase tracking-wide">
                  Product Supply
                </span>
                <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  Genuine IT products for offices, institutions, and homes
                </h2>
                <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                  Review categories and product details first, then continue with the right ordering or procurement path after sign-in.
                </p>
                <Link
                  to="/products-guest"
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-700"
                >
                  View Product Catalogue
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                {PRODUCT_PREVIEWS.map((product) => (
                  <article
                    key={product.title}
                    className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
                  >
                    <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-6">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="p-5">
                      <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                        {product.meta}
                      </span>
                      <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                        {product.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </motion.section>

            <motion.section
              data-section
              className="w-[90%] max-w-7xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-5 sm:p-8 lg:p-10"
              variants={containerVariants}
            >
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">
                <div>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-semibold uppercase tracking-wide">
                    Professional Services
                  </span>
                  <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    Service support built around business continuity
                  </h2>
                  <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
                    Customers can quickly understand what help is available and continue with the right request flow after sign-in.
                  </p>
                </div>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-orange-500 hover:text-orange-600"
                >
                  Explore Services
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {SERVICE_PREVIEWS.map((service) => (
                  <article
                    key={service.title}
                    className="grid sm:grid-cols-[160px_1fr] gap-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4"
                  >
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-36 w-full rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {service.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {service.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </motion.section>

            <motion.section
              data-section
              className="w-[90%] max-w-7xl mx-auto bg-slate-900 text-white rounded-lg overflow-hidden"
              variants={containerVariants}
            >
              <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 p-6 sm:p-8 lg:p-10">
                <div>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-orange-200 text-xs font-semibold uppercase tracking-wide">
                    Simple Process
                  </span>
                  <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-white">
                    From requirement to follow-up without confusion
                  </h2>
                  <p className="mt-3 text-slate-300 leading-relaxed">
                    A strong customer journey should make the next step obvious before and after sign-in.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {GUEST_PROCESS_STEPS.map((step, index) => (
                    <div
                      key={step}
                      className="rounded-lg border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                          {index + 1}
                        </span>
                        <CheckCircle2 size={18} className="text-orange-300" />
                      </div>
                      <p className="mt-4 text-sm font-medium text-slate-100">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          </>
        )}
      </motion.div>
    </LayoutContainer>
  );
}
