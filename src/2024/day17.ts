import { input } from './input';

type Registers = {
  A: number;
  B: number;
  C: number;
};

const myInput = JSON.parse(input);

type Instruction =
  | 'adv'
  | 'bxl'
  | 'bst'
  | 'jnz'
  | 'bxc'
  | 'out'
  | 'bdv'
  | 'cdv';

const map: readonly Instruction[] = [
  'adv',
  'bxl',
  'bst',
  'jnz',
  'bxc',
  'out',
  'bdv',
  'cdv',
];

function device(reg: Registers, instructions: number[]) {
  const output: number[] = [];

  function getComboOperand(add: number) {
    if (add <= 3) {
      return add;
    }
    if (add === 4) {
      return reg.A;
    }
    if (add === 5) {
      return reg.B;
    }
    if (add === 6) {
      return reg.C;
    }
    throw new Error('bad address');
  }

  function doOperation(
    instruction: Instruction,
    operand: number,
    pointer: number,
  ) {
    switch (instruction) {
      case 'adv':
      case 'bdv':
      case 'cdv': {
        // The adv instruction (opcode 0) performs division. The numerator is the value in the A register.
        // The denominator is found by raising 2 to the power of the instruction's combo operand. (So, an operand of
        // 2 would divide A by 4 (2^2); an operand of 5 would divide A by 2^B.) The result of the division operation is
        // truncated to an integer and then written to the A register.
        const num = reg.A;
        const op = getComboOperand(operand);
        const den = Math.pow(2, op);
        const result = Math.floor(num / den);
        if (instruction === 'adv') reg.A = result;
        if (instruction === 'bdv') reg.B = result;
        if (instruction === 'cdv') reg.C = result;
        break;
      }
      case 'bxl': {
        // The bxl instruction (opcode 1) calculates the bitwise XOR of register B and the instruction's literal
        // operand, then stores the result in register B.
        const num = reg.B;
        const result = Number(BigInt(num) ^ BigInt(operand));
        reg.B = result;
        break;
      }
      case 'bst': {
        // The bst instruction (opcode 2) calculates the value of its combo operand modulo 8 (thereby keeping
        // only its lowest 3 bits), then writes that value to the B register.
        const num = getComboOperand(operand);
        reg.B = num % 8;
        break;
      }
      case 'jnz': {
        // The jnz instruction (opcode 3) does nothing if the A register is 0. However, if the A register is not
        // zero, it jumps by setting the instruction pointer to the value of its literal operand; if this instruction
        // jumps, the instruction pointer is not increased by 2 after this instruction.
        if (reg.A === 0) {
          break;
        }
        return operand;
      }
      case 'bxc': {
        // The bxc instruction (opcode 4) calculates the bitwise XOR of register B and register C, then stores the
        // result in register B. (For legacy reasons, this instruction reads an operand but ignores it.)
        const b = reg.B;
        const c = reg.C;
        reg.B = Number(BigInt(b) ^ BigInt(c));
        break;
      }
      case 'out': {
        // The out instruction (opcode 5) calculates the value of its combo operand modulo 8, then outputs that value.
        // (If a program outputs multiple values, they are separated by commas.)
        const num = getComboOperand(operand);
        output.push(num % 8);
        break;
      }

      default:
        throw new Error('invalid operation ' + instruction);
    }
    return (pointer += 2);
  }

  for (let i = 0; i < instructions.length; ) {
    const ins = map[instructions[i]];
    const op = instructions[i + 1];
    i = doOperation(ins, op, i);
  }

  return output.join(',');
}

// // part a

const program: number[] = myInput.program;
console.log(device(myInput.reg, program));

// part b
const q: { result: string; len: number }[] = [];
q.push({ result: '', len: 0 });
while (q.length) {
  const item = q.shift()!;
  if (item.len === program.length) {
    console.log('B', parseInt(item.result, 2));
    break;
  }
  const from = parseInt(item.result + '000', 2);
  const to = parseInt(item.result + '111', 2);
  const expect = program.slice((item.len + 1) * -1).join(',');
  for (let a = from; a <= to; a++) {
    const r = device({ A: a, B: 0, C: 0 }, program);
    if (r === expect) {
      q.push({ result: a.toString(2), len: item.len + 1 });
    }
  }
}
