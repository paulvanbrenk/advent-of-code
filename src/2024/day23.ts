import { input } from './input';

const myLinkList = input.split('\n');

const myLinks: Map<string, Set<string>> = new Map();

for (let l of myLinkList) {
  const left = l.substring(0, 2);
  const right = l.substring(3);

  const ln = myLinks.get(left) ?? new Set();
  ln.add(right);

  myLinks.set(left, ln);

  const rn = myLinks.get(right) ?? new Set();
  rn.add(left);

  myLinks.set(right, rn);
}

function union<T>(left: Set<T>, right: Set<T>): Set<T> {
  const retVal = new Set<T>();

  if (left.size <= right.size) {
    for (let [entry] of left.entries()) {
      if (right.has(entry)) {
        retVal.add(entry);
      }
    }
  }

  if (left.size > right.size) {
    for (let [entry] of right.entries()) {
      if (left.has(entry)) {
        retVal.add(entry);
      }
    }
  }

  return retVal;
}

function hash(sa: string[]): string {
  sa.sort();
  return sa.join(',');
}

function part1(links: Map<string, Set<string>>) {
  const set = new Set<string>();

  for (let [node, neighSet] of links.entries()) {
    if (!node.startsWith('t')) {
      continue;
    }
    const neigh = Array.from(neighSet);
    for (let i = 0; i < neigh.length; i++) {
      const node2 = neigh[i];
      const cand = links.get(node2) ?? new Set();
      neighSet.delete(node2);
      const unionSet = union(neighSet, cand);
      for (let [node3] of unionSet.entries()) {
        const key = hash([node, node2, node3]);
        set.add(key);
      }
    }
  }

  return set.size;
}

function part2(links: Map<string, Set<string>>) {
  const set = new Set<string>();

  for (let [node, neighSet] of links.entries()) {
    if (!node.startsWith('t')) {
      continue;
    }

    const neigh = Array.from(neighSet);
    for (let i = 0; i < neigh.length; i++) {
      const node2 = neigh[i];
      const clique = [node, node2];

      const cand = links.get(node2) ?? new Set();
      neighSet.delete(node2);
      let unionSet = union(neighSet, cand);
      for (let j = i; j < neigh.length; j++) {
        const node3 = neigh[j];
        if (!unionSet.has(node3)) {
          continue;
        }
        clique.push(node3);
        const key = hash(clique);
        if (set.has(key)) {
          continue;
        }
        set.add(key);
        unionSet = union(unionSet, links.get(node3) ?? new Set());
      }
    }
  }

  let maxLength = 0;
  let password = '';
  for (let [entry] of set.entries()) {
    if (entry.length > maxLength) {
      maxLength = entry.length;
      password = entry;
    }
  }
  return password;
}

console.log(part1(structuredClone(myLinks)));
console.log(part2(structuredClone(myLinks)));
