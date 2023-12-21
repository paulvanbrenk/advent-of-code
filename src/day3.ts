const test_input = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`.split('\n');

const puzzle_input = `<get from aoc website>`.split('\n');

function isNumber(c: string) {
  return '0123456789'.includes(c);
}

function part1(input: string[]) {
  let sum = 0;

  // state
  let value: string = '';
  let isPart: boolean = false;

  function check(i: number, j: number): boolean {
    for (let x = i - 1; x <= i + 1; x++) {
      for (let y = j - 1; y <= j + 1; y++) {
        const c = input[x]?.[y];
        if (c != null && !isNumber(c) && c !== '.') {
          return true;
        }
      }
    }
    return false;
  }

  for (let i = 0; i < input.length; i++) {
    const row = input[i];
    value = '';
    isPart = false;
    // check past end of array
    for (let j = 0; j <= row.length; j++) {
      const c = row[j];
      if (!isNumber(c)) {
        if (value != '' && isPart) {
          console.log(value);
          sum += Number(value);
        }
        // reset state
        value = '';
        isPart = false;
        continue;
      }
      value += c;
      isPart = isPart || check(i, j);
    }
  }

  console.log(sum);
}

function part2(input: string[]) {
  const gears: Map<string, number[]> = new Map();

  // state
  let value: string = '';
  let isGear: string | null = null;

  function check(i: number, j: number): string | null {
    for (let x = i - 1; x <= i + 1; x++) {
      for (let y = j - 1; y <= j + 1; y++) {
        const c = input[x]?.[y];
        if (c != null && !isNumber(c) && c === '*') {
          return JSON.stringify([x, y]);
        }
      }
    }
    return null;
  }

  for (let i = 0; i < input.length; i++) {
    const row = input[i];
    value = '';
    isGear = null;
    // check past end of array
    for (let j = 0; j <= row.length; j++) {
      const c = row[j];
      if (!isNumber(c)) {
        if (value != '' && isGear != null) {
          const key = JSON.stringify(isGear);
          const current: Array<number> = gears.get(key) ?? [];
          current.push(Number(value));
          gears.set(key, current);
        }
        // reset state
        value = '';
        isGear = null;
        continue;
      }
      value += c;
      const g = check(i, j);
      if (g != null) {
        if (isGear == null) {
          isGear = g;
        } else {
          // console.log(JSON.stringify(isGear) + ':' + JSON.stringify(g));
          if (isGear !== g) {
            throw new Error();
          }
        }
      }
    }
  }

  let sum = 0;

  for (let item of gears) {
    const [_, values] = item;
    if (values.length == 2) {
      sum += values[0] * values[1];
    }
  }

  console.log(sum);
}

part2(test_input);
