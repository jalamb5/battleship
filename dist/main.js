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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEVBQUcsV0FBVztNQUFFLENBQUMsRUFBRztJQUFhLENBQUM7SUFDeEcsSUFBSSxDQUFDdkgsTUFBTSxHQUFHZ0MsSUFBSTtJQUNsQixJQUFJLENBQUN6QixRQUFRLEdBQUdnSCxTQUFTLENBQUN2RixJQUFJLENBQUM7SUFDL0IsSUFBSSxDQUFDd0YsSUFBSSxHQUFHLENBQUM7SUFDYixJQUFJLENBQUNDLElBQUksR0FBRyxLQUFLO0VBQ25CO0VBRUFySSxHQUFHQSxDQUFBLEVBQUc7SUFDSixJQUFJLENBQUNvSSxJQUFJLEVBQUU7SUFDWCxJQUFJLENBQUMxRSxNQUFNLENBQUMsQ0FBQztFQUNmO0VBRUFBLE1BQU1BLENBQUEsRUFBRztJQUNQLElBQUksSUFBSSxDQUFDMEUsSUFBSSxLQUFLLElBQUksQ0FBQ3hILE1BQU0sRUFBRTtNQUM3QixJQUFJLENBQUN5SCxJQUFJLEdBQUcsSUFBSTtJQUNsQjtJQUNBLE9BQU8sSUFBSSxDQUFDQSxJQUFJO0VBQ2xCO0FBQ0Y7Ozs7OztVQ3BCQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTmtDO0FBRWxDLE1BQU1DLElBQUksR0FBRyxJQUFJbEUsaURBQVEsQ0FBQyxDQUFDO0FBQzNCa0UsSUFBSSxDQUFDM0QsS0FBSyxDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZG9tQnVpbGRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVsb29wLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcGxheWVycy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NjcmlwdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBET01idWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY29uc3Qgc2hpcHMgPSB7J0NhcnJpZXInOiA1LCAnQmF0dGxlc2hpcCc6IDQsICdEZXN0cm95ZXInOiAzLCAnU3VibWFyaW5lJzogMywgJ1BhdHJvbCBCb2F0JzogMn1cbiAgICB0aGlzLnNoaXBOYW1lcyA9IFsnQ2FycmllcicsICdCYXR0bGVzaGlwJywgJ0Rlc3Ryb3llcicsICdTdWJtYXJpbmUnLCAnUGF0cm9sIEJvYXQnXTtcbiAgICB0aGlzLnNoaXBTaXplcyA9IFs1LCA0LCAzLCAzLCAyXTtcblxuICAgIHRoaXMuZ2FtZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLWNvbnRhaW5lcicpO1xuICAgIC8vIGNyZWF0ZSBjb250YWluZXJzIGZvciBlbGVtZW50czpcbiAgICAgIC8vIDIgcGxheWVyIGNvbnRhaW5lcnNcbiAgICB0aGlzLnBsYXllckNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuYWlDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmdsb2JhbE1zZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuZ2xvYmFsTXNnLmlkID0gJ2dsb2JhbC1tc2cnO1xuICAgIHRoaXMucGxheWVyQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3BsYXllci1jb250YWluZXInKTtcbiAgICB0aGlzLmFpQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3BsYXllci1jb250YWluZXInKTtcbiAgICAgIC8vIGVhY2ggY29udGFpbmVyIGNvbnRhaW5zOlxuICAgICAgICAvLyBQbGF5ZXIgdGl0bGVcbiAgICAgICAgY29uc3QgcGxheWVyVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpXG4gICAgICAgIHBsYXllclRpdGxlLnRleHRDb250ZW50ID0gJ1BsYXllcic7XG5cbiAgICAgICAgY29uc3QgYWlUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG4gICAgICAgIGFpVGl0bGUudGV4dENvbnRlbnQgPSAnQ29tcHV0ZXInO1xuXG4gICAgICAgIC8vIEdhbWUgYm9hcmQgZ3JpZCAoMTAgeCAxMClcbiAgICAgICAgY29uc3QgcGxheWVyR3JpZCA9IHRoaXMuI2dyaWRQb3B1bGF0ZSgnaHVtYW4nKTtcbiAgICAgICAgY29uc3QgYWlHcmlkID0gdGhpcy4jZ3JpZFBvcHVsYXRlKCdhaScpO1xuXG4gICAgICAgIHRoaXMucGxheWVyTXNnID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICAgICAgICB0aGlzLnVwZGF0ZVBsYXllck1zZygwKTtcbiAgICAgICAgdGhpcy5wbGF5ZXJNc2cuaWQgPSAncGxheWVyTXNnJztcblxuICAgICAgICBjb25zdCBvcmllbnRhdGlvbkJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBvcmllbnRhdGlvbkJ0bi50ZXh0Q29udGVudCA9ICdob3Jpem9udGFsJztcbiAgICAgICAgb3JpZW50YXRpb25CdG4uaWQgPSAnb3JpZW50YXRpb25CdG4nO1xuXG4gICAgICB0aGlzLnBsYXllckNvbnRhaW5lci5hcHBlbmQocGxheWVyVGl0bGUsIHBsYXllckdyaWQsIHRoaXMucGxheWVyTXNnLCBvcmllbnRhdGlvbkJ0bik7XG4gICAgICB0aGlzLmFpQ29udGFpbmVyLmFwcGVuZChhaVRpdGxlLCBhaUdyaWQpO1xuXG4gICAgdGhpcy5nYW1lQ29udGFpbmVyLmFwcGVuZCh0aGlzLnBsYXllckNvbnRhaW5lciwgdGhpcy5haUNvbnRhaW5lciwgdGhpcy5nbG9iYWxNc2cpO1xuICB9XG5cbiAgaGl0KGdyaWRJdGVtKSB7XG4gICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnc2hpcCcpO1xuICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5hZGQoJ2hpdCcpO1xuICB9O1xuXG4gIG1pc3MoZ3JpZEl0ZW0pIHtcbiAgICBncmlkSXRlbS5jbGFzc0xpc3QuYWRkKCdtaXNzJyk7XG4gIH1cblxuICBzaGlwKGdyaWRJdGVtKSB7XG4gICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZCgnc2hpcCcpO1xuICB9O1xuXG4gIGhpZGVFbGVtZW50KGVsZW1lbnQpIHtcbiAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIH1cblxuICB1cGRhdGVQbGF5ZXJNc2coY291bnRlciwgZXJyb3I9bnVsbCkge1xuICAgIGxldCBtc2cgPSB0aGlzLnBsYXllck1zZztcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIG1zZy50ZXh0Q29udGVudCA9ICdJbnZhbGlkIHBsYWNlbWVudCBsb2NhdGlvbic7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy51cGRhdGVQbGF5ZXJNc2coY291bnRlcik7XG4gICAgICB9LCAxMDAwKVxuICAgIH0gZWxzZSBpZiAoY291bnRlciA8IDUpIHtcbiAgICAgIG1zZy50ZXh0Q29udGVudCA9IGBDbGljayBncmlkIHRvIHBsYWNlICR7dGhpcy5zaGlwTmFtZXNbY291bnRlcl19IChzaXplOiAke3RoaXMuc2hpcFNpemVzW2NvdW50ZXJdfSlgXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy4jY2xlYXJNc2cobXNnKTtcbiAgICB9XG4gIH1cblxuICBkaXNwbGF5U3Vua01lc3NhZ2Uoc2hpcCkge1xuICAgIGNvbnN0IHN1bmtNc2cgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShgJHtzaGlwLnNoaXBUeXBlfSBoYXMgYmVlbiBzdW5rLmApXG4gICAgdGhpcy5nbG9iYWxNc2cuYXBwZW5kQ2hpbGQoc3Vua01zZyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLiNjbGVhck1zZyhzdW5rTXNnKTtcbiAgICB9LCAzMDAwKTtcbiAgfVxuXG4gIGRpc3BsYXlXaW5uZXIod2lubmVyKSB7XG4gICAgY29uc3Qgd2lubmVyTXNnID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYFdpbm5lcjogJHt3aW5uZXJ9IWApO1xuICAgIHRoaXMuZ2xvYmFsTXNnLmFwcGVuZENoaWxkKHdpbm5lck1zZyk7XG4gIH1cblxuICAjY2xlYXJNc2cobXNnRWxlbWVudCkge1xuICAgIG1zZ0VsZW1lbnQucmVtb3ZlKCk7XG4gIH1cblxuICAjZ3JpZFBvcHVsYXRlKHBsYXllcikge1xuICAgIGNvbnN0IGdyaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBncmlkLmNsYXNzTGlzdC5hZGQoJ2dyaWQnLCBwbGF5ZXIpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDA7IGkrKykge1xuICAgICAgY29uc3QgZ3JpZEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5hZGQoJ2dyaWQtaXRlbScsIHBsYXllcik7XG4gICAgICBncmlkSXRlbS5kYXRhc2V0LmNvb3JkaW5hdGVzID0gdGhpcy4jY29vcmRzUG9wdWxhdGUoaSk7XG4gICAgICBncmlkLmFwcGVuZENoaWxkKGdyaWRJdGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIGdyaWQ7XG4gIH1cblxuICAjY29vcmRzUG9wdWxhdGUoaSkge1xuICAgIGlmIChpIDwgMTApIHtcbiAgICAgIHJldHVybiBbaSwgMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBkaWdpdHMgPSBpLnRvU3RyaW5nKCkuc3BsaXQoJycpO1xuICAgICAgcmV0dXJuIFtkaWdpdHNbMV0sIGRpZ2l0c1swXV07XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgU2hpcCBmcm9tICcuL3NoaXBzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZWJvYXJkIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hbGxTaGlwcyA9IFtdO1xuICAgIHRoaXMubWlzc2VkU2hvdHMgPSBbXTtcbiAgICB0aGlzLmhpdFNob3RzID0gW107XG4gICAgdGhpcy5hbGxTaG90cyA9IFtdO1xuICB9O1xuXG4gIHBsYWNlU2hpcChzaXplLCBmaXJzdENvb3JkLCBvcmllbnRhdGlvbj0naG9yaXpvbnRhbCcpIHtcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IHRoaXMuI2J1aWxkQ29vcmRpbmF0ZXMoc2l6ZSwgZmlyc3RDb29yZCwgb3JpZW50YXRpb24pO1xuICAgIGlmICh0aGlzLiN2YWxpZGF0ZUNvb3JkaW5hdGVzKGNvb3JkaW5hdGVzKSkge1xuICAgICAgY29uc3QgbmV3U2hpcCA9IG5ldyBTaGlwKHNpemUpO1xuICAgICAgY29uc3Qgc2hpcEVudHJ5ID0gW25ld1NoaXAsIGNvb3JkaW5hdGVzXTtcbiAgICAgIHRoaXMuYWxsU2hpcHMucHVzaChzaGlwRW50cnkpO1xuICAgICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLy8gcmVjZWl2ZUF0dGFjayBmdW5jdGlvbiB0YWtlcyBjb29yZGluYXRlcywgZGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCB0aGUgYXR0YWNrIGhpdCBhIHNoaXBcbiAgLy8gdGhlbiBzZW5kcyB0aGUg4oCYaGl04oCZIGZ1bmN0aW9uIHRvIHRoZSBjb3JyZWN0IHNoaXAsIG9yIHJlY29yZHMgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBtaXNzZWQgc2hvdC5cbiAgcmVjZWl2ZUF0dGFjayhjb29yZGluYXRlKSB7XG4gICAgdGhpcy5hbGxTaG90cy5wdXNoKGNvb3JkaW5hdGUpO1xuICAgIGNvbnN0IHNoaXAgPSB0aGlzLiNmaW5kU2hpcChjb29yZGluYXRlKTtcbiAgICBpZiAoc2hpcCkge1xuICAgICAgc2hpcC5oaXQoKTtcbiAgICAgIHRoaXMuaGl0U2hvdHMucHVzaChjb29yZGluYXRlKTtcbiAgICAgIHJldHVybiBzaGlwO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1pc3NlZFNob3RzLnB1c2goY29vcmRpbmF0ZSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZ2FtZU92ZXIoKSB7XG4gICAgbGV0IGFsbFN1bmsgPSB0cnVlO1xuICAgIC8vIElmIHNoaXBzIGhhdmVuJ3QgeWV0IGJlZW4gcGxhY2VkLCByZXR1cm4gZmFsc2UuXG4gICAgaWYgKHRoaXMuYWxsU2hpcHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuYWxsU2hpcHMuZm9yRWFjaChzaGlwID0+IHtcbiAgICAgIGlmICghc2hpcFswXS5pc1N1bmsoKSkge1xuICAgICAgICBhbGxTdW5rID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gYWxsU3VuaztcbiAgfVxuXG4gICNidWlsZENvb3JkaW5hdGVzKHNpemUsIGZpcnN0Q29vcmQsIG9yaWVudGF0aW9uKSB7XG4gICAgbGV0IGNvb3JkaW5hdGVzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgIGNvb3JkaW5hdGVzLnB1c2goW2ZpcnN0Q29vcmRbMF0gKyBpLCBmaXJzdENvb3JkWzFdXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb29yZGluYXRlcy5wdXNoKFtmaXJzdENvb3JkWzBdLCBmaXJzdENvb3JkWzFdICsgaV0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gIH1cblxuICAjdmFsaWRhdGVDb29yZGluYXRlcyhjb29yZGluYXRlcykge1xuICAgIGxldCB2YWxpZENvb3JkcyA9IHRydWU7XG4gICAgY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmQpID0+IHtcbiAgICAgIC8vIElmIGEgc2hpcCBhbHJlYWR5IGV4aXN0cyBhdCBsb2NhdGlvbiwgcmVqZWN0IGl0LlxuICAgICAgaWYgKHRoaXMuI2ZpbmRTaGlwKGNvb3JkKSB8fCBjb29yZFswXSA+IDkgfHwgY29vcmRbMV0gPiA5KSB7XG4gICAgICAgIHZhbGlkQ29vcmRzID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gdmFsaWRDb29yZHM7XG4gIH1cblxuICAjZmluZFNoaXAoY29vcmRpbmF0ZSkge1xuICAgIGxldCBmb3VuZFNoaXAgPSBmYWxzZTtcbiAgICB0aGlzLmFsbFNoaXBzLmZvckVhY2goc2hpcCA9PiB7XG4gICAgICBpZiAoc2hpcFsxXS5zb21lKCh4KSA9PiB4WzBdID09PSBjb29yZGluYXRlWzBdICYmIHhbMV0gPT09IGNvb3JkaW5hdGVbMV0pKSB7XG4gICAgICAgIGZvdW5kU2hpcCA9IHNoaXBbMF07XG4gICAgfX0pXG4gICAgcmV0dXJuIGZvdW5kU2hpcDtcbiAgfVxufVxuIiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi9wbGF5ZXJzXCI7XG5pbXBvcnQgRE9NYnVpbGRlciBmcm9tIFwiLi9kb21CdWlsZGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVsb29wIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5odW1hbiA9IG5ldyBQbGF5ZXIodHJ1ZSk7XG4gICAgdGhpcy5haSA9IG5ldyBQbGF5ZXIoZmFsc2UpO1xuICAgIHRoaXMucGxheWVycyA9IFt0aGlzLmh1bWFuLCB0aGlzLmFpXTtcbiAgICB0aGlzLmN1cnJlbnRQbGF5ZXIgPSB0aGlzLmFpO1xuICAgIHRoaXMucm91bmQgPSBudWxsO1xuICAgIHRoaXMucGFnZSA9IG5ldyBET01idWlsZGVyKCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLiNhaVNoaXBzKCk7XG4gICAgdGhpcy5haUdyaWRMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLmh1bWFuR3JpZExpc3RlbmVycygpO1xuXG4gICAgbGV0IGN1cnJlbnRSb3VuZCA9IHRoaXMucm91bmQ7XG5cbiAgICBjb25zdCBwbGF5Um91bmQgPSAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuI2dhbWVPdmVyKCkpIHtcbiAgICAgICAgdGhpcy4jYWlBdHRhY2soKTtcbiAgICAgICAgaWYgKGN1cnJlbnRSb3VuZCAhPT0gdGhpcy5yb3VuZCkge1xuICAgICAgICAgIHRoaXMuY3VycmVudFBsYXllciA9IHRoaXMuY3VycmVudFBsYXllciA9PT0gdGhpcy5odW1hbiA/IHRoaXMuYWkgOiB0aGlzLmh1bWFuO1xuICAgICAgICAgIGN1cnJlbnRSb3VuZCA9IHRoaXMucm91bmQ7XG4gICAgICAgIH1cbiAgICAgICAgc2V0VGltZW91dChwbGF5Um91bmQsIDApOyAvLyBTY2hlZHVsZSB0aGUgbmV4dCByb3VuZCBhZnRlciBhIHZlcnkgc2hvcnQgZGVsYXlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuI2VuZEdhbWUoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGxheVJvdW5kKCk7XG4gIH1cblxuICAjZW5kR2FtZSgpIHtcbiAgICBjb25zdCB3aW5uZXIgPSB0aGlzLiNnYW1lT3ZlcigpID09PSB0aGlzLmh1bWFuID8gJ1lvdScgOiAnQ29tcHV0ZXInO1xuICAgIGNvbnN0IGFpR3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ncmlkLWl0ZW0uYWlcIik7XG4gICAgY29uc3QgaHVtYW5HcmlkSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdyaWQtaXRlbS5odW1hblwiKTtcbiAgICAvLyBkaXNwbGF5IHRoZSB3aW5uZXJcbiAgICB0aGlzLnBhZ2UuZGlzcGxheVdpbm5lcih3aW5uZXIpO1xuICAgIC8vIHJldmVhbCBhbGwgYm9hcmRzXG4gICAgYWlHcmlkSXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGxldCBjb29yZHMgPSBpdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXNcbiAgICAgIC5zcGxpdChcIixcIilcbiAgICAgIC5tYXAoKHgpID0+IHBhcnNlSW50KHgsIDEwKSk7XG4gICAgICB0aGlzLiNhaUJvYXJkQXR0YWNrKGNvb3JkcywgaXRlbSk7XG4gICAgfSlcbiAgICBodW1hbkdyaWRJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKCFpdGVtLmNsYXNzTGlzdC5jb250YWlucyhcInNoaXBcIikgJiYgIWl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0XCIpKSB7XG4gICAgICAgIHRoaXMucGFnZS5taXNzKGl0ZW0pO1xuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBodW1hbkdyaWRMaXN0ZW5lcnMoKSB7XG4gICAgdGhpcy4jb3JpZW50YXRpb25CdG5MaXN0ZW5lcigpO1xuICAgIGNvbnN0IG9yaWVudGF0aW9uQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmllbnRhdGlvbkJ0blwiKTtcbiAgICBjb25zdCBncmlkSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdyaWQtaXRlbS5odW1hblwiKTtcbiAgICBsZXQgcGxhY2VtZW50Q291bnRlciA9IDA7XG4gICAgbGV0IHNoaXBTaXplID0gWzUsIDQsIDMsIDMsIDJdO1xuXG4gICAgZ3JpZEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgaWYgKHBsYWNlbWVudENvdW50ZXIgPj0gc2hpcFNpemUubGVuZ3RoIC0gMSAmJiAhdGhpcy5yb3VuZCkge1xuICAgICAgICAgIHRoaXMucGFnZS5oaWRlRWxlbWVudChvcmllbnRhdGlvbkJ0bik7XG4gICAgICAgICAgdGhpcy5yb3VuZCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb3JpZW50YXRpb24gPSBvcmllbnRhdGlvbkJ0bi50ZXh0Q29udGVudDtcbiAgICAgICAgbGV0IGNvb3JkcyA9IGl0ZW0uZGF0YXNldC5jb29yZGluYXRlc1xuICAgICAgICAgIC5zcGxpdChcIixcIilcbiAgICAgICAgICAubWFwKCh4KSA9PiBwYXJzZUludCh4LCAxMCkpO1xuICAgICAgICBsZXQgY29vcmRpbmF0ZXMgPSB0aGlzLmh1bWFuLmJvYXJkLnBsYWNlU2hpcChcbiAgICAgICAgICBzaGlwU2l6ZVtwbGFjZW1lbnRDb3VudGVyXSxcbiAgICAgICAgICBjb29yZHMsXG4gICAgICAgICAgb3JpZW50YXRpb25cbiAgICAgICAgKTtcbiAgICAgICAgLy8gU2hvdyBzaGlwIG9uIHNjcmVlbiwgaWYgdmFsaWQgcGxhY2VtZW50LlxuICAgICAgICBpZiAoY29vcmRpbmF0ZXMpIHtcbiAgICAgICAgICBjb29yZGluYXRlcy5mb3JFYWNoKChjb29yZCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wYWdlLnNoaXAodGhpcy4jZmluZEdyaWRJdGVtKGNvb3JkLCBcImh1bWFuXCIpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBwbGFjZW1lbnRDb3VudGVyKys7XG4gICAgICAgICAgdGhpcy5wYWdlLnVwZGF0ZVBsYXllck1zZyhwbGFjZW1lbnRDb3VudGVyKTtcbiAgICAgICAgLy8gRGlzcGxheSBlcnJvciBtZXNzYWdlIGlmIHBsYWNlbWVudCBnb2VzIG9mZiBib2FyZCBvciBjb25mbGljdHMgd2l0aCBleGlzdGluZyBzaGlwLlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5wYWdlLnVwZGF0ZVBsYXllck1zZyhwbGFjZW1lbnRDb3VudGVyLCBcImVycm9yXCIpO1xuICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAjb3JpZW50YXRpb25CdG5MaXN0ZW5lcigpIHtcbiAgICBjb25zdCBvcmllbnRhdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JpZW50YXRpb25CdG5cIik7XG4gICAgb3JpZW50YXRpb24uZGlzcGxheSA9IFwiYmxvY2tcIjtcblxuICAgIG9yaWVudGF0aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICBsZXQgdGV4dCA9IG9yaWVudGF0aW9uLnRleHRDb250ZW50O1xuICAgICAgb3JpZW50YXRpb24udGV4dENvbnRlbnQgPVxuICAgICAgICB0ZXh0ID09PSBcImhvcml6b250YWxcIiA/IFwidmVydGljYWxcIiA6IFwiaG9yaXpvbnRhbFwiO1xuICAgIH0pO1xuICB9XG5cbiAgYWlHcmlkTGlzdGVuZXJzKCkge1xuICAgIGNvbnN0IGdyaWRJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ3JpZC1pdGVtLmFpXCIpO1xuICAgIGdyaWRJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQbGF5ZXIgPT09IHRoaXMuaHVtYW4pIHtcbiAgICAgICAgICBsZXQgY29vcmRzID0gaXRlbS5kYXRhc2V0LmNvb3JkaW5hdGVzXG4gICAgICAgICAgICAuc3BsaXQoXCIsXCIpXG4gICAgICAgICAgICAubWFwKCh4KSA9PiBwYXJzZUludCh4LCAxMCkpO1xuICAgICAgICAgIHRoaXMuI2FpQm9hcmRBdHRhY2soY29vcmRzLCBpdGVtKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAjYWlCb2FyZEF0dGFjayhjb29yZHMsIGdyaWRJdGVtKSB7XG4gICAgbGV0IGF0dGFja2VkU2hpcCA9IHRoaXMuYWkuYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZHMpXG4gICAgaWYgKGF0dGFja2VkU2hpcCkge1xuICAgICAgLy8gaWYgYSBzaGlwIGlzIGhpdCwgbWFyayBzcXVhcmUgYXMgcmVkLlxuICAgICAgdGhpcy5wYWdlLmhpdChncmlkSXRlbSk7XG4gICAgICB0aGlzLnJvdW5kKys7XG4gICAgICAvLyBpZiBzaGlwIGlzIHN1bmssIGRpc3BsYXkgZ2xvYmFsIG1lc3NhZ2UuXG4gICAgICBpZiAoYXR0YWNrZWRTaGlwLmlzU3VuaygpICYmICF0aGlzLiNnYW1lT3ZlcigpKSB7XG4gICAgICAgIHRoaXMucGFnZS5kaXNwbGF5U3Vua01lc3NhZ2UoYXR0YWNrZWRTaGlwKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaWYgYSBzaGlwIGlzIG5vdCBoaXQsIG1hcmsgc3F1YXJlIGFzIGJsdWUuXG4gICAgICB0aGlzLnBhZ2UubWlzcyhncmlkSXRlbSk7XG4gICAgICB0aGlzLnJvdW5kKys7XG4gICAgfVxuICB9XG5cbiAgI2FpU2hpcHMoKSB7XG4gICAgY29uc3Qgc2hpcFNpemVzID0gWzUsIDQsIDMsIDMsIDJdO1xuICAgIHNoaXBTaXplcy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBsZXQgY29vcmRpbmF0ZXMgPSB0aGlzLiNhaVNoaXBQbGFjZW1lbnQoc2hpcCk7XG5cbiAgICAgIHdoaWxlICghY29vcmRpbmF0ZXMpIHtcbiAgICAgICAgY29vcmRpbmF0ZXMgPSB0aGlzLiNhaVNoaXBQbGFjZW1lbnQoc2hpcCk7XG4gICAgICB9XG5cbiAgICAgIC8vIHNob3cgYWkgc2hpcHMgd2hpbGUgdGVzdGluZy5cbiAgICAgIGNvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkKSA9PiB7XG4gICAgICAgIHRoaXMucGFnZS5zaGlwKHRoaXMuI2ZpbmRHcmlkSXRlbShjb29yZCwgXCJhaVwiKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gICNhaVNoaXBQbGFjZW1lbnQoc2hpcCkge1xuICAgIGxldCBvcmllbnRhdGlvbiA9IHRoaXMuI3JhbmRvbU51bSgyKSA9PT0gMCA/IFwiaG9yaXpvbnRhbFwiIDogXCJ2ZXJ0aWNhbFwiO1xuICAgIGxldCBjb29yZCA9XG4gICAgICBvcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCJcbiAgICAgICAgPyBbdGhpcy4jcmFuZG9tTnVtKDEwIC0gc2hpcCksIHRoaXMuI3JhbmRvbU51bSgxMCldXG4gICAgICAgIDogW3RoaXMuI3JhbmRvbU51bSgxMCksIHRoaXMuI3JhbmRvbU51bSgxMCAtIHNoaXApXTtcbiAgICBsZXQgY29vcmRpbmF0ZXMgPSB0aGlzLmFpLmJvYXJkLnBsYWNlU2hpcChzaGlwLCBjb29yZCwgb3JpZW50YXRpb24pO1xuICAgIHJldHVybiBjb29yZGluYXRlcztcbiAgfVxuXG4gICNhaUF0dGFjaygpIHtcbiAgICBpZiAodGhpcy5jdXJyZW50UGxheWVyID09PSB0aGlzLmFpICYmIHRoaXMucm91bmQpIHtcbiAgICAgIGxldCBjb29yZCA9IHRoaXMuI2FpQ29vcmRTZWxlY3RvcigpO1xuICAgICAgbGV0IGdyaWRJdGVtID0gdGhpcy4jZmluZEdyaWRJdGVtKGNvb3JkLCAnaHVtYW4nKTtcbiAgICAgIGxldCBhdHRhY2tlZFNoaXAgPSB0aGlzLmh1bWFuLmJvYXJkLnJlY2VpdmVBdHRhY2soY29vcmQpXG4gICAgICBpZiAoYXR0YWNrZWRTaGlwKSB7XG4gICAgICAgIC8vIGlmIGEgc2hpcCBpcyBoaXQsIG1hcmsgc3F1YXJlIGFzIHJlZC5cbiAgICAgICAgdGhpcy5wYWdlLmhpdChncmlkSXRlbSk7XG4gICAgICAgIHRoaXMucm91bmQrKztcbiAgICAgICAgLy8gaWYgc2hpcCBpcyBzdW5rLCBkaXNwbGF5IGdsb2JhbCBtZXNzYWdlLlxuICAgICAgICBpZiAoYXR0YWNrZWRTaGlwLmlzU3VuaygpKSB7XG4gICAgICAgICAgdGhpcy5wYWdlLmRpc3BsYXlTdW5rTWVzc2FnZShhdHRhY2tlZFNoaXApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpZiBhIHNoaXAgaXMgbm90IGhpdCwgbWFyayBzcXVhcmUgYXMgYmx1ZS5cbiAgICAgICAgdGhpcy5wYWdlLm1pc3MoZ3JpZEl0ZW0pO1xuICAgICAgICB0aGlzLnJvdW5kKys7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgI2FpQ29vcmRTZWxlY3RvcihwcmV2aW91c0Nvb3JkPW51bGwsIGFjY3VtdWxhdG9yPTApIHtcbiAgICBjb25zdCBodW1hbiA9IHRoaXMuaHVtYW4uYm9hcmQ7XG4gICAgbGV0IGNvb3JkID0gW107XG4gICAgLy8gaWYgYSBzaGlwIGhhcyBiZWVuIGhpdCwgdXNlIG1vc3QgcmVjZW50IGhpdCB0byBkZXRlcm1pbmUgbmV4dCBzaG90LlxuICAgIGlmIChodW1hbi5oaXRTaG90cy5sZW5ndGggPiAwICYmIGFjY3VtdWxhdG9yIDwgNCkge1xuICAgICAgY29uc3QgaGl0Q29vcmQgPSBodW1hbi5oaXRTaG90cy5hdCgtMSk7XG4gICAgICBjb25zdCBsYXN0U2hvdCA9IHByZXZpb3VzQ29vcmQgPT09IG51bGwgPyBodW1hbi5hbGxTaG90cy5hdCgtMSkgOiBwcmV2aW91c0Nvb3JkO1xuICAgICAgaWYgKGxhc3RTaG90WzBdID09PSBoaXRDb29yZFswXSAmJiBsYXN0U2hvdFsxXSA9PT0gaGl0Q29vcmRbMV0pIHtcbiAgICAgICAgY29vcmQgPSBbaGl0Q29vcmRbMF0gKyAxLCBoaXRDb29yZFsxXV07XG4gICAgICB9IGVsc2UgaWYgKGxhc3RTaG90WzBdID09PSBoaXRDb29yZFswXSArIDEgJiYgbGFzdFNob3RbMV0gPT09IGhpdENvb3JkWzFdKSB7XG4gICAgICAgIGNvb3JkID0gW2hpdENvb3JkWzBdIC0gMSwgaGl0Q29vcmRbMV1dO1xuICAgICAgfSBlbHNlIGlmIChsYXN0U2hvdFswXSA9PT0gaGl0Q29vcmRbMF0gLSAxICYmIGxhc3RTaG90WzFdID09PSBoaXRDb29yZFsxXSkge1xuICAgICAgICBjb29yZCA9IFtoaXRDb29yZFswXSwgaGl0Q29vcmRbMV0gKyAxXTtcbiAgICAgIH0gZWxzZSBpZiAobGFzdFNob3RbMF0gPT09IGhpdENvb3JkWzBdICYmIGxhc3RTaG90WzFdID09PSBoaXRDb29yZFsxXSArIDEpIHtcbiAgICAgICAgY29vcmQgPSBbaGl0Q29vcmRbMF0sIGhpdENvb3JkWzFdIC0gMV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb29yZCA9IFt0aGlzLiNyYW5kb21OdW0oMTApLCB0aGlzLiNyYW5kb21OdW0oMTApXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaWYgbm8gc2hpcCBoYXMgYmVlbiBoaXQsIHVzZSByYW5kb20gY29vcmQuXG4gICAgICBjb29yZCA9IFt0aGlzLiNyYW5kb21OdW0oMTApLCB0aGlzLiNyYW5kb21OdW0oMTApXTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiBjb29yZCBoYXMgYWxyZWFkeSBiZWVuIHVzZWQsIGlmIHNvIHJlcnVuIGZ1bmN0aW9uLlxuICAgIGh1bWFuLmFsbFNob3RzLmZvckVhY2goc2hvdCA9PiB7XG4gICAgICBpZiAoc2hvdFswXSA9PT0gY29vcmRbMF0gJiYgc2hvdFsxXSA9PT0gY29vcmRbMV0pIHtcbiAgICAgICAgY29vcmQgPSB0aGlzLiNhaUNvb3JkU2VsZWN0b3IoY29vcmQsIGFjY3VtdWxhdG9yICsgMSk7XG4gICAgICB9XG4gICAgfSlcbiAgICAvLyBDaGVjayBpZiBjb29yZCBpcyBvbiBib2FyZCwgaWYgbm90IHJlcnVuLlxuICAgIGlmIChjb29yZFswXSA+IDkgfHwgY29vcmRbMF0gPCAwIHx8IGNvb3JkWzFdID4gOSB8fCBjb29yZFsxXSA8IDApIHtcbiAgICAgIGNvb3JkID0gdGhpcy4jYWlDb29yZFNlbGVjdG9yKGNvb3JkLCBhY2N1bXVsYXRvciArIDEpO1xuICAgIH1cbiAgICByZXR1cm4gY29vcmQ7XG4gIH1cblxuICAjcmFuZG9tTnVtKG1heCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xuICB9XG5cbiAgI2ZpbmRHcmlkSXRlbShjb29yZCwgcGxheWVyKSB7XG4gICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLmdyaWQtaXRlbS4ke3BsYXllcn1gKTtcbiAgICBsZXQgZm91bmRJdGVtID0gZmFsc2U7XG4gICAgZ3JpZEl0ZW1zLmZvckVhY2goKGdyaWRJdGVtKSA9PiB7XG4gICAgICBpZiAoZ3JpZEl0ZW0uZGF0YXNldC5jb29yZGluYXRlcyA9PT0gY29vcmQudG9TdHJpbmcoKSkge1xuICAgICAgICBmb3VuZEl0ZW0gPSBncmlkSXRlbTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZm91bmRJdGVtO1xuICB9XG5cbiAgI2dhbWVPdmVyKCkge1xuICAgIC8vIEFJIHdpbnMgaWYgaHVtYW4gYm9hcmQgaXMgZ2FtZSBvdmVyLlxuICAgIGlmICh0aGlzLmh1bWFuLmJvYXJkLmdhbWVPdmVyKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmFpO1xuICAgIC8vIEh1bWFuIHdpbnMgaWYgYWkgYm9hcmQgaXMgZ2FtZSBvdmVyLlxuICAgIH0gZWxzZSBpZiAodGhpcy5haS5ib2FyZC5nYW1lT3ZlcigpKSB7XG4gICAgICByZXR1cm4gdGhpcy5odW1hbjtcbiAgICAvLyBFbHNlIGdhbWUgY29udGludWVzLlxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgR2FtZWJvYXJkIGZyb20gXCIuL2dhbWVib2FyZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihodW1hbj10cnVlKSB7XG4gICAgdGhpcy5ib2FyZCA9IG5ldyBHYW1lYm9hcmQ7XG4gICAgdGhpcy5pc0h1bWFuID0gaHVtYW47XG4gICAgdGhpcy5wcmV2aW91c1BsYXlzID0gW107XG4gIH07XG5cbiAgYXR0YWNrKHBsYXllciwgY29vcmRpbmF0ZSkge1xuICAgIGlmICghdGhpcy5pc0h1bWFuKSB7XG4gICAgICBjb29yZGluYXRlID0gdGhpcy4jYWlBdHRhY2socGxheWVyLmJvYXJkKTtcbiAgICB9XG5cbiAgICB0aGlzLnByZXZpb3VzUGxheXMucHVzaChjb29yZGluYXRlKTtcbiAgICBwbGF5ZXIuYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZGluYXRlKTtcbiAgfVxuXG4gICNhaUF0dGFjayhib2FyZCkge1xuICAgIGxldCBjb29yZGluYXRlID0gdGhpcy4jcmFuZG9tQ29vcmQoKTtcbiAgICBpZiAodGhpcy5wcmV2aW91c1BsYXlzLmluY2x1ZGVzKGNvb3JkaW5hdGUpKSB7XG4gICAgICB0aGlzLiNhaUF0dGFjayhib2FyZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjb29yZGluYXRlO1xuICAgIH1cbiAgfVxuXG4gIC8vIEdlbmVyYXRlIHJhbmRvbSBjb29yZGluYXRlcyBiZXR3ZWVuIDAgLSA5LlxuICAjcmFuZG9tQ29vcmQoKSB7XG4gICAgcmV0dXJuIFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCksIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKV07XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoaXAge1xuICBjb25zdHJ1Y3RvcihzaXplKSB7XG4gICAgY29uc3Qgc2hpcFR5cGVzID0gezUgOiAnQ2FycmllcicsIDQgOiAnQmF0dGxlc2hpcCcsIDMgOiAnRGVzdHJveWVyJywgMyA6ICdTdWJtYXJpbmUnLCAyIDogJ1BhdHJvbCBCb2F0J31cbiAgICB0aGlzLmxlbmd0aCA9IHNpemU7XG4gICAgdGhpcy5zaGlwVHlwZSA9IHNoaXBUeXBlc1tzaXplXTtcbiAgICB0aGlzLmhpdHMgPSAwO1xuICAgIHRoaXMuc3VuayA9IGZhbHNlO1xuICB9XG5cbiAgaGl0KCkge1xuICAgIHRoaXMuaGl0cysrO1xuICAgIHRoaXMuaXNTdW5rKCk7XG4gIH1cblxuICBpc1N1bmsoKSB7XG4gICAgaWYgKHRoaXMuaGl0cyA9PT0gdGhpcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc3VuayA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN1bms7XG4gIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEdhbWVsb29wIGZyb20gXCIuL2dhbWVsb29wXCI7XG5cbmNvbnN0IGdhbWUgPSBuZXcgR2FtZWxvb3AoKTtcbmdhbWUuc3RhcnQoKTtcbiJdLCJuYW1lcyI6WyJET01idWlsZGVyIiwiY29uc3RydWN0b3IiLCJzaGlwcyIsInNoaXBOYW1lcyIsInNoaXBTaXplcyIsImdhbWVDb250YWluZXIiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwicGxheWVyQ29udGFpbmVyIiwiY3JlYXRlRWxlbWVudCIsImFpQ29udGFpbmVyIiwiZ2xvYmFsTXNnIiwiaWQiLCJjbGFzc0xpc3QiLCJhZGQiLCJwbGF5ZXJUaXRsZSIsInRleHRDb250ZW50IiwiYWlUaXRsZSIsInBsYXllckdyaWQiLCJncmlkUG9wdWxhdGUiLCJhaUdyaWQiLCJwbGF5ZXJNc2ciLCJjcmVhdGVUZXh0Tm9kZSIsInVwZGF0ZVBsYXllck1zZyIsIm9yaWVudGF0aW9uQnRuIiwiYXBwZW5kIiwiaGl0IiwiZ3JpZEl0ZW0iLCJyZW1vdmUiLCJtaXNzIiwic2hpcCIsImhpZGVFbGVtZW50IiwiZWxlbWVudCIsInN0eWxlIiwiZGlzcGxheSIsImNvdW50ZXIiLCJlcnJvciIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsIm1zZyIsInNldFRpbWVvdXQiLCJjbGVhck1zZyIsImRpc3BsYXlTdW5rTWVzc2FnZSIsInN1bmtNc2ciLCJzaGlwVHlwZSIsImFwcGVuZENoaWxkIiwiZGlzcGxheVdpbm5lciIsIndpbm5lciIsIndpbm5lck1zZyIsIiNjbGVhck1zZyIsIm1zZ0VsZW1lbnQiLCIjZ3JpZFBvcHVsYXRlIiwicGxheWVyIiwiZ3JpZCIsImkiLCJkYXRhc2V0IiwiY29vcmRpbmF0ZXMiLCJjb29yZHNQb3B1bGF0ZSIsIiNjb29yZHNQb3B1bGF0ZSIsImRpZ2l0cyIsInRvU3RyaW5nIiwic3BsaXQiLCJTaGlwIiwiR2FtZWJvYXJkIiwiYWxsU2hpcHMiLCJtaXNzZWRTaG90cyIsImhpdFNob3RzIiwiYWxsU2hvdHMiLCJwbGFjZVNoaXAiLCJzaXplIiwiZmlyc3RDb29yZCIsIm9yaWVudGF0aW9uIiwiYnVpbGRDb29yZGluYXRlcyIsInZhbGlkYXRlQ29vcmRpbmF0ZXMiLCJuZXdTaGlwIiwic2hpcEVudHJ5IiwicHVzaCIsInJlY2VpdmVBdHRhY2siLCJjb29yZGluYXRlIiwiZmluZFNoaXAiLCJnYW1lT3ZlciIsImFsbFN1bmsiLCJmb3JFYWNoIiwiaXNTdW5rIiwiI2J1aWxkQ29vcmRpbmF0ZXMiLCIjdmFsaWRhdGVDb29yZGluYXRlcyIsInZhbGlkQ29vcmRzIiwiY29vcmQiLCIjZmluZFNoaXAiLCJmb3VuZFNoaXAiLCJzb21lIiwieCIsIlBsYXllciIsIkdhbWVsb29wIiwiaHVtYW4iLCJhaSIsInBsYXllcnMiLCJjdXJyZW50UGxheWVyIiwicm91bmQiLCJwYWdlIiwic3RhcnQiLCJhaVNoaXBzIiwiYWlHcmlkTGlzdGVuZXJzIiwiaHVtYW5HcmlkTGlzdGVuZXJzIiwiY3VycmVudFJvdW5kIiwicGxheVJvdW5kIiwiYWlBdHRhY2siLCJlbmRHYW1lIiwiI2VuZEdhbWUiLCJhaUdyaWRJdGVtcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJodW1hbkdyaWRJdGVtcyIsIml0ZW0iLCJjb29yZHMiLCJtYXAiLCJwYXJzZUludCIsImFpQm9hcmRBdHRhY2siLCJjb250YWlucyIsIm9yaWVudGF0aW9uQnRuTGlzdGVuZXIiLCJncmlkSXRlbXMiLCJwbGFjZW1lbnRDb3VudGVyIiwic2hpcFNpemUiLCJhZGRFdmVudExpc3RlbmVyIiwiYm9hcmQiLCJmaW5kR3JpZEl0ZW0iLCIjb3JpZW50YXRpb25CdG5MaXN0ZW5lciIsInRleHQiLCIjYWlCb2FyZEF0dGFjayIsImF0dGFja2VkU2hpcCIsIiNhaVNoaXBzIiwiYWlTaGlwUGxhY2VtZW50IiwiI2FpU2hpcFBsYWNlbWVudCIsInJhbmRvbU51bSIsIiNhaUF0dGFjayIsImFpQ29vcmRTZWxlY3RvciIsIiNhaUNvb3JkU2VsZWN0b3IiLCJwcmV2aW91c0Nvb3JkIiwiYWNjdW11bGF0b3IiLCJoaXRDb29yZCIsImF0IiwibGFzdFNob3QiLCJzaG90IiwiI3JhbmRvbU51bSIsIm1heCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIiNmaW5kR3JpZEl0ZW0iLCJmb3VuZEl0ZW0iLCIjZ2FtZU92ZXIiLCJpc0h1bWFuIiwicHJldmlvdXNQbGF5cyIsImF0dGFjayIsInJhbmRvbUNvb3JkIiwiaW5jbHVkZXMiLCIjcmFuZG9tQ29vcmQiLCJzaGlwVHlwZXMiLCJoaXRzIiwic3VuayIsImdhbWUiXSwic291cmNlUm9vdCI6IiJ9