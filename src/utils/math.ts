export type Point3D = [x: number, y: number, z: number];
export type Point2D = [x: number, y: number];

// Rational arithmetic for exact computations
type Fraction = [numerator: number, denominator: number];

const Frac = {
  gcd: (a: number, b: number): number =>
    b === 0 ? Math.abs(a) : Frac.gcd(b, a % b),

  simplify: (f: Fraction): Fraction => {
    if (f[0] === 0) return [0, 1];
    const g = Frac.gcd(f[0], f[1]);
    const sign = f[1] < 0 ? -1 : 1;
    return [(sign * f[0]) / g, (sign * f[1]) / g];
  },

  fromInt: (n: number): Fraction => [n, 1],

  add: (a: Fraction, b: Fraction): Fraction =>
    Frac.simplify([a[0] * b[1] + b[0] * a[1], a[1] * b[1]]),

  sub: (a: Fraction, b: Fraction): Fraction =>
    Frac.simplify([a[0] * b[1] - b[0] * a[1], a[1] * b[1]]),

  mul: (a: Fraction, b: Fraction): Fraction =>
    Frac.simplify([a[0] * b[0], a[1] * b[1]]),

  div: (a: Fraction, b: Fraction): Fraction =>
    Frac.simplify([a[0] * b[1], a[1] * b[0]]),

  isZero: (f: Fraction): boolean => f[0] === 0,

  isInt: (f: Fraction): boolean => f[1] === 1 || f[0] % f[1] === 0,

  toInt: (f: Fraction): number => f[0] / f[1],

  toNumber: (f: Fraction): number => f[0] / f[1],
};

/**
 * Result of Gaussian elimination on a system of linear equations.
 */
export type GaussianResult = {
  /** The reduced matrix in row echelon form */
  matrix: Fraction[][];
  /** Indices of pivot columns (basic variables) */
  pivotCols: number[];
  /** Row indices corresponding to each pivot */
  pivotRows: number[];
  /** Indices of free variables (non-pivot columns) */
  freeVars: number[];
  /** Number of variables (columns excluding augmented column) */
  numVars: number;
};

/**
 * Performs Gaussian elimination on an augmented matrix [A | b] using rational arithmetic.
 * Solves systems of the form Ax = b.
 *
 * @param matrix - Augmented matrix where each row is [...coefficients, rhs]
 * @returns GaussianResult with reduced matrix and variable classification
 *
 * @example
 * // Solve: x + 2y = 5, 3x + 4y = 11
 * const result = gaussianElimination([
 *   [1, 2, 5],
 *   [3, 4, 11]
 * ]);
 */
export function gaussianElimination(matrix: number[][]): GaussianResult {
  const numRows = matrix.length;
  const numCols = matrix[0].length;
  const numVars = numCols - 1;

  // Convert to fractions
  const fracMatrix: Fraction[][] = matrix.map((row) =>
    row.map((v) => Frac.fromInt(v)),
  );

  const pivotCols: number[] = [];
  const pivotRows: number[] = [];
  let pivotRow = 0;

  for (let col = 0; col < numVars && pivotRow < numRows; col++) {
    // Find non-zero pivot
    let foundRow = -1;
    for (let r = pivotRow; r < numRows; r++) {
      if (!Frac.isZero(fracMatrix[r][col])) {
        foundRow = r;
        break;
      }
    }

    if (foundRow === -1) continue;

    // Swap rows
    [fracMatrix[pivotRow], fracMatrix[foundRow]] = [
      fracMatrix[foundRow],
      fracMatrix[pivotRow],
    ];

    pivotCols.push(col);
    pivotRows.push(pivotRow);

    // Eliminate in all other rows
    for (let r = 0; r < numRows; r++) {
      if (r !== pivotRow && !Frac.isZero(fracMatrix[r][col])) {
        const factor = Frac.div(fracMatrix[r][col], fracMatrix[pivotRow][col]);
        for (let c = col; c < numCols; c++) {
          fracMatrix[r][c] = Frac.sub(
            fracMatrix[r][c],
            Frac.mul(factor, fracMatrix[pivotRow][c]),
          );
        }
      }
    }

    pivotRow++;
  }

  // Identify free variables
  const freeVars: number[] = [];
  for (let c = 0; c < numVars; c++) {
    if (!pivotCols.includes(c)) {
      freeVars.push(c);
    }
  }

  return { matrix: fracMatrix, pivotCols, pivotRows, freeVars, numVars };
}

/**
 * Solves for variables given free variable assignments using back substitution.
 *
 * @param result - Result from gaussianElimination
 * @param freeVals - Values assigned to free variables (in order of freeVars)
 * @returns Array of Fractions for each variable, or null if inconsistent
 */
