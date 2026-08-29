import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Image,
  Download,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  X,
  Menu,
  Eye,
} from "lucide-react";
import { supabase } from "../lib/supabase";

const Admin = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const ITEMS_PER_PAGE = 10;

  const fetchEntries = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("giveaway_entries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("Failed to load entries.");
    } else {
      setEntries(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const filteredEntries = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return entries;

    return entries.filter((entry) => {
      return (
        entry.full_name?.toLowerCase().includes(value) ||
        entry.mobile?.toLowerCase().includes(value) ||
        entry.email?.toLowerCase().includes(value) ||
        entry.city?.toLowerCase().includes(value) ||
        entry.zee5_account?.toLowerCase().includes(value)
      );
    });
  }, [entries, search]);

  const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE);
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalEntries = entries.length;

  const cities = new Set(
    entries.map((entry) => entry.city?.trim()).filter(Boolean)
  ).size;

  const todayEntries = entries.filter((entry) => {
    if (!entry.created_at) return false;

    const date = new Date(entry.created_at);
    const today = new Date();

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }).length;

  const uploadedScreenshots = entries.filter(
    (entry) => entry.screenshot_url
  ).length;

  const exportCSV = () => {
    if (!entries.length) {
      alert("There are no entries to export.");
      return;
    }

    const headers = [
      "Name",
      "Mobile",
      "Email",
      "City",
      "Zee 5 Account",
      "Screenshot URL",
      "Created At",
    ];

    const rows = entries.map((entry) => [
      entry.full_name || "",
      entry.mobile || "",
      entry.email || "",
      entry.city || "",
      entry.zee5_account || "",
      entry.screenshot_url || "",
      entry.created_at
        ? new Date(entry.created_at).toLocaleString()
        : "",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `zee5-giveaway-entries-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 z-50 flex h-screen w-[240px] flex-col border-r border-white/5 bg-[#0d0d14] lg:relative lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300`}
        >
          {/* Logo */}
          <div className="flex h-[72px] items-center justify-center border-b border-white/5 px-6">
            <img
              src="/images/Logo_zee5.png"
              alt="ZEE5"
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-6">
            <p className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-wider text-gray-600">
              Menu
            </p>

            <div className="space-y-1">
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  activeTab === "dashboard"
                    ? "bg-purple-500/10 text-purple-400"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-white/5 bg-[#0a0a0f]/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-2 text-gray-400 hover:bg-white/5 lg:hidden"
              >
                <Menu size={20} />
              </button>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-purple-400">
                  Zee 5 GIVEAWAY
                </p>
                <h1 className="text-lg font-bold">Dashboard</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchEntries}
                className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-medium text-gray-300 transition hover:bg-white/10"
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={exportCSV}
                className="flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 text-xs font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:shadow-purple-500/40"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </header>

          {/* Content */}
          <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
            {/* Stats */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Entries"
                value={totalEntries}
                icon={Users}
                color="purple"
              />
              <StatCard
                title="Today's Entries"
                value={todayEntries}
                icon={ArrowUpRight}
                color="pink"
              />
            </div>

            {/* Search & Filter */}
            <div className="mb-5 flex flex-col gap-4 rounded-xl border border-white/5 bg-[#0d0d14] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold">All Entries</h3>
                <p className="text-[11px] text-gray-500">
                  {filteredEntries.length} entries found
                </p>
              </div>

              <div className="relative w-full sm:w-[320px]">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, mobile..."
                  className="h-9 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-xs text-white placeholder-gray-500 outline-none transition focus:border-purple-500/50"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-white/5 bg-[#0d0d14]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                        #
                      </th>
                      <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                        Participant
                      </th>
                      <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                        Mobile
                      </th>
                      <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                        City
                      </th>
                      <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                        Screenshot
                      </th>
                      <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-5 py-20 text-center text-sm text-gray-500"
                        >
                          Loading entries...
                        </td>
                      </tr>
                    ) : paginatedEntries.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-5 py-20 text-center text-sm text-gray-500"
                        >
                          No entries found.
                        </td>
                      </tr>
                    ) : (
                      paginatedEntries.map((entry, index) => (
                        <tr
                          key={entry.id}
                          className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                        >
                          <td className="px-5 py-4 text-xs text-gray-500">
                            {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-xs font-semibold">
                              {entry.full_name}
                            </p>
                            <p className="mt-0.5 text-[10px] text-gray-500">
                              {entry.email}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-xs text-gray-400">
                            {entry.mobile}
                          </td>

                          <td className="px-5 py-4 text-xs text-gray-400">
                            {entry.city}
                          </td>

                          <td className="px-5 py-4">
                            {entry.screenshot_url ? (
                              <button
                                onClick={() =>
                                  setSelectedImage(entry.screenshot_url)
                                }
                                className="group relative overflow-hidden rounded-lg border border-white/10"
                              >
                                <img
                                  src={entry.screenshot_url}
                                  alt="Screenshot"
                                  className="h-11 w-14 object-cover transition-transform group-hover:scale-110"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                                  <Eye size={14} className="text-white" />
                                </div>
                              </button>
                            ) : (
                              <span className="text-[10px] text-gray-600">
                                No image
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4 text-[10px] text-gray-500">
                            {entry.created_at
                              ? new Date(entry.created_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )
                              : "-"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-white/5 bg-white/[0.02] px-5 py-3">
                  <p className="text-[11px] text-gray-500">
                    Showing{" "}
                    <span className="font-semibold text-gray-300">
                      {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-gray-300">
                      {Math.min(currentPage * ITEMS_PER_PAGE, filteredEntries.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-300">
                      {filteredEntries.length}
                    </span>{" "}
                    entries
                  </p>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition hover:bg-white/5 disabled:opacity-30"
                    >
                      <ChevronLeft size={14} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        if (totalPages <= 7) return true;
                        if (page === 1 || page === totalPages) return true;
                        if (Math.abs(page - currentPage) <= 1) return true;
                        return false;
                      })
                      .map((page, idx, arr) => (
                        <div key={page} className="flex items-center">
                          {idx > 0 && arr[idx - 1] !== page - 1 && (
                            <span className="px-2 text-[10px] text-gray-600">
                              ...
                            </span>
                          )}
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition ${
                              currentPage === page
                                ? "bg-purple-500/20 text-purple-400"
                                : "text-gray-400 hover:bg-white/5"
                            }`}
                          >
                            {page}
                          </button>
                        </div>
                      ))}

                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition hover:bg-white/5 disabled:opacity-30"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] rounded-xl border border-white/10 bg-[#0d0d14] p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg transition hover:bg-purple-700"
            >
              <X size={16} />
            </button>

            <img
              src={selectedImage}
              alt="Screenshot"
              className="max-h-[85vh] max-w-[85vw] rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorMap = {
    purple: "from-purple-600/20 to-purple-600/5 text-purple-400",
    pink: "from-pink-600/20 to-pink-600/5 text-pink-400",
    blue: "from-blue-600/20 to-blue-600/5 text-blue-400",
    cyan: "from-cyan-600/20 to-cyan-600/5 text-cyan-400",
  };

  return (
    <div className="rounded-xl border border-white/5 bg-[#0d0d14] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${colorMap[color]}`}
        >
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
};

export default Admin;