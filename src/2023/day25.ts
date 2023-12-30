const puzzle_input = `<get from AoC>`.split('\n');

function log(u: unknown) {
  console.log(JSON.stringify(u, undefined, 2));
}

function part1(input: string[]) {
  const edges: [number, number][] = [];
  const vToId: Map<string, number> = new Map();

  for (let line of input) {
    let [v1, v2s] = line.split(': ');

    if (!vToId.has(v1)) {
      vToId.set(v1, vToId.size);
    }

    for (let v2 of v2s.split(' ')) {
      if (!vToId.has(v2)) {
        vToId.set(v2, vToId.size);
      }

      edges.push([vToId.get(v1)!, vToId.get(v2)!]);
    }
  }

  while (true) {
    let groups = unionFind(vToId.size, edges, 3);

    if (groups != null) {
      let group1Count = groups.filter((x) => x === groups?.[0]).length;
      log(group1Count * (vToId.size - group1Count));
      break;
    }
  }
}

function unionFind(
  vertexCount: number,
  edges: [number, number][],
  desiredCuts: number,
) {
  //shuffle
  for (let i = 0; i < edges.length; ++i) {
    let idx = Math.floor(Math.random() * i + 1);
    [edges[i], edges[idx]] = [edges[idx], edges[i]];
  }

  let groupParents = [-1];
  let vertexGroups = new Uint16Array(vertexCount);
  let groupPromotions = [-1];

  function union(v1: number, v2: number) {
    if (!vertexGroups[v1] && !vertexGroups[v2]) {
      let group = groupParents.length;
      groupParents.push(group);
      groupPromotions.push(1);
      vertexGroups[v1] = group;
      vertexGroups[v2] = group;
    } else if (!vertexGroups[v1]) {
      let g = (vertexGroups[v2] = parent(v2));
      ++groupPromotions[g];
      vertexGroups[v1] = g;
    } else if (!vertexGroups[v2]) {
      let g = (vertexGroups[v1] = parent(v1));
      ++groupPromotions[g];
      vertexGroups[v2] = g;
    } else {
      let g1 = parent(v1);
      let g2 = parent(v2);

      if (g1 !== g2) {
        if (groupPromotions[g1] > groupPromotions[g2]) {
          [g2, g1] = [g1, g2];
        }

        groupPromotions[g2] += groupPromotions[g1] + 1;

        groupParents[g1] = g2;

        vertexGroups[v1] = g2;
        vertexGroups[v2] = g2;
      } else {
        return false;
      }
    }

    return true;
  }

  function parent(v: number) {
    if (vertexGroups[v] === 0) {
      return -1;
    }

    let group = vertexGroups[v];
    while (group !== groupParents[group]) {
      group = groupParents[group];
    }

    return group;
  }

  let edgeIdx = 0;
  while (vertexCount > 2) {
    let [v1, v2] = edges[edgeIdx++];

    if (union(v1, v2)) {
      --vertexCount;
    }
  }

  let removedEdges = 0;
  for (let [v1, v2] of edges) {
    if ((vertexGroups[v1] = parent(v1)) !== (vertexGroups[v2] = parent(v2))) {
      ++removedEdges;
    }
  }

  if (removedEdges === desiredCuts) {
    return vertexGroups;
  }

  return null;
}

part1(puzzle_input);
