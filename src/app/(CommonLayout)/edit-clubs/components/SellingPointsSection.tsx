import { useFormContext, useFieldArray } from "react-hook-form";
import { EditClubFormValues } from "./schema";
import InputField from "@/components/form/InputField";
import TextareaField from "@/components/form/TextareaField";
import { Trophy } from "lucide-react";

const SellingPointsSection = () => {
  const { register, control, formState: { errors } } = useFormContext<EditClubFormValues>();
  const { fields } = useFieldArray({
    control,
    name: "sellingPoints",
  });

  // Always show 4 selling points as per original requirements (0, 1, 2, 3)
  // We can just render 4 inputs statically mapping to index if we initialize them, 
  // or use the fields if they are initialized properly. 
  // For safety, let's just map 0 to 3 manually if we want exactly 4 slots.
  
  return (
    <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs relative">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
          <Trophy size={24} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Why Golfers Love This Course (4 Selling Points)</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[0, 1, 2, 3].map((index) => {
          return (
            <div key={index} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <span className="inline-block text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100 uppercase tracking-wider mb-2">
                Highlight Selling Point #{index + 1}
              </span>
              
              <div>
                <InputField
                  title="Selling Point Title"
                  name={`sellingPoints.${index}.title` as const}
                  register={register}
                />
                {errors.sellingPoints?.[index]?.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.sellingPoints[index].title.message}</p>
                )}
              </div>

              <div>
                <TextareaField
                  title="Selling Point Description"
                  name={`sellingPoints.${index}.description` as const}
                  register={register}
                  rows={3}
                />
                {errors.sellingPoints?.[index]?.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.sellingPoints[index].description.message}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SellingPointsSection;
