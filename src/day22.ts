function log(u: unknown) {
  console.log(JSON.stringify(u, undefined, 2));
}

type Coords = [x: number, y: number, z: number];
type Brick = [Coords, Coords, id: string];

const test_input = `1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`.split('\n');

const puzzle_input = `<get from aoc>`.split('\n');

function parseInput(input: string[]): Array<Brick> {
  const S2C: (s: string) => Coords = (s) => s.split(',').map(Number) as Coords;
  const S2B: (s: string) => Brick = (s) => {
    const brick = s
      .split('~')
      .map(S2C)
      .sort((l, r) => l[2] - r[2]);
    return [...brick, s.trim()] as Brick;
  };

  return input.map(S2B).sort((l, r) => l[0][2] - r[0][2]);
}

function doWork(input: string[]) {
  const printBricks = (b: Brick[]) => {
    log(b.map((r) => `[${r[2]}]`));
  };

  const sortedBricks = parseInput(input);

  const layers: Brick[][][] = [];

  type Node = {
    self: string;
    supports: Set<string>;
    supportedBy: Set<string>;
  };

  const nodes: Map<string, Node> = new Map();
  const getNode = (s: string) => {
    let node = nodes.get(s);
    if (node == null) {
      node = { self: s, supports: new Set(), supportedBy: new Set() };
      nodes.set(s, node);
    }
    return node;
  };

  const graph: Node = getNode('ground');

  const printGraph = () => {
    for (const n of nodes) {
      let supports = '';
      n[1].supports.forEach((v) => (supports += v + ','));
    }
  };

  // settle bricks

  const intersect = (b: Brick, lower: number) => {
    const node = getNode(b[2]);

    const z = b[0][2] - lower;
    if (z - 1 === 0) {
      // z is ground
      const g = getNode('ground');
      g.supports.add(node.self);
      node.supportedBy.add(g.self);
      return true;
    }
    if (z - 1 < 0) {
      throw new Error('subterean');
    }

    // this works since only 1 direction changes
    const [xS, xE] =
      b[0][0] < b[1][0] ? [b[0][0], b[1][0]] : [b[1][0], b[0][0]];
    const [yS, yE] =
      b[0][1] < b[1][1] ? [b[0][1], b[1][1]] : [b[1][1], b[0][1]];

    let found = false;
    for (let i = xS; i <= xE; i++) {
      for (let j = yS; j <= yE; j++) {
        const bId = layers[i]?.[j]?.[z - 1]?.[2];
        if (bId != null && bId !== node.self) {
          const baseNode = getNode(bId);
          baseNode.supports.add(node.self);
          node.supportedBy.add(bId);

          found = true;
        }
      }
    }
    return found;
  };

  for (let b of sortedBricks) {
    let down = 0;
    while (intersect(b, down) == false) {
      down++;
    }

    b[0][2] = b[0][2] - down;
    b[1][2] = b[1][2] - down;

    // this works since only 1 direction changes
    const [xS, xE] =
      b[0][0] < b[1][0] ? [b[0][0], b[1][0]] : [b[1][0], b[0][0]];
    const [yS, yE] =
      b[0][1] < b[1][1] ? [b[0][1], b[1][1]] : [b[1][1], b[0][1]];
    const [zS, zE] =
      b[0][2] < b[1][2] ? [b[0][2], b[1][2]] : [b[1][2], b[0][2]];

    for (let i = xS; i <= xE; i++) {
      for (let j = yS; j <= yE; j++) {
        for (let k = zS; k <= zE; k++) {
          if (layers[i] == null) {
            layers[i] = [];
          }
          if (layers[i][j] == null) {
            layers[i][j] = [];
          }
          layers[i][j][k] = b;
        }
      }
    }
  }

  // part 1 count bricks that support nothing
  // or bricks with > 1 support

  let sum = 0;
  for (const item of nodes) {
    const [_, node] = item;

    if (node.supports.size == 0) {
      sum += 1;
      continue;
    }
    let canRemove = true;
    for (const sup of node.supports) {
      const child = getNode(sup);
      if (child == null) {
        throw new Error('new node');
      }
      if (child.supportedBy.size == 1) {
        canRemove = false;
      }
    }
    sum += canRemove ? 1 : 0;
  }

  log(`part1 ${sum}`);

  // for each node track which other nodes will fall
  let sum2 = 0;

  for (const brick of sortedBricks) {
    let subSum = 0;
    const current = getNode(brick[2]);
    const q: string[] = Array.from(current.supports);
    let destroyed: string[] = [brick[2]];
    const visited = new Set<string>();
    // log(`BRICK ${b[2]} supports ${JSON.stringify(q)}`);
    while (q.length > 0) {
      const cId = q.splice(0, 1)[0];
      if (cId == null || destroyed.includes(cId)) {
        // alread gone
        continue;
      }
      const cNode = getNode(cId);
      // ensure all supports are gone
      const cBase = Array.from(cNode.supportedBy);

      const cnt = cBase.filter((b) => !destroyed.includes(b)).length;
      if (cnt === 0) {
        // destroyed so all children are candidates
        cNode.supports.forEach((c) => q.push(c));

        destroyed.push(cId);
        subSum++;
      }
    }
    sum2 += subSum; // exclude source brick
  }

  log(`part2 ${sum2}`);
}

doWork(test_input);
doWork(puzzle_input);
