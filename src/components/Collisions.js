import Vector from "../models/Vector";
import { MAP, MONSTER, DRONE } from "../constants";

export default class Collisions {
  check(drone, monsters) {
    const safeDistance = MONSTER.SPEED + 20; // Vitesse de déplacement d'un monstre
    const position = drone.position;
    const destination = drone.destination;

    if (drone.dead) {
      console.warn("DEAD ☠️");
      return destination;
    }

    //console.warn(monsters);

    // Monstres à proximité
    // const closeMonsters = monsters.filter(
    //   (monster) => monster.getDestination().distance(position) < safeDistance * 5
    // );

    const closeMonsters = monsters;

    // Si aucun monstre à proximité, on va directement à la destination
    if (closeMonsters.length === 0) return destination;
    console.warn("Monster Detected");

    // Define a list of escape points
    const escapePoints = this.getEscapePoints(position);

    // Remove points to close to monsters
    const safeEscapePoints = escapePoints
      // Dans les limites de la map
      .filter((escapePoint) => {
        return (
          escapePoint.x < MAP.XMAX &&
          escapePoint.x >= MAP.XMIN &&
          escapePoint.y < MAP.YMAX &&
          escapePoint.y >= MAP.YMIN
        );
      })
      // Loin des monstres
      .filter((escapePoint) => {
        return !closeMonsters.some((monster) => {
          return this.checkCollision(
            position,
            escapePoint.subtract(position),
            monster.position,
            monster.speed,
            safeDistance
          );
        });
      });

    // Debug
    closeMonsters.forEach((monster) => {
      console.warn("Drone position", position);
      console.warn("Drone destination", destination);
      console.warn("Monster Id", monster.creatureId);
      console.warn("Monster position", monster.position);
      console.warn("Monster speed", monster.speed);
      console.warn("Monster destination", monster.getDestination());
      console.warn("escapePoints", escapePoints);
      console.warn("safeEscapePoints", safeEscapePoints);
    });

    // Find the closest point to the destination
    const closestSafePoint = safeEscapePoints.reduce((closest, point) => {
      return point.distance(destination) < closest.distance(destination) ? point : closest;
    }, safeEscapePoints[0]); // Initialize with the first safe escape point

    console.warn(closestSafePoint);

    return closestSafePoint || destination;
  }

  getEscapePoints(position) {
    const numPoints = 8;
    const escapePoints = [];
    const distance = DRONE.SPEED; // Vitesse du drone
    const angleIncrement = (2 * Math.PI) / numPoints; // Full circle divided by the number of points

    for (let i = 0; i < numPoints; i++) {
      const angle = angleIncrement * i;
      const escapeX = Math.round(position.x + distance * Math.cos(angle));
      const escapeY = Math.round(position.y + distance * Math.sin(angle));
      escapePoints.push(new Vector(escapeX, escapeY));
    }

    return escapePoints;
  }

  checkCollision(P_drone, V_drone, P_monster, V_monster, collisionDistance) {
    const P_relative = P_drone.subtract(P_monster);
    const V_relative = V_drone.subtract(V_monster);

    const dotProduct = P_relative.dot(V_relative);
    const closestPoint = V_relative.multiply(dotProduct / V_relative.magnitude() ** 2);
    const D_closest = P_relative.subtract(closestPoint).magnitude();

    return D_closest < collisionDistance;
  }
}
