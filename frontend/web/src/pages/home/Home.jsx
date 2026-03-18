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
      "Buy genuine products, book service requests — trusted by individuals and growing businesses.",
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

// Hero Section - Minimal
function HeroSection({ hero, clientType }) {
  return (
    <section className="relative min-h-[80vh] flex items-center bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium mb-6"
            >
              {hero.badge}
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-slate-900 leading-tight mb-6"
            >
              {hero.heading}
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-slate-500 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
            >
              {hero.subText}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
              >
                <PackageSearch size={18} />
                Browse Products
              </Link>

              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                <Wrench size={18} />
                Explore Services
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side - Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-6">
                <div className="text-3xl font-semibold text-slate-900 mb-1">
                  <AnimatedCounter end={10} suffix="K+" />
                </div>
                <div className="text-sm text-slate-500">Products</div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6">
                <div className="text-3xl font-semibold text-slate-900 mb-1">
                  <AnimatedCounter end={500} suffix="+" />
                </div>
                <div className="text-sm text-slate-500">Services</div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6">
                <div className="text-3xl font-semibold text-slate-900 mb-1">
                  <AnimatedCounter end={5} suffix="K+" />
                </div>
                <div className="text-sm text-slate-500">Happy Clients</div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6">
                <div className="text-3xl font-semibold text-slate-900 mb-1">
                  <AnimatedCounter end={15} suffix="+" />
                </div>
                <div className="text-sm text-slate-500">Years Experience</div>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="mt-6 flex justify-center">
              <img
                src={clientType === "PUBLIC" ? gemLogo : genuineProducts}
                alt="Trust badge"
                className="h-12 object-contain opacity-60"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Services Preview - Minimal
function ServicesPreview() {
  const services = [
    {
      title: "Network Installation",
      description: "Professional office network setup and configuration",
      icon: Network,
    },
    {
      title: "AMC Maintenance",
      description: "Annual maintenance contracts for IT infrastructure",
      icon: Wrench,
    },
    {
      title: "Repairs & Troubleshooting",
      description: "Expert repair services for all IT equipment",
      icon: Server,
    },
    {
      title: "Enterprise Solutions",
      description: "Custom IT solutions for large organizations",
      icon: PackageSearch,
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium mb-4">
            Our Services
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-3">
            Professional IT Solutions
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Comprehensive IT services tailored to meet your business needs
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-slate-900 transition-colors">
                <service.icon className="w-5 h-5 text-slate-600 group-hover:text-white" />
              </div>
              <h3 className="text-base font-medium text-slate-900 mb-1">
                {service.title}
              </h3>
              <p className="text-sm text-slate-500 mb-3">
                {service.description}
              </p>
              <Link
                to="/services"
                className="inline-flex items-center gap-1 text-sm font-medium text-slate-900 group-hover:gap-2 transition-all"
              >
                Learn more <ChevronRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            View All Services <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Quick Access Section - Minimal
function QuickAccessSection() {
  const privateCards = [
    {
      title: "Shopping Cart",
      description: "View and manage your selected items",
      icon: ShoppingCart,
      link: "/cart",
    },
    {
      title: "My Orders",
      description: "Track your orders and history",
      icon: ClipboardList,
      link: "/orders",
    },
  ];

  const publicCards = [
    {
      title: "My Enquiries",
      description: "Track your procurement requests",
      icon: Inbox,
      link: "/enquiries",
    },
    {
      title: "My Quotes",
      description: "Review received quotations",
      icon: Quote,
      link: "/quotes",
    },
  ];

  const serviceCards = [
    {
      title: "Service Enquiries",
      description: "Track submitted service requests",
      icon: Inbox,
      link: "/service-enquiries",
    },
    {
      title: "Service Quotes",
      description: "Review service pricing proposals",
      icon: FileCheck,
      link: "/service-quotes",
    },
  ];

  const cardBase =
    "p-5 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all";

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-medium mb-4">
            Quick Access
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-3">
            Continue Where You Left Off
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Shortcuts tailored to your account and activity
          </p>
        </motion.div>

        {/* Private Client Cards */}
        <RoleGate allow={["PRIVATE"]}>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
            {privateCards.map((card) => (
              <motion.div
                key={card.title}
                whileHover={{ y: -2 }}
                className={cardBase}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <card.icon className="w-5 h-5 text-slate-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 mb-0.5">
                      {card.title}
                    </h4>
                    <p className="text-sm text-slate-500 mb-2">
                      {card.description}
                    </p>
                    <Link
                      to={card.link}
                      className="text-sm font-medium text-slate-900 hover:underline"
                    >
                      View <ArrowRight size={14} className="inline" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </RoleGate>

        {/* Public Client Cards */}
        <RoleGate allow={["PUBLIC"]}>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
            {publicCards.map((card) => (
              <motion.div
                key={card.title}
                whileHover={{ y: -2 }}
                className={cardBase}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <card.icon className="w-5 h-5 text-slate-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 mb-0.5">
                      {card.title}
                    </h4>
                    <p className="text-sm text-slate-500 mb-2">
                      {card.description}
                    </p>
                    <Link
                      to={card.link}
                      className="text-sm font-medium text-slate-900 hover:underline"
                    >
                      View <ArrowRight size={14} className="inline" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </RoleGate>

        {/* Service Cards */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-center text-sm font-medium text-slate-500 mb-4">
            Service Management
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {serviceCards.map((card) => (
              <motion.div
                key={card.title}
                whileHover={{ y: -2 }}
                className={cardBase}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <card.icon className="w-5 h-5 text-slate-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 mb-0.5">
                      {card.title}
                    </h4>
                    <p className="text-sm text-slate-500 mb-2">
                      {card.description}
                    </p>
                    <Link
                      to={card.link}
                      className="text-sm font-medium text-slate-900 hover:underline"
                    >
                      View <ArrowRight size={14} className="inline" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// CTA Section - Minimal
function CTASection() {
  return (
    <section className="py-16 bg-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-3">
            Ready to Get Started?
          </h2>
          <p className="text-slate-400 mb-6">
            Join thousands of satisfied customers who trust us for their IT
            needs
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white text-slate-900 font-medium hover:bg-slate-100 transition-colors"
            >
              Create Account
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-700 text-white font-medium hover:bg-slate-800 transition-colors"
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
      <BrandTrustStrip clientType={clientType} />
      <ServicesPreview />
      <QuickAccessSection />
      <CTASection />
    </motion.div>
  );
}
