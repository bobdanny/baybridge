"use client";

import React, { useState } from "react";
import { Plus, Download, Settings as SettingsIcon, FileText } from "lucide-react";

type PaymentMethod = "Cash" | "POS" | "Bank Transfer" | "Online Payment";

type ReportItem = {
  id: string;
  title: string;
  value: string;
  dateRange: string;
};

const MOCK_REPORTS: ReportItem[] = [
  { id: "1", title: "Daily Arrivals", value: "12 Guests", dateRange: "2025-12-12" },
  { id: "2", title: "Daily Departures", value: "8 Guests", dateRange: "2025-12-12" },
  { id: "3", title: "Room Occupancy", value: "78%", dateRange: "Dec 2025" },
  { id: "4", title: "Revenue Report", value: "₦250,000", dateRange: "Dec 2025" },
  { id: "5", title: "OTA / Agent Bookings", value: "45 Bookings", dateRange: "Dec 2025" },
  { id: "6", title: "Commission Report", value: "₦35,000", dateRange: "Dec 2025" },
];

export default function SettingsReportsPage() {
  const [activeTab, setActiveTab] = useState<"Settings" | "Reports">("Settings");

  return (
    <div className="min-h-screen bg-white text-gray-800 p-4 md:p-8">
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("Settings")}
          className={`pb-2 text-sm font-medium ${activeTab === "Settings" ? "border-b-2 border-green-600 text-green-600" : "text-gray-500"}`}
        >
          Settings
        </button>
        <button
          onClick={() => setActiveTab("Reports")}
          className={`pb-2 text-sm font-medium ${activeTab === "Reports" ? "border-b-2 border-green-600 text-green-600" : "text-gray-500"}`}
        >
          Reports
        </button>
      </div>

      {activeTab === "Settings" ? <SettingsSection /> : <ReportsSection />}
    </div>
  );
}

// -------------------- Settings Section --------------------
function SettingsSection() {
  const [hotelName, setHotelName] = useState("Cyber Hotel");
  const [logoUrl, setLogoUrl] = useState("");
  const [address, setAddress] = useState("123 Main St, Lagos");
  const [contactEmail, setContactEmail] = useState("info@cyberhotel.com");
  const [contactPhone, setContactPhone] = useState("+234 800 000 0000");
  const [currency, setCurrency] = useState("NGN");

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(["Cash", "POS"]);
  const [taxRate, setTaxRate] = useState(7.5);
  const [defaultPaymentTerms, setDefaultPaymentTerms] = useState("Net 30");

  const [defaultMealPlans, setDefaultMealPlans] = useState(["Room Only", "Breakfast"]);
  const [autoBookingConfirm, setAutoBookingConfirm] = useState(true);
  const [weekendPricing, setWeekendPricing] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Hotel Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Hotel Profile</h3>
        <label className="text-sm text-gray-600">Hotel Name</label>
        <input value={hotelName} onChange={(e) => setHotelName(e.target.value)} className="w-full rounded-lg border border-gray-100 p-3 text-sm" />
        
        <label className="text-sm text-gray-600">Logo URL</label>
        <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="w-full rounded-lg border border-gray-100 p-3 text-sm" placeholder="Upload or paste URL" />

        <label className="text-sm text-gray-600">Address / Location</label>
        <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-lg border border-gray-100 p-3 text-sm" />

        <label className="text-sm text-gray-600">Contact Email</label>
        <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full rounded-lg border border-gray-100 p-3 text-sm" />

        <label className="text-sm text-gray-600">Contact Phone</label>
        <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="w-full rounded-lg border border-gray-100 p-3 text-sm" />

        <label className="text-sm text-gray-600">Currency</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full rounded-lg border border-gray-100 p-3 text-sm">
          <option>NGN</option>
          <option>USD</option>
          <option>EUR</option>
        </select>

        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 rounded-lg border border-gray-100">Cancel</button>
          <button className="px-4 py-2 rounded-lg bg-green-600 text-white shadow-sm">Save</button>
        </div>
      </div>

      {/* Payment Settings Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Payment Settings</h3>
        <div className="flex flex-wrap gap-2">
          {["Cash", "POS", "Bank Transfer", "Online Payment"].map((m) => (
            <label key={m} className={`px-3 py-2 rounded-lg border cursor-pointer ${paymentMethods.includes(m as PaymentMethod) ? "bg-green-50 border-green-600 text-green-700" : "border-gray-200 text-gray-600"}`}>
              <input type="checkbox" checked={paymentMethods.includes(m as PaymentMethod)} onChange={() => {
                setPaymentMethods((prev) =>
                  prev.includes(m as PaymentMethod) ? prev.filter((x) => x !== m) : [...prev, m as PaymentMethod]
                );
              }} className="mr-2" />
              {m}
            </label>
          ))}
        </div>

        <label className="text-sm text-gray-600">Tax Rate (%)</label>
        <input type="number" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} className="w-full rounded-lg border border-gray-100 p-3 text-sm" />

        <label className="text-sm text-gray-600">Default Payment Terms</label>
        <input value={defaultPaymentTerms} onChange={(e) => setDefaultPaymentTerms(e.target.value)} className="w-full rounded-lg border border-gray-100 p-3 text-sm" />

        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 rounded-lg border border-gray-100">Cancel</button>
          <button className="px-4 py-2 rounded-lg bg-green-600 text-white shadow-sm">Save</button>
        </div>
      </div>

      {/* Room & Reservation Settings */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Room & Reservation Settings</h3>

        <label className="text-sm text-gray-600">Default Meal Plans</label>
        <input value={defaultMealPlans.join(", ")} onChange={(e) => setDefaultMealPlans(e.target.value.split(",").map(s => s.trim()))} className="w-full rounded-lg border border-gray-100 p-3 text-sm" />

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={autoBookingConfirm} onChange={() => setAutoBookingConfirm(!autoBookingConfirm)} />
          Automatic Booking Confirmation
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={weekendPricing} onChange={() => setWeekendPricing(!weekendPricing)} />
          Weekend / Seasonal Pricing
        </label>

        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 rounded-lg border border-gray-100">Cancel</button>
          <button className="px-4 py-2 rounded-lg bg-green-600 text-white shadow-sm">Save</button>
        </div>
      </div>
    </div>
  );
}

// -------------------- Reports Section --------------------
function ReportsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {MOCK_REPORTS.map((r) => (
        <div key={r.id} className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">{r.title}</h4>
            <span className="text-gray-500 text-sm">{r.dateRange}</span>
          </div>
          <div className="text-2xl font-bold">{r.value}</div>
          <div className="flex gap-2 mt-4">
            <button className="px-3 py-2 rounded-lg border border-gray-100 flex items-center gap-1 text-sm">
              <FileText className="w-4 h-4" /> View
            </button>
            <button className="px-3 py-2 rounded-lg bg-green-600 text-white flex items-center gap-1 text-sm">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
