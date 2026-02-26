import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAdminQuotes } from "../../../api/adminQuotes";

import {
  Users,
  ShoppingCart,
  MessageSquare,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PlusCircle,
  Settings,
  Activity,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HoverPulse,
  FloatingElement,
  BounceIn,
  CardFlip,
} from "../../../components/MicroInteractions";
import { fetchAdminEnquiries } from "../../../api/adminEnquiries";
import { useAuthStore } from "../../../store/authStore";
import { API_URL } from "../../../api/client";

// Mock data for non-enquiry stats - replace with actual API calls
/* const mockStats = {
  totalOrders: 156,
  totalRevenue: 89450,
  activeQuotes: 1,
  newCustomers: 12,
}; */

const mockRecentActivity = [
  {
    id: 1,
    type: "order",
    title: "New Order #ORD-2024-001",
    time: "2 minutes ago",
    status: "pending",
  },
  {
    id: 3,
    type: "quote",
    title: "Quote generated for ABC Corp",
    time: "1 hour ago",
    status: "sent",
  },
  {
    id: 4,
    type: "customer",
    title: "New customer registered",
    time: "2 hours ago",
    status: "completed",
  },
  {
    id: 5,
    type: "order",
    title: "Order #ORD-2024-002 shipped",
    time: "4 hours ago",
    status: "completed",
  },
];

const mockQuickActions = [
  {
    id: 1,
    title: "Create New Product",
    icon: PlusCircle,
    color: "from-blue-500 to-cyan-500",
    href: "/admin/products",
  },
  {
    id: 2,
    title: "Manage Orders",
    icon: ShoppingCart,
    color: "from-green-500 to-emerald-500",
    href: "/admin/orders",
  },
  {
    id: 3,
    title: "Product Enquiries",
    icon: MessageSquare,
    color: "from-purple-500 to-pink-500",
    href: "/admin/enquiries",
  },
  {
    id: 4,
    title: "Service Enquiries",
    icon: MessageSquare,
    color: "from-orange-500 to-red-500",
    href: "/admin/service-enquiries",
  },
];

