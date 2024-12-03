import { readFileSync } from 'fs';

const input = readFileSync('<path to input data>').toString();

function part1(data: string) {
  const regExp = /mul\((?<left>\d{1,3}),(?<right>\d{1,3})\)/gm;

  const matches = data.matchAll(regExp);

  let result = 0;

  for (let m of matches) {
    const { left, right } = m.groups!;

    result += Number(left) * Number(right);
  }

  return result;
}

function part2(data: string) {
  const regExp =
    /(mul\((?<left>\d{1,3}),(?<right>\d{1,3})\))|(do\(\))|(don't\(\))/gm;

  const matches = data.matchAll(regExp);

  let result = 0;
  let mult = true;
  for (let m of matches) {
    const [match] = m;
    if (match === 'do()') {
      mult = true;
    } else if (match === "don't()") {
      mult = false;
    } else if (mult) {
      const { left, right } = m.groups!;

      result += Number(left) * Number(right);
    }
  }
  return result;
}

console.log(part1(input));
console.log(part2(input));
