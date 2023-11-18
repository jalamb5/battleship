/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/domBuilder.js":
/*!***************************!*\
  !*** ./src/domBuilder.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DOMbuilder)
/* harmony export */ });
class DOMbuilder {
  constructor() {
    const ships = {
      Carrier: 5,
      Battleship: 4,
      Destroyer: 3,
      Submarine: 3,
      "Patrol Boat": 2
    };
    this.shipNames = ["Carrier", "Battleship", "Destroyer", "Submarine", "Patrol Boat"];
    this.shipSizes = [5, 4, 3, 3, 2];
    this.gameContainer = document.getElementById("game-container");
    // create containers for elements:
    // 2 player containers
    this.playerContainer = document.createElement("div");
    this.aiContainer = document.createElement("div");
    this.globalMsg = document.createElement("div");
    this.globalMsg.id = "global-msg";
    this.playerContainer.classList.add("player-container");
    this.aiContainer.classList.add("player-container");
    // each container contains:
    // Player title
    const playerTitle = document.createElement("h2");
    playerTitle.textContent = "Player";
    const aiTitle = document.createElement("h2");
    aiTitle.textContent = "Computer";

    // Game board grid (10 x 10)
    const playerGrid = this.#gridPopulate("human");
    const aiGrid = this.#gridPopulate("ai");
    this.playerMsg = document.createElement("p");
    this.playerMsg.id = "player-msg";
    this.updatePlayerMsg(0);
    const orientationBtn = document.createElement("button");
    orientationBtn.textContent = "horizontal";
    orientationBtn.id = "orientation-btn";
    this.playerContainer.append(playerTitle, playerGrid, this.playerMsg, orientationBtn);
    this.aiContainer.append(aiTitle, aiGrid);
    this.gameContainer.append(this.playerContainer, this.aiContainer, this.globalMsg);
  }
  hit(gridItem) {
    gridItem.classList.remove("ship");
    gridItem.classList.add("hit");
  }
  miss(gridItem) {
    gridItem.classList.add("miss");
  }
  ship(gridItem) {
    gridItem.classList.add("ship");
  }
  hideElement(element) {
    element.style.display = "none";
  }
  updatePlayerMsg(counter) {
    let error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    let msg = this.playerMsg;
    if (error) {
      msg.textContent = "Invalid placement location";
      setTimeout(() => {
        this.updatePlayerMsg(counter);
      }, 1000);
    } else if (counter < 5) {
      msg.textContent = `Click grid to place ${this.shipNames[counter]} (size: ${this.shipSizes[counter]})`;
    } else {
      this.#clearMsg(msg);
    }
  }
  displaySunkMessage(ship, player) {
    const sunkMsg = document.createElement("p");
    sunkMsg.textContent = `${player} ${ship.shipType} has been sunk.`;
    this.globalMsg.appendChild(sunkMsg);
    setTimeout(() => {
      this.#clearMsg(sunkMsg);
    }, 3000);
  }
  displayWinner(winner) {
    const winnerMsg = document.createTextNode(`Winner: ${winner}!`);
    this.globalMsg.appendChild(winnerMsg);
  }
  #clearMsg(msgElement) {
    msgElement.remove();
  }
  #gridPopulate(player) {
    const grid = document.createElement("div");
    grid.classList.add("grid", player);
    for (let i = 0; i < 100; i++) {
      const gridItem = document.createElement("div");
      gridItem.classList.add("grid-item", player);
      gridItem.dataset.coordinates = this.#coordsPopulate(i);
      grid.appendChild(gridItem);
    }
    return grid;
  }
  #coordsPopulate(i) {
    if (i < 10) {
      return [i, 0];
    } else {
      let digits = i.toString().split("");
      return [digits[1], digits[0]];
    }
  }
}

/***/ }),

/***/ "./src/gameboard.js":
/*!**************************!*\
  !*** ./src/gameboard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Gameboard)
/* harmony export */ });
/* harmony import */ var _ships__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ships */ "./src/ships.js");

class Gameboard {
  constructor() {
    this.allShips = [];
    this.missedShots = [];
    this.hitShots = [];
    this.allShots = [];
  }
  placeShip(size, firstCoord) {
    let orientation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "horizontal";
    orientation = orientation.toLowerCase();
    const coordinates = this.#buildCoordinates(size, firstCoord, orientation);
    if (this.#validateCoordinates(coordinates)) {
      const newShip = new _ships__WEBPACK_IMPORTED_MODULE_0__["default"](size);
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
      this.hitShots.push(coordinate);
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
    });
    return allSunk;
  }
  #buildCoordinates(size, firstCoord, orientation) {
    let coordinates = [];
    for (let i = 0; i < size; i++) {
      if (orientation === "horizontal") {
        coordinates.push([firstCoord[0] + i, firstCoord[1]]);
      } else {
        coordinates.push([firstCoord[0], firstCoord[1] + i]);
      }
    }
    return coordinates;
  }
  #validateCoordinates(coordinates) {
    let validCoords = true;
    coordinates.forEach(coord => {
      // If a ship already exists at location, reject it.
      if (this.#findShip(coord) || coord[0] > 9 || coord[1] > 9) {
        validCoords = false;
      }
    });
    return validCoords;
  }
  #findShip(coordinate) {
    let foundShip = false;
    this.allShips.forEach(ship => {
      if (ship[1].some(x => x[0] === coordinate[0] && x[1] === coordinate[1])) {
        foundShip = ship[0];
      }
    });
    return foundShip;
  }
}

/***/ }),

/***/ "./src/gameloop.js":
/*!*************************!*\
  !*** ./src/gameloop.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Gameloop)
/* harmony export */ });
/* harmony import */ var _players__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./players */ "./src/players.js");
/* harmony import */ var _domBuilder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./domBuilder */ "./src/domBuilder.js");


