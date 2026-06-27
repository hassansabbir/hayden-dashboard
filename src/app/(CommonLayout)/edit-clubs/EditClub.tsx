"use client";

import { useForm, useFieldArray, SubmitHandler, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Tag,
  CheckCircle2,
  Trophy,
  Activity,
  Layers,
  Sparkles,
  X,
  Star
} from "lucide-react";
import ImageUpload from "@/components/form/ImageUpload";
import InputField from "@/components/form/InputField";
import TextareaField from "@/components/form/TextareaField";
import RequireRole from "@/components/auth/RequireRole";

interface SellingPoint {
  title: string;
  description: string;
}

interface Facility {
  name: string;
  description: string;
}

interface GalleryImage {
  src: string | File;
}

interface ClubFormValues {
  name: string;
  location: string;
  rating: number;
  reviewsCount: number;
  summary: string;
  description: string;
  image: string | File;
  stats: {
    yardage: string;
    par: number;
    slope: number;
    rating: number;
    holes: number;
    tees: number;
    elevation: string;
    avgTime: string;
    courseType: string;
    difficulty: string;
  };
  sellingPoints: SellingPoint[];
  facilities: Facility[];
  signatureHole: {
    number: string;
    name: string;
    par: number;
    yardage: number;
    notes: string;
    image: string | File;
  };
  gallery: GalleryImage[];
}

