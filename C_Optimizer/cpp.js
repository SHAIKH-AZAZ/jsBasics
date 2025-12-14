import { execFileSync } from "child_process";

function runCppOptimizer(cutsForCpp) {
  const result = execFileSync(
    "./build/cutting_stock",
    {
      encoding: "utf-8"
    }
  );

  return JSON.parse(result);
}
