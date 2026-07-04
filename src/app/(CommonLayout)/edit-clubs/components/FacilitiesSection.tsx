import { useFormContext, useFieldArray } from "react-hook-form";
import { EditClubFormValues } from "./schema";
import InputField from "@/components/form/InputField";
import TextareaField from "@/components/form/TextareaField";
import { Layers, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FacilitiesSection = () => {
  const { register, control, formState: { errors } } = useFormContext<EditClubFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "facilities",
  });

  return (
    <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
            <Layers size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Practice & Playing Facilities</h2>
        </div>
        <button
          type="button"
          onClick={() => append({ name: "", description: "" })}
          className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-600 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-purple-100 cursor-pointer self-start"
        >
          <Plus size={18} /> Add Facility
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group bg-slate-50 border border-slate-200 p-6 rounded-2xl relative hover:border-purple-300 transition-all shadow-xs"
            >
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors p-2"
              >
                <Trash2 size={18} />
              </button>

              <div className="space-y-4 pr-8">
                <div>
                  <InputField
                    title="Facility Name"
                    placeholder="e.g. 350-Yard Driving Range"
                    name={`facilities.${index}.name` as const}
                    register={register}
                  />
                  {errors.facilities?.[index]?.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.facilities[index].name.message}</p>
                  )}
                </div>

                <div>
                  <TextareaField
                    title="Facility Description"
                    placeholder="Describe targets, size, availability..."
                    rows={2}
                    name={`facilities.${index}.description` as const}
                    register={register}
                  />
                  {errors.facilities?.[index]?.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.facilities[index].description.message}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {fields.length === 0 && (
          <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl gap-3">
            <Layers size={32} className="text-slate-300" />
            <p className="text-sm font-medium">No facilities added yet</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FacilitiesSection;
