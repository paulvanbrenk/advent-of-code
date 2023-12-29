function log(u: unknown) {
  console.log(JSON.stringify(u, undefined, 2));
}

type Coords = [x: number, y: number, z: number];

function addCoords(a: Coords, b: Coords): Coords {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

const test_input = `19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3`.split('\n');

const puzzle_input = `<get from AoC`.split('\n');

const s2c = (s: string) =>
  s
    .trim()
    .split(',')
    .slice(0, 3)
    .reduce<Coords>(
      (a, c, i) => {
        a[i] = Number(c);
        return a;
      },
      [0, 0, 0],
    );

function part1(input: string[], min: number, max: number) {
  const inRange = (c: Coords) => {
    return min <= c[0] && c[0] <= max && min <= c[1] && c[1] <= max;
  };

  const vectors: [pos: Coords, vel: Coords][] = input.map((r) => {
    const [p, v] = r.split('@');

    const pos = s2c(p);
    const vel = s2c(v);
    return [pos, vel];
  });

  const intersections: Coords[] = [];

  for (let i = 0; i < vectors.length; i++) {
    for (let j = i + 1; j < vectors.length; j++) {
      const [[x1, y1], [dx1, dy1]] = vectors[i];
      const [[x2, y2], [dx2, dy2]] = vectors[j];

      const t =
        ((x1 - x2) * (-1 * dy2) - (y1 - y2) * (-1 * dx2)) /
        (-1 * dx1 * (-1 * dy2) - -1 * dy1 * (-1 * dx2));

      if (isNaN(t) || !isFinite(t) || t < 0) {
        continue;
      }

      const [ix, iy] = [x1 + dx1 * t, y1 + dy1 * t];

      const t2 = (ix - x2) / dx2;
      if (t2 < 0) {
        continue;
      }

      // ignore z for part 1
      intersections.push([ix, iy, -1]);
    }
  }

  //   log(intersections);

  const inRegion = intersections.reduce((a, c) => (inRange(c) ? a + 1 : a), 0);
  log(`hits: ${inRegion}`);
}

const isEqual = (l: Coords, r: Coords) => {
  for (let i = 0; i < 3; i++) {
    if (l[i] !== r[i]) {
      return false;
    }
  }
  return true;
};

const logVector = (v: Coords) => {
  log({
    vector: v.join(',') + ` (${v.reduce((a, c) => a + c)})`,
  });
};

function* getPrimeFactors(n: number): Generator<number> {
  let found;
  for (let f = 2; f <= Math.floor(Math.sqrt(n)); f++) {
    if (n % f === 0) {
      yield f;
      found = f;
      break;
    }
  }
  if (found == null) yield n;
  else yield* getPrimeFactors(n / found);
}

function* getFactors(n: number): Generator<number> {
  if (n === 1) {
    yield 1;
    return;
  }

  const tally = new Map();
  for (const prime of getPrimeFactors(n)) {
    const count = tally.get(prime) ?? 0;
    tally.set(prime, count + 1);
  }
  const tallyEntries = [...tally.entries()];

  const unvisited: number[][] = [];
  unvisited.push([]);

  while (unvisited.length > 0) {
    const next = unvisited.pop();
    if (next == null) {
      throw new Error('bad input');
    }
    if (next.length >= tallyEntries.length) {
      yield tallyEntries.reduce(
        (product, [prime], i) => product * Math.pow(prime, next[i]),
        1,
      );
    } else {
      for (let k = tallyEntries[next.length][1]; k >= 0; k--) {
        unvisited.push([...next, k]);
      }
    }
  }
}

function part2(input: string[]) {
  function solveLinear(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
  ): number[] {
    const det = a * d - b * c;
    if (det === 0) {
      throw new Error();
    }

    const invA = d / det;
    const invB = -b / det;
    const invC = -c / det;
    const invD = a / det;

    return [invA * e + invC * f, invB * e + invD * f];
  }

  const vectors: [pos: Coords, vel: Coords][] = input.map((r) => {
    const [p, v] = r.split('@');

    const pos = s2c(p);
    const vel = s2c(v);
    return [pos, vel];
  });

  const candidateXYZ: [number[] | null, number[] | null, number[] | null] = [
    null,
    null,
    null,
  ];

  outer: for (let i = 0; i < vectors.length - 1; i++) {
    for (let j = i + 1; j < vectors.length; j++) {
      for (let k = 0; k < 3; k++) {
        if (candidateXYZ[k] != null && candidateXYZ[k]?.length === 1) {
          continue;
        }

        if (vectors[i][1][k] === vectors[j][1][k]) {
          const dx = vectors[i][0][k] - vectors[j][0][k];
          const factors = [...getFactors(Math.abs(dx))];
          const candidates: number[] = [];
          factors.forEach((f) => {
            candidates.push(vectors[i][1][k] + f, vectors[i][1][k] - f);
          });
          if (candidateXYZ[k] != null) {
            candidateXYZ[k] =
              candidateXYZ[k]?.filter((v) => candidates.includes(v)) ?? [];
          } else {
            candidateXYZ[k] = [...new Set(candidates)];
          }
        }
      }
      if (
        candidateXYZ.every(
          (candidates) => candidates && candidates.length === 1,
        )
      )
        break outer;
    }
  }
  const velocityXYZ = candidateXYZ.map((candidates) => candidates?.[0] ?? 0);

  const indices = [0, 1];

  const dvx0 = vectors[indices[0]][1][0] - velocityXYZ[0];
  const dvx1 = vectors[indices[1]][1][0] - velocityXYZ[0];
  const dvy0 = vectors[indices[0]][1][1] - velocityXYZ[1];
  const dvy1 = vectors[indices[1]][1][1] - velocityXYZ[1];

  const positionXY = solveLinear(
    -dvy0,
    -dvy1,
    dvx0,
    dvx1,
    dvx0 * vectors[indices[0]][0][1] - dvy0 * vectors[indices[0]][0][0],
    dvx1 * vectors[indices[1]][0][1] - dvy1 * vectors[indices[1]][0][0],
  );

  const positionZ =
    vectors[indices[0]][0][2] +
    ((positionXY[0] - vectors[indices[0]][0][0]) /
      (velocityXYZ[0] - vectors[indices[0]][1][0])) *
      (velocityXYZ[2] - vectors[indices[0]][1][2]);

  logVector([
    Math.round(positionXY[0]),
    Math.round(positionXY[1]),
    Math.round(positionZ),
  ]);
}

// part1(test_input, 7, 27);
// part1(puzzle_input, 200000000000000, 400000000000000);
part2(test_input);
part2(puzzle_input);
