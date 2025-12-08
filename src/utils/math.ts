export type Point3D = [x: number, y: number, z: number];

/**
 * Calculates the Euclidean distance between two 3D points
 * @param p1 - First point [x, y, z]
 * @param p2 - Second point [x, y, z]
 * @returns The Euclidean distance between the two points
 */
export function euclideanDistance(p1: Point3D, p2: Point3D): number {
  const [x1, y1, z1] = p1;
  const [x2, y2, z2] = p2;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const dz = z2 - z1;

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
