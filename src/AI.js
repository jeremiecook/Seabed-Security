import Vector from "./models/Vector";
import Zones from "./components/Zones";

export default class AI {
  constructor() {
    this.light = 0;
    //this.resurfaceCheck = false;
  }

  nextMove(state) {
    this.state = state;

    // Explore
    const zones = new Zones(state);
    const [zone1, zone2] = zones.getTopTwoZones();

    this.move(zone1.zone.center, zone2.zone.center);
  }

  resurface() {
    const [drone1, drone2] = this.game.me.drones;
    this.move(new Vector(drone1.position.x, 0), new Vector(drone2.position.x, 0));
  }

  move(point1, point2) {
    const [drone1, drone2] = this.state.me.drones;
    const light = this.useLight();

    // Calcul du meilleur trajet
    const distance1 = drone1.distance(point1) + drone2.distance(point2);
    const distance2 = drone1.distance(point2) + drone2.distance(point1);

    let destination1, destination2;
    destination1 = distance1 < distance2 ? point1 : point2;
    destination2 = distance1 < distance2 ? point2 : point1;

    // On évite les monstres
    //destination1 = this.avoidMonsters(drone1.position, destination1);
    //destination2 = this.avoidMonsters(drone2.position, destination2);

    // Print move
    console.log(`MOVE ${destination1.x} ${destination1.y} ${light}`);
    console.log(`MOVE ${destination2.x} ${destination2.y} ${light}`);
  }

  useLight() {
    return this.light === 4 ? ((this.light = 0), 1) : (this.light++, 0);
  }

  run() {
    let turn = 0;
    let turnsWithoutScans = 0;
    let previousScans = 0;

    while (true) {
      let scanned = this.game.me.getAllScannedFishes.length;
      turnsWithoutScans++;
      if (scanned > previousScans) {
        turnsWithoutScans = 0;
        previousScans = scanned;
      }

      //console.warn("Scanned", this.game.me.getAllUnsavedScans().length);
      if (this.game.me.getAllUnsavedScans().length >= 12) {
        this.resurfaceCheck = true;
      }

      if (this.resurfaceCheck) {
        this.resurface();
      } else {
        this.explore();
      }

      // if (this.game.monsterDetected()) {
      //   this.resurfaceCheck = true;
      // }

      // if (this.game.me.drones[0].position.y == 0 && this.game.me.drones[1].position.y == 0) {
      //   this.resurfaceCheck = false;
      // }

      // if (this.resurfaceCheck) {
      //   this.resurface();
      // } else {
      // }
    }
  }
}
