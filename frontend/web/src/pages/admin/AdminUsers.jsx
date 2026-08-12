import { useEffect, useMemo, useState } from "react";
import { motion as Motion } from "framer-motion";
import {
  Search,
  UserRound,
  ShieldCheck,
  ShieldOff,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
  Check,
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
  fetchAllUsers,
  fetchUser,
  updateUser,
  deleteUser,
  toggleUserActive,
} from "../../api/adminUsers";
import { API_URL } from "../../api/client";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/ui";
import { containerVariants, fadeInVariants } from "../../utils/animations";

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "private_client", label: "Private Client" },
  { value: "public_sector_client", label: "Govt Client" },
];

const CLIENT_TYPES = [
  { value: "", label: "All" },
  { value: "PRIVATE", label: "Private" },
  { value: "PUBLIC", label: "Government" },
];

export default function AdminUsers() {
  const { accessToken } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [clientType, setClientType] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  const limit = 10;

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await fetchAllUsers({
        search,
        clientType,
        page,
        limit,
      });
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, [clientType, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadUsers();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  async function handleSaveUser() {
    if (!editingUser) return;
    setSaving(true);
    try {
      const data = await updateUser(editingUser._id, editingUser);
      toast.success(data.message || "User updated");
      setEditingUser(null);
      loadUsers();
    } catch (err) {
      toast.error(err.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteUser(id) {
    try {
      await deleteUser(id);
      toast.success("User deleted");
      setShowDeleteConfirm(null);
      loadUsers();
    } catch (err) {
      toast.error(err.message || "Failed to delete user");
    }
  }

  async function handleToggleActive(id) {
    try {
      const data = await toggleUserActive(id);
      toast.success(data.message);
      loadUsers();
    } catch (err) {
      toast.error(err.message || "Failed to update user status");
    }
  }

  const startIndex = (page - 1) * limit + 1;

  return (
    <Motion.div
      className="space-y-5"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Motion.section variants={fadeInVariants} className="hero-shell rounded-lg p-5 sm:p-6 lg:p-7">
        <div className="relative z-10">
          <span className="signal-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            Admin Control
          </span>
          <h1 className="mt-4 text-2xl font-bold text-slate-950 dark:text-white sm:text-3xl">
            Users
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            Manage customer and government accounts. Deactivate accounts to block login.
          </p>
        </div>
      </Motion.section>

      <Motion.section variants={fadeInVariants} className="theme-card rounded-lg p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="theme-input pl-9"
              />
            </div>
            <select
              value={clientType}
              onChange={(e) => setClientType(e.target.value)}
              className="theme-input w-auto"
            >
              {CLIENT_TYPES.map((ct) => (
                <option key={ct.value} value={ct.value}>
                  {ct.label}
                </option>
              ))}
            </select>
          </div>
          <Button variant="secondary" size="sm" onClick={loadUsers}>
            <RefreshCw size={15} />
            Refresh
          </Button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/75 dark:border-cyan-950/45">
                <th className="pb-3 font-semibold text-slate-500 dark:text-slate-400">Name</th>
                <th className="pb-3 font-semibold text-slate-500 dark:text-slate-400">Email</th>
                <th className="pb-3 font-semibold text-slate-500 dark:text-slate-400">Type</th>
                <th className="pb-3 font-semibold text-slate-500 dark:text-slate-400">Status</th>
                <th className="pb-3 font-semibold text-slate-500 dark:text-slate-400">Joined</th>
                <th className="pb-3 text-right font-semibold text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/75 dark:divide-cyan-950/45">
              {loading && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Loading users...
                  </td>
                </tr>
              )}
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    No users found.
                  </td>
                </tr>
              )}
              {!loading &&
                users.map((user) => (
                  <tr key={user._id} className="transition hover:bg-slate-50/65 dark:hover:bg-slate-900/70">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-950/25 dark:text-cyan-200">
                          <UserRound size={16} />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">{user.email}</td>
                    <td className="py-3">
                      <span className="rounded-full border border-slate-200 bg-white/70 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {user.clientType === "PUBLIC" ? "Govt" : "Private"}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          user.isActive
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-200"
                            : "bg-red-50 text-red-700 dark:bg-red-950/25 dark:text-red-200"
                        }`}
                      >
                        {user.isActive ? "Active" : "Deactivated"}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-cyan-50 hover:text-cyan-700 dark:hover:bg-cyan-950/25 dark:hover:text-cyan-200"
                          title="Edit"
                        >
                          <UserRound size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleActive(user._id)}
                          className={`rounded-lg p-2 transition ${
                            user.isActive
                              ? "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/25"
                              : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/25"
                          }`}
                          title={user.isActive ? "Deactivate" : "Activate"}
                        >
                          {user.isActive ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(user)}
                          className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/25"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
            <span>
              Showing {startIndex}-{Math.min(startIndex + limit - 1, total)} of {total}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft size={16} />
                Previous
              </Button>
              <span className="text-xs">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </Motion.section>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="theme-card max-h-[90vh] w-full max-w-lg overflow-hidden rounded-[24px]">
            <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-4 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Edit User</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4 p-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Name</label>
                <input
                  type="text"
                  className="theme-input mt-1"
                  value={editingUser.name || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
                <input
                  type="email"
                  className="theme-input mt-1"
                  value={editingUser.email || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Client Type</label>
                <select
                  className="theme-input mt-1"
                  value={editingUser.clientType || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, clientType: e.target.value })}
                >
                  <option value="PRIVATE">Private</option>
                  <option value="PUBLIC">Government</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Roles</label>
                <select
                  className="theme-input mt-1"
                  value={(editingUser.roles || [])[0] || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, roles: [e.target.value] })}
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingUser.isActive !== false}
                  onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300"
                />
                <label htmlFor="isActive" className="text-sm text-slate-700 dark:text-slate-300">
                  Active
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" onClick={() => setEditingUser(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveUser} isLoading={saving}>
                  <Check size={16} />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="theme-card max-w-sm rounded-[24px] p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/25 dark:text-red-200">
              <Trash2 size={22} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Delete User</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Are you sure you want to delete <strong>{showDeleteConfirm.name}</strong>? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Button variant="secondary" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteUser(showDeleteConfirm._id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </Motion.div>
  );
}
