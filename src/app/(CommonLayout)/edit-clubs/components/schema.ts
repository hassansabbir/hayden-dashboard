import { z } from "zod";

export const statsSchema = z.object({
  yardage: z.string().optional(),
  par: z.coerce.number().optional(),
  slope: z.coerce.number().optional(),
  rating: z.coerce.number().optional(),
  holes: z.coerce.number().optional(),
  tees: z.coerce.number().optional(),
  elevation: z.string().optional(),
  avgTime: z.string().optional(),
  courseType: z.string().optional(),
  difficulty: z.string().optional(),
});

export const sellingPointSchema = z.object({
  title: z.string().max(120).optional(),
  description: z.string().max(500).optional(),
});

export const facilitySchema = z.object({
  name: z.string().max(120).optional(),
  description: z.string().max(300).optional(),
});

export const signatureHoleSchema = z.object({
  number: z.string().optional(),
  name: z.string().optional(),
  par: z.coerce.number().optional(),
  yardage: z.coerce.number().optional(),
  notes: z.string().max(1000).optional(),
  image: z.string().optional(),
});

export const holeVideoSchema = z.object({
  holeNumber: z.coerce.number().int().min(1).max(18),
  url: z.string().url("Must be a valid URL").or(z.literal("")).optional().or(z.undefined()),
});

export const editClubFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  location: z.string().min(1, "Location is required"),
  summary: z.string().max(300).optional(),
  description: z.string().max(4000).optional(),
  heroImage: z.string().optional(),
  stats: statsSchema.optional(),
  sellingPoints: z.array(sellingPointSchema).max(6).optional(),
  facilities: z.array(facilitySchema).max(12).optional(),
  signatureHole: signatureHoleSchema.optional(),
  gallery: z.array(z.string()).max(20).optional(),
  holeVideos: z.array(holeVideoSchema).max(18).optional(),
});

export type EditClubFormValues = z.infer<typeof editClubFormSchema>;
