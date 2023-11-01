export default class DOMbuilder {
  constructor() {
    this.gameContainer = document.getElementById('game-container');
    // create containers for elements:
      // 2 player containers
    this.playerContainer = document.createElement('div');
    this.aiContainer = document.createElement('div');
    this.playerContainer.classList.add('player-container');
    this.aiContainer.classList.add('player-container');
      // each container contains:
        // Player title
        const playerTitle = document.createElement('h2')
        playerTitle.textContent = 'Player';

        const aiTitle = document.createElement('h2');
        aiTitle.textContent = 'Computer';

        // Game board grid (10 x 10)
        const playerGrid = this.#gridPopulate();
        const aiGrid = this.#gridPopulate();

      this.playerContainer.append(playerTitle, playerGrid);
      this.aiContainer.append(aiTitle, aiGrid);

    this.gameContainer.append(this.playerContainer, this.aiContainer);
  }

  #gridPopulate() {
    const grid = document.createElement('div');
    grid.classList.add('grid');

    for (let i = 0; i < 100; i++) {
      const gridItem = document.createElement('div');
      gridItem.classList.add('grid-item');
      gridItem.dataset.coordinates = this.#coordsPopulate(i);
      grid.appendChild(gridItem);
    }
    return grid;
  }

  #coordsPopulate(i) {
    if (i < 10) {
      return [i, 0];
    } else {
      let digits = i.toString().split('');
      return [digits[1], digits[0]];
    }
  }
}