export function solveWithFreeVars(
  result: GaussianResult,
  freeVals: number[],
): Fraction[] | null {
  const { matrix, pivotCols, pivotRows, freeVars, numVars } = result;

  const x: Fraction[] = Array.from({ length: numVars })
    .fill(null)
    .map(() => Frac.fromInt(0));

  // Set free variables
  for (let i = 0; i < freeVars.length; i++) {
    x[freeVars[i]] = Frac.fromInt(freeVals[i]);
  }

  // Back substitution for basic variables
  for (let i = pivotRows.length - 1; i >= 0; i--) {
    const row = pivotRows[i];
    const col = pivotCols[i];
    let sum = matrix[row][numVars]; // RHS
    for (let c = 0; c < numVars; c++) {
      if (c !== col) {
        sum = Frac.sub(sum, Frac.mul(matrix[row][c], x[c]));
      }
    }
    x[col] = Frac.div(sum, matrix[row][col]);
  }

  return x;
}

/**
 * Finds the minimum sum of non-negative integer solutions to Ax = b.
 * Useful for optimization problems like minimizing button presses.
 *
 * @param matrix - Augmented matrix [A | b]
 * @param maxFreeVal - Maximum value to try for each free variable (or function to compute per variable)
 * @returns Minimum sum of solution values, or -1 if no valid solution exists
 */
export function minNonNegativeIntegerSolution(
  matrix: number[][],
  maxFreeVal: number | ((freeVarCol: number) => number),
): number {
  const result = gaussianElimination(matrix);
  const { freeVars, numVars } = result;

  let best = Infinity;

  function tryFreeVars(
    freeIdx: number,
    freeVals: number[],
    currentSum: number,
  ): void {
    if (currentSum >= best) return;

    if (freeIdx === freeVars.length) {
      const x = solveWithFreeVars(result, freeVals);
      if (!x) return;

      let valid = true;
      let total = 0;
      for (let i = 0; i < numVars; i++) {
        if (!Frac.isInt(x[i])) {
          valid = false;
          break;
        }
        const val = Frac.toInt(x[i]);
        if (val < 0) {
          valid = false;
          break;
        }
        total += val;
        if (total >= best) {
          valid = false;
          break;
        }
      }

      if (valid) {
        best = total;
      }
      return;
    }

    const freeCol = freeVars[freeIdx];
    const maxVal =
      typeof maxFreeVal === 'function' ? maxFreeVal(freeCol) : maxFreeVal;

    for (let v = 0; v <= maxVal; v++) {
      freeVals[freeIdx] = v;
      tryFreeVars(freeIdx + 1, freeVals, currentSum + v);
    }
  }

  tryFreeVars(
    0,
    Array.from({ length: freeVars.length }).fill(0) as Array<number>,
    0,
  );

  return best === Infinity ? -1 : best;
}

export function euclideanDistance(p1: Point2D, p2: Point2D): number;
export function euclideanDistance(p1: Point3D, p2: Point3D): number;
export function euclideanDistance(
  p1: Point2D | Point3D,
  p2: Point2D | Point3D,
): number {
  const [x1, y1, z1] = p1;
  const [x2, y2, z2] = p2;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const dz = (z2 ?? 0) - (z1 ?? 0);

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function area(p1: Point2D, p2: Point2D): number {
  const [x1, y1] = p1;
  const [x2, y2] = p2;

  const dx = x1 > x2 ? x1 - x2 : x2 - x1;
  const dy = y1 > y2 ? y1 - y2 : y2 - y1;

  return (dx + 1) * (dy + 1);
}

function cross(a: Point2D, b: Point2D, c: Point2D): number {
  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
}

export type Segment = [p1: Point2D, p2: Point2D];

export function intersect(s1: Segment, s2: Segment): boolean {
  const [p1, p2] = s1;
  const [q1, q2] = s2;

  const c1 = cross(p1, p2, q1);
  const c2 = cross(p1, p2, q2);
  const c3 = cross(q1, q2, p1);
  const c4 = cross(q1, q2, p2);

  return c1 * c2 < 0 && c3 * c4 < 0;
}

export function pointInPolygon(point: Point2D, polygon: Point2D[]): boolean {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    // Check if point is on the edge
    const minX = Math.min(xi, xj);
    const maxX = Math.max(xi, xj);
    const minY = Math.min(yi, yj);
    const maxY = Math.max(yi, yj);

    if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
      // Check if point is on this segment using cross product
      const crossProd = (x - xi) * (yj - yi) - (y - yi) * (xj - xi);
      if (crossProd === 0) {
        return true; // On the edge
      }
    }

    // Ray casting
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }

  return inside;
}
