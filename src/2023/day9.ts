const test_input = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`.split('\n');

const puzzle_input = `<get from aoc website>`.split('\n');

function log(u: unknown) {
  console.log(JSON.stringify(u));
}

function numStringToArray(src: string): number[] {
  return src
    .split(' ')
    .filter((s) => s.trim().length > 0)
    .map(Number);
}

function part1(input: string[]) {
  function nextRow(row: number[]): number {
    if (row.every((i) => i === 0)) {
      return 0;
    }

    const newRow: number[] = [];
    for (let i = 1; i < row.length; i++) {
      newRow.push(row[i] - row[i - 1]);
    }
    const add = nextRow(newRow);

    return row[row.length - 1] + add;
  }

  const next = input.map((r) => {
    const n = numStringToArray(r);

    return nextRow(n);
  });

  log(next.reduce((a, c) => a + c));
}

function part2(input: string[]) {
  function nextRow(row: number[]): number {
    if (row.every((i) => i === 0)) {
      return 0;
    }

    const newRow: number[] = [];
    for (let i = 1; i < row.length; i++) {
      newRow.push(row[i] - row[i - 1]);
    }
    const add = nextRow(newRow);

    return row[0] - add;
  }

  const next = input.map((r) => {
    const n = numStringToArray(r);

    return nextRow(n);
  });

  log(next.reduce((a, c) => a + c));
}

part2(puzzle_input);
