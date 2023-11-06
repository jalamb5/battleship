import Player from './players';
import DOMbuilder from './domBuilder';

export default class Gameloop {
  constructor() {
    this.human = new Player(true);
    this.ai = new Player(false);
    this.players = [this.human, this.ai];
    this.page = new DOMbuilder;
    this.#aiShips();
  }

  aiGridListeners() {
    const gridItems = document.querySelectorAll('.grid-item.ai');
    gridItems.forEach((item) => {
      item.addEventListener("click", () => {
        let coords = item.dataset.coordinates.split(',').map((x) => parseInt(x, 10));
        if (this.ai.board.receiveAttack(coords)) {
          // if a ship is hit then ...
          this.page.hit(item);
        } else {
          // if a ship is not hit then ...
          this.page.miss(item);
        }
      })
    })
  }

  #aiShips() {
    const shipSizes = [5, 4, 3, 3, 2];
    shipSizes.forEach((ship) => {
      let coord = [this.#randomNum(10 - ship), this.#randomNum(10 - ship)];
      let orientation = this.#randomNum(2) === 0 ? 'horizontal' : 'vertical';
      const shipLocations = this.ai.board.placeShip(ship, coord, orientation);
      shipLocations.forEach((location) => {
        this.page.ship(this.#findGridItem(location, 'ai'));
      })
    })
  }

  #randomNum(max) {
    return Math.floor(Math.random() * max);
  }

  #findGridItem(coords, player) {
    const gridItems = document.querySelectorAll(`.grid-item.${player}`);
    let foundItem = false;
    gridItems.forEach((gridItem) => {
      if (gridItem.dataset.coordinates === coords.toString()) {
        foundItem = gridItem;
      }
    })
    return foundItem;
  }
}
