import Ship from './ships';

export default class Gameboard {
  constructor() {
    this.allShips = [];
  };

  placeShip(size, coordinates) {
    const newShip = new Ship(size);
    const obj = { newShip : coordinates };
    this.allShips.push(obj);
  }
}

module.exports = Gameboard;
