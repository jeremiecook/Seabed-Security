import Vector from "./Vector";

export default class Drone {
  constructor(droneId, position, dead, battery, scans) {
    this.droneId = droneId;
    this.position = position;
    this.dead = dead;
    this.battery = battery;
    this.scans = scans;
    this.speed = new Vector(0, 0);
  }

  distance(destination) {
    return this.position.distance(destination);
  }
}
