export default class Ship {
  constructor(size) {
    const shipTypes = {
      5: "Carrier",
      4: "Battleship",
      3: "Destroyer",
      3: "Submarine",
      2: "Patrol Boat",
    };
    this.length = size;
    this.shipType = shipTypes[size];
    this.hits = 0;
    this.sunk = false;
  }

  hit() {
    this.hits++;
    this.isSunk();
  }

  isSunk() {
    if (this.hits === this.length) {
      this.sunk = true;
    }
    return this.sunk;
  }
}
