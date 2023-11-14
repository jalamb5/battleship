import Ship from './ships';

export default class Gameboard {
  constructor() {
    this.allShips = [];
    this.missedShots = [];
    this.allShots = [];
  };

  placeShip(size, firstCoord, orientation='horizontal') {
    const coordinates = this.#buildCoordinates(size, firstCoord, orientation);
    if (this.#validateCoordinates(coordinates)) {
      const newShip = new Ship(size);
      const shipEntry = [newShip, coordinates];
      this.allShips.push(shipEntry);
      return coordinates;
    } else {
      return false;
    }
  }

  // receiveAttack function takes coordinates, determines whether or not the attack hit a ship
  // then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot.
  receiveAttack(coordinate) {
    this.allShots.push(coordinate);
    const ship = this.#findShip(coordinate);
    if (ship) {
      ship.hit();
      return ship;
    } else {
      this.missedShots.push(coordinate);
      return false;
    }
  }

  gameOver() {
    let allSunk = true;
    // If ships haven't yet been placed, return false.
    if (this.allShips.length === 0) {
      return false;
    }
    this.allShips.forEach(ship => {
      if (!ship[0].isSunk()) {
        allSunk = false;
      }
    })
    return allSunk;
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

  #validateCoordinates(coordinates) {
    let validCoords = true;
    coordinates.forEach((coord) => {
      // If a ship already exists at location, reject it.
      if (this.#findShip(coord) || coord[0] > 9 || coord[1] > 9) {
        validCoords = false;
      }
    })
    return validCoords;
  }

  #findShip(coordinate) {
    let foundShip = false;
    this.allShips.forEach(ship => {
      if (ship[1].some((x) => x[0] === coordinate[0] && x[1] === coordinate[1])) {
        foundShip = ship[0];
    }})
    return foundShip;
  }
}
