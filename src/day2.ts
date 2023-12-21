const test_input = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`.split("\n");

const puzzle_input = `<get from aoc website>`.split("\n");

const pieces = { red: 12, green: 13, blue: 14 };

function part1(input: string[]) {
  let sum = 0;
  input.forEach((v, i) => {
    const parts = v.split(/[:;,]/);
    const needed = parts.reduce(
      (a, c, i) => {
        if (i == 0) {
          return a;
        }
        const [cnt, name] = c.trim().split(" ");
        if ((a as any)[name] < Number(cnt)) {
          return {
            ...a,
            [name]: Number(cnt),
          };
        }

        return a;
      },
      { red: 0, green: 0, blue: 0 },
    );
    if (
      needed.red <= pieces.red &&
      needed.green <= pieces.green &&
      needed.blue <= pieces.blue
    ) {
      sum += i + 1;
    }
  });

  console.log(sum);
}

function part2(input: string[]) {
  const sum = input
    .map((v) => {
      const parts = v.split(/[:;,]/);
      const needed = parts.reduce(
        (a, c, i) => {
          if (i == 0) {
            return a;
          }
          const [cnt, name] = c.trim().split(" ");
          if ((a as any)[name] < Number(cnt)) {
            return {
              ...a,
              [name]: Number(cnt),
            };
          }

          return a;
        },
        { red: 0, green: 0, blue: 0 },
      );
      return needed.red * needed.blue * needed.green;
    })
    .reduce((a, c) => {
      return a + c;
    });

  console.log(sum);
}

part2(puzzle_input);
