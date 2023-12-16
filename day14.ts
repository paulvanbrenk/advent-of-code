const test_input =
    `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`.split('\n').map(r => r.split(''));

const puzzle_input =
    `#.O.O......##.......O.#O....O....O.O...O..O..##O#..O..#...##...........#..O..OO.O#O...OO.O..#...#..#
......O.#...#..O.O.....#O...#..OO.O.........O..O.#..O.#.O...O.##......O..O.#....#......O....O....O#O
...#...O..O..#.O...O##.O....##.....OOO#....#.O..O#O.OOO.........O....#.O...O.O...O...#.#..O..#.O.#.#
#...##...O.OO....OO.#..O#...O..#O.O...O.......#.##.###....O..O.O.#.#O........OO..##.................
...#O....#.O.....O.O..O.#.......#.#.#O....O....OOO.#.....O.#...#...O..##..##O.#O....O.#O.#O..#..O.OO
...O....O..#.....O..O..O#.O...O..#..OO###.O.....#.OO....O#......O#..........#....#.O#.O.O.#.....O.O.
....O...#..O.........O...OO#O......OOO..#..O....#..#...O...O..#...O.O..#O...#O.O...O..###..#.O.#....
...O.#O.#..##O.O.#...O...#....O..#.####....OO.#.#...........O.O...#..........O..O#.O..O....#.......#
........O.........O....OO...........##...O.#.OO.....#....#.O###.......O#O..#.#.O#..#....O..#......O.
O..#....O#O.#..O...............#..#..........OO#.#.#.#...#..#..O.#...#......O..#...O...O..O.......O.
OO#.O##OO......O.#..#O....O#......O..O...O...OO...#...........O...#......O....O.OOO#..#.....O.OO..O.
O.#.OO...#..#..O...#....#..O.O....O.OOO..O....#...O....O.O....O.O#........#.##.......O..O#.O....#...
......O..O..O..###.#..O..#...#..#.##O.#O.OO...O.O..#OO...O...O.#O..O..#....#O....OO#.#...O...O..#.#O
.#.#O..#O....O.##.#O.#O.O.O....#.....OO#O...OO....#O...O##..OO.OOO......#.....#..#O.OO...#..#....O..
..OO.#.#..#....#..#.......OO..OOO.#...#..O##.O..##O..O....OO#.OO...#O.##.#......#O#.O#..O##...#.....
O.#.....#.O.OO.O......##.........O.O#.O...#......O#.....O.....O#..O.#O..O.#......#..O..O.O..........
...O..O..O.#.##.O..#.........#...#O..#....O#...#..O###.O...#.......O...#.#.#...O.....#O...O....##O.#
.#OO..O........O.O...#.#.....O..O..OO.O....O..##....OO....O...O..O#..O.OO.#...O.O.#.O.#O....O.......
....O.O.O.O..O#..##..O.O.O..O.#.OO.O..#.OOO.O.#.OO.O.#O........#O..O.......O..O..#..O..#..#.O.#.....
.#.O..#.O#O.O.......O.#.#O.OO..O..OO..O#.O.O#O....##OO.......O..#O.O.O#.....#..#..#..O#O.......#O.O.
....O..O#....O#.#O..#.OOOO..#.......OO.......##...#O....O...#..#..#.O..OO..O.#..#.O....#.#.##OO.....
.#O..###..#O#.O#O....O.##..........O.#..O..O.OO.O##...#O.#.O.O...#..#O.........#...#..#.........#O..
#.#.......#O..#..##..O.#...#O#...#.#.O..O.OO##.O....#.....O..OOO.............O..##..#..#..O....#...#
#.#..O..........#.O.#O..O.#...#.#O#..O.#....#.#....#O.......#O.#.O.O.##..OO....O.##..O#....O.....O.O
.O...##...O..#..O#O...O#.....O.#O....OO.O.#O..#....OO.#.O.........#......#O.........O...#.O...#O.O#.
...O.....#........O.#O...#..#..##.......O.O#....#.O...OO##OOO#.#..O#OO..OO..##O....O.#.O...O....##..
............#.O.O#O..#..#..O.........#O..O....OO..#..#..O.#.O.#..O..O..O..#OO...O...OO#O.OO....#..O.
...O.O.....O..O.##.....OO..#O...O...O..O.#...#......O..O.......OO..OO....#OO.O..#........##.O.O....O
#O#......O.O.O#..O.O..OO..#O#..#OO.#...O...O.O.O....#..O#O..O###O.##OO#.O.O.......O.O#..#O.O.O.#...#
..O........OOO.O....OOOO......#.O...#.....O.O#......O#O.O.#O.....#..O....O#.O....O..#..O..O....O...#
...O......O..#....O...#O..OO..#.#OO.O...OOO......#.........#OOO.#.#........O...#OO.O.OOO....O.O#....
......#.O...OO#...#O.#..##.O.#..O..O..O.O.#.O.O.##.#O#O...#OOO...#..O....O..O...OOO..O..#.##....O..#
...O....O.#O.OO..#O...#.#....#O.##OO..#..OO..#....OO.O#....O.O..#.#..O...#.O.#.O.#..O..O..#..O#O.OO.
..O..O.O......O#..#..O..O..O#..#.......#.....#O..O...#O..O..OO#.#.##...OO#..##.O.O.O.O........####.#
#.O#......OO...#.###...OO......#..#.....#.#.##.O..#.#..OO..#...OO#.O#.#..O##....O.....#..#OOO.....#.
.#......O....O.#...O..##.O..#..#O...#.O#....#.O#....O.O#.O#.#.OO.O..O#....O....#...O.O#......O#OO...
....#O#...#.O#.....O.O..OO##O....#.O..O...O..O.OO#...O#.#...O.O.O.....O#..O...#O.....#...O#O...O#.#.
#..O..O..OO..#.O#.......O......#...O.#..#O#..#.O.#.O#...#O.....O.OO..#...O...O.##.....O....OO..#....
..#......O#O...#.........#...O#.#..O.#..O.O.......#O.#...OOO....O#....OO..OOO.......#O....OO........
O.O.#..#..#O........##OO...O.O#....#...#O.......#.O#O...O..O.O##.O..#..OOOO#...O.#O..O#...O.O#O..#O.
.....#O#.#O......OO..O.....#....#.#.O.O.##.O##.....O..O......#O#OOO.....#.....#OO..###.#...O.O.#.#..
#...##.OO.....O.....OO......#.O.O..O......#....##O##..OOO..#.....#...O.......O.......O....##........
.###..#...O..O.#.....O#........O...##O....#.O.#.O.O.#O.......O#..#...OO...O#.OO...O.....O.O.O..OO#.O
...O..#...#..##..#.O##.##O.....O.#..#O.......OO#..O#.OO...##O......OOO...O.O..O#...#.##..O...O..#..O
....O.......#..O#..#O..O....O.O....#...O....O.##.#OOOO....O.#...#O...O#.#.......#.......OO#.#...#.#.
#.OO.O##...O...##.O#..O#......#.#..OO.OO.#.O.O##.#....O.O.##O.....#O..#........#O#...#...#.....O#.#.
O.O.#..##.....##O.......O..OO..#.O......#.......#O....#.......O.#OO...O.O....#.##.....#.....OO......
O#..##..O........#.#..O.#.....#O....O#.....O...#O.......O.O.........O....O.#..O#.O.....#O.#.#.O.#.O.
...O.OO.OO.O..O...#.#.#.O.O.OOO......O.#.#.O.#..O..#.OO.O..##O.......O.........OOO#.O.O...#O.O....O.
O.##...#.#..O#.#..#..O...#...#...O..O..#..O...#O....O..#.##O....O..O..O.##O...O....O..##O..OO.#.....
...OOO.O....O.O.#....O#.OO..#.#.O.#.O#.O...O#O#......##..........#...O......O...#...O....O.#...#....
...#..##.O.#O#.O.#...#..O...O#O....##..OO##..#OO.........#...O#..O#.OOO...OO...#.O.#.OO##..#O#.#...#
O##...#......#O.O#...O....O...#O#.O...O.O.OOO....O.....##....O..#O.O....#.#...O........##OO#.O##...#
OO..#.....O..O#.O...O..OO....#.....##...#..O...#O..#.#O.#O.#O##...#....O....#.O.......#......O.....O
O.O....O##.OO...O.....#......#....O.#O.#...OO#.OO......OO...O#....OO#O...O....##....#...........O.O.
.....O..O.OO....O#..#....#.O....#....#O..##..O..#..........O.OO#.OOO...........O#O.O.......#......OO
.O.#.#.O..O.#....OOO.O..O....O...O......O.O.O..#O.#.#.....OOO.........#.O....#O.O..#O....O#........O
.##.OO#.O.....O..O..#.O..O.O.....O.O.#.O.....OOO.........O.O.O...#..O#..O..O..#O.O.#.#..O.#..#..O#.#
O...#..#..O...O...#..O..O.O.O...........#...#..#........#..OO.#O....#...#....O.........O.#.......#..
O..O###.##.#............#...OO#......#.O..O..#...O.O....O##...#.O.......#.#O..O........##...#.O....O
..#O#....##.O.....###..O.#O.O........#.......O.#...#O..#..OO...#.O...O.OO........###....##OO...O.O..
...O.....O..##....O.O##.OO...O.#.#.#.#.#......O.........O.O#....#.#..O.#.O#OO#.....O.OOO...O....OO..
#..#O...O....................O.#.......O.O...........#O.O....OO.O......O.O##O#.#O.O.O.O...O.O.#.O#O.
.O..O..#...OO.##.#...#.O#.O.###...O......O.......#.O##.O.....##.O......#.O...OO....O#.#..#..O.O.....
....O#.O.O...OO#.O.O#.O...#..........OO....#......O.O#.O.#......O...OOOO..O...##.#...O..#..O..##O.OO
...OO..#O.##O..O...#O.#..O..#.#.#..O#.O..#..#.....O...#.O#..........O....##.O...#O......OO.O..O.....
.#O##.O..#.OO#..O..##O..#.#...........O##.#O.OO#O.....O#..O.....O......O.....O..O...O.#..#..O...#O##
...........#.O#O.#O..O#.....##O....O.#....OO...#..OO..#.O.O#.#OOO....O...#O..#.O#......O.....#.##O..
..##.O.O...O.O..#.......#.O.OO..O....#....O.O.OO..#...O#O##.OO.O.#..#.#O.....##....O.O.O.....#..##.O
#.O.O...#....#..##..O.O.#O.....OO.#O...O......#.O.....OO..O.O.O.O...O..#....#OO.......#......O.#.O..
....#....OO..O##.O..O..OO.OOO.O.O.OO.O...##....O#O.....O....#.#.O...OO.O..#...#.OOO#O..#...OO......#
.O#.OO.O......##....#.#..O#OO..#....#....##O#.O.#...#O..#...OO......O...O#.#.O.O.O..O....O.#O.......
.##OO....##..O...##....O.#.#OOOO.O.#..O..O...#...O.O..O.OO..##..#O.O.......O#O....OO.OO.OO..........
.........O.#..#.....O..OO...#..O.OO...#.O.O.....#....O#..#.OOO.#...#..O.#....#O.......O.O...OO#..O..
#..OO#O......O.O...O#.#..#.O...##O#..O.....OO.O.##.O#O#...O#...#O.O.OO....#O#OO.O.#...O....##.......
OO..OO.....#OO.....O........O.......O#.O......O#.#O...#...O.##.#...O.....O.....O....#O...##O.......#
.#.OO..OOOO..O#O..O......O.#.OO.#.O.........O#OO..#.O.#..#O...O.........O#.#.O#O.OOO.O..#...#.O....#
O#...O#.#..O#.......O....#..#.O#.O.#....#....O..#......O...O...O..##.#O#O......O...#..#..OO..#.OOO..
#.....OO..O..#.OO..#...#.....O#.................##.......O.O..#...#O.O...OO....#OO#....O..O.O..O.O..
..#.......O#O..O.OOO.#........#..OO..O#.#.#..................O..OOO..#.O.....##O....O#..O.OO.O..#O.O
OO...OOO.....O..#O.##.O...#O...O....#......O.O..#OO#O..###O.......O...O..O..............O#....OO.O..
.O..O.#..O........#...##.....O...O##O.O..#.....O.#..#..OO#......O....#..OO.#......O...#O...##......O
...#.##O#.....O..O...O##O...#.O.#.O..O.O....#..O.O#....OO#OO..##.....#...O..##OO.O.O...O#O.....#O...
...#O.OO....O#...O...O....#O..................#.O.O..O.O...O..##O...O#.OO.#..#.#......O.#...O.......
..O...#O.##...O...O...O#O.O..#..O.#O#O....#.#O..#O....O...#.#......#.......#..OO.O.........###O##...
....#O...O.........O............#.OO##.O.O.OO.........O.#.O.#OO.....O..O..##...O#..........#.O..#.O.
.##.O#.O...O#O..#.O...#OO......O..OOOO.......O.O..#....#OO....O.O#O.......#O.....#OO.#.............#
..##..#OO#.......O....................O.........OO..#...O...O.###O..O.......#..O.#.....O.O...O.....O
....#......#..O..#.O.O..O..O...#O.O....#.....O..O.#..#O.#.O#.O#..#.....O.##.O..O#............#.#....
##..#...#..O.O.#O.......O#O..O..O...#O.O............#OO.OO.O...O..#..O..O.O#.O#.....O.O....#.####.#.
O...O#..O#..#.O...OO....#.....OO##.........O.O...O..#..OO#..##.O....O.#..O..O......O....O....O#....O
....#OO.O...OO.....O..##O.#.#..##.#.......O....#O..#......O.#....O.#...#O...O.OO..#OO....#....O.O#O.
...####..O.O....#.#O...#O........OO.O.#O.O.#....#.O...........#....#..O##.O.#OO..#..OO.....OO#.#.##.
.O.O..#....#..#O...#O.....O.#O..O.O#....#...#......#..O.O..#O.O.......#..#..OO..#...#....###O.#...OO
....O#.##...#...........#O.O.O...O.#.O#...#.#.OO#O.O.#OO#.....#...O.O#O.#....O.O.....O.O...#...#.OO.
O..O...OO.#...O.##....#.......##.O..#.##.OOO...#.......O..O.#...#..#....#O.O..O.....O.....O.O.##....
.#OO.##...O.#.............O.#...#....##...O.O.#..O..#O..#.###..OO.#OO#.O.........#...O.......#..#O.O
...O..O...OO.#...O#.#...O..#...O..OO....O.OO.OOO.O...O..O.##O.O.##...O.O.##...#O#....O..OO...#.#.#..
.#...#..O.O.##...#.#..O...OO.##.O....O.O......O.#..O#.#.#..O....#....#O.#..OO...O.OO#.O#...#.O..##..
#..O..#..........O.O#....#OO..#.#...#....#.....#....O....OO...O#....#.#.O##..##O#...#.......#.#O.O#O`.split('\n').map(r => r.split(''));



