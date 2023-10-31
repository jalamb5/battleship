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
        const playerGrid = document.createElement('div');
        const aiGrid = document.createElement('div');
        playerGrid.classList.add('grid');
        aiGrid.classList.add('grid');

      this.playerContainer.append(playerTitle, playerGrid);
      this.aiContainer.append(aiTitle, aiGrid);

    this.gameContainer.append(this.playerContainer, this.aiContainer);
  }
}
