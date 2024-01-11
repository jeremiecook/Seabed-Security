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

  getTotalScore(player, enemy) {
    let score = player.score;
    console.warn("Score de base", score);

    // Fishes
    score += this.calculateFishScore(player.getScannedFishes());
    console.warn("Seulement les poissons", score);

    // Collections
    score -= this.calculateCollectionScore(player.getSavedFishes());
    score += this.calculateCollectionScore(player.getAllFishes());
    console.warn("Avec les collections", score);

    // Bonus
    const bonusFishes = player
      .getScannedFishes()
      .filter((id) => !enemy.getSavedFishes().includes(id));
    score += this.calculateFishScore(bonusFishes);

    const myCollections = this.findCollections(player.getAllFishes());
    const mySavedCollections = this.findCollections(player.getSavedFishes());
    const enemyCollections = this.findCollections(enemy.getSavedFishes());

    // On supprime les collections de l'adversaire et celles déjà enregistrées
    Object.keys(myCollections).forEach((key) => {
      console.warn(key, myCollections[key]);
      myCollections[key] = myCollections[key].filter((id) => !mySavedCollections[key].includes(id));
      myCollections[key] = myCollections[key].filter((id) => !enemyCollections[key].includes(id));
    });

    score += 4 * myCollections.type.length;
    score += 3 * myCollections.color.length;
    console.warn("Avec les bonus", score);

    return score;
  }

  getMyTotalScore() {
    console.warn("My total score");
    return this.getTotalScore(this.state.me, this.state.enemy);
  }

  getEnemyTotalScore() {
    console.warn("Enemy total score");
    return this.getTotalScore(this.state.enemy, this.state.me);
  }

  getMaxScore(player, enemy) {
    let score = player.score;
    console.warn("Max score de base", score);

    const allUnsavedFishes = this.state
      .getFishes()
      .map((fish) => fish.creatureId)
      .filter((fishId) => !player.getSavedFishes().includes(fishId));

    // Poissons
    score += this.calculateFishScore(allUnsavedFishes);
    console.warn("Max score pour les poissons", score);

    // Collections
    score -= this.calculateCollectionScore(player.getSavedFishes());
    score += this.calculateCollectionScore(this.state.getFishes());
    console.warn("Max score pour les collections", score);

    // Points bonus
    const enemySaved = enemy.getSavedFishes();
    const bonusFishes = allUnsavedFishes.filter((id) => !enemySaved.includes(id));
    score += this.calculateFishScore(bonusFishes);

    //--
    const allCollections = this.findCollections(this.state.getFishes());
    const mySavedCollections = this.findCollections(player.getSavedFishes());
    const enemyCollections = this.findCollections(enemy.getSavedFishes());

    // On supprime les collections de l'adversaire et celles déjà enregistrées
    Object.keys(allCollections).forEach((key) => {
      allCollections[key] = allCollections[key].filter(
        (id) => !mySavedCollections[key].includes(id)
      );
      allCollections[key] = allCollections[key].filter((id) => !enemyCollections[key].includes(id));
    });

    score += 4 * allCollections.type.length;
    score += 3 * allCollections.color.length;
    console.warn("Avec les bonus", score);

    console.warn("Max score avec les bonus", score);

    return score;
  }

  getMyMaxScore() {
    console.warn("My max score");
    return this.getTotalScore(this.state.me, this.state.enemy);
  }

  getEnemyMaxScore() {
    console.warn("Enemy max score");
    return this.getMaxScore(this.state.enemy, this.state.me);
  }

  getEnemyScanScore() {}

  calculateFishScore(fishIds) {
    let score = 0;
    const creatures = this.state.creatures;
    const fishes = fishIds.filter((id) => creatures.has(id)).map((id) => creatures.get(id));

    // Main score
    fishes.forEach((fish) => {
      score += fish.type + 1;
    });

    return score;
  }

  findCollections(fishIds) {
    let collections = {};
    const creatures = this.state.creatures;
    const fishes = fishIds.filter((id) => creatures.has(id)).map((id) => creatures.get(id));

    collections.type = this.countByProperty(fishes, "type");
    collections.color = this.countByProperty(fishes, "color");
    return collections;
  }

  calculateCollectionScore(fishIds) {
    let score = 0;
    const creatures = this.state.creatures;
    const fishes = fishIds.filter((id) => creatures.has(id)).map((id) => creatures.get(id));

    const collections = this.findCollections(fishIds);
    console.warn(fishIds);
    console.warn(collections);

    // All by type
    const typeCount = this.countByProperty(fishes, "type");
    const series = Object.keys(collections.type)
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
