function log(u: unknown) {
  console.log(JSON.stringify(u, null, "  "));
}

const test_input = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`.split("\n");

const test_input2 = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`.split("\n");

const puzzle_input = `<get from aoc website>`.split("\n");

function part1(input: string[]) {
  const directions = input[0];

  const map = new Map(
    input.slice(2).map((i) => {
      const [name, routes] = i.split("=");
      const parts = routes.replaceAll(/[)( )]/g, "").split(",");

      return [name.trim(), parts];
    }),
  );

  let step = "AAA";
  let index = 0;
  const dirCnt = directions.length;
  while (step != "ZZZ") {
    const [L, R] = map.get(step) ?? [];
    if (L == null || R == null) {
      throw new Error("!!");
    }

    const pick = directions[index % dirCnt];
    switch (pick) {
      case "L": {
        step = L;
        break;
      }
      case "R": {
        step = R;
        break;
      }
      default:
        throw new Error("!!!");
    }
    index++;
  }

  log(index);
}

function part2(input: string[]) {
  const directions = input[0];

  const steps: string[] = [];

  const map = new Map(
    input.slice(2).map((i) => {
      const [name, routes] = i.split("=");
      const parts = routes.replaceAll(/[)( )]/g, "").split(",");

      const n = name.trim();
      if (n.endsWith("A")) {
        steps.push(n);
      }

      return [n, parts];
    }),
  );

  const dirCnt = directions.length;
  const cycles = steps.map((step) => {
    let index = 0;
    let counting = false;
    while (!step.endsWith("Z") && !counting) {
      if (!counting && step.endsWith("Z")) {
        index = 0;
      }
      counting = counting || step.endsWith("Z");
      const pick = directions[index % dirCnt];

      const [L, R] = map.get(step) ?? [];
      if (L == null || R == null) {
        throw new Error("!!");
      }

      switch (pick) {
        case "L": {
          step = L;
          break;
        }
        case "R": {
          step = R;
          break;
        }
        default:
          throw new Error("!!!");
      }

      index++;
    }
    return index;
  });

  log(lcm(cycles));
}

function lcm(arr: number[]): number {
  return arr.reduce((acc, n) => (acc * n) / gcd(acc, n));
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

part2(puzzle_input);
