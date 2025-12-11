// Advent of Code 2025 - Day 11
import { readFile } from 'fs/promises';
import { join } from 'path';
import { mapLines } from '../utils/input';
import { hash } from '../utils/math';

async function readInput(filename: string): Promise<string> {
  // Note: tsx provides __dirname even in ES modules
  return (await readFile(join(__dirname, filename), 'utf-8')).trim();
}

function mapInput(input: string): Map<string, string[]> {
  const inputLines = mapLines(input, (l) => {
    const [key, rest] = l.split(':');
    const vals = rest.trim().split(' ');
    return [key, vals] as [string, string[]];
  });

  return new Map<string, string[]>(inputLines);
}

async function solvePart1(input: string): Promise<string | number> {
  const portMap = mapInput(input);

  const seen = new Set<string>();
  const start = 'you';
  const end = 'out';

  function follow(inPort: string): number {
    if (inPort === end) {
      return 1;
    }

    seen.add(inPort);

    const nextPorts = portMap.get(inPort);
    if (nextPorts == null) {
      throw new Error(`input error ${inPort}`);
    }
    return nextPorts.reduce((a, p) => a + follow(p), 0);
  }

  return follow(start);
}

async function solvePart2(input: string): Promise<string | number> {
  const portMap = mapInput(input);

  const seen = new Set<string>();
  const start = 'svr';
  const end = 'out';

  const memo = new Map<string, number>();

  function follow(inPort: string, dac: boolean, fft: boolean): number {
    if (inPort === end) {
      return dac && fft ? 1 : 0;
    }

    seen.add(inPort);

    dac = dac || inPort === 'dac';
    fft = fft || inPort === 'fft';

    const nextPorts = portMap.get(inPort);
    if (nextPorts == null) {
      throw new Error(`input error ${inPort}`);
    }
    return nextPorts.reduce((a, p) => {
      let tmp = memo.get(hash(p, dac, fft));
      if (tmp == null) {
        tmp = follow(p, dac, fft);
      }
      memo.set(hash(p, dac, fft), tmp);
      return a + tmp;
    }, 0);
  }

  return follow(start, false, false);
}

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const part = args.includes('--part2') ? 2 : 1;
  const useExample = args.includes('--example');

  const inputFile = useExample ? 'example11.txt' : 'input11.txt';
  const input = await readInput(inputFile);

  if (part === 1) {
    console.log('Part 1:', await solvePart1(input));
  } else {
    console.log('Part 2:', await solvePart2(input));
  }
}

main();
