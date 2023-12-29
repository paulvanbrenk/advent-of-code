function log(u: unknown) {
  console.log(JSON.stringify(u, undefined, 2));
}

type Coords = [x: number, y: number];

function printGrid(output: string[][]) {
  log({
    o: output.map((r, i) => `${('000' + i).substring(-2)} ${r.join('')}`),
  });
}

const test_input = `#.#####################
  #.......#########...###
  #######.#########.#.###
  ###.....#.>.>.###.#.###
  ###v#####.#v#.###.#.###
  ###.>...#.#.#.....#...#
  ###v###.#.#.#########.#
  ###...#.#.#.......#...#
  #####.#.#.#######.#.###
  #.....#.#.#.......#...#
  #.#####.#.#.#########v#
  #.#...#...#...###...>.#
  #.#.#v#######v###.###v#
  #...#.>.#...>.>.#.###.#
  #####v#.#.###v#.#.###.#
  #.....#...#...#.#.#...#
  #.#########.###.#.#.###
  #...###...#...#...#.###
  ###.###.#.###v#####v###
  #...#...#.#.>.>.#.>.###
  #.###.###.#.###.#.#v###
  #.....###...###...#...#
  #####################.#`
  .split('\n')
  .map((r) => r.trim());

const puzzle_input = `<get from aoc`.split('\n').map((r) => r.trim());

const directions: Coords[] = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

const slides = 'v>^<'; // order matches order of directions

type QueueItem = { c: Coords; dir: Coords; sum: number; visited: string[] };

function getKey(c: Coords): string {
  return c[0] + '_' + c[1];
}

function addCoords(a: Coords, b: Coords): Coords {
  return [a[0] + b[0], a[1] + b[1]];
}

function reverseCoords(a: Coords): Coords {
  return [a[0] * -1, a[1] * -1];
}

function doWork(input: readonly string[], dry: boolean) {
  log(`size ${input.length} x ${input[0].length}`);

  const output = input.map((r) => r.split(''));

  const findNext = (start: Coords, dir: Coords): Coords[] => {
    const result: Coords[] = [];

    for (let i = 0; i < 4; i++) {
      const d: Coords = directions[i];
      // backwards
      if (dir[0] !== dir[1] && dir[0] === -1 * d[0] && dir[1] === -1 * d[1]) {
        continue;
      }
      const c: Coords = addCoords(start, d);
      const tile = input[c[0]]?.[c[1]];
      if (
        tile === '.' ||
        tile === slides[i] ||
        (dry && slides.includes(tile))
      ) {
        result.push(d);
      }
    }
    return result;
  };

  const start: Coords = [0, input[0].indexOf('.')];
  const startKey = getKey(start);
  const end: Coords = [input.length - 1, input[input.length - 1].indexOf('.')];
  const endKey = getKey(end);

  const buildGraph = () => {
    const nodes: Map<string, [key: string, cnt: number][]> = new Map();

    // q stores intersection (or start) and valid next directions
    const q: [Coords, Coords][] = [];
    const validDirs = findNext(start, [0, 0]);
    for (const n of validDirs) {
      q.push([start, n]);
    }

    while (q.length > 0) {
      const c = q.pop();
      if (c == null) {
        continue;
      }
      const visited: Set<string> = new Set();
      const [node, dir] = c;
      output[node[0]][node[1]] = 'O';
      let sum = 0;
      visited.add(getKey(node));
      let current = node;
      let currentDir = dir;
      let nd = [dir];
      while (nd.length === 1) {
        const next = addCoords(current, nd[0]);
        if (visited.has(getKey(next))) {
          break;
        }
        sum++;
        current = next;
        currentDir = nd[0];
        nd = findNext(current, nd[0]);
      }
      const knownNode = nodes.has(getKey(current));
      const dest = nodes.get(getKey(node)) ?? [];
      dest.push([getKey(current), sum]);
      if (!knownNode) {
        q.push([current, reverseCoords(currentDir)]);
      }
      for (let ndi of nd) {
        const next = addCoords(current, ndi);
        if (visited.has(getKey(next))) {
          continue;
        }
        if (!knownNode) {
          q.push([current, ndi]);
        }
      }
      nodes.set(getKey(node), dest);
    }

    return nodes;
  };

  const findPath: (
    graph: Map<string, [key: string, cnt: number][]>,
    start: string,
    sum: number,
    visited: string[],
  ) => number = (
    graph: Map<string, [key: string, cnt: number][]>,
    start: string,
    sum: number,
    visited: string[],
  ) => {
    // not super fast, but acceptable enough
    if (start === endKey) {
      return sum;
    }

    const destinations = graph.get(start);
    if (
      destinations == null ||
      destinations.length == 0 ||
      visited.includes(start)
    ) {
      return 0;
    }

    visited.push(start);

    return destinations
      .map((d) => findPath(graph, d[0], sum + d[1], [...visited]))
      .reduce((a, c) => Math.max(a, c), 0);
  };

  let max: number = 0;

  if (dry) {
    // part 2

    const graphNodes = buildGraph();

    for (const [k, v] of graphNodes) {
      log(`${k} >> ${v.map((i) => JSON.stringify(i)).join(',')}`);
    }

    max = findPath(graphNodes, startKey, 0, []);

    // printGrid(output);
  }

  if (!dry) {
    const q: Array<QueueItem> = [
      { c: start, dir: [0, 0], sum: 0, visited: [getKey(start)] },
    ];

    let cnt = 0;
    while (q.length > 0) {
      if (cnt % 1000 == 0) log(`cnt ${cnt}`);
      cnt++;
      const current = q.pop();
      if (current == null) {
        throw new Error('null in q');
      }
      let { c: start, dir, sum, visited: v } = current;

      const visited = new Set(v);

      let nextDirs = findNext(start, dir);
      let loc = start;
      while (nextDirs.length > 0) {
        if (nextDirs.length === 0) {
          break;
        }

        if (nextDirs.length === 1) {
          const d = [addCoords(loc, nextDirs[0]), nextDirs[0]];
          if (visited.has(getKey(d[0]))) {
            break;
          }
          sum++;
          if (d[0][0] === end[0] && d[0][1] === end[1]) {
            max = Math.max(max, sum);
            break;
          }
          visited.add(getKey(d[0]));
          // output[d[0][0]][d[0][1]] = 'O';
          loc = d[0];

          nextDirs = findNext(d[0], d[1]);
          continue;
        }
        if (nextDirs.length > 1) {
          const vt = Array.from(visited.values());
          for (const d of nextDirs) {
            const next = addCoords(loc, d);
            if (!visited.has(getKey(next))) {
              vt.push(getKey(next));

              q.push({ c: next, dir: d, sum: sum + 1, visited: vt });
            }
          }
          break;
        }
      }
    }
  }
  log(`longest ${max}`);
}

// doWork(test_input, false);
// doWork(test_input, true);
// doWork(puzzle_input, false); // part1
doWork(puzzle_input, true); // part2
