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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SUFBSSxDQUFDekgsTUFBTSxHQUFHaUMsSUFBSTtJQUNsQixJQUFJLENBQUN4QixRQUFRLEdBQUdnSCxTQUFTLENBQUN4RixJQUFJLENBQUM7SUFDL0IsSUFBSSxDQUFDeUYsSUFBSSxHQUFHLENBQUM7SUFDYixJQUFJLENBQUNDLElBQUksR0FBRyxLQUFLO0VBQ25CO0VBRUF2SSxHQUFHQSxDQUFBLEVBQUc7SUFDSixJQUFJLENBQUNzSSxJQUFJLEVBQUU7SUFDWCxJQUFJLENBQUMxRSxNQUFNLENBQUMsQ0FBQztFQUNmO0VBRUFBLE1BQU1BLENBQUEsRUFBRztJQUNQLElBQUksSUFBSSxDQUFDMEUsSUFBSSxLQUFLLElBQUksQ0FBQzFILE1BQU0sRUFBRTtNQUM3QixJQUFJLENBQUMySCxJQUFJLEdBQUcsSUFBSTtJQUNsQjtJQUNBLE9BQU8sSUFBSSxDQUFDQSxJQUFJO0VBQ2xCO0FBQ0Y7Ozs7OztVQ3BCQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTmtDO0FBRWxDLE1BQU1DLElBQUksR0FBRyxJQUFJbEUsaURBQVEsQ0FBQyxDQUFDO0FBQzNCa0UsSUFBSSxDQUFDM0QsS0FBSyxDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZG9tQnVpbGRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVsb29wLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcGxheWVycy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NjcmlwdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBET01idWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY29uc3Qgc2hpcHMgPSB7J0NhcnJpZXInOiA1LCAnQmF0dGxlc2hpcCc6IDQsICdEZXN0cm95ZXInOiAzLCAnU3VibWFyaW5lJzogMywgJ1BhdHJvbCBCb2F0JzogMn1cbiAgICB0aGlzLnNoaXBOYW1lcyA9IFsnQ2FycmllcicsICdCYXR0bGVzaGlwJywgJ0Rlc3Ryb3llcicsICdTdWJtYXJpbmUnLCAnUGF0cm9sIEJvYXQnXTtcbiAgICB0aGlzLnNoaXBTaXplcyA9IFs1LCA0LCAzLCAzLCAyXTtcblxuICAgIHRoaXMuZ2FtZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLWNvbnRhaW5lcicpO1xuICAgIC8vIGNyZWF0ZSBjb250YWluZXJzIGZvciBlbGVtZW50czpcbiAgICAgIC8vIDIgcGxheWVyIGNvbnRhaW5lcnNcbiAgICB0aGlzLnBsYXllckNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuYWlDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmdsb2JhbE1zZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuZ2xvYmFsTXNnLmlkID0gJ2dsb2JhbC1tc2cnO1xuICAgIHRoaXMucGxheWVyQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3BsYXllci1jb250YWluZXInKTtcbiAgICB0aGlzLmFpQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3BsYXllci1jb250YWluZXInKTtcbiAgICAgIC8vIGVhY2ggY29udGFpbmVyIGNvbnRhaW5zOlxuICAgICAgICAvLyBQbGF5ZXIgdGl0bGVcbiAgICAgICAgY29uc3QgcGxheWVyVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpXG4gICAgICAgIHBsYXllclRpdGxlLnRleHRDb250ZW50ID0gJ1BsYXllcic7XG5cbiAgICAgICAgY29uc3QgYWlUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG4gICAgICAgIGFpVGl0bGUudGV4dENvbnRlbnQgPSAnQ29tcHV0ZXInO1xuXG4gICAgICAgIC8vIEdhbWUgYm9hcmQgZ3JpZCAoMTAgeCAxMClcbiAgICAgICAgY29uc3QgcGxheWVyR3JpZCA9IHRoaXMuI2dyaWRQb3B1bGF0ZSgnaHVtYW4nKTtcbiAgICAgICAgY29uc3QgYWlHcmlkID0gdGhpcy4jZ3JpZFBvcHVsYXRlKCdhaScpO1xuXG4gICAgICAgIHRoaXMucGxheWVyTXNnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICB0aGlzLnBsYXllck1zZy5pZCA9ICdwbGF5ZXItbXNnJztcbiAgICAgICAgdGhpcy51cGRhdGVQbGF5ZXJNc2coMCk7XG5cbiAgICAgICAgY29uc3Qgb3JpZW50YXRpb25CdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgb3JpZW50YXRpb25CdG4udGV4dENvbnRlbnQgPSAnaG9yaXpvbnRhbCc7XG4gICAgICAgIG9yaWVudGF0aW9uQnRuLmlkID0gJ29yaWVudGF0aW9uLWJ0bic7XG5cbiAgICAgIHRoaXMucGxheWVyQ29udGFpbmVyLmFwcGVuZChwbGF5ZXJUaXRsZSwgcGxheWVyR3JpZCwgdGhpcy5wbGF5ZXJNc2csIG9yaWVudGF0aW9uQnRuKTtcbiAgICAgIHRoaXMuYWlDb250YWluZXIuYXBwZW5kKGFpVGl0bGUsIGFpR3JpZCk7XG5cbiAgICB0aGlzLmdhbWVDb250YWluZXIuYXBwZW5kKHRoaXMucGxheWVyQ29udGFpbmVyLCB0aGlzLmFpQ29udGFpbmVyLCB0aGlzLmdsb2JhbE1zZyk7XG4gIH1cblxuICBoaXQoZ3JpZEl0ZW0pIHtcbiAgICBncmlkSXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdzaGlwJyk7XG4gICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZCgnaGl0Jyk7XG4gIH07XG5cbiAgbWlzcyhncmlkSXRlbSkge1xuICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5hZGQoJ21pc3MnKTtcbiAgfVxuXG4gIHNoaXAoZ3JpZEl0ZW0pIHtcbiAgICBncmlkSXRlbS5jbGFzc0xpc3QuYWRkKCdzaGlwJyk7XG4gIH07XG5cbiAgaGlkZUVsZW1lbnQoZWxlbWVudCkge1xuICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfVxuXG4gIHVwZGF0ZVBsYXllck1zZyhjb3VudGVyLCBlcnJvcj1udWxsKSB7XG4gICAgbGV0IG1zZyA9IHRoaXMucGxheWVyTXNnO1xuICAgIGlmIChlcnJvcikge1xuICAgICAgbXNnLnRleHRDb250ZW50ID0gJ0ludmFsaWQgcGxhY2VtZW50IGxvY2F0aW9uJztcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZVBsYXllck1zZyhjb3VudGVyKTtcbiAgICAgIH0sIDEwMDApXG4gICAgfSBlbHNlIGlmIChjb3VudGVyIDwgNSkge1xuICAgICAgbXNnLnRleHRDb250ZW50ID0gYENsaWNrIGdyaWQgdG8gcGxhY2UgJHt0aGlzLnNoaXBOYW1lc1tjb3VudGVyXX0gKHNpemU6ICR7dGhpcy5zaGlwU2l6ZXNbY291bnRlcl19KWBcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLiNjbGVhck1zZyhtc2cpO1xuICAgIH1cbiAgfVxuXG4gIGRpc3BsYXlTdW5rTWVzc2FnZShzaGlwLCBwbGF5ZXIpIHtcbiAgICBjb25zdCBzdW5rTXNnID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYCR7cGxheWVyfSAke3NoaXAuc2hpcFR5cGV9IGhhcyBiZWVuIHN1bmsuYClcbiAgICB0aGlzLmdsb2JhbE1zZy5hcHBlbmRDaGlsZChzdW5rTXNnKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuI2NsZWFyTXNnKHN1bmtNc2cpO1xuICAgIH0sIDMwMDApO1xuICB9XG5cbiAgZGlzcGxheVdpbm5lcih3aW5uZXIpIHtcbiAgICBjb25zdCB3aW5uZXJNc2cgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShgV2lubmVyOiAke3dpbm5lcn0hYCk7XG4gICAgdGhpcy5nbG9iYWxNc2cuYXBwZW5kQ2hpbGQod2lubmVyTXNnKTtcbiAgfVxuXG4gICNjbGVhck1zZyhtc2dFbGVtZW50KSB7XG4gICAgbXNnRWxlbWVudC5yZW1vdmUoKTtcbiAgfVxuXG4gICNncmlkUG9wdWxhdGUocGxheWVyKSB7XG4gICAgY29uc3QgZ3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGdyaWQuY2xhc3NMaXN0LmFkZCgnZ3JpZCcsIHBsYXllcik7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDsgaSsrKSB7XG4gICAgICBjb25zdCBncmlkSXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZCgnZ3JpZC1pdGVtJywgcGxheWVyKTtcbiAgICAgIGdyaWRJdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXMgPSB0aGlzLiNjb29yZHNQb3B1bGF0ZShpKTtcbiAgICAgIGdyaWQuYXBwZW5kQ2hpbGQoZ3JpZEl0ZW0pO1xuICAgIH1cbiAgICByZXR1cm4gZ3JpZDtcbiAgfVxuXG4gICNjb29yZHNQb3B1bGF0ZShpKSB7XG4gICAgaWYgKGkgPCAxMCkge1xuICAgICAgcmV0dXJuIFtpLCAwXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGRpZ2l0cyA9IGkudG9TdHJpbmcoKS5zcGxpdCgnJyk7XG4gICAgICByZXR1cm4gW2RpZ2l0c1sxXSwgZGlnaXRzWzBdXTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBTaGlwIGZyb20gJy4vc2hpcHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lYm9hcmQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFsbFNoaXBzID0gW107XG4gICAgdGhpcy5taXNzZWRTaG90cyA9IFtdO1xuICAgIHRoaXMuaGl0U2hvdHMgPSBbXTtcbiAgICB0aGlzLmFsbFNob3RzID0gW107XG4gIH07XG5cbiAgcGxhY2VTaGlwKHNpemUsIGZpcnN0Q29vcmQsIG9yaWVudGF0aW9uPSdob3Jpem9udGFsJykge1xuICAgIG9yaWVudGF0aW9uID0gb3JpZW50YXRpb24udG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IHRoaXMuI2J1aWxkQ29vcmRpbmF0ZXMoc2l6ZSwgZmlyc3RDb29yZCwgb3JpZW50YXRpb24pO1xuICAgIGlmICh0aGlzLiN2YWxpZGF0ZUNvb3JkaW5hdGVzKGNvb3JkaW5hdGVzKSkge1xuICAgICAgY29uc3QgbmV3U2hpcCA9IG5ldyBTaGlwKHNpemUpO1xuICAgICAgY29uc3Qgc2hpcEVudHJ5ID0gW25ld1NoaXAsIGNvb3JkaW5hdGVzXTtcbiAgICAgIHRoaXMuYWxsU2hpcHMucHVzaChzaGlwRW50cnkpO1xuICAgICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLy8gcmVjZWl2ZUF0dGFjayBmdW5jdGlvbiB0YWtlcyBjb29yZGluYXRlcywgZGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCB0aGUgYXR0YWNrIGhpdCBhIHNoaXBcbiAgLy8gdGhlbiBzZW5kcyB0aGUg4oCYaGl04oCZIGZ1bmN0aW9uIHRvIHRoZSBjb3JyZWN0IHNoaXAsIG9yIHJlY29yZHMgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBtaXNzZWQgc2hvdC5cbiAgcmVjZWl2ZUF0dGFjayhjb29yZGluYXRlKSB7XG4gICAgdGhpcy5hbGxTaG90cy5wdXNoKGNvb3JkaW5hdGUpO1xuICAgIGNvbnN0IHNoaXAgPSB0aGlzLiNmaW5kU2hpcChjb29yZGluYXRlKTtcbiAgICBpZiAoc2hpcCkge1xuICAgICAgc2hpcC5oaXQoKTtcbiAgICAgIHRoaXMuaGl0U2hvdHMucHVzaChjb29yZGluYXRlKTtcbiAgICAgIHJldHVybiBzaGlwO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1pc3NlZFNob3RzLnB1c2goY29vcmRpbmF0ZSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZ2FtZU92ZXIoKSB7XG4gICAgbGV0IGFsbFN1bmsgPSB0cnVlO1xuICAgIC8vIElmIHNoaXBzIGhhdmVuJ3QgeWV0IGJlZW4gcGxhY2VkLCByZXR1cm4gZmFsc2UuXG4gICAgaWYgKHRoaXMuYWxsU2hpcHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuYWxsU2hpcHMuZm9yRWFjaChzaGlwID0+IHtcbiAgICAgIGlmICghc2hpcFswXS5pc1N1bmsoKSkge1xuICAgICAgICBhbGxTdW5rID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gYWxsU3VuaztcbiAgfVxuXG4gICNidWlsZENvb3JkaW5hdGVzKHNpemUsIGZpcnN0Q29vcmQsIG9yaWVudGF0aW9uKSB7XG4gICAgbGV0IGNvb3JkaW5hdGVzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgIGNvb3JkaW5hdGVzLnB1c2goW2ZpcnN0Q29vcmRbMF0gKyBpLCBmaXJzdENvb3JkWzFdXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb29yZGluYXRlcy5wdXNoKFtmaXJzdENvb3JkWzBdLCBmaXJzdENvb3JkWzFdICsgaV0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gIH1cblxuICAjdmFsaWRhdGVDb29yZGluYXRlcyhjb29yZGluYXRlcykge1xuICAgIGxldCB2YWxpZENvb3JkcyA9IHRydWU7XG4gICAgY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmQpID0+IHtcbiAgICAgIC8vIElmIGEgc2hpcCBhbHJlYWR5IGV4aXN0cyBhdCBsb2NhdGlvbiwgcmVqZWN0IGl0LlxuICAgICAgaWYgKHRoaXMuI2ZpbmRTaGlwKGNvb3JkKSB8fCBjb29yZFswXSA+IDkgfHwgY29vcmRbMV0gPiA5KSB7XG4gICAgICAgIHZhbGlkQ29vcmRzID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gdmFsaWRDb29yZHM7XG4gIH1cblxuICAjZmluZFNoaXAoY29vcmRpbmF0ZSkge1xuICAgIGxldCBmb3VuZFNoaXAgPSBmYWxzZTtcbiAgICB0aGlzLmFsbFNoaXBzLmZvckVhY2goc2hpcCA9PiB7XG4gICAgICBpZiAoc2hpcFsxXS5zb21lKCh4KSA9PiB4WzBdID09PSBjb29yZGluYXRlWzBdICYmIHhbMV0gPT09IGNvb3JkaW5hdGVbMV0pKSB7XG4gICAgICAgIGZvdW5kU2hpcCA9IHNoaXBbMF07XG4gICAgfX0pXG4gICAgcmV0dXJuIGZvdW5kU2hpcDtcbiAgfVxufVxuIiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi9wbGF5ZXJzXCI7XG5pbXBvcnQgRE9NYnVpbGRlciBmcm9tIFwiLi9kb21CdWlsZGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVsb29wIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5odW1hbiA9IG5ldyBQbGF5ZXIodHJ1ZSk7XG4gICAgdGhpcy5haSA9IG5ldyBQbGF5ZXIoZmFsc2UpO1xuICAgIHRoaXMucGxheWVycyA9IFt0aGlzLmh1bWFuLCB0aGlzLmFpXTtcbiAgICB0aGlzLmN1cnJlbnRQbGF5ZXIgPSB0aGlzLmFpO1xuICAgIHRoaXMucm91bmQgPSBudWxsO1xuICAgIHRoaXMucGFnZSA9IG5ldyBET01idWlsZGVyKCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLiNhaVNoaXBzKCk7XG4gICAgdGhpcy5haUdyaWRMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLmh1bWFuR3JpZExpc3RlbmVycygpO1xuXG4gICAgbGV0IGN1cnJlbnRSb3VuZCA9IHRoaXMucm91bmQ7XG5cbiAgICBjb25zdCBwbGF5Um91bmQgPSAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuI2dhbWVPdmVyKCkpIHtcbiAgICAgICAgdGhpcy4jYWlBdHRhY2soKTtcbiAgICAgICAgaWYgKGN1cnJlbnRSb3VuZCAhPT0gdGhpcy5yb3VuZCkge1xuICAgICAgICAgIHRoaXMuY3VycmVudFBsYXllciA9IHRoaXMuY3VycmVudFBsYXllciA9PT0gdGhpcy5odW1hbiA/IHRoaXMuYWkgOiB0aGlzLmh1bWFuO1xuICAgICAgICAgIGN1cnJlbnRSb3VuZCA9IHRoaXMucm91bmQ7XG4gICAgICAgIH1cbiAgICAgICAgc2V0VGltZW91dChwbGF5Um91bmQsIDApOyAvLyBTY2hlZHVsZSB0aGUgbmV4dCByb3VuZCBhZnRlciBhIHZlcnkgc2hvcnQgZGVsYXlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuI2VuZEdhbWUoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGxheVJvdW5kKCk7XG4gIH1cblxuICAjZW5kR2FtZSgpIHtcbiAgICBjb25zdCB3aW5uZXIgPSB0aGlzLiNnYW1lT3ZlcigpID09PSB0aGlzLmh1bWFuID8gJ1lvdScgOiAnQ29tcHV0ZXInO1xuICAgIGNvbnN0IGFpR3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ncmlkLWl0ZW0uYWlcIik7XG4gICAgY29uc3QgaHVtYW5HcmlkSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdyaWQtaXRlbS5odW1hblwiKTtcbiAgICAvLyBkaXNwbGF5IHRoZSB3aW5uZXJcbiAgICB0aGlzLnBhZ2UuZGlzcGxheVdpbm5lcih3aW5uZXIpO1xuICAgIC8vIHJldmVhbCBhbGwgYm9hcmRzXG4gICAgYWlHcmlkSXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGxldCBjb29yZHMgPSBpdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXNcbiAgICAgIC5zcGxpdChcIixcIilcbiAgICAgIC5tYXAoKHgpID0+IHBhcnNlSW50KHgsIDEwKSk7XG4gICAgICB0aGlzLiNhaUJvYXJkQXR0YWNrKGNvb3JkcywgaXRlbSk7XG4gICAgfSlcbiAgICBodW1hbkdyaWRJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKCFpdGVtLmNsYXNzTGlzdC5jb250YWlucyhcInNoaXBcIikgJiYgIWl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0XCIpKSB7XG4gICAgICAgIHRoaXMucGFnZS5taXNzKGl0ZW0pO1xuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBodW1hbkdyaWRMaXN0ZW5lcnMoKSB7XG4gICAgdGhpcy4jb3JpZW50YXRpb25CdG5MaXN0ZW5lcigpO1xuICAgIGNvbnN0IG9yaWVudGF0aW9uQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmllbnRhdGlvbi1idG5cIik7XG4gICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ncmlkLWl0ZW0uaHVtYW5cIik7XG4gICAgbGV0IHBsYWNlbWVudENvdW50ZXIgPSAwO1xuICAgIGxldCBzaGlwU2l6ZSA9IFs1LCA0LCAzLCAzLCAyXTtcblxuICAgIGdyaWRJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGlmIChwbGFjZW1lbnRDb3VudGVyID49IHNoaXBTaXplLmxlbmd0aCAtIDEgJiYgIXRoaXMucm91bmQpIHtcbiAgICAgICAgICB0aGlzLnBhZ2UuaGlkZUVsZW1lbnQob3JpZW50YXRpb25CdG4pO1xuICAgICAgICAgIHRoaXMucm91bmQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9yaWVudGF0aW9uID0gb3JpZW50YXRpb25CdG4udGV4dENvbnRlbnQ7XG4gICAgICAgIGxldCBjb29yZHMgPSBpdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXNcbiAgICAgICAgICAuc3BsaXQoXCIsXCIpXG4gICAgICAgICAgLm1hcCgoeCkgPT4gcGFyc2VJbnQoeCwgMTApKTtcbiAgICAgICAgbGV0IGNvb3JkaW5hdGVzID0gdGhpcy5odW1hbi5ib2FyZC5wbGFjZVNoaXAoXG4gICAgICAgICAgc2hpcFNpemVbcGxhY2VtZW50Q291bnRlcl0sXG4gICAgICAgICAgY29vcmRzLFxuICAgICAgICAgIG9yaWVudGF0aW9uXG4gICAgICAgICk7XG4gICAgICAgIC8vIFNob3cgc2hpcCBvbiBzY3JlZW4sIGlmIHZhbGlkIHBsYWNlbWVudC5cbiAgICAgICAgaWYgKGNvb3JkaW5hdGVzKSB7XG4gICAgICAgICAgY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmQpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGFnZS5zaGlwKHRoaXMuI2ZpbmRHcmlkSXRlbShjb29yZCwgXCJodW1hblwiKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcGxhY2VtZW50Q291bnRlcisrO1xuICAgICAgICAgIHRoaXMucGFnZS51cGRhdGVQbGF5ZXJNc2cocGxhY2VtZW50Q291bnRlcik7XG4gICAgICAgIC8vIERpc3BsYXkgZXJyb3IgbWVzc2FnZSBpZiBwbGFjZW1lbnQgZ29lcyBvZmYgYm9hcmQgb3IgY29uZmxpY3RzIHdpdGggZXhpc3Rpbmcgc2hpcC5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucGFnZS51cGRhdGVQbGF5ZXJNc2cocGxhY2VtZW50Q291bnRlciwgXCJlcnJvclwiKTtcbiAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgI29yaWVudGF0aW9uQnRuTGlzdGVuZXIoKSB7XG4gICAgY29uc3Qgb3JpZW50YXRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yaWVudGF0aW9uLWJ0blwiKTtcbiAgICBvcmllbnRhdGlvbi5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXG4gICAgb3JpZW50YXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGxldCB0ZXh0ID0gb3JpZW50YXRpb24udGV4dENvbnRlbnQ7XG4gICAgICBvcmllbnRhdGlvbi50ZXh0Q29udGVudCA9XG4gICAgICAgIHRleHQgPT09IFwiaG9yaXpvbnRhbFwiID8gXCJ2ZXJ0aWNhbFwiIDogXCJob3Jpem9udGFsXCI7XG4gICAgfSk7XG4gIH1cblxuICBhaUdyaWRMaXN0ZW5lcnMoKSB7XG4gICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ncmlkLWl0ZW0uYWlcIik7XG4gICAgZ3JpZEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBsYXllciA9PT0gdGhpcy5odW1hbikge1xuICAgICAgICAgIGxldCBjb29yZHMgPSBpdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXNcbiAgICAgICAgICAgIC5zcGxpdChcIixcIilcbiAgICAgICAgICAgIC5tYXAoKHgpID0+IHBhcnNlSW50KHgsIDEwKSk7XG4gICAgICAgICAgdGhpcy4jYWlCb2FyZEF0dGFjayhjb29yZHMsIGl0ZW0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gICNhaUJvYXJkQXR0YWNrKGNvb3JkcywgZ3JpZEl0ZW0pIHtcbiAgICBsZXQgYXR0YWNrZWRTaGlwID0gdGhpcy5haS5ib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkcylcbiAgICBpZiAoYXR0YWNrZWRTaGlwKSB7XG4gICAgICAvLyBpZiBhIHNoaXAgaXMgaGl0LCBtYXJrIHNxdWFyZSBhcyByZWQuXG4gICAgICB0aGlzLnBhZ2UuaGl0KGdyaWRJdGVtKTtcbiAgICAgIHRoaXMucm91bmQrKztcbiAgICAgIC8vIGlmIHNoaXAgaXMgc3VuaywgZGlzcGxheSBnbG9iYWwgbWVzc2FnZS5cbiAgICAgIGlmIChhdHRhY2tlZFNoaXAuaXNTdW5rKCkgJiYgIXRoaXMuI2dhbWVPdmVyKCkpIHtcbiAgICAgICAgdGhpcy5wYWdlLmRpc3BsYXlTdW5rTWVzc2FnZShhdHRhY2tlZFNoaXAsIFwiQ29tcHV0ZXInc1wiKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaWYgYSBzaGlwIGlzIG5vdCBoaXQsIG1hcmsgc3F1YXJlIGFzIGJsdWUuXG4gICAgICB0aGlzLnBhZ2UubWlzcyhncmlkSXRlbSk7XG4gICAgICB0aGlzLnJvdW5kKys7XG4gICAgfVxuICB9XG5cbiAgI2FpU2hpcHMoKSB7XG4gICAgY29uc3Qgc2hpcFNpemVzID0gWzUsIDQsIDMsIDMsIDJdO1xuICAgIHNoaXBTaXplcy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBsZXQgY29vcmRpbmF0ZXMgPSB0aGlzLiNhaVNoaXBQbGFjZW1lbnQoc2hpcCk7XG4gICAgICAvLyBSZXJ1biBwbGFjZW1lbnQgdW50aWwgdmFsaWQgcGxhY2VtZW50IGZvdW5kLlxuICAgICAgd2hpbGUgKCFjb29yZGluYXRlcykge1xuICAgICAgICBjb29yZGluYXRlcyA9IHRoaXMuI2FpU2hpcFBsYWNlbWVudChzaGlwKTtcbiAgICAgIH1cbiAgICAgIC8vIHNob3cgYWkgc2hpcHMgd2hpbGUgdGVzdGluZy5cbiAgICAgIC8vIGNvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkKSA9PiB7XG4gICAgICAvLyAgIHRoaXMucGFnZS5zaGlwKHRoaXMuI2ZpbmRHcmlkSXRlbShjb29yZCwgXCJhaVwiKSk7XG4gICAgICAvLyB9KTtcbiAgICB9KTtcbiAgfVxuXG4gICNhaVNoaXBQbGFjZW1lbnQoc2hpcCkge1xuICAgIGxldCBvcmllbnRhdGlvbiA9IHRoaXMuI3JhbmRvbU51bSgyKSA9PT0gMCA/IFwiaG9yaXpvbnRhbFwiIDogXCJ2ZXJ0aWNhbFwiO1xuICAgIGxldCBjb29yZCA9XG4gICAgICBvcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCJcbiAgICAgICAgPyBbdGhpcy4jcmFuZG9tTnVtKDEwIC0gc2hpcCksIHRoaXMuI3JhbmRvbU51bSgxMCldXG4gICAgICAgIDogW3RoaXMuI3JhbmRvbU51bSgxMCksIHRoaXMuI3JhbmRvbU51bSgxMCAtIHNoaXApXTtcbiAgICBsZXQgY29vcmRpbmF0ZXMgPSB0aGlzLmFpLmJvYXJkLnBsYWNlU2hpcChzaGlwLCBjb29yZCwgb3JpZW50YXRpb24pO1xuICAgIHJldHVybiBjb29yZGluYXRlcztcbiAgfVxuXG4gICNhaUF0dGFjaygpIHtcbiAgICBpZiAodGhpcy5jdXJyZW50UGxheWVyID09PSB0aGlzLmFpICYmIHRoaXMucm91bmQpIHtcbiAgICAgIGxldCBjb29yZCA9IHRoaXMuI2FpQ29vcmRTZWxlY3RvcigpO1xuICAgICAgbGV0IGdyaWRJdGVtID0gdGhpcy4jZmluZEdyaWRJdGVtKGNvb3JkLCAnaHVtYW4nKTtcbiAgICAgIGxldCBhdHRhY2tlZFNoaXAgPSB0aGlzLmh1bWFuLmJvYXJkLnJlY2VpdmVBdHRhY2soY29vcmQpXG4gICAgICBpZiAoYXR0YWNrZWRTaGlwKSB7XG4gICAgICAgIC8vIGlmIGEgc2hpcCBpcyBoaXQsIG1hcmsgc3F1YXJlIGFzIHJlZC5cbiAgICAgICAgdGhpcy5wYWdlLmhpdChncmlkSXRlbSk7XG4gICAgICAgIHRoaXMucm91bmQrKztcbiAgICAgICAgLy8gaWYgc2hpcCBpcyBzdW5rLCBkaXNwbGF5IGdsb2JhbCBtZXNzYWdlLlxuICAgICAgICBpZiAoYXR0YWNrZWRTaGlwLmlzU3VuaygpKSB7XG4gICAgICAgICAgdGhpcy5wYWdlLmRpc3BsYXlTdW5rTWVzc2FnZShhdHRhY2tlZFNoaXAsIFwiUGxheWVyJ3NcIik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGlmIGEgc2hpcCBpcyBub3QgaGl0LCBtYXJrIHNxdWFyZSBhcyBibHVlLlxuICAgICAgICB0aGlzLnBhZ2UubWlzcyhncmlkSXRlbSk7XG4gICAgICAgIHRoaXMucm91bmQrKztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAjYWlDb29yZFNlbGVjdG9yKHByZXZpb3VzQ29vcmQ9bnVsbCwgYWNjdW11bGF0b3I9MCkge1xuICAgIGNvbnN0IGh1bWFuID0gdGhpcy5odW1hbi5ib2FyZDtcbiAgICBsZXQgY29vcmQgPSBbXTtcbiAgICAvLyBpZiBhIHNoaXAgaGFzIGJlZW4gaGl0LCB1c2UgbW9zdCByZWNlbnQgaGl0IHRvIGRldGVybWluZSBuZXh0IHNob3QuXG4gICAgaWYgKGh1bWFuLmhpdFNob3RzLmxlbmd0aCA+IDAgJiYgYWNjdW11bGF0b3IgPCA0KSB7XG4gICAgICBjb25zdCBoaXRDb29yZCA9IGh1bWFuLmhpdFNob3RzLmF0KC0xKTtcbiAgICAgIGNvbnN0IGxhc3RTaG90ID0gcHJldmlvdXNDb29yZCA9PT0gbnVsbCA/IGh1bWFuLmFsbFNob3RzLmF0KC0xKSA6IHByZXZpb3VzQ29vcmQ7XG4gICAgICBpZiAobGFzdFNob3RbMF0gPT09IGhpdENvb3JkWzBdICYmIGxhc3RTaG90WzFdID09PSBoaXRDb29yZFsxXSkge1xuICAgICAgICBjb29yZCA9IFtoaXRDb29yZFswXSArIDEsIGhpdENvb3JkWzFdXTtcbiAgICAgIH0gZWxzZSBpZiAobGFzdFNob3RbMF0gPT09IGhpdENvb3JkWzBdICsgMSAmJiBsYXN0U2hvdFsxXSA9PT0gaGl0Q29vcmRbMV0pIHtcbiAgICAgICAgY29vcmQgPSBbaGl0Q29vcmRbMF0gLSAxLCBoaXRDb29yZFsxXV07XG4gICAgICB9IGVsc2UgaWYgKGxhc3RTaG90WzBdID09PSBoaXRDb29yZFswXSAtIDEgJiYgbGFzdFNob3RbMV0gPT09IGhpdENvb3JkWzFdKSB7XG4gICAgICAgIGNvb3JkID0gW2hpdENvb3JkWzBdLCBoaXRDb29yZFsxXSArIDFdO1xuICAgICAgfSBlbHNlIGlmIChsYXN0U2hvdFswXSA9PT0gaGl0Q29vcmRbMF0gJiYgbGFzdFNob3RbMV0gPT09IGhpdENvb3JkWzFdICsgMSkge1xuICAgICAgICBjb29yZCA9IFtoaXRDb29yZFswXSwgaGl0Q29vcmRbMV0gLSAxXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvb3JkID0gW3RoaXMuI3JhbmRvbU51bSgxMCksIHRoaXMuI3JhbmRvbU51bSgxMCldO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBpZiBubyBzaGlwIGhhcyBiZWVuIGhpdCwgdXNlIHJhbmRvbSBjb29yZC5cbiAgICAgIGNvb3JkID0gW3RoaXMuI3JhbmRvbU51bSgxMCksIHRoaXMuI3JhbmRvbU51bSgxMCldO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIGNvb3JkIGhhcyBhbHJlYWR5IGJlZW4gdXNlZCwgaWYgc28gcmVydW4gZnVuY3Rpb24uXG4gICAgaHVtYW4uYWxsU2hvdHMuZm9yRWFjaChzaG90ID0+IHtcbiAgICAgIGlmIChzaG90WzBdID09PSBjb29yZFswXSAmJiBzaG90WzFdID09PSBjb29yZFsxXSkge1xuICAgICAgICBjb29yZCA9IHRoaXMuI2FpQ29vcmRTZWxlY3Rvcihjb29yZCwgYWNjdW11bGF0b3IgKyAxKTtcbiAgICAgIH1cbiAgICB9KVxuICAgIC8vIENoZWNrIGlmIGNvb3JkIGlzIG9uIGJvYXJkLCBpZiBub3QgcmVydW4uXG4gICAgaWYgKGNvb3JkWzBdID4gOSB8fCBjb29yZFswXSA8IDAgfHwgY29vcmRbMV0gPiA5IHx8IGNvb3JkWzFdIDwgMCkge1xuICAgICAgY29vcmQgPSB0aGlzLiNhaUNvb3JkU2VsZWN0b3IoY29vcmQsIGFjY3VtdWxhdG9yICsgMSk7XG4gICAgfVxuICAgIHJldHVybiBjb29yZDtcbiAgfVxuXG4gICNyYW5kb21OdW0obWF4KSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1heCk7XG4gIH1cblxuICAjZmluZEdyaWRJdGVtKGNvb3JkLCBwbGF5ZXIpIHtcbiAgICBjb25zdCBncmlkSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuZ3JpZC1pdGVtLiR7cGxheWVyfWApO1xuICAgIGxldCBmb3VuZEl0ZW0gPSBmYWxzZTtcbiAgICBncmlkSXRlbXMuZm9yRWFjaCgoZ3JpZEl0ZW0pID0+IHtcbiAgICAgIGlmIChncmlkSXRlbS5kYXRhc2V0LmNvb3JkaW5hdGVzID09PSBjb29yZC50b1N0cmluZygpKSB7XG4gICAgICAgIGZvdW5kSXRlbSA9IGdyaWRJdGVtO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBmb3VuZEl0ZW07XG4gIH1cblxuICAjZ2FtZU92ZXIoKSB7XG4gICAgLy8gQUkgd2lucyBpZiBodW1hbiBib2FyZCBpcyBnYW1lIG92ZXIuXG4gICAgaWYgKHRoaXMuaHVtYW4uYm9hcmQuZ2FtZU92ZXIoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuYWk7XG4gICAgLy8gSHVtYW4gd2lucyBpZiBhaSBib2FyZCBpcyBnYW1lIG92ZXIuXG4gICAgfSBlbHNlIGlmICh0aGlzLmFpLmJvYXJkLmdhbWVPdmVyKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmh1bWFuO1xuICAgIC8vIEVsc2UgZ2FtZSBjb250aW51ZXMuXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBHYW1lYm9hcmQgZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKGh1bWFuPXRydWUpIHtcbiAgICB0aGlzLmJvYXJkID0gbmV3IEdhbWVib2FyZDtcbiAgICB0aGlzLmlzSHVtYW4gPSBodW1hbjtcbiAgICB0aGlzLnByZXZpb3VzUGxheXMgPSBbXTtcbiAgfTtcblxuICBhdHRhY2socGxheWVyLCBjb29yZGluYXRlKSB7XG4gICAgaWYgKCF0aGlzLmlzSHVtYW4pIHtcbiAgICAgIGNvb3JkaW5hdGUgPSB0aGlzLiNhaUF0dGFjayhwbGF5ZXIuYm9hcmQpO1xuICAgIH1cblxuICAgIHRoaXMucHJldmlvdXNQbGF5cy5wdXNoKGNvb3JkaW5hdGUpO1xuICAgIHBsYXllci5ib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGUpO1xuICB9XG5cbiAgI2FpQXR0YWNrKGJvYXJkKSB7XG4gICAgbGV0IGNvb3JkaW5hdGUgPSB0aGlzLiNyYW5kb21Db29yZCgpO1xuICAgIGlmICh0aGlzLnByZXZpb3VzUGxheXMuaW5jbHVkZXMoY29vcmRpbmF0ZSkpIHtcbiAgICAgIHRoaXMuI2FpQXR0YWNrKGJvYXJkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNvb3JkaW5hdGU7XG4gICAgfVxuICB9XG5cbiAgLy8gR2VuZXJhdGUgcmFuZG9tIGNvb3JkaW5hdGVzIGJldHdlZW4gMCAtIDkuXG4gICNyYW5kb21Db29yZCgpIHtcbiAgICByZXR1cm4gW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSwgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApXTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hpcCB7XG4gIGNvbnN0cnVjdG9yKHNpemUpIHtcbiAgICBjb25zdCBzaGlwVHlwZXMgPSB7NSA6ICdDYXJyaWVyJywgNCA6ICdCYXR0bGVzaGlwJywgMyA6ICdEZXN0cm95ZXInLCAzIDogJ1N1Ym1hcmluZScsIDIgOiAnUGF0cm9sIEJvYXQnfVxuICAgIHRoaXMubGVuZ3RoID0gc2l6ZTtcbiAgICB0aGlzLnNoaXBUeXBlID0gc2hpcFR5cGVzW3NpemVdO1xuICAgIHRoaXMuaGl0cyA9IDA7XG4gICAgdGhpcy5zdW5rID0gZmFsc2U7XG4gIH1cblxuICBoaXQoKSB7XG4gICAgdGhpcy5oaXRzKys7XG4gICAgdGhpcy5pc1N1bmsoKTtcbiAgfVxuXG4gIGlzU3VuaygpIHtcbiAgICBpZiAodGhpcy5oaXRzID09PSB0aGlzLmxlbmd0aCkge1xuICAgICAgdGhpcy5zdW5rID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3VuaztcbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgR2FtZWxvb3AgZnJvbSBcIi4vZ2FtZWxvb3BcIjtcblxuY29uc3QgZ2FtZSA9IG5ldyBHYW1lbG9vcCgpO1xuZ2FtZS5zdGFydCgpO1xuIl0sIm5hbWVzIjpbIkRPTWJ1aWxkZXIiLCJjb25zdHJ1Y3RvciIsInNoaXBzIiwic2hpcE5hbWVzIiwic2hpcFNpemVzIiwiZ2FtZUNvbnRhaW5lciIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJwbGF5ZXJDb250YWluZXIiLCJjcmVhdGVFbGVtZW50IiwiYWlDb250YWluZXIiLCJnbG9iYWxNc2ciLCJpZCIsImNsYXNzTGlzdCIsImFkZCIsInBsYXllclRpdGxlIiwidGV4dENvbnRlbnQiLCJhaVRpdGxlIiwicGxheWVyR3JpZCIsImdyaWRQb3B1bGF0ZSIsImFpR3JpZCIsInBsYXllck1zZyIsInVwZGF0ZVBsYXllck1zZyIsIm9yaWVudGF0aW9uQnRuIiwiYXBwZW5kIiwiaGl0IiwiZ3JpZEl0ZW0iLCJyZW1vdmUiLCJtaXNzIiwic2hpcCIsImhpZGVFbGVtZW50IiwiZWxlbWVudCIsInN0eWxlIiwiZGlzcGxheSIsImNvdW50ZXIiLCJlcnJvciIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsIm1zZyIsInNldFRpbWVvdXQiLCJjbGVhck1zZyIsImRpc3BsYXlTdW5rTWVzc2FnZSIsInBsYXllciIsInN1bmtNc2ciLCJjcmVhdGVUZXh0Tm9kZSIsInNoaXBUeXBlIiwiYXBwZW5kQ2hpbGQiLCJkaXNwbGF5V2lubmVyIiwid2lubmVyIiwid2lubmVyTXNnIiwiI2NsZWFyTXNnIiwibXNnRWxlbWVudCIsIiNncmlkUG9wdWxhdGUiLCJncmlkIiwiaSIsImRhdGFzZXQiLCJjb29yZGluYXRlcyIsImNvb3Jkc1BvcHVsYXRlIiwiI2Nvb3Jkc1BvcHVsYXRlIiwiZGlnaXRzIiwidG9TdHJpbmciLCJzcGxpdCIsIlNoaXAiLCJHYW1lYm9hcmQiLCJhbGxTaGlwcyIsIm1pc3NlZFNob3RzIiwiaGl0U2hvdHMiLCJhbGxTaG90cyIsInBsYWNlU2hpcCIsInNpemUiLCJmaXJzdENvb3JkIiwib3JpZW50YXRpb24iLCJ0b0xvd2VyQ2FzZSIsImJ1aWxkQ29vcmRpbmF0ZXMiLCJ2YWxpZGF0ZUNvb3JkaW5hdGVzIiwibmV3U2hpcCIsInNoaXBFbnRyeSIsInB1c2giLCJyZWNlaXZlQXR0YWNrIiwiY29vcmRpbmF0ZSIsImZpbmRTaGlwIiwiZ2FtZU92ZXIiLCJhbGxTdW5rIiwiZm9yRWFjaCIsImlzU3VuayIsIiNidWlsZENvb3JkaW5hdGVzIiwiI3ZhbGlkYXRlQ29vcmRpbmF0ZXMiLCJ2YWxpZENvb3JkcyIsImNvb3JkIiwiI2ZpbmRTaGlwIiwiZm91bmRTaGlwIiwic29tZSIsIngiLCJQbGF5ZXIiLCJHYW1lbG9vcCIsImh1bWFuIiwiYWkiLCJwbGF5ZXJzIiwiY3VycmVudFBsYXllciIsInJvdW5kIiwicGFnZSIsInN0YXJ0IiwiYWlTaGlwcyIsImFpR3JpZExpc3RlbmVycyIsImh1bWFuR3JpZExpc3RlbmVycyIsImN1cnJlbnRSb3VuZCIsInBsYXlSb3VuZCIsImFpQXR0YWNrIiwiZW5kR2FtZSIsIiNlbmRHYW1lIiwiYWlHcmlkSXRlbXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaHVtYW5HcmlkSXRlbXMiLCJpdGVtIiwiY29vcmRzIiwibWFwIiwicGFyc2VJbnQiLCJhaUJvYXJkQXR0YWNrIiwiY29udGFpbnMiLCJvcmllbnRhdGlvbkJ0bkxpc3RlbmVyIiwiZ3JpZEl0ZW1zIiwicGxhY2VtZW50Q291bnRlciIsInNoaXBTaXplIiwiYWRkRXZlbnRMaXN0ZW5lciIsImJvYXJkIiwiZmluZEdyaWRJdGVtIiwiI29yaWVudGF0aW9uQnRuTGlzdGVuZXIiLCJ0ZXh0IiwiI2FpQm9hcmRBdHRhY2siLCJhdHRhY2tlZFNoaXAiLCIjYWlTaGlwcyIsImFpU2hpcFBsYWNlbWVudCIsIiNhaVNoaXBQbGFjZW1lbnQiLCJyYW5kb21OdW0iLCIjYWlBdHRhY2siLCJhaUNvb3JkU2VsZWN0b3IiLCIjYWlDb29yZFNlbGVjdG9yIiwicHJldmlvdXNDb29yZCIsImFjY3VtdWxhdG9yIiwiaGl0Q29vcmQiLCJhdCIsImxhc3RTaG90Iiwic2hvdCIsIiNyYW5kb21OdW0iLCJtYXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCIjZmluZEdyaWRJdGVtIiwiZm91bmRJdGVtIiwiI2dhbWVPdmVyIiwiaXNIdW1hbiIsInByZXZpb3VzUGxheXMiLCJhdHRhY2siLCJyYW5kb21Db29yZCIsImluY2x1ZGVzIiwiI3JhbmRvbUNvb3JkIiwic2hpcFR5cGVzIiwiaGl0cyIsInN1bmsiLCJnYW1lIl0sInNvdXJjZVJvb3QiOiIifQ==