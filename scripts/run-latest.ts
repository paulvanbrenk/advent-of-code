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

    // Parse command line arguments (skip first 2 which are node and script path)
    const args = process.argv.slice(2)
    const useExample = args.includes('--example')
    const part1Only = args.includes('--part1')
    const part2Only = args.includes('--part2')

    const dataSource = useExample ? 'example' : 'puzzle input'
    const filePath = path.resolve(__dirname, `../src/${year}/day${day}.ts`)

    if (part1Only) {
      // Run only part 1
      console.log(`Running ${year}/day${day} - Part 1 with ${dataSource}...\n`)
      const part1Args = useExample ? '--example' : ''
      execSync(`npx tsx ${filePath} ${part1Args}`, { stdio: "inherit" })
    } else if (part2Only) {
      // Run only part 2
      console.log(`Running ${year}/day${day} - Part 2 with ${dataSource}...\n`)
      const part2Args = useExample ? '--example --part2' : '--part2'
      execSync(`npx tsx ${filePath} ${part2Args}`, { stdio: "inherit" })
    } else {
      // Run both parts (default behavior)
      console.log(`Running ${year}/day${day} with ${dataSource}...\n`)

      // Run part 1
      console.log('=== Part 1 ===')
      const part1Args = useExample ? '--example' : ''
      execSync(`npx tsx ${filePath} ${part1Args}`, { stdio: "inherit" })

      console.log('\n=== Part 2 ===')
      const part2Args = useExample ? '--example --part2' : '--part2'
      execSync(`npx tsx ${filePath} ${part2Args}`, { stdio: "inherit" })
    }
  } catch (err) {
    console.error("Error:", err instanceof Error ? err.message : err)
    process.exit(1)
  }
}

main()
