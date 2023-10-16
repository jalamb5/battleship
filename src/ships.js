class Ship {
  constructor(size) {
    this.length = size;
    this.hits = 0;
    this.sunk = false;
  }

  hit() {
    this.hits++;
    if (this.hits === this.length) {
      this.sunk = true;
    }
  }
}

module.exports = Ship;
