import Player from "./players";
import DOMbuilder from "./domBuilder";

export default class Gameloop {
  constructor() {
    this.human = new Player(true);
    this.ai = new Player(false);
    this.players = [this.human, this.ai];
    this.page = new DOMbuilder();
    this.shipTypes = {'Carrier': 5, 'Battleship': 4, 'Destroyer': 3, 'Submarine': 3, 'Patrol Boat': 2}
    this.#aiShips();
  }

  humanGridListeners() {
    this.#orientationBtnListener();
    const orientationBtn = document.getElementById('orientationBtn');
    const gridItems = document.querySelectorAll(".grid-item.human");
    let placementCounter = 0;
    let shipSize = [5, 4, 3, 3, 2];

    gridItems.forEach((item) => {
      item.addEventListener("click", () => {
        if (placementCounter >= shipSize.length - 1) {
          this.page.hideElement(orientationBtn);
        }
        const orientation = orientationBtn.textContent;
        let coords = item.dataset.coordinates
          .split(",")
          .map((x) => parseInt(x, 10));
        let coordinates = this.human.board.placeShip(shipSize[placementCounter], coords, orientation);
        // Show ship on screen.
        coordinates.forEach((coord) => {
          this.page.ship(this.#findGridItem(coord, "human"));
        });
        placementCounter++;
        this.page.updatePlayerMsg(placementCounter);
      });
    });
  }

  // async humanBtnListener() {
  //   const humanShips = document.getElementById('playerShipsBtn');

  //   humanShips.addEventListener('click', async () => {
  //     this.#orientationBtnListener();
  //     for (let entry of Object.entries(this.shipTypes)) {
  //       const [shipType, shipSize] = entry;
  //       humanShips.textContent = `Place ${shipType}`;
  //       humanShips.dataset.shipSize = shipSize;
  //       await this.#humanGridListeners(shipSize);
  //     }
  //   })
  // }

  // async #humanGridListeners(shipSize) {
  //   const gridItems = document.querySelectorAll(".grid-item.human");

  //   gridItems.forEach(async (item) => {
  //     item.addEventListener("click", async () => {
  //       let coords = item.dataset.coordinates
  //         .split(",")
  //         .map((x) => parseInt(x, 10));
  //       this.human.board.placeShip(shipSize, coords, orientation);
  //     }).then(response => {
  //       return true;
  //     })
  //   });
  // }

  // async #humanShipPlacement(shipSize) {
  //   const orientation = document.getElementById('orientationBtn').textContent;
  //   const coord = this.#humanGridListeners();
  //   this.human.board.placeShip(shipSize, coord, orientation)
  // }

  #orientationBtnListener() {
    const orientation = document.getElementById('orientationBtn');
    orientation.display = 'block';

    orientation.addEventListener('click', () => {
      let text = orientation.textContent;
      orientation.textContent = text === 'horizontal' ? 'vertical' : 'horizontal';
    })
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

      // show ai ships while testing.
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