function log(u: unknown) {
    console.log(JSON.stringify(u, undefined, 2));
}



function moveBouldersNorth(input: string[][]) {

    function findEmpty(col: number, prev: number | null): number | null {

        for (let i = prev ?? 0; i < input.length; i++) {
            if (input[i][col] === '.') {
                return i;
            }
        }
        return null;
    }

    for (let col = 0; col < input[0].length; col++) {

        let empty: number | null = null;
        for (let row = 0; row < input.length; row++) {
            const c = input[row][col];

            if (c === 'O') {
                const nextEmpty = findEmpty(col, empty);
                if (nextEmpty != null && nextEmpty < row) {
                    empty = nextEmpty;
                    input[row][col] = '.';
                    input[empty][col] = 'O';
                }
            }
            if (c === '#') {
                // reset empty
                empty = row;
            }
        }
    }
    return input;
}

function moveBouldersEast(input: string[][]) {

    function findEmpty(row: number, prev: number | null): number | null {

        for (let i = prev ?? input[0].length - 1; i >= 0; i--) {
            if (input[row][i] === '.') {
                return i;
            }
        }
        return null;
    }

    // each row right to left
    for (let row = 0; row < input.length; row++) {

        let empty: number | null = null;
        for (let col = input[0].length - 1; col >= 0; col--) {

            const c = input[row][col];

            if (c === 'O') {
                const nextEmpty = findEmpty(row, empty);
                if (nextEmpty != null && nextEmpty > col) {
                    empty = nextEmpty;
                    input[row][col] = '.';
                    input[row][empty] = 'O';
                }
            }
            if (c === '#') {
                // reset empty
                empty = col;
            }
        }
    }
    return input;
}

