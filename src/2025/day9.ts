// Advent of Code 2025 - Day 9
import { readFile } from 'fs/promises';
import { join } from 'path';
import { mapLines } from '../utils/input';
import {
  type Point2D,
  area,
  intersect,
  pointInPolygon,
  type Segment,
} from '../utils/math';

async function readInput(filename: string): Promise<string> {
  // Note: tsx provides __dirname even in ES modules
  return (await readFile(join(__dirname, filename), 'utf-8')).trim();
}

async function solvePart1(input: string): Promise<string | number> {
  const coords = mapLines(input, (l) => l.split(',').map(Number) as Point2D);

  let max = 0;

  for (let i = 0; i < coords.length; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      const val = area(coords[i], coords[j]);
      max = Math.max(max, val);
    }
  }

  return max;
}

function corners(p1: Point2D, p2: Point2D): Point2D[] {
  const [x1, y1] = p1;
  const [x2, y2] = p2;

  return [
    [x1, y1],
    [x1, y2],
    [x2, y1],
    [x2, y2],
  ];
}

function makePolygon(points: Point2D[]): Segment[] {
  return points.map((c, i) => {
    const idx = (i + 1) % points.length;
    return [c, points[idx]];
  });
}

function segments(p1: Point2D, p2: Point2D): Segment[] {
  return makePolygon(corners(p1, p2));
}

async function solvePart2(input: string): Promise<string | number> {
  const coords = mapLines(input, (l) => l.split(',').map(Number) as Point2D);

  const edges = makePolygon(coords);

  let max = 0;

  for (let i = 0; i < coords.length; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      const val = area(coords[i], coords[j]);
      if (val > max) {
        const rectCorners = corners(coords[i], coords[j]);
        const rectEdges = segments(coords[i], coords[j]);

        const allInside = rectCorners.every((corner) =>
          pointInPolygon(corner, coords),
        );
        if (!allInside) continue;

        const hasIntersection = rectEdges.some((rectEdge) =>
          edges.some((polyEdge) => intersect(rectEdge, polyEdge)),
        );
        if (hasIntersection) continue;

        max = val;
      }
    }
  }

  return max;
}

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const part = args.includes('--part2') ? 2 : 1;
  const useExample = args.includes('--example');

  const inputFile = useExample ? 'example9.txt' : 'input9.txt';
  const input = await readInput(inputFile);

  if (part === 1) {
    console.log('Part 1:', await solvePart1(input));
  } else {
    console.log('Part 2:', await solvePart2(input));
  }
}

main();
