"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileUp, Download, FileSpreadsheet, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { fetchUrl } from "@/lib/fetchUrl";
import { parseTeeTimesFile, teeTimesCsvTemplate, generateTeeTimesExcelTemplate, ParsedSchedule } from "@/lib/parseTeeTimesFile";

const UploadTeeTimesModal = ({
  onClose,
  onUploaded,
}: {
  onClose: () => void;
  onUploaded: () => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<ParsedSchedule[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const slotCount = schedules.reduce((sum, s) => sum + s.slots.length, 0);

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setParseError(null);
    setSchedules([]);
    setIsParsing(true);

    try {
      const parsed = await parseTeeTimesFile(file);
      setSchedules(parsed);
    } catch (err: any) {
      setParseError(err.message || "Failed to parse the file.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleDownloadCsvTemplate = () => {
    downloadBlob(new Blob([teeTimesCsvTemplate], { type: "text/csv" }), "tee-times-template.csv");
  };

  const handleDownloadExcelTemplate = async () => {
    const blob = await generateTeeTimesExcelTemplate();
    downloadBlob(blob, "tee-times-template.xlsx");
  };

  const handleUpload = async () => {
    if (schedules.length === 0) return;
    setIsSubmitting(true);
    try {
      await fetchUrl("/tee-times/bulk", { method: "POST", body: { schedules } });
      toast.success(`Published ${slotCount} tee time slot${slotCount === 1 ? "" : "s"}!`);
      onUploaded();
    } catch (err: any) {
      toast.error(err.message || "Failed to upload tee times.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-xs"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative w-full max-w-lg bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl z-10"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <FileUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 leading-tight">Upload Tee Times</h3>
              <p className="text-xs text-slate-400 mt-1">Bulk-publish slots from a CSV or Excel file.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 mb-6">
            <button
              type="button"
              onClick={handleDownloadCsvTemplate}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              <Download className="w-3.5 h-3.5" />
              CSV template
            </button>
            <button
              type="button"
              onClick={handleDownloadExcelTemplate}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              <Download className="w-3.5 h-3.5" />
              Excel template
            </button>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 rounded-2xl p-8 flex flex-col items-center gap-2 text-center transition-all"
          >
            <FileSpreadsheet className="w-8 h-8 text-slate-300" />
            {fileName ? (
              <span className="text-sm font-bold text-slate-700">{isParsing ? `Reading ${fileName}...` : fileName}</span>
            ) : (
              <>
                <span className="text-sm font-bold text-slate-600">Click to choose a .csv or .xlsx file</span>
                <span className="text-xs text-slate-400">Columns: date, from, to, price, capacity</span>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {parseError && (
            <div className="flex items-start gap-2 mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{parseError}</span>
            </div>
          )}

          {!parseError && schedules.length > 0 && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-700 font-medium">
              Found {slotCount} slot{slotCount === 1 ? "" : "s"} across {schedules.length} date{schedules.length === 1 ? "" : "s"}. Review and confirm below.
            </div>
          )}

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold transition-all disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={isSubmitting || isParsing || schedules.length === 0}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-600/10 disabled:opacity-60"
            >
              {isSubmitting ? "Publishing..." : "Confirm Upload"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UploadTeeTimesModal;
