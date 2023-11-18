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
    this.playerMsg = document.createElement('p');
    this.playerMsg.id = 'player-msg';
    this.updatePlayerMsg(0);
    const orientationBtn = document.createElement('button');
    orientationBtn.textContent = 'horizontal';
    orientationBtn.id = 'orientation-btn';
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
    const sunkMsg = document.createElement('p');
    sunkMsg.textContent = `${player} ${ship.shipType} has been sunk.`;
    // const sunkMsg = document.createTextNode(`${player} ${ship.shipType} has been sunk.`)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOa0M7QUFFbEMsTUFBTUMsSUFBSSxHQUFHLElBQUlwRSxpREFBUSxDQUFDLENBQUM7QUFDM0JvRSxJQUFJLENBQUM3RCxLQUFLLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9kb21CdWlsZGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWxvb3AuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXJzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2NyaXB0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIERPTWJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBjb25zdCBzaGlwcyA9IHsnQ2Fycmllcic6IDUsICdCYXR0bGVzaGlwJzogNCwgJ0Rlc3Ryb3llcic6IDMsICdTdWJtYXJpbmUnOiAzLCAnUGF0cm9sIEJvYXQnOiAyfVxuICAgIHRoaXMuc2hpcE5hbWVzID0gWydDYXJyaWVyJywgJ0JhdHRsZXNoaXAnLCAnRGVzdHJveWVyJywgJ1N1Ym1hcmluZScsICdQYXRyb2wgQm9hdCddO1xuICAgIHRoaXMuc2hpcFNpemVzID0gWzUsIDQsIDMsIDMsIDJdO1xuXG4gICAgdGhpcy5nYW1lQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtY29udGFpbmVyJyk7XG4gICAgLy8gY3JlYXRlIGNvbnRhaW5lcnMgZm9yIGVsZW1lbnRzOlxuICAgICAgLy8gMiBwbGF5ZXIgY29udGFpbmVyc1xuICAgIHRoaXMucGxheWVyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5haUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuZ2xvYmFsTXNnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5nbG9iYWxNc2cuaWQgPSAnZ2xvYmFsLW1zZyc7XG4gICAgdGhpcy5wbGF5ZXJDb250YWluZXIuY2xhc3NMaXN0LmFkZCgncGxheWVyLWNvbnRhaW5lcicpO1xuICAgIHRoaXMuYWlDb250YWluZXIuY2xhc3NMaXN0LmFkZCgncGxheWVyLWNvbnRhaW5lcicpO1xuICAgICAgLy8gZWFjaCBjb250YWluZXIgY29udGFpbnM6XG4gICAgICAgIC8vIFBsYXllciB0aXRsZVxuICAgICAgICBjb25zdCBwbGF5ZXJUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJylcbiAgICAgICAgcGxheWVyVGl0bGUudGV4dENvbnRlbnQgPSAnUGxheWVyJztcblxuICAgICAgICBjb25zdCBhaVRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbiAgICAgICAgYWlUaXRsZS50ZXh0Q29udGVudCA9ICdDb21wdXRlcic7XG5cbiAgICAgICAgLy8gR2FtZSBib2FyZCBncmlkICgxMCB4IDEwKVxuICAgICAgICBjb25zdCBwbGF5ZXJHcmlkID0gdGhpcy4jZ3JpZFBvcHVsYXRlKCdodW1hbicpO1xuICAgICAgICBjb25zdCBhaUdyaWQgPSB0aGlzLiNncmlkUG9wdWxhdGUoJ2FpJyk7XG5cbiAgICAgICAgdGhpcy5wbGF5ZXJNc2cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIHRoaXMucGxheWVyTXNnLmlkID0gJ3BsYXllci1tc2cnO1xuICAgICAgICB0aGlzLnVwZGF0ZVBsYXllck1zZygwKTtcblxuICAgICAgICBjb25zdCBvcmllbnRhdGlvbkJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBvcmllbnRhdGlvbkJ0bi50ZXh0Q29udGVudCA9ICdob3Jpem9udGFsJztcbiAgICAgICAgb3JpZW50YXRpb25CdG4uaWQgPSAnb3JpZW50YXRpb24tYnRuJztcblxuICAgICAgdGhpcy5wbGF5ZXJDb250YWluZXIuYXBwZW5kKHBsYXllclRpdGxlLCBwbGF5ZXJHcmlkLCB0aGlzLnBsYXllck1zZywgb3JpZW50YXRpb25CdG4pO1xuICAgICAgdGhpcy5haUNvbnRhaW5lci5hcHBlbmQoYWlUaXRsZSwgYWlHcmlkKTtcblxuICAgIHRoaXMuZ2FtZUNvbnRhaW5lci5hcHBlbmQodGhpcy5wbGF5ZXJDb250YWluZXIsIHRoaXMuYWlDb250YWluZXIsIHRoaXMuZ2xvYmFsTXNnKTtcbiAgfVxuXG4gIGhpdChncmlkSXRlbSkge1xuICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3NoaXAnKTtcbiAgICBncmlkSXRlbS5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgfTtcblxuICBtaXNzKGdyaWRJdGVtKSB7XG4gICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZCgnbWlzcycpO1xuICB9XG5cbiAgc2hpcChncmlkSXRlbSkge1xuICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5hZGQoJ3NoaXAnKTtcbiAgfTtcblxuICBoaWRlRWxlbWVudChlbGVtZW50KSB7XG4gICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICB9XG5cbiAgdXBkYXRlUGxheWVyTXNnKGNvdW50ZXIsIGVycm9yPW51bGwpIHtcbiAgICBsZXQgbXNnID0gdGhpcy5wbGF5ZXJNc2c7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICBtc2cudGV4dENvbnRlbnQgPSAnSW52YWxpZCBwbGFjZW1lbnQgbG9jYXRpb24nO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMudXBkYXRlUGxheWVyTXNnKGNvdW50ZXIpO1xuICAgICAgfSwgMTAwMClcbiAgICB9IGVsc2UgaWYgKGNvdW50ZXIgPCA1KSB7XG4gICAgICBtc2cudGV4dENvbnRlbnQgPSBgQ2xpY2sgZ3JpZCB0byBwbGFjZSAke3RoaXMuc2hpcE5hbWVzW2NvdW50ZXJdfSAoc2l6ZTogJHt0aGlzLnNoaXBTaXplc1tjb3VudGVyXX0pYFxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuI2NsZWFyTXNnKG1zZyk7XG4gICAgfVxuICB9XG5cbiAgZGlzcGxheVN1bmtNZXNzYWdlKHNoaXAsIHBsYXllcikge1xuICAgIGNvbnN0IHN1bmtNc2cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgc3Vua01zZy50ZXh0Q29udGVudCA9IGAke3BsYXllcn0gJHtzaGlwLnNoaXBUeXBlfSBoYXMgYmVlbiBzdW5rLmBcbiAgICAvLyBjb25zdCBzdW5rTXNnID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYCR7cGxheWVyfSAke3NoaXAuc2hpcFR5cGV9IGhhcyBiZWVuIHN1bmsuYClcbiAgICB0aGlzLmdsb2JhbE1zZy5hcHBlbmRDaGlsZChzdW5rTXNnKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuI2NsZWFyTXNnKHN1bmtNc2cpO1xuICAgIH0sIDMwMDApO1xuICB9XG5cbiAgZGlzcGxheVdpbm5lcih3aW5uZXIpIHtcbiAgICBjb25zdCB3aW5uZXJNc2cgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShgV2lubmVyOiAke3dpbm5lcn0hYCk7XG4gICAgdGhpcy5nbG9iYWxNc2cuYXBwZW5kQ2hpbGQod2lubmVyTXNnKTtcbiAgfVxuXG4gICNjbGVhck1zZyhtc2dFbGVtZW50KSB7XG4gICAgbXNnRWxlbWVudC5yZW1vdmUoKTtcbiAgfVxuXG4gICNncmlkUG9wdWxhdGUocGxheWVyKSB7XG4gICAgY29uc3QgZ3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGdyaWQuY2xhc3NMaXN0LmFkZCgnZ3JpZCcsIHBsYXllcik7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDsgaSsrKSB7XG4gICAgICBjb25zdCBncmlkSXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZCgnZ3JpZC1pdGVtJywgcGxheWVyKTtcbiAgICAgIGdyaWRJdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXMgPSB0aGlzLiNjb29yZHNQb3B1bGF0ZShpKTtcbiAgICAgIGdyaWQuYXBwZW5kQ2hpbGQoZ3JpZEl0ZW0pO1xuICAgIH1cbiAgICByZXR1cm4gZ3JpZDtcbiAgfVxuXG4gICNjb29yZHNQb3B1bGF0ZShpKSB7XG4gICAgaWYgKGkgPCAxMCkge1xuICAgICAgcmV0dXJuIFtpLCAwXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGRpZ2l0cyA9IGkudG9TdHJpbmcoKS5zcGxpdCgnJyk7XG4gICAgICByZXR1cm4gW2RpZ2l0c1sxXSwgZGlnaXRzWzBdXTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBTaGlwIGZyb20gJy4vc2hpcHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lYm9hcmQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFsbFNoaXBzID0gW107XG4gICAgdGhpcy5taXNzZWRTaG90cyA9IFtdO1xuICAgIHRoaXMuaGl0U2hvdHMgPSBbXTtcbiAgICB0aGlzLmFsbFNob3RzID0gW107XG4gIH07XG5cbiAgcGxhY2VTaGlwKHNpemUsIGZpcnN0Q29vcmQsIG9yaWVudGF0aW9uPSdob3Jpem9udGFsJykge1xuICAgIG9yaWVudGF0aW9uID0gb3JpZW50YXRpb24udG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IHRoaXMuI2J1aWxkQ29vcmRpbmF0ZXMoc2l6ZSwgZmlyc3RDb29yZCwgb3JpZW50YXRpb24pO1xuICAgIGlmICh0aGlzLiN2YWxpZGF0ZUNvb3JkaW5hdGVzKGNvb3JkaW5hdGVzKSkge1xuICAgICAgY29uc3QgbmV3U2hpcCA9IG5ldyBTaGlwKHNpemUpO1xuICAgICAgY29uc3Qgc2hpcEVudHJ5ID0gW25ld1NoaXAsIGNvb3JkaW5hdGVzXTtcbiAgICAgIHRoaXMuYWxsU2hpcHMucHVzaChzaGlwRW50cnkpO1xuICAgICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLy8gcmVjZWl2ZUF0dGFjayBmdW5jdGlvbiB0YWtlcyBjb29yZGluYXRlcywgZGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCB0aGUgYXR0YWNrIGhpdCBhIHNoaXBcbiAgLy8gdGhlbiBzZW5kcyB0aGUg4oCYaGl04oCZIGZ1bmN0aW9uIHRvIHRoZSBjb3JyZWN0IHNoaXAsIG9yIHJlY29yZHMgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBtaXNzZWQgc2hvdC5cbiAgcmVjZWl2ZUF0dGFjayhjb29yZGluYXRlKSB7XG4gICAgdGhpcy5hbGxTaG90cy5wdXNoKGNvb3JkaW5hdGUpO1xuICAgIGNvbnN0IHNoaXAgPSB0aGlzLiNmaW5kU2hpcChjb29yZGluYXRlKTtcbiAgICBpZiAoc2hpcCkge1xuICAgICAgc2hpcC5oaXQoKTtcbiAgICAgIHRoaXMuaGl0U2hvdHMucHVzaChjb29yZGluYXRlKTtcbiAgICAgIHJldHVybiBzaGlwO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1pc3NlZFNob3RzLnB1c2goY29vcmRpbmF0ZSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZ2FtZU92ZXIoKSB7XG4gICAgbGV0IGFsbFN1bmsgPSB0cnVlO1xuICAgIC8vIElmIHNoaXBzIGhhdmVuJ3QgeWV0IGJlZW4gcGxhY2VkLCByZXR1cm4gZmFsc2UuXG4gICAgaWYgKHRoaXMuYWxsU2hpcHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuYWxsU2hpcHMuZm9yRWFjaChzaGlwID0+IHtcbiAgICAgIGlmICghc2hpcFswXS5pc1N1bmsoKSkge1xuICAgICAgICBhbGxTdW5rID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gYWxsU3VuaztcbiAgfVxuXG4gICNidWlsZENvb3JkaW5hdGVzKHNpemUsIGZpcnN0Q29vcmQsIG9yaWVudGF0aW9uKSB7XG4gICAgbGV0IGNvb3JkaW5hdGVzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgIGNvb3JkaW5hdGVzLnB1c2goW2ZpcnN0Q29vcmRbMF0gKyBpLCBmaXJzdENvb3JkWzFdXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb29yZGluYXRlcy5wdXNoKFtmaXJzdENvb3JkWzBdLCBmaXJzdENvb3JkWzFdICsgaV0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gIH1cblxuICAjdmFsaWRhdGVDb29yZGluYXRlcyhjb29yZGluYXRlcykge1xuICAgIGxldCB2YWxpZENvb3JkcyA9IHRydWU7XG4gICAgY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmQpID0+IHtcbiAgICAgIC8vIElmIGEgc2hpcCBhbHJlYWR5IGV4aXN0cyBhdCBsb2NhdGlvbiwgcmVqZWN0IGl0LlxuICAgICAgaWYgKHRoaXMuI2ZpbmRTaGlwKGNvb3JkKSB8fCBjb29yZFswXSA+IDkgfHwgY29vcmRbMV0gPiA5KSB7XG4gICAgICAgIHZhbGlkQ29vcmRzID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gdmFsaWRDb29yZHM7XG4gIH1cblxuICAjZmluZFNoaXAoY29vcmRpbmF0ZSkge1xuICAgIGxldCBmb3VuZFNoaXAgPSBmYWxzZTtcbiAgICB0aGlzLmFsbFNoaXBzLmZvckVhY2goc2hpcCA9PiB7XG4gICAgICBpZiAoc2hpcFsxXS5zb21lKCh4KSA9PiB4WzBdID09PSBjb29yZGluYXRlWzBdICYmIHhbMV0gPT09IGNvb3JkaW5hdGVbMV0pKSB7XG4gICAgICAgIGZvdW5kU2hpcCA9IHNoaXBbMF07XG4gICAgfX0pXG4gICAgcmV0dXJuIGZvdW5kU2hpcDtcbiAgfVxufVxuIiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi9wbGF5ZXJzXCI7XG5pbXBvcnQgRE9NYnVpbGRlciBmcm9tIFwiLi9kb21CdWlsZGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVsb29wIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5odW1hbiA9IG5ldyBQbGF5ZXIodHJ1ZSk7XG4gICAgdGhpcy5haSA9IG5ldyBQbGF5ZXIoZmFsc2UpO1xuICAgIHRoaXMucGxheWVycyA9IFt0aGlzLmh1bWFuLCB0aGlzLmFpXTtcbiAgICB0aGlzLmN1cnJlbnRQbGF5ZXIgPSB0aGlzLmFpO1xuICAgIHRoaXMucm91bmQgPSBudWxsO1xuICAgIHRoaXMucGFnZSA9IG5ldyBET01idWlsZGVyKCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLiNhaVNoaXBzKCk7XG4gICAgdGhpcy5haUdyaWRMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLmh1bWFuR3JpZExpc3RlbmVycygpO1xuXG4gICAgbGV0IGN1cnJlbnRSb3VuZCA9IHRoaXMucm91bmQ7XG5cbiAgICBjb25zdCBwbGF5Um91bmQgPSAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuI2dhbWVPdmVyKCkpIHtcbiAgICAgICAgdGhpcy4jYWlBdHRhY2soKTtcbiAgICAgICAgaWYgKGN1cnJlbnRSb3VuZCAhPT0gdGhpcy5yb3VuZCkge1xuICAgICAgICAgIHRoaXMuY3VycmVudFBsYXllciA9IHRoaXMuY3VycmVudFBsYXllciA9PT0gdGhpcy5odW1hbiA/IHRoaXMuYWkgOiB0aGlzLmh1bWFuO1xuICAgICAgICAgIGN1cnJlbnRSb3VuZCA9IHRoaXMucm91bmQ7XG4gICAgICAgIH1cbiAgICAgICAgc2V0VGltZW91dChwbGF5Um91bmQsIDApOyAvLyBTY2hlZHVsZSB0aGUgbmV4dCByb3VuZCBhZnRlciBhIHZlcnkgc2hvcnQgZGVsYXlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuI2VuZEdhbWUoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGxheVJvdW5kKCk7XG4gIH1cblxuICAjZW5kR2FtZSgpIHtcbiAgICBjb25zdCB3aW5uZXIgPSB0aGlzLiNnYW1lT3ZlcigpID09PSB0aGlzLmh1bWFuID8gJ1lvdScgOiAnQ29tcHV0ZXInO1xuICAgIGNvbnN0IGFpR3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ncmlkLWl0ZW0uYWlcIik7XG4gICAgY29uc3QgaHVtYW5HcmlkSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdyaWQtaXRlbS5odW1hblwiKTtcbiAgICAvLyBkaXNwbGF5IHRoZSB3aW5uZXJcbiAgICB0aGlzLnBhZ2UuZGlzcGxheVdpbm5lcih3aW5uZXIpO1xuICAgIC8vIHJldmVhbCBhbGwgYm9hcmRzXG4gICAgYWlHcmlkSXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGxldCBjb29yZHMgPSBpdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXNcbiAgICAgIC5zcGxpdChcIixcIilcbiAgICAgIC5tYXAoKHgpID0+IHBhcnNlSW50KHgsIDEwKSk7XG4gICAgICB0aGlzLiNhaUJvYXJkQXR0YWNrKGNvb3JkcywgaXRlbSk7XG4gICAgfSlcbiAgICBodW1hbkdyaWRJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKCFpdGVtLmNsYXNzTGlzdC5jb250YWlucyhcInNoaXBcIikgJiYgIWl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0XCIpKSB7XG4gICAgICAgIHRoaXMucGFnZS5taXNzKGl0ZW0pO1xuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBodW1hbkdyaWRMaXN0ZW5lcnMoKSB7XG4gICAgdGhpcy4jb3JpZW50YXRpb25CdG5MaXN0ZW5lcigpO1xuICAgIGNvbnN0IG9yaWVudGF0aW9uQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmllbnRhdGlvbi1idG5cIik7XG4gICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ncmlkLWl0ZW0uaHVtYW5cIik7XG4gICAgbGV0IHBsYWNlbWVudENvdW50ZXIgPSAwO1xuICAgIGxldCBzaGlwU2l6ZSA9IFs1LCA0LCAzLCAzLCAyXTtcblxuICAgIGdyaWRJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGlmIChwbGFjZW1lbnRDb3VudGVyID49IHNoaXBTaXplLmxlbmd0aCAtIDEgJiYgIXRoaXMucm91bmQpIHtcbiAgICAgICAgICB0aGlzLnBhZ2UuaGlkZUVsZW1lbnQob3JpZW50YXRpb25CdG4pO1xuICAgICAgICAgIHRoaXMucm91bmQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9yaWVudGF0aW9uID0gb3JpZW50YXRpb25CdG4udGV4dENvbnRlbnQ7XG4gICAgICAgIGxldCBjb29yZHMgPSBpdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXNcbiAgICAgICAgICAuc3BsaXQoXCIsXCIpXG4gICAgICAgICAgLm1hcCgoeCkgPT4gcGFyc2VJbnQoeCwgMTApKTtcbiAgICAgICAgbGV0IGNvb3JkaW5hdGVzID0gdGhpcy5odW1hbi5ib2FyZC5wbGFjZVNoaXAoXG4gICAgICAgICAgc2hpcFNpemVbcGxhY2VtZW50Q291bnRlcl0sXG4gICAgICAgICAgY29vcmRzLFxuICAgICAgICAgIG9yaWVudGF0aW9uXG4gICAgICAgICk7XG4gICAgICAgIC8vIFNob3cgc2hpcCBvbiBzY3JlZW4sIGlmIHZhbGlkIHBsYWNlbWVudC5cbiAgICAgICAgaWYgKGNvb3JkaW5hdGVzKSB7XG4gICAgICAgICAgY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmQpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGFnZS5zaGlwKHRoaXMuI2ZpbmRHcmlkSXRlbShjb29yZCwgXCJodW1hblwiKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcGxhY2VtZW50Q291bnRlcisrO1xuICAgICAgICAgIHRoaXMucGFnZS51cGRhdGVQbGF5ZXJNc2cocGxhY2VtZW50Q291bnRlcik7XG4gICAgICAgIC8vIERpc3BsYXkgZXJyb3IgbWVzc2FnZSBpZiBwbGFjZW1lbnQgZ29lcyBvZmYgYm9hcmQgb3IgY29uZmxpY3RzIHdpdGggZXhpc3Rpbmcgc2hpcC5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucGFnZS51cGRhdGVQbGF5ZXJNc2cocGxhY2VtZW50Q291bnRlciwgXCJlcnJvclwiKTtcbiAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgI29yaWVudGF0aW9uQnRuTGlzdGVuZXIoKSB7XG4gICAgY29uc3Qgb3JpZW50YXRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yaWVudGF0aW9uLWJ0blwiKTtcbiAgICBvcmllbnRhdGlvbi5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXG4gICAgb3JpZW50YXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGxldCB0ZXh0ID0gb3JpZW50YXRpb24udGV4dENvbnRlbnQ7XG4gICAgICBvcmllbnRhdGlvbi50ZXh0Q29udGVudCA9XG4gICAgICAgIHRleHQgPT09IFwiaG9yaXpvbnRhbFwiID8gXCJ2ZXJ0aWNhbFwiIDogXCJob3Jpem9udGFsXCI7XG4gICAgfSk7XG4gIH1cblxuICBhaUdyaWRMaXN0ZW5lcnMoKSB7XG4gICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ncmlkLWl0ZW0uYWlcIik7XG4gICAgZ3JpZEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBsYXllciA9PT0gdGhpcy5odW1hbiAmJiB0aGlzLiN2YWxpZEl0ZW0oaXRlbSkpIHtcbiAgICAgICAgICBsZXQgY29vcmRzID0gaXRlbS5kYXRhc2V0LmNvb3JkaW5hdGVzXG4gICAgICAgICAgICAuc3BsaXQoXCIsXCIpXG4gICAgICAgICAgICAubWFwKCh4KSA9PiBwYXJzZUludCh4LCAxMCkpO1xuICAgICAgICAgIHRoaXMuI2FpQm9hcmRBdHRhY2soY29vcmRzLCBpdGVtKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBQcmV2ZW50IGFjY2lkZW50YWxseSBhdHRhY2tpbmcgcHJldmlvdXNseSBjbGlja2VkIGdyaWQgaXRlbS5cbiAgI3ZhbGlkSXRlbShncmlkSXRlbSkge1xuICAgIGlmIChncmlkSXRlbS5jbGFzc0xpc3QuY29udGFpbnMoXCJoaXRcIikgfHwgZ3JpZEl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKFwibWlzc1wiKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAjYWlCb2FyZEF0dGFjayhjb29yZHMsIGdyaWRJdGVtKSB7XG4gICAgbGV0IGF0dGFja2VkU2hpcCA9IHRoaXMuYWkuYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZHMpXG4gICAgaWYgKGF0dGFja2VkU2hpcCkge1xuICAgICAgLy8gaWYgYSBzaGlwIGlzIGhpdCwgbWFyayBzcXVhcmUgYXMgcmVkLlxuICAgICAgdGhpcy5wYWdlLmhpdChncmlkSXRlbSk7XG4gICAgICB0aGlzLnJvdW5kKys7XG4gICAgICAvLyBpZiBzaGlwIGlzIHN1bmssIGRpc3BsYXkgZ2xvYmFsIG1lc3NhZ2UuXG4gICAgICBpZiAoYXR0YWNrZWRTaGlwLmlzU3VuaygpICYmICF0aGlzLiNnYW1lT3ZlcigpKSB7XG4gICAgICAgIHRoaXMucGFnZS5kaXNwbGF5U3Vua01lc3NhZ2UoYXR0YWNrZWRTaGlwLCBcIkNvbXB1dGVyJ3NcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGlmIGEgc2hpcCBpcyBub3QgaGl0LCBtYXJrIHNxdWFyZSBhcyBibHVlLlxuICAgICAgdGhpcy5wYWdlLm1pc3MoZ3JpZEl0ZW0pO1xuICAgICAgdGhpcy5yb3VuZCsrO1xuICAgIH1cbiAgfVxuXG4gICNhaVNoaXBzKCkge1xuICAgIGNvbnN0IHNoaXBTaXplcyA9IFs1LCA0LCAzLCAzLCAyXTtcbiAgICBzaGlwU2l6ZXMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgbGV0IGNvb3JkaW5hdGVzID0gdGhpcy4jYWlTaGlwUGxhY2VtZW50KHNoaXApO1xuICAgICAgLy8gUmVydW4gcGxhY2VtZW50IHVudGlsIHZhbGlkIHBsYWNlbWVudCBmb3VuZC5cbiAgICAgIHdoaWxlICghY29vcmRpbmF0ZXMpIHtcbiAgICAgICAgY29vcmRpbmF0ZXMgPSB0aGlzLiNhaVNoaXBQbGFjZW1lbnQoc2hpcCk7XG4gICAgICB9XG4gICAgICAvLyBzaG93IGFpIHNoaXBzIHdoaWxlIHRlc3RpbmcuXG4gICAgICAvLyBjb29yZGluYXRlcy5mb3JFYWNoKChjb29yZCkgPT4ge1xuICAgICAgLy8gICB0aGlzLnBhZ2Uuc2hpcCh0aGlzLiNmaW5kR3JpZEl0ZW0oY29vcmQsIFwiYWlcIikpO1xuICAgICAgLy8gfSk7XG4gICAgfSk7XG4gIH1cblxuICAjYWlTaGlwUGxhY2VtZW50KHNoaXApIHtcbiAgICBsZXQgb3JpZW50YXRpb24gPSB0aGlzLiNyYW5kb21OdW0oMikgPT09IDAgPyBcImhvcml6b250YWxcIiA6IFwidmVydGljYWxcIjtcbiAgICBsZXQgY29vcmQgPVxuICAgICAgb3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiXG4gICAgICAgID8gW3RoaXMuI3JhbmRvbU51bSgxMCAtIHNoaXApLCB0aGlzLiNyYW5kb21OdW0oMTApXVxuICAgICAgICA6IFt0aGlzLiNyYW5kb21OdW0oMTApLCB0aGlzLiNyYW5kb21OdW0oMTAgLSBzaGlwKV07XG4gICAgbGV0IGNvb3JkaW5hdGVzID0gdGhpcy5haS5ib2FyZC5wbGFjZVNoaXAoc2hpcCwgY29vcmQsIG9yaWVudGF0aW9uKTtcbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gIH1cblxuICAjYWlBdHRhY2soKSB7XG4gICAgaWYgKHRoaXMuY3VycmVudFBsYXllciA9PT0gdGhpcy5haSAmJiB0aGlzLnJvdW5kKSB7XG4gICAgICBsZXQgY29vcmQgPSB0aGlzLiNhaUNvb3JkU2VsZWN0b3IoKTtcbiAgICAgIGxldCBncmlkSXRlbSA9IHRoaXMuI2ZpbmRHcmlkSXRlbShjb29yZCwgJ2h1bWFuJyk7XG4gICAgICBsZXQgYXR0YWNrZWRTaGlwID0gdGhpcy5odW1hbi5ib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkKVxuICAgICAgaWYgKGF0dGFja2VkU2hpcCkge1xuICAgICAgICAvLyBpZiBhIHNoaXAgaXMgaGl0LCBtYXJrIHNxdWFyZSBhcyByZWQuXG4gICAgICAgIHRoaXMucGFnZS5oaXQoZ3JpZEl0ZW0pO1xuICAgICAgICB0aGlzLnJvdW5kKys7XG4gICAgICAgIC8vIGlmIHNoaXAgaXMgc3VuaywgZGlzcGxheSBnbG9iYWwgbWVzc2FnZS5cbiAgICAgICAgaWYgKGF0dGFja2VkU2hpcC5pc1N1bmsoKSkge1xuICAgICAgICAgIHRoaXMucGFnZS5kaXNwbGF5U3Vua01lc3NhZ2UoYXR0YWNrZWRTaGlwLCBcIlBsYXllcidzXCIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpZiBhIHNoaXAgaXMgbm90IGhpdCwgbWFyayBzcXVhcmUgYXMgYmx1ZS5cbiAgICAgICAgdGhpcy5wYWdlLm1pc3MoZ3JpZEl0ZW0pO1xuICAgICAgICB0aGlzLnJvdW5kKys7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgI2FpQ29vcmRTZWxlY3RvcihwcmV2aW91c0Nvb3JkPW51bGwsIGFjY3VtdWxhdG9yPTApIHtcbiAgICBjb25zdCBodW1hbiA9IHRoaXMuaHVtYW4uYm9hcmQ7XG4gICAgbGV0IGNvb3JkID0gW107XG4gICAgLy8gaWYgYSBzaGlwIGhhcyBiZWVuIGhpdCwgdXNlIG1vc3QgcmVjZW50IGhpdCB0byBkZXRlcm1pbmUgbmV4dCBzaG90LlxuICAgIGlmIChodW1hbi5oaXRTaG90cy5sZW5ndGggPiAwICYmIGFjY3VtdWxhdG9yIDwgNCkge1xuICAgICAgY29uc3QgaGl0Q29vcmQgPSBodW1hbi5oaXRTaG90cy5hdCgtMSk7XG4gICAgICBjb25zdCBsYXN0U2hvdCA9IHByZXZpb3VzQ29vcmQgPT09IG51bGwgPyBodW1hbi5hbGxTaG90cy5hdCgtMSkgOiBwcmV2aW91c0Nvb3JkO1xuICAgICAgaWYgKGxhc3RTaG90WzBdID09PSBoaXRDb29yZFswXSAmJiBsYXN0U2hvdFsxXSA9PT0gaGl0Q29vcmRbMV0pIHtcbiAgICAgICAgY29vcmQgPSBbaGl0Q29vcmRbMF0gKyAxLCBoaXRDb29yZFsxXV07XG4gICAgICB9IGVsc2UgaWYgKGxhc3RTaG90WzBdID09PSBoaXRDb29yZFswXSArIDEgJiYgbGFzdFNob3RbMV0gPT09IGhpdENvb3JkWzFdKSB7XG4gICAgICAgIGNvb3JkID0gW2hpdENvb3JkWzBdIC0gMSwgaGl0Q29vcmRbMV1dO1xuICAgICAgfSBlbHNlIGlmIChsYXN0U2hvdFswXSA9PT0gaGl0Q29vcmRbMF0gLSAxICYmIGxhc3RTaG90WzFdID09PSBoaXRDb29yZFsxXSkge1xuICAgICAgICBjb29yZCA9IFtoaXRDb29yZFswXSwgaGl0Q29vcmRbMV0gKyAxXTtcbiAgICAgIH0gZWxzZSBpZiAobGFzdFNob3RbMF0gPT09IGhpdENvb3JkWzBdICYmIGxhc3RTaG90WzFdID09PSBoaXRDb29yZFsxXSArIDEpIHtcbiAgICAgICAgY29vcmQgPSBbaGl0Q29vcmRbMF0sIGhpdENvb3JkWzFdIC0gMV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb29yZCA9IFt0aGlzLiNyYW5kb21OdW0oMTApLCB0aGlzLiNyYW5kb21OdW0oMTApXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaWYgbm8gc2hpcCBoYXMgYmVlbiBoaXQsIHVzZSByYW5kb20gY29vcmQuXG4gICAgICBjb29yZCA9IFt0aGlzLiNyYW5kb21OdW0oMTApLCB0aGlzLiNyYW5kb21OdW0oMTApXTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiBjb29yZCBoYXMgYWxyZWFkeSBiZWVuIHVzZWQsIGlmIHNvIHJlcnVuIGZ1bmN0aW9uLlxuICAgIGh1bWFuLmFsbFNob3RzLmZvckVhY2goc2hvdCA9PiB7XG4gICAgICBpZiAoc2hvdFswXSA9PT0gY29vcmRbMF0gJiYgc2hvdFsxXSA9PT0gY29vcmRbMV0pIHtcbiAgICAgICAgY29vcmQgPSB0aGlzLiNhaUNvb3JkU2VsZWN0b3IoY29vcmQsIGFjY3VtdWxhdG9yICsgMSk7XG4gICAgICB9XG4gICAgfSlcbiAgICAvLyBDaGVjayBpZiBjb29yZCBpcyBvbiBib2FyZCwgaWYgbm90IHJlcnVuLlxuICAgIGlmIChjb29yZFswXSA+IDkgfHwgY29vcmRbMF0gPCAwIHx8IGNvb3JkWzFdID4gOSB8fCBjb29yZFsxXSA8IDApIHtcbiAgICAgIGNvb3JkID0gdGhpcy4jYWlDb29yZFNlbGVjdG9yKGNvb3JkLCBhY2N1bXVsYXRvciArIDEpO1xuICAgIH1cbiAgICByZXR1cm4gY29vcmQ7XG4gIH1cblxuICAjcmFuZG9tTnVtKG1heCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xuICB9XG5cbiAgI2ZpbmRHcmlkSXRlbShjb29yZCwgcGxheWVyKSB7XG4gICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLmdyaWQtaXRlbS4ke3BsYXllcn1gKTtcbiAgICBsZXQgZm91bmRJdGVtID0gZmFsc2U7XG4gICAgZ3JpZEl0ZW1zLmZvckVhY2goKGdyaWRJdGVtKSA9PiB7XG4gICAgICBpZiAoZ3JpZEl0ZW0uZGF0YXNldC5jb29yZGluYXRlcyA9PT0gY29vcmQudG9TdHJpbmcoKSkge1xuICAgICAgICBmb3VuZEl0ZW0gPSBncmlkSXRlbTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZm91bmRJdGVtO1xuICB9XG5cbiAgI2dhbWVPdmVyKCkge1xuICAgIC8vIEFJIHdpbnMgaWYgaHVtYW4gYm9hcmQgaXMgZ2FtZSBvdmVyLlxuICAgIGlmICh0aGlzLmh1bWFuLmJvYXJkLmdhbWVPdmVyKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmFpO1xuICAgIC8vIEh1bWFuIHdpbnMgaWYgYWkgYm9hcmQgaXMgZ2FtZSBvdmVyLlxuICAgIH0gZWxzZSBpZiAodGhpcy5haS5ib2FyZC5nYW1lT3ZlcigpKSB7XG4gICAgICByZXR1cm4gdGhpcy5odW1hbjtcbiAgICAvLyBFbHNlIGdhbWUgY29udGludWVzLlxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgR2FtZWJvYXJkIGZyb20gXCIuL2dhbWVib2FyZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihodW1hbj10cnVlKSB7XG4gICAgdGhpcy5ib2FyZCA9IG5ldyBHYW1lYm9hcmQ7XG4gICAgdGhpcy5pc0h1bWFuID0gaHVtYW47XG4gICAgdGhpcy5wcmV2aW91c1BsYXlzID0gW107XG4gIH07XG5cbiAgYXR0YWNrKHBsYXllciwgY29vcmRpbmF0ZSkge1xuICAgIGlmICghdGhpcy5pc0h1bWFuKSB7XG4gICAgICBjb29yZGluYXRlID0gdGhpcy4jYWlBdHRhY2socGxheWVyLmJvYXJkKTtcbiAgICB9XG5cbiAgICB0aGlzLnByZXZpb3VzUGxheXMucHVzaChjb29yZGluYXRlKTtcbiAgICBwbGF5ZXIuYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZGluYXRlKTtcbiAgfVxuXG4gICNhaUF0dGFjayhib2FyZCkge1xuICAgIGxldCBjb29yZGluYXRlID0gdGhpcy4jcmFuZG9tQ29vcmQoKTtcbiAgICBpZiAodGhpcy5wcmV2aW91c1BsYXlzLmluY2x1ZGVzKGNvb3JkaW5hdGUpKSB7XG4gICAgICB0aGlzLiNhaUF0dGFjayhib2FyZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjb29yZGluYXRlO1xuICAgIH1cbiAgfVxuXG4gIC8vIEdlbmVyYXRlIHJhbmRvbSBjb29yZGluYXRlcyBiZXR3ZWVuIDAgLSA5LlxuICAjcmFuZG9tQ29vcmQoKSB7XG4gICAgcmV0dXJuIFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCksIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKV07XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoaXAge1xuICBjb25zdHJ1Y3RvcihzaXplKSB7XG4gICAgY29uc3Qgc2hpcFR5cGVzID0gezUgOiAnQ2FycmllcicsIDQgOiAnQmF0dGxlc2hpcCcsIDMgOiAnRGVzdHJveWVyJywgMyA6ICdTdWJtYXJpbmUnLCAyIDogJ1BhdHJvbCBCb2F0J31cbiAgICB0aGlzLmxlbmd0aCA9IHNpemU7XG4gICAgdGhpcy5zaGlwVHlwZSA9IHNoaXBUeXBlc1tzaXplXTtcbiAgICB0aGlzLmhpdHMgPSAwO1xuICAgIHRoaXMuc3VuayA9IGZhbHNlO1xuICB9XG5cbiAgaGl0KCkge1xuICAgIHRoaXMuaGl0cysrO1xuICAgIHRoaXMuaXNTdW5rKCk7XG4gIH1cblxuICBpc1N1bmsoKSB7XG4gICAgaWYgKHRoaXMuaGl0cyA9PT0gdGhpcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc3VuayA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN1bms7XG4gIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEdhbWVsb29wIGZyb20gXCIuL2dhbWVsb29wXCI7XG5cbmNvbnN0IGdhbWUgPSBuZXcgR2FtZWxvb3AoKTtcbmdhbWUuc3RhcnQoKTtcbiJdLCJuYW1lcyI6WyJET01idWlsZGVyIiwiY29uc3RydWN0b3IiLCJzaGlwcyIsInNoaXBOYW1lcyIsInNoaXBTaXplcyIsImdhbWVDb250YWluZXIiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwicGxheWVyQ29udGFpbmVyIiwiY3JlYXRlRWxlbWVudCIsImFpQ29udGFpbmVyIiwiZ2xvYmFsTXNnIiwiaWQiLCJjbGFzc0xpc3QiLCJhZGQiLCJwbGF5ZXJUaXRsZSIsInRleHRDb250ZW50IiwiYWlUaXRsZSIsInBsYXllckdyaWQiLCJncmlkUG9wdWxhdGUiLCJhaUdyaWQiLCJwbGF5ZXJNc2ciLCJ1cGRhdGVQbGF5ZXJNc2ciLCJvcmllbnRhdGlvbkJ0biIsImFwcGVuZCIsImhpdCIsImdyaWRJdGVtIiwicmVtb3ZlIiwibWlzcyIsInNoaXAiLCJoaWRlRWxlbWVudCIsImVsZW1lbnQiLCJzdHlsZSIsImRpc3BsYXkiLCJjb3VudGVyIiwiZXJyb3IiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJtc2ciLCJzZXRUaW1lb3V0IiwiY2xlYXJNc2ciLCJkaXNwbGF5U3Vua01lc3NhZ2UiLCJwbGF5ZXIiLCJzdW5rTXNnIiwic2hpcFR5cGUiLCJhcHBlbmRDaGlsZCIsImRpc3BsYXlXaW5uZXIiLCJ3aW5uZXIiLCJ3aW5uZXJNc2ciLCJjcmVhdGVUZXh0Tm9kZSIsIiNjbGVhck1zZyIsIm1zZ0VsZW1lbnQiLCIjZ3JpZFBvcHVsYXRlIiwiZ3JpZCIsImkiLCJkYXRhc2V0IiwiY29vcmRpbmF0ZXMiLCJjb29yZHNQb3B1bGF0ZSIsIiNjb29yZHNQb3B1bGF0ZSIsImRpZ2l0cyIsInRvU3RyaW5nIiwic3BsaXQiLCJTaGlwIiwiR2FtZWJvYXJkIiwiYWxsU2hpcHMiLCJtaXNzZWRTaG90cyIsImhpdFNob3RzIiwiYWxsU2hvdHMiLCJwbGFjZVNoaXAiLCJzaXplIiwiZmlyc3RDb29yZCIsIm9yaWVudGF0aW9uIiwidG9Mb3dlckNhc2UiLCJidWlsZENvb3JkaW5hdGVzIiwidmFsaWRhdGVDb29yZGluYXRlcyIsIm5ld1NoaXAiLCJzaGlwRW50cnkiLCJwdXNoIiwicmVjZWl2ZUF0dGFjayIsImNvb3JkaW5hdGUiLCJmaW5kU2hpcCIsImdhbWVPdmVyIiwiYWxsU3VuayIsImZvckVhY2giLCJpc1N1bmsiLCIjYnVpbGRDb29yZGluYXRlcyIsIiN2YWxpZGF0ZUNvb3JkaW5hdGVzIiwidmFsaWRDb29yZHMiLCJjb29yZCIsIiNmaW5kU2hpcCIsImZvdW5kU2hpcCIsInNvbWUiLCJ4IiwiUGxheWVyIiwiR2FtZWxvb3AiLCJodW1hbiIsImFpIiwicGxheWVycyIsImN1cnJlbnRQbGF5ZXIiLCJyb3VuZCIsInBhZ2UiLCJzdGFydCIsImFpU2hpcHMiLCJhaUdyaWRMaXN0ZW5lcnMiLCJodW1hbkdyaWRMaXN0ZW5lcnMiLCJjdXJyZW50Um91bmQiLCJwbGF5Um91bmQiLCJhaUF0dGFjayIsImVuZEdhbWUiLCIjZW5kR2FtZSIsImFpR3JpZEl0ZW1zIiwicXVlcnlTZWxlY3RvckFsbCIsImh1bWFuR3JpZEl0ZW1zIiwiaXRlbSIsImNvb3JkcyIsIm1hcCIsInBhcnNlSW50IiwiYWlCb2FyZEF0dGFjayIsImNvbnRhaW5zIiwib3JpZW50YXRpb25CdG5MaXN0ZW5lciIsImdyaWRJdGVtcyIsInBsYWNlbWVudENvdW50ZXIiLCJzaGlwU2l6ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJib2FyZCIsImZpbmRHcmlkSXRlbSIsIiNvcmllbnRhdGlvbkJ0bkxpc3RlbmVyIiwidGV4dCIsInZhbGlkSXRlbSIsIiN2YWxpZEl0ZW0iLCIjYWlCb2FyZEF0dGFjayIsImF0dGFja2VkU2hpcCIsIiNhaVNoaXBzIiwiYWlTaGlwUGxhY2VtZW50IiwiI2FpU2hpcFBsYWNlbWVudCIsInJhbmRvbU51bSIsIiNhaUF0dGFjayIsImFpQ29vcmRTZWxlY3RvciIsIiNhaUNvb3JkU2VsZWN0b3IiLCJwcmV2aW91c0Nvb3JkIiwiYWNjdW11bGF0b3IiLCJoaXRDb29yZCIsImF0IiwibGFzdFNob3QiLCJzaG90IiwiI3JhbmRvbU51bSIsIm1heCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIiNmaW5kR3JpZEl0ZW0iLCJmb3VuZEl0ZW0iLCIjZ2FtZU92ZXIiLCJpc0h1bWFuIiwicHJldmlvdXNQbGF5cyIsImF0dGFjayIsInJhbmRvbUNvb3JkIiwiaW5jbHVkZXMiLCIjcmFuZG9tQ29vcmQiLCJzaGlwVHlwZXMiLCJoaXRzIiwic3VuayIsImdhbWUiXSwic291cmNlUm9vdCI6IiJ9