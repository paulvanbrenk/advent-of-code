import { input } from './input';

const myMap = input.split('').map(Number);

function part1(diskMap: number[]) {
  const map = structuredClone(diskMap);
  let result: bigint = 0n;

  let i = 0;
  let j = map.length - 1;

  let check: string = '';
  let diskIdx = 0;

  while (i <= j) {
    const isFile = i % 2 === 0;

    if (map[i] === 0) {
      // move to next block
      i++;
      continue;
    }
    if (map[j] === 0) {
      j -= 2;
      continue;
    }

    if (isFile) {
      const fileId = i / 2;
      result += BigInt(diskIdx * fileId);
      check += fileId;
    }

    if (!isFile) {
      const fileId = j / 2;
      result += BigInt(diskIdx * fileId);
      check += fileId;
      map[j]--;
    }
    diskIdx++;
    map[i]--;
  }
  // console.log(check);
  return result;
}

function part2(diskMap: number[]) {
  const map: [number, number][] = diskMap
    .map<[number, number] | undefined>((c, i) => {
      if (i % 2 === 0) {
        // file
        const fileId = i / 2;
        return [fileId, c];
      }
      if (c === 0) {
        return undefined;
      }
      return [-1, c];
    })
    .filter((i) => i != null);

  let j = map.length - 1;

  while (j > 0) {
    const [id, size] = map[j];
    if (id === -1) {
      j--;
      continue;
    }
    let i = 1;
    while (i < j) {
      const [id2, space] = map[i];
      if (space < size || id2 !== -1) {
        i++;
        continue;
      }
      if (space === size) {
        map[i] = [id, space];
        map[j] = [-1, size];
        j--;
        break;
      }
      if (space > size) {
        // no need to concat, we don't move things to the end of the disk
        map[j] = [-1, size];
        map.splice(i, 1, [id, size], [-1, space - size]);
        // we add a new entry so we don't need to move the j pointer
        break;
      }
    }
    if (i >= j) {
      j--;
    }
  }

  let result: bigint = 0n;

  let check = '';
  let diskIdx = 0;
  for (let [id, size] of map) {
    check += (id > -1 ? id : '.').toString().repeat(size);

    for (let i = 0; i < size; i++) {
      if (id > 0) {
        result += BigInt(id * diskIdx);
      }
      diskIdx++;
    }
  }
  // console.log(check);

  return result;
}

console.log(part1(myMap));
console.log(part2(myMap));
