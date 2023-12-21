const test_input = `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`.split("\n");

const test_input2 = `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`.split("\n");

const puzzle_input = `<get from aoc website>`.split("\n");

function log(u: unknown) {
  console.log(JSON.stringify(u));
}

function findStart(input: string[]): [number, number] {
  for (let i = 0; i < input.length; i++) {
    const j = input[i].indexOf("S");
    if (j != -1) {
      return [i, j];
    }
  }
  throw new Error("no start");
}

function findStartDirection(
  input: string[],
  start: [number, number],
): [number, number, string] {
  let dir: string = "";

  let result: [number, number, string] | undefined;

  const up = input[start[0] - 1]?.[start[1]];
  if (up === "|" || up === "7" || up === "F") {
    dir = "up";
  }

  const down = input[start[0] + 1]?.[start[1]];
  if (down === "|" || down === "L" || down === "J") {
    if (dir === "up") {
      result = [1, 0, "|"];
    } else {
      dir = "down";
    }
  }

  const left = input[start[0]]?.[start[1] - 1];
  if (left === "-" || left === "L" || left === "F") {
    if (dir === "up") {
      result = [0, -1, "J"];
    } else if (dir === "down") {
      result = [0, -1, "7"];
    } else {
      dir = "left";
    }
  }

  const right = input[start[0]]?.[start[1] + 1];
  if (right === "-" || right === "J" || right === "7") {
    if (dir === "up") {
      result = [0, 1, "L"];
    } else if (dir === "down") {
      result = [0, 1, "F"];
    } else if (dir === "left") {
      result = [0, 1, "-"];
    }
  }

  if (result != null) {
    return result;
  }
  throw new Error("no direction from start");
}

function part1(input: string[]) {
  function next(dx: number, dy: number, x: number, y: number) {
    // log({ dx, dy, x, y });
    if (dx == dy) {
      throw new Error();
    }

    const c = input[x][y];
    switch (c) {
      case "|": {
        return [(x += dx), y];
      }
      case "-": {
        return [x, (y += dy)];
      }
      case "L": {
        return dx != 0 ? [x, (y += 1)] : [x - 1, y];
      }
      case "J": {
        return dx != 0 ? [x, (y -= 1)] : [x - 1, y];
      }
      case "7": {
        return dx != 0 ? [x, (y -= 1)] : [x + 1, y];
      }
      case "F": {
        return dx != 0 ? [x, (y += 1)] : [x + 1, y];
      }
      case "S":
        return [-1, -1];
      case ".":
        throw new Error("sand");
      default:
        throw new Error("nothing");
    }
  }

  const start = findStart(input);
  log(start);

  // find next
  const direction = findStartDirection(input, start);
  log(direction);

  let step = [start[0] + direction[0], start[1] + direction[1]];

  let current = next(direction[0], direction[1], step[0], step[1]);
  let cnt = 1;
  while (true && cnt < 140 * 140 && current[0] !== -1) {
    cnt++;

    const tmp = next(
      current[0] - step[0],
      current[1] - step[1],
      current[0],
      current[1],
    );
    step = current;
    current = tmp;
  }
  log(Math.ceil(cnt / 2));
}

function part2(input: string[]) {
  const pieces: Map<string, string> = new Map();

  function next(dx: number, dy: number, x: number, y: number) {
    // log({ dx, dy, x, y });
    if (dx == dy) {
      throw new Error();
    }

    const c = input[x][y];
    if (c === "S") {
      return [-1, -1];
    }
    pieces.set(`[${x},${y}]`, c);
    switch (c) {
      case "|": {
        return [(x += dx), y];
      }
      case "-": {
        return [x, (y += dy)];
      }
      case "L": {
        return dx != 0 ? [x, (y += 1)] : [x - 1, y];
      }
      case "J": {
        return dx != 0 ? [x, (y -= 1)] : [x - 1, y];
      }
      case "7": {
        return dx != 0 ? [x, (y -= 1)] : [x + 1, y];
      }
      case "F": {
        return dx != 0 ? [x, (y += 1)] : [x + 1, y];
      }
      case ".":
        throw new Error("sand");
      default:
        throw new Error("nothing");
    }
  }

  const start = findStart(input);
  log(start);

  // find next
  const direction = findStartDirection(input, start);
  log(direction);

  pieces.set(`[${start[0]},${start[1]}]`, direction[2]);

  let step = [start[0] + direction[0], start[1] + direction[1]];

  let current = next(direction[0], direction[1], step[0], step[1]);
  let cnt = 1;
  while (true && cnt < 140 * 140 && current[0] !== -1) {
    cnt++;

    const tmp = next(
      current[0] - step[0],
      current[1] - step[1],
      current[0],
      current[1],
    );
    step = current;
    current = tmp;
  }

  // fill
  let fill = 0;
  let output: string[][] = [[]];
  let p = "";
  for (let i = 0; i < input.length; i++) {
    const r = input[i];
    output[i] = [];
    let edges = 0;
    for (let j = 0; j < r.length; j++) {
      const key = `[${i},${j}]`;
      if (!pieces.has(key)) {
        fill += edges % 2;
        output[i][j] = edges % 2 === 0 ? "." : "I";
      } else {
        const c = pieces.get(key);
        output[i][j] = ".";
        if (c == null) {
          throw new Error("c");
        }
        if (c === "|") {
          edges++;
        }
        if (c === "J") {
          if (p === "F") {
            edges++;
          }
          p = "";
        } else if (c === "7") {
          if (p === "L") {
            edges++;
          }
          p = "";
        } else if (c === "L" || c === "F") {
          p = c;
        }
      }
    }
    log(output[i]);
  }
  log(fill);
}
// part2(test_input);;
//part2(test_input2);
part2(puzzle_input);
