import Vector from "./Vector";

export default class Creature {
  constructor(creatureId, color, type) {
    this.creatureId = creatureId;
    this.color = color;
    this.type = type;
    this.visible = false;
    this.position = new Vector(-1, -1);
    this.speed = new Vector(-1, -1);
  }

  getDestination() {
    return new Vector(this.position.x + this.speed.x, this.position.y + this.speed.y);
  }
}
