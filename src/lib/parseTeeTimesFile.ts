import ExcelJS from "exceljs";

export interface ParsedSlot {
  from: string;
  to: string;
  price: string;
  capacity: number;
}

export interface ParsedSchedule {
  date: string;
  slots: ParsedSlot[];
}

const REQUIRED_COLUMNS = ["date", "from", "to", "price", "capacity"];
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const pad2 = (n: number) => String(n).padStart(2, "0");

// Excel stores dates/times as a Date (or a fraction-of-a-day number for
// time-only cells) depending on how the column was formatted — normalize
// whatever comes out of a cell into a plain string before validating it.
const cellToDateString = (value: unknown): string => {
  if (value instanceof Date) {
    return `${value.getFullYear()}-${pad2(value.getMonth() + 1)}-${pad2(value.getDate())}`;
  }
  return String(value ?? "").trim();
};

const cellToTimeString = (value: unknown): string => {
  if (value instanceof Date) {
    return `${pad2(value.getHours())}:${pad2(value.getMinutes())}`;
  }
  if (typeof value === "number") {
    // Excel time-only serial: fraction of a 24h day.
    const totalMinutes = Math.round(value * 24 * 60);
    return `${pad2(Math.floor(totalMinutes / 60) % 24)}:${pad2(totalMinutes % 60)}`;
  }
  return String(value ?? "").trim();
};

const cellToPlainString = (value: unknown): string => {
  if (value instanceof Date) return cellToDateString(value);
  if (typeof value === "object" && value !== null) {
    // Formula cell: { formula, result } — fall back to the computed result.
    const result = (value as { result?: unknown }).result;
    return result !== undefined ? String(result).trim() : "";
  }
  return String(value ?? "").trim();
};

// Shared validator: takes a header row + data rows (already normalized to
// plain strings/numbers) and produces the schedule shape POST
// /tee-times/bulk expects, regardless of whether the source was a CSV or
// an Excel sheet.
const rowsToSchedules = (header: string[], dataRows: string[][]): ParsedSchedule[] => {
  const normalizedHeader = header.map((h) => h.trim().toLowerCase());
  const missing = REQUIRED_COLUMNS.filter((c) => !normalizedHeader.includes(c));
  if (missing.length > 0) throw new Error(`Missing required column(s): ${missing.join(", ")}`);

  const columnIndex = (name: string) => normalizedHeader.indexOf(name);
  const byDate = new Map<string, ParsedSlot[]>();

  dataRows.forEach((cols, i) => {
    const rowNumber = i + 2; // +1 for header, +1 for 1-based row numbering
    if (cols.every((c) => !c)) return; // skip fully blank rows

    const date = cols[columnIndex("date")];
    const from = cols[columnIndex("from")];
    const to = cols[columnIndex("to")];
    const price = cols[columnIndex("price")];
    const capacityRaw = cols[columnIndex("capacity")];

    if (!date || !from || !to || !price || !capacityRaw) {
      throw new Error(`Row ${rowNumber}: every column (date, from, to, price, capacity) is required.`);
    }
    if (!DATE_PATTERN.test(date)) {
      throw new Error(`Row ${rowNumber}: "date" must be in YYYY-MM-DD format, got "${date}".`);
    }
    if (!TIME_PATTERN.test(from) || !TIME_PATTERN.test(to)) {
      throw new Error(`Row ${rowNumber}: "from"/"to" must be in 24-hour HH:mm format, e.g. 07:30. Got "${from}" / "${to}".`);
    }
    const capacity = Number(capacityRaw);
    if (!Number.isInteger(capacity) || capacity < 1 || capacity > 4) {
      throw new Error(`Row ${rowNumber}: "capacity" must be a whole number from 1 to 4, got "${capacityRaw}".`);
    }
    if (Number.isNaN(Number(price)) || Number(price) < 0) {
      throw new Error(`Row ${rowNumber}: "price" must be a non-negative number, got "${price}".`);
    }

    if (!byDate.has(date)) byDate.set(date, []);
    byDate.get(date)!.push({ from, to, price, capacity });
  });

  if (byDate.size === 0) throw new Error("No data rows found below the header.");

  return Array.from(byDate.entries()).map(([date, slots]) => ({ date, slots }));
};

const parseCsvText = (text: string): ParsedSchedule[] => {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) throw new Error("The file is empty.");

  const header = lines[0].split(",").map((h) => h.trim());
  const dataRows = lines.slice(1).map((line) => line.split(",").map((c) => c.trim()));
  return rowsToSchedules(header, dataRows);
};

const parseExcelBuffer = async (buffer: ArrayBuffer): Promise<ParsedSchedule[]> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.worksheets[0];
  if (!worksheet) throw new Error("The spreadsheet has no sheets.");

  const rawRows: unknown[][] = [];
  worksheet.eachRow({ includeEmpty: false }, (row) => {
    // ExcelJS rows are 1-indexed with index 0 unused — drop it.
    const values = Array.isArray(row.values) ? row.values.slice(1) : [];
    rawRows.push(values);
  });
  if (rawRows.length === 0) throw new Error("The spreadsheet's first sheet is empty.");

  const header = rawRows[0].map((v) => cellToPlainString(v));
  const dateCol = header.map((h) => h.trim().toLowerCase()).indexOf("date");
  const fromCol = header.map((h) => h.trim().toLowerCase()).indexOf("from");
  const toCol = header.map((h) => h.trim().toLowerCase()).indexOf("to");

  const dataRows = rawRows.slice(1).map((row) =>
    header.map((_, colIndex) => {
      const value = row[colIndex];
      if (colIndex === dateCol) return cellToDateString(value);
      if (colIndex === fromCol || colIndex === toCol) return cellToTimeString(value);
      return cellToPlainString(value);
    })
  );

  return rowsToSchedules(header, dataRows);
};

// Accepts either a .csv (plain text) or .xlsx/.xls (Excel) file and returns
// the same schedule shape either way.
export const parseTeeTimesFile = async (file: File): Promise<ParsedSchedule[]> => {
  const name = file.name.toLowerCase();

  if (name.endsWith(".csv")) {
    return parseCsvText(await file.text());
  }
  if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    return parseExcelBuffer(await file.arrayBuffer());
  }
  throw new Error("Unsupported file type — please upload a .csv or .xlsx file.");
};

export const teeTimesCsvTemplate =
  "date,from,to,price,capacity\n2026-08-01,07:00,07:30,45,4\n2026-08-01,08:00,08:30,50,2\n2026-08-02,07:00,07:30,45,4\n";

const TEMPLATE_ROWS = [
  ["date", "from", "to", "price", "capacity"],
  ["2026-08-01", "07:00", "07:30", 45, 4],
  ["2026-08-01", "08:00", "08:30", 50, 2],
  ["2026-08-02", "07:00", "07:30", 45, 4],
];

export const generateTeeTimesExcelTemplate = async (): Promise<Blob> => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Tee Times");

  sheet.addRows(TEMPLATE_ROWS);
  sheet.getRow(1).font = { bold: true };
  sheet.columns = [
    { width: 14 }, // date
    { width: 10 }, // from
    { width: 10 }, // to
    { width: 10 }, // price
    { width: 12 }, // capacity
  ];
  // Force these as plain text columns so Excel doesn't silently reformat
  // "07:00" into a time serial when the file is reopened and re-saved.
  sheet.getColumn(1).numFmt = "@";
  sheet.getColumn(2).numFmt = "@";
  sheet.getColumn(3).numFmt = "@";

  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
};
