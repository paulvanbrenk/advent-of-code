import {
  lines,
  mapLines,
  groups,
  groupLines,
  charGrid,
  numberGrid,
  numbers,
  extractIntegers,
  lineIntegers,
  gridDimensions,
  findInGrid,
  findAllInGrid,
  printGrid,
} from './input';

console.log('Testing input parsing helpers...\n');

// Test 1: lines
const testInput1 = `line1
line2
line3`;
console.log('1. lines():');
console.log(lines(testInput1));
console.log();

// Test 2: mapLines
console.log('2. mapLines():');
console.log(mapLines(testInput1, (line, i) => `[${i}] ${line.toUpperCase()}`));
console.log();

// Test 3: groups
const testInput2 = `group1line1
group1line2

group2line1
group2line2`;
console.log('3. groups():');
console.log(groups(testInput2));
console.log();

// Test 4: groupLines
console.log('4. groupLines():');
console.log(groupLines(testInput2));
console.log();

// Test 5: charGrid
const testInput3 = `abc
def
ghi`;
console.log('5. charGrid():');
console.log(charGrid(testInput3));
console.log();

// Test 6: numberGrid
const testInput4 = `123
456
789`;
console.log('6. numberGrid():');
console.log(numberGrid(testInput4));
console.log();

// Test 7: numbers
console.log('7. numbers():');
console.log(numbers('1 2 3 4 5'));
console.log(numbers('1,2,3,4,5', ','));
console.log();

// Test 8: extractIntegers
console.log('8. extractIntegers():');
console.log(extractIntegers('x=10, y=-5, z=100'));
console.log();

// Test 9: lineIntegers
const testInput5 = `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400`;
console.log('9. lineIntegers():');
console.log(lineIntegers(testInput5));
console.log();

// Test 10: gridDimensions
const grid = charGrid(testInput3);
console.log('10. gridDimensions():');
console.log(gridDimensions(grid));
console.log();

// Test 11: findInGrid
const testGrid = charGrid(`..S..
.....
..E..`);
console.log('11. findInGrid():');
console.log('Find S:', findInGrid(testGrid, 'S'));
console.log('Find E:', findInGrid(testGrid, 'E'));
console.log('Find X:', findInGrid(testGrid, 'X'));
console.log();

// Test 12: findAllInGrid
const testGrid2 = charGrid(`a.b.a
.a...
b.a.b`);
console.log('12. findAllInGrid():');
console.log('Find all a:', findAllInGrid(testGrid2, 'a'));
console.log('Find all b:', findAllInGrid(testGrid2, 'b'));
console.log();

// Test 13: printGrid
console.log('13. printGrid():');
printGrid(
  charGrid(`###
#.#
###`),
);

console.log('\nAll tests completed!');
