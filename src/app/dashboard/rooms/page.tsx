"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Tag,
  X,
  Wifi,
  Thermometer,
  Tv,
  Check,
  AlertCircle,
  Building2,
  DollarSign,
  Users as UsersIcon,
  Bed,
  SlidersHorizontal,
} from "lucide-react";

/******************************
 * Types
 ******************************/
type MealPlan = "Room Only" | "Breakfast" | "Half Board" | "Full Board";

type Category = {
  id: string;
  name: string;
  maxOccupancy: number;
  basePrice: number;
  mealPlans: MealPlan[];
  roomsCount: number;
  active: boolean;
};

type Room = {
  id: string;
  number: string;
  categoryId: string;
  floor?: number;
  status: "Available" | "Occupied" | "Maintenance";
  price: number;
  features: string[];
};

/******************************
 * Mock Data
 ******************************/
const MOCK_CATEGORIES: Category[] = [
  { id: "c1", name: "Standard", maxOccupancy: 2, basePrice: 12000, mealPlans: ["Room Only", "Breakfast"], roomsCount: 12, active: true },
  { id: "c2", name: "Deluxe", maxOccupancy: 3, basePrice: 22000, mealPlans: ["Room Only", "Breakfast", "Half Board"], roomsCount: 8, active: true },
  { id: "c3", name: "Suite", maxOccupancy: 4, basePrice: 45000, mealPlans: ["Room Only", "Breakfast", "Full Board"], roomsCount: 4, active: false },
];

const MOCK_ROOMS: Room[] = [
  { id: "r1", number: "101", categoryId: "c1", floor: 1, status: "Available", price: 12000, features: ["AC", "WiFi"] },
  { id: "r2", number: "102", categoryId: "c1", floor: 1, status: "Occupied", price: 12000, features: ["AC", "WiFi", "TV"] },
  { id: "r3", number: "201", categoryId: "c2", floor: 2, status: "Maintenance", price: 22000, features: ["AC", "WiFi", "Balcony"] },
  { id: "r4", number: "202", categoryId: "c2", floor: 2, status: "Available", price: 22000, features: ["AC", "WiFi", "TV", "Wardrobe"] },
  { id: "r5", number: "301", categoryId: "c3", floor: 3, status: "Available", price: 45000, features: ["AC", "WiFi", "TV", "Balcony", "Water Heater"] },
];

/******************************
 * Modal Component
 ******************************/
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative animate-fadeIn">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

/******************************
 * Category Form
 ******************************/
