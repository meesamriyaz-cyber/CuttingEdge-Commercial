import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  CheckCircle2,
  Gauge,
  LifeBuoy,
  PackageSearch,
  ReceiptText,
  ShieldCheck,
  Star,
  Wrench,
} from "lucide-react";

import { useAuthStore } from "../../store/authStore";
import BrandTrustStrip from "../../components/BrandTrustStrip";
import LayoutContainer from "../../components/LayoutContainer";
import ProductRecommendations from "../../components/ProductRecommendations";
import { Button } from "../../components/ui";
import { fadeInVariants, containerVariants } from "../../utils/animations";
import { getPublicCategories, getPublicProducts } from "../../api/products";

import gemLogo from "../../assets/images/gem_logo.webp";
import genuineProducts from "../../assets/images/genuine.png";
import hpImage from "../../assets/images/hp.jpg";
import dellLogo from "../../assets/images/dell.png";
import lenovoLogo from "../../assets/images/lenovo.png";
import asusLogo from "../../assets/images/asus.png";
import hpPrinterImage from "../../assets/images/hp-2606.jpg";
import microtekLogo from "../../assets/images/microtek.png";
import benqLogo from "../../assets/images/benq.png";
import promarkLogo from "../../assets/images/promark.png";
import tvseLogo from "../../assets/images/TVSe.png";
import teachmintLogo from "../../assets/images/teachmint-x.webp";
import ocimumLogo from "../../assets/images/ocimum.png";
import daikinImage from "../../assets/images/Diakins-main.webp";
import officeNetworkImage from "../../assets/images/office-network.jpg";
import amcImage from "../../assets/images/amc.jpg";