class Gameloop {
  constructor() {
    this.human = new _players__WEBPACK_IMPORTED_MODULE_0__["default"](true);
    this.ai = new _players__WEBPACK_IMPORTED_MODULE_0__["default"](false);
    this.players = [this.human, this.ai];
    this.currentPlayer = this.ai;
    this.round = null;
    this.page = new _domBuilder__WEBPACK_IMPORTED_MODULE_1__["default"]();
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
    const winner = this.#gameOver() === this.human ? "You" : "Computer";
    const aiGridItems = document.querySelectorAll(".grid-item.ai");
    const humanGridItems = document.querySelectorAll(".grid-item.human");
    // display the winner
    this.page.displayWinner(winner);
    // reveal all boards
    aiGridItems.forEach(item => {
      let coords = item.dataset.coordinates.split(",").map(x => parseInt(x, 10));
      this.#aiBoardAttack(coords, item);
    });
    humanGridItems.forEach(item => {
      if (!item.classList.contains("ship") && !item.classList.contains("hit")) {
        this.page.miss(item);
      }
    });
  }
  humanGridListeners() {
    this.#orientationBtnListener();
    const orientationBtn = document.getElementById("orientation-btn");
    const gridItems = document.querySelectorAll(".grid-item.human");
    let placementCounter = 0;
    let shipSize = [5, 4, 3, 3, 2];
    gridItems.forEach(item => {
      item.addEventListener("click", () => {
        if (placementCounter >= shipSize.length - 1 && !this.round) {
          this.page.hideElement(orientationBtn);
          this.round = 0;
        }
        const orientation = orientationBtn.textContent;
        let coords = item.dataset.coordinates.split(",").map(x => parseInt(x, 10));
        let coordinates = this.human.board.placeShip(shipSize[placementCounter], coords, orientation);
        // Show ship on screen, if valid placement.
        if (coordinates) {
          coordinates.forEach(coord => {
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
    const orientation = document.getElementById("orientation-btn");
    orientation.display = "block";
    orientation.addEventListener("click", () => {
      let text = orientation.textContent;
      orientation.textContent = text === "horizontal" ? "vertical" : "horizontal";
    });
  }
  aiGridListeners() {
    const gridItems = document.querySelectorAll(".grid-item.ai");
    gridItems.forEach(item => {
      item.addEventListener("click", () => {
        if (this.currentPlayer === this.human && this.#validItem(item)) {
          let coords = item.dataset.coordinates.split(",").map(x => parseInt(x, 10));
          this.#aiBoardAttack(coords, item);
        }
      });
    });
  }

  // Prevent accidentally attacking previously clicked grid item.
  #validItem(gridItem) {
    if (gridItem.classList.contains("hit") || gridItem.classList.contains("miss")) {
      return false;
    } else {
      return true;
    }
  }
  #aiBoardAttack(coords, gridItem) {
    let attackedShip = this.ai.board.receiveAttack(coords);
    if (attackedShip) {
      // if a ship is hit, mark square as red.
      this.page.hit(gridItem);
      this.round++;
      // if ship is sunk, display global message.
      if (attackedShip.isSunk() && !this.#gameOver()) {
        this.page.displaySunkMessage(attackedShip, "Computer's");
      }
    } else {
      // if a ship is not hit, mark square as blue.
      this.page.miss(gridItem);
      this.round++;
    }
  }
  #aiShips() {
    const shipSizes = [5, 4, 3, 3, 2];
    shipSizes.forEach(ship => {
      let coordinates = this.#aiShipPlacement(ship);
      // Rerun placement until valid placement found.
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
    let coord = orientation === "horizontal" ? [this.#randomNum(10 - ship), this.#randomNum(10)] : [this.#randomNum(10), this.#randomNum(10 - ship)];
    let coordinates = this.ai.board.placeShip(ship, coord, orientation);
    return coordinates;
  }
  #aiAttack() {
    if (this.currentPlayer === this.ai && this.round) {
      let coord = this.#aiCoordSelector();
      let gridItem = this.#findGridItem(coord, "human");
      let attackedShip = this.human.board.receiveAttack(coord);
      if (attackedShip) {
        // if a ship is hit, mark square as red.
        this.page.hit(gridItem);
        this.round++;
        // if ship is sunk, display global message.
        if (attackedShip.isSunk()) {
          this.page.displaySunkMessage(attackedShip, "Player's");
        }
      } else {
        // if a ship is not hit, mark square as blue.
        this.page.miss(gridItem);
        this.round++;
      }
    }
  }
  #aiCoordSelector() {
    let previousCoord = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    let accumulator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
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
    });
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
    gridItems.forEach(gridItem => {
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

/***/ }),

/***/ "./src/players.js":
/*!************************!*\
  !*** ./src/players.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");

class Player {
  constructor() {
    let human = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    this.board = new _gameboard__WEBPACK_IMPORTED_MODULE_0__["default"]();
    this.isHuman = human;
    this.previousPlays = [];
  }
  attack(player, coordinate) {
    if (!this.isHuman) {
      coordinate = this.#aiAttack(player.board);
    }
    this.previousPlays.push(coordinate);
    player.board.receiveAttack(coordinate);
  }
  #aiAttack(board) {
    let coordinate = this.#randomCoord();
    if (this.previousPlays.includes(coordinate)) {
      this.#aiAttack(board);
    } else {
      return coordinate;
    }
  }

  // Generate random coordinates between 0 - 9.
  #randomCoord() {
    return [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
  }
}

/***/ }),

/***/ "./src/ships.js":
/*!**********************!*\
  !*** ./src/ships.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Ship)
/* harmony export */ });
class Ship {
  constructor(size) {
    const shipTypes = {
      5: "Carrier",
      4: "Battleship",
      3: "Destroyer",
      3: "Submarine",
      2: "Patrol Boat"
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

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***********************!*\
  !*** ./src/script.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _gameloop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameloop */ "./src/gameloop.js");

const game = new _gameloop__WEBPACK_IMPORTED_MODULE_0__["default"]();
game.start();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFlLE1BQU1BLFVBQVUsQ0FBQztFQUM5QkMsV0FBV0EsQ0FBQSxFQUFHO0lBQ1osTUFBTUMsS0FBSyxHQUFHO01BQ1pDLE9BQU8sRUFBRSxDQUFDO01BQ1ZDLFVBQVUsRUFBRSxDQUFDO01BQ2JDLFNBQVMsRUFBRSxDQUFDO01BQ1pDLFNBQVMsRUFBRSxDQUFDO01BQ1osYUFBYSxFQUFFO0lBQ2pCLENBQUM7SUFDRCxJQUFJLENBQUNDLFNBQVMsR0FBRyxDQUNmLFNBQVMsRUFDVCxZQUFZLEVBQ1osV0FBVyxFQUNYLFdBQVcsRUFDWCxhQUFhLENBQ2Q7SUFDRCxJQUFJLENBQUNDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFaEMsSUFBSSxDQUFDQyxhQUFhLEdBQUdDLFFBQVEsQ0FBQ0MsY0FBYyxDQUFDLGdCQUFnQixDQUFDO0lBQzlEO0lBQ0E7SUFDQSxJQUFJLENBQUNDLGVBQWUsR0FBR0YsUUFBUSxDQUFDRyxhQUFhLENBQUMsS0FBSyxDQUFDO0lBQ3BELElBQUksQ0FBQ0MsV0FBVyxHQUFHSixRQUFRLENBQUNHLGFBQWEsQ0FBQyxLQUFLLENBQUM7SUFDaEQsSUFBSSxDQUFDRSxTQUFTLEdBQUdMLFFBQVEsQ0FBQ0csYUFBYSxDQUFDLEtBQUssQ0FBQztJQUM5QyxJQUFJLENBQUNFLFNBQVMsQ0FBQ0MsRUFBRSxHQUFHLFlBQVk7SUFDaEMsSUFBSSxDQUFDSixlQUFlLENBQUNLLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLGtCQUFrQixDQUFDO0lBQ3RELElBQUksQ0FBQ0osV0FBVyxDQUFDRyxTQUFTLENBQUNDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztJQUNsRDtJQUNBO0lBQ0EsTUFBTUMsV0FBVyxHQUFHVCxRQUFRLENBQUNHLGFBQWEsQ0FBQyxJQUFJLENBQUM7SUFDaERNLFdBQVcsQ0FBQ0MsV0FBVyxHQUFHLFFBQVE7SUFFbEMsTUFBTUMsT0FBTyxHQUFHWCxRQUFRLENBQUNHLGFBQWEsQ0FBQyxJQUFJLENBQUM7SUFDNUNRLE9BQU8sQ0FBQ0QsV0FBVyxHQUFHLFVBQVU7O0lBRWhDO0lBQ0EsTUFBTUUsVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDQyxZQUFZLENBQUMsT0FBTyxDQUFDO0lBQzlDLE1BQU1DLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQ0QsWUFBWSxDQUFDLElBQUksQ0FBQztJQUV2QyxJQUFJLENBQUNFLFNBQVMsR0FBR2YsUUFBUSxDQUFDRyxhQUFhLENBQUMsR0FBRyxDQUFDO0lBQzVDLElBQUksQ0FBQ1ksU0FBUyxDQUFDVCxFQUFFLEdBQUcsWUFBWTtJQUNoQyxJQUFJLENBQUNVLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFFdkIsTUFBTUMsY0FBYyxHQUFHakIsUUFBUSxDQUFDRyxhQUFhLENBQUMsUUFBUSxDQUFDO0lBQ3ZEYyxjQUFjLENBQUNQLFdBQVcsR0FBRyxZQUFZO0lBQ3pDTyxjQUFjLENBQUNYLEVBQUUsR0FBRyxpQkFBaUI7SUFFckMsSUFBSSxDQUFDSixlQUFlLENBQUNnQixNQUFNLENBQ3pCVCxXQUFXLEVBQ1hHLFVBQVUsRUFDVixJQUFJLENBQUNHLFNBQVMsRUFDZEUsY0FDRixDQUFDO0lBQ0QsSUFBSSxDQUFDYixXQUFXLENBQUNjLE1BQU0sQ0FBQ1AsT0FBTyxFQUFFRyxNQUFNLENBQUM7SUFFeEMsSUFBSSxDQUFDZixhQUFhLENBQUNtQixNQUFNLENBQ3ZCLElBQUksQ0FBQ2hCLGVBQWUsRUFDcEIsSUFBSSxDQUFDRSxXQUFXLEVBQ2hCLElBQUksQ0FBQ0MsU0FDUCxDQUFDO0VBQ0g7RUFFQWMsR0FBR0EsQ0FBQ0MsUUFBUSxFQUFFO0lBQ1pBLFFBQVEsQ0FBQ2IsU0FBUyxDQUFDYyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2pDRCxRQUFRLENBQUNiLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLEtBQUssQ0FBQztFQUMvQjtFQUVBYyxJQUFJQSxDQUFDRixRQUFRLEVBQUU7SUFDYkEsUUFBUSxDQUFDYixTQUFTLENBQUNDLEdBQUcsQ0FBQyxNQUFNLENBQUM7RUFDaEM7RUFFQWUsSUFBSUEsQ0FBQ0gsUUFBUSxFQUFFO0lBQ2JBLFFBQVEsQ0FBQ2IsU0FBUyxDQUFDQyxHQUFHLENBQUMsTUFBTSxDQUFDO0VBQ2hDO0VBRUFnQixXQUFXQSxDQUFDQyxPQUFPLEVBQUU7SUFDbkJBLE9BQU8sQ0FBQ0MsS0FBSyxDQUFDQyxPQUFPLEdBQUcsTUFBTTtFQUNoQztFQUVBWCxlQUFlQSxDQUFDWSxPQUFPLEVBQWdCO0lBQUEsSUFBZEMsS0FBSyxHQUFBQyxTQUFBLENBQUFDLE1BQUEsUUFBQUQsU0FBQSxRQUFBRSxTQUFBLEdBQUFGLFNBQUEsTUFBRyxJQUFJO0lBQ25DLElBQUlHLEdBQUcsR0FBRyxJQUFJLENBQUNsQixTQUFTO0lBQ3hCLElBQUljLEtBQUssRUFBRTtNQUNUSSxHQUFHLENBQUN2QixXQUFXLEdBQUcsNEJBQTRCO01BQzlDd0IsVUFBVSxDQUFDLE1BQU07UUFDZixJQUFJLENBQUNsQixlQUFlLENBQUNZLE9BQU8sQ0FBQztNQUMvQixDQUFDLEVBQUUsSUFBSSxDQUFDO0lBQ1YsQ0FBQyxNQUFNLElBQUlBLE9BQU8sR0FBRyxDQUFDLEVBQUU7TUFDdEJLLEdBQUcsQ0FBQ3ZCLFdBQVcsR0FBSSx1QkFBc0IsSUFBSSxDQUFDYixTQUFTLENBQUMrQixPQUFPLENBQUUsV0FBVSxJQUFJLENBQUM5QixTQUFTLENBQUM4QixPQUFPLENBQUUsR0FBRTtJQUN2RyxDQUFDLE1BQU07TUFDTCxJQUFJLENBQUMsQ0FBQ08sUUFBUSxDQUFDRixHQUFHLENBQUM7SUFDckI7RUFDRjtFQUVBRyxrQkFBa0JBLENBQUNiLElBQUksRUFBRWMsTUFBTSxFQUFFO0lBQy9CLE1BQU1DLE9BQU8sR0FBR3RDLFFBQVEsQ0FBQ0csYUFBYSxDQUFDLEdBQUcsQ0FBQztJQUMzQ21DLE9BQU8sQ0FBQzVCLFdBQVcsR0FBSSxHQUFFMkIsTUFBTyxJQUFHZCxJQUFJLENBQUNnQixRQUFTLGlCQUFnQjtJQUNqRSxJQUFJLENBQUNsQyxTQUFTLENBQUNtQyxXQUFXLENBQUNGLE9BQU8sQ0FBQztJQUNuQ0osVUFBVSxDQUFDLE1BQU07TUFDZixJQUFJLENBQUMsQ0FBQ0MsUUFBUSxDQUFDRyxPQUFPLENBQUM7SUFDekIsQ0FBQyxFQUFFLElBQUksQ0FBQztFQUNWO0VBRUFHLGFBQWFBLENBQUNDLE1BQU0sRUFBRTtJQUNwQixNQUFNQyxTQUFTLEdBQUczQyxRQUFRLENBQUM0QyxjQUFjLENBQUUsV0FBVUYsTUFBTyxHQUFFLENBQUM7SUFDL0QsSUFBSSxDQUFDckMsU0FBUyxDQUFDbUMsV0FBVyxDQUFDRyxTQUFTLENBQUM7RUFDdkM7RUFFQSxDQUFDUixRQUFRVSxDQUFDQyxVQUFVLEVBQUU7SUFDcEJBLFVBQVUsQ0FBQ3pCLE1BQU0sQ0FBQyxDQUFDO0VBQ3JCO0VBRUEsQ0FBQ1IsWUFBWWtDLENBQUNWLE1BQU0sRUFBRTtJQUNwQixNQUFNVyxJQUFJLEdBQUdoRCxRQUFRLENBQUNHLGFBQWEsQ0FBQyxLQUFLLENBQUM7SUFDMUM2QyxJQUFJLENBQUN6QyxTQUFTLENBQUNDLEdBQUcsQ0FBQyxNQUFNLEVBQUU2QixNQUFNLENBQUM7SUFFbEMsS0FBSyxJQUFJWSxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUcsR0FBRyxFQUFFQSxDQUFDLEVBQUUsRUFBRTtNQUM1QixNQUFNN0IsUUFBUSxHQUFHcEIsUUFBUSxDQUFDRyxhQUFhLENBQUMsS0FBSyxDQUFDO01BQzlDaUIsUUFBUSxDQUFDYixTQUFTLENBQUNDLEdBQUcsQ0FBQyxXQUFXLEVBQUU2QixNQUFNLENBQUM7TUFDM0NqQixRQUFRLENBQUM4QixPQUFPLENBQUNDLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQ0MsY0FBYyxDQUFDSCxDQUFDLENBQUM7TUFDdERELElBQUksQ0FBQ1IsV0FBVyxDQUFDcEIsUUFBUSxDQUFDO0lBQzVCO0lBQ0EsT0FBTzRCLElBQUk7RUFDYjtFQUVBLENBQUNJLGNBQWNDLENBQUNKLENBQUMsRUFBRTtJQUNqQixJQUFJQSxDQUFDLEdBQUcsRUFBRSxFQUFFO01BQ1YsT0FBTyxDQUFDQSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2YsQ0FBQyxNQUFNO01BQ0wsSUFBSUssTUFBTSxHQUFHTCxDQUFDLENBQUNNLFFBQVEsQ0FBQyxDQUFDLENBQUNDLEtBQUssQ0FBQyxFQUFFLENBQUM7TUFDbkMsT0FBTyxDQUFDRixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUVBLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQjtFQUNGO0FBQ0Y7Ozs7Ozs7Ozs7Ozs7OztBQ3BJMkI7QUFFWixNQUFNSSxTQUFTLENBQUM7RUFDN0JuRSxXQUFXQSxDQUFBLEVBQUc7SUFDWixJQUFJLENBQUNvRSxRQUFRLEdBQUcsRUFBRTtJQUNsQixJQUFJLENBQUNDLFdBQVcsR0FBRyxFQUFFO0lBQ3JCLElBQUksQ0FBQ0MsUUFBUSxHQUFHLEVBQUU7SUFDbEIsSUFBSSxDQUFDQyxRQUFRLEdBQUcsRUFBRTtFQUNwQjtFQUVBQyxTQUFTQSxDQUFDQyxJQUFJLEVBQUVDLFVBQVUsRUFBOEI7SUFBQSxJQUE1QkMsV0FBVyxHQUFBcEMsU0FBQSxDQUFBQyxNQUFBLFFBQUFELFNBQUEsUUFBQUUsU0FBQSxHQUFBRixTQUFBLE1BQUcsWUFBWTtJQUNwRG9DLFdBQVcsR0FBR0EsV0FBVyxDQUFDQyxXQUFXLENBQUMsQ0FBQztJQUN2QyxNQUFNaEIsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDaUIsZ0JBQWdCLENBQUNKLElBQUksRUFBRUMsVUFBVSxFQUFFQyxXQUFXLENBQUM7SUFDekUsSUFBSSxJQUFJLENBQUMsQ0FBQ0csbUJBQW1CLENBQUNsQixXQUFXLENBQUMsRUFBRTtNQUMxQyxNQUFNbUIsT0FBTyxHQUFHLElBQUliLDhDQUFJLENBQUNPLElBQUksQ0FBQztNQUM5QixNQUFNTyxTQUFTLEdBQUcsQ0FBQ0QsT0FBTyxFQUFFbkIsV0FBVyxDQUFDO01BQ3hDLElBQUksQ0FBQ1EsUUFBUSxDQUFDYSxJQUFJLENBQUNELFNBQVMsQ0FBQztNQUM3QixPQUFPcEIsV0FBVztJQUNwQixDQUFDLE1BQU07TUFDTCxPQUFPLEtBQUs7SUFDZDtFQUNGOztFQUVBO0VBQ0E7RUFDQXNCLGFBQWFBLENBQUNDLFVBQVUsRUFBRTtJQUN4QixJQUFJLENBQUNaLFFBQVEsQ0FBQ1UsSUFBSSxDQUFDRSxVQUFVLENBQUM7SUFDOUIsTUFBTW5ELElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQ29ELFFBQVEsQ0FBQ0QsVUFBVSxDQUFDO0lBQ3ZDLElBQUluRCxJQUFJLEVBQUU7TUFDUkEsSUFBSSxDQUFDSixHQUFHLENBQUMsQ0FBQztNQUNWLElBQUksQ0FBQzBDLFFBQVEsQ0FBQ1csSUFBSSxDQUFDRSxVQUFVLENBQUM7TUFDOUIsT0FBT25ELElBQUk7SUFDYixDQUFDLE1BQU07TUFDTCxJQUFJLENBQUNxQyxXQUFXLENBQUNZLElBQUksQ0FBQ0UsVUFBVSxDQUFDO01BQ2pDLE9BQU8sS0FBSztJQUNkO0VBQ0Y7RUFFQUUsUUFBUUEsQ0FBQSxFQUFHO0lBQ1QsSUFBSUMsT0FBTyxHQUFHLElBQUk7SUFDbEI7SUFDQSxJQUFJLElBQUksQ0FBQ2xCLFFBQVEsQ0FBQzVCLE1BQU0sS0FBSyxDQUFDLEVBQUU7TUFDOUIsT0FBTyxLQUFLO0lBQ2Q7SUFDQSxJQUFJLENBQUM0QixRQUFRLENBQUNtQixPQUFPLENBQUV2RCxJQUFJLElBQUs7TUFDOUIsSUFBSSxDQUFDQSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUN3RCxNQUFNLENBQUMsQ0FBQyxFQUFFO1FBQ3JCRixPQUFPLEdBQUcsS0FBSztNQUNqQjtJQUNGLENBQUMsQ0FBQztJQUNGLE9BQU9BLE9BQU87RUFDaEI7RUFFQSxDQUFDVCxnQkFBZ0JZLENBQUNoQixJQUFJLEVBQUVDLFVBQVUsRUFBRUMsV0FBVyxFQUFFO0lBQy9DLElBQUlmLFdBQVcsR0FBRyxFQUFFO0lBQ3BCLEtBQUssSUFBSUYsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHZSxJQUFJLEVBQUVmLENBQUMsRUFBRSxFQUFFO01BQzdCLElBQUlpQixXQUFXLEtBQUssWUFBWSxFQUFFO1FBQ2hDZixXQUFXLENBQUNxQixJQUFJLENBQUMsQ0FBQ1AsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHaEIsQ0FBQyxFQUFFZ0IsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDdEQsQ0FBQyxNQUFNO1FBQ0xkLFdBQVcsQ0FBQ3FCLElBQUksQ0FBQyxDQUFDUCxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUVBLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBR2hCLENBQUMsQ0FBQyxDQUFDO01BQ3REO0lBQ0Y7SUFDQSxPQUFPRSxXQUFXO0VBQ3BCO0VBRUEsQ0FBQ2tCLG1CQUFtQlksQ0FBQzlCLFdBQVcsRUFBRTtJQUNoQyxJQUFJK0IsV0FBVyxHQUFHLElBQUk7SUFDdEIvQixXQUFXLENBQUMyQixPQUFPLENBQUVLLEtBQUssSUFBSztNQUM3QjtNQUNBLElBQUksSUFBSSxDQUFDLENBQUNSLFFBQVEsQ0FBQ1EsS0FBSyxDQUFDLElBQUlBLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUlBLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDekRELFdBQVcsR0FBRyxLQUFLO01BQ3JCO0lBQ0YsQ0FBQyxDQUFDO0lBQ0YsT0FBT0EsV0FBVztFQUNwQjtFQUVBLENBQUNQLFFBQVFTLENBQUNWLFVBQVUsRUFBRTtJQUNwQixJQUFJVyxTQUFTLEdBQUcsS0FBSztJQUNyQixJQUFJLENBQUMxQixRQUFRLENBQUNtQixPQUFPLENBQUV2RCxJQUFJLElBQUs7TUFDOUIsSUFDRUEsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDK0QsSUFBSSxDQUFFQyxDQUFDLElBQUtBLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBS2IsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUtiLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNyRTtRQUNBVyxTQUFTLEdBQUc5RCxJQUFJLENBQUMsQ0FBQyxDQUFDO01BQ3JCO0lBQ0YsQ0FBQyxDQUFDO0lBQ0YsT0FBTzhELFNBQVM7RUFDbEI7QUFDRjs7Ozs7Ozs7Ozs7Ozs7OztBQ3RGK0I7QUFDTztBQUV2QixNQUFNSSxRQUFRLENBQUM7RUFDNUJsRyxXQUFXQSxDQUFBLEVBQUc7SUFDWixJQUFJLENBQUNtRyxLQUFLLEdBQUcsSUFBSUYsZ0RBQU0sQ0FBQyxJQUFJLENBQUM7SUFDN0IsSUFBSSxDQUFDRyxFQUFFLEdBQUcsSUFBSUgsZ0RBQU0sQ0FBQyxLQUFLLENBQUM7SUFDM0IsSUFBSSxDQUFDSSxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUNGLEtBQUssRUFBRSxJQUFJLENBQUNDLEVBQUUsQ0FBQztJQUNwQyxJQUFJLENBQUNFLGFBQWEsR0FBRyxJQUFJLENBQUNGLEVBQUU7SUFDNUIsSUFBSSxDQUFDRyxLQUFLLEdBQUcsSUFBSTtJQUNqQixJQUFJLENBQUNDLElBQUksR0FBRyxJQUFJekcsbURBQVUsQ0FBQyxDQUFDO0VBQzlCO0VBRUEwRyxLQUFLQSxDQUFBLEVBQUc7SUFDTixJQUFJLENBQUMsQ0FBQ0MsT0FBTyxDQUFDLENBQUM7SUFDZixJQUFJLENBQUNDLGVBQWUsQ0FBQyxDQUFDO0lBQ3RCLElBQUksQ0FBQ0Msa0JBQWtCLENBQUMsQ0FBQztJQUV6QixJQUFJQyxZQUFZLEdBQUcsSUFBSSxDQUFDTixLQUFLO0lBRTdCLE1BQU1PLFNBQVMsR0FBR0EsQ0FBQSxLQUFNO01BQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQ3pCLFFBQVEsQ0FBQyxDQUFDLEVBQUU7UUFDckIsSUFBSSxDQUFDLENBQUMwQixRQUFRLENBQUMsQ0FBQztRQUNoQixJQUFJRixZQUFZLEtBQUssSUFBSSxDQUFDTixLQUFLLEVBQUU7VUFDL0IsSUFBSSxDQUFDRCxhQUFhLEdBQ2hCLElBQUksQ0FBQ0EsYUFBYSxLQUFLLElBQUksQ0FBQ0gsS0FBSyxHQUFHLElBQUksQ0FBQ0MsRUFBRSxHQUFHLElBQUksQ0FBQ0QsS0FBSztVQUMxRFUsWUFBWSxHQUFHLElBQUksQ0FBQ04sS0FBSztRQUMzQjtRQUNBNUQsVUFBVSxDQUFDbUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDNUIsQ0FBQyxNQUFNO1FBQ0wsSUFBSSxDQUFDLENBQUNFLE9BQU8sQ0FBQyxDQUFDO01BQ2pCO0lBQ0YsQ0FBQztJQUVERixTQUFTLENBQUMsQ0FBQztFQUNiO0VBRUEsQ0FBQ0UsT0FBT0MsQ0FBQSxFQUFHO0lBQ1QsTUFBTTlELE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQ2tDLFFBQVEsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDYyxLQUFLLEdBQUcsS0FBSyxHQUFHLFVBQVU7SUFDbkUsTUFBTWUsV0FBVyxHQUFHekcsUUFBUSxDQUFDMEcsZ0JBQWdCLENBQUMsZUFBZSxDQUFDO0lBQzlELE1BQU1DLGNBQWMsR0FBRzNHLFFBQVEsQ0FBQzBHLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDO0lBQ3BFO0lBQ0EsSUFBSSxDQUFDWCxJQUFJLENBQUN0RCxhQUFhLENBQUNDLE1BQU0sQ0FBQztJQUMvQjtJQUNBK0QsV0FBVyxDQUFDM0IsT0FBTyxDQUFFOEIsSUFBSSxJQUFLO01BQzVCLElBQUlDLE1BQU0sR0FBR0QsSUFBSSxDQUFDMUQsT0FBTyxDQUFDQyxXQUFXLENBQ2xDSyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQ1ZzRCxHQUFHLENBQUV2QixDQUFDLElBQUt3QixRQUFRLENBQUN4QixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7TUFDOUIsSUFBSSxDQUFDLENBQUN5QixhQUFhLENBQUNILE1BQU0sRUFBRUQsSUFBSSxDQUFDO0lBQ25DLENBQUMsQ0FBQztJQUNGRCxjQUFjLENBQUM3QixPQUFPLENBQUU4QixJQUFJLElBQUs7TUFDL0IsSUFBSSxDQUFDQSxJQUFJLENBQUNyRyxTQUFTLENBQUMwRyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQ0wsSUFBSSxDQUFDckcsU0FBUyxDQUFDMEcsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3ZFLElBQUksQ0FBQ2xCLElBQUksQ0FBQ3pFLElBQUksQ0FBQ3NGLElBQUksQ0FBQztNQUN0QjtJQUNGLENBQUMsQ0FBQztFQUNKO0VBRUFULGtCQUFrQkEsQ0FBQSxFQUFHO0lBQ25CLElBQUksQ0FBQyxDQUFDZSxzQkFBc0IsQ0FBQyxDQUFDO0lBQzlCLE1BQU1qRyxjQUFjLEdBQUdqQixRQUFRLENBQUNDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQztJQUNqRSxNQUFNa0gsU0FBUyxHQUFHbkgsUUFBUSxDQUFDMEcsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUM7SUFDL0QsSUFBSVUsZ0JBQWdCLEdBQUcsQ0FBQztJQUN4QixJQUFJQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRTlCRixTQUFTLENBQUNyQyxPQUFPLENBQUU4QixJQUFJLElBQUs7TUFDMUJBLElBQUksQ0FBQ1UsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU07UUFDbkMsSUFBSUYsZ0JBQWdCLElBQUlDLFFBQVEsQ0FBQ3RGLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMrRCxLQUFLLEVBQUU7VUFDMUQsSUFBSSxDQUFDQyxJQUFJLENBQUN2RSxXQUFXLENBQUNQLGNBQWMsQ0FBQztVQUNyQyxJQUFJLENBQUM2RSxLQUFLLEdBQUcsQ0FBQztRQUNoQjtRQUNBLE1BQU01QixXQUFXLEdBQUdqRCxjQUFjLENBQUNQLFdBQVc7UUFDOUMsSUFBSW1HLE1BQU0sR0FBR0QsSUFBSSxDQUFDMUQsT0FBTyxDQUFDQyxXQUFXLENBQ2xDSyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQ1ZzRCxHQUFHLENBQUV2QixDQUFDLElBQUt3QixRQUFRLENBQUN4QixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDOUIsSUFBSXBDLFdBQVcsR0FBRyxJQUFJLENBQUN1QyxLQUFLLENBQUM2QixLQUFLLENBQUN4RCxTQUFTLENBQzFDc0QsUUFBUSxDQUFDRCxnQkFBZ0IsQ0FBQyxFQUMxQlAsTUFBTSxFQUNOM0MsV0FDRixDQUFDO1FBQ0Q7UUFDQSxJQUFJZixXQUFXLEVBQUU7VUFDZkEsV0FBVyxDQUFDMkIsT0FBTyxDQUFFSyxLQUFLLElBQUs7WUFDN0IsSUFBSSxDQUFDWSxJQUFJLENBQUN4RSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUNpRyxZQUFZLENBQUNyQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7VUFDcEQsQ0FBQyxDQUFDO1VBQ0ZpQyxnQkFBZ0IsRUFBRTtVQUNsQixJQUFJLENBQUNyQixJQUFJLENBQUMvRSxlQUFlLENBQUNvRyxnQkFBZ0IsQ0FBQztVQUMzQztRQUNGLENBQUMsTUFBTTtVQUNMLElBQUksQ0FBQ3JCLElBQUksQ0FBQy9FLGVBQWUsQ0FBQ29HLGdCQUFnQixFQUFFLE9BQU8sQ0FBQztRQUN0RDtNQUNGLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQztFQUNKO0VBRUEsQ0FBQ0Ysc0JBQXNCTyxDQUFBLEVBQUc7SUFDeEIsTUFBTXZELFdBQVcsR0FBR2xFLFFBQVEsQ0FBQ0MsY0FBYyxDQUFDLGlCQUFpQixDQUFDO0lBQzlEaUUsV0FBVyxDQUFDdkMsT0FBTyxHQUFHLE9BQU87SUFFN0J1QyxXQUFXLENBQUNvRCxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsTUFBTTtNQUMxQyxJQUFJSSxJQUFJLEdBQUd4RCxXQUFXLENBQUN4RCxXQUFXO01BQ2xDd0QsV0FBVyxDQUFDeEQsV0FBVyxHQUNyQmdILElBQUksS0FBSyxZQUFZLEdBQUcsVUFBVSxHQUFHLFlBQVk7SUFDckQsQ0FBQyxDQUFDO0VBQ0o7RUFFQXhCLGVBQWVBLENBQUEsRUFBRztJQUNoQixNQUFNaUIsU0FBUyxHQUFHbkgsUUFBUSxDQUFDMEcsZ0JBQWdCLENBQUMsZUFBZSxDQUFDO0lBQzVEUyxTQUFTLENBQUNyQyxPQUFPLENBQUU4QixJQUFJLElBQUs7TUFDMUJBLElBQUksQ0FBQ1UsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU07UUFDbkMsSUFBSSxJQUFJLENBQUN6QixhQUFhLEtBQUssSUFBSSxDQUFDSCxLQUFLLElBQUksSUFBSSxDQUFDLENBQUNpQyxTQUFTLENBQUNmLElBQUksQ0FBQyxFQUFFO1VBQzlELElBQUlDLE1BQU0sR0FBR0QsSUFBSSxDQUFDMUQsT0FBTyxDQUFDQyxXQUFXLENBQ2xDSyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQ1ZzRCxHQUFHLENBQUV2QixDQUFDLElBQUt3QixRQUFRLENBQUN4QixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7VUFDOUIsSUFBSSxDQUFDLENBQUN5QixhQUFhLENBQUNILE1BQU0sRUFBRUQsSUFBSSxDQUFDO1FBQ25DO01BQ0YsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDO0VBQ0o7O0VBRUE7RUFDQSxDQUFDZSxTQUFTQyxDQUFDeEcsUUFBUSxFQUFFO0lBQ25CLElBQ0VBLFFBQVEsQ0FBQ2IsU0FBUyxDQUFDMEcsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUNsQzdGLFFBQVEsQ0FBQ2IsU0FBUyxDQUFDMEcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUNuQztNQUNBLE9BQU8sS0FBSztJQUNkLENBQUMsTUFBTTtNQUNMLE9BQU8sSUFBSTtJQUNiO0VBQ0Y7RUFFQSxDQUFDRCxhQUFhYSxDQUFDaEIsTUFBTSxFQUFFekYsUUFBUSxFQUFFO0lBQy9CLElBQUkwRyxZQUFZLEdBQUcsSUFBSSxDQUFDbkMsRUFBRSxDQUFDNEIsS0FBSyxDQUFDOUMsYUFBYSxDQUFDb0MsTUFBTSxDQUFDO0lBQ3RELElBQUlpQixZQUFZLEVBQUU7TUFDaEI7TUFDQSxJQUFJLENBQUMvQixJQUFJLENBQUM1RSxHQUFHLENBQUNDLFFBQVEsQ0FBQztNQUN2QixJQUFJLENBQUMwRSxLQUFLLEVBQUU7TUFDWjtNQUNBLElBQUlnQyxZQUFZLENBQUMvQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUNILFFBQVEsQ0FBQyxDQUFDLEVBQUU7UUFDOUMsSUFBSSxDQUFDbUIsSUFBSSxDQUFDM0Qsa0JBQWtCLENBQUMwRixZQUFZLEVBQUUsWUFBWSxDQUFDO01BQzFEO0lBQ0YsQ0FBQyxNQUFNO01BQ0w7TUFDQSxJQUFJLENBQUMvQixJQUFJLENBQUN6RSxJQUFJLENBQUNGLFFBQVEsQ0FBQztNQUN4QixJQUFJLENBQUMwRSxLQUFLLEVBQUU7SUFDZDtFQUNGO0VBRUEsQ0FBQ0csT0FBTzhCLENBQUEsRUFBRztJQUNULE1BQU1qSSxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDQSxTQUFTLENBQUNnRixPQUFPLENBQUV2RCxJQUFJLElBQUs7TUFDMUIsSUFBSTRCLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQzZFLGVBQWUsQ0FBQ3pHLElBQUksQ0FBQztNQUM3QztNQUNBLE9BQU8sQ0FBQzRCLFdBQVcsRUFBRTtRQUNuQkEsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDNkUsZUFBZSxDQUFDekcsSUFBSSxDQUFDO01BQzNDO01BQ0E7TUFDQTtNQUNBO01BQ0E7SUFDRixDQUFDLENBQUM7RUFDSjs7RUFFQSxDQUFDeUcsZUFBZUMsQ0FBQzFHLElBQUksRUFBRTtJQUNyQixJQUFJMkMsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDZ0UsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxZQUFZLEdBQUcsVUFBVTtJQUN0RSxJQUFJL0MsS0FBSyxHQUNQakIsV0FBVyxLQUFLLFlBQVksR0FDeEIsQ0FBQyxJQUFJLENBQUMsQ0FBQ2dFLFNBQVMsQ0FBQyxFQUFFLEdBQUczRyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQzJHLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUNqRCxDQUFDLElBQUksQ0FBQyxDQUFDQSxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUNBLFNBQVMsQ0FBQyxFQUFFLEdBQUczRyxJQUFJLENBQUMsQ0FBQztJQUN2RCxJQUFJNEIsV0FBVyxHQUFHLElBQUksQ0FBQ3dDLEVBQUUsQ0FBQzRCLEtBQUssQ0FBQ3hELFNBQVMsQ0FBQ3hDLElBQUksRUFBRTRELEtBQUssRUFBRWpCLFdBQVcsQ0FBQztJQUNuRSxPQUFPZixXQUFXO0VBQ3BCO0VBRUEsQ0FBQ21ELFFBQVE2QixDQUFBLEVBQUc7SUFDVixJQUFJLElBQUksQ0FBQ3RDLGFBQWEsS0FBSyxJQUFJLENBQUNGLEVBQUUsSUFBSSxJQUFJLENBQUNHLEtBQUssRUFBRTtNQUNoRCxJQUFJWCxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUNpRCxlQUFlLENBQUMsQ0FBQztNQUNuQyxJQUFJaEgsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDb0csWUFBWSxDQUFDckMsS0FBSyxFQUFFLE9BQU8sQ0FBQztNQUNqRCxJQUFJMkMsWUFBWSxHQUFHLElBQUksQ0FBQ3BDLEtBQUssQ0FBQzZCLEtBQUssQ0FBQzlDLGFBQWEsQ0FBQ1UsS0FBSyxDQUFDO01BQ3hELElBQUkyQyxZQUFZLEVBQUU7UUFDaEI7UUFDQSxJQUFJLENBQUMvQixJQUFJLENBQUM1RSxHQUFHLENBQUNDLFFBQVEsQ0FBQztRQUN2QixJQUFJLENBQUMwRSxLQUFLLEVBQUU7UUFDWjtRQUNBLElBQUlnQyxZQUFZLENBQUMvQyxNQUFNLENBQUMsQ0FBQyxFQUFFO1VBQ3pCLElBQUksQ0FBQ2dCLElBQUksQ0FBQzNELGtCQUFrQixDQUFDMEYsWUFBWSxFQUFFLFVBQVUsQ0FBQztRQUN4RDtNQUNGLENBQUMsTUFBTTtRQUNMO1FBQ0EsSUFBSSxDQUFDL0IsSUFBSSxDQUFDekUsSUFBSSxDQUFDRixRQUFRLENBQUM7UUFDeEIsSUFBSSxDQUFDMEUsS0FBSyxFQUFFO01BQ2Q7SUFDRjtFQUNGO0VBRUEsQ0FBQ3NDLGVBQWVDLENBQUEsRUFBd0M7SUFBQSxJQUF2Q0MsYUFBYSxHQUFBeEcsU0FBQSxDQUFBQyxNQUFBLFFBQUFELFNBQUEsUUFBQUUsU0FBQSxHQUFBRixTQUFBLE1BQUcsSUFBSTtJQUFBLElBQUV5RyxXQUFXLEdBQUF6RyxTQUFBLENBQUFDLE1BQUEsUUFBQUQsU0FBQSxRQUFBRSxTQUFBLEdBQUFGLFNBQUEsTUFBRyxDQUFDO0lBQ3BELE1BQU00RCxLQUFLLEdBQUcsSUFBSSxDQUFDQSxLQUFLLENBQUM2QixLQUFLO0lBQzlCLElBQUlwQyxLQUFLLEdBQUcsRUFBRTtJQUNkO0lBQ0EsSUFBSU8sS0FBSyxDQUFDN0IsUUFBUSxDQUFDOUIsTUFBTSxHQUFHLENBQUMsSUFBSXdHLFdBQVcsR0FBRyxDQUFDLEVBQUU7TUFDaEQsTUFBTUMsUUFBUSxHQUFHOUMsS0FBSyxDQUFDN0IsUUFBUSxDQUFDNEUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ3RDLE1BQU1DLFFBQVEsR0FDWkosYUFBYSxLQUFLLElBQUksR0FBRzVDLEtBQUssQ0FBQzVCLFFBQVEsQ0FBQzJFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHSCxhQUFhO01BQ2hFLElBQUlJLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBS0YsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUtGLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUM5RHJELEtBQUssR0FBRyxDQUFDcUQsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRUEsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ3hDLENBQUMsTUFBTSxJQUNMRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUtGLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQy9CRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUtGLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFDM0I7UUFDQXJELEtBQUssR0FBRyxDQUFDcUQsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRUEsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ3hDLENBQUMsTUFBTSxJQUNMRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUtGLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQy9CRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUtGLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFDM0I7UUFDQXJELEtBQUssR0FBRyxDQUFDcUQsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFQSxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ3hDLENBQUMsTUFBTSxJQUNMRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUtGLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFDM0JFLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBS0YsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFDL0I7UUFDQXJELEtBQUssR0FBRyxDQUFDcUQsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFQSxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ3hDLENBQUMsTUFBTTtRQUNMckQsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMrQyxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUNBLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztNQUNwRDtJQUNGLENBQUMsTUFBTTtNQUNMO01BQ0EvQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQytDLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQ0EsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3BEOztJQUVBO0lBQ0F4QyxLQUFLLENBQUM1QixRQUFRLENBQUNnQixPQUFPLENBQUU2RCxJQUFJLElBQUs7TUFDL0IsSUFBSUEsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLeEQsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJd0QsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLeEQsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ2hEQSxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUNpRCxlQUFlLENBQUNqRCxLQUFLLEVBQUVvRCxXQUFXLEdBQUcsQ0FBQyxDQUFDO01BQ3ZEO0lBQ0YsQ0FBQyxDQUFDO0lBQ0Y7SUFDQSxJQUFJcEQsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtNQUNoRUEsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDaUQsZUFBZSxDQUFDakQsS0FBSyxFQUFFb0QsV0FBVyxHQUFHLENBQUMsQ0FBQztJQUN2RDtJQUNBLE9BQU9wRCxLQUFLO0VBQ2Q7RUFFQSxDQUFDK0MsU0FBU1UsQ0FBQ0MsR0FBRyxFQUFFO0lBQ2QsT0FBT0MsSUFBSSxDQUFDQyxLQUFLLENBQUNELElBQUksQ0FBQ0UsTUFBTSxDQUFDLENBQUMsR0FBR0gsR0FBRyxDQUFDO0VBQ3hDO0VBRUEsQ0FBQ3JCLFlBQVl5QixDQUFDOUQsS0FBSyxFQUFFOUMsTUFBTSxFQUFFO0lBQzNCLE1BQU04RSxTQUFTLEdBQUduSCxRQUFRLENBQUMwRyxnQkFBZ0IsQ0FBRSxjQUFhckUsTUFBTyxFQUFDLENBQUM7SUFDbkUsSUFBSTZHLFNBQVMsR0FBRyxLQUFLO0lBQ3JCL0IsU0FBUyxDQUFDckMsT0FBTyxDQUFFMUQsUUFBUSxJQUFLO01BQzlCLElBQUlBLFFBQVEsQ0FBQzhCLE9BQU8sQ0FBQ0MsV0FBVyxLQUFLZ0MsS0FBSyxDQUFDNUIsUUFBUSxDQUFDLENBQUMsRUFBRTtRQUNyRDJGLFNBQVMsR0FBRzlILFFBQVE7TUFDdEI7SUFDRixDQUFDLENBQUM7SUFDRixPQUFPOEgsU0FBUztFQUNsQjtFQUVBLENBQUN0RSxRQUFRdUUsQ0FBQSxFQUFHO0lBQ1Y7SUFDQSxJQUFJLElBQUksQ0FBQ3pELEtBQUssQ0FBQzZCLEtBQUssQ0FBQzNDLFFBQVEsQ0FBQyxDQUFDLEVBQUU7TUFDL0IsT0FBTyxJQUFJLENBQUNlLEVBQUU7TUFDZDtJQUNGLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQ0EsRUFBRSxDQUFDNEIsS0FBSyxDQUFDM0MsUUFBUSxDQUFDLENBQUMsRUFBRTtNQUNuQyxPQUFPLElBQUksQ0FBQ2MsS0FBSztNQUNqQjtJQUNGLENBQUMsTUFBTTtNQUNMLE9BQU8sS0FBSztJQUNkO0VBQ0Y7QUFDRjs7Ozs7Ozs7Ozs7Ozs7O0FDM1FvQztBQUVyQixNQUFNRixNQUFNLENBQUM7RUFDMUJqRyxXQUFXQSxDQUFBLEVBQWU7SUFBQSxJQUFkbUcsS0FBSyxHQUFBNUQsU0FBQSxDQUFBQyxNQUFBLFFBQUFELFNBQUEsUUFBQUUsU0FBQSxHQUFBRixTQUFBLE1BQUcsSUFBSTtJQUN0QixJQUFJLENBQUN5RixLQUFLLEdBQUcsSUFBSTdELGtEQUFTLENBQUMsQ0FBQztJQUM1QixJQUFJLENBQUMwRixPQUFPLEdBQUcxRCxLQUFLO0lBQ3BCLElBQUksQ0FBQzJELGFBQWEsR0FBRyxFQUFFO0VBQ3pCO0VBRUFDLE1BQU1BLENBQUNqSCxNQUFNLEVBQUVxQyxVQUFVLEVBQUU7SUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQzBFLE9BQU8sRUFBRTtNQUNqQjFFLFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBQzRCLFFBQVEsQ0FBQ2pFLE1BQU0sQ0FBQ2tGLEtBQUssQ0FBQztJQUMzQztJQUVBLElBQUksQ0FBQzhCLGFBQWEsQ0FBQzdFLElBQUksQ0FBQ0UsVUFBVSxDQUFDO0lBQ25DckMsTUFBTSxDQUFDa0YsS0FBSyxDQUFDOUMsYUFBYSxDQUFDQyxVQUFVLENBQUM7RUFDeEM7RUFFQSxDQUFDNEIsUUFBUTZCLENBQUNaLEtBQUssRUFBRTtJQUNmLElBQUk3QyxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUM2RSxXQUFXLENBQUMsQ0FBQztJQUNwQyxJQUFJLElBQUksQ0FBQ0YsYUFBYSxDQUFDRyxRQUFRLENBQUM5RSxVQUFVLENBQUMsRUFBRTtNQUMzQyxJQUFJLENBQUMsQ0FBQzRCLFFBQVEsQ0FBQ2lCLEtBQUssQ0FBQztJQUN2QixDQUFDLE1BQU07TUFDTCxPQUFPN0MsVUFBVTtJQUNuQjtFQUNGOztFQUVBO0VBQ0EsQ0FBQzZFLFdBQVdFLENBQUEsRUFBRztJQUNiLE9BQU8sQ0FBQ1gsSUFBSSxDQUFDQyxLQUFLLENBQUNELElBQUksQ0FBQ0UsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRUYsSUFBSSxDQUFDQyxLQUFLLENBQUNELElBQUksQ0FBQ0UsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztFQUN6RTtBQUNGOzs7Ozs7Ozs7Ozs7OztBQy9CZSxNQUFNdkYsSUFBSSxDQUFDO0VBQ3hCbEUsV0FBV0EsQ0FBQ3lFLElBQUksRUFBRTtJQUNoQixNQUFNMEYsU0FBUyxHQUFHO01BQ2hCLENBQUMsRUFBRSxTQUFTO01BQ1osQ0FBQyxFQUFFLFlBQVk7TUFDZixDQUFDLEVBQUUsV0FBVztNQUNkLENBQUMsRUFBRSxXQUFXO01BQ2QsQ0FBQyxFQUFFO0lBQ0wsQ0FBQztJQUNELElBQUksQ0FBQzNILE1BQU0sR0FBR2lDLElBQUk7SUFDbEIsSUFBSSxDQUFDekIsUUFBUSxHQUFHbUgsU0FBUyxDQUFDMUYsSUFBSSxDQUFDO0lBQy9CLElBQUksQ0FBQzJGLElBQUksR0FBRyxDQUFDO0lBQ2IsSUFBSSxDQUFDQyxJQUFJLEdBQUcsS0FBSztFQUNuQjtFQUVBekksR0FBR0EsQ0FBQSxFQUFHO0lBQ0osSUFBSSxDQUFDd0ksSUFBSSxFQUFFO0lBQ1gsSUFBSSxDQUFDNUUsTUFBTSxDQUFDLENBQUM7RUFDZjtFQUVBQSxNQUFNQSxDQUFBLEVBQUc7SUFDUCxJQUFJLElBQUksQ0FBQzRFLElBQUksS0FBSyxJQUFJLENBQUM1SCxNQUFNLEVBQUU7TUFDN0IsSUFBSSxDQUFDNkgsSUFBSSxHQUFHLElBQUk7SUFDbEI7SUFDQSxPQUFPLElBQUksQ0FBQ0EsSUFBSTtFQUNsQjtBQUNGOzs7Ozs7VUMxQkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05rQztBQUVsQyxNQUFNQyxJQUFJLEdBQUcsSUFBSXBFLGlEQUFRLENBQUMsQ0FBQztBQUMzQm9FLElBQUksQ0FBQzdELEtBQUssQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RvbUJ1aWxkZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lbG9vcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3BsYXllcnMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgRE9NYnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGNvbnN0IHNoaXBzID0ge1xuICAgICAgQ2FycmllcjogNSxcbiAgICAgIEJhdHRsZXNoaXA6IDQsXG4gICAgICBEZXN0cm95ZXI6IDMsXG4gICAgICBTdWJtYXJpbmU6IDMsXG4gICAgICBcIlBhdHJvbCBCb2F0XCI6IDIsXG4gICAgfTtcbiAgICB0aGlzLnNoaXBOYW1lcyA9IFtcbiAgICAgIFwiQ2FycmllclwiLFxuICAgICAgXCJCYXR0bGVzaGlwXCIsXG4gICAgICBcIkRlc3Ryb3llclwiLFxuICAgICAgXCJTdWJtYXJpbmVcIixcbiAgICAgIFwiUGF0cm9sIEJvYXRcIixcbiAgICBdO1xuICAgIHRoaXMuc2hpcFNpemVzID0gWzUsIDQsIDMsIDMsIDJdO1xuXG4gICAgdGhpcy5nYW1lQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLWNvbnRhaW5lclwiKTtcbiAgICAvLyBjcmVhdGUgY29udGFpbmVycyBmb3IgZWxlbWVudHM6XG4gICAgLy8gMiBwbGF5ZXIgY29udGFpbmVyc1xuICAgIHRoaXMucGxheWVyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB0aGlzLmFpQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB0aGlzLmdsb2JhbE1zZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgdGhpcy5nbG9iYWxNc2cuaWQgPSBcImdsb2JhbC1tc2dcIjtcbiAgICB0aGlzLnBsYXllckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwicGxheWVyLWNvbnRhaW5lclwiKTtcbiAgICB0aGlzLmFpQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJwbGF5ZXItY29udGFpbmVyXCIpO1xuICAgIC8vIGVhY2ggY29udGFpbmVyIGNvbnRhaW5zOlxuICAgIC8vIFBsYXllciB0aXRsZVxuICAgIGNvbnN0IHBsYXllclRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgyXCIpO1xuICAgIHBsYXllclRpdGxlLnRleHRDb250ZW50ID0gXCJQbGF5ZXJcIjtcblxuICAgIGNvbnN0IGFpVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDJcIik7XG4gICAgYWlUaXRsZS50ZXh0Q29udGVudCA9IFwiQ29tcHV0ZXJcIjtcblxuICAgIC8vIEdhbWUgYm9hcmQgZ3JpZCAoMTAgeCAxMClcbiAgICBjb25zdCBwbGF5ZXJHcmlkID0gdGhpcy4jZ3JpZFBvcHVsYXRlKFwiaHVtYW5cIik7XG4gICAgY29uc3QgYWlHcmlkID0gdGhpcy4jZ3JpZFBvcHVsYXRlKFwiYWlcIik7XG5cbiAgICB0aGlzLnBsYXllck1zZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgIHRoaXMucGxheWVyTXNnLmlkID0gXCJwbGF5ZXItbXNnXCI7XG4gICAgdGhpcy51cGRhdGVQbGF5ZXJNc2coMCk7XG5cbiAgICBjb25zdCBvcmllbnRhdGlvbkJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgb3JpZW50YXRpb25CdG4udGV4dENvbnRlbnQgPSBcImhvcml6b250YWxcIjtcbiAgICBvcmllbnRhdGlvbkJ0bi5pZCA9IFwib3JpZW50YXRpb24tYnRuXCI7XG5cbiAgICB0aGlzLnBsYXllckNvbnRhaW5lci5hcHBlbmQoXG4gICAgICBwbGF5ZXJUaXRsZSxcbiAgICAgIHBsYXllckdyaWQsXG4gICAgICB0aGlzLnBsYXllck1zZyxcbiAgICAgIG9yaWVudGF0aW9uQnRuXG4gICAgKTtcbiAgICB0aGlzLmFpQ29udGFpbmVyLmFwcGVuZChhaVRpdGxlLCBhaUdyaWQpO1xuXG4gICAgdGhpcy5nYW1lQ29udGFpbmVyLmFwcGVuZChcbiAgICAgIHRoaXMucGxheWVyQ29udGFpbmVyLFxuICAgICAgdGhpcy5haUNvbnRhaW5lcixcbiAgICAgIHRoaXMuZ2xvYmFsTXNnXG4gICAgKTtcbiAgfVxuXG4gIGhpdChncmlkSXRlbSkge1xuICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJzaGlwXCIpO1xuICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XG4gIH1cblxuICBtaXNzKGdyaWRJdGVtKSB7XG4gICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZChcIm1pc3NcIik7XG4gIH1cblxuICBzaGlwKGdyaWRJdGVtKSB7XG4gICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZChcInNoaXBcIik7XG4gIH1cblxuICBoaWRlRWxlbWVudChlbGVtZW50KSB7XG4gICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIH1cblxuICB1cGRhdGVQbGF5ZXJNc2coY291bnRlciwgZXJyb3IgPSBudWxsKSB7XG4gICAgbGV0IG1zZyA9IHRoaXMucGxheWVyTXNnO1xuICAgIGlmIChlcnJvcikge1xuICAgICAgbXNnLnRleHRDb250ZW50ID0gXCJJbnZhbGlkIHBsYWNlbWVudCBsb2NhdGlvblwiO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMudXBkYXRlUGxheWVyTXNnKGNvdW50ZXIpO1xuICAgICAgfSwgMTAwMCk7XG4gICAgfSBlbHNlIGlmIChjb3VudGVyIDwgNSkge1xuICAgICAgbXNnLnRleHRDb250ZW50ID0gYENsaWNrIGdyaWQgdG8gcGxhY2UgJHt0aGlzLnNoaXBOYW1lc1tjb3VudGVyXX0gKHNpemU6ICR7dGhpcy5zaGlwU2l6ZXNbY291bnRlcl19KWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuI2NsZWFyTXNnKG1zZyk7XG4gICAgfVxuICB9XG5cbiAgZGlzcGxheVN1bmtNZXNzYWdlKHNoaXAsIHBsYXllcikge1xuICAgIGNvbnN0IHN1bmtNc2cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICBzdW5rTXNnLnRleHRDb250ZW50ID0gYCR7cGxheWVyfSAke3NoaXAuc2hpcFR5cGV9IGhhcyBiZWVuIHN1bmsuYDtcbiAgICB0aGlzLmdsb2JhbE1zZy5hcHBlbmRDaGlsZChzdW5rTXNnKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuI2NsZWFyTXNnKHN1bmtNc2cpO1xuICAgIH0sIDMwMDApO1xuICB9XG5cbiAgZGlzcGxheVdpbm5lcih3aW5uZXIpIHtcbiAgICBjb25zdCB3aW5uZXJNc2cgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShgV2lubmVyOiAke3dpbm5lcn0hYCk7XG4gICAgdGhpcy5nbG9iYWxNc2cuYXBwZW5kQ2hpbGQod2lubmVyTXNnKTtcbiAgfVxuXG4gICNjbGVhck1zZyhtc2dFbGVtZW50KSB7XG4gICAgbXNnRWxlbWVudC5yZW1vdmUoKTtcbiAgfVxuXG4gICNncmlkUG9wdWxhdGUocGxheWVyKSB7XG4gICAgY29uc3QgZ3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgZ3JpZC5jbGFzc0xpc3QuYWRkKFwiZ3JpZFwiLCBwbGF5ZXIpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDA7IGkrKykge1xuICAgICAgY29uc3QgZ3JpZEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZChcImdyaWQtaXRlbVwiLCBwbGF5ZXIpO1xuICAgICAgZ3JpZEl0ZW0uZGF0YXNldC5jb29yZGluYXRlcyA9IHRoaXMuI2Nvb3Jkc1BvcHVsYXRlKGkpO1xuICAgICAgZ3JpZC5hcHBlbmRDaGlsZChncmlkSXRlbSk7XG4gICAgfVxuICAgIHJldHVybiBncmlkO1xuICB9XG5cbiAgI2Nvb3Jkc1BvcHVsYXRlKGkpIHtcbiAgICBpZiAoaSA8IDEwKSB7XG4gICAgICByZXR1cm4gW2ksIDBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgZGlnaXRzID0gaS50b1N0cmluZygpLnNwbGl0KFwiXCIpO1xuICAgICAgcmV0dXJuIFtkaWdpdHNbMV0sIGRpZ2l0c1swXV07XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lYm9hcmQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFsbFNoaXBzID0gW107XG4gICAgdGhpcy5taXNzZWRTaG90cyA9IFtdO1xuICAgIHRoaXMuaGl0U2hvdHMgPSBbXTtcbiAgICB0aGlzLmFsbFNob3RzID0gW107XG4gIH1cblxuICBwbGFjZVNoaXAoc2l6ZSwgZmlyc3RDb29yZCwgb3JpZW50YXRpb24gPSBcImhvcml6b250YWxcIikge1xuICAgIG9yaWVudGF0aW9uID0gb3JpZW50YXRpb24udG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IHRoaXMuI2J1aWxkQ29vcmRpbmF0ZXMoc2l6ZSwgZmlyc3RDb29yZCwgb3JpZW50YXRpb24pO1xuICAgIGlmICh0aGlzLiN2YWxpZGF0ZUNvb3JkaW5hdGVzKGNvb3JkaW5hdGVzKSkge1xuICAgICAgY29uc3QgbmV3U2hpcCA9IG5ldyBTaGlwKHNpemUpO1xuICAgICAgY29uc3Qgc2hpcEVudHJ5ID0gW25ld1NoaXAsIGNvb3JkaW5hdGVzXTtcbiAgICAgIHRoaXMuYWxsU2hpcHMucHVzaChzaGlwRW50cnkpO1xuICAgICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLy8gcmVjZWl2ZUF0dGFjayBmdW5jdGlvbiB0YWtlcyBjb29yZGluYXRlcywgZGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCB0aGUgYXR0YWNrIGhpdCBhIHNoaXBcbiAgLy8gdGhlbiBzZW5kcyB0aGUg4oCYaGl04oCZIGZ1bmN0aW9uIHRvIHRoZSBjb3JyZWN0IHNoaXAsIG9yIHJlY29yZHMgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBtaXNzZWQgc2hvdC5cbiAgcmVjZWl2ZUF0dGFjayhjb29yZGluYXRlKSB7XG4gICAgdGhpcy5hbGxTaG90cy5wdXNoKGNvb3JkaW5hdGUpO1xuICAgIGNvbnN0IHNoaXAgPSB0aGlzLiNmaW5kU2hpcChjb29yZGluYXRlKTtcbiAgICBpZiAoc2hpcCkge1xuICAgICAgc2hpcC5oaXQoKTtcbiAgICAgIHRoaXMuaGl0U2hvdHMucHVzaChjb29yZGluYXRlKTtcbiAgICAgIHJldHVybiBzaGlwO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1pc3NlZFNob3RzLnB1c2goY29vcmRpbmF0ZSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZ2FtZU92ZXIoKSB7XG4gICAgbGV0IGFsbFN1bmsgPSB0cnVlO1xuICAgIC8vIElmIHNoaXBzIGhhdmVuJ3QgeWV0IGJlZW4gcGxhY2VkLCByZXR1cm4gZmFsc2UuXG4gICAgaWYgKHRoaXMuYWxsU2hpcHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuYWxsU2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgaWYgKCFzaGlwWzBdLmlzU3VuaygpKSB7XG4gICAgICAgIGFsbFN1bmsgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gYWxsU3VuaztcbiAgfVxuXG4gICNidWlsZENvb3JkaW5hdGVzKHNpemUsIGZpcnN0Q29vcmQsIG9yaWVudGF0aW9uKSB7XG4gICAgbGV0IGNvb3JkaW5hdGVzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICAgICAgY29vcmRpbmF0ZXMucHVzaChbZmlyc3RDb29yZFswXSArIGksIGZpcnN0Q29vcmRbMV1dKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvb3JkaW5hdGVzLnB1c2goW2ZpcnN0Q29vcmRbMF0sIGZpcnN0Q29vcmRbMV0gKyBpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb29yZGluYXRlcztcbiAgfVxuXG4gICN2YWxpZGF0ZUNvb3JkaW5hdGVzKGNvb3JkaW5hdGVzKSB7XG4gICAgbGV0IHZhbGlkQ29vcmRzID0gdHJ1ZTtcbiAgICBjb29yZGluYXRlcy5mb3JFYWNoKChjb29yZCkgPT4ge1xuICAgICAgLy8gSWYgYSBzaGlwIGFscmVhZHkgZXhpc3RzIGF0IGxvY2F0aW9uLCByZWplY3QgaXQuXG4gICAgICBpZiAodGhpcy4jZmluZFNoaXAoY29vcmQpIHx8IGNvb3JkWzBdID4gOSB8fCBjb29yZFsxXSA+IDkpIHtcbiAgICAgICAgdmFsaWRDb29yZHMgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdmFsaWRDb29yZHM7XG4gIH1cblxuICAjZmluZFNoaXAoY29vcmRpbmF0ZSkge1xuICAgIGxldCBmb3VuZFNoaXAgPSBmYWxzZTtcbiAgICB0aGlzLmFsbFNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgc2hpcFsxXS5zb21lKCh4KSA9PiB4WzBdID09PSBjb29yZGluYXRlWzBdICYmIHhbMV0gPT09IGNvb3JkaW5hdGVbMV0pXG4gICAgICApIHtcbiAgICAgICAgZm91bmRTaGlwID0gc2hpcFswXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZm91bmRTaGlwO1xuICB9XG59XG4iLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuL3BsYXllcnNcIjtcbmltcG9ydCBET01idWlsZGVyIGZyb20gXCIuL2RvbUJ1aWxkZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZWxvb3Age1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmh1bWFuID0gbmV3IFBsYXllcih0cnVlKTtcbiAgICB0aGlzLmFpID0gbmV3IFBsYXllcihmYWxzZSk7XG4gICAgdGhpcy5wbGF5ZXJzID0gW3RoaXMuaHVtYW4sIHRoaXMuYWldO1xuICAgIHRoaXMuY3VycmVudFBsYXllciA9IHRoaXMuYWk7XG4gICAgdGhpcy5yb3VuZCA9IG51bGw7XG4gICAgdGhpcy5wYWdlID0gbmV3IERPTWJ1aWxkZXIoKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuI2FpU2hpcHMoKTtcbiAgICB0aGlzLmFpR3JpZExpc3RlbmVycygpO1xuICAgIHRoaXMuaHVtYW5HcmlkTGlzdGVuZXJzKCk7XG5cbiAgICBsZXQgY3VycmVudFJvdW5kID0gdGhpcy5yb3VuZDtcblxuICAgIGNvbnN0IHBsYXlSb3VuZCA9ICgpID0+IHtcbiAgICAgIGlmICghdGhpcy4jZ2FtZU92ZXIoKSkge1xuICAgICAgICB0aGlzLiNhaUF0dGFjaygpO1xuICAgICAgICBpZiAoY3VycmVudFJvdW5kICE9PSB0aGlzLnJvdW5kKSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50UGxheWVyID1cbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBsYXllciA9PT0gdGhpcy5odW1hbiA/IHRoaXMuYWkgOiB0aGlzLmh1bWFuO1xuICAgICAgICAgIGN1cnJlbnRSb3VuZCA9IHRoaXMucm91bmQ7XG4gICAgICAgIH1cbiAgICAgICAgc2V0VGltZW91dChwbGF5Um91bmQsIDApOyAvLyBTY2hlZHVsZSB0aGUgbmV4dCByb3VuZCBhZnRlciBhIHZlcnkgc2hvcnQgZGVsYXlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuI2VuZEdhbWUoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGxheVJvdW5kKCk7XG4gIH1cblxuICAjZW5kR2FtZSgpIHtcbiAgICBjb25zdCB3aW5uZXIgPSB0aGlzLiNnYW1lT3ZlcigpID09PSB0aGlzLmh1bWFuID8gXCJZb3VcIiA6IFwiQ29tcHV0ZXJcIjtcbiAgICBjb25zdCBhaUdyaWRJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ3JpZC1pdGVtLmFpXCIpO1xuICAgIGNvbnN0IGh1bWFuR3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ncmlkLWl0ZW0uaHVtYW5cIik7XG4gICAgLy8gZGlzcGxheSB0aGUgd2lubmVyXG4gICAgdGhpcy5wYWdlLmRpc3BsYXlXaW5uZXIod2lubmVyKTtcbiAgICAvLyByZXZlYWwgYWxsIGJvYXJkc1xuICAgIGFpR3JpZEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGxldCBjb29yZHMgPSBpdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXNcbiAgICAgICAgLnNwbGl0KFwiLFwiKVxuICAgICAgICAubWFwKCh4KSA9PiBwYXJzZUludCh4LCAxMCkpO1xuICAgICAgdGhpcy4jYWlCb2FyZEF0dGFjayhjb29yZHMsIGl0ZW0pO1xuICAgIH0pO1xuICAgIGh1bWFuR3JpZEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGlmICghaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoXCJzaGlwXCIpICYmICFpdGVtLmNsYXNzTGlzdC5jb250YWlucyhcImhpdFwiKSkge1xuICAgICAgICB0aGlzLnBhZ2UubWlzcyhpdGVtKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGh1bWFuR3JpZExpc3RlbmVycygpIHtcbiAgICB0aGlzLiNvcmllbnRhdGlvbkJ0bkxpc3RlbmVyKCk7XG4gICAgY29uc3Qgb3JpZW50YXRpb25CdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yaWVudGF0aW9uLWJ0blwiKTtcbiAgICBjb25zdCBncmlkSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdyaWQtaXRlbS5odW1hblwiKTtcbiAgICBsZXQgcGxhY2VtZW50Q291bnRlciA9IDA7XG4gICAgbGV0IHNoaXBTaXplID0gWzUsIDQsIDMsIDMsIDJdO1xuXG4gICAgZ3JpZEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgaWYgKHBsYWNlbWVudENvdW50ZXIgPj0gc2hpcFNpemUubGVuZ3RoIC0gMSAmJiAhdGhpcy5yb3VuZCkge1xuICAgICAgICAgIHRoaXMucGFnZS5oaWRlRWxlbWVudChvcmllbnRhdGlvbkJ0bik7XG4gICAgICAgICAgdGhpcy5yb3VuZCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb3JpZW50YXRpb24gPSBvcmllbnRhdGlvbkJ0bi50ZXh0Q29udGVudDtcbiAgICAgICAgbGV0IGNvb3JkcyA9IGl0ZW0uZGF0YXNldC5jb29yZGluYXRlc1xuICAgICAgICAgIC5zcGxpdChcIixcIilcbiAgICAgICAgICAubWFwKCh4KSA9PiBwYXJzZUludCh4LCAxMCkpO1xuICAgICAgICBsZXQgY29vcmRpbmF0ZXMgPSB0aGlzLmh1bWFuLmJvYXJkLnBsYWNlU2hpcChcbiAgICAgICAgICBzaGlwU2l6ZVtwbGFjZW1lbnRDb3VudGVyXSxcbiAgICAgICAgICBjb29yZHMsXG4gICAgICAgICAgb3JpZW50YXRpb25cbiAgICAgICAgKTtcbiAgICAgICAgLy8gU2hvdyBzaGlwIG9uIHNjcmVlbiwgaWYgdmFsaWQgcGxhY2VtZW50LlxuICAgICAgICBpZiAoY29vcmRpbmF0ZXMpIHtcbiAgICAgICAgICBjb29yZGluYXRlcy5mb3JFYWNoKChjb29yZCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wYWdlLnNoaXAodGhpcy4jZmluZEdyaWRJdGVtKGNvb3JkLCBcImh1bWFuXCIpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBwbGFjZW1lbnRDb3VudGVyKys7XG4gICAgICAgICAgdGhpcy5wYWdlLnVwZGF0ZVBsYXllck1zZyhwbGFjZW1lbnRDb3VudGVyKTtcbiAgICAgICAgICAvLyBEaXNwbGF5IGVycm9yIG1lc3NhZ2UgaWYgcGxhY2VtZW50IGdvZXMgb2ZmIGJvYXJkIG9yIGNvbmZsaWN0cyB3aXRoIGV4aXN0aW5nIHNoaXAuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5wYWdlLnVwZGF0ZVBsYXllck1zZyhwbGFjZW1lbnRDb3VudGVyLCBcImVycm9yXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gICNvcmllbnRhdGlvbkJ0bkxpc3RlbmVyKCkge1xuICAgIGNvbnN0IG9yaWVudGF0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmllbnRhdGlvbi1idG5cIik7XG4gICAgb3JpZW50YXRpb24uZGlzcGxheSA9IFwiYmxvY2tcIjtcblxuICAgIG9yaWVudGF0aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICBsZXQgdGV4dCA9IG9yaWVudGF0aW9uLnRleHRDb250ZW50O1xuICAgICAgb3JpZW50YXRpb24udGV4dENvbnRlbnQgPVxuICAgICAgICB0ZXh0ID09PSBcImhvcml6b250YWxcIiA/IFwidmVydGljYWxcIiA6IFwiaG9yaXpvbnRhbFwiO1xuICAgIH0pO1xuICB9XG5cbiAgYWlHcmlkTGlzdGVuZXJzKCkge1xuICAgIGNvbnN0IGdyaWRJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ3JpZC1pdGVtLmFpXCIpO1xuICAgIGdyaWRJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQbGF5ZXIgPT09IHRoaXMuaHVtYW4gJiYgdGhpcy4jdmFsaWRJdGVtKGl0ZW0pKSB7XG4gICAgICAgICAgbGV0IGNvb3JkcyA9IGl0ZW0uZGF0YXNldC5jb29yZGluYXRlc1xuICAgICAgICAgICAgLnNwbGl0KFwiLFwiKVxuICAgICAgICAgICAgLm1hcCgoeCkgPT4gcGFyc2VJbnQoeCwgMTApKTtcbiAgICAgICAgICB0aGlzLiNhaUJvYXJkQXR0YWNrKGNvb3JkcywgaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gUHJldmVudCBhY2NpZGVudGFsbHkgYXR0YWNraW5nIHByZXZpb3VzbHkgY2xpY2tlZCBncmlkIGl0ZW0uXG4gICN2YWxpZEl0ZW0oZ3JpZEl0ZW0pIHtcbiAgICBpZiAoXG4gICAgICBncmlkSXRlbS5jbGFzc0xpc3QuY29udGFpbnMoXCJoaXRcIikgfHxcbiAgICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5jb250YWlucyhcIm1pc3NcIilcbiAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgI2FpQm9hcmRBdHRhY2soY29vcmRzLCBncmlkSXRlbSkge1xuICAgIGxldCBhdHRhY2tlZFNoaXAgPSB0aGlzLmFpLmJvYXJkLnJlY2VpdmVBdHRhY2soY29vcmRzKTtcbiAgICBpZiAoYXR0YWNrZWRTaGlwKSB7XG4gICAgICAvLyBpZiBhIHNoaXAgaXMgaGl0LCBtYXJrIHNxdWFyZSBhcyByZWQuXG4gICAgICB0aGlzLnBhZ2UuaGl0KGdyaWRJdGVtKTtcbiAgICAgIHRoaXMucm91bmQrKztcbiAgICAgIC8vIGlmIHNoaXAgaXMgc3VuaywgZGlzcGxheSBnbG9iYWwgbWVzc2FnZS5cbiAgICAgIGlmIChhdHRhY2tlZFNoaXAuaXNTdW5rKCkgJiYgIXRoaXMuI2dhbWVPdmVyKCkpIHtcbiAgICAgICAgdGhpcy5wYWdlLmRpc3BsYXlTdW5rTWVzc2FnZShhdHRhY2tlZFNoaXAsIFwiQ29tcHV0ZXInc1wiKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaWYgYSBzaGlwIGlzIG5vdCBoaXQsIG1hcmsgc3F1YXJlIGFzIGJsdWUuXG4gICAgICB0aGlzLnBhZ2UubWlzcyhncmlkSXRlbSk7XG4gICAgICB0aGlzLnJvdW5kKys7XG4gICAgfVxuICB9XG5cbiAgI2FpU2hpcHMoKSB7XG4gICAgY29uc3Qgc2hpcFNpemVzID0gWzUsIDQsIDMsIDMsIDJdO1xuICAgIHNoaXBTaXplcy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBsZXQgY29vcmRpbmF0ZXMgPSB0aGlzLiNhaVNoaXBQbGFjZW1lbnQoc2hpcCk7XG4gICAgICAvLyBSZXJ1biBwbGFjZW1lbnQgdW50aWwgdmFsaWQgcGxhY2VtZW50IGZvdW5kLlxuICAgICAgd2hpbGUgKCFjb29yZGluYXRlcykge1xuICAgICAgICBjb29yZGluYXRlcyA9IHRoaXMuI2FpU2hpcFBsYWNlbWVudChzaGlwKTtcbiAgICAgIH1cbiAgICAgIC8vIHNob3cgYWkgc2hpcHMgd2hpbGUgdGVzdGluZy5cbiAgICAgIC8vIGNvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkKSA9PiB7XG4gICAgICAvLyAgIHRoaXMucGFnZS5zaGlwKHRoaXMuI2ZpbmRHcmlkSXRlbShjb29yZCwgXCJhaVwiKSk7XG4gICAgICAvLyB9KTtcbiAgICB9KTtcbiAgfVxuXG4gICNhaVNoaXBQbGFjZW1lbnQoc2hpcCkge1xuICAgIGxldCBvcmllbnRhdGlvbiA9IHRoaXMuI3JhbmRvbU51bSgyKSA9PT0gMCA/IFwiaG9yaXpvbnRhbFwiIDogXCJ2ZXJ0aWNhbFwiO1xuICAgIGxldCBjb29yZCA9XG4gICAgICBvcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCJcbiAgICAgICAgPyBbdGhpcy4jcmFuZG9tTnVtKDEwIC0gc2hpcCksIHRoaXMuI3JhbmRvbU51bSgxMCldXG4gICAgICAgIDogW3RoaXMuI3JhbmRvbU51bSgxMCksIHRoaXMuI3JhbmRvbU51bSgxMCAtIHNoaXApXTtcbiAgICBsZXQgY29vcmRpbmF0ZXMgPSB0aGlzLmFpLmJvYXJkLnBsYWNlU2hpcChzaGlwLCBjb29yZCwgb3JpZW50YXRpb24pO1xuICAgIHJldHVybiBjb29yZGluYXRlcztcbiAgfVxuXG4gICNhaUF0dGFjaygpIHtcbiAgICBpZiAodGhpcy5jdXJyZW50UGxheWVyID09PSB0aGlzLmFpICYmIHRoaXMucm91bmQpIHtcbiAgICAgIGxldCBjb29yZCA9IHRoaXMuI2FpQ29vcmRTZWxlY3RvcigpO1xuICAgICAgbGV0IGdyaWRJdGVtID0gdGhpcy4jZmluZEdyaWRJdGVtKGNvb3JkLCBcImh1bWFuXCIpO1xuICAgICAgbGV0IGF0dGFja2VkU2hpcCA9IHRoaXMuaHVtYW4uYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZCk7XG4gICAgICBpZiAoYXR0YWNrZWRTaGlwKSB7XG4gICAgICAgIC8vIGlmIGEgc2hpcCBpcyBoaXQsIG1hcmsgc3F1YXJlIGFzIHJlZC5cbiAgICAgICAgdGhpcy5wYWdlLmhpdChncmlkSXRlbSk7XG4gICAgICAgIHRoaXMucm91bmQrKztcbiAgICAgICAgLy8gaWYgc2hpcCBpcyBzdW5rLCBkaXNwbGF5IGdsb2JhbCBtZXNzYWdlLlxuICAgICAgICBpZiAoYXR0YWNrZWRTaGlwLmlzU3VuaygpKSB7XG4gICAgICAgICAgdGhpcy5wYWdlLmRpc3BsYXlTdW5rTWVzc2FnZShhdHRhY2tlZFNoaXAsIFwiUGxheWVyJ3NcIik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGlmIGEgc2hpcCBpcyBub3QgaGl0LCBtYXJrIHNxdWFyZSBhcyBibHVlLlxuICAgICAgICB0aGlzLnBhZ2UubWlzcyhncmlkSXRlbSk7XG4gICAgICAgIHRoaXMucm91bmQrKztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAjYWlDb29yZFNlbGVjdG9yKHByZXZpb3VzQ29vcmQgPSBudWxsLCBhY2N1bXVsYXRvciA9IDApIHtcbiAgICBjb25zdCBodW1hbiA9IHRoaXMuaHVtYW4uYm9hcmQ7XG4gICAgbGV0IGNvb3JkID0gW107XG4gICAgLy8gaWYgYSBzaGlwIGhhcyBiZWVuIGhpdCwgdXNlIG1vc3QgcmVjZW50IGhpdCB0byBkZXRlcm1pbmUgbmV4dCBzaG90LlxuICAgIGlmIChodW1hbi5oaXRTaG90cy5sZW5ndGggPiAwICYmIGFjY3VtdWxhdG9yIDwgNCkge1xuICAgICAgY29uc3QgaGl0Q29vcmQgPSBodW1hbi5oaXRTaG90cy5hdCgtMSk7XG4gICAgICBjb25zdCBsYXN0U2hvdCA9XG4gICAgICAgIHByZXZpb3VzQ29vcmQgPT09IG51bGwgPyBodW1hbi5hbGxTaG90cy5hdCgtMSkgOiBwcmV2aW91c0Nvb3JkO1xuICAgICAgaWYgKGxhc3RTaG90WzBdID09PSBoaXRDb29yZFswXSAmJiBsYXN0U2hvdFsxXSA9PT0gaGl0Q29vcmRbMV0pIHtcbiAgICAgICAgY29vcmQgPSBbaGl0Q29vcmRbMF0gKyAxLCBoaXRDb29yZFsxXV07XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBsYXN0U2hvdFswXSA9PT0gaGl0Q29vcmRbMF0gKyAxICYmXG4gICAgICAgIGxhc3RTaG90WzFdID09PSBoaXRDb29yZFsxXVxuICAgICAgKSB7XG4gICAgICAgIGNvb3JkID0gW2hpdENvb3JkWzBdIC0gMSwgaGl0Q29vcmRbMV1dO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgbGFzdFNob3RbMF0gPT09IGhpdENvb3JkWzBdIC0gMSAmJlxuICAgICAgICBsYXN0U2hvdFsxXSA9PT0gaGl0Q29vcmRbMV1cbiAgICAgICkge1xuICAgICAgICBjb29yZCA9IFtoaXRDb29yZFswXSwgaGl0Q29vcmRbMV0gKyAxXTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIGxhc3RTaG90WzBdID09PSBoaXRDb29yZFswXSAmJlxuICAgICAgICBsYXN0U2hvdFsxXSA9PT0gaGl0Q29vcmRbMV0gKyAxXG4gICAgICApIHtcbiAgICAgICAgY29vcmQgPSBbaGl0Q29vcmRbMF0sIGhpdENvb3JkWzFdIC0gMV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb29yZCA9IFt0aGlzLiNyYW5kb21OdW0oMTApLCB0aGlzLiNyYW5kb21OdW0oMTApXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaWYgbm8gc2hpcCBoYXMgYmVlbiBoaXQsIHVzZSByYW5kb20gY29vcmQuXG4gICAgICBjb29yZCA9IFt0aGlzLiNyYW5kb21OdW0oMTApLCB0aGlzLiNyYW5kb21OdW0oMTApXTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiBjb29yZCBoYXMgYWxyZWFkeSBiZWVuIHVzZWQsIGlmIHNvIHJlcnVuIGZ1bmN0aW9uLlxuICAgIGh1bWFuLmFsbFNob3RzLmZvckVhY2goKHNob3QpID0+IHtcbiAgICAgIGlmIChzaG90WzBdID09PSBjb29yZFswXSAmJiBzaG90WzFdID09PSBjb29yZFsxXSkge1xuICAgICAgICBjb29yZCA9IHRoaXMuI2FpQ29vcmRTZWxlY3Rvcihjb29yZCwgYWNjdW11bGF0b3IgKyAxKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBDaGVjayBpZiBjb29yZCBpcyBvbiBib2FyZCwgaWYgbm90IHJlcnVuLlxuICAgIGlmIChjb29yZFswXSA+IDkgfHwgY29vcmRbMF0gPCAwIHx8IGNvb3JkWzFdID4gOSB8fCBjb29yZFsxXSA8IDApIHtcbiAgICAgIGNvb3JkID0gdGhpcy4jYWlDb29yZFNlbGVjdG9yKGNvb3JkLCBhY2N1bXVsYXRvciArIDEpO1xuICAgIH1cbiAgICByZXR1cm4gY29vcmQ7XG4gIH1cblxuICAjcmFuZG9tTnVtKG1heCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xuICB9XG5cbiAgI2ZpbmRHcmlkSXRlbShjb29yZCwgcGxheWVyKSB7XG4gICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLmdyaWQtaXRlbS4ke3BsYXllcn1gKTtcbiAgICBsZXQgZm91bmRJdGVtID0gZmFsc2U7XG4gICAgZ3JpZEl0ZW1zLmZvckVhY2goKGdyaWRJdGVtKSA9PiB7XG4gICAgICBpZiAoZ3JpZEl0ZW0uZGF0YXNldC5jb29yZGluYXRlcyA9PT0gY29vcmQudG9TdHJpbmcoKSkge1xuICAgICAgICBmb3VuZEl0ZW0gPSBncmlkSXRlbTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZm91bmRJdGVtO1xuICB9XG5cbiAgI2dhbWVPdmVyKCkge1xuICAgIC8vIEFJIHdpbnMgaWYgaHVtYW4gYm9hcmQgaXMgZ2FtZSBvdmVyLlxuICAgIGlmICh0aGlzLmh1bWFuLmJvYXJkLmdhbWVPdmVyKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmFpO1xuICAgICAgLy8gSHVtYW4gd2lucyBpZiBhaSBib2FyZCBpcyBnYW1lIG92ZXIuXG4gICAgfSBlbHNlIGlmICh0aGlzLmFpLmJvYXJkLmdhbWVPdmVyKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmh1bWFuO1xuICAgICAgLy8gRWxzZSBnYW1lIGNvbnRpbnVlcy5cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IEdhbWVib2FyZCBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IoaHVtYW4gPSB0cnVlKSB7XG4gICAgdGhpcy5ib2FyZCA9IG5ldyBHYW1lYm9hcmQoKTtcbiAgICB0aGlzLmlzSHVtYW4gPSBodW1hbjtcbiAgICB0aGlzLnByZXZpb3VzUGxheXMgPSBbXTtcbiAgfVxuXG4gIGF0dGFjayhwbGF5ZXIsIGNvb3JkaW5hdGUpIHtcbiAgICBpZiAoIXRoaXMuaXNIdW1hbikge1xuICAgICAgY29vcmRpbmF0ZSA9IHRoaXMuI2FpQXR0YWNrKHBsYXllci5ib2FyZCk7XG4gICAgfVxuXG4gICAgdGhpcy5wcmV2aW91c1BsYXlzLnB1c2goY29vcmRpbmF0ZSk7XG4gICAgcGxheWVyLmJvYXJkLnJlY2VpdmVBdHRhY2soY29vcmRpbmF0ZSk7XG4gIH1cblxuICAjYWlBdHRhY2soYm9hcmQpIHtcbiAgICBsZXQgY29vcmRpbmF0ZSA9IHRoaXMuI3JhbmRvbUNvb3JkKCk7XG4gICAgaWYgKHRoaXMucHJldmlvdXNQbGF5cy5pbmNsdWRlcyhjb29yZGluYXRlKSkge1xuICAgICAgdGhpcy4jYWlBdHRhY2soYm9hcmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY29vcmRpbmF0ZTtcbiAgICB9XG4gIH1cblxuICAvLyBHZW5lcmF0ZSByYW5kb20gY29vcmRpbmF0ZXMgYmV0d2VlbiAwIC0gOS5cbiAgI3JhbmRvbUNvb3JkKCkge1xuICAgIHJldHVybiBbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApLCBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCldO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTaGlwIHtcbiAgY29uc3RydWN0b3Ioc2l6ZSkge1xuICAgIGNvbnN0IHNoaXBUeXBlcyA9IHtcbiAgICAgIDU6IFwiQ2FycmllclwiLFxuICAgICAgNDogXCJCYXR0bGVzaGlwXCIsXG4gICAgICAzOiBcIkRlc3Ryb3llclwiLFxuICAgICAgMzogXCJTdWJtYXJpbmVcIixcbiAgICAgIDI6IFwiUGF0cm9sIEJvYXRcIixcbiAgICB9O1xuICAgIHRoaXMubGVuZ3RoID0gc2l6ZTtcbiAgICB0aGlzLnNoaXBUeXBlID0gc2hpcFR5cGVzW3NpemVdO1xuICAgIHRoaXMuaGl0cyA9IDA7XG4gICAgdGhpcy5zdW5rID0gZmFsc2U7XG4gIH1cblxuICBoaXQoKSB7XG4gICAgdGhpcy5oaXRzKys7XG4gICAgdGhpcy5pc1N1bmsoKTtcbiAgfVxuXG4gIGlzU3VuaygpIHtcbiAgICBpZiAodGhpcy5oaXRzID09PSB0aGlzLmxlbmd0aCkge1xuICAgICAgdGhpcy5zdW5rID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3VuaztcbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgR2FtZWxvb3AgZnJvbSBcIi4vZ2FtZWxvb3BcIjtcblxuY29uc3QgZ2FtZSA9IG5ldyBHYW1lbG9vcCgpO1xuZ2FtZS5zdGFydCgpO1xuIl0sIm5hbWVzIjpbIkRPTWJ1aWxkZXIiLCJjb25zdHJ1Y3RvciIsInNoaXBzIiwiQ2FycmllciIsIkJhdHRsZXNoaXAiLCJEZXN0cm95ZXIiLCJTdWJtYXJpbmUiLCJzaGlwTmFtZXMiLCJzaGlwU2l6ZXMiLCJnYW1lQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInBsYXllckNvbnRhaW5lciIsImNyZWF0ZUVsZW1lbnQiLCJhaUNvbnRhaW5lciIsImdsb2JhbE1zZyIsImlkIiwiY2xhc3NMaXN0IiwiYWRkIiwicGxheWVyVGl0bGUiLCJ0ZXh0Q29udGVudCIsImFpVGl0bGUiLCJwbGF5ZXJHcmlkIiwiZ3JpZFBvcHVsYXRlIiwiYWlHcmlkIiwicGxheWVyTXNnIiwidXBkYXRlUGxheWVyTXNnIiwib3JpZW50YXRpb25CdG4iLCJhcHBlbmQiLCJoaXQiLCJncmlkSXRlbSIsInJlbW92ZSIsIm1pc3MiLCJzaGlwIiwiaGlkZUVsZW1lbnQiLCJlbGVtZW50Iiwic3R5bGUiLCJkaXNwbGF5IiwiY291bnRlciIsImVycm9yIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwibXNnIiwic2V0VGltZW91dCIsImNsZWFyTXNnIiwiZGlzcGxheVN1bmtNZXNzYWdlIiwicGxheWVyIiwic3Vua01zZyIsInNoaXBUeXBlIiwiYXBwZW5kQ2hpbGQiLCJkaXNwbGF5V2lubmVyIiwid2lubmVyIiwid2lubmVyTXNnIiwiY3JlYXRlVGV4dE5vZGUiLCIjY2xlYXJNc2ciLCJtc2dFbGVtZW50IiwiI2dyaWRQb3B1bGF0ZSIsImdyaWQiLCJpIiwiZGF0YXNldCIsImNvb3JkaW5hdGVzIiwiY29vcmRzUG9wdWxhdGUiLCIjY29vcmRzUG9wdWxhdGUiLCJkaWdpdHMiLCJ0b1N0cmluZyIsInNwbGl0IiwiU2hpcCIsIkdhbWVib2FyZCIsImFsbFNoaXBzIiwibWlzc2VkU2hvdHMiLCJoaXRTaG90cyIsImFsbFNob3RzIiwicGxhY2VTaGlwIiwic2l6ZSIsImZpcnN0Q29vcmQiLCJvcmllbnRhdGlvbiIsInRvTG93ZXJDYXNlIiwiYnVpbGRDb29yZGluYXRlcyIsInZhbGlkYXRlQ29vcmRpbmF0ZXMiLCJuZXdTaGlwIiwic2hpcEVudHJ5IiwicHVzaCIsInJlY2VpdmVBdHRhY2siLCJjb29yZGluYXRlIiwiZmluZFNoaXAiLCJnYW1lT3ZlciIsImFsbFN1bmsiLCJmb3JFYWNoIiwiaXNTdW5rIiwiI2J1aWxkQ29vcmRpbmF0ZXMiLCIjdmFsaWRhdGVDb29yZGluYXRlcyIsInZhbGlkQ29vcmRzIiwiY29vcmQiLCIjZmluZFNoaXAiLCJmb3VuZFNoaXAiLCJzb21lIiwieCIsIlBsYXllciIsIkdhbWVsb29wIiwiaHVtYW4iLCJhaSIsInBsYXllcnMiLCJjdXJyZW50UGxheWVyIiwicm91bmQiLCJwYWdlIiwic3RhcnQiLCJhaVNoaXBzIiwiYWlHcmlkTGlzdGVuZXJzIiwiaHVtYW5HcmlkTGlzdGVuZXJzIiwiY3VycmVudFJvdW5kIiwicGxheVJvdW5kIiwiYWlBdHRhY2siLCJlbmRHYW1lIiwiI2VuZEdhbWUiLCJhaUdyaWRJdGVtcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJodW1hbkdyaWRJdGVtcyIsIml0ZW0iLCJjb29yZHMiLCJtYXAiLCJwYXJzZUludCIsImFpQm9hcmRBdHRhY2siLCJjb250YWlucyIsIm9yaWVudGF0aW9uQnRuTGlzdGVuZXIiLCJncmlkSXRlbXMiLCJwbGFjZW1lbnRDb3VudGVyIiwic2hpcFNpemUiLCJhZGRFdmVudExpc3RlbmVyIiwiYm9hcmQiLCJmaW5kR3JpZEl0ZW0iLCIjb3JpZW50YXRpb25CdG5MaXN0ZW5lciIsInRleHQiLCJ2YWxpZEl0ZW0iLCIjdmFsaWRJdGVtIiwiI2FpQm9hcmRBdHRhY2siLCJhdHRhY2tlZFNoaXAiLCIjYWlTaGlwcyIsImFpU2hpcFBsYWNlbWVudCIsIiNhaVNoaXBQbGFjZW1lbnQiLCJyYW5kb21OdW0iLCIjYWlBdHRhY2siLCJhaUNvb3JkU2VsZWN0b3IiLCIjYWlDb29yZFNlbGVjdG9yIiwicHJldmlvdXNDb29yZCIsImFjY3VtdWxhdG9yIiwiaGl0Q29vcmQiLCJhdCIsImxhc3RTaG90Iiwic2hvdCIsIiNyYW5kb21OdW0iLCJtYXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCIjZmluZEdyaWRJdGVtIiwiZm91bmRJdGVtIiwiI2dhbWVPdmVyIiwiaXNIdW1hbiIsInByZXZpb3VzUGxheXMiLCJhdHRhY2siLCJyYW5kb21Db29yZCIsImluY2x1ZGVzIiwiI3JhbmRvbUNvb3JkIiwic2hpcFR5cGVzIiwiaGl0cyIsInN1bmsiLCJnYW1lIl0sInNvdXJjZVJvb3QiOiIifQ==