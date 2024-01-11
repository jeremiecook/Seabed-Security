import Player from "./models/Player";
import Creature from "./models/Creature";
import Drone from "./models/Drone";
import RadarBlip from "./models/RadarBlip";
import Vector from "./models/Vector";

export default class State {
  constructor() {
    this.me = new Player();
    this.enemy = new Player();
    this.creatures = new Map();
    this.droneById = new Map();
    this.zones = new Map();

    this.visibleFishes = [];
    this.radarBlips = new Map();

    this.readCreatures();
  }

  getCreature(id) {
    return this.creature.get(id);
  }

  getFishes() {
    return Array.from(this.creatures.values()).filter((creature) => creature.type !== -1);
  }

  getMonsters() {
    return Array.from(this.creatures.values()).filter((creature) => creature.type === -1);
  }

  getUnknownFishes() {
    const scannedFishIds = new Set(this.me.getAllFishes());
    const unknownFishes = this.getFishes().filter((fish) => !scannedFishIds.has(fish.creatureId));
    return unknownFishes;
  }

  getVisibleMonsters() {
    return Array.from(this.creatures.values()).filter(
      (creature) => creature.type === -1 && creature.visible == true
    );
  }

  monsterDetected() {
    return this.getMonsters().some((monster) => monster.visible);
  }

  getPotentialScore(player) {
    let score = player.score;

    let unsavedScans = player.getScannedFishes();
    score += this.getFishesPotentialScore(unsavedScans);

    return score;
  }

  getFishesPotentialScore(fishes) {
    let score = 0;

    fishes.forEach((fish) => {
      if (fish.type === 0) score += 1;
      if (fish.type === 1) score += 2;
      if (fish.type === 2) score += 3;
    });

    return score;
  }

  getRadarIndications(creatureId) {
    let directions = [];

    // Iterate over each drone's radar blips
    for (const radarBlips of this.radarBlips.values()) {
      for (const blip of radarBlips) {
        if (blip.creatureId === creatureId) {
          directions.push(blip.dir);
        }
      }
    }

    return directions.sort();
  }

  readCreatures() {
    const creaturesCount = parseInt(readline());
    for (let i = 0; i < creaturesCount; i++) {
      const [creaturesId, color, type] = readline().split(" ").map(Number);
      this.creatures.set(creaturesId, new Creature(creaturesId, color, type));
    }
  }

  readScores() {
    this.me.score = parseInt(readline());
    this.enemy.score = parseInt(readline());
  }

  readDrones() {
    // Drones
    const myDroneCount = parseInt(readline());
    for (let i = 0; i < myDroneCount; i++) {
      const [droneId, droneX, droneY, dead, battery] = readline().split(" ").map(Number);
      const position = new Vector(droneX, droneY);
      const drone = new Drone(droneId, position, dead, battery, []);
      this.droneById.set(droneId, drone);
      this.me.drones.push(drone);
      this.radarBlips.set(droneId, []);
    }

    const enemyDroneCount = parseInt(readline());
    for (let i = 0; i < enemyDroneCount; i++) {
      const [droneId, droneX, droneY, dead, battery] = readline().split(" ").map(Number);
      const position = new Vector(droneX, droneY);
      const drone = new Drone(droneId, position, dead, battery, []);
      this.droneById.set(droneId, drone);
      this.enemy.drones.push(drone);
    }
  }

  readScans() {
    const myScanCount = parseInt(readline());
    for (let i = 0; i < myScanCount; i++) {
      const fish_id = parseInt(readline());
      this.me.scans.push(fish_id);
    }

    const enemyScanCount = parseInt(readline());
    for (let i = 0; i < enemyScanCount; i++) {
      const fish_id = parseInt(readline());
      this.enemy.scans.push(fish_id);
    }
  }

  readDroneScans() {
    // Scans non sauvegardés
    const droneScanCount = parseInt(readline());
    for (let i = 0; i < droneScanCount; i++) {
      const [droneId, fish_id] = readline().split(" ").map(Number);
      this.droneById.get(droneId).scans.push(fish_id);
    }
  }

  readVisibleCreatures() {
    // Poissons visibles
    this.creatures.forEach((fish) => (fish.visible = false));

    const visibleFishCount = parseInt(readline());
    for (let i = 0; i < visibleFishCount; i++) {
      const [creatureId, creatureX, creatureY, creatureVx, creatureVy] = readline()
        .split(" ")
        .map(Number);
      const creature = this.creatures.get(creatureId);

      if (creature) {
        creature.position = new Vector(creatureX, creatureY);
        creature.speed = new Vector(creatureVx, creatureVy);
        creature.visible = true;
      }
    }
  }

  readRadarBlips() {
    // Poissons sur le radar
    const radarBlipCount = parseInt(readline());
    for (let i = 0; i < radarBlipCount; i++) {
      const [_droneId, _creatureId, dir] = readline().split(" ");
      const droneId = parseInt(_droneId);
      const creatureId = parseInt(_creatureId);
      this.radarBlips.get(droneId).push(new RadarBlip(creatureId, dir));
    }
  }

  read() {
    this.me = new Player();
    this.enemy = new Player();
    this.droneById = new Map();
    this.zones = new Map();
    this.visibleFishes = [];
    this.radarBlips = new Map();

    this.readScores();
    this.readScans();
    this.readDrones();
    this.readDroneScans();
    this.readVisibleCreatures();
    this.readRadarBlips();
  }
}
