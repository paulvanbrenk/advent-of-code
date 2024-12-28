import { input } from './input';

const lines = input.split('\n');

type Node = {
  left: string;
  operation: 'OR' | 'AND' | 'XOR';
  right: string;
  output: string;
};

const myWires = new Map<string, 1 | 0>();
const myNodes: Array<Node> = [];

for (let l of lines) {
  if (l.includes(':')) {
    const [w, val] = l.split(':');
    myWires.set(w, val.trim() === '0' ? 0 : 1);
    continue;
  }

  const m = l.match(/(\w{3}) (AND|XOR|OR) (\w{3}) \-\> (\w{3})/m);
  if (m == null) {
    continue;
  }

  const node = {
    left: m[1],
    operation: m[2],
    right: m[3],
    output: m[4],
  } as Node;
  myNodes.push(node);
}

function part1(nodes: Array<Node>, wires: Map<string, 1 | 0>, check = false) {
  let mem;
  if (check) {
    mem = new Map();
    for (let e of wires.keys()) {
      mem.set(e, e.startsWith('x') ? 1 : 0);
    }
  } else {
    mem = new Map(wires);
  }

  const q = structuredClone(nodes);
  while (q.length > 0) {
    const n = q.shift()!;
    const l = mem.get(n.left);
    const r = mem.get(n.right);

    if (l != null && r != null) {
      let o = -1;
      switch (n.operation) {
        case 'AND':
          o = l & r;
          break;
        case 'OR':
          o = l | r;
          break;
        case 'XOR':
          o = l ^ r;
          break;
      }
      mem.set(n.output, o as 0 | 1);
    } else {
      q.push(n);
    }
  }

  const result: number[] = [];

  for (let [e, v] of mem.entries()) {
    if (e.startsWith('z')) {
      const idx = Number(e.substring(1));
      result[idx] = v;
    }
  }

  const binStr = result.reverse().join('');
  console.log(binStr);
  return Number.parseInt(binStr, 2);
}

function part2(nodes: Array<Node>, wires: Map<string, 1 | 0>) {
  const mem = new Map<string, string>();
  for (let [e] of wires) {
    mem.set(e, e);
  }

  const q = structuredClone(nodes);
  while (q.length > 0) {
    const n = q.shift()!;
    const l = mem.get(n.left);
    const r = mem.get(n.right);

    if (l != null && r != null) {
      if (l === 'oAND_21' || r === 'oAND_21') {
        console.log(
          `${[n.left, l]} ${n.operation} ${[n.right, r]} ${n.output}`,
        );
      }
      const l_idx = l.substring(l.length - 2);
      const r_idx = r.substring(r.length - 2);
      const l_lbl = l.substring(0, l.length - 2);
      const r_lbl = r.substring(0, r.length - 2);

      let o = '';
      switch (n.operation) {
        case 'AND':
          if (
            (l_lbl === 'x' && r_lbl === 'y') ||
            (l_lbl === 'y' && r_lbl === 'x')
          ) {
            o = 'oAND_' + l_idx;
          } else if (
            (l_lbl === 'oXOR_' && r_lbl === 'c_') ||
            (l_lbl === 'c_' && r_lbl === 'oXOR_')
          ) {
            o = 'oAND_' + l_idx;
          } else {
            console.log(
              `unexpected input: ${[n.left, l]} ${n.operation} ${[n.right, r]} ${n.output}`,
            );
          }
          o = 'oAND_' + l_idx;
          break;
        case 'OR':
          if (!l_lbl.startsWith('oAND') || !r_lbl.startsWith('oAND')) {
            console.log(
              `unexpected input: ${[n.left, l]} ${n.operation} ${[n.right, r]} ${n.output}`,
            );
          }
          o = 'c_' + l_idx;
          break;
        case 'XOR':
          // expected x and y
          if (
            (l_lbl === 'x' && r_lbl === 'y') ||
            (l_lbl === 'y' && r_lbl === 'x')
          ) {
            if (l_idx != r_idx) {
              throw new Error(`mismatch x ${l} and y ${r}`);
            }
            o = 'oXOR_' + l_idx;
          } else if (
            (l_lbl === 'oXOR_' && r_lbl === 'c_') ||
            (l_lbl === 'c_' && r_lbl === 'oXOR_')
          ) {
            o = 'SUM_' + l_idx;
          } else {
            console.log(
              `unexpected input: ${[n.left, l]} ${n.operation} ${[n.right, r]} ${n.output}`,
            );
            o = 'SUM_' + l_idx;
          }
          break;
      }
      mem.set(n.output, o);
    } else {
      q.push(n);
    }
  }

  for (let [w, val] of Array.from(mem.entries()).sort()) {
    if (w.startsWith('z')) {
      console.log([w, val]);
    }
  }
}

console.log(part1(myNodes, myWires));
console.log(part1(myNodes, myWires, true));
console.log(part2(myNodes, myWires));
