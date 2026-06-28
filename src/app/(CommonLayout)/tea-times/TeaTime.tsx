"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import {
  Upload,
  Filter,
  Calendar,
  Pencil,
  Trash2,
  X,
  Loader2,
  CalendarClock,
  FileUp
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUrl } from "@/lib/fetchUrl";
import { formatDate, formatTime12h } from "@/lib/formatTeeTime";
import InputField from "@/components/form/InputField";
import SelectField from "@/components/form/SelectField";
import UploadTeeTimesModal from "@/components/tea-times/UploadTeeTimesModal";

interface TeeTimeRow {
  id: string;
  club?: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  capacity: number;
  bookedCount: number;
  status: "ACTIVE" | "CANCELLED";
}

interface EditTeeTimeForm {
  startTime: string;
  endTime: string;
  price: number;
  capacity: number;
  status: "ACTIVE" | "CANCELLED";
}

const AvailabilityCell = ({ available, total }: { available: number; total: number }) => {
  const percentage = (available / total) * 100;
  const isFull = available === 0;
  const isLow = available === 1;

  return (
    <td className="px-6 py-5 min-w-[200px]">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isFull ? "bg-red-50" : isLow ? "bg-orange-500" : "bg-[#2ea268]"
            )}
            style={{ width: `${isFull ? 100 : percentage}%` }}
          ></div>
        </div>
        {isFull && <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Full</span>}
      </div>
    </td>
  );
};

const SlotCell = ({ available, total }: { available: number; total: number }) => {
  const isFull = available === 0;
  const isLow = available === 1;

  return (
    <td className="px-6 py-5 text-center">
      <span className={cn(
        "font-bold",
        isFull ? "text-red-500" : isLow ? "text-orange-500" : "text-[#2ea268]"
      )}>
        {available}
      </span>
      <span className="text-gray-300 ml-1">/ {total}</span>
    </td>
  );
};

const StatusBadge = ({ status }: { status: "ACTIVE" | "CANCELLED" }) => (
  <span
    className={cn(
      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
      status === "ACTIVE"
        ? "bg-green-50 text-green-600 border-green-100"
        : "bg-gray-100 text-gray-400 border-gray-200"
    )}
  >
    {status === "ACTIVE" ? "Active" : "Cancelled"}
  </span>
);

