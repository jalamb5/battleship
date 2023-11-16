export default class DOMbuilder {
  constructor() {
    const ships = {'Carrier': 5, 'Battleship': 4, 'Destroyer': 3, 'Submarine': 3, 'Patrol Boat': 2}
    this.shipNames = ['Carrier', 'Battleship', 'Destroyer', 'Submarine', 'Patrol Boat'];
    this.shipSizes = [5, 4, 3, 3, 2];

    this.gameContainer = document.getElementById('game-container');
    // create containers for elements:
      // 2 player containers
    this.playerContainer = document.createElement('div');
    this.aiContainer = document.createElement('div');
    this.globalMsg = document.createElement('div');
    this.globalMsg.id = 'global-msg';
    this.playerContainer.classList.add('player-container');
    this.aiContainer.classList.add('player-container');
      // each container contains:
        // Player title
        const playerTitle = document.createElement('h2')
        playerTitle.textContent = 'Player';

        const aiTitle = document.createElement('h2');
        aiTitle.textContent = 'Computer';

        // Game board grid (10 x 10)
        const playerGrid = this.#gridPopulate('human');
        const aiGrid = this.#gridPopulate('ai');

        this.playerMsg = document.createTextNode('');
        this.updatePlayerMsg(0);
        this.playerMsg.id = 'playerMsg';

        const orientationBtn = document.createElement('button');
        orientationBtn.textContent = 'horizontal';
        orientationBtn.id = 'orientationBtn';

      this.playerContainer.append(playerTitle, playerGrid, this.playerMsg, orientationBtn);
      this.aiContainer.append(aiTitle, aiGrid);

    this.gameContainer.append(this.playerContainer, this.aiContainer, this.globalMsg);
  }

  hit(gridItem) {
    gridItem.classList.remove('ship');
    gridItem.classList.add('hit');
  };

  miss(gridItem) {
    gridItem.classList.add('miss');
  }

  ship(gridItem) {
    gridItem.classList.add('ship');
  };

  hideElement(element) {
    element.style.display = 'none';
  }

  updatePlayerMsg(counter, error=null) {
    let msg = this.playerMsg;
    if (error) {
      msg.textContent = 'Invalid placement location';
      setTimeout(() => {
        this.updatePlayerMsg(counter);
      }, 1000)
    } else if (counter < 5) {
      msg.textContent = `Click grid to place ${this.shipNames[counter]} (size: ${this.shipSizes[counter]})`
    }
    else {
      this.#clearMsg(msg);
    }
  }

  displaySunkMessage(ship, player) {
    const sunkMsg = document.createTextNode(`${player} ${ship.shipType} has been sunk.`)
    this.globalMsg.appendChild(sunkMsg);
    setTimeout(() => {
      this.#clearMsg(sunkMsg);
    }, 3000);
  }

  displayWinner(winner) {
    const winnerMsg = document.createTextNode(`Winner: ${winner}!`);
    this.globalMsg.appendChild(winnerMsg);
  }

  #clearMsg(msgElement) {
    msgElement.remove();
  }

  #gridPopulate(player) {
    const grid = document.createElement('div');
    grid.classList.add('grid', player);

    for (let i = 0; i < 100; i++) {
      const gridItem = document.createElement('div');
      gridItem.classList.add('grid-item', player);
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
