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
  displaySunkMessage(ship) {
    const sunkMsg = document.createTextNode(`${ship.shipType} has been sunk.`);
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
    // display the winner
    this.page.displayWinner(winner);
    // reveal all boards
    aiGridItems.forEach(item => {
      let coords = item.dataset.coordinates.split(",").map(x => parseInt(x, 10));
      this.#aiBoardAttack(coords, item);
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
          this.page.displaySunkMessage(attackedShip);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEVBQUc7SUFDUCxJQUFJLElBQUksQ0FBQ3dFLElBQUksS0FBSyxJQUFJLENBQUN0SCxNQUFNLEVBQUU7TUFDN0IsSUFBSSxDQUFDdUgsSUFBSSxHQUFHLElBQUk7SUFDbEI7SUFDQSxPQUFPLElBQUksQ0FBQ0EsSUFBSTtFQUNsQjtBQUNGOzs7Ozs7VUNwQkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05rQztBQUVsQyxNQUFNQyxJQUFJLEdBQUcsSUFBSWhFLGlEQUFRLENBQUMsQ0FBQztBQUMzQmdFLElBQUksQ0FBQ3pELEtBQUssQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RvbUJ1aWxkZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lbG9vcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3BsYXllcnMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgRE9NYnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGNvbnN0IHNoaXBzID0geydDYXJyaWVyJzogNSwgJ0JhdHRsZXNoaXAnOiA0LCAnRGVzdHJveWVyJzogMywgJ1N1Ym1hcmluZSc6IDMsICdQYXRyb2wgQm9hdCc6IDJ9XG4gICAgdGhpcy5zaGlwTmFtZXMgPSBbJ0NhcnJpZXInLCAnQmF0dGxlc2hpcCcsICdEZXN0cm95ZXInLCAnU3VibWFyaW5lJywgJ1BhdHJvbCBCb2F0J107XG4gICAgdGhpcy5zaGlwU2l6ZXMgPSBbNSwgNCwgMywgMywgMl07XG5cbiAgICB0aGlzLmdhbWVDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZS1jb250YWluZXInKTtcbiAgICAvLyBjcmVhdGUgY29udGFpbmVycyBmb3IgZWxlbWVudHM6XG4gICAgICAvLyAyIHBsYXllciBjb250YWluZXJzXG4gICAgdGhpcy5wbGF5ZXJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmFpQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5nbG9iYWxNc2cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmdsb2JhbE1zZy5pZCA9ICdnbG9iYWwtbXNnJztcbiAgICB0aGlzLnBsYXllckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItY29udGFpbmVyJyk7XG4gICAgdGhpcy5haUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItY29udGFpbmVyJyk7XG4gICAgICAvLyBlYWNoIGNvbnRhaW5lciBjb250YWluczpcbiAgICAgICAgLy8gUGxheWVyIHRpdGxlXG4gICAgICAgIGNvbnN0IHBsYXllclRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKVxuICAgICAgICBwbGF5ZXJUaXRsZS50ZXh0Q29udGVudCA9ICdQbGF5ZXInO1xuXG4gICAgICAgIGNvbnN0IGFpVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICAgICAgICBhaVRpdGxlLnRleHRDb250ZW50ID0gJ0NvbXB1dGVyJztcblxuICAgICAgICAvLyBHYW1lIGJvYXJkIGdyaWQgKDEwIHggMTApXG4gICAgICAgIGNvbnN0IHBsYXllckdyaWQgPSB0aGlzLiNncmlkUG9wdWxhdGUoJ2h1bWFuJyk7XG4gICAgICAgIGNvbnN0IGFpR3JpZCA9IHRoaXMuI2dyaWRQb3B1bGF0ZSgnYWknKTtcblxuICAgICAgICB0aGlzLnBsYXllck1zZyA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICAgICAgdGhpcy51cGRhdGVQbGF5ZXJNc2coMCk7XG4gICAgICAgIHRoaXMucGxheWVyTXNnLmlkID0gJ3BsYXllck1zZyc7XG5cbiAgICAgICAgY29uc3Qgb3JpZW50YXRpb25CdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgb3JpZW50YXRpb25CdG4udGV4dENvbnRlbnQgPSAnaG9yaXpvbnRhbCc7XG4gICAgICAgIG9yaWVudGF0aW9uQnRuLmlkID0gJ29yaWVudGF0aW9uQnRuJztcblxuICAgICAgdGhpcy5wbGF5ZXJDb250YWluZXIuYXBwZW5kKHBsYXllclRpdGxlLCBwbGF5ZXJHcmlkLCB0aGlzLnBsYXllck1zZywgb3JpZW50YXRpb25CdG4pO1xuICAgICAgdGhpcy5haUNvbnRhaW5lci5hcHBlbmQoYWlUaXRsZSwgYWlHcmlkKTtcblxuICAgIHRoaXMuZ2FtZUNvbnRhaW5lci5hcHBlbmQodGhpcy5wbGF5ZXJDb250YWluZXIsIHRoaXMuYWlDb250YWluZXIsIHRoaXMuZ2xvYmFsTXNnKTtcbiAgfVxuXG4gIGhpdChncmlkSXRlbSkge1xuICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3NoaXAnKTtcbiAgICBncmlkSXRlbS5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgfTtcblxuICBtaXNzKGdyaWRJdGVtKSB7XG4gICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZCgnbWlzcycpO1xuICB9XG5cbiAgc2hpcChncmlkSXRlbSkge1xuICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5hZGQoJ3NoaXAnKTtcbiAgfTtcblxuICBoaWRlRWxlbWVudChlbGVtZW50KSB7XG4gICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICB9XG5cbiAgdXBkYXRlUGxheWVyTXNnKGNvdW50ZXIsIGVycm9yPW51bGwpIHtcbiAgICBsZXQgbXNnID0gdGhpcy5wbGF5ZXJNc2c7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICBtc2cudGV4dENvbnRlbnQgPSAnSW52YWxpZCBwbGFjZW1lbnQgbG9jYXRpb24nO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMudXBkYXRlUGxheWVyTXNnKGNvdW50ZXIpO1xuICAgICAgfSwgMTAwMClcbiAgICB9IGVsc2UgaWYgKGNvdW50ZXIgPCA1KSB7XG4gICAgICBtc2cudGV4dENvbnRlbnQgPSBgQ2xpY2sgZ3JpZCB0byBwbGFjZSAke3RoaXMuc2hpcE5hbWVzW2NvdW50ZXJdfSAoc2l6ZTogJHt0aGlzLnNoaXBTaXplc1tjb3VudGVyXX0pYFxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuI2NsZWFyTXNnKG1zZyk7XG4gICAgfVxuICB9XG5cbiAgZGlzcGxheVN1bmtNZXNzYWdlKHNoaXApIHtcbiAgICBjb25zdCBzdW5rTXNnID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYCR7c2hpcC5zaGlwVHlwZX0gaGFzIGJlZW4gc3Vuay5gKVxuICAgIHRoaXMuZ2xvYmFsTXNnLmFwcGVuZENoaWxkKHN1bmtNc2cpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy4jY2xlYXJNc2coc3Vua01zZyk7XG4gICAgfSwgMzAwMCk7XG4gIH1cblxuICBkaXNwbGF5V2lubmVyKHdpbm5lcikge1xuICAgIGNvbnN0IHdpbm5lck1zZyA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGBXaW5uZXI6ICR7d2lubmVyfSFgKTtcbiAgICB0aGlzLmdsb2JhbE1zZy5hcHBlbmRDaGlsZCh3aW5uZXJNc2cpO1xuICB9XG5cbiAgI2NsZWFyTXNnKG1zZ0VsZW1lbnQpIHtcbiAgICBtc2dFbGVtZW50LnJlbW92ZSgpO1xuICB9XG5cbiAgI2dyaWRQb3B1bGF0ZShwbGF5ZXIpIHtcbiAgICBjb25zdCBncmlkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZ3JpZC5jbGFzc0xpc3QuYWRkKCdncmlkJywgcGxheWVyKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyBpKyspIHtcbiAgICAgIGNvbnN0IGdyaWRJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBncmlkSXRlbS5jbGFzc0xpc3QuYWRkKCdncmlkLWl0ZW0nLCBwbGF5ZXIpO1xuICAgICAgZ3JpZEl0ZW0uZGF0YXNldC5jb29yZGluYXRlcyA9IHRoaXMuI2Nvb3Jkc1BvcHVsYXRlKGkpO1xuICAgICAgZ3JpZC5hcHBlbmRDaGlsZChncmlkSXRlbSk7XG4gICAgfVxuICAgIHJldHVybiBncmlkO1xuICB9XG5cbiAgI2Nvb3Jkc1BvcHVsYXRlKGkpIHtcbiAgICBpZiAoaSA8IDEwKSB7XG4gICAgICByZXR1cm4gW2ksIDBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgZGlnaXRzID0gaS50b1N0cmluZygpLnNwbGl0KCcnKTtcbiAgICAgIHJldHVybiBbZGlnaXRzWzFdLCBkaWdpdHNbMF1dO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IFNoaXAgZnJvbSAnLi9zaGlwcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVib2FyZCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYWxsU2hpcHMgPSBbXTtcbiAgICB0aGlzLm1pc3NlZFNob3RzID0gW107XG4gICAgdGhpcy5oaXRTaG90cyA9IFtdO1xuICAgIHRoaXMuYWxsU2hvdHMgPSBbXTtcbiAgfTtcblxuICBwbGFjZVNoaXAoc2l6ZSwgZmlyc3RDb29yZCwgb3JpZW50YXRpb249J2hvcml6b250YWwnKSB7XG4gICAgY29uc3QgY29vcmRpbmF0ZXMgPSB0aGlzLiNidWlsZENvb3JkaW5hdGVzKHNpemUsIGZpcnN0Q29vcmQsIG9yaWVudGF0aW9uKTtcbiAgICBpZiAodGhpcy4jdmFsaWRhdGVDb29yZGluYXRlcyhjb29yZGluYXRlcykpIHtcbiAgICAgIGNvbnN0IG5ld1NoaXAgPSBuZXcgU2hpcChzaXplKTtcbiAgICAgIGNvbnN0IHNoaXBFbnRyeSA9IFtuZXdTaGlwLCBjb29yZGluYXRlc107XG4gICAgICB0aGlzLmFsbFNoaXBzLnB1c2goc2hpcEVudHJ5KTtcbiAgICAgIHJldHVybiBjb29yZGluYXRlcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8vIHJlY2VpdmVBdHRhY2sgZnVuY3Rpb24gdGFrZXMgY29vcmRpbmF0ZXMsIGRldGVybWluZXMgd2hldGhlciBvciBub3QgdGhlIGF0dGFjayBoaXQgYSBzaGlwXG4gIC8vIHRoZW4gc2VuZHMgdGhlIOKAmGhpdOKAmSBmdW5jdGlvbiB0byB0aGUgY29ycmVjdCBzaGlwLCBvciByZWNvcmRzIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgbWlzc2VkIHNob3QuXG4gIHJlY2VpdmVBdHRhY2soY29vcmRpbmF0ZSkge1xuICAgIHRoaXMuYWxsU2hvdHMucHVzaChjb29yZGluYXRlKTtcbiAgICBjb25zdCBzaGlwID0gdGhpcy4jZmluZFNoaXAoY29vcmRpbmF0ZSk7XG4gICAgaWYgKHNoaXApIHtcbiAgICAgIHNoaXAuaGl0KCk7XG4gICAgICB0aGlzLmhpdFNob3RzLnB1c2goY29vcmRpbmF0ZSk7XG4gICAgICByZXR1cm4gc2hpcDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5taXNzZWRTaG90cy5wdXNoKGNvb3JkaW5hdGUpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGdhbWVPdmVyKCkge1xuICAgIGxldCBhbGxTdW5rID0gdHJ1ZTtcbiAgICAvLyBJZiBzaGlwcyBoYXZlbid0IHlldCBiZWVuIHBsYWNlZCwgcmV0dXJuIGZhbHNlLlxuICAgIGlmICh0aGlzLmFsbFNoaXBzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLmFsbFNoaXBzLmZvckVhY2goc2hpcCA9PiB7XG4gICAgICBpZiAoIXNoaXBbMF0uaXNTdW5rKCkpIHtcbiAgICAgICAgYWxsU3VuayA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGFsbFN1bms7XG4gIH1cblxuICAjYnVpbGRDb29yZGluYXRlcyhzaXplLCBmaXJzdENvb3JkLCBvcmllbnRhdGlvbikge1xuICAgIGxldCBjb29yZGluYXRlcyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBpZiAob3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICBjb29yZGluYXRlcy5wdXNoKFtmaXJzdENvb3JkWzBdICsgaSwgZmlyc3RDb29yZFsxXV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29vcmRpbmF0ZXMucHVzaChbZmlyc3RDb29yZFswXSwgZmlyc3RDb29yZFsxXSArIGldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xuICB9XG5cbiAgI3ZhbGlkYXRlQ29vcmRpbmF0ZXMoY29vcmRpbmF0ZXMpIHtcbiAgICBsZXQgdmFsaWRDb29yZHMgPSB0cnVlO1xuICAgIGNvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkKSA9PiB7XG4gICAgICAvLyBJZiBhIHNoaXAgYWxyZWFkeSBleGlzdHMgYXQgbG9jYXRpb24sIHJlamVjdCBpdC5cbiAgICAgIGlmICh0aGlzLiNmaW5kU2hpcChjb29yZCkgfHwgY29vcmRbMF0gPiA5IHx8IGNvb3JkWzFdID4gOSkge1xuICAgICAgICB2YWxpZENvb3JkcyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIHZhbGlkQ29vcmRzO1xuICB9XG5cbiAgI2ZpbmRTaGlwKGNvb3JkaW5hdGUpIHtcbiAgICBsZXQgZm91bmRTaGlwID0gZmFsc2U7XG4gICAgdGhpcy5hbGxTaGlwcy5mb3JFYWNoKHNoaXAgPT4ge1xuICAgICAgaWYgKHNoaXBbMV0uc29tZSgoeCkgPT4geFswXSA9PT0gY29vcmRpbmF0ZVswXSAmJiB4WzFdID09PSBjb29yZGluYXRlWzFdKSkge1xuICAgICAgICBmb3VuZFNoaXAgPSBzaGlwWzBdO1xuICAgIH19KVxuICAgIHJldHVybiBmb3VuZFNoaXA7XG4gIH1cbn1cbiIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vcGxheWVyc1wiO1xuaW1wb3J0IERPTWJ1aWxkZXIgZnJvbSBcIi4vZG9tQnVpbGRlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lbG9vcCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaHVtYW4gPSBuZXcgUGxheWVyKHRydWUpO1xuICAgIHRoaXMuYWkgPSBuZXcgUGxheWVyKGZhbHNlKTtcbiAgICB0aGlzLnBsYXllcnMgPSBbdGhpcy5odW1hbiwgdGhpcy5haV07XG4gICAgdGhpcy5jdXJyZW50UGxheWVyID0gdGhpcy5haTtcbiAgICB0aGlzLnJvdW5kID0gbnVsbDtcbiAgICB0aGlzLnBhZ2UgPSBuZXcgRE9NYnVpbGRlcigpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy4jYWlTaGlwcygpO1xuICAgIHRoaXMuYWlHcmlkTGlzdGVuZXJzKCk7XG4gICAgdGhpcy5odW1hbkdyaWRMaXN0ZW5lcnMoKTtcblxuICAgIGxldCBjdXJyZW50Um91bmQgPSB0aGlzLnJvdW5kO1xuXG4gICAgY29uc3QgcGxheVJvdW5kID0gKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLiNnYW1lT3ZlcigpKSB7XG4gICAgICAgIHRoaXMuI2FpQXR0YWNrKCk7XG4gICAgICAgIGlmIChjdXJyZW50Um91bmQgIT09IHRoaXMucm91bmQpIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRQbGF5ZXIgPSB0aGlzLmN1cnJlbnRQbGF5ZXIgPT09IHRoaXMuaHVtYW4gPyB0aGlzLmFpIDogdGhpcy5odW1hbjtcbiAgICAgICAgICBjdXJyZW50Um91bmQgPSB0aGlzLnJvdW5kO1xuICAgICAgICB9XG4gICAgICAgIHNldFRpbWVvdXQocGxheVJvdW5kLCAwKTsgLy8gU2NoZWR1bGUgdGhlIG5leHQgcm91bmQgYWZ0ZXIgYSB2ZXJ5IHNob3J0IGRlbGF5XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLiNlbmRHYW1lKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYXlSb3VuZCgpO1xuICB9XG5cbiAgI2VuZEdhbWUoKSB7XG4gICAgY29uc3Qgd2lubmVyID0gdGhpcy4jZ2FtZU92ZXIoKSA9PT0gdGhpcy5odW1hbiA/ICdZb3UnIDogJ0NvbXB1dGVyJztcbiAgICBjb25zdCBhaUdyaWRJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ3JpZC1pdGVtLmFpXCIpO1xuICAgIC8vIGRpc3BsYXkgdGhlIHdpbm5lclxuICAgIHRoaXMucGFnZS5kaXNwbGF5V2lubmVyKHdpbm5lcik7XG4gICAgLy8gcmV2ZWFsIGFsbCBib2FyZHNcbiAgICBhaUdyaWRJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgbGV0IGNvb3JkcyA9IGl0ZW0uZGF0YXNldC5jb29yZGluYXRlc1xuICAgICAgLnNwbGl0KFwiLFwiKVxuICAgICAgLm1hcCgoeCkgPT4gcGFyc2VJbnQoeCwgMTApKTtcbiAgICAgIHRoaXMuI2FpQm9hcmRBdHRhY2soY29vcmRzLCBpdGVtKTtcbiAgICB9KVxuICB9XG5cbiAgaHVtYW5HcmlkTGlzdGVuZXJzKCkge1xuICAgIHRoaXMuI29yaWVudGF0aW9uQnRuTGlzdGVuZXIoKTtcbiAgICBjb25zdCBvcmllbnRhdGlvbkJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JpZW50YXRpb25CdG5cIik7XG4gICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ncmlkLWl0ZW0uaHVtYW5cIik7XG4gICAgbGV0IHBsYWNlbWVudENvdW50ZXIgPSAwO1xuICAgIGxldCBzaGlwU2l6ZSA9IFs1LCA0LCAzLCAzLCAyXTtcblxuICAgIGdyaWRJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGlmIChwbGFjZW1lbnRDb3VudGVyID49IHNoaXBTaXplLmxlbmd0aCAtIDEgJiYgIXRoaXMucm91bmQpIHtcbiAgICAgICAgICB0aGlzLnBhZ2UuaGlkZUVsZW1lbnQob3JpZW50YXRpb25CdG4pO1xuICAgICAgICAgIHRoaXMucm91bmQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9yaWVudGF0aW9uID0gb3JpZW50YXRpb25CdG4udGV4dENvbnRlbnQ7XG4gICAgICAgIGxldCBjb29yZHMgPSBpdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXNcbiAgICAgICAgICAuc3BsaXQoXCIsXCIpXG4gICAgICAgICAgLm1hcCgoeCkgPT4gcGFyc2VJbnQoeCwgMTApKTtcbiAgICAgICAgbGV0IGNvb3JkaW5hdGVzID0gdGhpcy5odW1hbi5ib2FyZC5wbGFjZVNoaXAoXG4gICAgICAgICAgc2hpcFNpemVbcGxhY2VtZW50Q291bnRlcl0sXG4gICAgICAgICAgY29vcmRzLFxuICAgICAgICAgIG9yaWVudGF0aW9uXG4gICAgICAgICk7XG4gICAgICAgIC8vIFNob3cgc2hpcCBvbiBzY3JlZW4sIGlmIHZhbGlkIHBsYWNlbWVudC5cbiAgICAgICAgaWYgKGNvb3JkaW5hdGVzKSB7XG4gICAgICAgICAgY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmQpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGFnZS5zaGlwKHRoaXMuI2ZpbmRHcmlkSXRlbShjb29yZCwgXCJodW1hblwiKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcGxhY2VtZW50Q291bnRlcisrO1xuICAgICAgICAgIHRoaXMucGFnZS51cGRhdGVQbGF5ZXJNc2cocGxhY2VtZW50Q291bnRlcik7XG4gICAgICAgIC8vIERpc3BsYXkgZXJyb3IgbWVzc2FnZSBpZiBwbGFjZW1lbnQgZ29lcyBvZmYgYm9hcmQgb3IgY29uZmxpY3RzIHdpdGggZXhpc3Rpbmcgc2hpcC5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucGFnZS51cGRhdGVQbGF5ZXJNc2cocGxhY2VtZW50Q291bnRlciwgXCJlcnJvclwiKTtcbiAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgI29yaWVudGF0aW9uQnRuTGlzdGVuZXIoKSB7XG4gICAgY29uc3Qgb3JpZW50YXRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yaWVudGF0aW9uQnRuXCIpO1xuICAgIG9yaWVudGF0aW9uLmRpc3BsYXkgPSBcImJsb2NrXCI7XG5cbiAgICBvcmllbnRhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgbGV0IHRleHQgPSBvcmllbnRhdGlvbi50ZXh0Q29udGVudDtcbiAgICAgIG9yaWVudGF0aW9uLnRleHRDb250ZW50ID1cbiAgICAgICAgdGV4dCA9PT0gXCJob3Jpem9udGFsXCIgPyBcInZlcnRpY2FsXCIgOiBcImhvcml6b250YWxcIjtcbiAgICB9KTtcbiAgfVxuXG4gIGFpR3JpZExpc3RlbmVycygpIHtcbiAgICBjb25zdCBncmlkSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdyaWQtaXRlbS5haVwiKTtcbiAgICBncmlkSXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGxheWVyID09PSB0aGlzLmh1bWFuKSB7XG4gICAgICAgICAgbGV0IGNvb3JkcyA9IGl0ZW0uZGF0YXNldC5jb29yZGluYXRlc1xuICAgICAgICAgICAgLnNwbGl0KFwiLFwiKVxuICAgICAgICAgICAgLm1hcCgoeCkgPT4gcGFyc2VJbnQoeCwgMTApKTtcbiAgICAgICAgICB0aGlzLiNhaUJvYXJkQXR0YWNrKGNvb3JkcywgaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgI2FpQm9hcmRBdHRhY2soY29vcmRzLCBncmlkSXRlbSkge1xuICAgIGxldCBhdHRhY2tlZFNoaXAgPSB0aGlzLmFpLmJvYXJkLnJlY2VpdmVBdHRhY2soY29vcmRzKVxuICAgIGlmIChhdHRhY2tlZFNoaXApIHtcbiAgICAgIC8vIGlmIGEgc2hpcCBpcyBoaXQsIG1hcmsgc3F1YXJlIGFzIHJlZC5cbiAgICAgIHRoaXMucGFnZS5oaXQoZ3JpZEl0ZW0pO1xuICAgICAgdGhpcy5yb3VuZCsrO1xuICAgICAgLy8gaWYgc2hpcCBpcyBzdW5rLCBkaXNwbGF5IGdsb2JhbCBtZXNzYWdlLlxuICAgICAgaWYgKGF0dGFja2VkU2hpcC5pc1N1bmsoKSAmJiAhdGhpcy4jZ2FtZU92ZXIoKSkge1xuICAgICAgICB0aGlzLnBhZ2UuZGlzcGxheVN1bmtNZXNzYWdlKGF0dGFja2VkU2hpcCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGlmIGEgc2hpcCBpcyBub3QgaGl0LCBtYXJrIHNxdWFyZSBhcyBibHVlLlxuICAgICAgdGhpcy5wYWdlLm1pc3MoZ3JpZEl0ZW0pO1xuICAgICAgdGhpcy5yb3VuZCsrO1xuICAgIH1cbiAgfVxuXG4gICNhaVNoaXBzKCkge1xuICAgIGNvbnN0IHNoaXBTaXplcyA9IFs1LCA0LCAzLCAzLCAyXTtcbiAgICBzaGlwU2l6ZXMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgbGV0IGNvb3JkaW5hdGVzID0gdGhpcy4jYWlTaGlwUGxhY2VtZW50KHNoaXApO1xuXG4gICAgICB3aGlsZSAoIWNvb3JkaW5hdGVzKSB7XG4gICAgICAgIGNvb3JkaW5hdGVzID0gdGhpcy4jYWlTaGlwUGxhY2VtZW50KHNoaXApO1xuICAgICAgfVxuXG4gICAgICAvLyBzaG93IGFpIHNoaXBzIHdoaWxlIHRlc3RpbmcuXG4gICAgICBjb29yZGluYXRlcy5mb3JFYWNoKChjb29yZCkgPT4ge1xuICAgICAgICB0aGlzLnBhZ2Uuc2hpcCh0aGlzLiNmaW5kR3JpZEl0ZW0oY29vcmQsIFwiYWlcIikpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAjYWlTaGlwUGxhY2VtZW50KHNoaXApIHtcbiAgICBsZXQgb3JpZW50YXRpb24gPSB0aGlzLiNyYW5kb21OdW0oMikgPT09IDAgPyBcImhvcml6b250YWxcIiA6IFwidmVydGljYWxcIjtcbiAgICBsZXQgY29vcmQgPVxuICAgICAgb3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiXG4gICAgICAgID8gW3RoaXMuI3JhbmRvbU51bSgxMCAtIHNoaXApLCB0aGlzLiNyYW5kb21OdW0oMTApXVxuICAgICAgICA6IFt0aGlzLiNyYW5kb21OdW0oMTApLCB0aGlzLiNyYW5kb21OdW0oMTAgLSBzaGlwKV07XG4gICAgbGV0IGNvb3JkaW5hdGVzID0gdGhpcy5haS5ib2FyZC5wbGFjZVNoaXAoc2hpcCwgY29vcmQsIG9yaWVudGF0aW9uKTtcbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gIH1cblxuICAjYWlBdHRhY2soKSB7XG4gICAgaWYgKHRoaXMuY3VycmVudFBsYXllciA9PT0gdGhpcy5haSAmJiB0aGlzLnJvdW5kKSB7XG4gICAgICBsZXQgY29vcmQgPSB0aGlzLiNhaUNvb3JkU2VsZWN0b3IoKTtcbiAgICAgIGxldCBncmlkSXRlbSA9IHRoaXMuI2ZpbmRHcmlkSXRlbShjb29yZCwgJ2h1bWFuJyk7XG4gICAgICBsZXQgYXR0YWNrZWRTaGlwID0gdGhpcy5odW1hbi5ib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkKVxuICAgICAgaWYgKGF0dGFja2VkU2hpcCkge1xuICAgICAgICAvLyBpZiBhIHNoaXAgaXMgaGl0LCBtYXJrIHNxdWFyZSBhcyByZWQuXG4gICAgICAgIHRoaXMucGFnZS5oaXQoZ3JpZEl0ZW0pO1xuICAgICAgICB0aGlzLnJvdW5kKys7XG4gICAgICAgIC8vIGlmIHNoaXAgaXMgc3VuaywgZGlzcGxheSBnbG9iYWwgbWVzc2FnZS5cbiAgICAgICAgaWYgKGF0dGFja2VkU2hpcC5pc1N1bmsoKSkge1xuICAgICAgICAgIHRoaXMucGFnZS5kaXNwbGF5U3Vua01lc3NhZ2UoYXR0YWNrZWRTaGlwKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaWYgYSBzaGlwIGlzIG5vdCBoaXQsIG1hcmsgc3F1YXJlIGFzIGJsdWUuXG4gICAgICAgIHRoaXMucGFnZS5taXNzKGdyaWRJdGVtKTtcbiAgICAgICAgdGhpcy5yb3VuZCsrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gICNhaUNvb3JkU2VsZWN0b3IocHJldmlvdXNDb29yZD1udWxsLCBhY2N1bXVsYXRvcj0wKSB7XG4gICAgY29uc3QgaHVtYW4gPSB0aGlzLmh1bWFuLmJvYXJkO1xuICAgIGxldCBjb29yZCA9IFtdO1xuICAgIC8vIGlmIGEgc2hpcCBoYXMgYmVlbiBoaXQsIHVzZSBtb3N0IHJlY2VudCBoaXQgdG8gZGV0ZXJtaW5lIG5leHQgc2hvdC5cbiAgICBpZiAoaHVtYW4uaGl0U2hvdHMubGVuZ3RoID4gMCAmJiBhY2N1bXVsYXRvciA8IDQpIHtcbiAgICAgIGNvbnN0IGhpdENvb3JkID0gaHVtYW4uaGl0U2hvdHMuYXQoLTEpO1xuICAgICAgY29uc3QgbGFzdFNob3QgPSBwcmV2aW91c0Nvb3JkID09PSBudWxsID8gaHVtYW4uYWxsU2hvdHMuYXQoLTEpIDogcHJldmlvdXNDb29yZDtcbiAgICAgIGlmIChsYXN0U2hvdFswXSA9PT0gaGl0Q29vcmRbMF0gJiYgbGFzdFNob3RbMV0gPT09IGhpdENvb3JkWzFdKSB7XG4gICAgICAgIGNvb3JkID0gW2hpdENvb3JkWzBdICsgMSwgaGl0Q29vcmRbMV1dO1xuICAgICAgfSBlbHNlIGlmIChsYXN0U2hvdFswXSA9PT0gaGl0Q29vcmRbMF0gKyAxICYmIGxhc3RTaG90WzFdID09PSBoaXRDb29yZFsxXSkge1xuICAgICAgICBjb29yZCA9IFtoaXRDb29yZFswXSAtIDEsIGhpdENvb3JkWzFdXTtcbiAgICAgIH0gZWxzZSBpZiAobGFzdFNob3RbMF0gPT09IGhpdENvb3JkWzBdIC0gMSAmJiBsYXN0U2hvdFsxXSA9PT0gaGl0Q29vcmRbMV0pIHtcbiAgICAgICAgY29vcmQgPSBbaGl0Q29vcmRbMF0sIGhpdENvb3JkWzFdICsgMV07XG4gICAgICB9IGVsc2UgaWYgKGxhc3RTaG90WzBdID09PSBoaXRDb29yZFswXSAmJiBsYXN0U2hvdFsxXSA9PT0gaGl0Q29vcmRbMV0gKyAxKSB7XG4gICAgICAgIGNvb3JkID0gW2hpdENvb3JkWzBdLCBoaXRDb29yZFsxXSAtIDFdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29vcmQgPSBbdGhpcy4jcmFuZG9tTnVtKDEwKSwgdGhpcy4jcmFuZG9tTnVtKDEwKV07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGlmIG5vIHNoaXAgaGFzIGJlZW4gaGl0LCB1c2UgcmFuZG9tIGNvb3JkLlxuICAgICAgY29vcmQgPSBbdGhpcy4jcmFuZG9tTnVtKDEwKSwgdGhpcy4jcmFuZG9tTnVtKDEwKV07XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgY29vcmQgaGFzIGFscmVhZHkgYmVlbiB1c2VkLCBpZiBzbyByZXJ1biBmdW5jdGlvbi5cbiAgICBodW1hbi5hbGxTaG90cy5mb3JFYWNoKHNob3QgPT4ge1xuICAgICAgaWYgKHNob3RbMF0gPT09IGNvb3JkWzBdICYmIHNob3RbMV0gPT09IGNvb3JkWzFdKSB7XG4gICAgICAgIGNvb3JkID0gdGhpcy4jYWlDb29yZFNlbGVjdG9yKGNvb3JkLCBhY2N1bXVsYXRvciArIDEpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLy8gQ2hlY2sgaWYgY29vcmQgaXMgb24gYm9hcmQsIGlmIG5vdCByZXJ1bi5cbiAgICBpZiAoY29vcmRbMF0gPiA5IHx8IGNvb3JkWzBdIDwgMCB8fCBjb29yZFsxXSA+IDkgfHwgY29vcmRbMV0gPCAwKSB7XG4gICAgICBjb29yZCA9IHRoaXMuI2FpQ29vcmRTZWxlY3Rvcihjb29yZCwgYWNjdW11bGF0b3IgKyAxKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvb3JkO1xuICB9XG5cbiAgI3JhbmRvbU51bShtYXgpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWF4KTtcbiAgfVxuXG4gICNmaW5kR3JpZEl0ZW0oY29vcmQsIHBsYXllcikge1xuICAgIGNvbnN0IGdyaWRJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5ncmlkLWl0ZW0uJHtwbGF5ZXJ9YCk7XG4gICAgbGV0IGZvdW5kSXRlbSA9IGZhbHNlO1xuICAgIGdyaWRJdGVtcy5mb3JFYWNoKChncmlkSXRlbSkgPT4ge1xuICAgICAgaWYgKGdyaWRJdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXMgPT09IGNvb3JkLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgZm91bmRJdGVtID0gZ3JpZEl0ZW07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGZvdW5kSXRlbTtcbiAgfVxuXG4gICNnYW1lT3ZlcigpIHtcbiAgICAvLyBBSSB3aW5zIGlmIGh1bWFuIGJvYXJkIGlzIGdhbWUgb3Zlci5cbiAgICBpZiAodGhpcy5odW1hbi5ib2FyZC5nYW1lT3ZlcigpKSB7XG4gICAgICByZXR1cm4gdGhpcy5haTtcbiAgICAvLyBIdW1hbiB3aW5zIGlmIGFpIGJvYXJkIGlzIGdhbWUgb3Zlci5cbiAgICB9IGVsc2UgaWYgKHRoaXMuYWkuYm9hcmQuZ2FtZU92ZXIoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuaHVtYW47XG4gICAgLy8gRWxzZSBnYW1lIGNvbnRpbnVlcy5cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IEdhbWVib2FyZCBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IoaHVtYW49dHJ1ZSkge1xuICAgIHRoaXMuYm9hcmQgPSBuZXcgR2FtZWJvYXJkO1xuICAgIHRoaXMuaXNIdW1hbiA9IGh1bWFuO1xuICAgIHRoaXMucHJldmlvdXNQbGF5cyA9IFtdO1xuICB9O1xuXG4gIGF0dGFjayhwbGF5ZXIsIGNvb3JkaW5hdGUpIHtcbiAgICBpZiAoIXRoaXMuaXNIdW1hbikge1xuICAgICAgY29vcmRpbmF0ZSA9IHRoaXMuI2FpQXR0YWNrKHBsYXllci5ib2FyZCk7XG4gICAgfVxuXG4gICAgdGhpcy5wcmV2aW91c1BsYXlzLnB1c2goY29vcmRpbmF0ZSk7XG4gICAgcGxheWVyLmJvYXJkLnJlY2VpdmVBdHRhY2soY29vcmRpbmF0ZSk7XG4gIH1cblxuICAjYWlBdHRhY2soYm9hcmQpIHtcbiAgICBsZXQgY29vcmRpbmF0ZSA9IHRoaXMuI3JhbmRvbUNvb3JkKCk7XG4gICAgaWYgKHRoaXMucHJldmlvdXNQbGF5cy5pbmNsdWRlcyhjb29yZGluYXRlKSkge1xuICAgICAgdGhpcy4jYWlBdHRhY2soYm9hcmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY29vcmRpbmF0ZTtcbiAgICB9XG4gIH1cblxuICAvLyBHZW5lcmF0ZSByYW5kb20gY29vcmRpbmF0ZXMgYmV0d2VlbiAwIC0gOS5cbiAgI3JhbmRvbUNvb3JkKCkge1xuICAgIHJldHVybiBbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApLCBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCldO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTaGlwIHtcbiAgY29uc3RydWN0b3Ioc2l6ZSkge1xuICAgIGNvbnN0IHNoaXBUeXBlcyA9IHs1IDogJ0NhcnJpZXInLCA0IDogJ0JhdHRsZXNoaXAnLCAzIDogJ0Rlc3Ryb3llcicsIDMgOiAnU3VibWFyaW5lJywgMiA6ICdQYXRyb2wgQm9hdCd9XG4gICAgdGhpcy5sZW5ndGggPSBzaXplO1xuICAgIHRoaXMuc2hpcFR5cGUgPSBzaGlwVHlwZXNbc2l6ZV07XG4gICAgdGhpcy5oaXRzID0gMDtcbiAgICB0aGlzLnN1bmsgPSBmYWxzZTtcbiAgfVxuXG4gIGhpdCgpIHtcbiAgICB0aGlzLmhpdHMrKztcbiAgICB0aGlzLmlzU3VuaygpO1xuICB9XG5cbiAgaXNTdW5rKCkge1xuICAgIGlmICh0aGlzLmhpdHMgPT09IHRoaXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLnN1bmsgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdW5rO1xuICB9XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBHYW1lbG9vcCBmcm9tIFwiLi9nYW1lbG9vcFwiO1xuXG5jb25zdCBnYW1lID0gbmV3IEdhbWVsb29wKCk7XG5nYW1lLnN0YXJ0KCk7XG4iXSwibmFtZXMiOlsiRE9NYnVpbGRlciIsImNvbnN0cnVjdG9yIiwic2hpcHMiLCJzaGlwTmFtZXMiLCJzaGlwU2l6ZXMiLCJnYW1lQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInBsYXllckNvbnRhaW5lciIsImNyZWF0ZUVsZW1lbnQiLCJhaUNvbnRhaW5lciIsImdsb2JhbE1zZyIsImlkIiwiY2xhc3NMaXN0IiwiYWRkIiwicGxheWVyVGl0bGUiLCJ0ZXh0Q29udGVudCIsImFpVGl0bGUiLCJwbGF5ZXJHcmlkIiwiZ3JpZFBvcHVsYXRlIiwiYWlHcmlkIiwicGxheWVyTXNnIiwiY3JlYXRlVGV4dE5vZGUiLCJ1cGRhdGVQbGF5ZXJNc2ciLCJvcmllbnRhdGlvbkJ0biIsImFwcGVuZCIsImhpdCIsImdyaWRJdGVtIiwicmVtb3ZlIiwibWlzcyIsInNoaXAiLCJoaWRlRWxlbWVudCIsImVsZW1lbnQiLCJzdHlsZSIsImRpc3BsYXkiLCJjb3VudGVyIiwiZXJyb3IiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJtc2ciLCJzZXRUaW1lb3V0IiwiY2xlYXJNc2ciLCJkaXNwbGF5U3Vua01lc3NhZ2UiLCJzdW5rTXNnIiwic2hpcFR5cGUiLCJhcHBlbmRDaGlsZCIsImRpc3BsYXlXaW5uZXIiLCJ3aW5uZXIiLCJ3aW5uZXJNc2ciLCIjY2xlYXJNc2ciLCJtc2dFbGVtZW50IiwiI2dyaWRQb3B1bGF0ZSIsInBsYXllciIsImdyaWQiLCJpIiwiZGF0YXNldCIsImNvb3JkaW5hdGVzIiwiY29vcmRzUG9wdWxhdGUiLCIjY29vcmRzUG9wdWxhdGUiLCJkaWdpdHMiLCJ0b1N0cmluZyIsInNwbGl0IiwiU2hpcCIsIkdhbWVib2FyZCIsImFsbFNoaXBzIiwibWlzc2VkU2hvdHMiLCJoaXRTaG90cyIsImFsbFNob3RzIiwicGxhY2VTaGlwIiwic2l6ZSIsImZpcnN0Q29vcmQiLCJvcmllbnRhdGlvbiIsImJ1aWxkQ29vcmRpbmF0ZXMiLCJ2YWxpZGF0ZUNvb3JkaW5hdGVzIiwibmV3U2hpcCIsInNoaXBFbnRyeSIsInB1c2giLCJyZWNlaXZlQXR0YWNrIiwiY29vcmRpbmF0ZSIsImZpbmRTaGlwIiwiZ2FtZU92ZXIiLCJhbGxTdW5rIiwiZm9yRWFjaCIsImlzU3VuayIsIiNidWlsZENvb3JkaW5hdGVzIiwiI3ZhbGlkYXRlQ29vcmRpbmF0ZXMiLCJ2YWxpZENvb3JkcyIsImNvb3JkIiwiI2ZpbmRTaGlwIiwiZm91bmRTaGlwIiwic29tZSIsIngiLCJQbGF5ZXIiLCJHYW1lbG9vcCIsImh1bWFuIiwiYWkiLCJwbGF5ZXJzIiwiY3VycmVudFBsYXllciIsInJvdW5kIiwicGFnZSIsInN0YXJ0IiwiYWlTaGlwcyIsImFpR3JpZExpc3RlbmVycyIsImh1bWFuR3JpZExpc3RlbmVycyIsImN1cnJlbnRSb3VuZCIsInBsYXlSb3VuZCIsImFpQXR0YWNrIiwiZW5kR2FtZSIsIiNlbmRHYW1lIiwiYWlHcmlkSXRlbXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaXRlbSIsImNvb3JkcyIsIm1hcCIsInBhcnNlSW50IiwiYWlCb2FyZEF0dGFjayIsIm9yaWVudGF0aW9uQnRuTGlzdGVuZXIiLCJncmlkSXRlbXMiLCJwbGFjZW1lbnRDb3VudGVyIiwic2hpcFNpemUiLCJhZGRFdmVudExpc3RlbmVyIiwiYm9hcmQiLCJmaW5kR3JpZEl0ZW0iLCIjb3JpZW50YXRpb25CdG5MaXN0ZW5lciIsInRleHQiLCIjYWlCb2FyZEF0dGFjayIsImF0dGFja2VkU2hpcCIsIiNhaVNoaXBzIiwiYWlTaGlwUGxhY2VtZW50IiwiI2FpU2hpcFBsYWNlbWVudCIsInJhbmRvbU51bSIsIiNhaUF0dGFjayIsImFpQ29vcmRTZWxlY3RvciIsIiNhaUNvb3JkU2VsZWN0b3IiLCJwcmV2aW91c0Nvb3JkIiwiYWNjdW11bGF0b3IiLCJoaXRDb29yZCIsImF0IiwibGFzdFNob3QiLCJzaG90IiwiI3JhbmRvbU51bSIsIm1heCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIiNmaW5kR3JpZEl0ZW0iLCJmb3VuZEl0ZW0iLCIjZ2FtZU92ZXIiLCJpc0h1bWFuIiwicHJldmlvdXNQbGF5cyIsImF0dGFjayIsInJhbmRvbUNvb3JkIiwiaW5jbHVkZXMiLCIjcmFuZG9tQ29vcmQiLCJzaGlwVHlwZXMiLCJoaXRzIiwic3VuayIsImdhbWUiXSwic291cmNlUm9vdCI6IiJ9