const GUEST_HERO = {
  firmName: "Cutting Edge Enterprises",
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
    text: "Browse supply categories before choosing the right workflow.",
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
    title: "HP and Lenovo Computers",
    category: "Computers",
    description: "Desktop, tower, and all-in-one systems from leading OEM brands.",
    image: hpImage,
    brandLogos: [
      { src: hpImage, alt: "HP" },
      { src: dellLogo, alt: "Dell" },
      { src: lenovoLogo, alt: "Lenovo" },
      { src: asusLogo, alt: "Asus" },
    ],
    preferredProducts: ["Lenovo LOQ", "All in One PC", "HP"],
    productImageLimit: 2,
    meta: "Multi-brand supply",
  },
  {
    title: "HP Laptops and Workstations",
    category: "Laptop",
    description: "HP Pavilion, OmniBook, and business laptop options.",
    image: lenovoLogo,
    brandLogos: [
      { src: hpImage, alt: "HP" },
      { src: dellLogo, alt: "Dell" },
      { src: lenovoLogo, alt: "Lenovo" },
      { src: asusLogo, alt: "Asus" },
    ],
    preferredProducts: ["HP Pavilion", "HP OmniBook"],
    productImageLimit: 2,
    meta: "Laptop supply",
  },
  {
    title: "HP Printers and Scanners",
    category: "Printers",
    description: "HP-led print devices, document handling, and office output.",
    image: hpPrinterImage,
    leadBrand: "HP",
    preferredProducts: ["HP Laserjet", "LaserJet"],
    productImageLimit: 1,
    meta: "Print solutions",
  },
  {
    title: "Microtek UPS and Power Solutions",
    category: "UPS and Power Solutions",
    description: "UPS systems, batteries, and power protection led by Microtek.",
    image: microtekLogo,
    leadBrand: "Microtek",
    meta: "Power backup",
    highlight: true,
  },
  {
    title: "BenQ, Teachmint and Promark Panels",
    category: "Interactive Panel",
    description: "Interactive flat panels for classrooms, meetings, and training rooms.",
    brandLogos: [
      { src: benqLogo, alt: "BenQ" },
      { src: teachmintLogo, alt: "Teachmint" },
      { src: promarkLogo, alt: "Promark" },
      { src: ocimumLogo, alt: "Ocimum" },
    ],
    leadBrand: "BenQ, Teachmint, Promark",
    preferredProducts: ["BenQ", "Teachmint", "PROMARK", "Ocimum"],
    productImageLimit: 2,
    meta: "Display systems",
  },
  {
    title: "Promark Networking Equipment",
    category: "Networking equipment",
    description: "Routers, switching, cabling, and office network essentials.",
    image: promarkLogo,
    leadBrand: "Promark",
    meta: "Network supply",
  },
  {
    title: "TVS-E IT Accessories",
    category: "IT Accessories",
    description: "Keyboards, peripherals, cabling, and practical desk hardware.",
    image: tvseLogo,
    leadBrand: "TVS-E",
    meta: "Accessories",
  },
  {
    title: "Microsoft Software and Licensing",
    category: "Software",
    description: "Microsoft Office, Windows, productivity, and licensing support.",
    brandMark: "microsoft",
    leadBrand: "Microsoft",
    meta: "Software",
  },
  {
    title: "Dell Storage and Backup",
    category: "Storage",
    description: "Storage devices, backup media, and business data accessories.",
    image: dellLogo,
    leadBrand: "Dell",
    meta: "Storage",
  },
  {
    title: "Daikin Air Conditioners",
    category: "Electronic Appliances",
    description: "Daikin hot and cold split AC options for offices and institutions.",
    image: daikinImage,
    leadBrand: "Daikin",
    preferredProducts: ["Daikin"],
    productImageLimit: 1,
    meta: "AC appliances",
  },
  {
    title: "Promark and Woodsquare Office Furniture",
    category: "Furniture",
    description: "Promark seating and Woodsquare office furniture for workspaces.",
    image: promarkLogo,
    leadBrand: "Promark, Woodsquare",
    preferredProducts: ["Promark", "Executive", "Table", "Sofa"],
    productImageLimit: 2,
    meta: "Furniture",
  },
  {
    title: "Kangaro, Doms and Parker Stationery",
    category: "Stationary",
    description: "Punches, staplers, pens, markers, files, and daily office supplies.",
    image: genuineProducts,
    leadBrand: "Kangaro, Doms, Parker",
    preferredProducts: ["Kangaro", "Doms", "Parker", "Display File"],
    productImageLimit: 3,
    meta: "Stationery",
  },
];

const SERVICE_PREVIEWS = [
  {
    title: "Network Installation",
    description: "Cabling, Wi-Fi, routers, switches, and office network setup.",
    image: officeNetworkImage,
    tags: ["Site survey", "Deployment", "Support"],
  },
  {
    title: "AMC and Maintenance",
    description: "Preventive maintenance and priority response.",
    image: amcImage,
    tags: ["SLA support", "Repairs", "Reporting"],
  },
];

const CATEGORY_PROMPTS = [
  "Computers",
  "Laptops",
  "Printers",
  "UPS and Power Solutions",
  "Interactive Panels",
  "Networking Equipment",
  "IT Accessories",
  "Software",
  "Storage",
  "Electronic Appliances",
  "Furniture",
  "Stationery",
];

const CATEGORY_KEY_ALIASES = {
  "computer": "computers",
  "laptop": "laptops",
  "printer": "printers",
  "stationary": "stationery",
  "interactive panel": "interactive panels",
  "network equipment": "networking equipment",
  "networking equipments": "networking equipment",
  "it accessory": "it accessories",
  "electronic appliance": "electronic appliances",
  "ups": "ups and power solutions",
  "power solution": "ups and power solutions",
  "power solutions": "ups and power solutions",
  "ups power backup": "ups and power solutions",
};

