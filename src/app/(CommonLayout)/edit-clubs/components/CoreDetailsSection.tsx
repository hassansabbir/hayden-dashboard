import { useFormContext } from "react-hook-form";
import { EditClubFormValues } from "./schema";
import InputField from "@/components/form/InputField";
import TextareaField from "@/components/form/TextareaField";
import ImageUpload from "@/components/form/ImageUpload";
import { Sparkles, Tag } from "lucide-react";

interface CoreDetailsSectionProps {
  heroImageFile: string | File;
  setHeroImageFile: (file: string | File) => void;
  rating: number;
  reviewsCount: number;
}

const CoreDetailsSection = ({ heroImageFile, setHeroImageFile, rating, reviewsCount }: CoreDetailsSectionProps) => {
  const { register, formState: { errors } } = useFormContext<EditClubFormValues>();

  return (
    <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 text-slate-100 pointer-events-none">
        <Sparkles size={120} />
      </div>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
          <Tag size={24} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Core Club Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
        <div className="space-y-6">
          <div className="space-y-1">
            <InputField 
              title="Club Name" 
              name="name"
              register={register}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          
          <div className="space-y-1">
            <InputField 
              title="Location (City, State)" 
              name="location"
              register={register}
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField title="Average Rating" name="rating_display" type="number" disabled value={rating} />
            <InputField title="Verified Reviews Count" name="reviewsCount_display" type="number" disabled value={reviewsCount} />
          </div>
          <p className="text-xs text-slate-400 -mt-2">Rating and review count are calculated automatically from player reviews.</p>

          <div className="space-y-1">
            <TextareaField 
              title="Brief Summary (Hero Tagline)" 
              name="summary"
              register={register}
            />
            {errors.summary && <p className="text-red-500 text-xs mt-1">{errors.summary.message}</p>}
          </div>

          <div className="space-y-1">
            <TextareaField 
              title="Detailed Course Overview Description" 
              name="description"
              register={register}
              rows={6} 
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>
        </div>

        <div>
          <ImageUpload 
            label="Hero Background Image Banner" 
            value={heroImageFile} 
            onChange={setHeroImageFile} 
            aspectRatio="aspect-video" 
          />
        </div>
      </div>
    </section>
  );
};

export default CoreDetailsSection;
