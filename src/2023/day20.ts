import { describe } from 'node:test';

function log(u: unknown) {
  console.log(JSON.stringify(u, undefined, 2));
}

function lcm(arr: number[]): number {
  return arr.reduce((acc, n) => (acc * n) / gcd(acc, n));
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

const test_input1 = `broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`.split('\n');

const test_input2 = `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`.split('\n');

const puzzle_input = `<get from aoc website>`.split('\n');

type NodeType = 'Broadcaster' | 'FlipFlop' | 'Conjunction' | 'Output';

type Pulse = { source: string; value: 'h' | 'l' };

interface NodeBase {
  name: string;
  type: NodeType;
  destinations: string[];
}

interface Broadcaster extends NodeBase {
  type: 'Broadcaster';
}

interface Output extends NodeBase {
  type: 'Output';
}

interface FlipFLop extends NodeBase {
  type: 'FlipFlop';
  state?: boolean;
}

interface Conjunction extends NodeBase {
  type: 'Conjunction';
  inputs?: Map<string, 'l' | 'h'>;
}

type Node = FlipFLop | Conjunction | Broadcaster | Output;

const rsSources = new Map<string, number>();
let rsSourcesCnt = 0;

function getDestinations(
  node: Node,
  pulse: Pulse,
  cnt: number,
): [string, Pulse][] | null {
  switch (node.type) {
    // Flip - flop modules(prefix %) are either on or off; they are initially off.
    // If a flip - flop module receives a high pulse, it is ignored and nothing happens.
    // However, if a flip - flop module receives a low pulse, it flips between on and off.
    // If it was off, it turns on and sends a high pulse.
    // If it was on, it turns off and sends a low pulse.
    case 'FlipFlop': {
      if (pulse.value === 'l') {
        const response = node.state ? 'l' : 'h';
        node.state = !node.state;
        return node.destinations.map((d) => [
          d,
          { source: node.name, value: response },
        ]);
      }
      return [];
    }

    // Conjunction modules(prefix &) remember the type of the most recent pulse received from each of their connected input modules;
    // they initially default to remembering a low pulse for each input.When a pulse is received,
    // the conjunction module first updates its memory for that input.
    // Then, if it remembers high pulses for all inputs, it sends a low pulse; otherwise, it sends a high pulse.
    case 'Conjunction': {
      // rx has 1 input Conjunction 'rs' which has 4 different inputs
      // so keep track when they hit 'h' for the first time,
      // and hope the cycle starts at the first button press
      if (node.name === 'rs' && pulse.value === 'h') {
        log(`${pulse.source} @ ${cnt}`);
        if (!rsSources.has(pulse.source)) {
          rsSources.set(pulse.source, cnt);
          rsSourcesCnt++;
        }
        if (rsSourcesCnt === 4) {
          const values = Array.from(rsSources.values());
          log({ values });
          log(lcm(values));
          return null;
        }
      }

      node.inputs?.set(pulse.source, pulse.value);

      let allHigh = false;
      for (let s of node.inputs ?? []) {
        if (s[1] === 'l') {
          allHigh = false;
          break;
        }
        allHigh = true;
      }

      return node.destinations.map((d) => [
        d,
        { source: node.name, value: allHigh ? 'l' : 'h' },
      ]);
    }

    case 'Broadcaster': {
      const response = { source: node.name, value: pulse.value };
      return node.destinations.map((d) => [d, response]);
    }
    case 'Output': {
      return [];
    }
  }
}

function getNameType(s: string): [string, NodeType] {
  const t = s.trim();
  if (t === 'broadcaster') {
    return ['broadcaster', 'Broadcaster'];
  }
  if (t === 'output') {
    return ['output', 'Output'];
  }

  if (t[0] === '%') {
    return [t.slice(1), 'FlipFlop'];
  }
  if (t[0] === '&') {
    return [t.slice(1), 'Conjunction'];
  }

  log(`invalid ${s}`);
  throw new Error();
}

function nodeFactory(
  line: string,
  nodes: Map<string, Node>,
  inputs: Map<string, string[]>,
): void {
  const [n, d] = line.split('->');
  const [name, type] = getNameType(n);
  const destinations = d.split(',').map((s) => s.trim());

  destinations.forEach((d) => {
    const i = inputs.get(d) ?? [];
    i.push(name);
    inputs.set(d, i);
  });

  nodes.set(name, {
    name,
    type,
    destinations,
  });
}

function part1(input: readonly string[], max = 1000) {
  const nodes: Map<string, Node> = new Map();
  const inputs: Map<string, string[]> = new Map();

  const getNode: (s: string) => Node | undefined = (s: string) => {
    const n = nodes.get(s);
    return n;
  };

  // add output node, since it's only a destination
  nodes.set('output', { name: 'output', type: 'Output', destinations: [] });
  nodes.set('rx', { name: 'rx', type: 'Output', destinations: [] });

  input.forEach((i) => nodeFactory(i, nodes, inputs));

  for (const [name, sources] of inputs) {
    const n = getNode(name);
    if (n != null && n.type === 'Conjunction') {
      n.inputs = new Map(sources.map((s) => [s, 'l']));
    }
  }

  const pulsesInSystem: [string, Pulse][] = [];

  let lowCnt = 0;
  let highCnt = 0;

  for (let i = 0; i < max; i++) {
    lowCnt += 1; // push the button
    pulsesInSystem.push(['broadcaster', { source: 'button', value: 'l' }]);

    while (pulsesInSystem.length > 0) {
      const c = pulsesInSystem.splice(0, 1)[0];
      if (c == null) {
        break;
      }

      // log(`#${lowCnt + highCnt} ${c[1].source}:${c[1].value}>>${c[0]}`);
      const node = getNode(c[0]);
      if (node == null) {
        throw new Error(c[0]);
      }
      const destinations = getDestinations(node, c[1], i + 1);
      if (destinations === null) {
        // short cut for part 2
        return;
      }
      for (let d of destinations) {
        d[1].value === 'l' ? lowCnt++ : highCnt++;
        pulsesInSystem.push([d[0], d[1]]);
      }
    }
  }

  log({ lowCnt, highCnt, multiple: lowCnt * highCnt });
}

// part1(test_input1);
// part1(test_input2);
part1(puzzle_input); // part 1
part1(puzzle_input, Number.MAX_SAFE_INTEGER); // part 2