const HERO_TONES = {
  cyan: {
    panel: "bg-cyan-50/80 dark:bg-cyan-950/20 border-cyan-200/80 dark:border-cyan-900/50",
    icon: "bg-cyan-600 text-white dark:bg-cyan-400 dark:text-slate-950",
    text: "text-cyan-700 dark:text-cyan-300",
  },
  orange: {
    panel: "bg-orange-50/80 dark:bg-orange-950/20 border-orange-200/80 dark:border-orange-900/50",
    icon: "bg-orange-600 text-white dark:bg-orange-400 dark:text-slate-950",
    text: "text-orange-700 dark:text-orange-300",
  },
  emerald: {
    panel: "bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/50",
    icon: "bg-emerald-600 text-white dark:bg-emerald-400 dark:text-slate-950",
    text: "text-emerald-700 dark:text-emerald-300",
  },
};

function normalizeCategoryName(value) {
  return (value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getCategoryKey(value) {
  const normalized = normalizeCategoryName(value);
  return CATEGORY_KEY_ALIASES[normalized] || normalized;
}

function getProductImage(product) {
  return product?.images?.find((image) => image?.url)?.url || "";
}

function pickCategoryProductImages(products, categoryName, preferredProducts = [], limit = 1) {
  if (!Array.isArray(products) || products.length === 0) return [];

  const categoryKey = getCategoryKey(categoryName);
  const categoryProducts = products.filter(
    (product) => getCategoryKey(product.category) === categoryKey && getProductImage(product),
  );

  if (categoryProducts.length === 0) return [];

  const preferredTerms = preferredProducts.map((term) => term.toLowerCase());
  const sortedProducts = [...categoryProducts].sort((a, b) => {
    const aName = (a.name || "").toLowerCase();
    const bName = (b.name || "").toLowerCase();
    const aScore = preferredTerms.findIndex((term) => aName.includes(term));
    const bScore = preferredTerms.findIndex((term) => bName.includes(term));
    const safeAScore = aScore === -1 ? Number.MAX_SAFE_INTEGER : aScore;
    const safeBScore = bScore === -1 ? Number.MAX_SAFE_INTEGER : bScore;

    return safeAScore - safeBScore;
  });

  const seen = new Set();

  return sortedProducts
    .map((product) => ({
      src: getProductImage(product),
      alt: product.name || categoryName,
    }))
    .filter((image) => {
      if (!image.src || seen.has(image.src)) return false;
      seen.add(image.src);
      return true;
    })
    .slice(0, limit);
}

function createFallbackProductPreview(category, products = []) {
  const categoryName = category.name?.trim() || "Product Category";
  const productImages = pickCategoryProductImages(products, categoryName, [], 1);

  return {
    title: categoryName,
    category: categoryName,
    description: `Genuine ${categoryName.toLowerCase()} supply with catalogue browsing and support after sign-in.`,
    image: productImages[0]?.src || genuineProducts,
    productImages,
    leadBrand: "Trusted supply",
    meta: "Product category",
    count: category.count,
  };
}

function enrichProductPreview(product, backendCategory, products) {
  const categoryName = backendCategory?.name || product.category;
  const productImages = pickCategoryProductImages(
    products,
    categoryName,
    product.preferredProducts,
    product.productImageLimit || 1,
  );

  return {
    ...product,
    category: categoryName,
    count: backendCategory?.count,
    productImages: productImages.length > 0 ? productImages : product.productImages,
  };
}

function buildProductSupplyItems(categories, products = []) {
  if (!Array.isArray(categories) || categories.length === 0) {
    return PRODUCT_PREVIEWS.map((product) => enrichProductPreview(product, null, products));
  }

  const backendCategories = categories
    .map((category) => ({
      ...category,
      name: category.name?.trim(),
    }))
    .filter((category) => category.name);

  if (backendCategories.length === 0) {
    return PRODUCT_PREVIEWS.map((product) => enrichProductPreview(product, null, products));
  }

  const backendByKey = new Map();
  backendCategories.forEach((category) => {
    const key = getCategoryKey(category.name);
    if (!backendByKey.has(key)) {
      backendByKey.set(key, category);
    }
  });

  const usedKeys = new Set();
  const mappedPreviews = PRODUCT_PREVIEWS.map((product) => {
    const key = getCategoryKey(product.category);
    const backendCategory = backendByKey.get(key);

    if (backendCategory) {
      usedKeys.add(key);
      return enrichProductPreview(product, backendCategory, products);
    }

    return enrichProductPreview(product, null, products);
  });

  const backendOnlyPreviews = backendCategories
    .filter((category) => !usedKeys.has(getCategoryKey(category.name)))
    .map((category) => createFallbackProductPreview(category, products));

  return [...mappedPreviews, ...backendOnlyPreviews];
}

function formatDashboardDate(value) {
  if (!value) return "Not recorded yet";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded yet";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

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
      accountInfo: [
        { label: "Account type", value: "Government customer" },
        {
          label: "Verification",
          value: isVerified ? "Verified" : "Pending review",
        },
        { label: "Last login", value: formatDashboardDate(user.lastLogin) },
      ],
      heroHighlights: [
        {
          title: "Procurement ready",
          text: isVerified ? "Verified account access" : "Verification pending",
          to: "/enquiries",
          icon: BadgeCheck,
          tone: "emerald",
        },
        {
          title: "Catalogue to quote",
          text: "Enquiries, quotes, and follow-up",
          to: "/quotes",
          icon: ReceiptText,
          tone: "cyan",
        },
        {
          title: "Service desk",
          text: "AMC, repairs, and installation",
          to: "/services",
          icon: LifeBuoy,
          tone: "orange",
        },
      ],
      notice: isVerified
        ? null
        : "Verification is still pending. You can browse the catalogue now, and procurement actions will unlock after approval.",
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
    accountInfo: [
      { label: "Account type", value: "Private customer" },
      { label: "Account status", value: "Active" },
      { label: "Last login", value: formatDashboardDate(user.lastLogin) },
    ],
    heroHighlights: [
      {
        title: "Shop faster",
        text: "Browse categories and products",
        to: "/products",
        icon: Boxes,
        tone: "cyan",
      },
      {
        title: "Order control",
        text: "Cart, checkout, and invoices",
        to: "/orders",
        icon: Gauge,
        tone: "orange",
      },
      {
        title: "Support hub",
        text: "Services, quotes, and follow-up",
        to: "/services",
        icon: LifeBuoy,
        tone: "emerald",
      },
    ],
    notice: null,
  };
}

function DashboardHeroPanel({ dashboard }) {
  return (
    <div className="hero-shell overflow-hidden rounded-lg shadow-sm">
      <div className="grid min-h-full xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="p-6 sm:p-8 lg:p-9">
          <div className="flex flex-wrap items-center gap-3">
            <span className="signal-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              {dashboard.badge}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-cyan-900/50 dark:bg-slate-950/35 dark:text-slate-300">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-300" />
              Secure workspace
            </span>
          </div>

          <h1 className="mt-5 max-w-3xl text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            {dashboard.heading}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
            {dashboard.description}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {dashboard.accountInfo.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-slate-200/80 bg-white/60 px-4 py-3 dark:border-cyan-950/50 dark:bg-slate-950/25"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
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

        <div className="border-t border-slate-200/80 bg-white/55 p-5 dark:border-cyan-950/50 dark:bg-slate-950/25 xl:border-l xl:border-t-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Today
              </p>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Ready to continue
              </h2>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-cyan-400 dark:text-slate-950">
              <Gauge className="h-5 w-5" />
            </div>
          </div>

          <div className="scan-divider my-5"></div>

          <div className="space-y-3">
            {dashboard.heroHighlights.map((item) => {
              const Icon = item.icon;
              const tone = HERO_TONES[item.tone] || HERO_TONES.cyan;

              return (
                <Link
                  key={item.title}
                  to={item.to}
                  className={`group block rounded-lg border p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${tone.panel}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tone.icon}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className={`text-sm font-semibold ${tone.text}`}>
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        {item.text}
                      </p>
                      <span className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold ${tone.text}`}>
                        Open
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductBrandVisual({ product, className = "" }) {
  if (product.productImages?.length > 0) {
    if (product.productImages.length === 1) {
      const image = product.productImages[0];

      return (
        <img
          src={image.src}
          alt={image.alt}
          className={`max-h-full max-w-full object-contain ${className}`}
          loading="lazy"
        />
      );
    }

    return (
      <div className={`grid h-full w-full grid-cols-2 gap-2 ${className}`}>
        {product.productImages.map((image) => (
          <div
            key={image.src}
            className="flex min-w-0 items-center justify-center overflow-hidden rounded-md bg-white/70 p-1 dark:bg-slate-950/35"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="max-h-full max-w-full object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    );
  }

  if (product.brandMark === "microsoft") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="grid h-12 w-12 shrink-0 grid-cols-2 gap-1">
          <span className="bg-[#f25022]" />
          <span className="bg-[#7fba00]" />
          <span className="bg-[#00a4ef]" />
          <span className="bg-[#ffb900]" />
        </div>
        <div className="min-w-0">
          <div className="text-xl font-bold text-slate-800 dark:text-white">
            Microsoft
          </div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Software
          </div>
        </div>
      </div>
    );
  }

  if (product.brandLogos) {
    return (
      <div className={`grid h-full w-full grid-cols-2 gap-3 ${className}`}>
        {product.brandLogos.map((brand) => (
          <img
            key={brand.alt}
            src={brand.src}
            alt={brand.alt}
            className="m-auto max-h-10 max-w-full object-contain"
            loading="lazy"
          />
        ))}
      </div>
    );
  }

  return (
    <img
      src={product.image}
      alt={product.leadBrand || product.title}
      className={`max-h-full max-w-full object-contain ${className}`}
      loading="lazy"
    />
  );
}

function ProductSupplyCarousel({ products = PRODUCT_PREVIEWS }) {
  const productItems = products.length > 0 ? products : PRODUCT_PREVIEWS;
  const carouselItems = [...productItems, ...productItems];
  const duration = Math.max(44, productItems.length * 4.2);

  return (
    <div
      className="relative mt-6 overflow-hidden py-1"
      aria-label="Product supply categories"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 7%, black 93%, transparent)",
        maskImage:
          "linear-gradient(to right, transparent, black 7%, black 93%, transparent)",
      }}
    >
      <Motion.div
        className="flex w-max gap-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration, ease: "linear" }}
      >
        {carouselItems.map((product, index) => (
          <Link
            key={`${product.title}-${index}`}
            to="/products-guest"
            className={`group flex h-[320px] w-[280px] shrink-0 flex-col overflow-hidden rounded-lg border bg-white/76 p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/90 dark:bg-slate-950/40 dark:hover:bg-slate-950/60 sm:w-[320px] ${
              product.highlight
                ? "border-orange-300/80 dark:border-orange-800/60"
                : "border-slate-200/80 hover:border-cyan-300 dark:border-cyan-950/50 dark:hover:border-cyan-800"
            }`}
          >
            <div className="flex min-h-7 items-center justify-between gap-3">
              <span className="min-w-0 truncate text-xs font-bold uppercase tracking-wide text-orange-600 dark:text-orange-300">
                {product.meta}
              </span>
              {product.leadBrand && (
                <span className="max-w-[58%] truncate rounded-full border border-slate-200/80 bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
                  {product.leadBrand}
                </span>
              )}
            </div>

            <div
              className={`mt-4 flex h-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white/80 p-3 dark:bg-slate-900/70 ${
                product.highlight
                  ? "border-orange-200/80 dark:border-orange-900/50"
                  : "border-slate-200/70 dark:border-slate-800"
              }`}
            >
              <ProductBrandVisual product={product} />
            </div>

            <div className="mt-4 min-h-0 min-w-0 flex-1 overflow-hidden">
              <h3
                className="text-base font-bold leading-snug text-slate-950 group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-300"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {product.title}
              </h3>
              <p
                className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {product.description}
              </p>
              {product.count != null && (
                <p className="mt-2 truncate text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {product.count} active {product.count === 1 ? "item" : "items"}
                </p>
              )}
            </div>

            <div className="mt-3 inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-cyan-700 dark:text-cyan-300">
              Browse category
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </Motion.div>
    </div>
  );
}

function GuestHome() {
  return (
    <div className="pb-16">
      <Motion.section
        className="hero-shell mx-auto mt-8 w-[94%] max-w-7xl overflow-hidden rounded-lg shadow-sm"
        variants={containerVariants}
      >
        <div className="relative grid min-h-[560px] gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_0.82fr] lg:items-center lg:p-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />

          <div className="relative z-10">
            <span className="signal-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide">
              <ShieldCheck className="h-3.5 w-3.5" />
              Product supply and service support
            </span>

            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.04] text-slate-950 dark:text-white sm:text-5xl lg:text-[4rem]">
              Everyday business products, quotations, and support.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              Browse technology, electronics, stationery, furniture, and office
              supplies, then continue with private ordering or government
              quotation workflows when you are ready.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/products-guest"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
              >
                <PackageSearch className="h-5 w-5" />
                Browse products
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-bold text-slate-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-orange-400 hover:text-orange-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-orange-500"
              >
                <Wrench className="h-5 w-5" />
                Explore services
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {CATEGORY_PROMPTS.map((category) => (
                <Link
                  key={category}
                  to="/products-guest"
                  className="rounded-full border border-slate-200 bg-white/75 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur transition hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-cyan-700 dark:hover:text-cyan-300"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative z-10 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {PRODUCT_PREVIEWS.slice(0, 4).map((product) => (
                <Link
                  key={product.title}
                  to="/products-guest"
                  className="group rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/70"
                >
                  {product.brandLogos ? (
                    <div className="grid h-28 grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
                      {product.brandLogos.map((brand) => (
                        <div
                          key={brand.alt}
                          className="flex items-center justify-center rounded-md bg-white/85 p-2 dark:bg-slate-950/60"
                        >
                          <img
                            src={brand.src}
                            alt={brand.alt}
                            className="max-h-8 max-w-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-28 w-full rounded-lg object-contain bg-slate-50 p-3 dark:bg-slate-900"
                    />
                  )}
                  <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-orange-600 dark:text-orange-300">
                    {product.meta}
                  </div>
                  <h3 className="mt-1 text-base font-bold text-slate-950 group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-300">
                    {product.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {product.description}
                  </p>
                </Link>
              ))}
            </div>

            <div className="rounded-lg border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/50">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
                    Customer paths
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">
                    Browse first. Sign in only when you need the workflow.
                  </h2>
                </div>
                <img
                  src={gemLogo}
                  alt="Procurement support"
                  className="h-12 w-12 shrink-0 object-contain"
                />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-sm font-bold text-slate-950 dark:text-white">
                    Private customers
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    Cart, checkout, orders, and support.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-sm font-bold text-slate-950 dark:text-white">
                    Government customers
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    Enquiries, quotations, and tracking.
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden items-center justify-between rounded-lg border border-slate-200 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/50 sm:flex">
              <div className="flex items-center gap-3">
                <img
                  src={genuineProducts}
                  alt="Genuine product assurance"
                  className="h-12 w-12 object-contain"
                />
                <div>
                  <div className="text-sm font-bold text-slate-950 dark:text-white">
                    Genuine supply focus
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Browse first, sign in only when ready.
                  </p>
                </div>
              </div>
              <BadgeCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>
      </Motion.section>

      <BrandTrustStrip />

      <Motion.section
        className="mx-auto mt-12 grid w-[90%] max-w-7xl gap-5 md:grid-cols-4"
        variants={containerVariants}
      >
        {GUEST_PROCESS_STEPS.map((step, index) => (
          <div
            key={step}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-sm font-bold text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
              {index + 1}
            </div>
            <p className="mt-4 text-sm font-semibold leading-relaxed text-slate-800 dark:text-slate-100">
              {step}
            </p>
          </div>
        ))}
      </Motion.section>
    </div>
  );
}

export default function Home() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [publicCategories, setPublicCategories] = useState([]);
  const [publicProducts, setPublicProducts] = useState([]);

  useEffect(() => {
    if (user && user.roles?.includes("admin") && !user.clientType) {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) return undefined;

    let isMounted = true;

    async function loadPublicCatalogue() {
      try {
        const [categories, products] = await Promise.all([
          getPublicCategories(),
          getPublicProducts(),
        ]);

        if (isMounted) {
          setPublicCategories(Array.isArray(categories) ? categories : []);
          setPublicProducts(Array.isArray(products) ? products : []);
        }
      } catch {
        if (isMounted) {
          setPublicCategories([]);
          setPublicProducts([]);
        }
      }
    }

    loadPublicCatalogue();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const dashboard = user ? getDashboardContent(user) : null;
  const productSupplyItems = useMemo(
    () => buildProductSupplyItems(publicCategories, publicProducts),
    [publicCategories, publicProducts],
  );

  return (
    <LayoutContainer>
      <Motion.div
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
            <Motion.section
              className="w-[92%] max-w-7xl mx-auto mt-10"
              variants={containerVariants}
            >
              <DashboardHeroPanel dashboard={dashboard} />
            </Motion.section>

            <Motion.section
              className="w-[92%] max-w-7xl mx-auto"
              variants={containerVariants}
            >
              <ProductRecommendations
                title={
                  user.clientType === "PUBLIC"
                    ? "Useful procurement picks"
                    : "Popular products to explore"
                }
                description={
                  user.clientType === "PUBLIC"
                    ? "A few catalogue items to continue into enquiry and quotation workflows."
                    : "A few active products that can help complete your next order."
                }
              />
            </Motion.section>
          </>
        ) : (
          <>
            <Motion.section
              data-section
              className="hero-shell min-h-[72vh] sm:min-h-[64vh] flex items-center rounded-lg mt-10 w-[95%] sm:w-[90%] max-w-7xl mx-auto overflow-hidden shadow-sm"
              variants={containerVariants}
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent"></div>
                <div className="accent-orbit hidden lg:block"></div>
              </div>

              <div className="relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-16 px-4 sm:px-6 py-8 sm:py-10 lg:p-12 min-h-full lg:min-h-[70vh] items-start overflow-hidden w-full">
                <Motion.div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <Motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="mb-4 inline-flex flex-col items-center gap-2 rounded-lg border border-cyan-200/80 bg-white/70 px-4 py-2 shadow-sm backdrop-blur sm:hidden dark:border-cyan-900/50 dark:bg-slate-950/45"
                  >
                    <span className="text-base font-extrabold uppercase tracking-[0.16em] text-cyan-800 dark:text-cyan-200">
                      {GUEST_HERO.firmName}
                    </span>
                    <span className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-500/70 to-transparent"></span>
                  </Motion.div>

                  <Motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="signal-chip inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
                  >
                    <Star size={14} className="text-cyan-500" fill="currentColor" />
                    {GUEST_HERO.badge}
                  </Motion.span>

                  <Motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-bold text-slate-900 dark:text-white leading-[1.03] max-w-3xl"
                  >
                    {GUEST_HERO.heading}
                  </Motion.h1>

                  <Motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="mt-6 max-w-xl text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed"
                  >
                    {GUEST_HERO.subText}
                  </Motion.p>

                  <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 sm:gap-5 w-full items-center justify-center lg:justify-start"
                  >
                    <Button
                      size="lg"
                      to="/products-guest"
                      className="group w-full sm:w-auto"
                    >
                      <PackageSearch size={20} />
                      Browse Products
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Button>

                    <Button
                      variant="secondary"
                      size="lg"
                      to="/services"
                      className="w-full sm:w-auto"
                    >
                      <Wrench size={20} />
                      Explore Services
                    </Button>
                  </Motion.div>
                </Motion.div>

                <Motion.div
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
                </Motion.div>
              </div>
            </Motion.section>

            <Motion.section
              data-section
              className="hero-shell w-[90%] max-w-7xl mx-auto rounded-lg p-5 sm:p-6 lg:p-7"
              variants={containerVariants}
            >
              <div className="relative z-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <span className="signal-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide">
                      Product Supply
                    </span>
                    <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                      Genuine products, ready for the right workflow
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      Browse essentials first, then continue with private ordering or public enquiry.
                    </p>
                  </div>
                  <Button
                    to="/products-guest"
                    className="self-start md:self-auto"
                  >
                    View Catalogue
                    <ArrowRight size={16} />
                  </Button>
                </div>

                <ProductSupplyCarousel products={productSupplyItems} />
              </div>
            </Motion.section>

            <Motion.section
              data-section
              className="hero-shell w-[90%] max-w-7xl mx-auto rounded-lg p-5 sm:p-6 lg:p-7"
              variants={containerVariants}
            >
              <div className="relative z-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                      Services from XAD InfoTech Solutions
                    </h2>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
                      20+ Years of IT Service Experience in J&K
                    </p>
                    <p className="mt-3 max-w-4xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      Cutting Edge brings product supply and professional services together with the technical expertise
                      of <span className="font-semibold text-slate-800 dark:text-slate-100">XAD InfoTech Solutions</span>.
                      With more than two decades of IT service experience in J&K, our integrated team supports customers
                      across the technology lifecycle — from installation and deployment to maintenance, troubleshooting,
                      repairs, and ongoing technical assistance.
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                      One relationship. From purchase to ongoing support.
                    </p>
                  </div>
                  <Link
                    to="/services"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-4 py-3 text-sm font-bold text-slate-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-cyan-700 dark:hover:text-cyan-300"
                  >
                    Explore Services
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Supporting leading technology brands
                  </span>
                  {["DELL", "HP", "ASUS", "Lenovo", "TVS-E", "Canon", "and more"].map((brand, index) => (
                    <span
                      key={brand}
                      className={
                        index === 6
                          ? "rounded-full border border-orange-200/80 bg-orange-50/70 px-3 py-1.5 text-xs font-semibold text-orange-700 dark:border-orange-900/50 dark:bg-orange-950/20 dark:text-orange-300"
                          : "rounded-full border border-slate-200/80 bg-white/75 px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm dark:border-cyan-950/50 dark:bg-slate-950/35 dark:text-slate-300"
                      }
                    >
                      {brand}
                    </span>
                  ))}
                </div>

                <div className="mt-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    From service expertise to practical support
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {SERVICE_PREVIEWS.map((service) => (
                      <Link
                        key={service.title}
                        to="/services"
                        className="group grid gap-4 rounded-lg border border-slate-200/80 bg-white/72 p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-white/88 dark:border-cyan-950/50 dark:bg-slate-950/35 dark:hover:border-cyan-800 sm:grid-cols-[132px_1fr]"
                      >
                        <img
                          src={service.image}
                          alt={service.title}
                          className="h-28 w-full rounded-lg object-cover"
                        />
                        <div className="min-w-0 self-center">
                          <h3 className="text-base font-bold text-slate-950 group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-300">
                            {service.title}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            {service.description}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {service.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-cyan-200/70 bg-cyan-50/70 px-2.5 py-1 text-xs font-semibold text-cyan-800 dark:border-cyan-900/50 dark:bg-cyan-950/25 dark:text-cyan-200"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Motion.section>

          </>
        )}
      </Motion.div>
    </LayoutContainer>
  );
}
