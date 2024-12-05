import { input } from './input';

const lines = input.split('\n');

const map: Map<string, string[]> = new Map();

const pages: string[][] = [];

for (let l of lines) {
  if (l.includes('|')) {
    const [left, right] = l.split('|');
    const list = map.get(right) ?? [];
    list.push(left);
    map.set(right, list);
    continue;
  }

  if (l.includes(',')) {
    pages.push(l.split(','));
  }
}

function sortSeries(series: string[][], validOrderMap: Map<string, string[]>) {
  const validSeries = [];
  const inValidSeries = [];
  for (let s of series) {
    const set = new Set(s);
    let valid = true;
    for (let p of s) {
      if (!valid) {
        break;
      }
      set.delete(p);
      const before = validOrderMap.get(p);
      if (before == null) {
        continue;
      }
      for (let b of before) {
        if (set.has(b)) {
          valid = false;
          break;
        }
      }
    }
    if (valid) {
      validSeries.push(s);
    } else {
      inValidSeries.push(s);
    }
  }
  return { validSeries, inValidSeries };
}

function part1(series: string[][], validOrderMap: Map<string, string[]>) {
  const { validSeries } = sortSeries(series, validOrderMap);
  let sum = 0;

  for (let s of validSeries) {
    const mid = Math.floor(s.length / 2);
    sum += Number(s[mid]);
  }

  return sum;
}

function part2(series: string[][], validOrderMap: Map<string, string[]>) {
  const { inValidSeries } = sortSeries(series, validOrderMap);

  function compare(x: string, y: string) {
    if (validOrderMap.has(x)) {
      const before = validOrderMap.get(x);
      if (before?.includes(y)) {
        return 1;
      }
    }
    if (validOrderMap.has(y)) {
      const before = validOrderMap.get(y);
      if (before?.includes(x)) {
        return -1;
      }
    }
    return 0;
  }

  const fixed = [];
  for (let s of inValidSeries) {
    const after = s.toSorted(compare);
    fixed.push(after);
  }

  let sum = 0;

  for (let s of fixed) {
    const mid = Math.floor(s.length / 2);
    sum += Number(s[mid]);
  }

  return sum;
}

console.log(part1(pages, map));
console.log(part2(pages, map));
