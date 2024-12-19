import { input } from './input';

const [myTowelsStr, myPatternsStr] = input.split('\n\n');

const myTowels = myTowelsStr.split(',').map((t) => t.trim());
const myPatterns = myPatternsStr.split('\n');

const cache: Map<string, number> = new Map();

function matchPatterns(towels: string[], patterns: string[]) {
  const towelSet = new Set(towels);

  function isMatch(pattern: string): number {
    if (pattern.length === 0) {
      return 1;
    }

    if (cache.has(pattern)) {
      return cache.get(pattern)!;
    }

    let cnt = 0;
    for (let i = 1; i <= pattern.length; i++) {
      const part = pattern.substring(0, i);
      if (towelSet.has(part)) {
        cnt += isMatch(pattern.slice(i));
      }
    }
    cache.set(pattern, cnt);
    return cnt;
  }

  const part1 = patterns.reduce((a, c) => {
    return isMatch(c) > 0 ? a + 1 : a;
  }, 0);

  const part2 = patterns.reduce((a, c) => {
    return a + isMatch(c);
  }, 0);

  return JSON.stringify({ part1, part2 });
}

console.log(matchPatterns(myTowels, myPatterns));
