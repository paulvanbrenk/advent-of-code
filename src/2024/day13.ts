import { input } from './input';

/*
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400
*/

type Machine = {
  A: [number, number];
  B: [number, number];
  Price: [number, number];
};

function getNums(s: string): [number, number] {
  const xIdx = s.indexOf('X');
  const xEnd = s.indexOf(',', xIdx);
  const xVal = Number(s.substring(xIdx + 2, xEnd));

  const yIdx = s.indexOf('Y');
  const yVal = Number(s.substring(yIdx + 2));

  return [xVal, yVal];
}

function parseInput(str: string) {
  const lines = input.split('\n');

  const machines: Machine[] = [];

  for (let i = 0; i < lines.length; i += 4) {
    const lineA = lines[i];
    const lineB = lines[i + 1];
    const linePrize = lines[i + 2];

    machines.push({
      A: getNums(lineA),
      B: getNums(lineB),
      Price: getNums(linePrize),
    });
  }

  return machines;
}

const A_COST = 3;
const B_COST = 1;

function part1(machines: ReadonlyArray<Machine>, part2: boolean = false) {
  const result: [number, number][] = [];

  for (let m of machines) {
    let low = 0;
    let high = 100;
    let last = 0;

    let [PX, PY] = m.Price;
    if (part2) {
      PX = PX + 10000000000000;
      PY = PY + 10000000000000;
    }
    const [BX, BY] = m.B;
    const [AX, AY] = m.A;

    const countA = (PX * BY - BX * PY) / (BY * AX - BX * AY);
    if (!part2 && (0 > countA || countA > 100)) {
      continue;
    }
    const countB = (PY * AX - AY * PX) / (BY * AX - BX * AY);
    if (!part2 && (0 > countB || countB > 100)) {
      continue;
    }

    if (Number.isInteger(countA) && Number.isInteger(countB)) {
      result.push([countA, countB]);
    }
  }
  return result.reduce((a, c) => (a += c[0] * A_COST + c[1 * B_COST]), 0);
}

const myMachines = parseInput(input) as readonly Machine[];
console.log(part1(myMachines));
console.log(part1(myMachines, true));
