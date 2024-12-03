import { input } from './input';

const reps = input.split('\n').map((r) => {
  return r.split(' ').map((n) => Number.parseInt(n));
});

// The levels are either all increasing or all decreasing.
// Any two adjacent levels differ by at least one and at most three.

function part1(reports: number[][]) {
  let unSafeCount: number = 0;

  for (let r of reports) {
    const a = r[0];
    const b = r[1];

    const inc = b > a;
    for (let i = 1; i < r.length; i++) {
      const diff = (inc ? -1 : 1) * (r[i - 1] - r[i]);
      if (diff < 1 || diff > 3) {
        unSafeCount++;
        break;
      }
    }
  }

  return reports.length - unSafeCount;
}

function part2(reports: number[][]) {
  function check(
    row: number[],
    inc: boolean,
    prev: number,
    cur: number,
    hasFix: boolean,
  ): boolean {
    if (cur > row.length) {
      return true;
    }
    const diff = (inc ? -1 : 1) * (row[prev] - row[cur]);
    if (diff < 1 || diff > 3) {
      if (hasFix) {
        return false;
      }
      return (
        // skip current or skip previous
        check(row, inc, prev, cur + 1, true) ||
        check(row, inc, prev - 1, cur, true)
      );
    }

    return check(row, inc, cur, cur + 1, hasFix);
  }

  let unSafeCount: number = 0;

  for (let r of reports) {
    if (
      !check(r, true, 0, 1, false) &&
      !check(r, false, 0, 1, false) &&
      !check(r, true, 1, 2, true) &&
      !check(r, false, 1, 2, true)
    ) {
      unSafeCount++;
    }
  }

  return reports.length - unSafeCount;
}

console.log(part1(reps));
console.log(part2(reps));
