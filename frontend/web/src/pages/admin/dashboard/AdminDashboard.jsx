import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Calendar,
  ClipboardList,
  FileText,
  LifeBuoy,
  Package,
  ReceiptText,
  ShoppingCart,
  Users,
} from "lucide-react";
import { motion as Motion } from "framer-motion";

import { fetchAdminEnquiries } from "../../../api/adminEnquiries";
import { fetchAdminQuotes } from "../../../api/adminQuotes";
import { API_URL } from "../../../api/client";
import { useAuthStore } from "../../../store/authStore";
import { Button } from "../../../components/ui";
import { containerVariants, fadeInVariants } from "../../../utils/animations";

function formatDate(value) {
  if (!value) return "Not recorded";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatMoney(value) {
  return `INR ${Number(value || 0).toLocaleString("en-IN")}`;
}

function buildSalesSeries(orders = []) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    return {
      key,
      label: new Intl.DateTimeFormat("en-IN", { month: "short" }).format(date),
      orders: 0,
      revenue: 0,
    };
  });
  const byKey = new Map(months.map((month) => [month.key, month]));

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    if (Number.isNaN(date.getTime())) return;

    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const bucket = byKey.get(key);
    if (!bucket) return;

    bucket.orders += 1;
    bucket.revenue += order.pricing?.grandTotal || order.totalAmount || order.total || 0;
  });

  return months;
}

