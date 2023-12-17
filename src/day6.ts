const test_input = `Time:      7  15   30
Distance:  9  40  200`.split("\n");

const puzzle_input = `Time:        46     68     98     66
Distance:   358   1054   1807   1080`.split("\n");

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
  const times = numStringToArray(input[0].split(":")[1]);
  const distances = numStringToArray(input[1].split(":")[1]);

  const distance = (t: number, limit: number) => t * (limit - t);
  const midpoint = (limit: number) => limit / 2;

  const cnt: number[] = [];

  for (let i = 0; i < times.length; i++) {
    // find valid start
    let center = Math.floor(midpoint(times[i]));
    // left edge
    let l = 0;
    let r = center;
    let d = 0;
    let m = -1;
    let leftEdge = Number.MAX_VALUE;
    while (l <= r) {
      m = Math.floor((l + r) / 2);
      d = distance(m, times[i]);
      log({ i, l, r, m, d });
      if (d < distances[i]) {
        l = m + 1;
      } else if (d > distances[i]) {
        leftEdge = Math.min(m, leftEdge);
        r = m - 1;
      } else {
        leftEdge = Math.min(m + 1, leftEdge);
        break;
      }
    }

    l = center;
    r = times[i];
    d = 0;
    m = -1;
    let rightEdge = Number.MIN_VALUE;
    while (l <= r) {
      m = Math.floor((l + r) / 2);
      d = distance(m, times[i]);
      log({ i, l, r, m, d });
      if (d > distances[i]) {
        rightEdge = Math.max(m, rightEdge);
        l = m + 1;
      } else if (d < distances[i]) {
        r = m - 1;
      } else {
        rightEdge = Math.max(m - 1, rightEdge);
        break;
      }
    }
    log({ leftEdge, rightEdge });
    cnt.push(rightEdge - leftEdge + 1);
  }

  const result = cnt.reduce((a, c) => a * c);
  log(result);
}

function part2(input: string[]) {
  const time = Number(input[0].split(":")[1].replaceAll(" ", ""));
  const target = Number(input[1].split(":")[1].replaceAll(" ", ""));

  log({ time, target });

  const distance = (t: number, limit: number) => t * (limit - t);
  const midpoint = (limit: number) => limit / 2;

  // find valid start
  let center = Math.floor(midpoint(time));
  // left edge
  let l = 0;
  let r = center;
  let d = 0;
  let m = -1;
  let leftEdge = Number.MAX_VALUE;
  while (l <= r) {
    m = Math.floor((l + r) / 2);
    d = distance(m, time);
    log({ l, r, m, d });
    if (d < target) {
      l = m + 1;
    } else if (d > target) {
      leftEdge = Math.min(m, leftEdge);
      r = m - 1;
    } else {
      leftEdge = Math.min(m + 1, leftEdge);
      break;
    }
  }

  l = center;
  r = time;
  d = 0;
  m = -1;
  let rightEdge = Number.MIN_VALUE;
  while (l <= r) {
    m = Math.floor((l + r) / 2);
    d = distance(m, time);
    log({ l, r, m, d });
    if (d > target) {
      rightEdge = Math.max(m, rightEdge);
      l = m + 1;
    } else if (d < target) {
      r = m - 1;
    } else {
      rightEdge = Math.max(m - 1, rightEdge);
      break;
    }
  }
  log({ leftEdge, rightEdge });
  log(rightEdge - leftEdge + 1);
}

part2(puzzle_input);
