import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";

import {
  Package,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
} from "lucide-react";

export default function Footer() {
  const user = useAuthStore((state) => state.user);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Company Info */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">Cutting Edge Enterprises</span>
            </Link>
            <p className="text-slate-400 text-sm mb-4">
              Your trusted partner for government procurement, institutional IT supply, and professional IT services.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>info@cuttingedgeenterprises.com</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Srinagar, J&K, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links - Just Products & Services */}
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">
                  Services
                </Link>
              </li>
              {user ? (
                <li>
                  <Link to="/profile" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">
                    My Account
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-bold mb-4">Follow Us</h3>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-emerald-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-emerald-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-emerald-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-emerald-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-emerald-500 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm">
            © {currentYear} Cutting Edge Enterprises. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
