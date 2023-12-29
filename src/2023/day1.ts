const puzzle_input = `<get from aoc website>`.split('\n');

const testInput = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`.split('\n');

function part1() {
  const isNumber = (s: string) => {
    return '0123456789'.indexOf(s) > -1;
  };

  const result = puzzle_input
    .map((r) => {
      let i = 0;
      let j = r.length - 1;
      while (i <= j) {
        if (isNumber(r[i]) && isNumber(r[j])) {
          return Number(r[i] + r[j]);
        }
        if (!isNumber(r[i])) {
          i++;
        }
        if (!isNumber(r[j])) {
          j--;
        }
      }
      return 0;
    })
    .reduce((p, c) => p + c);

  console.log(result);
}

const numbers = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
];

function part2() {
  const asDigit = (s: string) => {
    let num = '0123456789'.indexOf(s);
    if (num > -1) {
      return num.toString();
    }
    num = [
      'zero',
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
    ].indexOf(s);
    if (num > -1) {
      return num.toString();
    }
    return '0';
  };

  const result = puzzle_input
    .map((r) => {
      let first = Number.MAX_VALUE;
      let firstNumber = '';
      let last = -1;
      let lastNumber = '';
      numbers.forEach((v) => {
        const f = r.indexOf(v);
        if (f > -1 && f < first) {
          first = f;
          firstNumber = asDigit(v);
        }
        const l = r.lastIndexOf(v);
        if (l > -1 && l > last) {
          last = l;
          lastNumber = asDigit(v);
        }
      });

      console.log(firstNumber + lastNumber);
      return Number(firstNumber + lastNumber);
    })
    .reduce((p, c) => p + c);

  console.log(result);
}

part2();
