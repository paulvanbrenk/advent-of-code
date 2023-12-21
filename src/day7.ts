const puzzle_input = `<get from aoc website>`.split("\n");

const test_input = `2345A 1
Q2KJJ 13
Q2Q2Q 19
T3T3J 17
T3Q33 11
2345J 3
J345A 2
32T3K 5
T55J5 29
KK677 7
KTJJT 34
QQQJA 31
JJJJJ 37
JAAAA 43
AAAAJ 59
AAAAA 61
2AAAA 23
2JJJJ 53
JJJJ2 41`.split("\n");

const test_input2 = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`.split("\n");

function log(u: unknown) {
  console.log(JSON.stringify(u, null, "  "));
}

const enum Kind {
  "todo" = -2,
  "error" = -1,
  "five",
  "four",
  "full",
  "three",
  "two-pair",
  "pair",
  "high",
}

type Hand = {
  cards: string;
  value: number;
  kind: Kind;
};

function part1(input: string[]) {
  const valuemap = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "T",
    "J",
    "Q",
    "K",
    "A",
  ];

  const mapped: Hand[] = input
    .map((c) => {
      let bucket: Map<string, number> = new Map();

      const [cards, value] = c.split(" ");
      let kind: Kind = Kind.error;

      for (let c of cards.trim()) {
        let cnt = bucket.get(c) ?? 0;
        bucket.set(c, cnt + 1);
      }

      switch (bucket.size) {
        case 1: {
          kind = Kind.five;
          break;
        }
        case 2: {
          for (const b of bucket) {
            if (b[1] === 4 || b[1] === 1) {
              kind = Kind.four;
              break;
            }
            if (b[1] === 3 || b[1] === 2) {
              kind = Kind.full;
              break;
            }
          }
          break;
        }
        case 3: {
          for (const b of bucket) {
            if (b[1] === 3) {
              kind = Kind.three;
              break;
            }
            if (b[1] === 2) {
              kind = Kind["two-pair"];
              break;
            }
          }
          break;
        }
        case 4: {
          kind = Kind.pair;
          break;
        }
        case 5: {
          kind = Kind.high;
          break;
        }
        default: {
          log(bucket.size);
          throw new Error();
        }
      }

      return {
        cards,
        value: Number(value),
        kind,
      };
    })
    .sort((a, b) => {
      if (a.kind != b.kind) {
        return b.kind - a.kind;
      }

      for (let i = 0; i < a.cards.length; i++) {
        const l = a.cards[i];
        const r = b.cards[i];
        if (l !== r) {
          return valuemap.indexOf(l) - valuemap.indexOf(r);
        }
      }
      return 0;
    });

  const result = mapped.reduce((a, c, i) => a + c.value * (i + 1), 0);

  log(result);
}

function part2(input: string[]) {
  const valuemap = [
    "J",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "T",
    "Q",
    "K",
    "A",
  ];

  const mapped: Hand[] = input
    .map((c) => {
      let bucket: Map<string, number> = new Map();

      const [cards, value] = c.split(" ");
      let kind: Kind = Kind.error;

      for (let c of cards.trim()) {
        let cnt = bucket.get(c) ?? 0;
        bucket.set(c, cnt + 1);
      }

      switch (bucket.size) {
        case 1: {
          kind = Kind.five;
          break;
        }
        case 2: {
          // check Joker
          if (bucket.has("J")) {
            // either JJJJx or JJJxx, which can become 5 of a kind
            kind = Kind.five;
            break;
          }
          for (const b of bucket) {
            if (b[1] === 4 || b[1] === 1) {
              kind = Kind.four;
              break;
            }
            if (b[1] === 3 || b[1] === 2) {
              kind = Kind.full;
              break;
            }
          }
          break;
        }
        case 3: {
          const j = bucket.get("J");
          if (j != null) {
            if (j === 2 || j === 3) {
              // JJxxz || JJJxz
              kind = Kind.four;
              break;
            }
            if (j === 1) {
              for (const b of bucket) {
                if (b[1] === 2) {
                  kind = Kind.full;
                  break;
                }
                if (b[1] === 3) {
                  kind = Kind.four;
                  break;
                }
              }
              break;
            }
          }
          for (const b of bucket) {
            if (b[1] === 3) {
              kind = Kind.three;
              break;
            }
            if (b[1] === 2) {
              kind = Kind["two-pair"];
              break;
            }
          }
          break;
        }
        case 4: {
          if (bucket.has("J")) {
            kind = Kind.three;
          } else {
            kind = Kind.pair;
          }
          break;
        }
        case 5: {
          // only one of the 5 can be a "J"
          if (bucket.has("J")) {
            kind = Kind.pair;
          } else {
            kind = Kind.high;
          }
          break;
        }
        default: {
          log(bucket.size);
          throw new Error();
        }
      }

      return {
        cards,
        value: Number(value),
        kind,
      };
    })
    .sort((a, b) => {
      if (a.kind != b.kind) {
        return b.kind - a.kind;
      }

      for (let i = 0; i < a.cards.length; i++) {
        const l = a.cards[i];
        const r = b.cards[i];
        if (l !== r) {
          return valuemap.indexOf(l) - valuemap.indexOf(r);
        }
      }
      return 0;
    });
  const result = mapped.reduce((a, c, i) => a + c.value * (i + 1), 0);

  log(result);
}

part2(puzzle_input);
