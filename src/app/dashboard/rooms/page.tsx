"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit2,
  Trash2,
  Tag,
  Users,
  Settings,
  CreditCard,
  Circle,
  Wifi,
  Thermometer,
  Tv,
  Columns,
  DollarSign,
  Grid,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/*
  RoomManagementPage.tsx
  - Single-file responsive Room Management screens for a Hotel Management System
  - Next.js (client component) + Tailwind CSS
  - Desktop: table style pages (Categories, Rooms, Pricing)
  - Mobile: card/list views, FAB, collapsible filters

  Hook this page into your routes at /dashboard/rooms or similar.
*/

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

const MOCK_CATEGORIES: Category[] = [
  { id: "c1", name: "Standard", maxOccupancy: 2, basePrice: 12000, mealPlans: ["Room Only", "Breakfast"], roomsCount: 12, active: true },
  { id: "c2", name: "Deluxe", maxOccupancy: 3, basePrice: 22000, mealPlans: ["Room Only", "Breakfast", "Half Board"], roomsCount: 8, active: true },
  { id: "c3", name: "Suite", maxOccupancy: 4, basePrice: 45000, mealPlans: ["Room Only", "Breakfast", "Full Board"], roomsCount: 4, active: false },
];

const MOCK_ROOMS: Room[] = [
  { id: "r1", number: "101", categoryId: "c1", floor: 1, status: "Available", price: 12000, features: ["AC", "WiFi"] },
  { id: "r2", number: "102", categoryId: "c1", floor: 1, status: "Occupied", price: 12000, features: ["AC", "WiFi", "TV"] },
  { id: "r3", number: "201", categoryId: "c2", floor: 2, status: "Maintenance", price: 22000, features: ["AC", "WiFi", "Balcony"] },
];

