import Ship from './ships';

export default class Gameboard {
  constructor() {
    this.allShips = [];
  };

  placeShip(size, firstCoord, orientation='horizontal') {
    const coordinates = this.#buildCoordinates(size, firstCoord, orientation);
    const newShip = new Ship(size);
    const shipEntry = [newShip, coordinates];
    this.allShips.push(shipEntry);
  }

  #buildCoordinates(size, firstCoord, orientation) {
    let coordinates = [];
    for (let i = 0; i < size; i++) {
      if (orientation === 'horizontal') {
        coordinates.push([firstCoord[0] + i, firstCoord[1]]);
      } else {
        coordinates.push([firstCoord[0], firstCoord[1] + i]);
      }
    }
    return coordinates;
  }
}

module.exports = Gameboard;

