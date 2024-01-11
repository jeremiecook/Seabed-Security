export default class Player {
  constructor() {
    this.score = 0;
    this.drones = [];
    this.scans = [];
  }

  getScannedFishes() {
    return Array.from(new Set([...this.drones.flatMap((drone) => drone.scans)]));
  }

  getSavedFishes() {
    return this.scans;
  }

  getAllFishes() {
    return Array.from(new Set([...this.scans, ...this.drones.flatMap((drone) => drone.scans)]));
  }
}
