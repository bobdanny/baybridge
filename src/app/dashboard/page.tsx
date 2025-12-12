"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit2,
  UserCheck,
  Shield,
  Headphones,
  DollarSign,
  Grid,
  Lock,
  User,
  Archive,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/*
  UserManagementPage.tsx
  - Single-file responsive User Management screen for a Hotel Management System
  - Next.js (client component) + Tailwind CSS
  - Desktop: left sidebar, topbar, table-style list, filters, pagination
  - Mobile: topbar, card-list, FAB to add user, collapsible permissions

  Notes:
  - Replace icons / images with your assets
  - Hook this page into your routes at /dashboard/users
  - This is intentionally self-contained for copy/paste
*/

type Role = "Admin" | "Manager" | "Receptionist" | "Accountant";

type UserItem = {
  id: string;
  avatar?: string;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
  active: boolean;
  permissions: string[];
};

const MOCK_USERS: UserItem[] = Array.from({ length: 23 }).map((_, i) => ({
  id: String(i + 1),
  avatar: undefined,
  fullName: ["Aisha Bello", "Daniel O.", "Emma Carter", "Olu Johnson"][i % 4] + ` ${i + 1}`,
  email: `user${i + 1}@hotel.example`,
  phone: `+234 800 000 ${1000 + i}`,
  role: (i % 4 === 0 ? "Admin" : i % 4 === 1 ? "Manager" : i % 4 === 2 ? "Receptionist" : "Accountant") as Role,
  active: i % 5 !== 0,
  permissions: [
    "Create Reservation",
    ...(i % 3 === 0 ? ["Access Finance"] : []),
  ],
}));

function RoleIcon({ role }: { role: Role }) {
  switch (role) {
    case "Admin":
      return <Shield className="w-4 h-4 mr-1" />;
    case "Manager":
      return <Grid className="w-4 h-4 mr-1" />;
    case "Receptionist":
      return <Headphones className="w-4 h-4 mr-1" />;
    case "Accountant":
      return <DollarSign className="w-4 h-4 mr-1" />;
    default:
      return <User className="w-4 h-4 mr-1" />;
  }
}

