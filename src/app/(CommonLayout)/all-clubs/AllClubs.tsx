"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Mail, Clock, Plus, X, Building2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import RequireRole from "@/components/auth/RequireRole";
import InputField from "@/components/form/InputField";
import InputFieldPassword from "@/components/form/InputFieldPassword";

type ClubStatus = "Active" | "Pending";

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

const initialClubs: ClubRow[] = [
  { id: "c1", name: "The Royal Ridges Estate", location: "Scottsdale, AZ", ownerEmail: "owner@royalridges.com", status: "Active", teeTimeCount: 24 },
  { id: "c2", name: "Pinecrest Valley Links", location: "Asheville, NC", ownerEmail: "owner@pinecrestvalley.com", status: "Active", teeTimeCount: 18 },
  { id: "c3", name: "Silver Oak Shores", location: "Naples, FL", ownerEmail: "owner@silveroakshores.com", status: "Active", teeTimeCount: 31 },
  { id: "c4", name: "Highland Meadows", location: "Boulder, CO", ownerEmail: "owner@highlandmeadows.com", status: "Pending", teeTimeCount: 0 },
  { id: "c5", name: "Cedar Hollow Country Club", location: "Austin, TX", ownerEmail: "owner@cedarhollow.com", status: "Active", teeTimeCount: 12 },
  { id: "c6", name: "Bluewater Bay Golf Club", location: "Charleston, SC", ownerEmail: "owner@bluewaterbay.com", status: "Pending", teeTimeCount: 0 },
];

const AllClubs = () => {
  const [clubList, setClubList] = useState<ClubRow[]>(initialClubs);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateClubForm>();

  const onSubmit: SubmitHandler<CreateClubForm> = (data) => {
    // Add the new club with basic information and set status to Pending
    const newClub: ClubRow = {
      id: "c" + (clubList.length + 1),
      name: data.name,
      location: "Pending Setup",
      ownerEmail: data.email,
      status: "Pending",
      teeTimeCount: 0,
    };

    setClubList([newClub, ...clubList]);
    setIsModalOpen(false);
    reset();
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
              {clubList.map((club) => (
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
                          : "bg-orange-50 text-orange-600 border-orange-100"
                      )}
                    >
                      {club.status}
                    </span>
                  </td>
                </tr>
              ))}
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
                    className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold transition-all cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-emerald-600/10 text-center"
                  >
                    Create Club
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
