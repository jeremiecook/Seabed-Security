import Vector from "./models/Vector";
import Zones from "./components/Zones";
import Collisions from "./components/Collisions";
import Score from "./components/Score";

export default class AI {
  constructor() {
    this.light = 0;
    //this.resurfaceCheck = false;
  }

  nextMove(state) {
    this.state = state;

    // Score des scans
    const score = new Score(state);
    const myScore = score.getMyTotalScore();

    if (myScore > 72) {
      this.resurface();
      return;
    }

    // Explore
    const zones = new Zones(state);
    //console.warn(zones.zones);
    const [zone1, zone2] = zones.getTopTwoZones();

    const destination1 = zone1.score > 0 ? zone1.zone.center : new Vector(5000, 490);
    const destination2 = zone2.score > 0 ? zone2.zone.center : new Vector(5000, 490);

    this.move(destination1, destination2);
  }

  resurface() {
    const [drone1, drone2] = this.state.me.drones;
    this.move(new Vector(drone1.position.x, 0), new Vector(drone2.position.x, 0));
  }

  move(point1, point2) {
    const [drone1, drone2] = this.state.me.drones;
    const light = this.useLight();

    // Calcul du meilleur trajet
    const distance1 = drone1.distance(point1) + drone2.distance(point2);
    const distance2 = drone1.distance(point2) + drone2.distance(point1);

    let destination1, destination2;
    drone1.destination = distance1 < distance2 ? point1 : point2;
    drone2.destination = distance1 < distance2 ? point2 : point1;

    const collisions = new Collisions();
    drone1.destination = collisions.check(drone1, this.state.getVisibleMonsters());
    drone2.destination = collisions.check(drone2, this.state.getVisibleMonsters());

    // On évite les monstres
    //destination1 = this.avoidMonsters(drone1.position, destination1);
    //destination2 = this.avoidMonsters(drone2.position, destination2);

    // Print move
    console.log(`MOVE ${drone1.destination.x} ${drone1.destination.y} ${light}`);
    console.log(`MOVE ${drone2.destination.x} ${drone2.destination.y} ${light}`);
  }

  useLight() {
    return this.light === 3 ? ((this.light = 0), 1) : (this.light++, 0);
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
