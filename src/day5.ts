const test_input = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`.split("\n");

const puzzle_input = `<get from aoc website>`.split("\n");

function log(u: unknown) {
  console.log(JSON.stringify(u));
}

function numStringToArray(src: string): number[] {
  return src
    .split(" ")
    .filter((s) => s.trim().length > 0)
    .map(Number);
}

function part1(input: string[]) {
  function getSeeds(s: string) {
    const idx = s.indexOf(":");
    const ret = numStringToArray(s.substring(idx + 1));
    return ret;
  }

  const seeds = getSeeds(input[0]);
  let i = 1;
  let header = false;
  const transformRanges: number[][][] = [];
  let transformId = 0;

  while (i < input.length) {
    if (input[i].includes(":")) {
      header = true;
      i++;
      continue;
    }
    if (input[i].length == 0) {
      if (header) {
        header = false;
        transformId++;
      }
      i++;
      continue;
    }
    // collect ranges
    const range = numStringToArray(input[i]);
    const trans = transformRanges[transformId] ?? [];
    trans.push(range);
    transformRanges[transformId] = trans.sort((a, b) => a[1] - b[1]);
    i++;
  }

  const locations = transformRanges.reduce((a, c, i) => {
    const result = a.map((s) => {
      for (let r of c) {
        const [dest, source, length] = r;

        if (s < source) {
          return s;
        }
        if (s < source + length) {
          return s + dest - source;
        }
      }
      return s;
    });

    log(result);
    return result;
  }, seeds);

  const minimum = locations.reduce((a, c) => Math.min(a, c));

  log(`answer: ${minimum}`);
}

function part2(input: string[]) {
  function getSeeds(s: string) {
    const idx = s.indexOf(":");
    const ret = numStringToArray(s.substring(idx + 1));
    const result: [number, number][] = [];
    for (let i = 0, j = 1; j < ret.length; i += 2, j += 2) {
      result.push([ret[i], ret[j]]);
    }
    return result.sort((a, b) => a[0] - b[0]);
  }

  const seeds = getSeeds(input[0]);
  let i = 1;
  let header = false;
  const transformRanges: number[][][] = [];
  let transformId = 0;

  while (i < input.length) {
    if (input[i].includes(":")) {
      header = true;
      i++;
      continue;
    }
    if (input[i].length == 0) {
      if (header) {
        header = false;
        transformId++;
      }
      i++;
      continue;
    }
    // collect ranges
    const range = numStringToArray(input[i]);
    const trans = transformRanges[transformId] ?? [];
    trans.push(range);
    transformRanges[transformId] = trans.sort((a, b) => a[1] - b[1]);
    i++;
  }

  const locations = transformRanges.reduce((a: [number, number][], c, i) => {
    const result: [number, number][] = [];
    while (a.length > 0) {
      const [s, cnt] = a.pop() ?? [];
      if (s == null || cnt == null) {
        break;
      }
      let handled = false;
      for (let r of c) {
        const [dest, source, length] = r;
        handled = false;
        //  log(`${s}-${s + cnt} >> ${source}-${source + length - 1}`);
        if (s < source) {
          if (s + cnt <= source) {
            result.push([s, cnt]);
            handled = true;
            break;
          } else {
            // part of the seed range is handled
            const newCnt = source - s;
            a.push([s, newCnt]);
            a.push([source, cnt - newCnt]);
            handled = true;
            break;
          }
        }
        if (s < source + length) {
          // entire range fits
          if (s + cnt <= source + length) {
            result.push([s + dest - source, cnt]);
            handled = true;
            break;
          } else {
            // part 1
            a.push([s, source + length - s]);
            // log([s, source + length - s]);

            a.push([source + length, cnt - (source + length - s)]);
            // log([source + length, cnt - (source + length - s)]);
            handled = true;
            break;
          }
        }
      }
      if (!handled) {
        result.push([s, cnt]);
      }
    }

    log(result.sort((a, b) => a[0] - b[0]));
    return result.sort((a, b) => a[0] - b[0]);
  }, seeds);

  const minimum = locations.reduce(
    (a, c) => Math.min(a, c[0]),
    Number.MAX_VALUE,
  );

  log(`answer: ${minimum}`);
}

part2(puzzle_input);
