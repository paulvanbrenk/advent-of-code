import { input } from './input';

const mySecrets = input.split('\n').map(BigInt);

const cache = new Map<bigint, bigint>();

function hash(secret: bigint) {
  const result = cache.get(secret);
  if (result != null) {
    return result;
  }
  const input = secret;
  // step 1
  let a = secret * 64n;

  secret = secret ^ a;

  secret = secret % 16777216n;

  // step 2
  let b = secret / 32n;

  secret = secret ^ b;

  secret = secret % 16777216n;

  // step 3

  let c = secret * 2048n;

  secret = secret ^ c;

  secret = secret % 16777216n;

  cache.set(input, secret);
  return secret;
}

function part1(secrest: bigint[]) {
  return secrest.reduce((a, c) => {
    for (let i = 0; i < 2000; i++) {
      c = hash(c);
    }
    return a + c;
  }, 0n);
}

function part2(secrest: bigint[]) {
  let result = 0n;

  const seqCnt = new Map<string, number>();

  for (let c of secrest) {
    // track sequences while generating
    const seqTrack = new Set<string>();

    let lastPrice = c;
    let sequence = [];
    for (let i = 0; i <= 2000; i++) {
      c = hash(c);
      const price = c % 10n;
      const diff = price - lastPrice;
      lastPrice = price;
      sequence.push(diff);
      if (sequence.length > 4) {
        sequence.shift();
      }
      if (sequence.length === 4) {
        const key = sequence.join(',');
        if (!seqTrack.has(key)) {
          seqTrack.add(key);
          const cnt = (seqCnt.get(key) ?? 0) + Number(price);
          seqCnt.set(key, cnt);
        }
      }
    }
  }

  let maxVal = 0;
  for (let v of seqCnt.values()) {
    maxVal = Math.max(maxVal, v);
  }
  return maxVal;
}

console.log(part1(mySecrets));
console.log(part2(mySecrets));
