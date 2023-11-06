import Player from "./players";
import DOMbuilder from "./domBuilder";

export default class Gameloop {
  constructor() {
    this.human = new Player(true);
    this.ai = new Player(false);
    this.players = [this.human, this.ai];
    this.page = new DOMbuilder();
    this.#aiShips();
  }

  aiGridListeners() {
    const gridItems = document.querySelectorAll(".grid-item.ai");
    gridItems.forEach((item) => {
      item.addEventListener("click", () => {
        let coords = item.dataset.coordinates
          .split(",")
          .map((x) => parseInt(x, 10));
        if (this.ai.board.receiveAttack(coords)) {
          // if a ship is hit then ...
          this.page.hit(item);
        } else {
          // if a ship is not hit then ...
          this.page.miss(item);
        }
      });
    });
  }

  #aiShips() {
    const shipSizes = [5, 4, 3, 3, 2];
    shipSizes.forEach((ship) => {
      let coordinates = this.#aiShipPlacement(ship);

      while (!coordinates) {
        coordinates = this.#aiShipPlacement(ship);
      }

      coordinates.forEach((coord) => {
        this.page.ship(this.#findGridItem(coord, "ai"));
      });
    });
  }

  #aiShipPlacement(ship) {
    let orientation = this.#randomNum(2) === 0 ? "horizontal" : "vertical";
    let coord =
      orientation === "horizontal"
        ? [this.#randomNum(10 - ship), this.#randomNum(10)]
        : [this.#randomNum(10), this.#randomNum(10 - ship)];
    let coordinates = this.ai.board.placeShip(ship, coord, orientation);
    return coordinates;
  }

  #randomNum(max) {
    return Math.floor(Math.random() * max);
  }

  #findGridItem(coord, player) {
    const gridItems = document.querySelectorAll(`.grid-item.${player}`);
    let foundItem = false;
    gridItems.forEach((gridItem) => {
      if (gridItem.dataset.coordinates === coord.toString()) {
        foundItem = gridItem;
      }
    });
    return foundItem;
  }
}
