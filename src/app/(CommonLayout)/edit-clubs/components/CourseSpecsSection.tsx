import { useFormContext } from "react-hook-form";
import { EditClubFormValues } from "./schema";
import InputField from "@/components/form/InputField";
import SelectField from "@/components/form/SelectField";
import { Activity } from "lucide-react";

const CourseSpecsSection = () => {
  const { register, formState: { errors } } = useFormContext<EditClubFormValues>();

  return (
    <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs relative">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-cyan-50 rounded-xl text-cyan-600">
          <Activity size={24} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Course Specs & Metrics</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <div>
          <InputField title="Total Yardage" name="stats.yardage" register={register} />
          {errors.stats?.yardage && <p className="text-red-500 text-xs mt-1">{errors.stats.yardage.message}</p>}
        </div>

        <div>
          <InputField title="Par Rating" type="number" name="stats.par" register={register} />
          {errors.stats?.par && <p className="text-red-500 text-xs mt-1">{errors.stats.par.message}</p>}
        </div>

        <div>
          <InputField title="Slope Rating" type="number" name="stats.slope" register={register} />
          {errors.stats?.slope && <p className="text-red-500 text-xs mt-1">{errors.stats.slope.message}</p>}
        </div>

        <div>
          <InputField title="Course Rating" type="number" name="stats.rating" register={register} />
          {errors.stats?.rating && <p className="text-red-500 text-xs mt-1">{errors.stats.rating.message}</p>}
        </div>

        <div>
          <SelectField
            title="Number of Holes (Course Total)"
            name="stats.holes"
            register={register}
            options={[
              { label: "9 Holes", value: "9" },
              { label: "18 Holes", value: "18" },
            ]}
          />
          {errors.stats?.holes && <p className="text-red-500 text-xs mt-1">{errors.stats.holes.message}</p>}
        </div>

        <div>
          <InputField title="Number of Tee Boxes" type="number" name="stats.tees" register={register} />
          {errors.stats?.tees && <p className="text-red-500 text-xs mt-1">{errors.stats.tees.message}</p>}
        </div>

        <div>
          <InputField title="Elevation Changes" name="stats.elevation" register={register} />
          {errors.stats?.elevation && <p className="text-red-500 text-xs mt-1">{errors.stats.elevation.message}</p>}
        </div>

        <div>
          <InputField title="Average Round Time" name="stats.avgTime" register={register} />
          {errors.stats?.avgTime && <p className="text-red-500 text-xs mt-1">{errors.stats.avgTime.message}</p>}
        </div>

        <div>
          <InputField title="Course Type" name="stats.courseType" register={register} />
          {errors.stats?.courseType && <p className="text-red-500 text-xs mt-1">{errors.stats.courseType.message}</p>}
        </div>

        <div>
          <InputField title="Difficulty Level" name="stats.difficulty" register={register} />
          {errors.stats?.difficulty && <p className="text-red-500 text-xs mt-1">{errors.stats.difficulty.message}</p>}
        </div>
      </div>
    </section>
  );
};

export default CourseSpecsSection;
