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
      } else {
        this.#endGame();
      }
    };

    playRound();
  }

  #endGame() {
    const winner = this.#gameOver() === this.human ? 'You' : 'Computer';
    const aiGridItems = document.querySelectorAll(".grid-item.ai");
    const humanGridItems = document.querySelectorAll(".grid-item.human");
    // display the winner
    this.page.displayWinner(winner);
    // reveal all boards
    aiGridItems.forEach(item => {
      let coords = item.dataset.coordinates
      .split(",")
      .map((x) => parseInt(x, 10));
      this.#aiBoardAttack(coords, item);
    })
    humanGridItems.forEach(item => {
      if (!item.classList.contains("ship") && !item.classList.contains("hit")) {
        this.page.miss(item);
      }
    })
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
        // Show ship on screen, if valid placement.
        if (coordinates) {
          coordinates.forEach((coord) => {
            this.page.ship(this.#findGridItem(coord, "human"));
          });
          placementCounter++;
          this.page.updatePlayerMsg(placementCounter);
        // Display error message if placement goes off board or conflicts with existing ship.
      } else {
        this.page.updatePlayerMsg(placementCounter, "error");
      }
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
          this.#aiBoardAttack(coords, item);
        }
      });
    });
  }

  #aiBoardAttack(coords, gridItem) {
    let attackedShip = this.ai.board.receiveAttack(coords)
    if (attackedShip) {
      // if a ship is hit, mark square as red.
      this.page.hit(gridItem);
      this.round++;
      // if ship is sunk, display global message.
      if (attackedShip.isSunk() && !this.#gameOver()) {
        this.page.displaySunkMessage(attackedShip);
      }
    } else {
      // if a ship is not hit, mark square as blue.
      this.page.miss(gridItem);
      this.round++;
    }
  }

  #aiShips() {
    const shipSizes = [5, 4, 3, 3, 2];
    shipSizes.forEach((ship) => {
      let coordinates = this.#aiShipPlacement(ship);

      while (!coordinates) {
        coordinates = this.#aiShipPlacement(ship);
      }

      // show ai ships while testing.
      // coordinates.forEach((coord) => {
      //   this.page.ship(this.#findGridItem(coord, "ai"));
      // });
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
      let gridItem = this.#findGridItem(coord, 'human');
      let attackedShip = this.human.board.receiveAttack(coord)
      if (attackedShip) {
        // if a ship is hit, mark square as red.
        this.page.hit(gridItem);
        this.round++;
        // if ship is sunk, display global message.
        if (attackedShip.isSunk()) {
          this.page.displaySunkMessage(attackedShip);
        }
      } else {
        // if a ship is not hit, mark square as blue.
        this.page.miss(gridItem);
        this.round++;
      }
    }
  }

  #aiCoordSelector(previousCoord=null, accumulator=0) {
    const human = this.human.board;
    let coord = [];
    // if a ship has been hit, use most recent hit to determine next shot.
    if (human.hitShots.length > 0 && accumulator < 4) {
      const hitCoord = human.hitShots.at(-1);
      const lastShot = previousCoord === null ? human.allShots.at(-1) : previousCoord;
      if (lastShot[0] === hitCoord[0] && lastShot[1] === hitCoord[1]) {
        coord = [hitCoord[0] + 1, hitCoord[1]];
      } else if (lastShot[0] === hitCoord[0] + 1 && lastShot[1] === hitCoord[1]) {
        coord = [hitCoord[0] - 1, hitCoord[1]];
      } else if (lastShot[0] === hitCoord[0] - 1 && lastShot[1] === hitCoord[1]) {
        coord = [hitCoord[0], hitCoord[1] + 1];
      } else if (lastShot[0] === hitCoord[0] && lastShot[1] === hitCoord[1] + 1) {
        coord = [hitCoord[0], hitCoord[1] - 1];
      } else {
        coord = [this.#randomNum(10), this.#randomNum(10)];
      }
    } else {
      // if no ship has been hit, use random coord.
      coord = [this.#randomNum(10), this.#randomNum(10)];
    }

    // Check if coord has already been used, if so rerun function.
    human.allShots.forEach(shot => {
      if (shot[0] === coord[0] && shot[1] === coord[1]) {
        coord = this.#aiCoordSelector(coord, accumulator + 1);
      }
    })
    // Check if coord is on board, if not rerun.
    if (coord[0] > 9 || coord[0] < 0 || coord[1] > 9 || coord[1] < 0) {
      coord = this.#aiCoordSelector(coord, accumulator + 1);
    }
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
    // AI wins if human board is game over.
    if (this.human.board.gameOver()) {
      return this.ai;
    // Human wins if ai board is game over.
    } else if (this.ai.board.gameOver()) {
      return this.human;
    // Else game continues.
    } else {
      return false;
    }
  }
}
