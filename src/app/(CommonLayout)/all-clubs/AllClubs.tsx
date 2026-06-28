"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Mail, Clock, Plus, X, Building2, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import RequireRole from "@/components/auth/RequireRole";
import InputField from "@/components/form/InputField";
import InputFieldPassword from "@/components/form/InputFieldPassword";
import { fetchUrl } from "@/lib/fetchUrl";

type ClubStatus = "Active" | "Pending" | "Suspended";

interface ClubRow {
  id: string;
  name: string;
  location: string;
  ownerEmail: string;
  status: ClubStatus;
  teeTimeCount: number;
}

interface CreateClubForm {
  name: string;
  email: string;
  password: string;
}

const toClubStatus = (status: string): ClubStatus => {
  if (status === "ACTIVE") return "Active";
  if (status === "SUSPENDED") return "Suspended";
  return "Pending";
};

const AllClubs = () => {
  const [clubList, setClubList] = useState<ClubRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateClubForm>();

  useEffect(() => {
    const loadClubs = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const res = await fetchUrl("/courses/admin/all?limit=100");
        const rows: ClubRow[] = res.data.map((course: any) => ({
          id: course.id,
          name: course.name,
          location: course.location,
          ownerEmail: course.owner?.email ?? "—",
          status: toClubStatus(course.status),
          teeTimeCount: course.teeTimeCount,
        }));
        setClubList(rows);
      } catch (err: any) {
        setLoadError(err.message || "Failed to load clubs.");
      } finally {
        setIsLoading(false);
      }
    };

    loadClubs();
  }, []);

  const onSubmit: SubmitHandler<CreateClubForm> = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await fetchUrl("/courses", {
        method: "POST",
        body: data,
      });
      const course = res.data;

      const newClub: ClubRow = {
        id: course._id,
        name: course.name,
        location: course.location,
        ownerEmail: data.email,
        status: toClubStatus(course.status),
        teeTimeCount: 0,
      };

      setClubList([newClub, ...clubList]);
      setIsModalOpen(false);
      reset();
      toast.success("Club created successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to create club.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RequireRole role="admin">
      <div className="flex flex-col gap-8 p-6 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Clubs</h1>
            <p className="text-gray-500 mt-1">
              {clubList.length} clubs registered on the platform
            </p>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/10 cursor-pointer self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Club</span>
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Club</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Tee Times</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading clubs...
                    </div>
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-red-500 text-sm font-medium">
                    {loadError}
                  </td>
                </tr>
              ) : clubList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    No clubs registered yet.
                  </td>
                </tr>
              ) : (
                clubList.map((club) => (
                  <tr key={club.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#eefaf3] flex items-center justify-center text-[#2ea268] font-bold shrink-0">
                          {club.name[0]}
                        </div>
                        <span className="font-bold text-gray-900">{club.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-300" />
                        {club.location}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-300" />
                        {club.ownerEmail}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-gray-900 font-bold">
                        <Clock className="w-3.5 h-3.5 text-gray-300" />
                        {club.teeTimeCount}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold border",
                          club.status === "Active"
                            ? "bg-green-50 text-green-600 border-green-100"
                            : club.status === "Suspended"
                            ? "bg-red-50 text-red-600 border-red-100"
                            : "bg-orange-50 text-orange-600 border-orange-100"
                        )}
                      >
                        {club.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE NEW CLUB MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl z-10 overflow-hidden"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon & Title */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">Create Club Account</h3>
                  <p className="text-xs text-slate-400 mt-1">Set up essential credentials for the owner.</p>
                </div>
              </div>

              {/* Creation Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <InputField
                  title="Club Name"
                  name="name"
                  placeholder="e.g. Shadow Creek Golf Course"
                  register={register}
                  error={errors.name}
                />
                
                <InputField
                  title="E-Mail Address"
                  name="email"
                  type="email"
                  placeholder="owner@shadowcreek.com"
                  register={register}
                  error={errors.email}
                />

                <InputFieldPassword
                  title="Password"
                  name="password"
                  placeholder="••••••••"
                  register={register}
                  error={errors.password}
                  inputClassName="bg-white border border-slate-200 py-3.5 rounded-xl text-sm font-normal text-slate-800 placeholder:text-slate-400 focus:border-[#0b3b0b]/40 focus:bg-white"
                />

                {/* Helpful Instruction Tip */}
                <div className="flex gap-2.5 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] text-slate-500 leading-relaxed">
                  <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    The club owner will use these credentials to log in. Once logged in, they can fill out full course details and images from their Edit Profile page.
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold transition-all cursor-pointer text-center disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-emerald-600/10 text-center disabled:opacity-60"
                  >
                    {isSubmitting ? "Creating..." : "Create Club"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </RequireRole>
  );
};

export default AllClubs;
