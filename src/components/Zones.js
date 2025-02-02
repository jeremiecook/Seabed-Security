import Vector from "../models/Vector";
import Score from "./Score";

export default class Zones {
  constructor(state) {
    this.state = state;
    this.zones = this.createZones();
    this.analyzeFishesPositions();
  }

  // Création et division de la carte en 9 zones
  createZones() {
    const [d1, d2] = this.state.me.drones.map((drone) => drone.position);

    //console.warn(d1, d2);

    const minYFishes = 2500;

    let minX = Math.min(d1.x, d2.x);
    let maxX = Math.max(d1.x, d2.x);
    let minY = 5000;
    let maxY = 7500;
    let maxMap = 10000;

    let zones = new Map();

    // Top row
    zones.set("TL", new Zone("TL", new Vector(0, 2500), new Vector(minX, minY)));
    zones.set("TC", new Zone("TC", new Vector(minX, 2500), new Vector(maxX, minY)));
    zones.set("TR", new Zone("TR", new Vector(maxX, 2500), new Vector(maxMap, minY)));

    // Center row
    zones.set("CL", new Zone("CL", new Vector(0, minY), new Vector(minX, maxY)));
    zones.set("CC", new Zone("CC", new Vector(minX, minY), new Vector(maxX, maxY)));
    zones.set("CR", new Zone("CR", new Vector(maxX, minY), new Vector(maxMap, maxY)));

    // Bottom row
    zones.set("BL", new Zone("BL", new Vector(0, maxY), new Vector(minX, maxMap)));
    zones.set("BC", new Zone("BC", new Vector(minX, maxY), new Vector(maxX, maxMap)));
    zones.set("BR", new Zone("BR", new Vector(maxX, maxY), new Vector(maxMap, maxMap)));

    this.zones = zones;
    return zones;
  }

  // Analyse des positions des poissons
  analyzeFishesPositions() {
    const typeMapping = {
      0: "T",
      1: "C",
      2: "B",
    };

    // Map radarBlips to a zone
    const radarMapping = {
      TLTL: "L",
      TLTR: "C",
      TRTR: "R",
      BLTL: "L",
      BRTL: "C",
      BLTR: "C",
      BRTR: "R",
      BLBL: "L",
      BLBR: "C",
      BRBR: "R",
    };

    const fishes = this.state.getUnknownFishes();

    fishes.forEach((fish) => {
      let radarIndications = this.state.getRadarIndications(fish.creatureId).join("");

      const zoneName = typeMapping[fish.type] + radarMapping[radarIndications];

      if (zoneName && this.zones.has(zoneName)) {
        this.zones.get(zoneName).fishesId.push(fish.creatureId);
        this.zones.get(zoneName).fishesCount++;
        this.zones.get(zoneName).fishesValue += fish.type + 1;
      }
    });
    //console.warn(this.zones);
  }

  getZones() {
    return this.zones;
  }

  getTopTwoZones() {
    //console.warn(this.zones);
    const zones = Array.from(this.zones.entries()).map(([zoneName, zoneObject]) => ({
      name: zoneName,
      zone: zoneObject,
      score: zoneObject.score(),
    }));

    // Sort the array by score in descending order
    zones.sort((a, b) => b.score - a.score);

    // Select the top two zones
    const topTwo = zones.slice(0, 2);
    console.warn("Top 2 zones");
    console.warn(topTwo[0].zone.toString());
    console.warn(topTwo[1].zone.toString());
    return topTwo;
  }
}

class Zone {
  constructor(name, point1, point2) {
    this.name = name;
    this.tl = new Vector(Math.min(point1.x, point2.x), Math.min(point1.y, point2.y));
    this.br = new Vector(Math.max(point1.x, point2.x), Math.max(point1.y, point2.y));

    this.center = new Vector(
      Math.round((this.br.x + this.tl.x) / 2),
      Math.round((this.br.y + this.tl.y) / 2)
    );

    this.areaValue = (this.br.x - this.tl.x) * (this.br.y - this.tl.y);
    this.fishesCount = 0;
    this.fishesId = [];
    this.fishesValue = 0;
  }

  area() {
    return this.areaValue;
  }

  // Is a point inside the zone?
  contains(point) {
    return point.x >= tl.x && point.x < br.x && point.y >= tl.y && point.y < br.y;
  }

  score() {
    return this.area() === 0 ? 0 : this.fishesValue / this.area();
  }

  toString() {
    const score = this.score();
    return `Zone ${this.name} - Score : ${score} - (${this.tl.x},${this.tl.y}) (${this.br.x},${this.br.y})`;
  }
}
