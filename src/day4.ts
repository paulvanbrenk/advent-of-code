const test_input = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`.split('\n');

const puzzle_input = `<get from aoc website>`.split('\n');

const intersect = (l: string[], r: string[]) =>
  l.filter((value) => r.includes(value));

function part1(input: string[]) {
  const result = input
    .map((r) => {
      const [_, winString, numString] = r.split(/[:|]/);
      const winners = winString.split(' ').filter((s) => s.length > 0);
      const numbers = numString.split(' ').filter((s) => s.length > 0);

      // console.log(JSON.stringify(winners) + ':' + JSON.stringify(numbers));

      const prices = intersect(winners, numbers);
      return prices.length > 0 ? 2 ** (prices.length - 1) : 0;
    })
    .reduce((a, c) => a + c);

  console.log(result);
}

function part2(input: string[]) {
  const count: number[] = new Array<number>(input.length).fill(
    1,
    0,
    input.length,
  );

  input.forEach((r, i) => {
    const [_, winString, numString] = r.split(/[:|]/);
    const winners = winString.split(' ').filter((s) => s.length > 0);
    const numbers = numString.split(' ').filter((s) => s.length > 0);

    // console.log(JSON.stringify(winners) + ':' + JSON.stringify(numbers));

    let prices = intersect(winners, numbers).length;
    const multiplier = count[i];
    let j = i + 1;
    while (prices > 0) {
      count[j] = count[j] + multiplier;
      j++;
      prices--;
    }
  });

  const result = count.reduce((a, c) => a + c);

  console.log(result);
}

part2(puzzle_input);
