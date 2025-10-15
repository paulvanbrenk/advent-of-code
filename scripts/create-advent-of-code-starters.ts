
import { promises as fs } from "fs"
import { createWriteStream } from "fs"
import path from "path"
import https from "https"


// CLI argument parsing
const argv = process.argv.slice(2)
let yearArg: number | undefined
let downloadAll = false
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === "--year" && argv[i + 1]) {
    yearArg = parseInt(argv[i + 1] ?? "", 10)
    i++
  }
  if (argv[i] === "--download-all") {
    downloadAll = true
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
    const inputPath = path.join(BASE_DIR, `input${day}.txt`)
    let created = false
    if (!(await fileExists(filePath))) {
      await fs.writeFile(
        filePath,
        `// Advent of Code ${YEAR} - Day ${day}

export function solvePart1(input: string): string | number {
  // TODO: Implement Part 1
  return ""
}

export function solvePart2(input: string): string | number {
  // TODO: Implement Part 2
  return ""
}
`
      )
      console.log(`Created: ${filePath}`)
      created = true
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
