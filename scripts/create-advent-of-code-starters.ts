
import { promises as fs } from "fs"
import { createWriteStream } from "fs"
import path from "path"
import https from "https"


function showUsage() {
  console.log(`Usage: npx tsx scripts/create-advent-of-code-starters.ts [OPTIONS]

Options:
  --year YEAR         Specify the year (2015-current). Defaults to current year.
  --download-all      Re-download all inputs even if they already exist.
  --help              Show this help message.

Examples:
  npm run setup
  npm run setup -- --year 2016
  npm run setup -- --download-all
  npx tsx scripts/create-advent-of-code-starters.ts --year 2022`)
}

// CLI argument parsing
const argv = process.argv.slice(2)
let yearArg: number | undefined
let downloadAll = false

// Check for help flag first
if (argv.includes("--help") || argv.includes("-h")) {
  showUsage()
  process.exit(0)
}

for (let i = 0; i < argv.length; i++) {
  const arg = argv[i]

  if (arg === "--year") {
    if (!argv[i + 1]) {
      console.error("Error: --year requires a year argument\n")
      showUsage()
      process.exit(1)
    }
    yearArg = parseInt(argv[i + 1], 10)
    if (isNaN(yearArg)) {
      console.error(`Error: Invalid year "${argv[i + 1]}". Year must be a number.\n`)
      showUsage()
      process.exit(1)
    }
    i++
  } else if (arg === "--download-all") {
    downloadAll = true
  } else if (arg.startsWith("--")) {
    console.error(`Error: Unknown option "${arg}"\n`)
    showUsage()
    process.exit(1)
  } else {
    console.error(`Error: Unexpected argument "${arg}"\n`)
    showUsage()
    process.exit(1)
  }
}

const now = new Date()
const currentYear = now.getFullYear()
const currentMonth = now.getMonth() + 1 // 1-based

// Only allow years from 2015 to the last December (if before December, last year)
const maxYear = currentMonth >= 12 ? currentYear : currentYear - 1
const YEAR = yearArg ?? maxYear
if (YEAR < 2015 || YEAR > maxYear) {
  console.error(`Year must be between 2015 and ${maxYear}`)
  process.exit(1)
}
const DAYS = 25
const BASE_DIR = path.resolve(__dirname, `../src/${YEAR}`)

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true })
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function downloadInput(year: number, day: number, dest: string, sessionCookie?: string): Promise<void> {
  const url = `https://adventofcode.com/${year}/day/${day}/input`
  const options: https.RequestOptions = {
    headers: sessionCookie
      ? { Cookie: `session=${sessionCookie}` }
      : {},
  }
  return new Promise((resolve, reject) => {
    const req = https.get(url, options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch input for day ${day}: ${res.statusCode}`))
        return
      }
      const fileStream = createWriteStream(dest)
      res.pipe(fileStream)
      fileStream.on("finish", () => {
        fileStream.close()
        resolve()
      })
    })
    req.on("error", reject)
  })
}


async function createStarterFiles() {
  await ensureDir(BASE_DIR)

  // Read session cookie from session.cookie file
  let sessionCookie: string | undefined
  try {
    const cookieContent = await fs.readFile(path.resolve(__dirname, "../session.cookie"), "utf-8")
    sessionCookie = cookieContent.trim()
  } catch (err) {
    console.warn("Could not read session.cookie file. Input downloads may fail.")
  }

  for (let day = 1; day <= DAYS; day++) {
    const filePath = path.join(BASE_DIR, `day${day}.ts`)
    const examplePath = path.join(BASE_DIR, `example${day}.txt`)
    const inputPath = path.join(BASE_DIR, `input${day}.txt`)
    let created = false

    // Create solution file
    if (!(await fileExists(filePath))) {
      await fs.writeFile(
        filePath,
        `// Advent of Code ${YEAR} - Day ${day}
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { lines, charGrid } from '../utils/input';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function readInput(filename: string): string {
  return readFileSync(join(__dirname, filename), 'utf-8').trim();
}

function solvePart1(input: string): string | number {
  // Parse input - examples:
  // const inputLines = lines(input);
  // const grid = charGrid(input);

  // TODO: Implement Part 1
  return 0;
}

function solvePart2(input: string): string | number {
  // TODO: Implement Part 2
  return 0;
}

// Parse command line arguments
const args = process.argv.slice(2);
const part = args.includes('--part2') ? 2 : 1;
const useExample = args.includes('--example');

const inputFile = useExample ? 'example${day}.txt' : 'input${day}.txt';
const input = readInput(inputFile);

if (part === 1) {
  console.log('Part 1:', solvePart1(input));
} else {
  console.log('Part 2:', solvePart2(input));
}
`
      )
      console.log(`Created: ${filePath}`)
      created = true
    }

    // Create example file
    if (!(await fileExists(examplePath))) {
      await fs.writeFile(
        examplePath,
        `// Add example input from the puzzle description here
`
      )
      console.log(`Created: ${examplePath}`)
    }
    if (downloadAll || created || !(await fileExists(inputPath))) {
      try {
        await downloadInput(YEAR, day, inputPath, sessionCookie)
        console.log(`Downloaded input for day ${day}`)
      } catch (err) {
        console.warn(`Could not download input for day ${day}: ${err}`)
      }
    }
  }
}

createStarterFiles().catch((err) => {
  console.error("Error creating Advent of Code starter files:", err)
  process.exit(1)
})
