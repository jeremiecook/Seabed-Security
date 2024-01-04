import * as CONST from "../constants";

export default class Collisions {
  check(drone, obstacles) {}

  // Eviter les monstres
  avoidMonsters(position, destination) {
    const safeDistance = CONST.MONSTER.SPEED + 10; // Vitesse de déplacement d'un monstre
    const monsters = this.game.getVisibleMonsters();

    // Monstres à proximité
    const closeMonsters = monsters.filter(
      (monster) => monster.getDestination().distance(position) < safeDistance * 3
    );

    // Si aucun monstre à proximité, on va directement à la destination
    if (closeMonsters.length === 0) return destination;
    console.warn("Monster Detected");

    // Define a list of escape points
    const numPoints = 16;
    const escapePoints = [];
    const distance = DRONE_SPEED; // Vitesse du drone
    const angleIncrement = (2 * Math.PI) / numPoints; // Full circle divided by the number of points

    for (let i = 0; i < numPoints; i++) {
      const angle = angleIncrement * i;
      const escapeX = Math.round(position.x + distance * Math.cos(angle));
      const escapeY = Math.round(position.y + distance * Math.sin(angle));
      escapePoints.push(new Vector(escapeX, escapeY));
    }

    // Remove points to close to monsters
    const safeEscapePoints = escapePoints.filter((escapePoint) => {
      return !closeMonsters.some((monster) => {
        return segmentsGetTooClose(
          position,
          escapePoint,
          monster.position,
          monster.getDestination(),
          safeDistance
        );
      });
    });
    // const safeEscapePoints = escapePoints.filter(
    //   (point) =>
    //     !closeMonsters.some((monster) => monster.getDestination().distance(point) < safeDistance)
    // );

    closeMonsters.forEach((monster) => {
      console.warn("Drone position", position);
      console.warn("Drone destination", destination);

      console.warn("Monster Id", monster.creatureId);
      console.warn("Monster position", monster.position);
      console.warn("Monster speed", monster.speed);
      console.warn("Monster destination", monster.getDestination());
      console.warn("safeEscapePoints", safeEscapePoints);
    });

    //console.warn(safeEscapePoints);

    // Find the closest point to the destination
    const closestSafePoint = safeEscapePoints.reduce((closest, point) => {
      return point.distance(destination) < closest.distance(destination) ? point : closest;
    }, safeEscapePoints[0]); // Initialize with the first safe escape point

    console.warn(closestSafePoint);

    return closestSafePoint || destination;
  }

  linesIntersect(p0, p1, p2, p3) {
    // Calcul des vecteurs
    let s1_x = p1.x - p0.x;
    let s1_y = p1.y - p0.y;
    let s2_x = p3.x - p2.x;
    let s2_y = p3.y - p2.y;

    // Calcul des dénominateurs pour les formules d'intersection
    let s = (-s1_y * (p0.x - p2.x) + s1_x * (p0.y - p2.y)) / (-s2_x * s1_y + s1_x * s2_y);
    let t = (s2_x * (p0.y - p2.y) - s2_y * (p0.x - p2.x)) / (-s2_x * s1_y + s1_x * s2_y);

    // Si s et t sont entre 0 et 1, les lignes se croisent
    return s >= 0 && s <= 1 && t >= 0 && t <= 1;
  }

  calculateClosestPoints(p1, p2, q1, q2) {
    // Function to calculate closest point on a segment to another point
    function closestPointOnSegment(segmentStart, segmentEnd, point) {
      const segmentVector = { x: segmentEnd.x - segmentStart.x, y: segmentEnd.y - segmentStart.y };
      const pointVector = { x: point.x - segmentStart.x, y: point.y - segmentStart.y };
      const segmentLengthSquared =
        segmentVector.x * segmentVector.x + segmentVector.y * segmentVector.y;
      const dotProduct = pointVector.x * segmentVector.x + pointVector.y * segmentVector.y;
      const t = Math.max(0, Math.min(1, dotProduct / segmentLengthSquared));
      return { x: segmentStart.x + segmentVector.x * t, y: segmentStart.y + segmentVector.y * t };
    }

    // Find the closest point on each segment to the other segment
    let closestPointOnP = closestPointOnSegment(p1, p2, q1);
    let closestPointOnQ = closestPointOnSegment(q1, q2, p1);

    return [closestPointOnP, closestPointOnQ];
  }

  segmentsGetTooClose(p1, p2, q1, q2, minDistance) {
    const [closestPointOnP, closestPointOnQ] = calculateClosestPoints(p1, p2, q1, q2);

    // Calculate the distance between these closest points
    const distance = Math.sqrt(
      Math.pow(closestPointOnP.x - closestPointOnQ.x, 2) +
        Math.pow(closestPointOnP.y - closestPointOnQ.y, 2)
    );

    return distance < minDistance;
  }
}
