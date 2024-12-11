import { input } from './input';

const myStones = input.split(' ').map(Number);
const cache = new Map<string, number>();
function part1(stones: number[], totalIttr = 25) {
  let cacheHit = 0;

  function tick(stone: number, ittr: number): number {
    if (ittr === 0) {
      return 1;
    }
    const key = JSON.stringify({ stone, ittr });
    const value = cache.get(key);
    if (value != null) {
      cacheHit++;
      return value;
    }

    // If the stone is engraved with the number 0,
    // it is replaced by a stone engraved with the number 1.
    if (stone === 0) {
      const result = tick(1, ittr - 1);
      cache.set(key, result);
      return result;
    }
    // If the stone is engraved with a number that has an
    // even number of digits, it is replaced by two stones.
    // The left half of the digits are engraved on the new
    // left stone, and the right half of the digits are
    // engraved on the new right stone. (The new
    //   numbers don't keep extra leading zeroes: 1000
    //   would become stones 10 and 0.)

    const stoneStr = stone.toString();
    if (stoneStr.length % 2 === 0) {
      const mid = stoneStr.length / 2;
      const left = stoneStr.slice(0, mid);
      const right = stoneStr.slice(mid);
      const result =
        tick(Number(left), ittr - 1) + tick(Number(right), ittr - 1);
      cache.set(key, result);
      return result;
    }

    // If none of the other rules apply, the stone is
    // replaced by a new stone; the old stone's
    // number multiplied by 2024 is engraved on the new stone.

    const result = tick(stone * 2024, ittr - 1);
    cache.set(key, result);
    return result;
  }

  let result = 0;
  for (let s of stones) {
    result += tick(s, totalIttr);
  }

  console.log(cacheHit);
  return result;
}

// console.log(part1(myStones));
console.log(part1(myStones, 75));
