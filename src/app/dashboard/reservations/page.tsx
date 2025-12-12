"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit2,
  Trash2,
  Calendar,
  UserCheck,
} from "lucide-react";

/*
  ReservationManagementPage.tsx
  - Single-file responsive Reservation Management screen for Hotel Management System
  - Next.js (client component) + Tailwind CSS
  - Desktop: table-based reservation list, filters, pagination, new/edit reservation modals
  - Mobile: card-based reservation list, floating add button, modal forms
*/

type BookingSource = "Direct" | "OTA" | "Travel Agent";
type ReservationStatus = "Booked" | "Checked-in" | "Checked-out" | "Canceled";
type PaymentStatus = "Paid" | "Pending";

type ReservationItem = {
  id: string;
  reference: string;
  guestName: string;
  email: string;
  phone: string;
  roomNumber: string;
  category: string;
  checkIn: string;
  checkOut: string;
  bookingSource: BookingSource;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  totalPrice: number;
};

const MOCK_RESERVATIONS: ReservationItem[] = Array.from({ length: 25 }).map((_, i) => ({
  id: String(i + 1),
  reference: `REF${1000 + i}`,
  guestName: ["Aisha Bello", "Daniel O.", "Emma Carter", "Olu Johnson"][i % 4],
  email: `guest${i + 1}@example.com`,
  phone: `+234 800 000 ${1000 + i}`,
  roomNumber: `10${i % 20}`,
  category: ["Single", "Double", "Suite"][i % 3],
  checkIn: `2025-12-${10 + i % 20}`,
  checkOut: `2025-12-${11 + i % 20}`,
  bookingSource: i % 3 === 0 ? "Direct" : i % 3 === 1 ? "OTA" : "Travel Agent",
  status: i % 4 === 0 ? "Booked" : i % 4 === 1 ? "Checked-in" : i % 4 === 2 ? "Checked-out" : "Canceled",
  paymentStatus: i % 2 === 0 ? "Paid" : "Pending",
  totalPrice: 5000 + i * 100,
}));

