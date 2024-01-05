export default class Player {
  constructor() {
    this.score = 0;
    this.drones = [];
    this.scans = [];
  }

  getSavedFishes() {
    return this.scans;
  }

  getAllScannedFishes() {
    return Array.from(new Set([...this.scans, ...this.drones.flatMap((drone) => drone.scans)]));
  }

  getAllUnsavedScans() {
    return Array.from(new Set([...this.drones.flatMap((drone) => drone.scans)]));
  }
}