function moveBouldersSouth(input: string[][]) {

    function findEmpty(col: number, prev: number | null): number | null {

        for (let i = prev ?? input.length - 1; i >= 0; i--) {
            if (input[i][col] === '.') {
                return i;
            }
        }
        return null;
    }

    for (let col = 0; col < input[0].length; col++) {

        let empty: number | null = null;
        for (let row = input.length - 1; row >= 0; row--) {
            const c = input[row][col];

            if (c === 'O') {
                const nextEmpty = findEmpty(col, empty);
                if (nextEmpty != null && nextEmpty > row) {
                    empty = nextEmpty;
                    input[row][col] = '.';
                    input[empty][col] = 'O';
                }
            }
            if (c === '#') {
                // reset empty
                empty = row;
            }
        }
    }
    return input;
}

function moveBouldersWest(input: string[][]) {

    function findEmpty(row: number, prev: number | null): number | null {

        for (let i = prev ?? 0; i < input[0].length; i++) {
            if (input[row][i] === '.') {
                return i;
            }
        }
        return null;
    }

    // each row left to right
    for (let row = 0; row < input.length; row++) {

        let empty: number | null = null;
        for (let col = 0; col < input[0].length; col++) {

            const c = input[row][col];

            if (c === 'O') {
                const nextEmpty = findEmpty(row, empty);
                if (nextEmpty != null && nextEmpty < col) {
                    empty = nextEmpty;
                    input[row][col] = '.';
                    input[row][empty] = 'O';
                }
            }
            if (c === '#') {
                // reset empty
                empty = col;
            }
        }
    }
    return input;
}

