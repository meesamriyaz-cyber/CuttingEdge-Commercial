import {Link} from "react-router-dom";
export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-surface gap-6">

      <aside className="w-64 bg-white border rounded-md p-4">
        <h3 className="font-semibold text-slate-800 mb-3">Admin Panel</h3>

        <nav className="space-y-2 text-sm">
          <Link href="/admin/dashboard" className="block">Dashboard</Link>
          <Link href="/admin/products" className="block">Products</Link>
          <Link to="/admin/orders" className="block">Orders</Link>
          <Link href="/admin/enquiries" className="block">Govt Enquiries</Link>
          <Link href="/admin/quotes" className="block">Quotes</Link>
        </nav>
      </aside>

      <main className="flex-1">
        {children}
      </main>

    </div>
  );
}
