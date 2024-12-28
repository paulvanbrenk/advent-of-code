import { input } from './input';

const groups = input.split('\n\n').map((lk) => lk.split('\n'));

let isLock: boolean = false;

const myLocks: number[][] = [];
const myKeys: number[][] = [];

for (let g of groups) {
  isLock = g[0] === '#####';
  const rows = g.length;
  const cols = g[0].length;
  const map: number[] = new Array(cols).fill(0);

  for (let j = 0; j < cols; j++) {
    for (let i = 0; i < rows; i++) {
      if (isLock && g[i][j] === '#') {
        map[j] = i;
      }
      if (!isLock && g[i][j] === '.') {
        map[j] = i;
      }
    }
  }
  isLock ? myLocks.push(map) : myKeys.push(map);
}

function part1(keys: number[][], locks: number[][]) {
  let cnt = 0;

  let fit = true;
  for (let key of keys) {
    for (let lock of locks) {
      fit = true;
      for (let i = 0; i < lock.length; i++) {
        if (key[i] < lock[i]) {
          fit = false;
          break;
        }
      }
      cnt += fit ? 1 : 0;
    }
  }

  return cnt;
}

console.log(part1(structuredClone(myKeys), structuredClone(myLocks)));
