import { Link } from "react-router-dom";
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
    <footer className="bg-white border-t border-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-semibold text-slate-900">
                Cutting Edge Enterprises
              </span>
            </Link>
            <p className="text-sm text-slate-500 mb-4">
              Your trusted partner for government procurement, institutional IT
              supply, and professional IT services.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Mail className="w-4 h-4" />
                <span>info@cuttingedgeenterprises.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Phone className="w-4 h-4" />
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="w-4 h-4" />
                <span>Srinagar, J&K, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-medium mb-4 text-slate-900">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products"
                  className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Services
                </Link>
              </li>
              {user ? (
                <li>
                  <Link
                    to="/profile"
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    My Account
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-medium mb-4 text-slate-900">Follow Us</h3>
            <div className="flex gap-2">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-400">
            © {currentYear} Cutting Edge Enterprises. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
