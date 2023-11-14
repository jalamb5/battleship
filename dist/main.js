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
    let coord = [this.#randomNum(10), this.#randomNum(10)];
    // Check if coord has already been used, if so rerun function.
    this.human.board.allShots.forEach(shot => {
      if (shot[0] === coord[0] && shot[1] === coord[1]) {
        return this.#aiCoordSelector();
      }
    });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QzdCLElBQUksQ0FBQ2lILElBQUksR0FBRyxJQUFJO0lBQ2xCO0lBQ0EsT0FBTyxJQUFJLENBQUNBLElBQUk7RUFDbEI7QUFDRjs7Ozs7O1VDcEJBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOa0M7QUFFbEMsTUFBTUMsSUFBSSxHQUFHLElBQUkzRCxpREFBUSxDQUFDLENBQUM7QUFDM0IyRCxJQUFJLENBQUNwRCxLQUFLLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9kb21CdWlsZGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWxvb3AuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXJzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2NyaXB0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIERPTWJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBjb25zdCBzaGlwcyA9IHsnQ2Fycmllcic6IDUsICdCYXR0bGVzaGlwJzogNCwgJ0Rlc3Ryb3llcic6IDMsICdTdWJtYXJpbmUnOiAzLCAnUGF0cm9sIEJvYXQnOiAyfVxuICAgIHRoaXMuc2hpcE5hbWVzID0gWydDYXJyaWVyJywgJ0JhdHRsZXNoaXAnLCAnRGVzdHJveWVyJywgJ1N1Ym1hcmluZScsICdQYXRyb2wgQm9hdCddO1xuICAgIHRoaXMuc2hpcFNpemVzID0gWzUsIDQsIDMsIDMsIDJdO1xuXG4gICAgdGhpcy5nYW1lQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtY29udGFpbmVyJyk7XG4gICAgLy8gY3JlYXRlIGNvbnRhaW5lcnMgZm9yIGVsZW1lbnRzOlxuICAgICAgLy8gMiBwbGF5ZXIgY29udGFpbmVyc1xuICAgIHRoaXMucGxheWVyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5haUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuZ2xvYmFsTXNnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5nbG9iYWxNc2cuaWQgPSAnZ2xvYmFsLW1zZyc7XG4gICAgdGhpcy5wbGF5ZXJDb250YWluZXIuY2xhc3NMaXN0LmFkZCgncGxheWVyLWNvbnRhaW5lcicpO1xuICAgIHRoaXMuYWlDb250YWluZXIuY2xhc3NMaXN0LmFkZCgncGxheWVyLWNvbnRhaW5lcicpO1xuICAgICAgLy8gZWFjaCBjb250YWluZXIgY29udGFpbnM6XG4gICAgICAgIC8vIFBsYXllciB0aXRsZVxuICAgICAgICBjb25zdCBwbGF5ZXJUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJylcbiAgICAgICAgcGxheWVyVGl0bGUudGV4dENvbnRlbnQgPSAnUGxheWVyJztcblxuICAgICAgICBjb25zdCBhaVRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbiAgICAgICAgYWlUaXRsZS50ZXh0Q29udGVudCA9ICdDb21wdXRlcic7XG5cbiAgICAgICAgLy8gR2FtZSBib2FyZCBncmlkICgxMCB4IDEwKVxuICAgICAgICBjb25zdCBwbGF5ZXJHcmlkID0gdGhpcy4jZ3JpZFBvcHVsYXRlKCdodW1hbicpO1xuICAgICAgICBjb25zdCBhaUdyaWQgPSB0aGlzLiNncmlkUG9wdWxhdGUoJ2FpJyk7XG5cbiAgICAgICAgdGhpcy5wbGF5ZXJNc2cgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgICAgIHRoaXMudXBkYXRlUGxheWVyTXNnKDApO1xuICAgICAgICB0aGlzLnBsYXllck1zZy5pZCA9ICdwbGF5ZXJNc2cnO1xuXG4gICAgICAgIGNvbnN0IG9yaWVudGF0aW9uQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgIG9yaWVudGF0aW9uQnRuLnRleHRDb250ZW50ID0gJ2hvcml6b250YWwnO1xuICAgICAgICBvcmllbnRhdGlvbkJ0bi5pZCA9ICdvcmllbnRhdGlvbkJ0bic7XG5cbiAgICAgIHRoaXMucGxheWVyQ29udGFpbmVyLmFwcGVuZChwbGF5ZXJUaXRsZSwgcGxheWVyR3JpZCwgdGhpcy5wbGF5ZXJNc2csIG9yaWVudGF0aW9uQnRuKTtcbiAgICAgIHRoaXMuYWlDb250YWluZXIuYXBwZW5kKGFpVGl0bGUsIGFpR3JpZCk7XG5cbiAgICB0aGlzLmdhbWVDb250YWluZXIuYXBwZW5kKHRoaXMucGxheWVyQ29udGFpbmVyLCB0aGlzLmFpQ29udGFpbmVyLCB0aGlzLmdsb2JhbE1zZyk7XG4gIH1cblxuICBoaXQoZ3JpZEl0ZW0pIHtcbiAgICBncmlkSXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdzaGlwJyk7XG4gICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZCgnaGl0Jyk7XG4gIH07XG5cbiAgbWlzcyhncmlkSXRlbSkge1xuICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5hZGQoJ21pc3MnKTtcbiAgfVxuXG4gIHNoaXAoZ3JpZEl0ZW0pIHtcbiAgICBncmlkSXRlbS5jbGFzc0xpc3QuYWRkKCdzaGlwJyk7XG4gIH07XG5cbiAgaGlkZUVsZW1lbnQoZWxlbWVudCkge1xuICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfVxuXG4gIHVwZGF0ZVBsYXllck1zZyhjb3VudGVyLCBlcnJvcj1udWxsKSB7XG4gICAgbGV0IG1zZyA9IHRoaXMucGxheWVyTXNnO1xuICAgIGlmIChlcnJvcikge1xuICAgICAgbXNnLnRleHRDb250ZW50ID0gJ0ludmFsaWQgcGxhY2VtZW50IGxvY2F0aW9uJztcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZVBsYXllck1zZyhjb3VudGVyKTtcbiAgICAgIH0sIDEwMDApXG4gICAgfSBlbHNlIGlmIChjb3VudGVyIDwgNSkge1xuICAgICAgbXNnLnRleHRDb250ZW50ID0gYENsaWNrIGdyaWQgdG8gcGxhY2UgJHt0aGlzLnNoaXBOYW1lc1tjb3VudGVyXX0gKHNpemU6ICR7dGhpcy5zaGlwU2l6ZXNbY291bnRlcl19KWBcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLiNjbGVhck1zZyhtc2cpO1xuICAgIH1cbiAgfVxuXG4gIGRpc3BsYXlTdW5rTWVzc2FnZShzaGlwKSB7XG4gICAgY29uc3Qgc3Vua01zZyA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGAke3NoaXAuc2hpcFR5cGV9IGhhcyBiZWVuIHN1bmsuYClcbiAgICB0aGlzLmdsb2JhbE1zZy5hcHBlbmRDaGlsZChzdW5rTXNnKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuI2NsZWFyTXNnKHN1bmtNc2cpO1xuICAgIH0sIDMwMDApO1xuICB9XG5cbiAgZGlzcGxheVdpbm5lcih3aW5uZXIpIHtcbiAgICBjb25zdCB3aW5uZXJNc2cgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShgV2lubmVyOiAke3dpbm5lcn0hYCk7XG4gICAgdGhpcy5nbG9iYWxNc2cuYXBwZW5kQ2hpbGQod2lubmVyTXNnKTtcbiAgfVxuXG4gICNjbGVhck1zZyhtc2dFbGVtZW50KSB7XG4gICAgbXNnRWxlbWVudC5yZW1vdmUoKTtcbiAgfVxuXG4gICNncmlkUG9wdWxhdGUocGxheWVyKSB7XG4gICAgY29uc3QgZ3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGdyaWQuY2xhc3NMaXN0LmFkZCgnZ3JpZCcsIHBsYXllcik7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDsgaSsrKSB7XG4gICAgICBjb25zdCBncmlkSXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZCgnZ3JpZC1pdGVtJywgcGxheWVyKTtcbiAgICAgIGdyaWRJdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXMgPSB0aGlzLiNjb29yZHNQb3B1bGF0ZShpKTtcbiAgICAgIGdyaWQuYXBwZW5kQ2hpbGQoZ3JpZEl0ZW0pO1xuICAgIH1cbiAgICByZXR1cm4gZ3JpZDtcbiAgfVxuXG4gICNjb29yZHNQb3B1bGF0ZShpKSB7XG4gICAgaWYgKGkgPCAxMCkge1xuICAgICAgcmV0dXJuIFtpLCAwXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGRpZ2l0cyA9IGkudG9TdHJpbmcoKS5zcGxpdCgnJyk7XG4gICAgICByZXR1cm4gW2RpZ2l0c1sxXSwgZGlnaXRzWzBdXTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBTaGlwIGZyb20gJy4vc2hpcHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lYm9hcmQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFsbFNoaXBzID0gW107XG4gICAgdGhpcy5taXNzZWRTaG90cyA9IFtdO1xuICAgIHRoaXMuYWxsU2hvdHMgPSBbXTtcbiAgfTtcblxuICBwbGFjZVNoaXAoc2l6ZSwgZmlyc3RDb29yZCwgb3JpZW50YXRpb249J2hvcml6b250YWwnKSB7XG4gICAgY29uc3QgY29vcmRpbmF0ZXMgPSB0aGlzLiNidWlsZENvb3JkaW5hdGVzKHNpemUsIGZpcnN0Q29vcmQsIG9yaWVudGF0aW9uKTtcbiAgICBpZiAodGhpcy4jdmFsaWRhdGVDb29yZGluYXRlcyhjb29yZGluYXRlcykpIHtcbiAgICAgIGNvbnN0IG5ld1NoaXAgPSBuZXcgU2hpcChzaXplKTtcbiAgICAgIGNvbnN0IHNoaXBFbnRyeSA9IFtuZXdTaGlwLCBjb29yZGluYXRlc107XG4gICAgICB0aGlzLmFsbFNoaXBzLnB1c2goc2hpcEVudHJ5KTtcbiAgICAgIHJldHVybiBjb29yZGluYXRlcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8vIHJlY2VpdmVBdHRhY2sgZnVuY3Rpb24gdGFrZXMgY29vcmRpbmF0ZXMsIGRldGVybWluZXMgd2hldGhlciBvciBub3QgdGhlIGF0dGFjayBoaXQgYSBzaGlwXG4gIC8vIHRoZW4gc2VuZHMgdGhlIOKAmGhpdOKAmSBmdW5jdGlvbiB0byB0aGUgY29ycmVjdCBzaGlwLCBvciByZWNvcmRzIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgbWlzc2VkIHNob3QuXG4gIHJlY2VpdmVBdHRhY2soY29vcmRpbmF0ZSkge1xuICAgIHRoaXMuYWxsU2hvdHMucHVzaChjb29yZGluYXRlKTtcbiAgICBjb25zdCBzaGlwID0gdGhpcy4jZmluZFNoaXAoY29vcmRpbmF0ZSk7XG4gICAgaWYgKHNoaXApIHtcbiAgICAgIHNoaXAuaGl0KCk7XG4gICAgICByZXR1cm4gc2hpcDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5taXNzZWRTaG90cy5wdXNoKGNvb3JkaW5hdGUpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGdhbWVPdmVyKCkge1xuICAgIGxldCBhbGxTdW5rID0gdHJ1ZTtcbiAgICAvLyBJZiBzaGlwcyBoYXZlbid0IHlldCBiZWVuIHBsYWNlZCwgcmV0dXJuIGZhbHNlLlxuICAgIGlmICh0aGlzLmFsbFNoaXBzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLmFsbFNoaXBzLmZvckVhY2goc2hpcCA9PiB7XG4gICAgICBpZiAoIXNoaXBbMF0uaXNTdW5rKCkpIHtcbiAgICAgICAgYWxsU3VuayA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGFsbFN1bms7XG4gIH1cblxuICAjYnVpbGRDb29yZGluYXRlcyhzaXplLCBmaXJzdENvb3JkLCBvcmllbnRhdGlvbikge1xuICAgIGxldCBjb29yZGluYXRlcyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBpZiAob3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICBjb29yZGluYXRlcy5wdXNoKFtmaXJzdENvb3JkWzBdICsgaSwgZmlyc3RDb29yZFsxXV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29vcmRpbmF0ZXMucHVzaChbZmlyc3RDb29yZFswXSwgZmlyc3RDb29yZFsxXSArIGldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xuICB9XG5cbiAgI3ZhbGlkYXRlQ29vcmRpbmF0ZXMoY29vcmRpbmF0ZXMpIHtcbiAgICBsZXQgdmFsaWRDb29yZHMgPSB0cnVlO1xuICAgIGNvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkKSA9PiB7XG4gICAgICAvLyBJZiBhIHNoaXAgYWxyZWFkeSBleGlzdHMgYXQgbG9jYXRpb24sIHJlamVjdCBpdC5cbiAgICAgIGlmICh0aGlzLiNmaW5kU2hpcChjb29yZCkgfHwgY29vcmRbMF0gPiA5IHx8IGNvb3JkWzFdID4gOSkge1xuICAgICAgICB2YWxpZENvb3JkcyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIHZhbGlkQ29vcmRzO1xuICB9XG5cbiAgI2ZpbmRTaGlwKGNvb3JkaW5hdGUpIHtcbiAgICBsZXQgZm91bmRTaGlwID0gZmFsc2U7XG4gICAgdGhpcy5hbGxTaGlwcy5mb3JFYWNoKHNoaXAgPT4ge1xuICAgICAgaWYgKHNoaXBbMV0uc29tZSgoeCkgPT4geFswXSA9PT0gY29vcmRpbmF0ZVswXSAmJiB4WzFdID09PSBjb29yZGluYXRlWzFdKSkge1xuICAgICAgICBmb3VuZFNoaXAgPSBzaGlwWzBdO1xuICAgIH19KVxuICAgIHJldHVybiBmb3VuZFNoaXA7XG4gIH1cbn1cbiIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vcGxheWVyc1wiO1xuaW1wb3J0IERPTWJ1aWxkZXIgZnJvbSBcIi4vZG9tQnVpbGRlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lbG9vcCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaHVtYW4gPSBuZXcgUGxheWVyKHRydWUpO1xuICAgIHRoaXMuYWkgPSBuZXcgUGxheWVyKGZhbHNlKTtcbiAgICB0aGlzLnBsYXllcnMgPSBbdGhpcy5odW1hbiwgdGhpcy5haV07XG4gICAgdGhpcy5jdXJyZW50UGxheWVyID0gdGhpcy5haTtcbiAgICB0aGlzLnJvdW5kID0gbnVsbDtcbiAgICB0aGlzLnBhZ2UgPSBuZXcgRE9NYnVpbGRlcigpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy4jYWlTaGlwcygpO1xuICAgIHRoaXMuYWlHcmlkTGlzdGVuZXJzKCk7XG4gICAgdGhpcy5odW1hbkdyaWRMaXN0ZW5lcnMoKTtcblxuICAgIGxldCBjdXJyZW50Um91bmQgPSB0aGlzLnJvdW5kO1xuXG4gICAgY29uc3QgcGxheVJvdW5kID0gKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLiNnYW1lT3ZlcigpKSB7XG4gICAgICAgIHRoaXMuI2FpQXR0YWNrKCk7XG4gICAgICAgIGlmIChjdXJyZW50Um91bmQgIT09IHRoaXMucm91bmQpIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRQbGF5ZXIgPSB0aGlzLmN1cnJlbnRQbGF5ZXIgPT09IHRoaXMuaHVtYW4gPyB0aGlzLmFpIDogdGhpcy5odW1hbjtcbiAgICAgICAgICBjdXJyZW50Um91bmQgPSB0aGlzLnJvdW5kO1xuICAgICAgICB9XG4gICAgICAgIHNldFRpbWVvdXQocGxheVJvdW5kLCAwKTsgLy8gU2NoZWR1bGUgdGhlIG5leHQgcm91bmQgYWZ0ZXIgYSB2ZXJ5IHNob3J0IGRlbGF5XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLiNlbmRHYW1lKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYXlSb3VuZCgpO1xuICB9XG5cbiAgI2VuZEdhbWUoKSB7XG4gICAgY29uc3Qgd2lubmVyID0gdGhpcy4jZ2FtZU92ZXIoKSA9PT0gdGhpcy5odW1hbiA/ICdZb3UnIDogJ0NvbXB1dGVyJztcbiAgICBjb25zdCBhaUdyaWRJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ3JpZC1pdGVtLmFpXCIpO1xuICAgIC8vIGRpc3BsYXkgdGhlIHdpbm5lclxuICAgIHRoaXMucGFnZS5kaXNwbGF5V2lubmVyKHdpbm5lcik7XG4gICAgLy8gcmV2ZWFsIGFsbCBib2FyZHNcbiAgICBhaUdyaWRJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgbGV0IGNvb3JkcyA9IGl0ZW0uZGF0YXNldC5jb29yZGluYXRlc1xuICAgICAgLnNwbGl0KFwiLFwiKVxuICAgICAgLm1hcCgoeCkgPT4gcGFyc2VJbnQoeCwgMTApKTtcbiAgICAgIHRoaXMuI2FpQm9hcmRBdHRhY2soY29vcmRzLCBpdGVtKTtcbiAgICB9KVxuICB9XG5cbiAgaHVtYW5HcmlkTGlzdGVuZXJzKCkge1xuICAgIHRoaXMuI29yaWVudGF0aW9uQnRuTGlzdGVuZXIoKTtcbiAgICBjb25zdCBvcmllbnRhdGlvbkJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JpZW50YXRpb25CdG5cIik7XG4gICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ncmlkLWl0ZW0uaHVtYW5cIik7XG4gICAgbGV0IHBsYWNlbWVudENvdW50ZXIgPSAwO1xuICAgIGxldCBzaGlwU2l6ZSA9IFs1LCA0LCAzLCAzLCAyXTtcblxuICAgIGdyaWRJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGlmIChwbGFjZW1lbnRDb3VudGVyID49IHNoaXBTaXplLmxlbmd0aCAtIDEgJiYgIXRoaXMucm91bmQpIHtcbiAgICAgICAgICB0aGlzLnBhZ2UuaGlkZUVsZW1lbnQob3JpZW50YXRpb25CdG4pO1xuICAgICAgICAgIHRoaXMucm91bmQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9yaWVudGF0aW9uID0gb3JpZW50YXRpb25CdG4udGV4dENvbnRlbnQ7XG4gICAgICAgIGxldCBjb29yZHMgPSBpdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXNcbiAgICAgICAgICAuc3BsaXQoXCIsXCIpXG4gICAgICAgICAgLm1hcCgoeCkgPT4gcGFyc2VJbnQoeCwgMTApKTtcbiAgICAgICAgbGV0IGNvb3JkaW5hdGVzID0gdGhpcy5odW1hbi5ib2FyZC5wbGFjZVNoaXAoXG4gICAgICAgICAgc2hpcFNpemVbcGxhY2VtZW50Q291bnRlcl0sXG4gICAgICAgICAgY29vcmRzLFxuICAgICAgICAgIG9yaWVudGF0aW9uXG4gICAgICAgICk7XG4gICAgICAgIC8vIFNob3cgc2hpcCBvbiBzY3JlZW4sIGlmIHZhbGlkIHBsYWNlbWVudC5cbiAgICAgICAgaWYgKGNvb3JkaW5hdGVzKSB7XG4gICAgICAgICAgY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmQpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGFnZS5zaGlwKHRoaXMuI2ZpbmRHcmlkSXRlbShjb29yZCwgXCJodW1hblwiKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcGxhY2VtZW50Q291bnRlcisrO1xuICAgICAgICAgIHRoaXMucGFnZS51cGRhdGVQbGF5ZXJNc2cocGxhY2VtZW50Q291bnRlcik7XG4gICAgICAgIC8vIERpc3BsYXkgZXJyb3IgbWVzc2FnZSBpZiBwbGFjZW1lbnQgZ29lcyBvZmYgYm9hcmQgb3IgY29uZmxpY3RzIHdpdGggZXhpc3Rpbmcgc2hpcC5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucGFnZS51cGRhdGVQbGF5ZXJNc2cocGxhY2VtZW50Q291bnRlciwgXCJlcnJvclwiKTtcbiAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgI29yaWVudGF0aW9uQnRuTGlzdGVuZXIoKSB7XG4gICAgY29uc3Qgb3JpZW50YXRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yaWVudGF0aW9uQnRuXCIpO1xuICAgIG9yaWVudGF0aW9uLmRpc3BsYXkgPSBcImJsb2NrXCI7XG5cbiAgICBvcmllbnRhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgbGV0IHRleHQgPSBvcmllbnRhdGlvbi50ZXh0Q29udGVudDtcbiAgICAgIG9yaWVudGF0aW9uLnRleHRDb250ZW50ID1cbiAgICAgICAgdGV4dCA9PT0gXCJob3Jpem9udGFsXCIgPyBcInZlcnRpY2FsXCIgOiBcImhvcml6b250YWxcIjtcbiAgICB9KTtcbiAgfVxuXG4gIGFpR3JpZExpc3RlbmVycygpIHtcbiAgICBjb25zdCBncmlkSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdyaWQtaXRlbS5haVwiKTtcbiAgICBncmlkSXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGxheWVyID09PSB0aGlzLmh1bWFuKSB7XG4gICAgICAgICAgbGV0IGNvb3JkcyA9IGl0ZW0uZGF0YXNldC5jb29yZGluYXRlc1xuICAgICAgICAgICAgLnNwbGl0KFwiLFwiKVxuICAgICAgICAgICAgLm1hcCgoeCkgPT4gcGFyc2VJbnQoeCwgMTApKTtcbiAgICAgICAgICB0aGlzLiNhaUJvYXJkQXR0YWNrKGNvb3JkcywgaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgI2FpQm9hcmRBdHRhY2soY29vcmRzLCBncmlkSXRlbSkge1xuICAgIGxldCBhdHRhY2tlZFNoaXAgPSB0aGlzLmFpLmJvYXJkLnJlY2VpdmVBdHRhY2soY29vcmRzKVxuICAgIGlmIChhdHRhY2tlZFNoaXApIHtcbiAgICAgIC8vIGlmIGEgc2hpcCBpcyBoaXQsIG1hcmsgc3F1YXJlIGFzIHJlZC5cbiAgICAgIHRoaXMucGFnZS5oaXQoZ3JpZEl0ZW0pO1xuICAgICAgdGhpcy5yb3VuZCsrO1xuICAgICAgLy8gaWYgc2hpcCBpcyBzdW5rLCBkaXNwbGF5IGdsb2JhbCBtZXNzYWdlLlxuICAgICAgaWYgKGF0dGFja2VkU2hpcC5pc1N1bmsoKSAmJiAhdGhpcy4jZ2FtZU92ZXIoKSkge1xuICAgICAgICB0aGlzLnBhZ2UuZGlzcGxheVN1bmtNZXNzYWdlKGF0dGFja2VkU2hpcCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGlmIGEgc2hpcCBpcyBub3QgaGl0LCBtYXJrIHNxdWFyZSBhcyBibHVlLlxuICAgICAgdGhpcy5wYWdlLm1pc3MoZ3JpZEl0ZW0pO1xuICAgICAgdGhpcy5yb3VuZCsrO1xuICAgIH1cbiAgfVxuXG4gICNhaVNoaXBzKCkge1xuICAgIGNvbnN0IHNoaXBTaXplcyA9IFs1LCA0LCAzLCAzLCAyXTtcbiAgICBzaGlwU2l6ZXMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgbGV0IGNvb3JkaW5hdGVzID0gdGhpcy4jYWlTaGlwUGxhY2VtZW50KHNoaXApO1xuXG4gICAgICB3aGlsZSAoIWNvb3JkaW5hdGVzKSB7XG4gICAgICAgIGNvb3JkaW5hdGVzID0gdGhpcy4jYWlTaGlwUGxhY2VtZW50KHNoaXApO1xuICAgICAgfVxuXG4gICAgICAvLyBzaG93IGFpIHNoaXBzIHdoaWxlIHRlc3RpbmcuXG4gICAgICBjb29yZGluYXRlcy5mb3JFYWNoKChjb29yZCkgPT4ge1xuICAgICAgICB0aGlzLnBhZ2Uuc2hpcCh0aGlzLiNmaW5kR3JpZEl0ZW0oY29vcmQsIFwiYWlcIikpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAjYWlTaGlwUGxhY2VtZW50KHNoaXApIHtcbiAgICBsZXQgb3JpZW50YXRpb24gPSB0aGlzLiNyYW5kb21OdW0oMikgPT09IDAgPyBcImhvcml6b250YWxcIiA6IFwidmVydGljYWxcIjtcbiAgICBsZXQgY29vcmQgPVxuICAgICAgb3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiXG4gICAgICAgID8gW3RoaXMuI3JhbmRvbU51bSgxMCAtIHNoaXApLCB0aGlzLiNyYW5kb21OdW0oMTApXVxuICAgICAgICA6IFt0aGlzLiNyYW5kb21OdW0oMTApLCB0aGlzLiNyYW5kb21OdW0oMTAgLSBzaGlwKV07XG4gICAgbGV0IGNvb3JkaW5hdGVzID0gdGhpcy5haS5ib2FyZC5wbGFjZVNoaXAoc2hpcCwgY29vcmQsIG9yaWVudGF0aW9uKTtcbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gIH1cblxuICAjYWlBdHRhY2soKSB7XG4gICAgaWYgKHRoaXMuY3VycmVudFBsYXllciA9PT0gdGhpcy5haSAmJiB0aGlzLnJvdW5kKSB7XG4gICAgICBsZXQgY29vcmQgPSB0aGlzLiNhaUNvb3JkU2VsZWN0b3IoKTtcbiAgICAgIGxldCBncmlkSXRlbSA9IHRoaXMuI2ZpbmRHcmlkSXRlbShjb29yZCwgJ2h1bWFuJyk7XG4gICAgICBsZXQgYXR0YWNrZWRTaGlwID0gdGhpcy5odW1hbi5ib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkKVxuICAgICAgaWYgKGF0dGFja2VkU2hpcCkge1xuICAgICAgICAvLyBpZiBhIHNoaXAgaXMgaGl0LCBtYXJrIHNxdWFyZSBhcyByZWQuXG4gICAgICAgIHRoaXMucGFnZS5oaXQoZ3JpZEl0ZW0pO1xuICAgICAgICB0aGlzLnJvdW5kKys7XG4gICAgICAgIC8vIGlmIHNoaXAgaXMgc3VuaywgZGlzcGxheSBnbG9iYWwgbWVzc2FnZS5cbiAgICAgICAgaWYgKGF0dGFja2VkU2hpcC5pc1N1bmsoKSkge1xuICAgICAgICAgIHRoaXMucGFnZS5kaXNwbGF5U3Vua01lc3NhZ2UoYXR0YWNrZWRTaGlwKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaWYgYSBzaGlwIGlzIG5vdCBoaXQsIG1hcmsgc3F1YXJlIGFzIGJsdWUuXG4gICAgICAgIHRoaXMucGFnZS5taXNzKGdyaWRJdGVtKTtcbiAgICAgICAgdGhpcy5yb3VuZCsrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gICNhaUNvb3JkU2VsZWN0b3IoKSB7XG4gICAgbGV0IGNvb3JkID0gW3RoaXMuI3JhbmRvbU51bSgxMCksIHRoaXMuI3JhbmRvbU51bSgxMCldO1xuICAgIC8vIENoZWNrIGlmIGNvb3JkIGhhcyBhbHJlYWR5IGJlZW4gdXNlZCwgaWYgc28gcmVydW4gZnVuY3Rpb24uXG4gICAgdGhpcy5odW1hbi5ib2FyZC5hbGxTaG90cy5mb3JFYWNoKHNob3QgPT4ge1xuICAgICAgaWYgKHNob3RbMF0gPT09IGNvb3JkWzBdICYmIHNob3RbMV0gPT09IGNvb3JkWzFdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNhaUNvb3JkU2VsZWN0b3IoKTtcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBjb29yZDtcbiAgfVxuXG4gICNyYW5kb21OdW0obWF4KSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1heCk7XG4gIH1cblxuICAjZmluZEdyaWRJdGVtKGNvb3JkLCBwbGF5ZXIpIHtcbiAgICBjb25zdCBncmlkSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuZ3JpZC1pdGVtLiR7cGxheWVyfWApO1xuICAgIGxldCBmb3VuZEl0ZW0gPSBmYWxzZTtcbiAgICBncmlkSXRlbXMuZm9yRWFjaCgoZ3JpZEl0ZW0pID0+IHtcbiAgICAgIGlmIChncmlkSXRlbS5kYXRhc2V0LmNvb3JkaW5hdGVzID09PSBjb29yZC50b1N0cmluZygpKSB7XG4gICAgICAgIGZvdW5kSXRlbSA9IGdyaWRJdGVtO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBmb3VuZEl0ZW07XG4gIH1cblxuICAjZ2FtZU92ZXIoKSB7XG4gICAgLy8gQUkgd2lucyBpZiBodW1hbiBib2FyZCBpcyBnYW1lIG92ZXIuXG4gICAgaWYgKHRoaXMuaHVtYW4uYm9hcmQuZ2FtZU92ZXIoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuYWk7XG4gICAgLy8gSHVtYW4gd2lucyBpZiBhaSBib2FyZCBpcyBnYW1lIG92ZXIuXG4gICAgfSBlbHNlIGlmICh0aGlzLmFpLmJvYXJkLmdhbWVPdmVyKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmh1bWFuO1xuICAgIC8vIEVsc2UgZ2FtZSBjb250aW51ZXMuXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBHYW1lYm9hcmQgZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKGh1bWFuPXRydWUpIHtcbiAgICB0aGlzLmJvYXJkID0gbmV3IEdhbWVib2FyZDtcbiAgICB0aGlzLmlzSHVtYW4gPSBodW1hbjtcbiAgICB0aGlzLnByZXZpb3VzUGxheXMgPSBbXTtcbiAgfTtcblxuICBhdHRhY2socGxheWVyLCBjb29yZGluYXRlKSB7XG4gICAgaWYgKCF0aGlzLmlzSHVtYW4pIHtcbiAgICAgIGNvb3JkaW5hdGUgPSB0aGlzLiNhaUF0dGFjayhwbGF5ZXIuYm9hcmQpO1xuICAgIH1cblxuICAgIHRoaXMucHJldmlvdXNQbGF5cy5wdXNoKGNvb3JkaW5hdGUpO1xuICAgIHBsYXllci5ib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGUpO1xuICB9XG5cbiAgI2FpQXR0YWNrKGJvYXJkKSB7XG4gICAgbGV0IGNvb3JkaW5hdGUgPSB0aGlzLiNyYW5kb21Db29yZCgpO1xuICAgIGlmICh0aGlzLnByZXZpb3VzUGxheXMuaW5jbHVkZXMoY29vcmRpbmF0ZSkpIHtcbiAgICAgIHRoaXMuI2FpQXR0YWNrKGJvYXJkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNvb3JkaW5hdGU7XG4gICAgfVxuICB9XG5cbiAgLy8gR2VuZXJhdGUgcmFuZG9tIGNvb3JkaW5hdGVzIGJldHdlZW4gMCAtIDkuXG4gICNyYW5kb21Db29yZCgpIHtcbiAgICByZXR1cm4gW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSwgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApXTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hpcCB7XG4gIGNvbnN0cnVjdG9yKHNpemUpIHtcbiAgICBjb25zdCBzaGlwVHlwZXMgPSB7NSA6ICdDYXJyaWVyJywgNCA6ICdCYXR0bGVzaGlwJywgMyA6ICdEZXN0cm95ZXInLCAzIDogJ1N1Ym1hcmluZScsIDIgOiAnUGF0cm9sIEJvYXQnfVxuICAgIHRoaXMubGVuZ3RoID0gc2l6ZTtcbiAgICB0aGlzLnNoaXBUeXBlID0gc2hpcFR5cGVzW3NpemVdO1xuICAgIHRoaXMuaGl0cyA9IDA7XG4gICAgdGhpcy5zdW5rID0gZmFsc2U7XG4gIH1cblxuICBoaXQoKSB7XG4gICAgdGhpcy5oaXRzKys7XG4gICAgdGhpcy5pc1N1bmsoKTtcbiAgfVxuXG4gIGlzU3VuaygpIHtcbiAgICBpZiAodGhpcy5oaXRzID09PSB0aGlzLmxlbmd0aCkge1xuICAgICAgdGhpcy5zdW5rID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3VuaztcbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgR2FtZWxvb3AgZnJvbSBcIi4vZ2FtZWxvb3BcIjtcblxuY29uc3QgZ2FtZSA9IG5ldyBHYW1lbG9vcCgpO1xuZ2FtZS5zdGFydCgpO1xuIl0sIm5hbWVzIjpbIkRPTWJ1aWxkZXIiLCJjb25zdHJ1Y3RvciIsInNoaXBzIiwic2hpcE5hbWVzIiwic2hpcFNpemVzIiwiZ2FtZUNvbnRhaW5lciIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJwbGF5ZXJDb250YWluZXIiLCJjcmVhdGVFbGVtZW50IiwiYWlDb250YWluZXIiLCJnbG9iYWxNc2ciLCJpZCIsImNsYXNzTGlzdCIsImFkZCIsInBsYXllclRpdGxlIiwidGV4dENvbnRlbnQiLCJhaVRpdGxlIiwicGxheWVyR3JpZCIsImdyaWRQb3B1bGF0ZSIsImFpR3JpZCIsInBsYXllck1zZyIsImNyZWF0ZVRleHROb2RlIiwidXBkYXRlUGxheWVyTXNnIiwib3JpZW50YXRpb25CdG4iLCJhcHBlbmQiLCJoaXQiLCJncmlkSXRlbSIsInJlbW92ZSIsIm1pc3MiLCJzaGlwIiwiaGlkZUVsZW1lbnQiLCJlbGVtZW50Iiwic3R5bGUiLCJkaXNwbGF5IiwiY291bnRlciIsImVycm9yIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwibXNnIiwic2V0VGltZW91dCIsImNsZWFyTXNnIiwiZGlzcGxheVN1bmtNZXNzYWdlIiwic3Vua01zZyIsInNoaXBUeXBlIiwiYXBwZW5kQ2hpbGQiLCJkaXNwbGF5V2lubmVyIiwid2lubmVyIiwid2lubmVyTXNnIiwiI2NsZWFyTXNnIiwibXNnRWxlbWVudCIsIiNncmlkUG9wdWxhdGUiLCJwbGF5ZXIiLCJncmlkIiwiaSIsImRhdGFzZXQiLCJjb29yZGluYXRlcyIsImNvb3Jkc1BvcHVsYXRlIiwiI2Nvb3Jkc1BvcHVsYXRlIiwiZGlnaXRzIiwidG9TdHJpbmciLCJzcGxpdCIsIlNoaXAiLCJHYW1lYm9hcmQiLCJhbGxTaGlwcyIsIm1pc3NlZFNob3RzIiwiYWxsU2hvdHMiLCJwbGFjZVNoaXAiLCJzaXplIiwiZmlyc3RDb29yZCIsIm9yaWVudGF0aW9uIiwiYnVpbGRDb29yZGluYXRlcyIsInZhbGlkYXRlQ29vcmRpbmF0ZXMiLCJuZXdTaGlwIiwic2hpcEVudHJ5IiwicHVzaCIsInJlY2VpdmVBdHRhY2siLCJjb29yZGluYXRlIiwiZmluZFNoaXAiLCJnYW1lT3ZlciIsImFsbFN1bmsiLCJmb3JFYWNoIiwiaXNTdW5rIiwiI2J1aWxkQ29vcmRpbmF0ZXMiLCIjdmFsaWRhdGVDb29yZGluYXRlcyIsInZhbGlkQ29vcmRzIiwiY29vcmQiLCIjZmluZFNoaXAiLCJmb3VuZFNoaXAiLCJzb21lIiwieCIsIlBsYXllciIsIkdhbWVsb29wIiwiaHVtYW4iLCJhaSIsInBsYXllcnMiLCJjdXJyZW50UGxheWVyIiwicm91bmQiLCJwYWdlIiwic3RhcnQiLCJhaVNoaXBzIiwiYWlHcmlkTGlzdGVuZXJzIiwiaHVtYW5HcmlkTGlzdGVuZXJzIiwiY3VycmVudFJvdW5kIiwicGxheVJvdW5kIiwiYWlBdHRhY2siLCJlbmRHYW1lIiwiI2VuZEdhbWUiLCJhaUdyaWRJdGVtcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpdGVtIiwiY29vcmRzIiwibWFwIiwicGFyc2VJbnQiLCJhaUJvYXJkQXR0YWNrIiwib3JpZW50YXRpb25CdG5MaXN0ZW5lciIsImdyaWRJdGVtcyIsInBsYWNlbWVudENvdW50ZXIiLCJzaGlwU2l6ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJib2FyZCIsImZpbmRHcmlkSXRlbSIsIiNvcmllbnRhdGlvbkJ0bkxpc3RlbmVyIiwidGV4dCIsIiNhaUJvYXJkQXR0YWNrIiwiYXR0YWNrZWRTaGlwIiwiI2FpU2hpcHMiLCJhaVNoaXBQbGFjZW1lbnQiLCIjYWlTaGlwUGxhY2VtZW50IiwicmFuZG9tTnVtIiwiI2FpQXR0YWNrIiwiYWlDb29yZFNlbGVjdG9yIiwiI2FpQ29vcmRTZWxlY3RvciIsInNob3QiLCIjcmFuZG9tTnVtIiwibWF4IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiI2ZpbmRHcmlkSXRlbSIsImZvdW5kSXRlbSIsIiNnYW1lT3ZlciIsImlzSHVtYW4iLCJwcmV2aW91c1BsYXlzIiwiYXR0YWNrIiwicmFuZG9tQ29vcmQiLCJpbmNsdWRlcyIsIiNyYW5kb21Db29yZCIsInNoaXBUeXBlcyIsImhpdHMiLCJzdW5rIiwiZ2FtZSJdLCJzb3VyY2VSb290IjoiIn0=