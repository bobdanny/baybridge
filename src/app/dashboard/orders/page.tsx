// @ts-nocheck


"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ArrowRight } from "lucide-react";

const accent = "hsl(158, 64%, 26%)";

export default function OrdersPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen w-full bg-white text-gray-900 px-6 py-8">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight"
              style={{ color: accent }}>
            Orders Management
          </h1>
          <p className="text-gray-500 mt-1">
            View, track, and update customer orders effortlessly.
          </p>
        </div>
      </div>

      {/* SEARCH + FILTERS */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white/70 backdrop-blur-sm shadow-md border border-gray-200 rounded-xl p-5 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* SEARCH INPUT */}
          <div className="flex items-center gap-3 w-full">
            <Search className="text-gray-500" />
            <input
              type="text"
              placeholder="Search orders…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2"
              style={{
                focusRingColor: accent,
              }}
            />
          </div>

          {/* FILTER BUTTON */}
          <button
            className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition shadow-sm"
          >
            <Filter size={18} />
            Filters
          </button>

          {/* EXPORT BUTTON */}
          <button
            className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-white font-medium shadow"
            style={{ backgroundColor: accent }}
          >
            Export Orders
          </button>
        </div>
      </motion.div>

      {/* ORDERS TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden"
      >
        <table className="w-full text-left">
          <thead
            className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide"
          >
            <tr>
              <th className="py-4 px-6">Order ID</th>
              <th className="py-4 px-6">Customer</th>
              <th className="py-4 px-6">Items</th>
              <th className="py-4 px-6">Amount</th>
              <th className="py-4 px-6">Payment</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">

            {/* ROW */}
            <tr className="hover:bg-gray-50 transition">
              <td className="py-4 px-6 font-semibold text-gray-800">#12452</td>
              <td className="py-4 px-6">John Doe</td>
              <td className="py-4 px-6">3 items</td>
              <td className="py-4 px-6 font-medium">₹ 1,450</td>
              <td className="py-4 px-6">
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700">
                  Online
                </span>
              </td>
              <td className="py-4 px-6">
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-yellow-100 text-yellow-700">
                  Pending
                </span>
              </td>
              <td className="py-4 px-6">Dec 10</td>

              <td className="py-4 px-6">
                <button
                  className="flex items-center gap-1 font-medium text-sm"
                  style={{ color: accent }}
                >
                  View <ArrowRight size={16} />
                </button>
              </td>
            </tr>

          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
