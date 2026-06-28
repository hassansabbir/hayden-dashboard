"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Shield,
  Pencil,
  Lock,
  Eye,
  EyeOff,
  Save,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { fetchUrl } from "@/lib/fetchUrl";

interface AdminDetailsInputs {
  fullName: string;
  email: string;
  golfClub: string;
}

interface ChangePasswordInputs {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "Super Administrator",
  ADMIN: "Administrator",
  COURSE_MANAGER: "Club Owner",
  STAFF: "Staff",
  USER: "User",
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

const AdminProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [role, setRole] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const {
    register: registerDetails,
    handleSubmit: handleSubmitDetails,
    reset: resetDetails,
    getValues: getDetailsValues,
    formState: { errors: detailsErrors }
  } = useForm<AdminDetailsInputs>({
    defaultValues: { fullName: "", email: "", golfClub: "" }
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors }
  } = useForm<ChangePasswordInputs>();

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const res = await fetchUrl("/users/me");
        const dbUser = res.data;
        setRole(dbUser.role);

        let golfClub = "—";
        if (dbUser.role === "COURSE_MANAGER") {
          try {
            const courseRes = await fetchUrl("/courses/mine");
            golfClub = courseRes.data.name;
          } catch {
            golfClub = "—";
          }
        } else {
          golfClub = "Platform Administration";
        }

        resetDetails({ fullName: dbUser.fullName, email: dbUser.email, golfClub });
      } catch (err: any) {
        setLoadError(err.message || "Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [resetDetails]);

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const onDetailsSubmit = async (data: AdminDetailsInputs) => {
    setIsSavingDetails(true);
    try {
      await fetchUrl("/users/me", { method: "PATCH", body: { fullName: data.fullName } });
      toast.success("Profile details updated!");
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setIsSavingDetails(false);
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordInputs) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }
    setIsSavingPassword(true);
    try {
      await fetchUrl("/auth/change-password", {
        method: "POST",
        body: { currentPassword: data.currentPassword, newPassword: data.newPassword },
      });
      toast.success("Password changed successfully!");
      setIsChangingPassword(false);
      resetPassword();
    } catch (err: any) {
      toast.error(err.message || "Failed to change password.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const fullName = getDetailsValues("fullName");
  const email = getDetailsValues("email");
  const golfClub = getDetailsValues("golfClub");

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-gray-400 py-24">
        <Loader2 className="w-5 h-5 animate-spin" />
        Loading profile...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-4xl mx-auto text-center text-red-500 font-medium py-24">{loadError}</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10 p-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-500 mt-1">Manage your account details</p>
      </div>

      <div className="space-y-6">
        {/* Admin Details Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <User className="w-5 h-5 text-gray-400" />
              <span>Account Details</span>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 text-sm font-bold text-[#2ea268] hover:text-[#288c5a] transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmitDetails(onDetailsSubmit)} className="space-y-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-[#142d22] flex items-center justify-center text-white font-bold text-2xl relative">
                  {getInitials(fullName)}
                  <div className="absolute -bottom-1 -right-1 bg-[#eefaf3] p-1.5 rounded-full border-4 border-white">
                    <Shield className="w-4 h-4 text-[#2ea268]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{fullName}</h3>
                  <span className="bg-[#eefaf3] text-[#2ea268] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mt-1 inline-block">
                    {ROLE_LABEL[role] ?? role}
                  </span>
                </div>
              </div>

              <div className="grid gap-6">
                {/* Full Name */}
                <div className={cn("p-4 rounded-2xl transition-all", isEditing ? "bg-white border-2 border-[#2ea268]/20" : "bg-gray-50/50")}>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      {...registerDetails("fullName", { required: true, minLength: 2, maxLength: 80 })}
                      className="w-full font-bold text-gray-900 outline-none bg-transparent"
                    />
                  ) : (
                    <p className="font-bold text-gray-900">{fullName}</p>
                  )}
                  {detailsErrors.fullName && (
                    <p className="text-xs font-medium text-red-500 mt-1">Full name must be 2-80 characters.</p>
                  )}
                </div>

                {/* Email Address (immutable) */}
                <div className="p-4 rounded-2xl bg-gray-50/50">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Email Address</label>
                  <p className="font-bold text-gray-900">{email}</p>
                </div>

                {/* Golf Club (read-only — managed via Edit Club page) */}
                <div className="p-4 rounded-2xl bg-gray-50/50">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Golf Club</label>
                  <p className="font-bold text-gray-900">{golfClub}</p>
                </div>
              </div>

              {isEditing && (
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSavingDetails}
                    className="bg-[#2ea268] hover:bg-[#288c5a] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-[#2ea268]/20 transition-all disabled:opacity-60"
                  >
                    <Save className="w-4 h-4" />
                    {isSavingDetails ? "Saving..." : "Save Details"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={isSavingDetails}
                    className="px-8 py-3 rounded-xl font-bold text-gray-400 hover:text-gray-900 transition-all disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <Lock className="w-5 h-5 text-gray-400" />
              <span>Change Password</span>
            </div>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="flex items-center gap-1.5 text-sm font-bold text-[#2ea268] hover:text-[#288c5a] transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Change
              </button>
            )}
          </div>

          <div className="p-8">
            {isChangingPassword ? (
              <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-6 max-w-lg">
                <div className="space-y-4">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        {...registerPassword("currentPassword", { required: true, minLength: 6 })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2ea268]/20 focus:border-[#2ea268] transition-all"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="text-xs font-medium text-red-500">Current password is required.</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">New Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        {...registerPassword("newPassword", { required: true, minLength: 6, maxLength: 72 })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2ea268]/20 focus:border-[#2ea268] transition-all"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="text-xs font-medium text-red-500">New password must be 6-72 characters.</p>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        {...registerPassword("confirmPassword", { required: true })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2ea268]/20 focus:border-[#2ea268] transition-all"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSavingPassword}
                    className="flex-1 bg-[#142d22] hover:bg-[#1a3a2e] text-white py-3 rounded-xl font-bold shadow-lg shadow-[#142d22]/20 transition-all disabled:opacity-60"
                  >
                    {isSavingPassword ? "Updating..." : "Update Password"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      resetPassword();
                    }}
                    disabled={isSavingPassword}
                    className="flex-1 border border-gray-100 hover:bg-gray-50 text-gray-500 py-3 rounded-xl font-bold transition-all disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Click "Change" to update your password.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
