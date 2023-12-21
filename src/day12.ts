import { PerformanceMark, PerformanceMeasure } from "perf_hooks";

const test_input = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`.split("\n");

const puzzle_input = `<get from aoc website>`.split("\n");

function log(u: unknown) {
  console.log(JSON.stringify(u));
}

function numStringToArray(src: string): number[] {
  return src
    .split(",")
    .filter((s) => s.trim().length > 0)
    .map(Number);
}

function validPositions(template: string, groups: number[]): number {
  let sum = 0;
  const q: [[string, number[]]] = [[template, groups]];
  while (q.length > 0) {
    const [t, g] = q.pop() ?? ["", []];
    //  log({ t, g });

    if (t.length === 0) {
      if (g.length === 0) {
        sum += 1;
        continue;
      }
    }

    if (g.length === 0) {
      if (!t.includes("#")) {
        sum += 1;
        continue;
      }
    }

    if (t.length >= g.reduce((a, c) => a + c, 0) + g.length - 1) {
      const c = t[0];
      if (c === "?") {
        q.push(["." + t.slice(1), g]);
        q.push(["#" + t.slice(1), g]);
      }

      if (c === ".") {
        let i = 1;
        for (; i < t.length; i++) {
          if (t[i] !== ".") {
            break;
          }
        }
        q.push([t.slice(i), g]);
      }

      if (c === "#") {
        const [cr, ...rem] = g;
        let i = 0;
        for (; i < cr; i++) {
          if (t[i] === ".") {
            break;
          }
        }
        if (i === cr) {
          if (t[i] !== "#") {
            q.push([t.slice(cr + 1), rem]);
          }
        }
      }
    }
  }

  return sum;
}

const cache: Map<string, number> = new Map();

function validPositionsRecurse(template: string, groups: number[]): number {
  const key = JSON.stringify({ template, groups });
  const entry = cache.get(key);
  if (entry != null) {
    return entry;
  }

  const [t, g] = [template, groups];
  //  log({ t, g });

  if (t.length === 0) {
    if (g.length === 0) {
      cache.set(key, 1);
      return 1;
    }
  }

  if (g.length === 0) {
    if (!t.includes("#")) {
      cache.set(key, 1);
      return 1;
    }
  }

  if (t.length >= g.reduce((a, c) => a + c, 0) + g.length - 1) {
    const c = t[0];
    if (c === "?") {
      const sum =
        validPositionsRecurse("." + t.slice(1), g) +
        validPositionsRecurse("#" + t.slice(1), g);
      cache.set(key, sum);
      return sum;
    }

    if (c === ".") {
      let i = 1;
      for (; i < t.length; i++) {
        if (t[i] !== ".") {
          break;
        }
      }
      const sum = validPositionsRecurse(t.slice(i), g);
      cache.set(key, sum);
      return sum;
    }

    if (c === "#") {
      const [cr, ...rem] = g;
      let i = 0;
      for (; i < cr; i++) {
        if (t[i] === ".") {
          break;
        }
      }
      if (i === cr) {
        if (t[i] !== "#") {
          const sum = validPositionsRecurse(t.slice(cr + 1), rem);
          cache.set(key, sum);
          return sum;
        }
      }
    }
  }

  return 0;
}

function part1(input: string[]) {
  const counts: number[] = input.map((r) => {
    const [template, groupString] = r.split(" ");
    const groups = numStringToArray(groupString);

    return validPositions(template, groups);
  });

  log(counts);
  log(counts.reduce((a, c) => a + c));
}

function part2(input: string[]) {
  const expanded: [string, number[]][] = input.map((r) => {
    const [t, g] = r.split(" ");
    const groupString = new Array<string>(5).fill(g.trim()).join(",");

    const newT = new Array<string>(5).fill(t).join("?");

    const newG = numStringToArray(groupString);

    return [newT, newG];
  });

  // log(expanded);
  const counts: number[] = expanded.map((r, i) => {
    log(`${i + 1} / ${expanded.length}`);
    const [template, groups] = r;
    return validPositionsRecurse(template, groups);
  });

  log(counts);
  log(counts.reduce((a, c) => a + c));
}

// part1(puzzle_input);
part2(puzzle_input);
