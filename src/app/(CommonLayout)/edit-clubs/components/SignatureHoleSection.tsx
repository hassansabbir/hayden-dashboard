import { useFormContext } from "react-hook-form";
import { EditClubFormValues } from "./schema";
import InputField from "@/components/form/InputField";
import TextareaField from "@/components/form/TextareaField";
import ImageUpload from "@/components/form/ImageUpload";
import { Star } from "lucide-react";

interface SignatureHoleSectionProps {
  sigHoleImageFile: string | File;
  setSigHoleImageFile: (file: string | File) => void;
}

const SignatureHoleSection = ({ sigHoleImageFile, setSigHoleImageFile }: SignatureHoleSectionProps) => {
  const { register, formState: { errors } } = useFormContext<EditClubFormValues>();

  return (
    <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs relative">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
          <Star size={24} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Signature Hole Showcase</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputField title="Which Hole # (e.g. 14)" name="signatureHole.number" register={register} />
              {errors.signatureHole?.number && <p className="text-red-500 text-xs mt-1">{errors.signatureHole.number.message}</p>}
            </div>
            <div>
              <InputField title="Hole Name" name="signatureHole.name" register={register} />
              {errors.signatureHole?.name && <p className="text-red-500 text-xs mt-1">{errors.signatureHole.name.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputField title="Par Rating" type="number" name="signatureHole.par" register={register} />
              {errors.signatureHole?.par && <p className="text-red-500 text-xs mt-1">{errors.signatureHole.par.message}</p>}
            </div>
            <div>
              <InputField title="Yardage" type="number" name="signatureHole.yardage" register={register} />
              {errors.signatureHole?.yardage && <p className="text-red-500 text-xs mt-1">{errors.signatureHole.yardage.message}</p>}
            </div>
          </div>

          <div>
            <TextareaField title="Strategic Playing Notes" rows={4} name="signatureHole.notes" register={register} />
            {errors.signatureHole?.notes && <p className="text-red-500 text-xs mt-1">{errors.signatureHole.notes.message}</p>}
          </div>
        </div>

        <div>
          <ImageUpload 
            label="Signature Hole Showcase Image" 
            value={sigHoleImageFile} 
            onChange={setSigHoleImageFile} 
            aspectRatio="aspect-video" 
          />
        </div>
      </div>
    </section>
  );
};

export default SignatureHoleSection;
