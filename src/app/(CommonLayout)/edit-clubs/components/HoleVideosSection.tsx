import { useFormContext, useFieldArray } from "react-hook-form";
import { EditClubFormValues } from "./schema";
import InputField from "@/components/form/InputField";
import { Video, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const HoleVideosSection = () => {
  const { register, control, watch, formState: { errors } } = useFormContext<EditClubFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "holeVideos",
  });

  const holeVideos = watch("holeVideos") || [];
  const usedHoles = new Set(holeVideos.map((v) => Number(v.holeNumber)));
  const nextAvailableHole = Array.from({ length: 18 }, (_, i) => i + 1).find((n) => !usedHoles.has(n)) ?? null;

  return (
    <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-50 rounded-xl text-teal-600">
            <Video size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Course Hole Videos</h2>
        </div>
        <button
          type="button"
          disabled={nextAvailableHole === null}
          onClick={() => {
            if (nextAvailableHole !== null) {
              append({ holeNumber: nextAvailableHole, url: "" });
            }
          }}
          className="flex items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-600 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-teal-100 cursor-pointer self-start disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus size={18} /> Add Hole
        </button>
      </div>
      <p className="text-sm text-slate-400 font-medium mb-8">
        Add a video link for any hole — YouTube, Vimeo, or any hosted video URL. Click &quot;Add Hole&quot; for each hole you want to showcase.
      </p>

      {fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl gap-3">
          <Video size={36} className="text-slate-300" />
          <p className="text-sm font-medium">No hole videos added yet</p>
          <p className="text-xs">Click &quot;Add Hole&quot; above to start adding video links</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {fields.map((field, index) => {
              const currentHole = holeVideos[index]?.holeNumber;
              return (
                <motion.div
                  key={field.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 hover:border-teal-300 transition-all relative"
                >
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="pr-7">
                    <label className="block text-[11px] font-bold tracking-widest text-[#9CA3AF] uppercase mb-2">
                      Hole Number
                    </label>
                    <select
                      {...register(`holeVideos.${index}.holeNumber` as const, { valueAsNumber: true })}
                      className="w-full rounded-lg bg-white border border-slate-200 px-4 py-3 text-[14px] text-gray-600 outline-none transition-all focus:border-teal-400">
                      {Array.from({ length: 18 }, (_, i) => i + 1).map((n) => (
                        <option
                          key={n}
                          value={n}
                          disabled={usedHoles.has(n) && Number(currentHole) !== n}
                        >
                          Hole #{n}{usedHoles.has(n) && Number(currentHole) !== n ? " (added)" : ""}
                        </option>
                      ))}
                    </select>
                    {errors.holeVideos?.[index]?.holeNumber && (
                      <p className="text-red-500 text-xs mt-1">{errors.holeVideos[index].holeNumber.message}</p>
                    )}
                  </div>

                  <div>
                    <InputField
                      title="Video URL"
                      placeholder="https://..."
                      name={`holeVideos.${index}.url` as const}
                      register={register}
                    />
                    {errors.holeVideos?.[index]?.url && (
                      <p className="text-red-500 text-xs mt-1">{errors.holeVideos[index].url.message}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
};

export default HoleVideosSection;