export default function UserManagementPage() {
  const [query, setQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<UserItem | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_USERS.filter((u) => {
      if (filterRole !== "All" && u.role !== filterRole) return false;
      if (filterStatus !== "All") {
        if (filterStatus === "Active" && !u.active) return false;
        if (filterStatus === "Disabled" && u.active) return false;
      }
      if (!q) return true;
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone || "").includes(q)
      );
    });
  }, [query, filterRole, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  function openAdd(user?: UserItem) {
    setEditing(user || null);
    setShowAdd(true);
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Desktop layout: sidebar + content */}
      <div className="hidden md:flex">
        

        <main className="flex-1 p-8">
          <TopBar
            query={query}
            setQuery={setQuery}
            onAdd={() => openAdd()}
            filterRole={filterRole}
            setFilterRole={setFilterRole}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />

          <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="py-3 px-3">User</th>
                    <th className="py-3 px-3">Email</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Permissions</th>
                    <th className="py-3 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pageItems.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-gray-100 w-9 h-9 flex items-center justify-center overflow-hidden">
                            {u.avatar ? (
                              <Image src={u.avatar} alt={u.fullName} width={36} height={36} />
                            ) : (
                              <div className="text-sm font-medium text-gray-700">{u.fullName.split(" ")[0][0]}</div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{u.fullName}</div>
                            <div className="text-xs text-gray-500">{u.phone}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-3 text-sm text-gray-600">{u.email}</td>

                      <td className="py-4 px-3 flex items-center text-sm">
                        <RoleIcon role={u.role} />
                        <span className="ml-1">{u.role}</span>
                      </td>

                      <td className="py-4 px-3">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                            u.active ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"
                          }`}
                        >
                          <UserCheck className="w-3 h-3" />
                          {u.active ? "Active" : "Disabled"}
                        </span>
                      </td>

                      <td className="py-4 px-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-gray-400" />
                          <span className="text-xs">{u.permissions.slice(0, 2).join(", ")}</span>
                        </div>
                      </td>

                      <td className="py-4 px-3 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openAdd(u)}
                            className="px-3 py-1 rounded-md bg-white border border-gray-100 text-gray-700 hover:shadow-sm flex items-center gap-2"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>

                          <button className="px-3 py-1 rounded-md bg-red-50 text-red-600 text-sm">Disable</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filtered.length)} of {filtered.length}</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded-md border border-gray-100"
                >
                  Prev
                </button>
                <div className="text-sm">{page} / {totalPages}</div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 rounded-md border border-gray-100"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden">
        <div className="p-4 sticky top-0 bg-white z-30 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">User Management</h2>
            <button onClick={() => openAdd()} className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg shadow-sm">
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          <div className="mt-3 flex gap-2">
            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 flex-1">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, email, phone"
                className="bg-transparent ml-2 text-sm outline-none w-full"
              />
            </div>

            <button
              onClick={() => setShowAdd(true)}
              className="bg-white rounded-lg p-2 border border-gray-100"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {filtered.slice(0, 50).map((u) => (
            <div key={u.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gray-100 w-12 h-12 flex items-center justify-center text-sm font-medium text-gray-700">{u.fullName.split(" ")[0][0]}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{u.fullName}</div>
                    <div className={`text-xs ${u.active ? "text-green-600" : "text-gray-500"}`}>{u.active ? "Active" : "Disabled"}</div>
                  </div>
                  <div className="text-xs text-gray-500">{u.email}</div>
                  <div className="mt-1 text-xs text-gray-500 flex items-center gap-2"><RoleIcon role={u.role} /><span>{u.role}</span></div>
                </div>
              </div>

              <div className="flex items-start flex-col gap-2">
                <button className="text-gray-500 px-2 py-1 rounded hover:bg-gray-50">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Add Button */}
        <button onClick={() => openAdd()} className="fixed right-4 bottom-6 bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Add / Edit Drawer (mobile & desktop responsive) */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div onClick={() => setShowAdd(false)} className="absolute inset-0 bg-black/30" />

          <div className="relative w-full md:w-3/4 lg:w-2/5 bg-white rounded-t-2xl md:rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-auto z-50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{editing ? "Edit User" : "Add User"}</h3>
                <p className="text-sm text-gray-500">Create a new user and assign role & permissions</p>
              </div>
              <button onClick={() => setShowAdd(false)} className="text-gray-500">Close</button>
            </div>

            <AddUserForm initial={editing} onCancel={() => setShowAdd(false)} onSave={() => setShowAdd(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function TopBar({
  query,
  setQuery,
  onAdd,
  filterRole,
  setFilterRole,
  filterStatus,
  setFilterStatus,
}: {
  query: string;
  setQuery: (s: string) => void;
  onAdd: () => void;
  filterRole: string;
  setFilterRole: (s: string) => void;
  filterStatus: string;
  setFilterStatus: (s: string) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">User Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage staff accounts, roles and permissions</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, phone" className="bg-transparent ml-2 text-sm outline-none w-64" />
        </div>

        <div className="flex items-center gap-2">
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="rounded-lg border border-gray-100 p-2 text-sm">
            <option>All</option>
            <option>Admin</option>
            <option>Manager</option>
            <option>Receptionist</option>
            <option>Accountant</option>
          </select>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-lg border border-gray-100 p-2 text-sm">
            <option>All</option>
            <option>Active</option>
            <option>Disabled</option>
          </select>

          <button onClick={onAdd} className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg shadow-sm">
            <Plus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>
    </div>
  );
}

function AddUserForm({ initial, onCancel, onSave }: { initial?: UserItem | null; onCancel: () => void; onSave: () => void }) {
  const [fullName, setFullName] = useState(initial?.fullName || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [role, setRole] = useState<Role>(initial?.role || "Receptionist");
  const [password, setPassword] = useState("");

  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [perms, setPerms] = useState<Record<string, boolean>>({
    "Create Reservation": initial?.permissions.includes("Create Reservation") || false,
    "Edit Reservation": initial?.permissions.includes("Edit Reservation") || false,
    "Cancel Booking": initial?.permissions.includes("Cancel Booking") || false,
    "Delete Booking": initial?.permissions.includes("Delete Booking") || false,
    "Access Finance": initial?.permissions.includes("Access Finance") || false,
    "Manage Rooms": initial?.permissions.includes("Manage Rooms") || false,
  });

  function toggle(key: string) {
    setPerms((p) => ({ ...p, [key]: !p[key] }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Save to API...
        onSave();
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600">Full Name</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-100 p-3 text-sm" placeholder="Jane Doe" />
        </div>

        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-100 p-3 text-sm" placeholder="jane@hotel.example" />
        </div>

        <div>
          <label className="text-sm text-gray-600">Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-100 p-3 text-sm" placeholder="+234 800 ..." />
        </div>

        <div>
          <label className="text-sm text-gray-600">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="mt-1 w-full rounded-lg border border-gray-100 p-3 text-sm">
            <option>Receptionist</option>
            <option>Manager</option>
            <option>Admin</option>
            <option>Accountant</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-1 w-full rounded-lg border border-gray-100 p-3 text-sm" placeholder="Set a temporary password" />
        </div>
      </div>

      {/* Permissions */}
      <div className="mt-4 border border-gray-100 rounded-lg overflow-hidden">
        <button type="button" onClick={() => setPermissionsOpen((s) => !s)} className="w-full flex items-center justify-between px-4 py-3 text-sm">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Permissions</span>
            <span className="text-xs text-gray-400">Select fine-grained access</span>
          </div>
          <div>{permissionsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</div>
        </button>

        {permissionsOpen && (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.keys(perms).map((k) => (
              <label key={k} className="flex items-center justify-between gap-3 bg-gray-50 rounded-lg p-3">
                <div className="text-sm">{k}</div>
                <input type="checkbox" checked={perms[k]} onChange={() => toggle(k)} className="w-5 h-5" />
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-100">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded-lg bg-green-600 text-white">Save User</button>
      </div>
    </form>
  );
}
