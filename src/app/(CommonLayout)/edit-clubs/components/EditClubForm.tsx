"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fetchUrl, getMediaUrl } from "@/lib/fetchUrl";
import RequireRole from "@/components/auth/RequireRole";

import { editClubFormSchema, EditClubFormValues } from "./schema";
import CoreDetailsSection from "./CoreDetailsSection";
import CourseSpecsSection from "./CourseSpecsSection";
import SellingPointsSection from "./SellingPointsSection";
import FacilitiesSection from "./FacilitiesSection";
import SignatureHoleSection from "./SignatureHoleSection";
import GallerySection, { GalleryImage } from "./GallerySection";
import HoleVideosSection from "./HoleVideosSection";

const MEDIA_TYPE = {
  HERO: "COURSE_HERO",
  GALLERY: "COURSE_GALLERY",
  SIGNATURE_HOLE: "SIGNATURE_HOLE",
} as const;

const EditClubForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [courseRating, setCourseRating] = useState(0);
  const [courseReviewsCount, setCourseReviewsCount] = useState(0);

  const [heroImageId, setHeroImageId] = useState<string | undefined>(undefined);
  const [signatureHoleImageId, setSignatureHoleImageId] = useState<string | undefined>(undefined);
  const [heroImageFile, setHeroImageFile] = useState<string | File>("");
  const [sigHoleImageFile, setSigHoleImageFile] = useState<string | File>("");
  const [gallery, setGallery] = useState<GalleryImage[]>([]);

  const methods = useForm<EditClubFormValues>({
    resolver: zodResolver(editClubFormSchema) as any,
    defaultValues: {
      sellingPoints: [
        { title: "", description: "" },
        { title: "", description: "" },
        { title: "", description: "" },
        { title: "", description: "" },
      ],
      facilities: [],
      holeVideos: [],
      stats: {
        holes: 18,
      }
    }
  });

  useEffect(() => {
    const loadCourse = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const res = await fetchUrl("/courses/mine");
        const course = res.data;

        setCourseId(course._id);
        setCourseRating(course.rating || 0);
        setCourseReviewsCount(course.reviewsCount || 0);
        
        setHeroImageId(course.heroImage?._id);
        setSignatureHoleImageId(course.signatureHole?.image?._id);
        setHeroImageFile(getMediaUrl(course.heroImage?.url));
        setSigHoleImageFile(getMediaUrl(course.signatureHole?.image?.url));
        
        setGallery((course.gallery || []).map((media: any) => ({
          src: getMediaUrl(media.url),
          mediaId: media._id,
        })));

        // Ensure exactly 4 selling points are pre-filled or empty
        const sps = [...(course.sellingPoints || [])];
        while (sps.length < 4) sps.push({ title: "", description: "" });

        methods.reset({
          name: course.name || "",
          location: course.location || "",
          summary: course.summary || "",
          description: course.description || "",
          stats: {
            yardage: course.stats?.yardage || "",
            par: course.stats?.par,
            slope: course.stats?.slope,
            rating: course.stats?.rating,
            holes: course.stats?.holes || 18,
            tees: course.stats?.tees,
            elevation: course.stats?.elevation || "",
            avgTime: course.stats?.avgTime || "",
            courseType: course.stats?.courseType || "",
            difficulty: course.stats?.difficulty || "",
          },
          sellingPoints: sps.slice(0, 4),
          facilities: course.facilities || [],
          signatureHole: {
            number: course.signatureHole?.number || "",
            name: course.signatureHole?.name || "",
            par: course.signatureHole?.par,
            yardage: course.signatureHole?.yardage,
            notes: course.signatureHole?.notes || "",
          },
          holeVideos: course.holeVideos || [],
        });

      } catch (err: any) {
        setLoadError(err.message || "Failed to load club profile.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [methods]);

  const uploadImage = async (file: File, type: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    if (courseId) {
      formData.append("relatedModel", "Course");
      formData.append("relatedTo", courseId);
    }
    const res = await fetchUrl("/media/upload", { method: "POST", body: formData });
    return res.data._id;
  };

  /**
   * Builds the PATCH payload from the validated form data.
   *
   * Key rules:
   * - Empty strings in OPTIONAL text fields → omit the key entirely (undefined).
   *   The backend Zod schema now accepts "" OR omitted, but it's cleaner to omit.
   * - Numeric stats fields → omit when undefined/NaN so the DB isn't written with garbage.
   * - selling-point slots that are entirely blank → filtered out before sending.
   * - Hole videos with no URL → filtered out (backend url() would reject "").
   * - gallery / facilities are always sent so the user can clear them.
   */
  const cleanPayload = (
    data: EditClubFormValues,
    newHeroImageId: string | undefined,
    newSigHoleImageId: string | undefined,
    galleryIds: string[]
  ) => {
    const str = (v?: string) => (v && v.trim() ? v.trim() : undefined);
    const num = (v?: number) => (v !== undefined && !isNaN(v) ? v : undefined);

    // Clean stats — strip empty strings and NaN numbers
    const rawStats = data.stats;
    const stats = rawStats
      ? {
          yardage:    str(rawStats.yardage),
          par:        num(rawStats.par),
          slope:      num(rawStats.slope),
          rating:     num(rawStats.rating),
          holes:      num(rawStats.holes),
          tees:       num(rawStats.tees),
          elevation:  str(rawStats.elevation),
          avgTime:    str(rawStats.avgTime),
          courseType: str(rawStats.courseType),
          difficulty: str(rawStats.difficulty),
        }
      : undefined;
    // Only include stats if at least one field has a real value
    const hasStats = stats && Object.values(stats).some((v) => v !== undefined);

    // Clean selling points — filter fully blank slots
    const sellingPoints = (data.sellingPoints || [])
      .map((sp) => ({ title: str(sp.title), description: str(sp.description) }))
      .filter((sp) => sp.title || sp.description);

    // Filter hole videos with empty URLs
    const holeVideos = (data.holeVideos || []).filter((v) => v.url && v.url.trim());

    const payload: Record<string, any> = {
      name: data.name,
      location: data.location,
      summary: str(data.summary) ?? "",
      description: str(data.description) ?? "",
      sellingPoints,
      facilities: data.facilities || [],
      gallery: galleryIds,
      holeVideos,
    };

    if (newHeroImageId) payload.heroImage = newHeroImageId;
    if (hasStats) payload.stats = stats;

    // Signature hole: include only if at least one meaningful field is set
    const sh = data.signatureHole;
    const hasSignatureHole =
      sh &&
      (str(sh.number) || str(sh.name) || num(sh.par) !== undefined || num(sh.yardage) !== undefined || str(sh.notes) || newSigHoleImageId);

    if (hasSignatureHole) {
      payload.signatureHole = {
        number: str(sh!.number),
        name:   str(sh!.name),
        par:    num(sh!.par),
        yardage: num(sh!.yardage),
        notes:  str(sh!.notes),
        image:  newSigHoleImageId,
      };
    }

    return payload;
  };


  const onSubmit = async (data: EditClubFormValues) => {
    setIsSaving(true);
    
    try {
      const newHeroImageId = heroImageFile instanceof File
        ? await uploadImage(heroImageFile, MEDIA_TYPE.HERO)
        : heroImageId;

      const newSignatureHoleImageId = sigHoleImageFile instanceof File
        ? await uploadImage(sigHoleImageFile, MEDIA_TYPE.SIGNATURE_HOLE)
        : signatureHoleImageId;

      const galleryIds = (
        await Promise.all(
          gallery.map(async (item) => {
            if (item.src instanceof File) return uploadImage(item.src, MEDIA_TYPE.GALLERY);
            return item.mediaId;
          })
        )
      ).filter((id): id is string => Boolean(id));

      const payload = cleanPayload(data, newHeroImageId, newSignatureHoleImageId, galleryIds);

      const res = await fetchUrl("/courses/mine", { method: "PATCH", body: payload });
      const updatedCourse = res.data;

      setHeroImageId(updatedCourse.heroImage?._id);
      setSignatureHoleImageId(updatedCourse.signatureHole?.image?._id);
      setHeroImageFile(getMediaUrl(updatedCourse.heroImage?.url));
      setSigHoleImageFile(getMediaUrl(updatedCourse.signatureHole?.image?.url));
      
      setGallery((updatedCourse.gallery || []).map((media: any) => ({
        src: getMediaUrl(media.url),
        mediaId: media._id,
      })));

      toast.success("Club profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update club profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <RequireRole role="club_owner">
      <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
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

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 text-slate-400 py-24">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading club profile...
            </div>
          ) : loadError ? (
            <div className="text-center text-red-500 font-medium py-24">{loadError}</div>
          ) : (
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-12">
                <CoreDetailsSection 
                  heroImageFile={heroImageFile} 
                  setHeroImageFile={setHeroImageFile} 
                  rating={courseRating} 
                  reviewsCount={courseReviewsCount} 
                />
                
                <CourseSpecsSection />
                
                <SellingPointsSection />
                
                <FacilitiesSection />
                
                <SignatureHoleSection 
                  sigHoleImageFile={sigHoleImageFile} 
                  setSigHoleImageFile={setSigHoleImageFile} 
                />
                
                <GallerySection 
                  gallery={gallery} 
                  setGallery={setGallery} 
                />
                
                <HoleVideosSection />

                <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-slate-200 gap-6">
                  <p className="text-slate-400 text-sm font-medium italic">
                    * Publishing updates will immediately update the public club landing page.
                  </p>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="group flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl cursor-pointer disabled:opacity-60 disabled:hover:scale-100"
                  >
                    {isSaving ? "Publishing..." : "Publish Updates"}
                    {isSaving ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={24} className="group-hover:animate-bounce" />
                    )}
                  </button>
                </div>
              </form>
            </FormProvider>
          )}
        </motion.div>
      </div>
    </RequireRole>
  );
};

export default EditClubForm;
