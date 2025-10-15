import { promises as fs } from "fs"
import path from "path"
import { execSync } from "child_process"

async function getLatestDay(): Promise<{ year: number; day: number }> {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  // Determine the year to check
  const maxYear = currentMonth >= 12 ? currentYear : currentYear - 1

  // Check years in reverse order (most recent first)
  for (let year = maxYear; year >= 2015; year--) {
    const yearDir = path.resolve(__dirname, `../src/${year}`)
    try {
      const files = await fs.readdir(yearDir)
      const dayFiles = files
        .filter(f => f.match(/^day\d+\.ts$/))
        .map(f => parseInt(f.match(/^day(\d+)\.ts$/)![1]))
        .sort((a, b) => b - a) // descending order

      if (dayFiles.length > 0) {
        return { year, day: dayFiles[0] }
      }
    } catch {
      // Directory doesn't exist, continue to previous year
    }
  }

  throw new Error("No Advent of Code solutions found")
}

async function main() {
  try {
    const { year, day } = await getLatestDay()
    console.log(`Running ${year}/day${day}...\n`)

    // Run directly with tsx (no compilation needed)
    const filePath = path.resolve(__dirname, `../src/${year}/day${day}.ts`)
    execSync(`npx tsx ${filePath}`, { stdio: "inherit" })
  } catch (err) {
    console.error("Error:", err instanceof Error ? err.message : err)
    process.exit(1)
  }
}

main()
