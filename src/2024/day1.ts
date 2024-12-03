import { input } from './input';

const left: number[] = [];
const right: number[] = [];

input.split('\n').forEach((line) => {
  const [l, r] = line.split('\t');

  left.push(Number.parseInt(l));
  right.push(Number.parseInt(r));
});

function part1(left: number[], right: number[]) {
  const sort = (x: number, y: number) => x - y;
  left.sort(sort);
  right.sort(sort);

  let result: bigint = 0n;

  for (let i = 0; i < left.length; i++) {
    result += BigInt(Math.abs(left[i] - right[i]));
  }

  return result;
}

function part2(left: number[], right: number[]) {
  const map = new Map<number, number>();
  for (let n of right) {
    const cnt = (map.get(n) ?? 0) + 1;
    map.set(n, cnt);
  }

  let result: bigint = 0n;
  for (let n of left) {
    const mult = map.get(n) ?? 0;

    console.log(JSON.stringify({ mult, n }));
    result += BigInt(n * mult);
  }

  return result;
}

console.log(part2(left, right));
console.log(part2(left, right));
