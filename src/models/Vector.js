export default class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  subtract(vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  dot(vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  multiply(scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  distance(destination) {
    let dx = this.x - destination.x;
    let dy = this.y - destination.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
