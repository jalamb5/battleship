import Ship from './ships';

export default class Gameboard {
  constructor() {
    this.allShips = [];
    this.missedShots = [];
  };

  placeShip(size, firstCoord, orientation='horizontal') {
    const coordinates = this.#buildCoordinates(size, firstCoord, orientation);
    const newShip = new Ship(size);
    const shipEntry = [newShip, coordinates];
    this.allShips.push(shipEntry);
    return coordinates;
  }

  // receiveAttack function takes coordinates, determines whether or not the attack hit a ship
  // then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot.
  receiveAttack(coordinate) {
    const ship = this.#findShip(coordinate);
    if (ship) {
      ship.hit();
      return true;
    } else {
      this.missedShots.push(coordinate);
      return false;
    }
  }

  gameOver() {
    let allSunk = true;
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

  #findShip(coordinate) {
    let hitShip = false;
    this.allShips.forEach(ship => {
      if (ship[1].some((x) => x[0] === coordinate[0] && x[1] === coordinate[1])) {
        hitShip = ship[0];
    }})
    return hitShip;
  }
}