const TeaTime = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [teeTimes, setTeeTimes] = useState<TeeTimeRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState("");
  const [editingTeeTime, setEditingTeeTime] = useState<TeeTimeRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  const loadTeeTimes = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const query = new URLSearchParams({ limit: "100" });
      if (dateFilter) query.set("date", dateFilter);

      const res = await fetchUrl(`/tee-times?${query.toString()}`);
      const rows: TeeTimeRow[] = res.data.map((t: any) => ({
        id: t._id,
        club: t.course?.name,
        date: t.date,
        startTime: t.startTime,
        endTime: t.endTime,
        price: t.price,
        capacity: t.capacity,
        bookedCount: t.bookedCount,
        status: t.status,
      }));
      setTeeTimes(rows);
    } catch (err: any) {
      setLoadError(err.message || "Failed to load tee times.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeeTimes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFilter]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this tee time slot? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await fetchUrl(`/tee-times/${id}`, { method: "DELETE" });
      setTeeTimes((prev) => prev.filter((t) => t.id !== id));
      toast.success("Tee time deleted.");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete tee time.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdated = (updated: TeeTimeRow) => {
    setTeeTimes((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setEditingTeeTime(null);
  };

  return (
    <div className="flex flex-col gap-8 p-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tee Times</h1>
          <p className="text-gray-500 mt-1">
            {isLoading ? "Loading..." : `${teeTimes.length} slot${teeTimes.length === 1 ? "" : "s"}${isAdmin ? " across all clubs" : ""}`}
          </p>
        </div>
        {!isAdmin && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCsvModalOpen(true)}
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all font-medium"
            >
              <FileUp className="w-5 h-5" />
              <span>Upload CSV / Excel</span>
            </button>
            <Link href="/tea-times/add-tea-times" className="bg-[#142d22] hover:bg-[#1a3a2e] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#142d22]/20 font-medium">
              <Upload className="w-5 h-5" />
              <span>Upload Tee Times</span>
            </Link>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter by:</span>
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm w-48 focus:ring-2 focus:ring-[#2ea268]/20 transition-all outline-none"
            />
          </div>
          {dateFilter && (
            <button
              onClick={() => setDateFilter("")}
              className="text-xs font-bold text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          )}
        </div>
        <span className="text-sm text-gray-400">
          Showing {teeTimes.length} of {teeTimes.length}
        </span>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/50">
              {isAdmin && (
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Club</th>
              )}
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Time</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Available Slots</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Availability</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
              {!isAdmin && (
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading tee times...
                  </div>
                </td>
              </tr>
            ) : loadError ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-red-500 text-sm font-medium">
                  {loadError}
                </td>
              </tr>
            ) : teeTimes.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-gray-400">
                  <CalendarClock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  No tee times {dateFilter ? "for this date." : "have been added yet."}
                </td>
              </tr>
            ) : (
              teeTimes.map((slot) => {
                const available = slot.capacity - slot.bookedCount;
                return (
                  <tr key={slot.id} className="hover:bg-gray-50/50 transition-colors">
                    {isAdmin && <td className="px-6 py-5 text-gray-900 font-bold">{slot.club}</td>}
                    <td className="px-6 py-5 text-gray-500 font-medium">{formatDate(slot.date)}</td>
                    <td className="px-6 py-5 text-gray-900 font-bold">
                      {formatTime12h(slot.startTime)} – {formatTime12h(slot.endTime)}
                    </td>
                    <td className="px-6 py-5 text-gray-700 font-bold">${slot.price}</td>
                    <SlotCell available={available} total={slot.capacity} />
                    <AvailabilityCell available={available} total={slot.capacity} />
                    <td className="px-6 py-5">
                      <StatusBadge status={slot.status} />
                    </td>
                    {!isAdmin && (
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingTeeTime(slot)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-100 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all text-xs font-bold"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(slot.id)}
                            disabled={deletingId === slot.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all text-xs font-bold disabled:opacity-60"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            {deletingId === slot.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {editingTeeTime && (
        <EditTeeTimeModal
          teeTime={editingTeeTime}
          onClose={() => setEditingTeeTime(null)}
          onSaved={handleUpdated}
        />
      )}

      {isCsvModalOpen && (
        <UploadTeeTimesModal
          onClose={() => setIsCsvModalOpen(false)}
          onUploaded={() => {
            setIsCsvModalOpen(false);
            loadTeeTimes();
          }}
        />
      )}
    </div>
  );
};

const EditTeeTimeModal = ({
  teeTime,
  onClose,
  onSaved,
}: {
  teeTime: TeeTimeRow;
  onClose: () => void;
  onSaved: (updated: TeeTimeRow) => void;
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<EditTeeTimeForm>({
    defaultValues: {
      startTime: teeTime.startTime,
      endTime: teeTime.endTime,
      price: teeTime.price,
      capacity: teeTime.capacity,
      status: teeTime.status,
    },
  });

  const onSubmit: SubmitHandler<EditTeeTimeForm> = async (data) => {
    setIsSaving(true);
    try {
      const res = await fetchUrl(`/tee-times/${teeTime.id}`, { method: "PATCH", body: data });
      const updated = res.data;
      onSaved({
        id: updated._id,
        club: teeTime.club,
        date: updated.date,
        startTime: updated.startTime,
        endTime: updated.endTime,
        price: updated.price,
        capacity: updated.capacity,
        bookedCount: updated.bookedCount,
        status: updated.status,
      });
      toast.success("Tee time updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update tee time.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-xs"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl z-10"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-xl font-bold text-slate-900 mb-6">Edit Tee Time</h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <InputField title="Start Time" name="startTime" type="time" register={register} error={errors.startTime} />
              <InputField title="End Time" name="endTime" type="time" register={register} error={errors.endTime} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField title="Price ($)" name="price" type="number" register={register} error={errors.price} />
              <InputField title="Capacity (1-4)" name="capacity" type="number" register={register} error={errors.capacity} />
            </div>
            <SelectField
              title="Status"
              name="status"
              options={[
                { label: "Active", value: "ACTIVE" },
                { label: "Cancelled", value: "CANCELLED" },
              ]}
              register={register}
              error={errors.status}
            />

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold transition-all disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-600/10 disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TeaTime;
