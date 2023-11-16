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
      'Carrier': 5,
      'Battleship': 4,
      'Destroyer': 3,
      'Submarine': 3,
      'Patrol Boat': 2
    };
    this.shipNames = ['Carrier', 'Battleship', 'Destroyer', 'Submarine', 'Patrol Boat'];
    this.shipSizes = [5, 4, 3, 3, 2];
    this.gameContainer = document.getElementById('game-container');
    // create containers for elements:
    // 2 player containers
    this.playerContainer = document.createElement('div');
    this.aiContainer = document.createElement('div');
    this.globalMsg = document.createElement('div');
    this.globalMsg.id = 'global-msg';
    this.playerContainer.classList.add('player-container');
    this.aiContainer.classList.add('player-container');
    // each container contains:
    // Player title
    const playerTitle = document.createElement('h2');
    playerTitle.textContent = 'Player';
    const aiTitle = document.createElement('h2');
    aiTitle.textContent = 'Computer';

    // Game board grid (10 x 10)
    const playerGrid = this.#gridPopulate('human');
    const aiGrid = this.#gridPopulate('ai');
    this.playerMsg = document.createTextNode('');
    this.updatePlayerMsg(0);
    this.playerMsg.id = 'playerMsg';
    const orientationBtn = document.createElement('button');
    orientationBtn.textContent = 'horizontal';
    orientationBtn.id = 'orientationBtn';
    this.playerContainer.append(playerTitle, playerGrid, this.playerMsg, orientationBtn);
    this.aiContainer.append(aiTitle, aiGrid);
    this.gameContainer.append(this.playerContainer, this.aiContainer, this.globalMsg);
  }
  hit(gridItem) {
    gridItem.classList.remove('ship');
    gridItem.classList.add('hit');
  }
  miss(gridItem) {
    gridItem.classList.add('miss');
  }
  ship(gridItem) {
    gridItem.classList.add('ship');
  }
  hideElement(element) {
    element.style.display = 'none';
  }
  updatePlayerMsg(counter) {
    let error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    let msg = this.playerMsg;
    if (error) {
      msg.textContent = 'Invalid placement location';
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
    const sunkMsg = document.createTextNode(`${player} ${ship.shipType} has been sunk.`);
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
    const grid = document.createElement('div');
    grid.classList.add('grid', player);
    for (let i = 0; i < 100; i++) {
      const gridItem = document.createElement('div');
      gridItem.classList.add('grid-item', player);
      gridItem.dataset.coordinates = this.#coordsPopulate(i);
      grid.appendChild(gridItem);
    }
    return grid;
  }
  #coordsPopulate(i) {
    if (i < 10) {
      return [i, 0];
    } else {
      let digits = i.toString().split('');
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
    let orientation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'horizontal';
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
    const winner = this.#gameOver() === this.human ? 'You' : 'Computer';
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
    const orientationBtn = document.getElementById("orientationBtn");
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
    const orientation = document.getElementById("orientationBtn");
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
        if (this.currentPlayer === this.human) {
          let coords = item.dataset.coordinates.split(",").map(x => parseInt(x, 10));
          this.#aiBoardAttack(coords, item);
        }
      });
    });
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
      while (!coordinates) {
        coordinates = this.#aiShipPlacement(ship);
      }

      // show ai ships while testing.
      coordinates.forEach(coord => {
        this.page.ship(this.#findGridItem(coord, "ai"));
      });
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
      let gridItem = this.#findGridItem(coord, 'human');
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
      5: 'Carrier',
      4: 'Battleship',
      3: 'Destroyer',
      3: 'Submarine',
      2: 'Patrol Boat'
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBQyxFQUFHLFlBQVk7TUFBRSxDQUFDLEVBQUcsV0FBVztNQUFFLENBQUMsRUFBRyxXQUFXO01BQUUsQ0FBQyxFQUFHO0lBQWEsQ0FBQztJQUN4RyxJQUFJLENBQUN2SCxNQUFNLEdBQUdnQyxJQUFJO0lBQ2xCLElBQUksQ0FBQ3hCLFFBQVEsR0FBRytHLFNBQVMsQ0FBQ3ZGLElBQUksQ0FBQztJQUMvQixJQUFJLENBQUN3RixJQUFJLEdBQUcsQ0FBQztJQUNiLElBQUksQ0FBQ0MsSUFBSSxHQUFHLEtBQUs7RUFDbkI7RUFFQXJJLEdBQUdBLENBQUEsRUFBRztJQUNKLElBQUksQ0FBQ29JLElBQUksRUFBRTtJQUNYLElBQUksQ0FBQzFFLE1BQU0sQ0FBQyxDQUFDO0VBQ2Y7RUFFQUEsTUFBTUEsQ0FBQSxFQUFHO0lBQ1AsSUFBSSxJQUFJLENBQUMwRSxJQUFJLEtBQUssSUFBSSxDQUFDeEgsTUFBTSxFQUFFO01BQzdCLElBQUksQ0FBQ3lILElBQUksR0FBRyxJQUFJO0lBQ2xCO0lBQ0EsT0FBTyxJQUFJLENBQUNBLElBQUk7RUFDbEI7QUFDRjs7Ozs7O1VDcEJBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOa0M7QUFFbEMsTUFBTUMsSUFBSSxHQUFHLElBQUlsRSxpREFBUSxDQUFDLENBQUM7QUFDM0JrRSxJQUFJLENBQUMzRCxLQUFLLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9kb21CdWlsZGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWxvb3AuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXJzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2NyaXB0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIERPTWJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBjb25zdCBzaGlwcyA9IHsnQ2Fycmllcic6IDUsICdCYXR0bGVzaGlwJzogNCwgJ0Rlc3Ryb3llcic6IDMsICdTdWJtYXJpbmUnOiAzLCAnUGF0cm9sIEJvYXQnOiAyfVxuICAgIHRoaXMuc2hpcE5hbWVzID0gWydDYXJyaWVyJywgJ0JhdHRsZXNoaXAnLCAnRGVzdHJveWVyJywgJ1N1Ym1hcmluZScsICdQYXRyb2wgQm9hdCddO1xuICAgIHRoaXMuc2hpcFNpemVzID0gWzUsIDQsIDMsIDMsIDJdO1xuXG4gICAgdGhpcy5nYW1lQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtY29udGFpbmVyJyk7XG4gICAgLy8gY3JlYXRlIGNvbnRhaW5lcnMgZm9yIGVsZW1lbnRzOlxuICAgICAgLy8gMiBwbGF5ZXIgY29udGFpbmVyc1xuICAgIHRoaXMucGxheWVyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5haUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuZ2xvYmFsTXNnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5nbG9iYWxNc2cuaWQgPSAnZ2xvYmFsLW1zZyc7XG4gICAgdGhpcy5wbGF5ZXJDb250YWluZXIuY2xhc3NMaXN0LmFkZCgncGxheWVyLWNvbnRhaW5lcicpO1xuICAgIHRoaXMuYWlDb250YWluZXIuY2xhc3NMaXN0LmFkZCgncGxheWVyLWNvbnRhaW5lcicpO1xuICAgICAgLy8gZWFjaCBjb250YWluZXIgY29udGFpbnM6XG4gICAgICAgIC8vIFBsYXllciB0aXRsZVxuICAgICAgICBjb25zdCBwbGF5ZXJUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJylcbiAgICAgICAgcGxheWVyVGl0bGUudGV4dENvbnRlbnQgPSAnUGxheWVyJztcblxuICAgICAgICBjb25zdCBhaVRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbiAgICAgICAgYWlUaXRsZS50ZXh0Q29udGVudCA9ICdDb21wdXRlcic7XG5cbiAgICAgICAgLy8gR2FtZSBib2FyZCBncmlkICgxMCB4IDEwKVxuICAgICAgICBjb25zdCBwbGF5ZXJHcmlkID0gdGhpcy4jZ3JpZFBvcHVsYXRlKCdodW1hbicpO1xuICAgICAgICBjb25zdCBhaUdyaWQgPSB0aGlzLiNncmlkUG9wdWxhdGUoJ2FpJyk7XG5cbiAgICAgICAgdGhpcy5wbGF5ZXJNc2cgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgICAgIHRoaXMudXBkYXRlUGxheWVyTXNnKDApO1xuICAgICAgICB0aGlzLnBsYXllck1zZy5pZCA9ICdwbGF5ZXJNc2cnO1xuXG4gICAgICAgIGNvbnN0IG9yaWVudGF0aW9uQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgIG9yaWVudGF0aW9uQnRuLnRleHRDb250ZW50ID0gJ2hvcml6b250YWwnO1xuICAgICAgICBvcmllbnRhdGlvbkJ0bi5pZCA9ICdvcmllbnRhdGlvbkJ0bic7XG5cbiAgICAgIHRoaXMucGxheWVyQ29udGFpbmVyLmFwcGVuZChwbGF5ZXJUaXRsZSwgcGxheWVyR3JpZCwgdGhpcy5wbGF5ZXJNc2csIG9yaWVudGF0aW9uQnRuKTtcbiAgICAgIHRoaXMuYWlDb250YWluZXIuYXBwZW5kKGFpVGl0bGUsIGFpR3JpZCk7XG5cbiAgICB0aGlzLmdhbWVDb250YWluZXIuYXBwZW5kKHRoaXMucGxheWVyQ29udGFpbmVyLCB0aGlzLmFpQ29udGFpbmVyLCB0aGlzLmdsb2JhbE1zZyk7XG4gIH1cblxuICBoaXQoZ3JpZEl0ZW0pIHtcbiAgICBncmlkSXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdzaGlwJyk7XG4gICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZCgnaGl0Jyk7XG4gIH07XG5cbiAgbWlzcyhncmlkSXRlbSkge1xuICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5hZGQoJ21pc3MnKTtcbiAgfVxuXG4gIHNoaXAoZ3JpZEl0ZW0pIHtcbiAgICBncmlkSXRlbS5jbGFzc0xpc3QuYWRkKCdzaGlwJyk7XG4gIH07XG5cbiAgaGlkZUVsZW1lbnQoZWxlbWVudCkge1xuICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfVxuXG4gIHVwZGF0ZVBsYXllck1zZyhjb3VudGVyLCBlcnJvcj1udWxsKSB7XG4gICAgbGV0IG1zZyA9IHRoaXMucGxheWVyTXNnO1xuICAgIGlmIChlcnJvcikge1xuICAgICAgbXNnLnRleHRDb250ZW50ID0gJ0ludmFsaWQgcGxhY2VtZW50IGxvY2F0aW9uJztcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZVBsYXllck1zZyhjb3VudGVyKTtcbiAgICAgIH0sIDEwMDApXG4gICAgfSBlbHNlIGlmIChjb3VudGVyIDwgNSkge1xuICAgICAgbXNnLnRleHRDb250ZW50ID0gYENsaWNrIGdyaWQgdG8gcGxhY2UgJHt0aGlzLnNoaXBOYW1lc1tjb3VudGVyXX0gKHNpemU6ICR7dGhpcy5zaGlwU2l6ZXNbY291bnRlcl19KWBcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLiNjbGVhck1zZyhtc2cpO1xuICAgIH1cbiAgfVxuXG4gIGRpc3BsYXlTdW5rTWVzc2FnZShzaGlwLCBwbGF5ZXIpIHtcbiAgICBjb25zdCBzdW5rTXNnID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYCR7cGxheWVyfSAke3NoaXAuc2hpcFR5cGV9IGhhcyBiZWVuIHN1bmsuYClcbiAgICB0aGlzLmdsb2JhbE1zZy5hcHBlbmRDaGlsZChzdW5rTXNnKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuI2NsZWFyTXNnKHN1bmtNc2cpO1xuICAgIH0sIDMwMDApO1xuICB9XG5cbiAgZGlzcGxheVdpbm5lcih3aW5uZXIpIHtcbiAgICBjb25zdCB3aW5uZXJNc2cgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShgV2lubmVyOiAke3dpbm5lcn0hYCk7XG4gICAgdGhpcy5nbG9iYWxNc2cuYXBwZW5kQ2hpbGQod2lubmVyTXNnKTtcbiAgfVxuXG4gICNjbGVhck1zZyhtc2dFbGVtZW50KSB7XG4gICAgbXNnRWxlbWVudC5yZW1vdmUoKTtcbiAgfVxuXG4gICNncmlkUG9wdWxhdGUocGxheWVyKSB7XG4gICAgY29uc3QgZ3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGdyaWQuY2xhc3NMaXN0LmFkZCgnZ3JpZCcsIHBsYXllcik7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDsgaSsrKSB7XG4gICAgICBjb25zdCBncmlkSXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZCgnZ3JpZC1pdGVtJywgcGxheWVyKTtcbiAgICAgIGdyaWRJdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXMgPSB0aGlzLiNjb29yZHNQb3B1bGF0ZShpKTtcbiAgICAgIGdyaWQuYXBwZW5kQ2hpbGQoZ3JpZEl0ZW0pO1xuICAgIH1cbiAgICByZXR1cm4gZ3JpZDtcbiAgfVxuXG4gICNjb29yZHNQb3B1bGF0ZShpKSB7XG4gICAgaWYgKGkgPCAxMCkge1xuICAgICAgcmV0dXJuIFtpLCAwXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGRpZ2l0cyA9IGkudG9TdHJpbmcoKS5zcGxpdCgnJyk7XG4gICAgICByZXR1cm4gW2RpZ2l0c1sxXSwgZGlnaXRzWzBdXTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBTaGlwIGZyb20gJy4vc2hpcHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lYm9hcmQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFsbFNoaXBzID0gW107XG4gICAgdGhpcy5taXNzZWRTaG90cyA9IFtdO1xuICAgIHRoaXMuaGl0U2hvdHMgPSBbXTtcbiAgICB0aGlzLmFsbFNob3RzID0gW107XG4gIH07XG5cbiAgcGxhY2VTaGlwKHNpemUsIGZpcnN0Q29vcmQsIG9yaWVudGF0aW9uPSdob3Jpem9udGFsJykge1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gdGhpcy4jYnVpbGRDb29yZGluYXRlcyhzaXplLCBmaXJzdENvb3JkLCBvcmllbnRhdGlvbik7XG4gICAgaWYgKHRoaXMuI3ZhbGlkYXRlQ29vcmRpbmF0ZXMoY29vcmRpbmF0ZXMpKSB7XG4gICAgICBjb25zdCBuZXdTaGlwID0gbmV3IFNoaXAoc2l6ZSk7XG4gICAgICBjb25zdCBzaGlwRW50cnkgPSBbbmV3U2hpcCwgY29vcmRpbmF0ZXNdO1xuICAgICAgdGhpcy5hbGxTaGlwcy5wdXNoKHNoaXBFbnRyeSk7XG4gICAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvLyByZWNlaXZlQXR0YWNrIGZ1bmN0aW9uIHRha2VzIGNvb3JkaW5hdGVzLCBkZXRlcm1pbmVzIHdoZXRoZXIgb3Igbm90IHRoZSBhdHRhY2sgaGl0IGEgc2hpcFxuICAvLyB0aGVuIHNlbmRzIHRoZSDigJhoaXTigJkgZnVuY3Rpb24gdG8gdGhlIGNvcnJlY3Qgc2hpcCwgb3IgcmVjb3JkcyB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIG1pc3NlZCBzaG90LlxuICByZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGUpIHtcbiAgICB0aGlzLmFsbFNob3RzLnB1c2goY29vcmRpbmF0ZSk7XG4gICAgY29uc3Qgc2hpcCA9IHRoaXMuI2ZpbmRTaGlwKGNvb3JkaW5hdGUpO1xuICAgIGlmIChzaGlwKSB7XG4gICAgICBzaGlwLmhpdCgpO1xuICAgICAgdGhpcy5oaXRTaG90cy5wdXNoKGNvb3JkaW5hdGUpO1xuICAgICAgcmV0dXJuIHNoaXA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWlzc2VkU2hvdHMucHVzaChjb29yZGluYXRlKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBnYW1lT3ZlcigpIHtcbiAgICBsZXQgYWxsU3VuayA9IHRydWU7XG4gICAgLy8gSWYgc2hpcHMgaGF2ZW4ndCB5ZXQgYmVlbiBwbGFjZWQsIHJldHVybiBmYWxzZS5cbiAgICBpZiAodGhpcy5hbGxTaGlwcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5hbGxTaGlwcy5mb3JFYWNoKHNoaXAgPT4ge1xuICAgICAgaWYgKCFzaGlwWzBdLmlzU3VuaygpKSB7XG4gICAgICAgIGFsbFN1bmsgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBhbGxTdW5rO1xuICB9XG5cbiAgI2J1aWxkQ29vcmRpbmF0ZXMoc2l6ZSwgZmlyc3RDb29yZCwgb3JpZW50YXRpb24pIHtcbiAgICBsZXQgY29vcmRpbmF0ZXMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgaWYgKG9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgY29vcmRpbmF0ZXMucHVzaChbZmlyc3RDb29yZFswXSArIGksIGZpcnN0Q29vcmRbMV1dKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvb3JkaW5hdGVzLnB1c2goW2ZpcnN0Q29vcmRbMF0sIGZpcnN0Q29vcmRbMV0gKyBpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb29yZGluYXRlcztcbiAgfVxuXG4gICN2YWxpZGF0ZUNvb3JkaW5hdGVzKGNvb3JkaW5hdGVzKSB7XG4gICAgbGV0IHZhbGlkQ29vcmRzID0gdHJ1ZTtcbiAgICBjb29yZGluYXRlcy5mb3JFYWNoKChjb29yZCkgPT4ge1xuICAgICAgLy8gSWYgYSBzaGlwIGFscmVhZHkgZXhpc3RzIGF0IGxvY2F0aW9uLCByZWplY3QgaXQuXG4gICAgICBpZiAodGhpcy4jZmluZFNoaXAoY29vcmQpIHx8IGNvb3JkWzBdID4gOSB8fCBjb29yZFsxXSA+IDkpIHtcbiAgICAgICAgdmFsaWRDb29yZHMgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiB2YWxpZENvb3JkcztcbiAgfVxuXG4gICNmaW5kU2hpcChjb29yZGluYXRlKSB7XG4gICAgbGV0IGZvdW5kU2hpcCA9IGZhbHNlO1xuICAgIHRoaXMuYWxsU2hpcHMuZm9yRWFjaChzaGlwID0+IHtcbiAgICAgIGlmIChzaGlwWzFdLnNvbWUoKHgpID0+IHhbMF0gPT09IGNvb3JkaW5hdGVbMF0gJiYgeFsxXSA9PT0gY29vcmRpbmF0ZVsxXSkpIHtcbiAgICAgICAgZm91bmRTaGlwID0gc2hpcFswXTtcbiAgICB9fSlcbiAgICByZXR1cm4gZm91bmRTaGlwO1xuICB9XG59XG4iLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuL3BsYXllcnNcIjtcbmltcG9ydCBET01idWlsZGVyIGZyb20gXCIuL2RvbUJ1aWxkZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZWxvb3Age1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmh1bWFuID0gbmV3IFBsYXllcih0cnVlKTtcbiAgICB0aGlzLmFpID0gbmV3IFBsYXllcihmYWxzZSk7XG4gICAgdGhpcy5wbGF5ZXJzID0gW3RoaXMuaHVtYW4sIHRoaXMuYWldO1xuICAgIHRoaXMuY3VycmVudFBsYXllciA9IHRoaXMuYWk7XG4gICAgdGhpcy5yb3VuZCA9IG51bGw7XG4gICAgdGhpcy5wYWdlID0gbmV3IERPTWJ1aWxkZXIoKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuI2FpU2hpcHMoKTtcbiAgICB0aGlzLmFpR3JpZExpc3RlbmVycygpO1xuICAgIHRoaXMuaHVtYW5HcmlkTGlzdGVuZXJzKCk7XG5cbiAgICBsZXQgY3VycmVudFJvdW5kID0gdGhpcy5yb3VuZDtcblxuICAgIGNvbnN0IHBsYXlSb3VuZCA9ICgpID0+IHtcbiAgICAgIGlmICghdGhpcy4jZ2FtZU92ZXIoKSkge1xuICAgICAgICB0aGlzLiNhaUF0dGFjaygpO1xuICAgICAgICBpZiAoY3VycmVudFJvdW5kICE9PSB0aGlzLnJvdW5kKSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50UGxheWVyID0gdGhpcy5jdXJyZW50UGxheWVyID09PSB0aGlzLmh1bWFuID8gdGhpcy5haSA6IHRoaXMuaHVtYW47XG4gICAgICAgICAgY3VycmVudFJvdW5kID0gdGhpcy5yb3VuZDtcbiAgICAgICAgfVxuICAgICAgICBzZXRUaW1lb3V0KHBsYXlSb3VuZCwgMCk7IC8vIFNjaGVkdWxlIHRoZSBuZXh0IHJvdW5kIGFmdGVyIGEgdmVyeSBzaG9ydCBkZWxheVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4jZW5kR2FtZSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwbGF5Um91bmQoKTtcbiAgfVxuXG4gICNlbmRHYW1lKCkge1xuICAgIGNvbnN0IHdpbm5lciA9IHRoaXMuI2dhbWVPdmVyKCkgPT09IHRoaXMuaHVtYW4gPyAnWW91JyA6ICdDb21wdXRlcic7XG4gICAgY29uc3QgYWlHcmlkSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdyaWQtaXRlbS5haVwiKTtcbiAgICBjb25zdCBodW1hbkdyaWRJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ3JpZC1pdGVtLmh1bWFuXCIpO1xuICAgIC8vIGRpc3BsYXkgdGhlIHdpbm5lclxuICAgIHRoaXMucGFnZS5kaXNwbGF5V2lubmVyKHdpbm5lcik7XG4gICAgLy8gcmV2ZWFsIGFsbCBib2FyZHNcbiAgICBhaUdyaWRJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgbGV0IGNvb3JkcyA9IGl0ZW0uZGF0YXNldC5jb29yZGluYXRlc1xuICAgICAgLnNwbGl0KFwiLFwiKVxuICAgICAgLm1hcCgoeCkgPT4gcGFyc2VJbnQoeCwgMTApKTtcbiAgICAgIHRoaXMuI2FpQm9hcmRBdHRhY2soY29vcmRzLCBpdGVtKTtcbiAgICB9KVxuICAgIGh1bWFuR3JpZEl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpZiAoIWl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKFwic2hpcFwiKSAmJiAhaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoXCJoaXRcIikpIHtcbiAgICAgICAgdGhpcy5wYWdlLm1pc3MoaXRlbSk7XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGh1bWFuR3JpZExpc3RlbmVycygpIHtcbiAgICB0aGlzLiNvcmllbnRhdGlvbkJ0bkxpc3RlbmVyKCk7XG4gICAgY29uc3Qgb3JpZW50YXRpb25CdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yaWVudGF0aW9uQnRuXCIpO1xuICAgIGNvbnN0IGdyaWRJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ3JpZC1pdGVtLmh1bWFuXCIpO1xuICAgIGxldCBwbGFjZW1lbnRDb3VudGVyID0gMDtcbiAgICBsZXQgc2hpcFNpemUgPSBbNSwgNCwgMywgMywgMl07XG5cbiAgICBncmlkSXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBpZiAocGxhY2VtZW50Q291bnRlciA+PSBzaGlwU2l6ZS5sZW5ndGggLSAxICYmICF0aGlzLnJvdW5kKSB7XG4gICAgICAgICAgdGhpcy5wYWdlLmhpZGVFbGVtZW50KG9yaWVudGF0aW9uQnRuKTtcbiAgICAgICAgICB0aGlzLnJvdW5kID0gMDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uQnRuLnRleHRDb250ZW50O1xuICAgICAgICBsZXQgY29vcmRzID0gaXRlbS5kYXRhc2V0LmNvb3JkaW5hdGVzXG4gICAgICAgICAgLnNwbGl0KFwiLFwiKVxuICAgICAgICAgIC5tYXAoKHgpID0+IHBhcnNlSW50KHgsIDEwKSk7XG4gICAgICAgIGxldCBjb29yZGluYXRlcyA9IHRoaXMuaHVtYW4uYm9hcmQucGxhY2VTaGlwKFxuICAgICAgICAgIHNoaXBTaXplW3BsYWNlbWVudENvdW50ZXJdLFxuICAgICAgICAgIGNvb3JkcyxcbiAgICAgICAgICBvcmllbnRhdGlvblxuICAgICAgICApO1xuICAgICAgICAvLyBTaG93IHNoaXAgb24gc2NyZWVuLCBpZiB2YWxpZCBwbGFjZW1lbnQuXG4gICAgICAgIGlmIChjb29yZGluYXRlcykge1xuICAgICAgICAgIGNvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBhZ2Uuc2hpcCh0aGlzLiNmaW5kR3JpZEl0ZW0oY29vcmQsIFwiaHVtYW5cIikpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHBsYWNlbWVudENvdW50ZXIrKztcbiAgICAgICAgICB0aGlzLnBhZ2UudXBkYXRlUGxheWVyTXNnKHBsYWNlbWVudENvdW50ZXIpO1xuICAgICAgICAvLyBEaXNwbGF5IGVycm9yIG1lc3NhZ2UgaWYgcGxhY2VtZW50IGdvZXMgb2ZmIGJvYXJkIG9yIGNvbmZsaWN0cyB3aXRoIGV4aXN0aW5nIHNoaXAuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnBhZ2UudXBkYXRlUGxheWVyTXNnKHBsYWNlbWVudENvdW50ZXIsIFwiZXJyb3JcIik7XG4gICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gICNvcmllbnRhdGlvbkJ0bkxpc3RlbmVyKCkge1xuICAgIGNvbnN0IG9yaWVudGF0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmllbnRhdGlvbkJ0blwiKTtcbiAgICBvcmllbnRhdGlvbi5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXG4gICAgb3JpZW50YXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGxldCB0ZXh0ID0gb3JpZW50YXRpb24udGV4dENvbnRlbnQ7XG4gICAgICBvcmllbnRhdGlvbi50ZXh0Q29udGVudCA9XG4gICAgICAgIHRleHQgPT09IFwiaG9yaXpvbnRhbFwiID8gXCJ2ZXJ0aWNhbFwiIDogXCJob3Jpem9udGFsXCI7XG4gICAgfSk7XG4gIH1cblxuICBhaUdyaWRMaXN0ZW5lcnMoKSB7XG4gICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ncmlkLWl0ZW0uYWlcIik7XG4gICAgZ3JpZEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBsYXllciA9PT0gdGhpcy5odW1hbikge1xuICAgICAgICAgIGxldCBjb29yZHMgPSBpdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXNcbiAgICAgICAgICAgIC5zcGxpdChcIixcIilcbiAgICAgICAgICAgIC5tYXAoKHgpID0+IHBhcnNlSW50KHgsIDEwKSk7XG4gICAgICAgICAgdGhpcy4jYWlCb2FyZEF0dGFjayhjb29yZHMsIGl0ZW0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gICNhaUJvYXJkQXR0YWNrKGNvb3JkcywgZ3JpZEl0ZW0pIHtcbiAgICBsZXQgYXR0YWNrZWRTaGlwID0gdGhpcy5haS5ib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkcylcbiAgICBpZiAoYXR0YWNrZWRTaGlwKSB7XG4gICAgICAvLyBpZiBhIHNoaXAgaXMgaGl0LCBtYXJrIHNxdWFyZSBhcyByZWQuXG4gICAgICB0aGlzLnBhZ2UuaGl0KGdyaWRJdGVtKTtcbiAgICAgIHRoaXMucm91bmQrKztcbiAgICAgIC8vIGlmIHNoaXAgaXMgc3VuaywgZGlzcGxheSBnbG9iYWwgbWVzc2FnZS5cbiAgICAgIGlmIChhdHRhY2tlZFNoaXAuaXNTdW5rKCkgJiYgIXRoaXMuI2dhbWVPdmVyKCkpIHtcbiAgICAgICAgdGhpcy5wYWdlLmRpc3BsYXlTdW5rTWVzc2FnZShhdHRhY2tlZFNoaXAsIFwiQ29tcHV0ZXInc1wiKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaWYgYSBzaGlwIGlzIG5vdCBoaXQsIG1hcmsgc3F1YXJlIGFzIGJsdWUuXG4gICAgICB0aGlzLnBhZ2UubWlzcyhncmlkSXRlbSk7XG4gICAgICB0aGlzLnJvdW5kKys7XG4gICAgfVxuICB9XG5cbiAgI2FpU2hpcHMoKSB7XG4gICAgY29uc3Qgc2hpcFNpemVzID0gWzUsIDQsIDMsIDMsIDJdO1xuICAgIHNoaXBTaXplcy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBsZXQgY29vcmRpbmF0ZXMgPSB0aGlzLiNhaVNoaXBQbGFjZW1lbnQoc2hpcCk7XG5cbiAgICAgIHdoaWxlICghY29vcmRpbmF0ZXMpIHtcbiAgICAgICAgY29vcmRpbmF0ZXMgPSB0aGlzLiNhaVNoaXBQbGFjZW1lbnQoc2hpcCk7XG4gICAgICB9XG5cbiAgICAgIC8vIHNob3cgYWkgc2hpcHMgd2hpbGUgdGVzdGluZy5cbiAgICAgIGNvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkKSA9PiB7XG4gICAgICAgIHRoaXMucGFnZS5zaGlwKHRoaXMuI2ZpbmRHcmlkSXRlbShjb29yZCwgXCJhaVwiKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gICNhaVNoaXBQbGFjZW1lbnQoc2hpcCkge1xuICAgIGxldCBvcmllbnRhdGlvbiA9IHRoaXMuI3JhbmRvbU51bSgyKSA9PT0gMCA/IFwiaG9yaXpvbnRhbFwiIDogXCJ2ZXJ0aWNhbFwiO1xuICAgIGxldCBjb29yZCA9XG4gICAgICBvcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCJcbiAgICAgICAgPyBbdGhpcy4jcmFuZG9tTnVtKDEwIC0gc2hpcCksIHRoaXMuI3JhbmRvbU51bSgxMCldXG4gICAgICAgIDogW3RoaXMuI3JhbmRvbU51bSgxMCksIHRoaXMuI3JhbmRvbU51bSgxMCAtIHNoaXApXTtcbiAgICBsZXQgY29vcmRpbmF0ZXMgPSB0aGlzLmFpLmJvYXJkLnBsYWNlU2hpcChzaGlwLCBjb29yZCwgb3JpZW50YXRpb24pO1xuICAgIHJldHVybiBjb29yZGluYXRlcztcbiAgfVxuXG4gICNhaUF0dGFjaygpIHtcbiAgICBpZiAodGhpcy5jdXJyZW50UGxheWVyID09PSB0aGlzLmFpICYmIHRoaXMucm91bmQpIHtcbiAgICAgIGxldCBjb29yZCA9IHRoaXMuI2FpQ29vcmRTZWxlY3RvcigpO1xuICAgICAgbGV0IGdyaWRJdGVtID0gdGhpcy4jZmluZEdyaWRJdGVtKGNvb3JkLCAnaHVtYW4nKTtcbiAgICAgIGxldCBhdHRhY2tlZFNoaXAgPSB0aGlzLmh1bWFuLmJvYXJkLnJlY2VpdmVBdHRhY2soY29vcmQpXG4gICAgICBpZiAoYXR0YWNrZWRTaGlwKSB7XG4gICAgICAgIC8vIGlmIGEgc2hpcCBpcyBoaXQsIG1hcmsgc3F1YXJlIGFzIHJlZC5cbiAgICAgICAgdGhpcy5wYWdlLmhpdChncmlkSXRlbSk7XG4gICAgICAgIHRoaXMucm91bmQrKztcbiAgICAgICAgLy8gaWYgc2hpcCBpcyBzdW5rLCBkaXNwbGF5IGdsb2JhbCBtZXNzYWdlLlxuICAgICAgICBpZiAoYXR0YWNrZWRTaGlwLmlzU3VuaygpKSB7XG4gICAgICAgICAgdGhpcy5wYWdlLmRpc3BsYXlTdW5rTWVzc2FnZShhdHRhY2tlZFNoaXAsIFwiUGxheWVyJ3NcIik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGlmIGEgc2hpcCBpcyBub3QgaGl0LCBtYXJrIHNxdWFyZSBhcyBibHVlLlxuICAgICAgICB0aGlzLnBhZ2UubWlzcyhncmlkSXRlbSk7XG4gICAgICAgIHRoaXMucm91bmQrKztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAjYWlDb29yZFNlbGVjdG9yKHByZXZpb3VzQ29vcmQ9bnVsbCwgYWNjdW11bGF0b3I9MCkge1xuICAgIGNvbnN0IGh1bWFuID0gdGhpcy5odW1hbi5ib2FyZDtcbiAgICBsZXQgY29vcmQgPSBbXTtcbiAgICAvLyBpZiBhIHNoaXAgaGFzIGJlZW4gaGl0LCB1c2UgbW9zdCByZWNlbnQgaGl0IHRvIGRldGVybWluZSBuZXh0IHNob3QuXG4gICAgaWYgKGh1bWFuLmhpdFNob3RzLmxlbmd0aCA+IDAgJiYgYWNjdW11bGF0b3IgPCA0KSB7XG4gICAgICBjb25zdCBoaXRDb29yZCA9IGh1bWFuLmhpdFNob3RzLmF0KC0xKTtcbiAgICAgIGNvbnN0IGxhc3RTaG90ID0gcHJldmlvdXNDb29yZCA9PT0gbnVsbCA/IGh1bWFuLmFsbFNob3RzLmF0KC0xKSA6IHByZXZpb3VzQ29vcmQ7XG4gICAgICBpZiAobGFzdFNob3RbMF0gPT09IGhpdENvb3JkWzBdICYmIGxhc3RTaG90WzFdID09PSBoaXRDb29yZFsxXSkge1xuICAgICAgICBjb29yZCA9IFtoaXRDb29yZFswXSArIDEsIGhpdENvb3JkWzFdXTtcbiAgICAgIH0gZWxzZSBpZiAobGFzdFNob3RbMF0gPT09IGhpdENvb3JkWzBdICsgMSAmJiBsYXN0U2hvdFsxXSA9PT0gaGl0Q29vcmRbMV0pIHtcbiAgICAgICAgY29vcmQgPSBbaGl0Q29vcmRbMF0gLSAxLCBoaXRDb29yZFsxXV07XG4gICAgICB9IGVsc2UgaWYgKGxhc3RTaG90WzBdID09PSBoaXRDb29yZFswXSAtIDEgJiYgbGFzdFNob3RbMV0gPT09IGhpdENvb3JkWzFdKSB7XG4gICAgICAgIGNvb3JkID0gW2hpdENvb3JkWzBdLCBoaXRDb29yZFsxXSArIDFdO1xuICAgICAgfSBlbHNlIGlmIChsYXN0U2hvdFswXSA9PT0gaGl0Q29vcmRbMF0gJiYgbGFzdFNob3RbMV0gPT09IGhpdENvb3JkWzFdICsgMSkge1xuICAgICAgICBjb29yZCA9IFtoaXRDb29yZFswXSwgaGl0Q29vcmRbMV0gLSAxXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvb3JkID0gW3RoaXMuI3JhbmRvbU51bSgxMCksIHRoaXMuI3JhbmRvbU51bSgxMCldO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBpZiBubyBzaGlwIGhhcyBiZWVuIGhpdCwgdXNlIHJhbmRvbSBjb29yZC5cbiAgICAgIGNvb3JkID0gW3RoaXMuI3JhbmRvbU51bSgxMCksIHRoaXMuI3JhbmRvbU51bSgxMCldO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIGNvb3JkIGhhcyBhbHJlYWR5IGJlZW4gdXNlZCwgaWYgc28gcmVydW4gZnVuY3Rpb24uXG4gICAgaHVtYW4uYWxsU2hvdHMuZm9yRWFjaChzaG90ID0+IHtcbiAgICAgIGlmIChzaG90WzBdID09PSBjb29yZFswXSAmJiBzaG90WzFdID09PSBjb29yZFsxXSkge1xuICAgICAgICBjb29yZCA9IHRoaXMuI2FpQ29vcmRTZWxlY3Rvcihjb29yZCwgYWNjdW11bGF0b3IgKyAxKTtcbiAgICAgIH1cbiAgICB9KVxuICAgIC8vIENoZWNrIGlmIGNvb3JkIGlzIG9uIGJvYXJkLCBpZiBub3QgcmVydW4uXG4gICAgaWYgKGNvb3JkWzBdID4gOSB8fCBjb29yZFswXSA8IDAgfHwgY29vcmRbMV0gPiA5IHx8IGNvb3JkWzFdIDwgMCkge1xuICAgICAgY29vcmQgPSB0aGlzLiNhaUNvb3JkU2VsZWN0b3IoY29vcmQsIGFjY3VtdWxhdG9yICsgMSk7XG4gICAgfVxuICAgIHJldHVybiBjb29yZDtcbiAgfVxuXG4gICNyYW5kb21OdW0obWF4KSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1heCk7XG4gIH1cblxuICAjZmluZEdyaWRJdGVtKGNvb3JkLCBwbGF5ZXIpIHtcbiAgICBjb25zdCBncmlkSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuZ3JpZC1pdGVtLiR7cGxheWVyfWApO1xuICAgIGxldCBmb3VuZEl0ZW0gPSBmYWxzZTtcbiAgICBncmlkSXRlbXMuZm9yRWFjaCgoZ3JpZEl0ZW0pID0+IHtcbiAgICAgIGlmIChncmlkSXRlbS5kYXRhc2V0LmNvb3JkaW5hdGVzID09PSBjb29yZC50b1N0cmluZygpKSB7XG4gICAgICAgIGZvdW5kSXRlbSA9IGdyaWRJdGVtO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBmb3VuZEl0ZW07XG4gIH1cblxuICAjZ2FtZU92ZXIoKSB7XG4gICAgLy8gQUkgd2lucyBpZiBodW1hbiBib2FyZCBpcyBnYW1lIG92ZXIuXG4gICAgaWYgKHRoaXMuaHVtYW4uYm9hcmQuZ2FtZU92ZXIoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuYWk7XG4gICAgLy8gSHVtYW4gd2lucyBpZiBhaSBib2FyZCBpcyBnYW1lIG92ZXIuXG4gICAgfSBlbHNlIGlmICh0aGlzLmFpLmJvYXJkLmdhbWVPdmVyKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmh1bWFuO1xuICAgIC8vIEVsc2UgZ2FtZSBjb250aW51ZXMuXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBHYW1lYm9hcmQgZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKGh1bWFuPXRydWUpIHtcbiAgICB0aGlzLmJvYXJkID0gbmV3IEdhbWVib2FyZDtcbiAgICB0aGlzLmlzSHVtYW4gPSBodW1hbjtcbiAgICB0aGlzLnByZXZpb3VzUGxheXMgPSBbXTtcbiAgfTtcblxuICBhdHRhY2socGxheWVyLCBjb29yZGluYXRlKSB7XG4gICAgaWYgKCF0aGlzLmlzSHVtYW4pIHtcbiAgICAgIGNvb3JkaW5hdGUgPSB0aGlzLiNhaUF0dGFjayhwbGF5ZXIuYm9hcmQpO1xuICAgIH1cblxuICAgIHRoaXMucHJldmlvdXNQbGF5cy5wdXNoKGNvb3JkaW5hdGUpO1xuICAgIHBsYXllci5ib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGUpO1xuICB9XG5cbiAgI2FpQXR0YWNrKGJvYXJkKSB7XG4gICAgbGV0IGNvb3JkaW5hdGUgPSB0aGlzLiNyYW5kb21Db29yZCgpO1xuICAgIGlmICh0aGlzLnByZXZpb3VzUGxheXMuaW5jbHVkZXMoY29vcmRpbmF0ZSkpIHtcbiAgICAgIHRoaXMuI2FpQXR0YWNrKGJvYXJkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNvb3JkaW5hdGU7XG4gICAgfVxuICB9XG5cbiAgLy8gR2VuZXJhdGUgcmFuZG9tIGNvb3JkaW5hdGVzIGJldHdlZW4gMCAtIDkuXG4gICNyYW5kb21Db29yZCgpIHtcbiAgICByZXR1cm4gW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSwgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApXTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hpcCB7XG4gIGNvbnN0cnVjdG9yKHNpemUpIHtcbiAgICBjb25zdCBzaGlwVHlwZXMgPSB7NSA6ICdDYXJyaWVyJywgNCA6ICdCYXR0bGVzaGlwJywgMyA6ICdEZXN0cm95ZXInLCAzIDogJ1N1Ym1hcmluZScsIDIgOiAnUGF0cm9sIEJvYXQnfVxuICAgIHRoaXMubGVuZ3RoID0gc2l6ZTtcbiAgICB0aGlzLnNoaXBUeXBlID0gc2hpcFR5cGVzW3NpemVdO1xuICAgIHRoaXMuaGl0cyA9IDA7XG4gICAgdGhpcy5zdW5rID0gZmFsc2U7XG4gIH1cblxuICBoaXQoKSB7XG4gICAgdGhpcy5oaXRzKys7XG4gICAgdGhpcy5pc1N1bmsoKTtcbiAgfVxuXG4gIGlzU3VuaygpIHtcbiAgICBpZiAodGhpcy5oaXRzID09PSB0aGlzLmxlbmd0aCkge1xuICAgICAgdGhpcy5zdW5rID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3VuaztcbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgR2FtZWxvb3AgZnJvbSBcIi4vZ2FtZWxvb3BcIjtcblxuY29uc3QgZ2FtZSA9IG5ldyBHYW1lbG9vcCgpO1xuZ2FtZS5zdGFydCgpO1xuIl0sIm5hbWVzIjpbIkRPTWJ1aWxkZXIiLCJjb25zdHJ1Y3RvciIsInNoaXBzIiwic2hpcE5hbWVzIiwic2hpcFNpemVzIiwiZ2FtZUNvbnRhaW5lciIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJwbGF5ZXJDb250YWluZXIiLCJjcmVhdGVFbGVtZW50IiwiYWlDb250YWluZXIiLCJnbG9iYWxNc2ciLCJpZCIsImNsYXNzTGlzdCIsImFkZCIsInBsYXllclRpdGxlIiwidGV4dENvbnRlbnQiLCJhaVRpdGxlIiwicGxheWVyR3JpZCIsImdyaWRQb3B1bGF0ZSIsImFpR3JpZCIsInBsYXllck1zZyIsImNyZWF0ZVRleHROb2RlIiwidXBkYXRlUGxheWVyTXNnIiwib3JpZW50YXRpb25CdG4iLCJhcHBlbmQiLCJoaXQiLCJncmlkSXRlbSIsInJlbW92ZSIsIm1pc3MiLCJzaGlwIiwiaGlkZUVsZW1lbnQiLCJlbGVtZW50Iiwic3R5bGUiLCJkaXNwbGF5IiwiY291bnRlciIsImVycm9yIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwibXNnIiwic2V0VGltZW91dCIsImNsZWFyTXNnIiwiZGlzcGxheVN1bmtNZXNzYWdlIiwicGxheWVyIiwic3Vua01zZyIsInNoaXBUeXBlIiwiYXBwZW5kQ2hpbGQiLCJkaXNwbGF5V2lubmVyIiwid2lubmVyIiwid2lubmVyTXNnIiwiI2NsZWFyTXNnIiwibXNnRWxlbWVudCIsIiNncmlkUG9wdWxhdGUiLCJncmlkIiwiaSIsImRhdGFzZXQiLCJjb29yZGluYXRlcyIsImNvb3Jkc1BvcHVsYXRlIiwiI2Nvb3Jkc1BvcHVsYXRlIiwiZGlnaXRzIiwidG9TdHJpbmciLCJzcGxpdCIsIlNoaXAiLCJHYW1lYm9hcmQiLCJhbGxTaGlwcyIsIm1pc3NlZFNob3RzIiwiaGl0U2hvdHMiLCJhbGxTaG90cyIsInBsYWNlU2hpcCIsInNpemUiLCJmaXJzdENvb3JkIiwib3JpZW50YXRpb24iLCJidWlsZENvb3JkaW5hdGVzIiwidmFsaWRhdGVDb29yZGluYXRlcyIsIm5ld1NoaXAiLCJzaGlwRW50cnkiLCJwdXNoIiwicmVjZWl2ZUF0dGFjayIsImNvb3JkaW5hdGUiLCJmaW5kU2hpcCIsImdhbWVPdmVyIiwiYWxsU3VuayIsImZvckVhY2giLCJpc1N1bmsiLCIjYnVpbGRDb29yZGluYXRlcyIsIiN2YWxpZGF0ZUNvb3JkaW5hdGVzIiwidmFsaWRDb29yZHMiLCJjb29yZCIsIiNmaW5kU2hpcCIsImZvdW5kU2hpcCIsInNvbWUiLCJ4IiwiUGxheWVyIiwiR2FtZWxvb3AiLCJodW1hbiIsImFpIiwicGxheWVycyIsImN1cnJlbnRQbGF5ZXIiLCJyb3VuZCIsInBhZ2UiLCJzdGFydCIsImFpU2hpcHMiLCJhaUdyaWRMaXN0ZW5lcnMiLCJodW1hbkdyaWRMaXN0ZW5lcnMiLCJjdXJyZW50Um91bmQiLCJwbGF5Um91bmQiLCJhaUF0dGFjayIsImVuZEdhbWUiLCIjZW5kR2FtZSIsImFpR3JpZEl0ZW1zIiwicXVlcnlTZWxlY3RvckFsbCIsImh1bWFuR3JpZEl0ZW1zIiwiaXRlbSIsImNvb3JkcyIsIm1hcCIsInBhcnNlSW50IiwiYWlCb2FyZEF0dGFjayIsImNvbnRhaW5zIiwib3JpZW50YXRpb25CdG5MaXN0ZW5lciIsImdyaWRJdGVtcyIsInBsYWNlbWVudENvdW50ZXIiLCJzaGlwU2l6ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJib2FyZCIsImZpbmRHcmlkSXRlbSIsIiNvcmllbnRhdGlvbkJ0bkxpc3RlbmVyIiwidGV4dCIsIiNhaUJvYXJkQXR0YWNrIiwiYXR0YWNrZWRTaGlwIiwiI2FpU2hpcHMiLCJhaVNoaXBQbGFjZW1lbnQiLCIjYWlTaGlwUGxhY2VtZW50IiwicmFuZG9tTnVtIiwiI2FpQXR0YWNrIiwiYWlDb29yZFNlbGVjdG9yIiwiI2FpQ29vcmRTZWxlY3RvciIsInByZXZpb3VzQ29vcmQiLCJhY2N1bXVsYXRvciIsImhpdENvb3JkIiwiYXQiLCJsYXN0U2hvdCIsInNob3QiLCIjcmFuZG9tTnVtIiwibWF4IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiI2ZpbmRHcmlkSXRlbSIsImZvdW5kSXRlbSIsIiNnYW1lT3ZlciIsImlzSHVtYW4iLCJwcmV2aW91c1BsYXlzIiwiYXR0YWNrIiwicmFuZG9tQ29vcmQiLCJpbmNsdWRlcyIsIiNyYW5kb21Db29yZCIsInNoaXBUeXBlcyIsImhpdHMiLCJzdW5rIiwiZ2FtZSJdLCJzb3VyY2VSb290IjoiIn0=