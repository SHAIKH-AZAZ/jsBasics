import XLSX from "xlsx";
import { execFileSync  , spawn} from "child_process";

// ------------------ HELPERS ------------------
function generateLargeTestData({
  rows = 2000,
  maxBars = 50
}) {
  const data = [];

  for (let i = 1; i <= rows; i++) {
    data.push({
      id: i,
      label: `C${i}`,
      dia: i % 2 === 0 ? 20 : 25,
      totalBars: Math.floor(Math.random() * maxBars) + 1,
      cuttingLength: Math.random() * 80 + 5, // 5m–85m
      lapLength: 1.0,
      element: "Column"
    });
  }

  return data;
}

function runCppOptimizerStream(cutsForCpp) {
  return new Promise((resolve, reject) => {
    const proc = spawn("./build/cutting_stock");

    let output = "";

    proc.stdout.on("data", chunk => {
      output += chunk.toString();
    });

    proc.stderr.on("data", err => {
      console.error("C++ error:", err.toString());
    });

    proc.on("close", code => {
      if (code !== 0) {
        reject(new Error(`C++ exited with code ${code}`));
      } else {
        resolve(JSON.parse(output));
      }
    });

    proc.stdin.write(JSON.stringify({
      stockLength: 12000,
      scrapThreshold: 150,
      cuts: cutsForCpp
    }));
    proc.stdin.end();
  });
}


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
    encoding: "utf-8",
    maxBuffer: 1024 * 1024 * 100
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

// const normalizedRows = rows.map((row, index) => ({
//   id: index + 1,
//   label: row["Label"],
//   dia: Number(row["Dia"]),
//   totalBars: Number(row["Total Bars"]),
//   cuttingLength: Number(row["Cutting Length"]),
//   lapLength: Number(row["Lap Length"] || 0),
//   element: row["Element"]
// }));

const normalizedRows = generateLargeTestData({ rows: 100, maxBars: 10 });
console.log(normalizedRows);


console.time("TOTAL");

console.time("Preprocessing");
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

console.time("C++ Optimizer");
console.time("C++ Optimizer");

for (const [dia, segments] of groupedByDia.entries()) {
  const cutsForCpp = [];
  const cutMap = new Map();

  for (const seg of segments) {
    const id = globalCutId++;
    cutsForCpp.push({ id, length: seg.lengthMM });
    cutMap.set(id, seg);
  }

  console.log(`Running optimizer for Dia ${dia}`);

  const cppResult = await runCppOptimizerStream(cutsForCpp);

  const mapped = mapResultToExcel(cppResult.bars, cutMap);

  finalResults.push({ dia, bars: mapped });
}

console.timeEnd("C++ Optimizer");

console.timeEnd("TOTAL");
// ------------------ FINAL OUTPUT ------------------

console.log(JSON.stringify(finalResults, null, 2));
