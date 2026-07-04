import { Image as ImageIcon, Plus, X } from "lucide-react";
import ImageUpload from "@/components/form/ImageUpload";
import { motion, AnimatePresence } from "framer-motion";

export interface GalleryImage {
  src: string | File;
  mediaId?: string;
}

interface GallerySectionProps {
  gallery: GalleryImage[];
  setGallery: (gallery: GalleryImage[]) => void;
}

const GallerySection = ({ gallery, setGallery }: GallerySectionProps) => {
  return (
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
          onClick={() => setGallery([...gallery, { src: "" }])}
          className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-blue-100 cursor-pointer self-start"
        >
          <Plus size={18} /> Add Photo
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {gallery.map((field, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group bg-slate-50 border border-slate-200 p-4 rounded-2xl relative hover:border-blue-300 transition-all shadow-xs"
            >
              <button
                type="button"
                onClick={() => setGallery(gallery.filter((_, i) => i !== index))}
                className="absolute -top-3 -right-3 bg-white hover:bg-red-500 text-slate-400 hover:text-white rounded-full p-2 transition-all shadow-sm border border-slate-200 hover:border-red-500 z-10 cursor-pointer"
              >
                <X size={14} />
              </button>

              <ImageUpload
                label={`Gallery Image #${index + 1}`}
                value={field.src}
                onChange={(newSrc) => {
                  const newGallery = [...gallery];
                  newGallery[index].src = newSrc;
                  setGallery(newGallery);
                }}
                aspectRatio="aspect-video"
              />
            </motion.div>
          ))}
        </AnimatePresence>
        {gallery.length === 0 && (
          <div className="col-span-2 md:col-span-3 flex flex-col items-center justify-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl gap-3">
            <ImageIcon size={32} className="text-slate-300" />
            <p className="text-sm font-medium">No photos added yet</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