export default function RoomManagementPage() {
  const [tab, setTab] = useState<"categories" | "rooms" | "pricing">("categories");

  // Category state
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [queryCat, setQueryCat] = useState("");
  const [filterCatActive, setFilterCatActive] = useState<string>("All");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Rooms state
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  const [queryRoom, setQueryRoom] = useState("");
  const [filterRoomCategory, setFilterRoomCategory] = useState<string>("All");
  const [filterRoomStatus, setFilterRoomStatus] = useState<string>("All");
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // Pricing
  const [pricingCategoryId, setPricingCategoryId] = useState<string | null>(categories?.[0]?.id || null);
  const [pricing, setPricing] = useState<Record<string, number>>({});

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

  return (
    <div className="min-h-screen p-4 md:p-8 bg-white text-gray-800">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Room Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage room categories, numbering and pricing.</p>
        </div>

        <div className="flex items-center gap-3">
          <nav className="bg-gray-50 rounded-lg p-1 flex text-sm">
            <button onClick={() => setTab("categories")} className={`px-3 py-2 rounded-lg ${tab === "categories" ? "bg-white shadow-sm font-medium" : "text-gray-600"}`}>Categories</button>
            <button onClick={() => setTab("rooms")} className={`px-3 py-2 rounded-lg ${tab === "rooms" ? "bg-white shadow-sm font-medium" : "text-gray-600"}`}>Rooms</button>
            <button onClick={() => setTab("pricing")} className={`px-3 py-2 rounded-lg ${tab === "pricing" ? "bg-white shadow-sm font-medium" : "text-gray-600"}`}>Pricing</button>
          </nav>

          <div className="hidden sm:flex items-center gap-2">
            <div className="bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                value={tab === "categories" ? queryCat : queryRoom}
                onChange={(e) => (tab === "categories" ? setQueryCat(e.target.value) : setQueryRoom(e.target.value))}
                placeholder={tab === "categories" ? "Search categories" : "Search rooms"}
                className="bg-transparent outline-none text-sm w-56"
              />
            </div>

            {tab === "categories" && (
              <>
                <select value={filterCatActive} onChange={(e) => setFilterCatActive(e.target.value)} className="rounded-lg border border-gray-100 p-2 text-sm">
                  <option>All</option>
                  <option>Active</option>
                  <option>Disabled</option>
                </select>

                <button onClick={() => { setEditingCategory(null); setShowAddCategory(true); }} className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg shadow-sm">
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              </>
            )}

            {tab === "rooms" && (
              <>
                <select value={filterRoomCategory} onChange={(e) => setFilterRoomCategory(e.target.value)} className="rounded-lg border border-gray-100 p-2 text-sm">
                  <option value="All">All Categories</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>

                <select value={filterRoomStatus} onChange={(e) => setFilterRoomStatus(e.target.value)} className="rounded-lg border border-gray-100 p-2 text-sm">
                  <option>All</option>
                  <option>Available</option>
                  <option>Occupied</option>
                  <option>Maintenance</option>
                </select>

                <button onClick={() => { setEditingRoom(null); setShowAddRoom(true); }} className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg shadow-sm">
                  <Plus className="w-4 h-4" /> Add Room
                </button>
              </>
            )}

            {tab === "pricing" && (
              <div className="flex items-center gap-2">
                <select value={pricingCategoryId || ""} onChange={(e) => setPricingCategoryId(e.target.value || null)} className="rounded-lg border border-gray-100 p-2 text-sm">
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg shadow-sm">
                  <Settings className="w-4 h-4" /> Save Pricing
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <section>
        {tab === "categories" && (
          <div>
            {/* Desktop table */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-xs text-gray-500 uppercase">
                    <tr>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Max Occupancy</th>
                      <th className="py-3 px-3">Base Price</th>
                      <th className="py-3 px-3">Meal Plans</th>
                      <th className="py-3 px-3">Rooms</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCategories.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="py-4 px-3 font-medium">{c.name}</td>
                        <td className="py-4 px-3">{c.maxOccupancy}</td>
                        <td className="py-4 px-3">₦{c.basePrice.toLocaleString()}</td>
                        <td className="py-4 px-3 text-sm text-gray-600">{c.mealPlans.join(", ")}</td>
                        <td className="py-4 px-3">{c.roomsCount}</td>
                        <td className="py-4 px-3">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${c.active ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}`}>
                            {c.active ? "Active" : "Disabled"}
                          </span>
                        </td>
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => { setEditingCategory(c); setShowAddCategory(true); }} className="px-3 py-1 rounded-md bg-white border border-gray-100 text-gray-700 hover:shadow-sm flex items-center gap-2">
                              <Edit2 className="w-4 h-4" /> Edit
                            </button>
                            <button className="px-3 py-1 rounded-md bg-red-50 text-red-600 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination + search area for desktop small screens */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">Showing {filteredCategories.length} categories</div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-500">Search</div>
                </div>
              </div>
            </div>

            {/* Mobile: card list */}
            <div className="md:hidden space-y-3">
              <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-50 rounded-lg p-2 flex items-center gap-2 w-full">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input value={queryCat} onChange={(e) => setQueryCat(e.target.value)} placeholder="Search categories" className="bg-transparent outline-none text-sm w-full" />
                  </div>

                  <button onClick={() => { setEditingCategory(null); setShowAddCategory(true); }} className="bg-green-600 text-white p-2 rounded-lg">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {filteredCategories.map((c) => (
                <div key={c.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-lg">{c.name}</div>
                      <div className={`text-xs ${c.active ? "text-green-600" : "text-gray-500"}`}>{c.active ? "Active" : "Disabled"}</div>
                    </div>
                    <div className="text-sm text-gray-500">₦{c.basePrice.toLocaleString()} • Max {c.maxOccupancy}</div>
                    <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">{c.mealPlans.map((m) => <Tag key={m} className="w-3 h-3" />)}</div>
                  </div>

                  <div>
                    <button className="p-2 rounded hover:bg-gray-50"><MoreHorizontal className="w-5 h-5 text-gray-600" /></button>
                  </div>
                </div>
              ))}

              {/* FAB */}
              <button onClick={() => { setEditingCategory(null); setShowAddCategory(true); }} className="fixed right-4 bottom-6 bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {tab === "rooms" && (
          <div>
            {/* Desktop rooms table */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-xs text-gray-500 uppercase">
                    <tr>
                      <th className="py-3 px-3">Room Number</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Floor</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Price</th>
                      <th className="py-3 px-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredRooms.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="py-4 px-3 font-medium">{r.number}</td>
                        <td className="py-4 px-3">{categories.find((c) => c.id === r.categoryId)?.name || "-"}</td>
                        <td className="py-4 px-3">{r.floor ?? "-"}</td>
                        <td className="py-4 px-3">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${r.status === "Available" ? "bg-green-50 text-green-700" : r.status === "Occupied" ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red-700"}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-4 px-3">₦{r.price.toLocaleString()}</td>
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => { setEditingRoom(r); setShowAddRoom(true); }} className="px-3 py-1 rounded-md bg-white border border-gray-100 text-gray-700 hover:shadow-sm flex items-center gap-2">
                              <Edit2 className="w-4 h-4" /> Edit
                            </button>
                            <button className="px-3 py-1 rounded-md bg-red-50 text-red-600 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Disable</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

            {/* Mobile rooms list */}
            <div className="md:hidden space-y-3">
              <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-50 rounded-lg p-2 flex items-center gap-2 w-full">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input value={queryRoom} onChange={(e) => setQueryRoom(e.target.value)} placeholder="Search room number or features" className="bg-transparent outline-none text-sm w-full" />
                  </div>

                  <button onClick={() => { setEditingRoom(null); setShowAddRoom(true); }} className="bg-green-600 text-white p-2 rounded-lg">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {filteredRooms.map((r) => (
                <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-lg">Room {r.number}</div>
                      <div className={`text-xs ${r.status === "Available" ? "text-green-600" : r.status === "Occupied" ? "text-yellow-600" : "text-red-600"}`}>{r.status}</div>
                    </div>
                    <div className="text-sm text-gray-500">{categories.find((c) => c.id === r.categoryId)?.name || "-"} • ₦{r.price.toLocaleString()}</div>

                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      {r.features.includes("WiFi") && <div className="flex items-center gap-1"><Wifi className="w-4 h-4" /> WiFi</div>}
                      {r.features.includes("AC") && <div className="flex items-center gap-1"><Thermometer className="w-4 h-4" /> AC</div>}
                      {r.features.includes("TV") && <div className="flex items-center gap-1"><Tv className="w-4 h-4" /> TV</div>}
                    </div>
                  </div>

                  <div>
                    <button className="p-2 rounded hover:bg-gray-50"><MoreHorizontal className="w-5 h-5 text-gray-600" /></button>
                  </div>
                </div>
              ))}

              {/* FAB */}
              <button onClick={() => { setEditingRoom(null); setShowAddRoom(true); }} className="fixed right-4 bottom-6 bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {tab === "pricing" && (
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h2 className="text-lg font-medium">Room Pricing</h2>
              <p className="text-sm text-gray-500 mt-1">Adjust base price and meal plan add-ons per category.</p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Category</label>
                  <select value={pricingCategoryId || ""} onChange={(e) => setPricingCategoryId(e.target.value || null)} className="mt-1 w-full rounded-lg border border-gray-100 p-3 text-sm">
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>

                  {pricingCategoryId && (
                    <div className="mt-4 space-y-3">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium">Base Price</div>
                            <div className="text-xs text-gray-500">Default room rate</div>
                          </div>
                          <div>
                            <input type="number" placeholder="₦" className="w-36 rounded-lg border border-gray-100 p-2 text-sm" onChange={(e) => setPricing((p) => ({ ...p, base: Number(e.target.value) }))} />
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm font-medium">Meal Plan Add-ons</div>
                        <div className="mt-3 grid grid-cols-1 gap-3">
                          <div className="flex items-center justify-between">
                            <div className="text-sm">Breakfast add-on</div>
                            <input type="number" className="w-36 rounded-lg border border-gray-100 p-2 text-sm" onChange={(e) => setPricing((p) => ({ ...p, breakfast: Number(e.target.value) }))} />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm">Half Board add-on</div>
                            <input type="number" className="w-36 rounded-lg border border-gray-100 p-2 text-sm" onChange={(e) => setPricing((p) => ({ ...p, half: Number(e.target.value) }))} />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm">Full Board add-on</div>
                            <input type="number" className="w-36 rounded-lg border border-gray-100 p-2 text-sm" onChange={(e) => setPricing((p) => ({ ...p, full: Number(e.target.value) }))} />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 justify-end">
                        <button className="px-4 py-2 rounded-lg border border-gray-100">Cancel</button>
                        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">Apply Pricing</button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="hidden md:block">
                  {/* Visual / help panel */}
                  <div className="bg-white rounded-lg border border-gray-100 p-4 h-full">
                    <div className="text-sm text-gray-500">Pricing preview and tips</div>
                    <ul className="mt-3 text-sm text-gray-600 space-y-2">
                      <li>Base price is the default rate per night.</li>
                      <li>Meal plan add-ons are added on top of base price.</li>
                      <li>Consider creating seasonal overrides for holidays.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile pricing flow */}
            <div className="md:hidden mt-4">
              <div className="space-y-3">
                <div className="bg-white rounded-lg border border-gray-100 p-4">
                  <div className="text-sm font-medium">Select Category</div>
                  <select value={pricingCategoryId || ""} onChange={(e) => setPricingCategoryId(e.target.value || null)} className="mt-2 w-full rounded-lg border border-gray-100 p-3 text-sm">
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="bg-white rounded-lg border border-gray-100 p-4">
                  <div className="text-sm font-medium">Base Price</div>
                  <input type="number" placeholder="₦" className="mt-2 w-full rounded-lg border border-gray-100 p-3 text-sm" onChange={(e) => setPricing((p) => ({ ...p, base: Number(e.target.value) }))} />
                </div>

                <div className="bg-white rounded-lg border border-gray-100 p-4">
                  <div className="text-sm font-medium">Breakfast add-on</div>
                  <input type="number" placeholder="₦" className="mt-2 w-full rounded-lg border border-gray-100 p-3 text-sm" onChange={(e) => setPricing((p) => ({ ...p, breakfast: Number(e.target.value) }))} />
                </div>

                <div className="flex items-center gap-3 justify-end">
                  <button className="px-4 py-2 rounded-lg border border-gray-100">Cancel</button>
                  <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">Apply</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Add / Edit Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div onClick={() => { setShowAddCategory(false); setEditingCategory(null); }} className="absolute inset-0 bg-black/30" />

          <div className="relative w-full md:w-3/4 lg:w-2/5 bg-white rounded-t-2xl md:rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-auto z-50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{editingCategory ? "Edit Category" : "Add Category"}</h3>
                <p className="text-sm text-gray-500">Create or update a room category</p>
              </div>
              <button onClick={() => { setShowAddCategory(false); setEditingCategory(null); }} className="text-gray-500">Close</button>
            </div>

            <CategoryForm initial={editingCategory} onCancel={() => { setShowAddCategory(false); setEditingCategory(null); }} onSave={saveCategory} />
          </div>
        </div>
      )}

      {/* Add / Edit Room Modal */}
      {showAddRoom && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div onClick={() => { setShowAddRoom(false); setEditingRoom(null); }} className="absolute inset-0 bg-black/30" />

          <div className="relative w-full md:w-3/4 lg:w-2/5 bg-white rounded-t-2xl md:rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-auto z-50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{editingRoom ? "Edit Room" : "Add Room"}</h3>
                <p className="text-sm text-gray-500">Define room number, features and status</p>
              </div>
              <button onClick={() => { setShowAddRoom(false); setEditingRoom(null); }} className="text-gray-500">Close</button>
            </div>

            <RoomForm initial={editingRoom} categories={categories} onCancel={() => { setShowAddRoom(false); setEditingRoom(null); }} onSave={saveRoom} />
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryForm({ initial, onCancel, onSave }: { initial?: Category | null; onCancel: () => void; onSave: (c: Category) => void }) {
  const [name, setName] = useState(initial?.name || "");
  const [desc, setDesc] = useState("");
  const [maxOccupancy, setMaxOccupancy] = useState(initial?.maxOccupancy || 2);
  const [basePrice, setBasePrice] = useState(initial?.basePrice || 0);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>(initial?.mealPlans || ["Room Only"]);
  const [active, setActive] = useState(initial?.active ?? true);

  function toggleMeal(m: MealPlan) {
    setMealPlans((p) => (p.includes(m) ? p.filter((x) => x !== m) : [...p, m]));
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ id: initial?.id || `c${Date.now()}`, name, maxOccupancy, basePrice, mealPlans, roomsCount: initial?.roomsCount || 0, active }); }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600">Category Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-100 p-3 text-sm" />
        </div>

        <div>
          <label className="text-sm text-gray-600">Max Occupancy</label>
          <select value={String(maxOccupancy)} onChange={(e) => setMaxOccupancy(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-gray-100 p-3 text-sm">
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">Description</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-100 p-3 text-sm h-24" />
        </div>

        <div>
          <label className="text-sm text-gray-600">Base Price</label>
          <input type="number" value={basePrice} onChange={(e) => setBasePrice(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-gray-100 p-3 text-sm" />
        </div>

        <div>
          <label className="text-sm text-gray-600">Image (optional)</label>
          <div className="mt-1 rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">Drop or upload image</div>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">Meal Plans</label>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(["Room Only","Breakfast","Half Board","Full Board"] as MealPlan[]).map(m => (
              <button type="button" key={m} onClick={() => toggleMeal(m)} className={`text-sm p-2 rounded-lg border ${mealPlans.includes(m) ? "bg-green-50 border-green-200" : "bg-white border-gray-100"}`}>{m}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-100">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded-lg bg-green-600 text-white">Save Category</button>
      </div>
    </form>
  );
}

function RoomForm({ initial, categories, onCancel, onSave }: { initial?: Room | null; categories: Category[]; onCancel: () => void; onSave: (r: Room) => void }) {
  const [number, setNumber] = useState(initial?.number || "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId || categories[0]?.id || "");
  const [floor, setFloor] = useState<number | undefined>(initial?.floor);
  const [status, setStatus] = useState<Room["status"]>(initial?.status || "Available");
  const [price, setPrice] = useState<number>(initial?.price || categories.find((c) => c.id === (initial?.categoryId || categories[0]?.id))?.basePrice || 0);
  const [features, setFeatures] = useState<string[]>(initial?.features || []);

  function toggleFeature(f: string) {
    setFeatures((p) => (p.includes(f) ? p.filter((x) => x !== f) : [...p, f]));
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ id: initial?.id || `r${Date.now()}`, number, categoryId, floor, status, price, features }); }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600">Room Number</label>
          <input value={number} onChange={(e) => setNumber(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-100 p-3 text-sm" />
        </div>

        <div>
          <label className="text-sm text-gray-600">Category</label>
          <select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); const cat = categories.find(c => c.id === e.target.value); if (cat) setPrice(cat.basePrice); }} className="mt-1 w-full rounded-lg border border-gray-100 p-3 text-sm">
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600">Floor</label>
          <input value={floor ?? ""} onChange={(e) => setFloor(Number(e.target.value) || undefined)} className="mt-1 w-full rounded-lg border border-gray-100 p-3 text-sm" />
        </div>

        <div>
          <label className="text-sm text-gray-600">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as Room["status"])} className="mt-1 w-full rounded-lg border border-gray-100 p-3 text-sm">
            <option>Available</option>
            <option>Occupied</option>
            <option>Maintenance</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">Features</label>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {["AC","TV","WiFi","Wardrobe","Water Heater","Balcony"].map(f => (
              <button type="button" key={f} onClick={() => toggleFeature(f)} className={`text-sm p-2 rounded-lg border ${features.includes(f) ? "bg-green-50 border-green-200" : "bg-white border-gray-100"}`}>{f}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">Price (override)</label>
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-gray-100 p-3 text-sm" />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-100">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded-lg bg-green-600 text-white">Save Room</button>
      </div>
    </form>
  );
}
