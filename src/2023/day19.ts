const test_input = `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`.split('\n');

const puzzle_input = `<get from aoc website>`.split('\n');

function log(u: unknown) {
  console.log(JSON.stringify(u, undefined, 2));
}

const fn: Array<(a: number, b: number) => boolean> = [
  (a: number, b: number) => a < b,
  (a: number, b: number) => a > b,
];

const fn2: Array<
  (
    a: [number, number],
    b: number,
  ) => { t?: [number, number]; f?: [number, number] }
> = [
  // <
  (a: [number, number], b: number) => {
    const [min, max] = a;
    // [min, max] < b
    if (max < b) {
      return { t: a };
    }
    // [min, [b], max]
    if (min < b && b < max) {
      return { t: [min, b - 1], f: [b, max] };
    }
    // b < [min, max ]
    return { f: a };
  },
  // >
  (a: [number, number], b: number) => {
    const [min, max] = a;
    //  [ min, max ] > b
    if (min > b) {
      return { t: a };
    } // max > min > b
    // max > b > min
    if (max > b && b > min) {
      return { t: [b + 1, max], f: [min, b] };
    }
    // b > max > min
    return { f: a };
  },
];

type Part = {
  x: number;
  m: number;
  a: number;
  s: number;
  [index: string]: number;
};
type Range = {
  x: [number, number];
  m: [number, number];
  a: [number, number];
  s: [number, number];
  [index: string]: [number, number];
};
type Check = {
  p: string;
  fn: (a: number) => boolean;
  fn2: (a: [number, number]) => { t?: [number, number]; f?: [number, number] };
  t: string;
  f?: string;
};

const isFunc = (s: string) => {
  return '<>'.indexOf(s[1]);
};

function parsePart(part: string): Part {
  const obj: Part = { x: 0, m: 0, a: 0, s: 0 };

  const props = part.slice(1, part.length - 1).split(',');
  for (const p of props) {
    const n = p.slice(0, 1);
    const v = p.slice(2);
    obj[n] = Number(v);
  }
  return obj;
}

function parseChecks(checkString: string): Array<Check> {
  const checks: Array<Check> = [];
  const t = checkString.split(',');

  // s>2770:qs,m<1801:hdj,R

  for (let i = 0; i < t.length - 1; i++) {
    let p = t[i]; // e.g. s>2770:qs
    const funcIdx = isFunc(p);
    if (funcIdx < 0) {
      throw new Error(`input ${checkString} idx ${i}`);
    }
    const colIdx = p.indexOf(':');
    const val = Number(p.slice(2, colIdx));
    const tr = p.substring(colIdx + 1);
    const fr = i + 1 === t.length - 1 ? t[i + 1] : undefined;
    const check: Check = {
      p: p.slice(0, 1),
      fn: (a: number) => fn[funcIdx](a, val),
      fn2: (a: [number, number]) => fn2[funcIdx](a, val),
      t: tr,
      f: fr,
    };

    checks.push(check);
  }

  return checks;
}

function processInput(input: string[]): [Map<string, Check[]>, Part[]] {
  let workflowDone = false;
  const workflows: Map<string, Check[]> = new Map();
  const parts: Array<Part> = [];

  input.forEach((r) => {
    if (r.length === 0) {
      workflowDone = true;
      return;
    }
    if (workflowDone) {
      const obj = parsePart(r);
      parts.push(obj);
    } else {
      const [name, rem] = r.split(/[}{]/);
      const checks: Array<Check> = parseChecks(rem);

      workflows.set(name, checks);
    }
  });

  return [workflows, parts];
}

function execWf(p: Part, wf: Check[]): string | undefined {
  let i = 0;
  while (i < wf.length) {
    const { p: prop, fn, t, f } = wf[i];
    if (fn(p[prop])) {
      return t;
    }
    if (f != null) {
      return f;
    }

    // next check
    i++;
  }

  return undefined;
}

function part1(input: string[]) {
  const [workflows, parts] = processInput(input);

  const results: number[] = parts.map((p) => {
    let wf = workflows.get('in');

    while (wf != null) {
      const result = execWf(p, wf);
      if (result === 'A') {
        return p.x + p.m + p.a + p.s;
      }
      if (result === 'R') {
        return 0;
      }
      if (result == null) {
        break;
      }
      wf = workflows.get(result);
    }

    throw new Error(`no result ${p}`);
  });

  log(results.reduce((a, c) => a + c));
}

function multiply(r: Range): number {
  return (
    (r.x[1] - r.x[0] + 1) *
    (r.m[1] - r.m[0] + 1) *
    (r.a[1] - r.a[0] + 1) *
    (r.s[1] - r.s[0] + 1)
  );
}

function part2(input: string[]) {
  const [workflows, parts] = processInput(input);
  let finalCnt = 0;

  const q: [Range, string][] = [
    [{ x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] }, 'in'],
  ];

  while (q.length > 0) {
    const next = q.pop();
    if (next == null) {
      throw new Error('null in queue');
    }
    let [range, wfName] = next;
    let wf = workflows.get(wfName);
    if (wf == null) {
      throw new Error('empty wf');
    }
    let i = 0;
    while (i < wf.length) {
      const { p: prop, fn2, t, f } = wf[i];
      const result = fn2(range[prop]);

      if (result.t != null) {
        const nr = { ...range };
        nr[prop] = result.t;

        if (t === 'A') {
          finalCnt += multiply(nr);
        } else if (t !== 'R' && t != null) {
          q.push([nr, t]);
        }
      }
      if (result.f != null) {
        const nr = { ...range };
        nr[prop] = result.f;
        if (f == null) {
          i++;
          range = nr;
          continue;
        } else if (f === 'A') {
          finalCnt += multiply(nr);
        } else if (f !== 'R' && f != null) {
          q.push([nr, f]);
        }
      }
      break;
    }
  }
  log(finalCnt);
}

// part1(puzzle_input);

part2(puzzle_input);
