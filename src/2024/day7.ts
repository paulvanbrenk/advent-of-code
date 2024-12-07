import { input } from './input';

const myInputs: Array<[number, number[]]> = input.split('\n').map((r) => {
  const [answer, inputs] = r.split(':');

  const parts = inputs
    .split(' ')
    .filter((i) => i.length > 0)
    .map(Number);

  return [Number(answer), parts];
});

type I = [number, number[]];
type operator = 'mult' | 'add' | 'concat';

function doWork(
  cur: I,
  operator: operator,
  allowedOps: Array<operator>,
): boolean {
  //   console.log(cur);
  const [answer, parts] = structuredClone(cur);
  const num = parts.pop();

  if (parts.length === 0 || num === undefined) {
    return num === answer;
  }
  let nextAns = 0;
  switch (operator) {
    case 'add':
      nextAns = answer - num;
      if (nextAns < 0) {
        return false;
      }
      break;
    case 'mult':
      nextAns = answer / num;
      if (!Number.isInteger(nextAns)) {
        return false;
      }
      break;
    case 'concat': {
      const ansStr = answer.toString();
      const numStr = num.toString();
      if (!ansStr.endsWith(numStr)) {
        return false;
      }
      nextAns = Number(ansStr.slice(0, ansStr.lastIndexOf(numStr)));
      break;
    }
  }
  const next: I = [nextAns, parts];

  return allowedOps.reduce(
    (acc, o) => acc || doWork(next, o, allowedOps),
    false,
  );
}

function part1(input: Array<I>) {
  let result: bigint = 0n;
  for (let r of input) {
    if (
      doWork(r, 'mult', ['mult', 'add']) ||
      doWork(r, 'add', ['mult', 'add'])
    ) {
      result += BigInt(r[0]);
    }
  }

  return result;
}

function part2(input: Array<I>) {
  let result: bigint = 0n;
  for (let r of input) {
    if (
      doWork(r, 'mult', ['mult', 'add', 'concat']) ||
      doWork(r, 'concat', ['mult', 'add', 'concat']) ||
      doWork(r, 'add', ['mult', 'add', 'concat'])
    ) {
      result += BigInt(r[0]);
    }
  }

  return result;
}

console.log(part1(myInputs));
console.log(part2(myInputs));