function CategoryForm({ initial, onSave, onCancel }: { initial: Category | null; onSave: (c: Category) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Category>(
    initial || {
      id: "",
      name: "",
      maxOccupancy: 1,
      basePrice: 0,
      mealPlans: [],
      roomsCount: 0,
      active: true,
    }
  );

  const mealOptions: MealPlan[] = ["Room Only", "Breakfast", "Half Board", "Full Board"];

  function toggleMeal(m: MealPlan) {
    setForm((f) => ({
      ...f,
      mealPlans: f.mealPlans.includes(m) ? f.mealPlans.filter((x) => x !== m) : [...f.mealPlans, m],
    }));
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{initial ? "Edit Category" : "Add Category"}</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            className="w-full px-4 py-2 border rounded-lg"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Max Occupancy</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg"
              value={form.maxOccupancy}
              onChange={(e) => setForm({ ...form, maxOccupancy: Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Base Price</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg"
              value={form.basePrice}
              onChange={(e) => setForm({ ...form, basePrice: Number(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Meal Plans</label>
          <div className="flex flex-wrap gap-2">
            {mealOptions.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => toggleMeal(m)}
                className={`px-3 py-1 rounded-xl border text-sm ${form.mealPlans.includes(m) ? "bg-green-100 border-green-300 text-green-700" : "bg-gray-50 border-gray-300"}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Number of Rooms</label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-lg"
            value={form.roomsCount}
            onChange={(e) => setForm({ ...form, roomsCount: Number(e.target.value) })}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          <span className="text-sm">Active</span>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onCancel} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={() => onSave(form)} className="px-4 py-2 bg-green-600 text-white rounded-lg">Save</button>
        </div>
      </div>
    </div>
  );
}

/******************************
 * Room Form
 ******************************/
function RoomForm({ initial, onSave, onCancel, categories }: { initial: Room | null; onSave: (r: Room) => void; onCancel: () => void; categories: Category[] }) {
  const [form, setForm] = useState<Room>(
    initial || {
      id: "",
      number: "",
      categoryId: categories[0]?.id || "",
      floor: 1,
      status: "Available",
      price: 0,
      features: [],
    }
  );

  const FEATURES = ["AC", "WiFi", "TV", "Balcony", "Wardrobe", "Water Heater"];

  function toggleFeature(f: string) {
    setForm((x) => ({
      ...x,
      features: x.features.includes(f) ? x.features.filter((y) => y !== f) : [...x.features, f],
    }));
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{initial ? "Edit Room" : "Add Room"}</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Room Number</label>
          <input
            className="w-full px-4 py-2 border rounded-lg"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            className="w-full px-4 py-2 border rounded-lg"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Floor</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg"
              value={form.floor}
              onChange={(e) => setForm({ ...form, floor: Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Price</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            className="w-full px-4 py-2 border rounded-lg"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as any })}
          >
            <option>Available</option>
            <option>Occupied</option>
            <option>Maintenance</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Features</label>
          <div className="flex flex-wrap gap-2">
            {FEATURES.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => toggleFeature(f)}
                className={`px-3 py-1 rounded-xl text-sm border ${form.features.includes(f) ? "bg-green-100 border-green-300 text-green-700" : "bg-gray-50 border-gray-300"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onCancel} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={() => onSave(form)} className="px-4 py-2 bg-green-600 text-white rounded-lg">Save</button>
        </div>
      </div>
    </div>
  );
}

/******************************
 * Main Page
 ******************************/
export default function RoomManagementPage() {
  const [tab, setTab] = useState<"categories" | "rooms" | "pricing">("categories");
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);

  const [queryCat, setQueryCat] = useState("");
  const [queryRoom, setQueryRoom] = useState("");

  const [filterCatActive, setFilterCatActive] = useState("All");
  const [filterRoomCategory, setFilterRoomCategory] = useState("All");
  const [filterRoomStatus, setFilterRoomStatus] = useState("All");

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [pricingCategoryId, setPricingCategoryId] = useState<string | null>(MOCK_CATEGORIES[0]?.id || null);
  const [pricing, setPricing] = useState<Record<string, number>>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredCategories = useMemo(() => {
    const q = queryCat.trim().toLowerCase();
    return categories.filter((c) => {
      if (filterCatActive !== "All") {
        const wantActive = filterCatActive === "Active";
        if (c.active !== wantActive) return false;
      }
      if (!q) return true;
      return c.name.toLowerCase().includes(q);
    });
  }, [categories, queryCat, filterCatActive]);

  const filteredRooms = useMemo(() => {
    const q = queryRoom.trim().toLowerCase();
    return rooms.filter((r) => {
      if (filterRoomCategory !== "All" && r.categoryId !== filterRoomCategory) return false;
      if (filterRoomStatus !== "All" && r.status !== filterRoomStatus) return false;
      if (!q) return true;
      return r.number.includes(q) || r.features.join(" ").toLowerCase().includes(q);
    });
  }, [rooms, queryRoom, filterRoomCategory, filterRoomStatus]);

  function saveCategory(cat: Category) {
    if (editingCategory) {
      setCategories((prev) => prev.map((c) => (c.id === cat.id ? cat : c)));
    } else {
      setCategories((prev) => [{ ...cat, id: `c${Date.now()}` }, ...prev]);
    }
    setShowAddCategory(false);
    setEditingCategory(null);
  }

  function saveRoom(room: Room) {
    if (editingRoom) {
      setRooms((prev) => prev.map((r) => (r.id === room.id ? room : r)));
    } else {
      setRooms((prev) => [{ ...room, id: `r${Date.now()}` }, ...prev]);
    }
    setShowAddRoom(false);
    setEditingRoom(null);
  }

  const statsData = useMemo(() => {
    const totalRooms = rooms.length;
    const available = rooms.filter(r => r.status === "Available").length;
    const occupied = rooms.filter(r => r.status === "Occupied").length;
    const maintenance = rooms.filter(r => r.status === "Maintenance").length;
    return { totalRooms, available, occupied, maintenance };
  }, [rooms]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pb-20 sm:pb-8 sm:ml-56">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="px-4 sm:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Room Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">Manage categories, rooms and pricing</p>
            </div>

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-3">
              {tab === "categories" && (
                <button 
                  onClick={() => { setEditingCategory(null); setShowAddCategory(true); }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-200 hover:scale-105"
                >
                  <Plus className="w-4 h-4" /> 
                  <span className="font-medium">Add Category</span>
                </button>
              )}
              {tab === "rooms" && (
                <button 
                  onClick={() => { setEditingRoom(null); setShowAddRoom(true); }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-200 hover:scale-105"
                >
                  <Plus className="w-4 h-4" /> 
                  <span className="font-medium">Add Room</span>
                </button>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              onClick={() => setTab("categories")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                tab === "categories" 
                  ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30" 
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <Building2 className="w-4 h-4" />
              Categories
            </button>
            <button 
              onClick={() => setTab("rooms")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                tab === "rooms" 
                  ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30" 
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <Bed className="w-4 h-4" />
              Rooms
            </button>
            <button 
              onClick={() => setTab("pricing")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                tab === "pricing" 
                  ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30" 
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Pricing
            </button>
          </div>
        </div>
      </header>

      {/* Stats Overview - Rooms Tab Only */}
      {tab === "rooms" && (
        <div className="px-4 sm:px-8 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-lg">
              <div className="text-2xl font-bold">{statsData.totalRooms}</div>
              <div className="text-xs text-blue-100 mt-1">Total Rooms</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white shadow-lg">
              <div className="text-2xl font-bold">{statsData.available}</div>
              <div className="text-xs text-green-100 mt-1">Available</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-4 text-white shadow-lg">
              <div className="text-2xl font-bold">{statsData.occupied}</div>
              <div className="text-xs text-yellow-100 mt-1">Occupied</div>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 text-white shadow-lg">
              <div className="text-2xl font-bold">{statsData.maintenance}</div>
              <div className="text-xs text-red-100 mt-1">Maintenance</div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="px-4 sm:px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={tab === "categories" ? queryCat : queryRoom}
              onChange={(e) => (tab === "categories" ? setQueryCat(e.target.value) : setQueryRoom(e.target.value))}
              placeholder={tab === "categories" ? "Search categories..." : "Search rooms..."}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
            />
          </div>

          {/* Mobile Filter Button */}
          <button 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="sm:hidden p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
          >
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          </button>

          {/* Desktop Filters */}
          <div className="hidden sm:flex items-center gap-3">
            {tab === "categories" && (
              <select 
                value={filterCatActive} 
                onChange={(e) => setFilterCatActive(e.target.value)} 
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              >
                <option>All</option>
                <option>Active</option>
                <option>Disabled</option>
              </select>
            )}

            {tab === "rooms" && (
              <>
                <select 
                  value={filterRoomCategory} 
                  onChange={(e) => setFilterRoomCategory(e.target.value)} 
                  className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>

                <select 
                  value={filterRoomStatus} 
                  onChange={(e) => setFilterRoomStatus(e.target.value)} 
                  className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                >
                  <option>All</option>
                  <option>Available</option>
                  <option>Occupied</option>
                  <option>Maintenance</option>
                </select>
              </>
            )}
          </div>
        </div>

        {/* Mobile Filters Dropdown */}
        {showMobileFilters && (
          <div className="sm:hidden mt-3 p-4 bg-white border border-gray-200 rounded-xl space-y-3">
            {tab === "categories" && (
              <select 
                value={filterCatActive} 
                onChange={(e) => setFilterCatActive(e.target.value)} 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"
              >
                <option>All</option>
                <option>Active</option>
                <option>Disabled</option>
              </select>
            )}

            {tab === "rooms" && (
              <>
                <select 
                  value={filterRoomCategory} 
                  onChange={(e) => setFilterRoomCategory(e.target.value)} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>

                <select 
                  value={filterRoomStatus} 
                  onChange={(e) => setFilterRoomStatus(e.target.value)} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  <option>All</option>
                  <option>Available</option>
                  <option>Occupied</option>
                  <option>Maintenance</option>
                </select>
              </>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <section className="px-4 sm:px-8">
        {tab === "categories" && (
          <div className="space-y-4">
            {filteredCategories.map((c) => (
              <div 
                key={c.id} 
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">{c.name}</h3>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          c.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        }`}>
                          {c.active ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          {c.active ? "Active" : "Disabled"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <UsersIcon className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Max {c.maxOccupancy}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold">₦{c.basePrice.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Bed className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{c.roomsCount} rooms</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {c.mealPlans.map((m) => (
                          <span key={m} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-700 rounded-lg text-xs border border-gray-200">
                            <Tag className="w-3 h-3" />
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex sm:opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                      <button 
                        onClick={() => { setEditingCategory(c); setShowAddCategory(true); }}
                        className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setCategories(prev => prev.filter(pc => pc.id !== c.id))} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "rooms" && (
          <div className="space-y-4">
            {filteredRooms.map((r) => {
              const category = categories.find((c) => c.id === r.categoryId);
              return (
                <div 
                  key={r.id} 
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Room {r.number}</h3>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            r.status === "Available" ? "bg-green-100 text-green-700" :
                            r.status === "Occupied" ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {r.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="text-xs text-gray-500">Category</div>
                            <div className="text-sm font-medium text-gray-900">{category?.name || "-"}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Floor</div>
                            <div className="text-sm font-medium text-gray-900">{r.floor ?? "-"}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Price</div>
                            <div className="text-sm font-semibold text-green-600">₦{r.price.toLocaleString()}</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {r.features.map((f) => {
                            const Icon = f === "WiFi" ? Wifi : f === "AC" ? Thermometer : f === "TV" ? Tv : Tag;
                            return (
                              <span key={f} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-700 rounded-lg text-xs border border-gray-200">
                                <Icon className="w-3 h-3" />
                                {f}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex sm:opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                        <button 
                          onClick={() => { setEditingRoom(r); setShowAddRoom(true); }}
                          className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setRooms(prev => prev.filter(pr => pr.id !== r.id))} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "pricing" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Room Pricing Configuration</h2>
            <p className="text-sm text-gray-500 mb-6">Set base prices and meal plan add-ons for each category</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Category</label>
                <select 
                  value={pricingCategoryId || ""} 
                  onChange={(e) => setPricingCategoryId(e.target.value || null)} 
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                >
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {pricingCategoryId && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Base Price (per night)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                      <input 
                        type="number" 
                        placeholder="0" 
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                        onChange={(e) => setPricing((p) => ({ ...p, base: Number(e.target.value) }))} 
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Meal Plan Add-ons</h3>
                    <div className="space-y-3">
                      {[
                        { label: "Breakfast", key: "breakfast" },
                        { label: "Half Board", key: "half" },
                        { label: "Full Board", key: "full" }
                      ].map(({ label, key }) => (
                        <div key={key} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                          <span className="text-sm text-gray-700">{label}</span>
                          <div className="relative w-32">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₦</span>
                            <input 
                              type="number" 
                              placeholder="0"
                              className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20"
                              onChange={(e) => setPricing((p) => ({ ...p, [key]: Number(e.target.value) }))} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-end pt-4">
                    <button onClick={() => { setPricing({}); setPricingCategoryId(null); }} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all">
                      Cancel
                    </button>
                    <button onClick={() => { /* Here you'd persist pricing to server or state */ setPricing({}); }} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all">
                      Save Pricing
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* FAB for mobile */}
      {(tab === "categories" || tab === "rooms") && (
        <button 
          onClick={() => tab === "categories" ? (() => { setEditingCategory(null); setShowAddCategory(true); })() : (() => { setEditingRoom(null); setShowAddRoom(true); })()}
          className="sm:hidden fixed right-4 bottom-20 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-2xl shadow-green-500/50 hover:scale-110 transition-transform z-30"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Modals */}
      {showAddCategory && (
        <Modal onClose={() => { setShowAddCategory(false); setEditingCategory(null); }}>
          <CategoryForm 
            initial={editingCategory} 
            onCancel={() => { setShowAddCategory(false); setEditingCategory(null); }}
            onSave={(c) => saveCategory(c)}
          />
        </Modal>
      )}

      {showAddRoom && (
        <Modal onClose={() => { setShowAddRoom(false); setEditingRoom(null); }}>
          <RoomForm 
            initial={editingRoom} 
            categories={categories}
            onCancel={() => { setShowAddRoom(false); setEditingRoom(null); }}
            onSave={(r) => saveRoom(r)}
          />
        </Modal>
      )}
    </div>
  );
}
