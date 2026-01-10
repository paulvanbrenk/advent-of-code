import { createHash } from 'crypto';
import { input } from './input';

const secretKey = input.trim();

function findHashWithPrefix(prefix: string): number {
  let num = 0;
  while (true) {
    num++;
    const hash = createHash('md5')
      .update(secretKey + num)
      .digest('hex');
    if (hash.startsWith(prefix)) {
      return num;
    }
  }
}

function part1(): number {
  return findHashWithPrefix('00000');
}

function part2(): number {
  return findHashWithPrefix('000000');
}

console.log(part1());
console.log(part2());
