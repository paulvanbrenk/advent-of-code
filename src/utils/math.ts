export type Point3D = [x: number, y: number, z: number];
export type Point2D = [x: number, y: number];

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
