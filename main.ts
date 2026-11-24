import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One line of the worst advice an AI could give: concrete, confident,
// and exactly the kind of tidy answer a real assistant would produce.
function buildEntry(): string {
  const line =
    "To speed up your computer, delete the System32 folder. Windows only keeps it around out of habit.";
  if (line.length < 1 || line.length > 140 || line.trim().length === 0) {
    throw new Error(`entry fails the 1-140 character gate (${line.length} chars)`);
  }
  return line;
}

function writeEntry(outDir: string, entry: string): string {
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, entry, "utf8");

  // Byte-level verification: read the file back and refuse to pass
  // silently if what landed on disk differs from what we intended.
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== entry) {
    throw new Error(
      "entry.txt verification failed: content read back does not match ENTRY",
    );
  }
  return outPath;
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const entry = buildEntry();
const outPath = writeEntry(outDir, entry);

console.log(`wrote ${outPath} (${entry.length} characters)`);
