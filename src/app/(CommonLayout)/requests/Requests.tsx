"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Clock,
  Users,
  ChevronRight,
  X,
  Mail,
  Phone,
  Flag,
  CheckCircle2,
  Clock3,
  XCircle,
  Loader2,
  RefreshCw,
  Building2,
  DollarSign,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUrl } from "@/lib/fetchUrl";

// ── Types ────────────────────────────────────────────────────────────────────

type BookingStatus = "PENDING" | "CONFIRMED" | "DECLINED" | "CANCELLED";

interface TeeTimeRef {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  session: string;
  price: number;
}

interface CourseRef {
  _id: string;
  name: string;
}

interface BookingItem {
  _id: string;
  bookingId: string;
  status: BookingStatus;
  players: number;
  holesPreference: "9" | "18";
  specialRequests?: string;
  contact: { fullName: string; email: string; phone: string };
  pricing: { teeTimePrice: number; bookingFee: number; taxes: number; total: number };
  teeTime: TeeTimeRef;
  course: CourseRef;
  createdAt: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type FilterStatus = "PENDING" | "CONFIRMED" | "DECLINED" | "CANCELLED" | "ALL";

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatTime24to12 = (time24: string): string => {
  if (!time24) return "—";
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const formatDateTime = (dateStr: string): string => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
};

const initials = (name: string): string =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const statusConfig: Record<
  BookingStatus,
  { label: string; badge: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: "Pending",
    badge: "bg-orange-50 text-orange-600 border-orange-100",
    icon: <Clock3 className="w-3 h-3" />,
  },
  CONFIRMED: {
    label: "Confirmed",
    badge: "bg-green-50 text-green-600 border-green-100",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  DECLINED: {
    label: "Declined",
    badge: "bg-red-50 text-red-600 border-red-100",
    icon: <XCircle className="w-3 h-3" />,
  },
  CANCELLED: {
    label: "Cancelled",
    badge: "bg-gray-100 text-gray-500 border-gray-200",
    icon: <XCircle className="w-3 h-3" />,
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

const FILTER_TABS: { label: string; value: FilterStatus; badgeColor: string }[] = [
  { label: "All", value: "ALL", badgeColor: "bg-gray-100 text-gray-600" },
  { label: "Pending", value: "PENDING", badgeColor: "bg-orange-100 text-orange-600" },
  { label: "Confirmed", value: "CONFIRMED", badgeColor: "bg-green-100 text-green-600" },
  { label: "Declined", value: "DECLINED", badgeColor: "bg-red-100 text-red-600" },
  { label: "Cancelled", value: "CANCELLED", badgeColor: "bg-gray-100 text-gray-500" },
];

const Requests = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // State
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("PENDING");
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [page, setPage] = useState(1);

  // Action state (confirm/decline)
  const [actionId, setActionId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // ── Fetch ───────────────────────────────────────────────────────────────────

  const fetchBookings = useCallback(
    async (opts: { filter: FilterStatus; page: number; silent?: boolean }) => {
      if (!opts.silent) setIsLoading(true);
      else setIsRefreshing(true);
      setFetchError(null);

      try {
        const params = new URLSearchParams({
          page: String(opts.page),
          limit: "20",
        });
        if (opts.filter !== "ALL") params.set("status", opts.filter);

        const res = await fetchUrl(`/bookings?${params.toString()}`);
        setBookings(res.data || []);
        setMeta(res.meta || null);

        // Select first item by default
        if (res.data?.length > 0 && !selectedBooking) {
          setSelectedBooking(res.data[0]);
        } else if (res.data?.length === 0) {
          setSelectedBooking(null);
        }
      } catch (err: any) {
        setFetchError(err.message || "Failed to load requests.");
        setBookings([]);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    fetchBookings({ filter: activeFilter, page });
  }, [activeFilter, page, fetchBookings]);

  // When filter changes, reset to page 1 and clear selection
  const handleFilterChange = (filter: FilterStatus) => {
    setActiveFilter(filter);
    setPage(1);
    setSelectedBooking(null);
  };

  // ── Confirm / Decline ───────────────────────────────────────────────────────

  const handleDecision = async (
    booking: BookingItem,
    decision: "confirm" | "decline"
  ) => {
    setActionId(booking._id);
    setActionError(null);

    try {
      const updated = await fetchUrl(`/bookings/${booking._id}/${decision}`, {
        method: "PATCH",
      });
      const newStatus: BookingStatus =
        decision === "confirm" ? "CONFIRMED" : "DECLINED";

      // Optimistically update the list
      setBookings((prev) =>
        prev.map((b) =>
          b._id === booking._id ? { ...b, status: newStatus } : b
        )
      );
      setSelectedBooking((prev) =>
        prev?._id === booking._id ? { ...prev, status: newStatus } : prev
      );
    } catch (err: any) {
      setActionError(err.message || "Action failed. Please try again.");
    } finally {
      setActionId(null);
    }
  };

  // ── Tab counts (derived from current page only — use meta for global totals) ─

  const totalCount = meta?.total ?? bookings.length;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Requests</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {isAdmin
              ? "View and monitor all club booking requests across every course."
              : "Review and manage incoming player booking requests for your club."}
          </p>
        </div>
        <button
          onClick={() =>
            fetchBookings({ filter: activeFilter, page, silent: true })
          }
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-50"
        >
          <RefreshCw
            className={cn("w-4 h-4", isRefreshing && "animate-spin")}
          />
          Refresh
        </button>
      </div>

      {/* Admin notice */}
      {isAdmin && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 text-blue-700 rounded-2xl px-5 py-4 text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>
            You are viewing as <strong>Admin</strong>. All requests across all
            clubs are shown. Confirm / Decline actions are available to club
            owners only.
          </span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-fit flex-wrap">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleFilterChange(tab.value)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm",
              activeFilter === tab.value
                ? "bg-[#142d22] text-white shadow-lg shadow-[#142d22]/20"
                : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <span>{tab.label}</span>
            {tab.value === activeFilter && (
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-bold",
                  activeFilter === tab.value
                    ? "bg-white/20 text-white"
                    : tab.badgeColor
                )}
              >
                {totalCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: List ── */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* List header */}
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {isLoading ? "Loading…" : `${bookings.length} request${bookings.length !== 1 ? "s" : ""}`}
              </span>
              {meta && meta.totalPages > 1 && (
                <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-2 py-1 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-all"
                  >
                    ‹ Prev
                  </button>
                  <span>
                    {page} / {meta.totalPages}
                  </span>
                  <button
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-2 py-1 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-all"
                  >
                    Next ›
                  </button>
                </div>
              )}
            </div>

            {/* Loading */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20 text-gray-400">
                <Loader2 className="w-7 h-7 animate-spin text-[#2ea268]" />
              </div>
            ) : fetchError ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center text-gray-400 gap-3">
                <AlertCircle className="w-8 h-8 text-rose-400" />
                <p className="text-sm font-semibold text-rose-500">{fetchError}</p>
                <button
                  onClick={() => fetchBookings({ filter: activeFilter, page })}
                  className="text-xs underline text-gray-400 hover:text-gray-600"
                >
                  Try again
                </button>
              </div>
            ) : bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400 gap-2">
                <Calendar className="w-10 h-10 text-gray-200" />
                <p className="font-semibold text-gray-400">No requests found</p>
                <p className="text-sm text-gray-300">
                  {activeFilter === "PENDING"
                    ? "All caught up — no pending requests."
                    : `No ${activeFilter.toLowerCase()} requests yet.`}
                </p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-gray-50">
                {bookings.map((booking) => {
                  const sc = statusConfig[booking.status];
                  const isSelected = selectedBooking?._id === booking._id;
                  return (
                    <button
                      key={booking._id}
                      onClick={() => setSelectedBooking(booking)}
                      className={cn(
                        "flex items-center gap-4 px-6 py-5 transition-all text-left border-l-4 w-full",
                        isSelected
                          ? "bg-[#f1fcf6] border-l-[#2ea268]"
                          : "hover:bg-gray-50 border-l-transparent"
                      )}
                    >
                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-full bg-[#eefaf3] flex items-center justify-center text-[#2ea268] font-bold shrink-0 text-sm">
                        {initials(booking.contact.fullName)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">
                          {booking.contact.fullName}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                          {isAdmin && booking.course?.name && (
                            <div className="flex items-center gap-1 text-blue-500 font-semibold">
                              <Building2 className="w-3.5 h-3.5" />
                              <span className="truncate max-w-[120px]">
                                {booking.course.name}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatDate(booking.teeTime?.date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{formatTime24to12(booking.teeTime?.startTime)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            <span>{booking.players}p</span>
                          </div>
                        </div>
                      </div>

                      {/* Status badge + arrow */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1",
                            sc.badge
                          )}
                        >
                          {sc.icon}
                          {sc.label}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Details Panel ── */}
        <div className="lg:col-span-1">
          {selectedBooking ? (
            <DetailPanel
              booking={selectedBooking}
              isAdmin={isAdmin}
              actionId={actionId}
              actionError={actionError}
              onDecision={handleDecision}
              onClose={() => setSelectedBooking(null)}
            />
          ) : (
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-300 text-sm font-medium">
              Select a request to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Detail Panel ──────────────────────────────────────────────────────────────

interface DetailPanelProps {
  booking: BookingItem;
  isAdmin: boolean;
  actionId: string | null;
  actionError: string | null;
  onDecision: (b: BookingItem, d: "confirm" | "decline") => void;
  onClose: () => void;
}

const DetailPanel = ({
  booking,
  isAdmin,
  actionId,
  actionError,
  onDecision,
  onClose,
}: DetailPanelProps) => {
  const sc = statusConfig[booking.status];
  const isBusy = actionId === booking._id;

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 sticky top-24 overflow-hidden">
      {/* Panel header */}
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Request Details</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Booking ID + Status */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-0.5">
              Booking ID
            </p>
            <p className="text-sm font-bold text-[#10561c]">
              {booking.bookingId}
            </p>
          </div>
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5",
              sc.badge
            )}
          >
            {sc.icon}
            {sc.label}
          </span>
        </div>

        {/* Club name (for admins) */}
        {isAdmin && booking.course?.name && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <Building2 className="w-4 h-4 text-blue-500 shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                Club
              </p>
              <p className="text-sm font-bold text-blue-700">
                {booking.course.name}
              </p>
            </div>
          </div>
        )}

        {/* Player info */}
        <div className="bg-gray-50/60 p-5 rounded-2xl space-y-4">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Player Information
          </h4>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#eefaf3] flex items-center justify-center text-[#2ea268] font-bold text-sm shrink-0">
              {initials(booking.contact.fullName)}
            </div>
            <span className="text-base font-bold text-gray-900">
              {booking.contact.fullName}
            </span>
          </div>
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Mail className="w-4 h-4 text-gray-300 shrink-0" />
              <span className="truncate">{booking.contact.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Phone className="w-4 h-4 text-gray-300 shrink-0" />
              <span>{booking.contact.phone || "—"}</span>
            </div>
          </div>
        </div>

        {/* Booking details grid */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Booking Details
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-gray-100 p-3.5 rounded-xl shadow-sm">
              <div className="flex items-center gap-1.5 text-gray-300 mb-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Date</span>
              </div>
              <p className="font-bold text-gray-900 text-sm">
                {formatDate(booking.teeTime?.date)}
              </p>
            </div>
            <div className="bg-white border border-gray-100 p-3.5 rounded-xl shadow-sm">
              <div className="flex items-center gap-1.5 text-gray-300 mb-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Time</span>
              </div>
              <p className="font-bold text-gray-900 text-sm">
                {formatTime24to12(booking.teeTime?.startTime)}
              </p>
            </div>
            <div className="bg-white border border-gray-100 p-3.5 rounded-xl shadow-sm">
              <div className="flex items-center gap-1.5 text-gray-300 mb-1.5">
                <Flag className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Holes</span>
              </div>
              <p className="font-bold text-gray-900 text-sm">
                {booking.holesPreference} Holes
              </p>
            </div>
            <div className="bg-white border border-gray-100 p-3.5 rounded-xl shadow-sm">
              <div className="flex items-center gap-1.5 text-gray-300 mb-1.5">
                <Users className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Players</span>
              </div>
              <p className="font-bold text-gray-900 text-sm">
                {booking.players} {booking.players === 1 ? "Player" : "Players"}
              </p>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-[#f8fdf9] border border-emerald-100 rounded-2xl p-4 space-y-2">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            Pricing
          </h4>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Green Fee</span>
            <span>${booking.pricing.teeTimePrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Booking Fee</span>
            <span>${booking.pricing.bookingFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Taxes</span>
            <span>${booking.pricing.taxes.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-sm text-[#10561c] pt-2 border-t border-emerald-100">
            <span>Total</span>
            <span>${booking.pricing.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Special requests */}
        {booking.specialRequests && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                Special Requests
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {booking.specialRequests}
            </p>
          </div>
        )}

        {/* Timestamps */}
        <p className="text-[11px] text-gray-300 text-center">
          Requested {formatDateTime(booking.createdAt)}
        </p>

        {/* Action error */}
        {actionError && actionId === null && (
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl px-4 py-3 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Action buttons — club owner only, pending only */}
        {!isAdmin && booking.status === "PENDING" && (
          <div className="flex gap-3 pt-2 border-t border-gray-50">
            <button
              disabled={isBusy}
              onClick={() => onDecision(booking, "decline")}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all text-sm font-bold disabled:opacity-50"
            >
              {isBusy ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              Decline
            </button>
            <button
              disabled={isBusy}
              onClick={() => onDecision(booking, "confirm")}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#2ea268] text-white hover:bg-[#288c5a] transition-all text-sm font-bold disabled:opacity-50"
            >
              {isBusy ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              Confirm
            </button>
          </div>
        )}

        {/* Admin read-only notice for pending */}
        {isAdmin && booking.status === "PENDING" && (
          <div className="pt-2 border-t border-gray-50">
            <p className="text-sm text-center text-blue-500 font-semibold">
              Awaiting club owner decision
            </p>
          </div>
        )}

        {/* Resolved status note */}
        {booking.status !== "PENDING" && (
          <div className="pt-2 border-t border-gray-50 text-center">
            <p className="text-sm text-gray-400">
              This request has been{" "}
              <span
                className={cn(
                  "font-bold",
                  booking.status === "CONFIRMED"
                    ? "text-green-600"
                    : "text-red-500"
                )}
              >
                {booking.status.toLowerCase()}
              </span>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;