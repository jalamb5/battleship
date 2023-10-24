import Gameboard from "./gameboard";

export default class Player {
  constructor(human=true) {
    this.board = new Gameboard;
    this.isHuman = human;
    this.previousPlays = [];
  };

  attack(player, coordinate) {
    if (!this.isHuman) {
      coordinate = this.#aiAttack(player.board);
    }

    this.previousPlays.push(coordinate);
    player.board.receiveAttack(coordinate);
  }

  #aiAttack(board) {
    let coordinate = this.#randomCoord();
    if (this.previousPlays.includes(coordinate)) {
      this.#aiAttack(board);
    } else {
      return coordinate;
    }
  }

  // Generate random coordinates between 0 - 9.
  #randomCoord() {
    return [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
  }
}

module.exports = Player;
