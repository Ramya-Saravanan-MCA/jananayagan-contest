import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Download,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Menu,
  LogOut,
  X,
  Eye,
} from "lucide-react";
import { supabase } from "../lib/supabase";

const Admin = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [totalEntries, setTotalEntries] = useState(0);
  const [todayEntries, setTodayEntries] = useState(0);

  const ITEMS_PER_PAGE = 10;

  const getSearchQuery = (query) => {
    const value = query
      .trim()
      .replace(/[%_]/g, "")
      .replace(/,/g, " ");

    if (!value) return null;

    return `full_name.ilike.%${value}%,mobile.ilike.%${value}%,email.ilike.%${value}%,zee5_account.ilike.%${value}%,city.ilike.%${value}%`;
  };

  const fetchEntries = async () => {
    setLoading(true);

    try {
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from("giveaway_entries")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      const searchQuery = getSearchQuery(search);

      if (searchQuery) {
        query = query.or(searchQuery);
      }

      const { data, count, error } = await query;

      if (error) {
        console.error("Failed to fetch entries:", error);
        alert("Failed to load entries.");
        return;
      }

      setEntries(data || []);
      setTotalEntries(count || 0);

      const now = new Date();

      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0
      );

      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999
      );

      let todayQuery = supabase
        .from("giveaway_entries")
        .select("id", {
          count: "exact",
          head: true,
        })
        .gte("created_at", startOfDay.toISOString())
        .lte("created_at", endOfDay.toISOString());

      const todaySearchQuery = getSearchQuery(search);

      if (todaySearchQuery) {
        todayQuery = todayQuery.or(todaySearchQuery);
      }

      const {
        count: todayCount,
        error: todayError,
      } = await todayQuery;

      if (todayError) {
        console.error(
          "Failed to fetch today's entries:",
          todayError
        );
      } else {
        setTodayEntries(todayCount || 0);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Failed to load entries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      setAuthChecking(true);

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          window.location.href = "/admin/login";
          return;
        }

        const { data: admin, error: adminError } =
          await supabase
            .from("admin_users")
            .select("user_id")
            .eq("user_id", user.id)
            .maybeSingle();

        if (adminError) {
          console.error(
            "Admin verification error:",
            adminError
          );

          await supabase.auth.signOut();
          window.location.href = "/admin/login";
          return;
        }

        if (!admin) {
          await supabase.auth.signOut();
          alert(
            "You do not have permission to access the admin dashboard."
          );
          window.location.href = "/admin/login";
          return;
        }

        setIsAdmin(true);
        setAuthChecking(false);
      } catch (error) {
        console.error("Authentication error:", error);
        await supabase.auth.signOut();
        window.location.href = "/admin/login";
      }
    };

    checkAdmin();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    fetchEntries();
  }, [isAdmin, currentPage, search]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      alert("Failed to logout.");
      return;
    }

    window.location.href = "/admin/login";
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(
    totalEntries / ITEMS_PER_PAGE
  );

  const exportCSV = async () => {
    setLoading(true);

    try {
      let allEntries = [];
      const PAGE_SIZE = 1000;
      let from = 0;

      while (true) {
        let query = supabase
          .from("giveaway_entries")
          .select("*")
          .order("created_at", {
            ascending: false,
          })
          .range(from, from + PAGE_SIZE - 1);

        const searchQuery = getSearchQuery(search);

        if (searchQuery) {
          query = query.or(searchQuery);
        }

        const { data, error } = await query;

        if (error) {
          console.error(
            "Export fetch error:",
            error
          );
          alert("Failed to export entries.");
          return;
        }

        allEntries = [
          ...allEntries,
          ...(data || []),
        ];

        if (!data || data.length < PAGE_SIZE) {
          break;
        }

        from += PAGE_SIZE;
      }

      if (!allEntries.length) {
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

      const rows = allEntries.map((entry) => [
        entry.full_name || "",
        entry.mobile || "",
        entry.email || "",
        entry.city || "",
        entry.zee5_account || "",
        entry.screenshot_url || "",
        entry.created_at
          ? new Date(
              entry.created_at
            ).toLocaleString()
          : "",
      ]);

      const csv = [headers, ...rows]
        .map((row) =>
          row
            .map(
              (value) =>
                `"${String(value).replace(
                  /"/g,
                  '""'
                )}"`
            )
            .join(",")
        )
        .join("\n");

      const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      });

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
    } finally {
      setLoading(false);
    }
  };

  if (authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-purple-500" />
          <p className="text-sm text-gray-400">
            Checking admin access...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[240px] flex-col border-r border-white/5 bg-[#0d0d14] transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-[72px] shrink-0 items-center justify-center border-b border-white/5 px-6">
          <img
            src="/images/Logo_zee5.png"
            alt="ZEE5"
            className="h-10 w-auto object-contain"
          />
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-6">
          <p className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-wider text-gray-600">
            Menu
          </p>

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
        </nav>

        <div className="shrink-0 border-t border-white/5 bg-[#0d0d14] p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="min-h-screen overflow-x-hidden lg:pl-[240px]">
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

              <h1 className="text-lg font-bold">
                Dashboard
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchEntries}
              disabled={loading}
              className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-medium text-gray-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={
                  loading ? "animate-spin" : ""
                }
              />

              <span className="hidden sm:inline">
                Refresh
              </span>
            </button>

            <button
              onClick={exportCSV}
              className="flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 text-xs font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:shadow-purple-500/40"
            >
              <Download size={14} />

              <span className="hidden sm:inline">
                Export
              </span>
            </button>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
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

          <div className="mb-5 flex flex-col gap-4 rounded-xl border border-white/5 bg-[#0d0d14] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold">
                All Entries
              </h3>

              <p className="text-[11px] text-gray-500">
                {totalEntries} entries found
              </p>
            </div>

            <div className="relative w-full sm:w-[320px]">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                value={search}
                onChange={handleSearch}
                placeholder="Search by name, email, mobile, city..."
                className="h-9 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-xs text-white placeholder-gray-500 outline-none transition focus:border-purple-500/50"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/5 bg-[#0d0d14]">
            <div className="w-full overflow-hidden">
              <table className="w-full table-fixed text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="w-[5%] px-3 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                      #
                    </th>

                    <th className="w-[25%] px-3 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                      Participant
                    </th>

                    <th className="w-[13%] px-3 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                      Mobile
                    </th>

                    <th className="w-[22%] px-3 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                      City
                    </th>

                    <th className="w-[17%] px-3 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                      Screenshot
                    </th>

                    <th className="w-[18%] px-3 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-3 py-20 text-center text-sm text-gray-500"
                      >
                        Loading entries...
                      </td>
                    </tr>
                  ) : entries.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-3 py-20 text-center text-sm text-gray-500"
                      >
                        No entries found.
                      </td>
                    </tr>
                  ) : (
                    entries.map((entry, index) => (
                      <tr
                        key={entry.id}
                        className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                      >
                        <td className="px-3 py-4 text-xs text-gray-500">
                          {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </td>

                        <td className="px-3 py-4">
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold">
                              {entry.full_name}
                            </p>

                            <p className="truncate text-[10px] text-gray-500">
                              {entry.email}
                            </p>
                          </div>
                        </td>

                        <td className="px-3 py-4 text-xs text-gray-400">
                          <span className="block truncate">
                            {entry.mobile}
                          </span>
                        </td>

                        <td className="px-3 py-4 text-xs text-gray-400">
                          <span className="line-clamp-2 break-words leading-5">
                            {entry.city || "-"}
                          </span>
                        </td>

                        <td className="px-3 py-4">
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
                                className="h-12 w-16 object-cover transition-transform group-hover:scale-110"
                              />

                              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                                <Eye
                                  size={15}
                                  className="text-white"
                                />
                              </div>
                            </button>
                          ) : (
                            <span className="text-[10px] text-gray-600">
                              No image
                            </span>
                          )}
                        </td>

                        <td className="px-3 py-4 text-[10px] text-gray-500">
                          {entry.created_at
                            ? new Date(
                                entry.created_at
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-white/5 bg-white/[0.02] px-4 py-3">
                <p className="text-[11px] text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-gray-300">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-gray-300">
                    {Math.min(
                      currentPage * ITEMS_PER_PAGE,
                      totalEntries
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-300">
                    {totalEntries}
                  </span>{" "}
                  entries
                </p>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.max(1, p - 1))
                    }
                    disabled={currentPage === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition hover:bg-white/5 disabled:opacity-30"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, i) => i + 1
                  )
                    .filter((page) => {
                      if (totalPages <= 7) return true;

                      if (
                        page === 1 ||
                        page === totalPages
                      ) {
                        return true;
                      }

                      if (
                        Math.abs(page - currentPage) <= 1
                      ) {
                        return true;
                      }

                      return false;
                    })
                    .map((page, idx, arr) => (
                      <div
                        key={page}
                        className="flex items-center"
                      >
                        {idx > 0 &&
                          arr[idx - 1] !== page - 1 && (
                            <span className="px-2 text-[10px] text-gray-600">
                              ...
                            </span>
                          )}

                        <button
                          onClick={() =>
                            setCurrentPage(page)
                          }
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
                      setCurrentPage((p) =>
                        Math.min(totalPages, p + 1)
                      )
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

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
}) => {
  const colorMap = {
    purple:
      "from-purple-600/20 to-purple-600/5 text-purple-400",
    pink:
      "from-pink-600/20 to-pink-600/5 text-pink-400",
  };

  return (
    <div className="rounded-xl border border-white/5 bg-[#0d0d14] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight">
            {value}
          </p>
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