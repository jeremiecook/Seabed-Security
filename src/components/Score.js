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
    return this.getMyScore() + this.getScore(this.state.me.getAllUnsavedScans());
  }

  getEnemyScanScore() {}

  getScore(fishIds) {
    let score = 0;
    const creatures = this.state.creatures;

    const fishes = fishIds.filter((id) => creatures.has(id)).map((id) => creatures.get(id));

    // Main score
    fishes.forEach((fish) => {
      score += fish.type + 1;
    });

    // All by type
    const typeCount = fishes.reduce((acc, fish) => {
      acc[fish.type] = (acc[fish.type] || 0) + 1;
      return acc;
    }, {});

    const series = Object.keys(typeCount)
      .filter((type) => typeCount[type] === 4)
      .map(Number);

    console.warn(series);
    score += series.length * 4;

    // All by color
    const colorCount = fishes.reduce((acc, fish) => {
      acc[fish.color] = (acc[fish.color] || 0) + 1;
      return acc;
    }, {});

    const colors = Object.keys(colorCount)
      .filter((color) => colorCount[color] === 3)
      .map(Number);

    console.warn(colors);
    score += colors.length * 3;

    console.warn("score", score);
    return score;
  }
}
