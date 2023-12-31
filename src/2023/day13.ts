const test_input = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`.split('\n');

const puzzle_input = `<get from aoc website>`.split('\n');

function log(u: unknown) {
  console.log(JSON.stringify(u, undefined, 2));
}

function rotateMatrixRight(matrix: string[][]): string[][] {
  return matrix[0].map((_, index) =>
    matrix.map((row) => row[row.length - 1 - index]),
  );
}

function makeMirrors(input: string[]) {
  const mirrors = input.reduce(
    (a: string[][], c) => {
      if (c.length === 0) {
        a.push([]);
      } else {
        a[a.length - 1].push(c);
      }
      return a;
    },
    [[]],
  );

  return mirrors;
}

function part1(input: string[]) {
  const mirrors = makeMirrors(input);

  const reflectionScore = mirrors.reduce((a, c) => {
    let rc: number[] = [];
    for (let i = 0; i < c.length - 1; i++) {
      if (c[i] === c[i + 1]) {
        rc.push(i);
      }
    }

    const rows = rc.reduce((a: number | null, entry) => {
      let i = entry;
      let j = i + 1;

      while (i > -1 && j < c.length) {
        if (c[i] !== c[j]) {
          return a;
        }
        i--;
        j++;
      }
      return (entry + 1) * 100;
    }, null);

    const cc: number[] = [];

    const rotated = rotateMatrixRight(c.map((r) => Array.from(r))).map((r) =>
      r.join(''),
    );
    for (let i = 0; i < rotated.length - 1; i++) {
      if (rotated[i] === rotated[i + 1]) {
        cc.push(i);
      }
    }

    const cols = cc.reduce((a: number | null, entry) => {
      let i = entry;
      let j = i + 1;

      while (i > -1 && j < rotated.length) {
        if (rotated[i] !== rotated[j]) {
          return a;
        }
        i--;
        j++;
      }
      return rotated.length - entry - 1;
    }, null);

    return a + (cols ? cols : 0) + (rows ? rows : 0);
  }, 0);

  log(reflectionScore);
}

function part2(input: string[]) {
  const mirrors = makeMirrors(input);

  const diffCount = (l: string, r: string) => {
    let smudgeCnt = 0;
    for (let p = 0; p < l.length; p++) {
      if (l[p] !== r[p]) {
        smudgeCnt += 1;
      }
    }

    return smudgeCnt;
  };

  const reflectionScore = mirrors.reduce((a, mir) => {
    let rc: number[] = [];
    for (let i = 0; i < mir.length - 1; i++) {
      const smudgeCnt = diffCount(mir[i], mir[i + 1]);
      if (smudgeCnt <= 1) {
        rc.push(i);
      }
    }

    const rows = rc.reduce((a: number | null, entry) => {
      let i = entry;
      let j = i + 1;

      let totalSmudge = 0;
      while (i > -1 && j < mir.length) {
        const smudgeCnt = diffCount(mir[i], mir[j]);
        totalSmudge += smudgeCnt;
        if (totalSmudge > 1) {
          return a;
        }
        i--;
        j++;
      }
      return totalSmudge === 1 ? (entry + 1) * 100 : a;
    }, null);

    const cc: number[] = [];

    const rotated = rotateMatrixRight(mir.map((r) => Array.from(r))).map((r) =>
      r.join(''),
    );
    for (let i = 0; i < rotated.length - 1; i++) {
      const smudgeCnt = diffCount(rotated[i], rotated[i + 1]);
      if (smudgeCnt <= 1) {
        cc.push(i);
      }
    }

    const cols = cc.reduce((a: number | null, entry) => {
      let i = entry;
      let j = i + 1;

      let totalSmudge = 0;
      while (i > -1 && j < rotated.length) {
        const smudgeCnt = diffCount(rotated[i], rotated[j]);
        totalSmudge += smudgeCnt;
        if (totalSmudge > 1) {
          return a;
        }
        i--;
        j++;
      }
      return totalSmudge === 1 ? rotated.length - entry - 1 : a;
    }, null);

    return a + (cols ? cols : 0) + (rows ? rows : 0);
  }, 0);

  log(reflectionScore);
}
// part1(test_input);

part2(puzzle_input);
