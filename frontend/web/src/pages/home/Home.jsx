import useSnapNavigation from "../../hooks/useSnapNavigation";
import { useAuthStore } from "../../store/authStore";
import RoleGate from "../../components/RoleGate";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
  Shield,
  Users,
  Award,
  CheckCircle,
  ChevronRight,
  Network,
  Server,
} from "lucide-react";

import { fadeInVariants } from "../../utils/animations";

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

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

// Hero Section
function HeroSection({ hero, clientType }) {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-teal-500/20 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6"
            >
              <Star
                size={14}
                className="text-emerald-400"
                fill="currentColor"
              />
              {hero.badge}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                {hero.heading}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-slate-300 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
            >
              {hero.subText}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/products"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:-translate-y-1"
              >
                <PackageSearch size={22} />
                Browse Products
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                to="/services"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              >
                <Wrench size={22} />
                Explore Services
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6"
            >
              <div className="flex items-center gap-2 text-slate-400">
                <CheckCircle size={18} className="text-emerald-400" />
                <span className="text-sm">GeM Registered</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <CheckCircle size={18} className="text-emerald-400" />
                <span className="text-sm">GST Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <CheckCircle size={18} className="text-emerald-400" />
                <span className="text-sm">ISO Certified</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <motion.div
                className="absolute -top-4 right-4 z-20"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50 shadow-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <PackageSearch className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-white font-semibold">10,000+</p>
                      <p className="text-slate-400 text-sm">Products</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute top-32 -left-8 z-10"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50 shadow-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <Wrench className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-white font-semibold">500+</p>
                      <p className="text-slate-400 text-sm">Services</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute top-64 right-0 z-30"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
              >
                <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50 shadow-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <Users className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-white font-semibold">5000+</p>
                      <p className="text-slate-400 text-sm">Happy Clients</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.img
                src={clientType === "PUBLIC" ? gemLogo : genuineProducts}
                alt="Trust badge"
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 object-contain opacity-90 z-40"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.9, scale: 1 }}
                transition={{ delay: 0.8 }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
            className="dark:fill-slate-900"
          />
        </svg>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { number: 10, suffix: "K+", label: "Products", icon: PackageSearch },
    { number: 500, suffix: "+", label: "Services", icon: Wrench },
    { number: 5000, suffix: "+", label: "Happy Clients", icon: Users },
    { number: 15, suffix: "+", label: "Years Experience", icon: Award },
  ];

  return (
    <section className="py-16 bg-white dark:bg-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 mb-4">
                <stat.icon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">
                <AnimatedCounter end={stat.number} suffix={stat.suffix} />
              </div>
              <div className="text-slate-500 dark:text-slate-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesPreview() {
  const services = [
    {
      title: "Network Installation",
      description: "Professional office network setup and configuration",
      icon: Network,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "AMC Maintenance",
      description: "Annual maintenance contracts for IT infrastructure",
      icon: Shield,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Repairs & Troubleshooting",
      description: "Expert repair services for all IT equipment",
      icon: Wrench,
      color: "from-orange-500 to-amber-600",
    },
    {
      title: "Enterprise Solutions",
      description: "Custom IT solutions for large organizations",
      icon: Server,
      color: "from-violet-500 to-purple-600",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-4">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Professional IT Solutions
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Comprehensive IT services tailored to meet your business needs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                  {service.description}
                </p>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm group-hover:gap-3 transition-all"
                >
                  Learn More <ChevronRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
          >
            View All Services <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function QuickAccessSection() {
  const cardBase =
    "bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700";

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-sm font-semibold mb-4">
            Quick Access
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Continue Where You Left Off
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Shortcuts tailored to your account & activity
          </p>
        </motion.div>

        <RoleGate allow={["PRIVATE"]}>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div whileHover={{ y: -4 }} className={cardBase}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <ShoppingCart className="text-white" size={28} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                    Shopping Cart
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    View and manage your selected items
                  </p>
                  <Link
                    to="/cart"
                    className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all"
                  >
                    View Cart <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className={cardBase}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <ClipboardList className="text-white" size={28} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                    My Orders
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Track your orders and history
                  </p>
                  <Link
                    to="/orders"
                    className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all"
                  >
                    My Orders <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </RoleGate>

        <RoleGate allow={["PUBLIC"]}>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div whileHover={{ y: -4 }} className={cardBase}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Inbox className="text-white" size={28} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                    My Enquiries
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Track your procurement requests
                  </p>
                  <Link
                    to="/enquiries"
                    className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all"
                  >
                    View Enquiries <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className={cardBase}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Quote className="text-white" size={28} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                    My Quotes
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Review received quotations
                  </p>
                  <Link
                    to="/quotes"
                    className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all"
                  >
                    View Quotes <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </RoleGate>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-8 flex items-center justify-center gap-2">
            <Wrench className="text-emerald-500" /> Service Management
          </h3>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div whileHover={{ y: -4 }} className={cardBase}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Inbox className="text-white" size={28} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                    Service Enquiries
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Track submitted service requests
                  </p>
                  <Link
                    to="/service-enquiries"
                    className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all"
                  >
                    View Enquiries <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className={cardBase}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                  <FileCheck className="text-white" size={28} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                    Service Quotes
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Review service pricing proposals
                  </p>
                  <Link
                    to="/service-quotes"
                    className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all"
                  >
                    View Quotes <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join thousands of satisfied customers who trust us for their IT
            needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold bg-white text-emerald-600 hover:bg-slate-100 transition-colors"
            >
              Create Account <ArrowRight size={20} />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

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

  return (
    <motion.div
      className="space-y-0"
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
    >
      <Helmet>
        <title>{hero.seo.title}</title>
        <meta name="description" content={hero.seo.description} />
      </Helmet>

      <HeroSection hero={hero} clientType={clientType} />
      <StatsSection />
      <div className="w-full">
        <BrandTrustStrip clientType={clientType} />
      </div>
      <ServicesPreview />
      <QuickAccessSection />
    </motion.div>
  );
}
