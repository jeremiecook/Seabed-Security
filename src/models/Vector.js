export default class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distance(destination) {
    let dx = this.x - destination.x;
    let dy = this.y - destination.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
