export default class Score {
  constructor(state) {
    this.state = state;
  }

  getMyScore() {
    return this.state.me.score;
  }

  getEnemyScore() {
    return this.state.enemy.score;
  }

  getMyTotalScore() {
    // Mes poissons
    const savedFishes = this.state.me.getSavedFishes();
    const unsavedFishes = this.state.me.getAllUnsavedScans();
    const allFishes = this.state.me.getAllScannedFishes();

    // Mes poissons scannés que l'adversaire n'a pas encore enregistré
    const enemySaved = this.state.enemy.getSavedFishes();

    let score = this.getMyScore();

    // Poissons scannés
    score += this.getFishScore(unsavedFishes);
    score += this.getCollectionScore(allFishes);

    // Points bonus
    const bonusFishes = unsavedFishes.filter((id) => !enemySaved.includes(id));
    score += this.getFishScore(bonusFishes);

    const bonusCollection = allFishes.filter((id) => !enemySaved.includes(id));
    score += this.getCollectionScore(bonusCollection);

    console.warn("Score potentiel :", score);
    return score;
  }

  getEnemyScanScore() {}

  getFishScore(fishIds) {
    let score = 0;
    const creatures = this.state.creatures;
    const fishes = fishIds.filter((id) => creatures.has(id)).map((id) => creatures.get(id));

    // Main score
    fishes.forEach((fish) => {
      score += fish.type + 1;
    });

    return score;
  }

  getCollectionScore(fishIds) {
    let score = 0;
    const creatures = this.state.creatures;
    const fishes = fishIds.filter((id) => creatures.has(id)).map((id) => creatures.get(id));

    // All by type
    const typeCount = this.countByProperty(fishes, "type");
    const series = Object.keys(typeCount)
      .filter((type) => typeCount[type] === 4)
      .map(Number);

    //console.warn(series);
    score += series.length * 4;

    // All by color
    const colorCount = this.countByProperty(fishes, "color");
    const colors = Object.keys(colorCount)
      .filter((color) => colorCount[color] === 3)
      .map(Number);

    //console.warn(colors);
    score += colors.length * 3;

    return score;
  }

  countByProperty = (items, propName) => {
    return items.reduce((acc, item) => {
      acc[item[propName]] = (acc[item[propName]] || 0) + 1;
      return acc;
    }, {});
  };
}
