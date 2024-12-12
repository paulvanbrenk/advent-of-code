import { input } from './input';

const myGrid: readonly (readonly string[])[] = input
  .split('\n')
  .map((r) => r.split(''));

const dirs: Array<[number, number]> = [
  [0, 1],
  [1, 0],
  [-1, 0],
  [0, -1],
];

function part1(grid: readonly (readonly string[])[]) {
  type Region = { name: string; area: number; perimeter: number };

  const regions: Region[] = [];
  const visited = structuredClone(grid) as string[][];

  function findRegion(x: number, y: number, region: Region) {
    if (visited[x][y] === '#') {
      return;
    }
    region.area += 1;
    visited[x][y] = '#';

    const c = grid[x][y];

    dirs.forEach(([dx, dy]) => {
      const [nextX, nextY] = [x + dx, y + dy];
      const nb = grid[nextX]?.[nextY];
      if (nb === c) {
        findRegion(nextX, nextY, region);
      } else {
        region.perimeter += 1;
      }
    });
  }

  for (let i = 0; i < grid.length; i++) {
    const row = visited[i];
    for (let j = 0; j < row.length; j++) {
      const c = row[j];
      if (c !== '#') {
        const region = { name: c, area: 0, perimeter: 0 };
        findRegion(i, j, region);
        regions.push(region);
      }
    }
  }

  const result = regions.reduce((a, c) => {
    const price = c.area * c.perimeter;
    // console.log(`${c.name} => ${price}`);
    return a + price;
  }, 0);

  return result;
}

function part2(grid: readonly (readonly string[])[]) {
  type Region = {
    name: string;
    area: number;
    fences: [
      [number, number][],
      [number, number][],
      [number, number][],
      [number, number][],
    ];
  };

  const regions: Region[] = [];
  const visited = structuredClone(grid) as string[][];

  function findRegion(x: number, y: number, region: Region) {
    if (visited[x][y] === '#') {
      return;
    }
    region.area += 1;
    visited[x][y] = '#';

    const c = grid[x][y];

    dirs.forEach(([dx, dy], i) => {
      const [nextX, nextY] = [x + dx, y + dy];
      const nb = grid[nextX]?.[nextY];
      if (nb === c) {
        findRegion(nextX, nextY, region);
      } else {
        const f: [number, number] = [x, y];
        region.fences[i].push(f);
      }
    });
  }

  for (let i = 0; i < grid.length; i++) {
    const row = visited[i];
    for (let j = 0; j < row.length; j++) {
      const c = row[j];
      if (c !== '#') {
        const region = {
          name: c,
          area: 0,
          fences: [[], [], [], []] as [
            [number, number][],
            [number, number][],
            [number, number][],
            [number, number][],
          ],
        };
        findRegion(i, j, region);
        regions.push(region);
      }
    }
  }

  const result = regions.reduce((a, c) => {
    let part = 0;

    for (let i = 0; i < c.fences.length; i++) {
      const fields = c.fences[i];

      const d = dirs[i];
      fields.sort((a, b) => {
        if (d[0] === 0) {
          return a[1] !== b[1] ? a[1] - b[1] : a[0] - b[0];
        } else {
          return a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1];
        }
      });

      let currentField: [number, number] = fields[0];
      part += 1;
      for (let j = 1; j < fields.length; j++) {
        const [x1, y1] = currentField;
        const [x2, y2] = fields[j];
        if (
          (x1 === x2 && Math.abs(y1 - y2) === 1) ||
          (y1 === y2 && Math.abs(x1 - x2) === 1)
        ) {
          currentField = fields[j];
        } else {
          part += 1;
          currentField = fields[j];
        }
      }
    }

    const price = c.area * part;
    // console.log(`${c.name} : ${c.area} * ${part} => ${price}`);
    return a + price;
  }, 0);

  return result;
}

console.log(part1(myGrid));
console.log(part2(myGrid));
