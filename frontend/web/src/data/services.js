import { Network, ShieldCheck, Wrench, Building2 } from "lucide-react";
import officeNetworkImage from "../assets/images/office-network.jpg";
import amcImage from "../assets/images/amc.jpg";
import repairsImage from "../assets/images/repairs.jpg";
import itEnterpriseImage from "../assets/images/IT-enterprises.png";

const services = [
  {
    slug: "office-network-installation",
    title: "Office Network Installation",
    desc: "Secure setup and configuration of office networks.",
    longDesc:
      "We design, deploy, and secure office networking infrastructure including routers, switches, firewalls, and Wi-Fi solutions.",
    rate: "Quote based",
    image: officeNetworkImage,
    icon: Network,
  },
  {
    slug: "amc-maintenance",
    title: "AMC & Maintenance",
    desc: "Annual maintenance with defined SLAs.",
    longDesc:
      "Comprehensive AMC services covering preventive maintenance, priority support, and uptime assurance.",
    rate: "Contract based",
    image: amcImage,
    icon: ShieldCheck,
  },
  {
    slug: "repairs-troubleshooting",
    title: "Repairs & Troubleshooting",
    desc: "On-site and off-site diagnostics and repairs.",
    longDesc:
      "Certified engineers providing reliable repair and troubleshooting services.",
    rate: "Starting ₹200",
    image: repairsImage,
    icon: Wrench,
  },
  {
    slug: "enterprise-it-solutions",
    title: "IT & Enterprise Solutions",
    desc: "Tailored IT solutions for businesses.",
    longDesc:
      "End-to-end IT solutions for enterprises including procurement, deployment, and managed services.",
    rate: "Quote based",
    image: itEnterpriseImage,
    icon: Building2,
  },
];

export default services;
