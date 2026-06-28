"use client";

import { useState } from "react";
import { useForm, useFieldArray, SubmitHandler, Control, UseFormRegister, FieldErrors } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Info,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import InputField from "@/components/form/InputField";
import RequireRole from "@/components/auth/RequireRole";
import { fetchUrl } from "@/lib/fetchUrl";

interface Slot {
  from: string;
  to: string;
  price: string;
  capacity: number;
}

interface TeaTimeSchedule {
  date: string;
  slots: Slot[];
}

interface TeaTimeFormValues {
  schedules: TeaTimeSchedule[];
}

const blankSlot: Slot = { from: "", to: "", price: "", capacity: 4 };

const AddTeaTime = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, formState: { errors } } = useForm<TeaTimeFormValues>({
    defaultValues: {
      schedules: [
        {
          date: "",
          slots: [{ ...blankSlot }]
        }
      ]
    }
  });

  const { fields: scheduleFields, append: appendSchedule, remove: removeSchedule } = useFieldArray({
    control,
    name: "schedules"
  });

  const onSubmit: SubmitHandler<TeaTimeFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        schedules: data.schedules.map((schedule) => ({
          date: schedule.date,
          slots: schedule.slots.map((slot) => ({
            from: slot.from,
            to: slot.to,
            price: slot.price,
            capacity: slot.capacity,
          })),
        })),
      };

      await fetchUrl("/tee-times/bulk", { method: "POST", body: payload });
      toast.success("Tee time schedules published!");
      router.push("/tea-times");
    } catch (err: any) {
      toast.error(err.message || "Failed to publish tee time schedules.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RequireRole role="club_owner">
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Create Tea Time Schedule
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Manage and deploy new availability slots for club members.</p>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => appendSchedule({ date: "", slots: [{ ...blankSlot }] })}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm"
            >
              <Plus size={18} />
              Add Another Day
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <AnimatePresence mode="popLayout">
            {scheduleFields.map((schedule, sIndex) => (
              <motion.div
                key={schedule.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm relative overflow-hidden group"
              >
                {/* Delete Schedule Button */}
                {scheduleFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSchedule(sIndex)}
                    className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                      <Calendar size={24} />
                    </div>
                    <div className="w-60">
                      <InputField
                        name={`schedules.${sIndex}.date`}
                        type="date"
                        register={register}
                        error={errors.schedules?.[sIndex]?.date as any}
                      />
                    </div>
                  </div>
                </div>

                {/* Slots Section */}
                <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                  <div className="flex items-center justify-between mb-6">
                    <SlotFieldArray sIndex={sIndex} control={control} register={register} errors={errors} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty State / Bottom Action */}
          {scheduleFields.length === 0 && (
            <div className="text-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-3xl">
              <div className="p-4 bg-slate-50 rounded-full w-fit mx-auto mb-4 text-slate-400">
                <Sparkles size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-700">No schedules added</h3>
              <p className="text-slate-400 mt-2 mb-8">Start by adding your first tee time schedule day.</p>
              <button
                type="button"
                onClick={() => appendSchedule({ date: "", slots: [{ ...blankSlot }] })}
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl"
              >
                <Plus size={20} />
                Create New Schedule
              </button>
            </div>
          )}

          {/* Final Action */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-400 italic flex items-center gap-2">
              <Info size={14} />
              Review all slots before publishing. Booked count defaults to 0.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex items-center justify-center gap-3 bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_30px_rgba(16,185,129,0.2)] hover:bg-emerald-700 disabled:opacity-60 disabled:hover:scale-100"
            >
              {isSubmitting ? "Publishing..." : "Publish Schedules"}
              <CheckCircle2 size={24} className={isSubmitting ? "" : "group-hover:animate-bounce"} />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
    </RequireRole>
  );
};

// Nested Field Array for Slots
const SlotFieldArray = ({
  sIndex,
  control,
  register,
  errors,
}: {
  sIndex: number;
  control: Control<TeaTimeFormValues>;
  register: UseFormRegister<TeaTimeFormValues>;
  errors: FieldErrors<TeaTimeFormValues>;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `schedules.${sIndex}.slots`
  });

  return (
    <div className="w-full space-y-2">
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex flex-col sm:flex-row items-end gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative group"
            >
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                <InputField
                  title="From"
                  name={`schedules.${sIndex}.slots.${index}.from`}
                  type="time"
                  register={register}
                  error={errors.schedules?.[sIndex]?.slots?.[index]?.from}
                />
                <InputField
                  title="To"
                  name={`schedules.${sIndex}.slots.${index}.to`}
                  type="time"
                  register={register}
                  error={errors.schedules?.[sIndex]?.slots?.[index]?.to}
                />
                <InputField
                  title="Price ($)"
                  name={`schedules.${sIndex}.slots.${index}.price`}
                  type="number"
                  placeholder="e.g. 45"
                  register={register}
                  error={errors.schedules?.[sIndex]?.slots?.[index]?.price}
                />
                <InputField
                  title="Capacity (1-4)"
                  name={`schedules.${sIndex}.slots.${index}.capacity`}
                  type="number"
                  register={register}
                  error={errors.schedules?.[sIndex]?.slots?.[index]?.capacity}
                />
              </div>

              <div className="flex items-center gap-3 pb-2">
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => append({ ...blankSlot })}
          className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 transition-all"
        >
          <Plus size={14} /> Add Slot
        </button>
      </div>
    </div>
  );
};

export default AddTeaTime;
