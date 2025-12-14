import XLSX from "xlsx";
import { execFileSync } from "child_process";

// ------------------ HELPERS ------------------

function splitWithLap(cuttingLength, lapLength, stockLength = 12) {
  if (cuttingLength <= stockLength) return [cuttingLength];

  const usable = stockLength - lapLength;
  const segments = [];
  let remaining = cuttingLength;

  while (remaining > usable) {
    segments.push(usable);
    remaining -= usable;
  }

  segments.push(remaining);
  return segments;
}

function runCppOptimizer(cutsForCpp) {
  const input = {
    stockLength: 12000,
    scrapThreshold: 150,
    cuts: cutsForCpp
  };

  const result = execFileSync("./build/cutting_stock", {
    input: JSON.stringify(input),
    encoding: "utf-8"
  });

  return JSON.parse(result);
}

function mapResultToExcel(barResults, cutMap) {
  return barResults.map(bar => ({
    barNo: bar.barNo,
    remaining: bar.remaining,
    cuts: bar.cutIds.map(id => cutMap.get(id))
  }));
}

// ------------------ READ EXCEL ------------------

const workbook = XLSX.readFile("./BBS_waste_import_lap.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

const normalizedRows = rows.map((row, index) => ({
  id: index + 1,
  label: row["Label"],
  dia: Number(row["Dia"]),
  totalBars: Number(row["Total Bars"]),
  cuttingLength: Number(row["Cutting Length"]),
  lapLength: Number(row["Lap Length"] || 0),
  element: row["Element"]
}));

// ------------------ GENERATE SEGMENTS ------------------

let allSegments = [];

for (const row of normalizedRows) {
  const segments = splitWithLap(row.cuttingLength, row.lapLength);

  for (let b = 0; b < row.totalBars; b++) {
    segments.forEach((segLen, idx) => {
      allSegments.push({
        sourceRowId: row.id,
        segmentIndex: idx + 1,
        dia: row.dia,
        label: row.label,
        element: row.element,
        lengthMM: Math.round(segLen * 1000)
      });
    });
  }
}

// ------------------ GROUP BY DIA ------------------

const groupedByDia = new Map();
for (const seg of allSegments) {
  if (!groupedByDia.has(seg.dia)) groupedByDia.set(seg.dia, []);
  groupedByDia.get(seg.dia).push(seg);
}

// ------------------ PREPARE + RUN PER DIA ------------------

let globalCutId = 0;
const finalResults = [];

for (const [dia, segments] of groupedByDia.entries()) {
  const cutsForCpp = [];
  const cutMap = new Map();

  for (const seg of segments) {
    const id = globalCutId++;
    cutsForCpp.push({ id, length: seg.lengthMM });
    cutMap.set(id, seg);
  }

  console.log(`Running optimizer for Dia ${dia}`);

  const cppResult = runCppOptimizer(cutsForCpp);
  const mapped = mapResultToExcel(cppResult.bars, cutMap);

  finalResults.push({ dia, bars: mapped });
}

// ------------------ FINAL OUTPUT ------------------

console.log(JSON.stringify(finalResults, null, 2));