export default function AdminDashboard() {
  const { accessToken } = useAuthStore();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeQuotes: 0,
    newCustomers: 0,
    pendingEnquiries: 0,
    pendingServiceEnquiries: 0,
  });
  const [time, setTime] = useState(new Date());
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quoteStats, setQuoteStats] = useState({
    total: 0,
    active: 0,
    accepted: 0,
    rejected: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch all dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // Load orders
        const ordersRes = await fetch(`${API_URL}/admin/orders`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const ordersData = await ordersRes.json();
        const ordersList = Array.isArray(ordersData) ? ordersData : [];

        // Calculate order stats
        const totalRevenue = ordersList.reduce(
          (sum, order) =>
            sum + (order.pricing?.grandTotal || order.totalAmount || 0),
          0,
        );

        // Load enquiries
        const data = await fetchAdminEnquiries();
        const enquiryList = data.enquiries || data || [];
        setEnquiries(enquiryList);

        // Count pending enquiries
        const pendingCount = enquiryList.filter(
          (enq) => enq.status === "NEW" || enq.status === "IN_REVIEW",
        ).length;

        // Load service enquiries
        let pendingServiceCount = 0;
        try {
          const serviceRes = await fetch(`${API_URL}/admin/service-enquiries`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const serviceData = await serviceRes.json();
          const serviceEnquiries = serviceData.enquiries || [];
          pendingServiceCount = serviceEnquiries.filter(
            (enq) => enq.status === "NEW" || enq.status === "IN_PROGRESS",
          ).length;
        } catch (serviceErr) {
          console.error("Failed to load service enquiries:", serviceErr);
        }

        // Load users for new customers count
        let newCustomers = 0;
        try {
          const usersRes = await fetch(`${API_URL}/admin/users`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (usersRes.ok) {
            const usersData = await usersRes.json();
            const users = usersData.users || [];
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            newCustomers = users.filter((user) => {
              const userDate = new Date(user.createdAt);
              return userDate >= thirtyDaysAgo;
            }).length;
          }
        } catch (userErr) {
          console.error("Failed to load users:", userErr);
        }

        setStats({
          totalOrders: ordersList.length,
          totalRevenue: totalRevenue,
          pendingEnquiries: pendingCount,
          pendingServiceEnquiries: pendingServiceCount,
          newCustomers: newCustomers,
          activeQuotes: 0, // Will be updated by loadQuoteStats
        });
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      loadDashboardData();
    }

    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      if (accessToken) {
        loadDashboardData();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [accessToken]);

  useEffect(() => {
    const loadQuoteStats = async () => {
      try {
        const quotes = await fetchAdminQuotes();

        const list = Array.isArray(quotes) ? quotes : quotes.quotes || [];
        const activeCount = list.filter((q) => q.status === "SENT").length;

        setQuoteStats({
          total: list.length,
          active: activeCount,
          accepted: list.filter((q) => q.status === "ACCEPTED").length,
          rejected: list.filter((q) => q.status === "REJECTED").length,
        });

        setStats((prev) => ({
          ...prev,
          activeQuotes: activeCount,
        }));
      } catch (err) {
        console.error("Failed to load quote stats", err);
      }
    };

    loadQuoteStats();
  }, []);

  // Generate real-time enquiry activities
  const getEnquiryActivities = () => {
    if (!enquiries.length) return [];

    return enquiries
      .slice(0, 5) // Show last 5 enquiries
      .map((enq) => ({
        id: `enq-${enq._id}`,
        type: "enquiry",
        title: `Enquiry from ${enq.user?.organizationName || enq.user?.name || "Customer"}`,
        time: new Date(enq.createdAt).toLocaleDateString(),
        status: enq.status.toLowerCase(),
        enquiryId: enq._id.slice(-6),
      }));
  };

  const allRecentActivity = getEnquiryActivities();

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
    <HoverPulse>
      <motion.div
        className="bg-surface border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-lg bg-gradient-to-br ${color} text-white shadow-lg`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend === "up" ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {trendValue}
            </div>
          )}
        </div>
      </motion.div>
    </HoverPulse>
  );

  const ActivityItem = ({ activity }) => {
    const getTypeIcon = (type) => {
      switch (type) {
        case "order":
          return ShoppingCart;
        case "enquiry":
          return MessageSquare;
        case "quote":
          return DollarSign;
        case "customer":
          return Users;
        default:
          return Activity;
      }
    };

    const getTypeColor = (type) => {
      switch (type) {
        case "order":
          return "text-blue-600 bg-blue-100";
        case "enquiry":
          return "text-purple-600 bg-purple-100";
        case "quote":
          return "text-green-600 bg-green-100";
        case "customer":
          return "text-orange-600 bg-orange-100";
        default:
          return "text-gray-600 bg-gray-100";
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case "completed":
        case "delivered":
          return "bg-green-100 text-green-700 border border-green-200";
        case "pending":
        case "processing":
          return "bg-yellow-100 text-yellow-700 border border-yellow-200";
        case "new":
        case "placed":
          return "bg-blue-100 text-blue-700 border border-blue-200";
        default:
          return "bg-gray-100 text-gray-700 border border-gray-200";
      }
    };

    const Icon = getTypeIcon(activity.type);

    return (
      <motion.div
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
        whileHover={{ x: 4 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className={`p-2 rounded-lg ${getTypeColor(activity.type)}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
          <p className="text-xs text-gray-500">{activity.time}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}
          >
            {activity.status}
          </span>
        </div>
      </motion.div>
    );
  };

  const QuickActionCard = ({ action }) => {
    const Icon = action.icon;

    return (
      <HoverPulse>
        <motion.div
          className="group relative overflow-hidden rounded-xl border border-gray-200 bg-surface p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ y: -2, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <Link to={action.href}>
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300" />

            <div className="relative flex items-center gap-4">
              <div
                className={`p-3 rounded-lg bg-gradient-to-br ${action.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">Quick action</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-gray-500">Click to proceed</span>
              <motion.div
                className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
              >
                <svg
                  className="w-3 h-3 text-gray-600 group-hover:text-white transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.div>
            </div>
          </Link>
        </motion.div>
      </HoverPulse>
    );
  };

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="space-y-6 animate-fade-in max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          <div className="flex-1">
            <BounceIn delay={0.1}>
              <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 rounded-2xl p-8 text-white relative overflow-hidden">
                <FloatingElement delay={0}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-xl" />
                </FloatingElement>

                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">
                        Admin Dashboard
                      </h1>
                      <p className="text-blue-100">
                        Welcome back, Administrator
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-blue-100">Last updated</div>
                      <div className="text-lg font-semibold">
                        {time.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="text-2xl font-bold">
                        {stats.totalOrders}
                      </div>
                      <div className="text-sm text-blue-100">Total Orders</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="text-2xl font-bold">
                        ₹{stats.totalRevenue.toLocaleString()}
                      </div>
                      <div className="text-sm text-blue-100">Total Revenue</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="text-2xl font-bold">
                        {stats.pendingEnquiries}
                      </div>
                      <div className="text-sm text-blue-100">
                        Product Enquiries
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="text-2xl font-bold">
                        {stats.pendingServiceEnquiries}
                      </div>
                      <div className="text-sm text-blue-100">
                        Service Enquiries
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </BounceIn>
          </div>

          <div className="lg:w-80 space-y-4">
            <BounceIn delay={0.2}>
              <div className="bg-surface rounded-xl border border-gray-200 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    Quick Stats
                  </h3>
                  <Calendar className="w-5 h-5 text-gray-500" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Active Quotes
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {stats.activeQuotes}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      New Customers
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {stats.newCustomers}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Avg. Response Time
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      2.5h
                    </span>
                  </div>
                </div>
              </div>
            </BounceIn>

            <BounceIn delay={0.3}>
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">System Status</h3>
                    <p className="text-purple-100 text-sm">
                      All systems operational
                    </p>
                  </div>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                </div>
              </div>
            </BounceIn>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingCart}
            trend="up"
            trendValue="+12%"
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            trend="up"
            trendValue="+8.5%"
            color="from-green-500 to-emerald-500"
          />
          <StatCard
            title="Pending Enquiries"
            value={stats.pendingEnquiries}
            icon={MessageSquare}
            trend="down"
            trendValue="-3"
            color="from-purple-500 to-pink-500"
          />
          <StatCard
            title="Active Quotes"
            value={quoteStats.active}
            icon={DollarSign}
            trend="up"
            trendValue=""
            color="from-orange-500 to-red-500"
          />
          <StatCard
            title="Total Quotes"
            value={quoteStats.total}
            icon={DollarSign}
            color="from-green-500 to-emerald-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <BounceIn delay={0.4}>
              <div className="bg-surface rounded-xl border border-gray-200 shadow-lg">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Activity
                  </h3>
                </div>
                <div className="divide-y divide-gray-200">
                  <AnimatePresence>
                    {allRecentActivity.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ActivityItem activity={activity} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <Link
                    to="/admin/enquiries"
                    className="w-full block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All Enquiries
                  </Link>
                </div>
              </div>
            </BounceIn>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <BounceIn delay={0.5}>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-4">
                  {mockQuickActions.map((action) => (
                    <QuickActionCard key={action.id} action={action} />
                  ))}
                </div>
              </div>
            </BounceIn>

            {/* Service Enquiries Summary */}
            <BounceIn delay={0.6}>
              <div className="bg-surface rounded-xl p-6 border border-gray-200 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    Service Enquiries
                  </h3>
                  <MessageSquare className="w-5 h-5 text-orange-500" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Pending Review
                    </span>
                    <span className="text-lg font-bold text-orange-600">
                      {stats.pendingServiceEnquiries}
                    </span>
                  </div>
                  <Link
                    to="/admin/service-enquiries"
                    className="block w-full text-center mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                  >
                    View All
                  </Link>
                </div>
              </div>
            </BounceIn>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BounceIn delay={0.7}>
            <Link to="/admin/enquiries">
              <div className="bg-surface rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-shadow shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-purple-100">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Product Enquiries
                    </h4>
                    <p className="text-sm text-gray-600">
                      Pending review
                    </p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.pendingEnquiries}
                </div>
              </div>
            </Link>
          </BounceIn>

          <BounceIn delay={0.8}>
            <Link to="/admin/service-enquiries">
              <div className="bg-surface rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-shadow shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-orange-100">
                    <MessageSquare className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Service Enquiries
                    </h4>
                    <p className="text-sm text-gray-600">
                      Pending review
                    </p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.pendingServiceEnquiries}
                </div>
              </div>
            </Link>
          </BounceIn>

          <BounceIn delay={0.9}>
            <Link to="/admin/quotes">
              <div className="bg-surface rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-shadow shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-green-100">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Active Quotes
                    </h4>
                    <p className="text-sm text-gray-600">
                      Sent & awaiting response
                    </p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {quoteStats.active}
                </div>
              </div>
            </Link>
          </BounceIn>
        </div>
      </div>
    </div>
  );
}