function calcLoad(input: string[][]): number[] {

    const load = input.map((row, i) => {
        const weight = input.length - i;
        const count = row.filter(tile => tile === 'O').length;

        return weight * count;
    });
    return load;
}

function part1(input: string[][]) {

    const moved = moveBouldersNorth(input);

    log({ moved: moved.map(r => r.join()) });

    const loads = calcLoad(moved);


    const total = loads.reduce((a, c) => a + c);

    log(total);

}

function cycle(input: string[][], i: number) {

    // cycle
    const north = moveBouldersNorth(input);
    const west = moveBouldersWest(north);
    const south = moveBouldersSouth(west);
    const east = moveBouldersEast(south);
    // log({ cycle: i, east: east.map(r => r.join()) });

    return east;
}

const cache: Map<string, number> = new Map();

function part2(input: string[][]) {

    const makeKey = (u: unknown) => JSON.stringify(u);

    const cycles = 1_000_000_000;
    let cnt = 0;
    let current = input;
    let finish = false;
    while (cnt < cycles) {
        current = cycle(current, cnt);

        const key = makeKey(current);

        if (cache.has(key) && !finish) {
            const prevCnt = cache.get(key)!;
            const cycle = cnt - prevCnt;

            const remain = (cycles - cnt) % cycle;
            cnt = cycles - remain + 1;
            finish = true;
        } else {
            if (!finish) {
                cache.set(key, cnt);
            } else {
                const loads = calcLoad(current);

                const total = loads.reduce((a, c) => a + c);
                log({ cnt, total });
            }
            cnt++;
        }
    }

    const loads = calcLoad(current);
    const total = loads.reduce((a, c) => a + c);

    log(total);
}

part2(puzzle_input);

// part1(puzzle_input);
