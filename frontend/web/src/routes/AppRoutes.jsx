import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import PostLoginVerificationRoute from "../components/PostLoginVerificationRoute";
import VerificationRoute from "../components/VerificationRoute";

import Login from "../pages/auth/Login";
import Home from "../pages/home/Home";
import PostLoginVerification from "../pages/auth/PostLoginVerification";

import CategoryList from "../pages/products/CategoryList";
import ProductListByCategory from "../pages/products/ProductListByCategory";
import ProductList from "../pages/products/ProductList";
import ProductDetails from "../pages/products/ProductDetails";

import Cart from "../pages/private/Cart";
import Checkout from "../pages/private/Checkout";
import MyOrders from "../pages/private/MyOrders";
import OrderDetails from "../pages/private/OrderDetails";
import OrderSuccess from "../pages/private/OrderSuccess";

import EnquiryForm from "../pages/govt/EnquiryForm";
import MyEnquiries from "../pages/govt/MyEnquiries";
import MyQuotes from "../pages/govt/MyQuotes";
import QuoteDetails from "../pages/govt/QuoteDetails";

import MyServiceEnquiries from "../pages/services/MyServiceEnquiries";
import MyServiceQuotes from "../pages/services/MyServiceQuotes";
import ServiceQuoteDetails from "../pages/services/ServiceQuoteDetails";
import Register from "../pages/auth/Register";
import AdminRoute from "../components/AdminRoute";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminProductForm from "../pages/admin/AdminProductForm";
import AdminQuoteCreate from "../pages/admin/quotes/AdminQuoteCreate";
import AdminQuoteDetails from "../pages/admin/quotes/AdminQuoteDetails";
import AdminEnquiries from "../pages/admin/Enquiries/AdminEnquiries";
import AdminOrderDetails from "../pages/admin/orders/AdminOrderDetails";
import AdminDashboard from "../pages/admin/dashboard/AdminDashboard";
import { useAuthStore } from "../store/authStore";
import AdminOrders from "../pages/admin/orders/AdminOrders";
import AdminEnquiryDetails from "../pages/admin/Enquiries/AdminEnquiryDetails";
import AdminQuotes from "../pages/admin/quotes/AdminQuotes";
import AdminServiceEnquiries from "../pages/admin/services/AdminServiceEnquiries";
import AdminServiceEnquiryDetails from "../pages/admin/services/AdminServiceEnquiryDetails";
import AdminServiceQuoteCreate from "../pages/admin/services/AdminServiceQuoteCreate";
import InvoicePrint from "../pages/private/InvoicePrint";
import ProductListGuest from "../pages/products/ProductListGuest";
import ServiceList from "../pages/services/ServicesList";
import ProductDetailsGuest from "../pages/products/ProductDetailsGuest";
import ServiceEnquiry from "../pages/services/ServiceEnquiry";

export default function AppRoutes() {
  const user = useAuthStore((state) => state.user);
  const isInit = useAuthStore((state) => state?.isInit);
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products-guest" element={<ProductListGuest />} />
      <Route path="/products-guest/:id" element={<ProductDetailsGuest />} />
      <Route path="/services" element={<ServiceList />} />
      <Route path="/services/enquiry" element={<ServiceEnquiry />} />
      <Route
        path="/verify-account"
        element={
          <VerificationRoute>
            <PostLoginVerification />
          </VerificationRoute>
        }
      />

      {/* Protected Routes - Use ProtectedRoute for general protection */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <CategoryList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products/category/:category"
        element={
          <ProtectedRoute>
            <ProductListByCategory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products/all"
        element={
          <ProtectedRoute>
            <ProductList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products/:id"
        element={
          <ProtectedRoute>
            <ProductDetails />
          </ProtectedRoute>
        }
      />

      {/* Private — Retail */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:id/invoice"
        element={
          <ProtectedRoute>
            <InvoicePrint />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-success"
        element={
          <ProtectedRoute>
            <OrderSuccess />
          </ProtectedRoute>
        }
      />

      {/* Govt Procurement - These need post-login verification check */}
      <Route
        path="/enquiry"
        element={
          <PostLoginVerificationRoute>
            <EnquiryForm />
          </PostLoginVerificationRoute>
        }
      />
      <Route
        path="/enquiries"
        element={
          <PostLoginVerificationRoute>
            <MyEnquiries />
          </PostLoginVerificationRoute>
        }
      />

      <Route
        path="/quotes"
        element={
          <PostLoginVerificationRoute>
            <MyQuotes />
          </PostLoginVerificationRoute>
        }
      />
      <Route
        path="/quotes/:id"
        element={
          <PostLoginVerificationRoute>
            <QuoteDetails />
          </PostLoginVerificationRoute>
        }
      />
      <Route
        path="/quotes/enquiry/:enquiryId"
        element={
          <PostLoginVerificationRoute>
            <QuoteDetails />
          </PostLoginVerificationRoute>
        }
      />

      {/* Services (Common for Govt + Private) - These need post-login verification check */}
      <Route
        path="/service-enquiries"
        element={
          <PostLoginVerificationRoute>
            <MyServiceEnquiries />
          </PostLoginVerificationRoute>
        }
      />
      <Route
        path="/service-quotes"
        element={
          <PostLoginVerificationRoute>
            <MyServiceQuotes />
          </PostLoginVerificationRoute>
        }
      />
      <Route
        path="/service-quotes/:id"
        element={
          <PostLoginVerificationRoute>
            <ServiceQuoteDetails />
          </PostLoginVerificationRoute>
        }
      />
      <Route
        path="/service-quotes/enquiry/:enquiryId"
        element={
          <PostLoginVerificationRoute>
            <ServiceQuoteDetails />
          </PostLoginVerificationRoute>
        }
      />
      {/* ——— ADMIN SECTION ——— */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/products"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/products/new"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminProductForm mode="create" />
            </AdminRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/products/:id"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminProductForm mode="edit" />
            </AdminRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/orders/:id"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminOrderDetails />
            </AdminRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/enquiries"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminEnquiries />
            </AdminRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/enquiries/:id"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminEnquiryDetails />
            </AdminRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/quotes"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminQuotes />
            </AdminRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/quotes/:id"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminQuoteDetails />
            </AdminRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/enquiries/:id/create-quote"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminQuoteCreate />
            </AdminRoute>
          </ProtectedRoute>
        }
      />

      {/* Admin Service Routes */}
      <Route
        path="/admin/service-enquiries"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminServiceEnquiries />
            </AdminRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/service-enquiries/:id"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminServiceEnquiryDetails />
            </AdminRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/service-enquiries/:id/create-quote"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminServiceQuoteCreate />
            </AdminRoute>
          </ProtectedRoute>
        }
      />

      {/* Catch-all for authenticated users */}
      <Route
        path="*"
        element={
          user ? (
            user.roles?.includes("admin") ? (
              <AdminDashboard />
            ) : (
              <Home />
            )
          ) : (
            <Login />
          ) // or a GuestLanding page
        }
      />
    </Routes>
  );
}
