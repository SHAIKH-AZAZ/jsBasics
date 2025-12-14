import XLSX from "xlsx";
import path from "path";

const workbook = XLSX.readFile("./BBS_waste_import_lap.xlsx");

const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

const row = XLSX.utils.sheet_to_json(sheet, { defval: "" });
// console.log(row);

function normalizeRow(row, index) {
  return {
    id: index + 1,
    label: row["Label"],
    dia: Number(row["Dia"]),
    totalBars: Number(row["Total Bars"]),
    cuttingLength: Number(row["Cutting Length"]),
    lapLength: Number(row["Lap Length"] || 0),
    element: row["Element"],
  };
}

const normalizeRows = row.map(normalizeRow);
// console.log(normalizeRows);

function splitWithLap(cuttingLength, lapLength, stockLength) {
  if (cuttingLength <= stockLength) {
    return [cuttingLength];
  }
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

// console.log(normalizeRows);

const test = normalizeRows.map((row) => ({
  id: row.id,
  label: row.label,
  segments: splitWithLap(row.cuttingLength, row.lapLength, 12),
}));

// console.log(test);

function generateSegments(row) {
  const segments = splitWithLap(row.cuttingLength, row.lapLength, 12);

  const result = [];

  for (let b = 0; b < row.totalBars; b++) {
    segments.forEach((segLen, idx) => {
      result.push({
        sourceRowId: row.id,
        segmentIndex: idx + 1,
        dia: row.dia,
        label: row.label,
        element: row.element,
        lengthMM: Math.round(segLen * 1000),
      });
    });
  }
  return result;
}

let allsegments = [];
for (const row of normalizeRows) {
  const segments = generateSegments(row);
  allsegments.push(...segments);
//   console.log(...segments);
}

// console.log(allsegments);

function groupByDia(segments) {
  const map = new Map();

  for (const seg of segments) {
    if (!map.has(seg.dia)) {
      map.set(seg.dia, []);
    }
    map.get(seg.dia).push(seg);
  }
  return map;
}

// console.log(allsegments);

const groupedByDia = groupByDia(allsegments);

// console.log(groupedByDia);


let globalCutId = 0;

/**
 * Converts groupedByDia → C++ ready input
 * and preserves traceability
 */

function prepareCutsForCpp(groupedByDia){
    const result = new Map();

    for(const [dia  , segments] of groupedByDia.entries()){
        const cutsForCpp = [];
        const cutMap = new Map();

        for(const seg of segments){
            const id = globalCutId++;

            cutsForCpp.push({
                id , 
                length:seg.lengthMM
            });

            cutMap.set(id  , {
                sourceRowId: seg.sourceRowId,
                segmentIndex:seg.segmentIndex,
                dia: seg.dia,
                label: seg.label,
                element: seg.element,
                lengthMM:seg.lengthMM
            });
        }

        result.set(dia, {cutsForCpp , cutMap});
    }
    return result;
}


const cppInputByDia = prepareCutsForCpp(groupedByDia);

const {cutsForCpp , cutMap} = cppInputByDia.get(20);



function mapResultToExcel(barResults , cutMap){
    return barResults.map(bar => ({
        barNo: bar.barNo,
        waste: bar.waste,
        cuts:bar.cutIds.map(id => cutMap.get(id))
    }));
}