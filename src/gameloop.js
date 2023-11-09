import Player from "./players";
import DOMbuilder from "./domBuilder";

export default class Gameloop {
  constructor() {
    this.human = new Player(true);
    this.ai = new Player(false);
    this.players = [this.human, this.ai];
    this.currentPlayer = this.ai;
    this.round = null;
    this.page = new DOMbuilder();
  }

  start() {
    this.#aiShips();
    this.aiGridListeners();
    this.humanGridListeners();

    let currentRound = this.round;

    const playRound = () => {
      if (!this.#gameOver()) {
        this.#aiAttack();
        if (currentRound !== this.round) {
          this.currentPlayer = this.currentPlayer === this.human ? this.ai : this.human;
          currentRound = this.round;
        }
        setTimeout(playRound, 0); // Schedule the next round after a very short delay
      }
    };

    playRound();
  }


  humanGridListeners() {
    this.#orientationBtnListener();
    const orientationBtn = document.getElementById("orientationBtn");
    const gridItems = document.querySelectorAll(".grid-item.human");
    let placementCounter = 0;
    let shipSize = [5, 4, 3, 3, 2];

    gridItems.forEach((item) => {
      item.addEventListener("click", () => {
        if (placementCounter >= shipSize.length - 1 && !this.round) {
          this.page.hideElement(orientationBtn);
          this.round = 0;
        }
        const orientation = orientationBtn.textContent;
        let coords = item.dataset.coordinates
          .split(",")
          .map((x) => parseInt(x, 10));
        let coordinates = this.human.board.placeShip(
          shipSize[placementCounter],
          coords,
          orientation
        );
        // Show ship on screen.
        coordinates.forEach((coord) => {
          this.page.ship(this.#findGridItem(coord, "human"));
        });
        placementCounter++;
        this.page.updatePlayerMsg(placementCounter);
      });
    });
  }

  #orientationBtnListener() {
    const orientation = document.getElementById("orientationBtn");
    orientation.display = "block";

    orientation.addEventListener("click", () => {
      let text = orientation.textContent;
      orientation.textContent =
        text === "horizontal" ? "vertical" : "horizontal";
    });
  }

  aiGridListeners() {
    const gridItems = document.querySelectorAll(".grid-item.ai");
    gridItems.forEach((item) => {
      item.addEventListener("click", () => {
        if (this.currentPlayer === this.human) {
          let coords = item.dataset.coordinates
            .split(",")
            .map((x) => parseInt(x, 10));
          if (this.ai.board.receiveAttack(coords)) {
            // if a ship is hit then ...
            this.page.hit(item);
            this.round++;
          } else {
            // if a ship is not hit then ...
            this.page.miss(item);
            this.round++;
          }
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

  #aiAttack() {
    if (this.currentPlayer === this.ai && this.round) {
      let coord = this.#aiCoordSelector();
      let item = this.#findGridItem(coord, 'human');
      if (this.human.board.receiveAttack(coord)) {
        // if a ship is hit then ...
        this.page.hit(item);
        this.round++;
      } else {
        // if a ship is not hit then ...
        this.page.miss(item);
        this.round++;
      }
    }
  }

  #aiCoordSelector() {
    let coord = [this.#randomNum(10), this.#randomNum(10)];
    // Check if coord has already been used, if so rerun function.
    this.human.board.allShots.forEach(shot => {
      if (shot[0] === coord[0] && shot[1] === coord[1]) {
        return this.#aiCoordSelector();
      }
    })
    return coord;
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

  #gameOver() {
    if (this.human.board.gameOver() || this.ai.board.gameOver()) {
      return true;
    } else {
      return false;
    }
  }
}
