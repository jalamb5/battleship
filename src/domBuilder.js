export default class DOMbuilder {
  constructor() {
    this.gameContainer = document.getElementById('game-container');
    // create containers for elements:
      // 2 player containers
    this.playerContainer = document.createElement('div');
    this.aiContainer = document.createElement('div');
      // each container contains:
        // Player title
        const playerTitle = document.createElement('h2')
        playerTitle.textContent = 'Player';

        const aiTitle = document.createElement('h2');
        aiTitle.textContent = 'Computer';

        this.playerContainer.appendChild(playerTitle);
        this.aiContainer.appendChild(aiTitle);
        // Game board grid (10 x 10)
    this.gameContainer.append(this.playerContainer, this.aiContainer);
    // setup game board grids
  }
}
