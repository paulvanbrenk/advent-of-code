import { input } from './input';

// size of the test input
// const width = 11;
// const height = 7;

const width = 101;
const height = 103;

type Point = [number, number];

const myGuards = input.split('\n').map((r) => {
  const [p, v] = r.split(' ');
  let idx = p.indexOf(',');
  const start: Point = [
    Number(p.substring(2, idx)),
    Number(p.substring(idx + 1)),
  ];

  idx = v.indexOf(',');
  const dir: Point = [
    Number(v.substring(2, idx)),
    Number(v.substring(idx + 1)),
  ];

  return { start, dir };
});

function part1(guards: { start: Point; dir: Point }[]) {
  const time = 100;

  const result = new Array(4).fill(0);

  const midX = Math.floor(width / 2);
  const midY = Math.floor(height / 2);

  function findQuad(x: number, y: number) {
    let q = x < midX ? 0 : x > midX ? 1 : -99;

    if (q < 0) {
      return;
    }

    q += y < midY ? 0 : y > midY ? 2 : -99;

    if (q < 0) {
      return;
    }
    result[q]++;
  }

  for (let { start: p, dir: v } of guards) {
    const netX = (v[0] * time) % width;
    const netY = (v[1] * time) % height;

    let newX = p[0] + netX;
    if (newX < 0) {
      newX += width;
    }
    if (newX >= width) {
      newX = (newX + width) % width;
    }
    let newY = p[1] + netY;
    if (newY < 0) {
      newY += height;
    }
    if (newY >= height) {
      newY = (newY + height) % height;
    }

    findQuad(newX, newY);
  }

  return result.reduce((a, c) => (a *= c));
}

function part2(guards: { start: Point; dir: Point }[]) {
  const time = 10_000;

  const grid: string[][] = new Array(height);

  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(width).fill('.');
  }

  let t = 1;
  while (t <= time) {
    // reset grid every iteration
    for (let i = 0; i < grid.length; i++) {
      grid[i] = new Array(width).fill('.');
    }
    for (let g of guards) {
      const { start: p, dir: v } = g;

      let newX = p[0] + v[0];
      if (newX < 0) {
        newX += width;
      }
      if (newX >= width) {
        newX = newX - width;
      }
      let newY = p[1] + v[1];
      if (newY < 0) {
        newY += height;
      }
      if (newY >= height) {
        newY = newY - height;
      }

      g.start = [newX, newY];
      grid[newY][newX] = '#';
    }

    const strGrid = grid.map((r) => r.join(''));
    const hasLine = strGrid.some((r) =>
      // after manual inspection we know this is the bottom
      // of the tree
      r.includes('###############################'),
    );

    if (hasLine) {
      for (let r of strGrid) {
        console.log(r);
      }
      return t;
    }

    t++;
  }
}

console.log(part1(myGuards));
console.log(part2(myGuards));
