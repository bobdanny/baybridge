"use client";

import React, { useState, useMemo } from "react";
import { Search, Plus, MoreHorizontal, Edit2, Trash2, Eye } from "lucide-react";

type AgencyType = "Travel Agent" | "OTA" | "Corporate";
type Status = "Active" | "Inactive";

type AgentItem = {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  agencyType: AgencyType;
  commissionRate: number;
  totalBookings: number;
  totalCommission: number;
  status: Status;
};

const MOCK_AGENTS: AgentItem[] = Array.from({ length: 25 }).map((_, i) => ({
  id: String(i + 1),
  name: ["Globe Travels", "Smart OTA", "Elite Tours", "Corporate Link"][i % 4],
  contactPerson: ["Aisha Bello", "Daniel O.", "Emma Carter", "Olu Johnson"][i % 4],
  email: `agent${i + 1}@example.com`,
  phone: `+234 800 000 ${1000 + i}`,
  agencyType: i % 3 === 0 ? "Travel Agent" : i % 3 === 1 ? "OTA" : "Corporate",
  commissionRate: 5 + (i % 5),
  totalBookings: 10 + i,
  totalCommission: (10 + i) * 500,
  status: i % 2 === 0 ? "Active" : "Inactive",
}));

export default function AgentManagementPage() {
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AgentItem | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_AGENTS.filter((a) => {
      if (filterType !== "All" && a.agencyType !== filterType) return false;
      if (filterStatus !== "All" && a.status !== filterStatus) return false;
      if (!q) return true;
      return a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q);
    });
  }, [query, filterType, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  function openForm(agent?: AgentItem) {
    setEditing(agent || null);
    setShowForm(true);
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 p-4 md:p-8">
      {/* Desktop Table */}
      <div className="hidden md:flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Travel Agents / OTAs</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or email"
                className="bg-transparent ml-2 text-sm outline-none w-64"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-lg border border-gray-100 p-2 text-sm"
            >
              <option>All</option>
              <option>Travel Agent</option>
              <option>OTA</option>
              <option>Corporate</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-gray-100 p-2 text-sm"
            >
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <button
              onClick={() => openForm()}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Agent
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-gray-500 uppercase">
              <tr>
                <th className="py-3 px-3">Name</th>
                <th className="py-3 px-3">Contact Person</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Phone</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Commission</th>
                <th className="py-3 px-3">Total Bookings</th>
                <th className="py-3 px-3">Total Commission</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pageItems.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="py-3 px-3 font-medium">{a.name}</td>
                  <td className="py-3 px-3">{a.contactPerson}</td>
                  <td className="py-3 px-3">{a.email}</td>
                  <td className="py-3 px-3">{a.phone}</td>
                  <td className="py-3 px-3">{a.agencyType}</td>
                  <td className="py-3 px-3">{a.commissionRate}%</td>
                  <td className="py-3 px-3">{a.totalBookings}</td>
                  <td className="py-3 px-3">₦{a.totalCommission}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        a.status === "Active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 flex gap-2">
                    <button
                      onClick={() => openForm(a)}
                      className="px-2 py-1 bg-white border border-gray-100 rounded hover:shadow-sm flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                    <button className="px-2 py-1 bg-red-50 text-red-600 rounded text-sm flex items-center gap-1">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                    <button className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-sm flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Bookings
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filtered.length)} of {filtered.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded-md border border-gray-100"
              >
                Prev
              </button>
              <div className="text-sm">
                {page} / {totalPages}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 rounded-md border border-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        <div className="p-4 sticky top-0 bg-white z-30 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Travel Agents / OTAs</h2>
            <button
              onClick={() => openForm()}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 flex-1">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or email"
                className="bg-transparent ml-2 text-sm outline-none w-full"
              />
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {filtered.slice(0, 50).map((a) => (
            <div key={a.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex justify-between items-start">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-sm">{a.name}</div>
                  <div className={`text-xs ${a.status === "Active" ? "text-green-600" : "text-red-600"}`}>
                    {a.status}
                  </div>
                </div>
                <div className="text-xs text-gray-500">{a.agencyType}</div>
                <div className="text-xs text-gray-500">{a.contactPerson}</div>
                <div className="text-xs text-gray-500">{a.phone} | {a.email}</div>
                <div className="text-xs text-gray-500">Commission: {a.commissionRate}%</div>
              </div>
              <button className="text-gray-500 px-2 py-1 rounded hover:bg-gray-50">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => openForm()}
          className="fixed right-4 bottom-6 bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Add/Edit Agent Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div onClick={() => setShowForm(false)} className="absolute inset-0 bg-black/30" />
          <div className="relative w-full md:w-3/4 lg:w-2/5 bg-white rounded-t-2xl md:rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-auto z-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{editing ? "Edit Agent / OTA" : "Add Agent / OTA"}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-500">Close</button>
            </div>
            <AgentForm initial={editing} onCancel={() => setShowForm(false)} onSave={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function AgentForm({ initial, onCancel, onSave }: { initial?: AgentItem | null; onCancel: () => void; onSave: () => void }) {
  const [name, setName] = useState(initial?.name || "");
  const [contactPerson, setContactPerson] = useState(initial?.contactPerson || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [agencyType, setAgencyType] = useState<AgencyType>(initial?.agencyType || "Travel Agent");
  const [commissionRate, setCommissionRate] = useState(initial?.commissionRate || 5);
  const [address, setAddress] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-3">
        <label className="text-sm text-gray-600">Agent / OTA Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-gray-100 p-3 text-sm" placeholder="Globe Travels" />

        <label className="text-sm text-gray-600">Agency Type</label>
        <select value={agencyType} onChange={(e) => setAgencyType(e.target.value as AgencyType)} className="w-full rounded-lg border border-gray-100 p-3 text-sm">
          <option>Travel Agent</option>
          <option>OTA</option>
          <option>Corporate</option>
        </select>

        <label className="text-sm text-gray-600">Contact Person</label>
        <input value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} className="w-full rounded-lg border border-gray-100 p-3 text-sm" placeholder="John Doe" />

        <label className="text-sm text-gray-600">Phone</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-gray-100 p-3 text-sm" placeholder="+234 800 ..." />

        <label className="text-sm text-gray-600">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-gray-100 p-3 text-sm" placeholder="agent@example.com" />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm text-gray-600">Address</label>
        <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-lg border border-gray-100 p-3 text-sm" placeholder="Enter address" />

        <label className="text-sm text-gray-600">Commission Rate (%)</label>
        <input type="number" value={commissionRate} onChange={(e) => setCommissionRate(Number(e.target.value))} className="w-full rounded-lg border border-gray-100 p-3 text-sm" />

        <label className="text-sm text-gray-600">Payment Terms</label>
        <input value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} className="w-full rounded-lg border border-gray-100 p-3 text-sm" placeholder="Net 30 / Advance" />

        <div className="flex justify-end gap-2 mt-4 col-span-full">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-100">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-green-600 text-white shadow-sm">Save Agent</button>
        </div>
      </div>
    </form>
  );
}
