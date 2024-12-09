import { input } from './input';

const myGrid = input.split('\n').map((r) => r.split(''));

function findAntennas(grid: string[][]) {
  const map = new Map<string, [number, number][]>();

  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    for (let j = 0; j < row.length; j++) {
      const c = row[j];
      if (c !== '.') {
        const entries = map.get(c) ?? [];
        entries.push([i, j]);
        map.set(c, entries);
      }
    }
  }
  return map;
}

function part1(source: string[][]) {
  const grid = structuredClone(source);

  const antinodes = new Set<string>();

  const antennas = findAntennas(grid);
  for (let [_, a] of antennas) {
    for (let i = 0; i < a.length - 1; i++) {
      const left = a[i];

      for (let j = i + 1; j < a.length; j++) {
        const right = a[j];

        const diffX = left[0] - right[0];
        const diffY = left[1] - right[1];

        const first = [left[0] + diffX, left[1] + diffY];
        const second = [right[0] - diffX, right[1] - diffY];

        if (grid[first[0]]?.[first[1]] != null) {
          antinodes.add(`${first}`);
          grid[first[0]][first[1]] = '*';
        }
        if (grid[second[0]]?.[second[1]] != null) {
          antinodes.add(`${second}`);

          grid[second[0]][second[1]] = '*';
        }
      }
    }
  }

  return antinodes.size;
  //   for (let r of grid) {
  //     console.log(r.join(''));
  //   }
}

function part2(source: string[][]) {
  const grid = structuredClone(source);

  const antinodes = new Set<string>();

  const antennas = findAntennas(grid);
  for (let [_, a] of antennas) {
    for (let i = 0; i < a.length - 1; i++) {
      const left = a[i];

      for (let j = i + 1; j < a.length; j++) {
        const right = a[j];
        antinodes.add(`${left}`);
        antinodes.add(`${right}`);

        const diffX = left[0] - right[0];
        const diffY = left[1] - right[1];

        // direction 1
        let first = [left[0] + diffX, left[1] + diffY];
        while (grid[first[0]]?.[first[1]] != null) {
          antinodes.add(`${first}`);
          grid[first[0]][first[1]] = '*';
          first = [first[0] + diffX, first[1] + diffY];
        }

        // direction 2
        let second = [right[0] - diffX, right[1] - diffY];

        while (grid[second[0]]?.[second[1]] != null) {
          antinodes.add(`${second}`);

          grid[second[0]][second[1]] = '*';
          second = [second[0] - diffX, second[1] - diffY];
        }
      }
    }
  }

  for (let r of grid) {
    console.log(r.join(''));
  }
  return antinodes.size;
}

console.log(part1(myGrid));
console.log(part2(myGrid));