export default function ReservationManagementPage() {
  const [query, setQuery] = useState("");
  const [filterSource, setFilterSource] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ReservationItem | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_RESERVATIONS.filter((r) => {
      if (filterSource !== "All" && r.bookingSource !== filterSource) return false;
      if (filterStatus !== "All" && r.status !== filterStatus) return false;
      if (!q) return true;
      return r.guestName.toLowerCase().includes(q) || r.reference.toLowerCase().includes(q);
    });
  }, [query, filterSource, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  function openForm(reservation?: ReservationItem) {
    setEditing(reservation || null);
    setShowForm(true);
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 p-4 md:p-8">
      {/* Desktop Table */}
      <div className="hidden md:flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Reservations</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search guest or reference" className="bg-transparent ml-2 text-sm outline-none w-64" />
            </div>
            <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)} className="rounded-lg border border-gray-100 p-2 text-sm">
              <option>All</option>
              <option>Direct</option>
              <option>OTA</option>
              <option>Travel Agent</option>
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-lg border border-gray-100 p-2 text-sm">
              <option>All</option>
              <option>Booked</option>
              <option>Checked-in</option>
              <option>Checked-out</option>
              <option>Canceled</option>
            </select>
            <button onClick={() => openForm()} className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg shadow-sm">
              <Plus className="w-4 h-4" /> New Reservation
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-gray-500 uppercase">
              <tr>
                <th className="py-3 px-3">Reference</th>
                <th className="py-3 px-3">Guest</th>
                <th className="py-3 px-3">Room / Category</th>
                <th className="py-3 px-3">Check-in</th>
                <th className="py-3 px-3">Check-out</th>
                <th className="py-3 px-3">Source</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pageItems.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="py-3 px-3 font-medium">{r.reference}</td>
                  <td className="py-3 px-3">{r.guestName}</td>
                  <td className="py-3 px-3">{r.roomNumber} / {r.category}</td>
                  <td className="py-3 px-3">{r.checkIn}</td>
                  <td className="py-3 px-3">{r.checkOut}</td>
                  <td className="py-3 px-3">{r.bookingSource}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${r.status === 'Booked' ? 'bg-blue-50 text-blue-700' : r.status === 'Checked-in' ? 'bg-green-50 text-green-700' : r.status === 'Checked-out' ? 'bg-gray-50 text-gray-700' : 'bg-red-50 text-red-600'}`}>{r.status}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${r.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>{r.paymentStatus}</span>
                  </td>
                  <td className="py-3 px-3 flex gap-2">
                    <button onClick={() => openForm(r)} className="px-2 py-1 bg-white border border-gray-100 rounded hover:shadow-sm flex items-center gap-1"><Edit2 className="w-3 h-3" /> Edit</button>
                    <button className="px-2 py-1 bg-red-50 text-red-600 rounded text-sm">Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filtered.length)} of {filtered.length}</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 rounded-md border border-gray-100">Prev</button>
              <div className="text-sm">{page} / {totalPages}</div>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1 rounded-md border border-gray-100">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="p-4 sticky top-0 bg-white z-30 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Reservations</h2>
            <button onClick={() => openForm()} className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg shadow-sm"><Plus className="w-4 h-4" /> New</button>
          </div>
          <div className="mt-3 flex gap-2">
            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 flex-1">
              <Search className="w-4 h-4 text-gray-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search guest or reference" className="bg-transparent ml-2 text-sm outline-none w-full" />
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {filtered.slice(0, 50).map((r) => (
            <div key={r.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <div className="font-medium text-sm">{r.guestName}</div>
                  <div className={`text-xs ${r.status === 'Booked' ? 'text-blue-600' : r.status === 'Checked-in' ? 'text-green-600' : r.status === 'Checked-out' ? 'text-gray-500' : 'text-red-600'}`}>{r.status}</div>
                </div>
                <div className="text-xs text-gray-500">{r.reference}</div>
                <div className="text-xs text-gray-500">{r.roomNumber} / {r.category}</div>
                <div className="text-xs text-gray-500">{r.checkIn} - {r.checkOut}</div>
                <div className="text-xs text-gray-500">{r.paymentStatus}</div>
              </div>

              <button className="text-gray-500 px-2 py-1 rounded hover:bg-gray-50"><MoreHorizontal className="w-4 h-4" /></button>
            </div>
          ))}
        </div>

        <button onClick={() => openForm()} className="fixed right-4 bottom-6 bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"><Plus className="w-5 h-5" /></button>
      </div>

      {/* Add/Edit Reservation Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div onClick={() => setShowForm(false)} className="absolute inset-0 bg-black/30" />
          <div className="relative w-full md:w-3/4 lg:w-2/5 bg-white rounded-t-2xl md:rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-auto z-50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{editing ? "Edit Reservation" : "New Reservation"}</h3>
              </div>
              <button onClick={() => setShowForm(false)} className="text-gray-500">Close</button>
            </div>
            <ReservationForm initial={editing} onCancel={() => setShowForm(false)} onSave={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function ReservationForm({ initial, onCancel, onSave }: { initial?: ReservationItem | null; onCancel: () => void; onSave: () => void }) {
  const [guestName, setGuestName] = useState(initial?.guestName || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [bookingSource, setBookingSource] = useState<BookingSource>(initial?.bookingSource || "Direct");
  const [roomCategory, setRoomCategory] = useState(initial?.category || "Single");
  const [roomNumber, setRoomNumber] = useState(initial?.roomNumber || "");
  const [mealPlan, setMealPlan] = useState("Room Only");
  const [checkIn, setCheckIn] = useState(initial?.checkIn || "");
  const [checkOut, setCheckOut] = useState(initial?.checkOut || "");
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentType, setPaymentType] = useState("Cash");
  const [totalPrice, setTotalPrice] = useState(initial?.totalPrice || 0);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-3">
        <label className="text-sm text-gray-600">Guest Name</label>
        <input value={guestName} onChange={(e) => setGuestName(e.target.value)} className="w-full rounded-lg border border-gray-100 p-3 text-sm" placeholder="John Doe" />

        <label className="text-sm text-gray-600">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-gray-100 p-3 text-sm" placeholder="john@example.com" />

        <label className="text-sm text-gray-600">Phone</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-gray-100 p-3 text-sm" placeholder="+234 800 ..." />

        <label className="text-sm text-gray-600">Booking Source</label>
        <select value={bookingSource} onChange={(e) => setBookingSource(e.target.value as BookingSource)} className="w-full rounded-lg border border-gray-100 p-3 text-sm">
          <option>Direct</option>
          <option>OTA</option>
          <option>Travel Agent</option>
        </select>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm text-gray-600">Room Category</label>
        <select value={roomCategory} onChange={(e) => setRoomCategory(e.target.value)} className="w-full rounded-lg border border-gray-100 p-3 text-sm">
          <option>Single</option>
          <option>Double</option>
          <option>Suite</option>
        </select>

        <label className="text-sm text-gray-600">Room Number</label>
        <input value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} className="w-full rounded-lg border border-gray-100 p-3 text-sm" placeholder="101" />
                <label className="text-sm text-gray-600">Meal Plan</label>
        <select value={mealPlan} onChange={(e) => setMealPlan(e.target.value)} className="w-full rounded-lg border border-gray-100 p-3 text-sm">
          <option>Room Only</option>
          <option>Breakfast</option>
          <option>Half Board</option>
          <option>Full Board</option>
        </select>

        <label className="text-sm text-gray-600">Check-in Date</label>
        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full rounded-lg border border-gray-100 p-3 text-sm" />

        <label className="text-sm text-gray-600">Check-out Date</label>
        <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full rounded-lg border border-gray-100 p-3 text-sm" />

        <label className="text-sm text-gray-600">Number of Guests</label>
        <input type="number" min={1} value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="w-full rounded-lg border border-gray-100 p-3 text-sm" />

        <label className="text-sm text-gray-600">Special Requests</label>
        <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} className="w-full rounded-lg border border-gray-100 p-3 text-sm" rows={3} placeholder="Any notes or preferences" />

        <label className="text-sm text-gray-600">Payment Type</label>
        <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)} className="w-full rounded-lg border border-gray-100 p-3 text-sm">
          <option>Cash</option>
          <option>POS</option>
          <option>Bank Transfer</option>
          <option>Pay Later</option>
        </select>

        <label className="text-sm text-gray-600">Total Price (₦)</label>
        <input type="number" value={totalPrice} onChange={(e) => setTotalPrice(Number(e.target.value))} className="w-full rounded-lg border border-gray-100 p-3 text-sm" />

        <div className="flex gap-3 mt-4 md:col-span-2 justify-end">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">Save Reservation</button>
        </div>
      </div>
    </form>
  );
}