function StatCard({ title, value, description, icon: Icon, tone = "cyan" }) {
  const toneClass = {
    cyan: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/25 dark:text-cyan-200",
    amber: "bg-orange-50 text-orange-700 dark:bg-orange-950/25 dark:text-orange-200",
    emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-200",
    slate: "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200",
  }[tone];

  return (
    <Motion.div variants={fadeInVariants} className="theme-card rounded-lg p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
            {value}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${toneClass}`}>
          <Icon size={21} />
        </div>
      </div>
    </Motion.div>
  );
}

function ActivityRow({ activity }) {
  return (
    <Link
      to={activity.to}
      className="flex items-center gap-3 rounded-lg px-3 py-3 transition hover:bg-cyan-50/65 dark:hover:bg-slate-900/70"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-950/25 dark:text-cyan-200">
        <activity.icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
          {activity.title}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {activity.meta}
        </p>
      </div>
      <span className="rounded-full border border-slate-200 bg-white/70 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:border-cyan-950/50 dark:bg-slate-950/35 dark:text-slate-300">
        {activity.status}
      </span>
    </Link>
  );
}

function SalesChart({ data, loading }) {
  const maxRevenue = Math.max(1, ...data.map((item) => item.revenue));
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);

  return (
    <section className="theme-card rounded-lg p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">
            Sales overview
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Revenue trend from recent orders.
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-950/25 dark:text-cyan-200">
          <BarChart3 size={20} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-slate-200/80 bg-white/72 p-3 dark:border-cyan-950/50 dark:bg-slate-950/35">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Six-month sales
          </p>
          <p className="mt-1 text-lg font-bold text-slate-950 dark:text-white">
            {loading ? "..." : formatMoney(totalRevenue)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200/80 bg-white/72 p-3 dark:border-cyan-950/50 dark:bg-slate-950/35">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Orders
          </p>
          <p className="mt-1 text-lg font-bold text-slate-950 dark:text-white">
            {loading ? "..." : totalOrders}
          </p>
        </div>
      </div>

      <div className="mt-5 flex h-44 items-end gap-2 rounded-lg border border-slate-200/80 bg-white/60 p-3 dark:border-cyan-950/50 dark:bg-slate-950/30">
        {data.map((item) => {
          const height = loading ? 32 : Math.max(14, Math.round((item.revenue / maxRevenue) * 128));

          return (
            <div key={item.key} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2">
              <div className="flex h-32 w-full items-end justify-center">
                <div
                  className="w-full max-w-8 rounded-t-lg bg-[linear-gradient(180deg,#0f766e_0%,#d97706_100%)] shadow-[0_14px_28px_-22px_rgba(8,16,29,0.75)] transition-all"
                  style={{ height }}
                  title={`${item.label}: ${formatMoney(item.revenue)}`}
                />
              </div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function AdminDashboard() {
  const { accessToken, user } = useAuthStore();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeQuotes: 0,
    totalQuotes: 0,
    newCustomers: 0,
    pendingEnquiries: 0,
    pendingServiceEnquiries: 0,
  });
  const [enquiries, setEnquiries] = useState([]);
  const [salesSeries, setSalesSeries] = useState(() => buildSalesSeries([]));
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);

        const ordersRes = await fetch(`${API_URL}/admin/orders`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const ordersData = await ordersRes.json();
        const ordersList = Array.isArray(ordersData) ? ordersData : ordersData.orders || [];
        const totalRevenue = ordersList.reduce(
          (sum, order) => sum + (order.pricing?.grandTotal || order.totalAmount || order.total || 0),
          0,
        );
        setSalesSeries(buildSalesSeries(ordersList));

        const enquiryData = await fetchAdminEnquiries();
        const enquiryList = enquiryData.enquiries || enquiryData || [];
        setEnquiries(enquiryList);

        let pendingServiceCount = 0;
        try {
          const serviceRes = await fetch(`${API_URL}/admin/service-enquiries`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const serviceData = await serviceRes.json();
          const serviceEnquiries = serviceData.enquiries || [];
          pendingServiceCount = serviceEnquiries.filter((enq) =>
            ["NEW", "IN_PROGRESS", "IN_REVIEW"].includes(enq.status),
          ).length;
        } catch (error) {
          console.error("Failed to load service enquiries:", error);
        }

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
            newCustomers = users.filter((currentUser) => {
              const createdAt = new Date(currentUser.createdAt);
              return createdAt >= thirtyDaysAgo;
            }).length;
          }
        } catch (error) {
          console.error("Failed to load users:", error);
        }

        let quoteList = [];
        try {
          const quoteData = await fetchAdminQuotes();
          quoteList = Array.isArray(quoteData) ? quoteData : quoteData.quotes || [];
        } catch (error) {
          console.error("Failed to load quote stats:", error);
        }

        setStats({
          totalOrders: ordersList.length,
          totalRevenue,
          pendingEnquiries: enquiryList.filter((enq) =>
            ["NEW", "IN_REVIEW"].includes(enq.status),
          ).length,
          pendingServiceEnquiries: pendingServiceCount,
          newCustomers,
          activeQuotes: quoteList.filter((quote) => quote.status === "SENT").length,
          totalQuotes: quoteList.length,
        });
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (accessToken) {
      loadDashboardData();
      const interval = setInterval(loadDashboardData, 30000);
      return () => clearInterval(interval);
    }

    return undefined;
  }, [accessToken]);

  const recentActivities = useMemo(
    () =>
      enquiries.slice(0, 5).map((enquiry) => ({
        title: enquiry.user?.organizationName || enquiry.user?.name || "Customer enquiry",
        meta: `${formatDate(enquiry.createdAt)} - ${enquiry._id?.slice(-6) || "request"}`,
        status: enquiry.status || "NEW",
        to: `/admin/enquiries/${enquiry._id}`,
        icon: ClipboardList,
      })),
    [enquiries],
  );

  return (
    <Motion.div
      className="space-y-5"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Motion.section variants={fadeInVariants} className="hero-shell rounded-lg p-5 sm:p-6 lg:p-7">
        <div className="relative z-10 grid gap-6 xl:grid-cols-[1fr_280px] xl:items-end">
          <div>
            <span className="signal-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Admin Control
            </span>
            <h1 className="mt-4 text-2xl font-bold text-slate-950 dark:text-white sm:text-3xl">
              Operations dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              Monitor orders, enquiries, quotations, and service requests from one consistent workspace.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button to="/admin/products/new">
                <Package size={18} />
                New Product
              </Button>
              <Button variant="secondary" to="/admin/enquiries">
                <ClipboardList size={18} />
                Review Enquiries
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200/80 bg-white/72 p-4 shadow-sm backdrop-blur dark:border-cyan-950/50 dark:bg-slate-950/35">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-200">
                <BadgeCheck size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-950 dark:text-white">
                  System operational
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Signed in as {user?.name || "Administrator"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Calendar size={14} />
              {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString("en-IN")}` : "Waiting for data"}
            </div>
          </div>
        </div>
      </Motion.section>

      <Motion.section variants={containerVariants} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Orders"
          value={loading ? "..." : stats.totalOrders}
          description="Total customer orders"
          icon={ShoppingCart}
        />
        <StatCard
          title="Revenue"
          value={loading ? "..." : formatMoney(stats.totalRevenue)}
          description="Recorded order value"
          icon={ReceiptText}
          tone="amber"
        />
        <StatCard
          title="Enquiries"
          value={loading ? "..." : stats.pendingEnquiries}
          description="Product requests pending"
          icon={ClipboardList}
          tone="emerald"
        />
        <StatCard
          title="Service"
          value={loading ? "..." : stats.pendingServiceEnquiries}
          description="Service requests pending"
          icon={LifeBuoy}
          tone="slate"
        />
      </Motion.section>

      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <Motion.section variants={fadeInVariants} className="theme-card rounded-lg p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                Recent product enquiries
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Latest government/customer requests that need admin attention.
              </p>
            </div>
            <Button variant="secondary" size="sm" to="/admin/enquiries">
              View all
              <ArrowRight size={15} />
            </Button>
          </div>

          <div className="divide-y divide-slate-200/75 dark:divide-cyan-950/45">
            {loading && (
              <div className="px-3 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                Loading enquiries...
              </div>
            )}
            {!loading && recentActivities.length === 0 && (
              <div className="px-3 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                No recent enquiries yet.
              </div>
            )}
            {!loading &&
              recentActivities.map((activity) => (
                <ActivityRow key={activity.to} activity={activity} />
              ))}
          </div>
        </Motion.section>

        <Motion.aside variants={fadeInVariants} className="space-y-5">
          <SalesChart data={salesSeries} loading={loading} />

          <section className="theme-card rounded-lg p-4">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">
              Quote overview
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-200/80 bg-white/72 p-3 dark:border-cyan-950/50 dark:bg-slate-950/35">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Active
                </p>
                <p className="mt-1 text-xl font-bold text-slate-950 dark:text-white">
                  {loading ? "..." : stats.activeQuotes}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200/80 bg-white/72 p-3 dark:border-cyan-950/50 dark:bg-slate-950/35">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Total
                </p>
                <p className="mt-1 text-xl font-bold text-slate-950 dark:text-white">
                  {loading ? "..." : stats.totalQuotes}
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm" to="/admin/quotes" className="mt-4 w-full">
              <FileText size={16} />
              Manage Quotes
            </Button>
          </section>

          <section className="theme-card rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-700 dark:bg-orange-950/25 dark:text-orange-200">
                <Users size={19} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-950 dark:text-white">
                  New customers
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Last 30 days
                </p>
              </div>
              <p className="ml-auto text-2xl font-bold text-slate-950 dark:text-white">
                {loading ? "..." : stats.newCustomers}
              </p>
            </div>
          </section>
        </Motion.aside>
      </div>
    </Motion.div>
  );
}