const EditClub = () => {
  const existingClubInfo: ClubFormValues = {
    name: "The Royal Ridges Estate",
    location: "Orchard Valley, CA",
    rating: 4.9,
    reviewsCount: 248,
    summary:
      "Excellence in every swing. Experience the pinnacle of sporting luxury on our award-winning championship terrain, designed for golfers who appreciate architectural precision and breathtaking valley landscapes.",
    description:
      "Designed originally in 1924 and beautifully revitalized for the modern competitor, The Royal Ridges Estate seamlessly blends traditional design principles with the rugged elevation changes of the orchard foothills. The course is characterized by strategic layouts that reward bold shot-making while offering safe bail-out routes for the conservative player. Meticulously groomed by a dedicated agronomy team, the fairways and greens provide tournament-level playability year-round.",
    image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2000&auto=format&fit=crop",
    stats: {
      yardage: "7,200",
      par: 72,
      slope: 145,
      rating: 74.8,
      holes: 18,
      tees: 5,
      elevation: "180 ft",
      avgTime: "4.5h",
      courseType: "Parkland / Ridge",
      difficulty: "Challenging",
    },
    sellingPoints: [
      {
        title: "Championship Layout",
        description: "Masterfully designed routing that tests every club in your bag with fair but demanding hazards.",
      },
      {
        title: "Scenic Valley Views",
        description: "Stunning panoramic backdrops of the Orchard Ridge that offer a majestic and serene atmosphere.",
      },
      {
        title: "Fast A-4 Greens",
        description: "Immaculate green surfaces cutting-edge bentgrass rolling true and fast at a Stimpmeter rating of 11.5+.",
      },
      {
        title: "Strategic Bunkering",
        description: "Over 80 meticulously placed white-sand bunkers that challenge your course management and placement.",
      },
    ],
    facilities: [
      { name: "350-Yard Driving Range", description: "Grass tees with laser-measured targets and premium practice balls." },
      { name: "15,000 sq ft Putting Green", description: "Expansive green matching the slope and speed of the course." },
      { name: "Dedicated Chipping Area", description: "Practice pitch shots from various lies onto a dedicated green." },
      { name: "Greenside Bunker Practice", description: "Varied sand depths to hone your sand saves before teeing off." },
      { name: "Golf Academy", description: "PGA-certified instructors offering video analysis and private instruction." },
    ],
    signatureHole: {
      number: "14",
      name: "The Chasm",
      par: 4,
      yardage: 445,
      notes: "A dramatic par-4 requiring a precise tee shot over a deep forested ravine. A conservative play to the left fairway leaves a long iron into a double-tiered green. Playing closer to the ridge on the right gives a shorter wedge entry but risks going into the canyon.",
      image: "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&w=1200&q=80",
    },
    gallery: [
      { src: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=800&q=80" },
      { src: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80" },
      { src: "https://images.unsplash.com/photo-1613149817748-eb09859f518e?auto=format&fit=crop&w=800&q=80" },
      { src: "https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&w=800&q=80" },
      { src: "https://images.unsplash.com/photo-1561214078-f3247647fc5e?auto=format&fit=crop&w=800&q=80" },
      { src: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?auto=format&fit=crop&w=800&q=80" },
    ],
  };

  const { register, control, handleSubmit, formState: { errors } } = useForm<ClubFormValues>({
    defaultValues: existingClubInfo
  });

  const { fields: facilityFields, append: appendFacility, remove: removeFacility } = useFieldArray({
    control,
    name: "facilities"
  });

  const { fields: galleryFields, append: appendGallery, remove: removeGallery } = useFieldArray({
    control,
    name: "gallery"
  });

  const onSubmit: SubmitHandler<ClubFormValues> = (data) => {
    console.log("Updated Club Profile Data:", data);
    alert("Club profile updated! Check browser developer console to view values.");
  };

  return (
    <RequireRole role="club_owner">
      <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                Edit Club Profile
              </h1>
              <p className="text-slate-500 mt-2 text-lg font-medium">
                All profile updates flow dynamically to your public website details page.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">

            {/* SECTION 1: CORE BRAND DETAILS */}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <InputField title="Club Name" name="name" register={register} error={errors.name} />
                  <InputField title="Location (City, State)" name="location" register={register} error={errors.location} />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <InputField title="Average Rating" name="rating" type="number" register={register} error={errors.rating} />
                    <InputField title="Verified Reviews Count" name="reviewsCount" type="number" register={register} error={errors.reviewsCount} />
                  </div>

                  <TextareaField title="Brief Summary (Hero Tagline)" name="summary" register={register} error={errors.summary} />
                  <TextareaField title="Detailed Course Overview Description" name="description" register={register} error={errors.description} rows={6} />
                </div>

                <div>
                  <Controller control={control} name="image" render={({ field }) => (
                    <ImageUpload label="Hero Background Image Banner" value={field.value} onChange={field.onChange} aspectRatio="aspect-video" />
                  )} />
                </div>
              </div>
            </section>

            {/* SECTION 2: COURSE SPECIFICATIONS */}
            <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs relative">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-cyan-50 rounded-xl text-cyan-600">
                  <Activity size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Course Specs & Metrics</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                <InputField title="Total Yardage" name="stats.yardage" register={register} error={errors.stats?.yardage} />
                <InputField title="Par Rating" name="stats.par" type="number" register={register} error={errors.stats?.par} />
                <InputField title="Slope Rating" name="stats.slope" type="number" register={register} error={errors.stats?.slope} />
                <InputField title="Course Rating" name="stats.rating" type="number" register={register} error={errors.stats?.rating} />
                <InputField title="Number of Holes" name="stats.holes" type="number" register={register} error={errors.stats?.holes} />
                <InputField title="Number of Tee Boxes" name="stats.tees" type="number" register={register} error={errors.stats?.tees} />
                <InputField title="Elevation Changes" name="stats.elevation" register={register} error={errors.stats?.elevation} />
                <InputField title="Average Round Time" name="stats.avgTime" register={register} error={errors.stats?.avgTime} />
                <InputField title="Course Type" name="stats.courseType" register={register} error={errors.stats?.courseType} />
                <InputField title="Difficulty Level" name="stats.difficulty" register={register} error={errors.stats?.difficulty} />
              </div>
            </section>

            {/* SECTION 3: WHY GOLFERS LOVE THIS COURSE (4 SELLING POINTS) */}
            <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs relative">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                  <Trophy size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Why Golfers Love This Course (4 Selling Points)</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <span className="inline-block text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100 uppercase tracking-wider mb-2">
                      Highlight Selling Point #{index + 1}
                    </span>
                    <InputField
                      title="Selling Point Title"
                      name={`sellingPoints.${index}.title`}
                      register={register}
                      error={errors.sellingPoints?.[index]?.title}
                    />
                    <TextareaField
                      title="Selling Point Description"
                      name={`sellingPoints.${index}.description`}
                      register={register}
                      error={errors.sellingPoints?.[index]?.description}
                      rows={3}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 4: PRACTICE & PLAYING FACILITIES */}
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
                  onClick={() => appendFacility({ name: "", description: "" })}
                  className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-600 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-purple-100 cursor-pointer self-start"
                >
                  <Plus size={18} /> Add Facility
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {facilityFields.map((field, index) => (
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
                        onClick={() => removeFacility(index)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors p-2"
                      >
                        <Trash2 size={18} />
                      </button>

                      <div className="space-y-4 pr-8">
                        <InputField
                          title="Facility Name"
                          name={`facilities.${index}.name`}
                          placeholder="e.g. 350-Yard Driving Range"
                          register={register}
                          error={errors.facilities?.[index]?.name}
                        />
                        <TextareaField
                          title="Facility Description"
                          name={`facilities.${index}.description`}
                          placeholder="Describe targets, size, availability..."
                          register={register}
                          error={errors.facilities?.[index]?.description}
                          rows={2}
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>

            {/* SECTION 5: SIGNATURE HOLE SHOWCASE */}
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
                    <InputField title="Hole Number" name="signatureHole.number" register={register} error={errors.signatureHole?.number} />
                    <InputField title="Hole Name" name="signatureHole.name" register={register} error={errors.signatureHole?.name} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <InputField title="Par Rating" name="signatureHole.par" type="number" register={register} error={errors.signatureHole?.par} />
                    <InputField title="Yardage" name="signatureHole.yardage" type="number" register={register} error={errors.signatureHole?.yardage} />
                  </div>

                  <TextareaField title="Strategic Playing Notes" name="signatureHole.notes" register={register} error={errors.signatureHole?.notes} rows={4} />
                </div>

                <div>
                  <Controller control={control} name="signatureHole.image" render={({ field }) => (
                    <ImageUpload label="Signature Hole Showcase Image" value={field.value} onChange={field.onChange} aspectRatio="aspect-video" />
                  )} />
                </div>
              </div>
            </section>

            {/* SECTION 6: COURSE GALLERY */}
            <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                    <ImageIcon size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Course Photo Gallery</h2>
                </div>
                <button
                  type="button"
                  onClick={() => appendGallery({ src: "" })}
                  className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-blue-100 cursor-pointer self-start"
                >
                  <Plus size={18} /> Add Photo
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {galleryFields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group bg-slate-50 border border-slate-200 p-4 rounded-2xl relative hover:border-blue-300 transition-all shadow-xs"
                    >
                      <button
                        type="button"
                        onClick={() => removeGallery(index)}
                        className="absolute -top-3 -right-3 bg-white hover:bg-red-500 text-slate-400 hover:text-white rounded-full p-2 transition-all shadow-sm border border-slate-200 hover:border-red-500 z-10 cursor-pointer"
                      >
                        <X size={14} />
                      </button>

                      <Controller control={control} name={`gallery.${index}.src` as const} render={({ field }) => (
                        <ImageUpload label={`Gallery Image #${index + 1}`} value={field.value} onChange={field.onChange} aspectRatio="aspect-video" />
                      )} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>

            {/* FORM SUBMISSION BAR */}
            <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-slate-200 gap-6">
              <p className="text-slate-400 text-sm font-medium italic">
                * Publishing updates will immediately update the public club landing page.
              </p>
              <button
                type="submit"
                className="group flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl cursor-pointer"
              >
                Publish Updates
                <CheckCircle2 size={24} className="group-hover:animate-bounce" />
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </RequireRole>
  );
};

export default EditClub;