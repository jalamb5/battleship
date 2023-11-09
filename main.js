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
    this.gameContainer.append(this.playerContainer, this.aiContainer);
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
    let msg = this.playerMsg;
    if (counter < 5) {
      msg.textContent = `Click grid to place ${this.shipNames[counter]} (size: ${this.shipSizes[counter]})`;
    } else {
      msg.textContent = '';
    }
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
    coordinates.forEach(coord => {
      // If a ship already exists at location, reject it.
      if (this.#findShip(coord)) {
        return false;
      }
    });
    const newShip = new _ships__WEBPACK_IMPORTED_MODULE_0__["default"](size);
    const shipEntry = [newShip, coordinates];
    this.allShips.push(shipEntry);
    return coordinates;
  }

  // receiveAttack function takes coordinates, determines whether or not the attack hit a ship
  // then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot.
  receiveAttack(coordinate) {
    this.allShots.push(coordinate);
    const ship = this.#findShip(coordinate);
    if (ship) {
      ship.hit();
      return true;
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
    gridItems.forEach(item => {
      item.addEventListener("click", () => {
        if (placementCounter >= shipSize.length - 1 && !this.round) {
          this.page.hideElement(orientationBtn);
          this.round = 0;
        }
        const orientation = orientationBtn.textContent;
        let coords = item.dataset.coordinates.split(",").map(x => parseInt(x, 10));
        let coordinates = this.human.board.placeShip(shipSize[placementCounter], coords, orientation);
        // Show ship on screen.
        coordinates.forEach(coord => {
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
      orientation.textContent = text === "horizontal" ? "vertical" : "horizontal";
    });
  }
  aiGridListeners() {
    const gridItems = document.querySelectorAll(".grid-item.ai");
    gridItems.forEach(item => {
      item.addEventListener("click", () => {
        if (this.currentPlayer === this.human) {
          let coords = item.dataset.coordinates.split(",").map(x => parseInt(x, 10));
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
    if (this.human.board.gameOver() || this.ai.board.gameOver()) {
      return true;
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
    this.length = size;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q2xCLElBQUksQ0FBQzJFLElBQUksR0FBRyxDQUFDO0lBQ2IsSUFBSSxDQUFDQyxJQUFJLEdBQUcsS0FBSztFQUNuQjtFQUVBekcsR0FBR0EsQ0FBQSxFQUFHO0lBQ0osSUFBSSxDQUFDd0csSUFBSSxFQUFFO0lBQ1gsSUFBSSxDQUFDMUQsTUFBTSxDQUFDLENBQUM7RUFDZjtFQUVBQSxNQUFNQSxDQUFBLEVBQUc7SUFDUCxJQUFJLElBQUksQ0FBQzBELElBQUksS0FBSyxJQUFJLENBQUN2RSxNQUFNLEVBQUU7TUFDN0IsSUFBSSxDQUFDd0UsSUFBSSxHQUFHLElBQUk7SUFDbEI7SUFDQSxPQUFPLElBQUksQ0FBQ0EsSUFBSTtFQUNsQjtBQUNGOzs7Ozs7VUNsQkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05rQztBQUVsQyxNQUFNQyxJQUFJLEdBQUcsSUFBSXJELGlEQUFRLENBQUMsQ0FBQztBQUMzQnFELElBQUksQ0FBQzlDLEtBQUssQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RvbUJ1aWxkZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lbG9vcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3BsYXllcnMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgRE9NYnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGNvbnN0IHNoaXBzID0geydDYXJyaWVyJzogNSwgJ0JhdHRsZXNoaXAnOiA0LCAnRGVzdHJveWVyJzogMywgJ1N1Ym1hcmluZSc6IDMsICdQYXRyb2wgQm9hdCc6IDJ9XG4gICAgdGhpcy5zaGlwTmFtZXMgPSBbJ0NhcnJpZXInLCAnQmF0dGxlc2hpcCcsICdEZXN0cm95ZXInLCAnU3VibWFyaW5lJywgJ1BhdHJvbCBCb2F0J107XG4gICAgdGhpcy5zaGlwU2l6ZXMgPSBbNSwgNCwgMywgMywgMl07XG5cbiAgICB0aGlzLmdhbWVDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZS1jb250YWluZXInKTtcbiAgICAvLyBjcmVhdGUgY29udGFpbmVycyBmb3IgZWxlbWVudHM6XG4gICAgICAvLyAyIHBsYXllciBjb250YWluZXJzXG4gICAgdGhpcy5wbGF5ZXJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmFpQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5wbGF5ZXJDb250YWluZXIuY2xhc3NMaXN0LmFkZCgncGxheWVyLWNvbnRhaW5lcicpO1xuICAgIHRoaXMuYWlDb250YWluZXIuY2xhc3NMaXN0LmFkZCgncGxheWVyLWNvbnRhaW5lcicpO1xuICAgICAgLy8gZWFjaCBjb250YWluZXIgY29udGFpbnM6XG4gICAgICAgIC8vIFBsYXllciB0aXRsZVxuICAgICAgICBjb25zdCBwbGF5ZXJUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJylcbiAgICAgICAgcGxheWVyVGl0bGUudGV4dENvbnRlbnQgPSAnUGxheWVyJztcblxuICAgICAgICBjb25zdCBhaVRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbiAgICAgICAgYWlUaXRsZS50ZXh0Q29udGVudCA9ICdDb21wdXRlcic7XG5cbiAgICAgICAgLy8gR2FtZSBib2FyZCBncmlkICgxMCB4IDEwKVxuICAgICAgICBjb25zdCBwbGF5ZXJHcmlkID0gdGhpcy4jZ3JpZFBvcHVsYXRlKCdodW1hbicpO1xuICAgICAgICBjb25zdCBhaUdyaWQgPSB0aGlzLiNncmlkUG9wdWxhdGUoJ2FpJyk7XG5cbiAgICAgICAgdGhpcy5wbGF5ZXJNc2cgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgICAgIHRoaXMudXBkYXRlUGxheWVyTXNnKDApO1xuICAgICAgICB0aGlzLnBsYXllck1zZy5pZCA9ICdwbGF5ZXJNc2cnO1xuXG4gICAgICAgIGNvbnN0IG9yaWVudGF0aW9uQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgIG9yaWVudGF0aW9uQnRuLnRleHRDb250ZW50ID0gJ2hvcml6b250YWwnO1xuICAgICAgICBvcmllbnRhdGlvbkJ0bi5pZCA9ICdvcmllbnRhdGlvbkJ0bic7XG5cbiAgICAgIHRoaXMucGxheWVyQ29udGFpbmVyLmFwcGVuZChwbGF5ZXJUaXRsZSwgcGxheWVyR3JpZCwgdGhpcy5wbGF5ZXJNc2csIG9yaWVudGF0aW9uQnRuKTtcbiAgICAgIHRoaXMuYWlDb250YWluZXIuYXBwZW5kKGFpVGl0bGUsIGFpR3JpZCk7XG5cbiAgICB0aGlzLmdhbWVDb250YWluZXIuYXBwZW5kKHRoaXMucGxheWVyQ29udGFpbmVyLCB0aGlzLmFpQ29udGFpbmVyKTtcbiAgfVxuXG4gIGhpdChncmlkSXRlbSkge1xuICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3NoaXAnKTtcbiAgICBncmlkSXRlbS5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgfTtcblxuICBtaXNzKGdyaWRJdGVtKSB7XG4gICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZCgnbWlzcycpO1xuICB9XG5cbiAgc2hpcChncmlkSXRlbSkge1xuICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5hZGQoJ3NoaXAnKTtcbiAgfTtcblxuICBoaWRlRWxlbWVudChlbGVtZW50KSB7XG4gICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICB9XG5cbiAgdXBkYXRlUGxheWVyTXNnKGNvdW50ZXIpIHtcbiAgICBsZXQgbXNnID0gdGhpcy5wbGF5ZXJNc2c7XG4gICAgaWYgKGNvdW50ZXIgPCA1KSB7XG4gICAgICBtc2cudGV4dENvbnRlbnQgPSBgQ2xpY2sgZ3JpZCB0byBwbGFjZSAke3RoaXMuc2hpcE5hbWVzW2NvdW50ZXJdfSAoc2l6ZTogJHt0aGlzLnNoaXBTaXplc1tjb3VudGVyXX0pYFxuICAgIH0gZWxzZSB7XG4gICAgICBtc2cudGV4dENvbnRlbnQgPSAnJztcbiAgICB9XG4gIH1cblxuICAjZ3JpZFBvcHVsYXRlKHBsYXllcikge1xuICAgIGNvbnN0IGdyaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBncmlkLmNsYXNzTGlzdC5hZGQoJ2dyaWQnLCBwbGF5ZXIpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDA7IGkrKykge1xuICAgICAgY29uc3QgZ3JpZEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5hZGQoJ2dyaWQtaXRlbScsIHBsYXllcik7XG4gICAgICBncmlkSXRlbS5kYXRhc2V0LmNvb3JkaW5hdGVzID0gdGhpcy4jY29vcmRzUG9wdWxhdGUoaSk7XG4gICAgICBncmlkLmFwcGVuZENoaWxkKGdyaWRJdGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIGdyaWQ7XG4gIH1cblxuICAjY29vcmRzUG9wdWxhdGUoaSkge1xuICAgIGlmIChpIDwgMTApIHtcbiAgICAgIHJldHVybiBbaSwgMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBkaWdpdHMgPSBpLnRvU3RyaW5nKCkuc3BsaXQoJycpO1xuICAgICAgcmV0dXJuIFtkaWdpdHNbMV0sIGRpZ2l0c1swXV07XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgU2hpcCBmcm9tICcuL3NoaXBzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZWJvYXJkIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hbGxTaGlwcyA9IFtdO1xuICAgIHRoaXMubWlzc2VkU2hvdHMgPSBbXTtcbiAgICB0aGlzLmFsbFNob3RzID0gW107XG4gIH07XG5cbiAgcGxhY2VTaGlwKHNpemUsIGZpcnN0Q29vcmQsIG9yaWVudGF0aW9uPSdob3Jpem9udGFsJykge1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gdGhpcy4jYnVpbGRDb29yZGluYXRlcyhzaXplLCBmaXJzdENvb3JkLCBvcmllbnRhdGlvbik7XG4gICAgY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmQpID0+IHtcbiAgICAgIC8vIElmIGEgc2hpcCBhbHJlYWR5IGV4aXN0cyBhdCBsb2NhdGlvbiwgcmVqZWN0IGl0LlxuICAgICAgaWYgKHRoaXMuI2ZpbmRTaGlwKGNvb3JkKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSlcbiAgICBjb25zdCBuZXdTaGlwID0gbmV3IFNoaXAoc2l6ZSk7XG4gICAgY29uc3Qgc2hpcEVudHJ5ID0gW25ld1NoaXAsIGNvb3JkaW5hdGVzXTtcbiAgICB0aGlzLmFsbFNoaXBzLnB1c2goc2hpcEVudHJ5KTtcbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gIH1cblxuICAvLyByZWNlaXZlQXR0YWNrIGZ1bmN0aW9uIHRha2VzIGNvb3JkaW5hdGVzLCBkZXRlcm1pbmVzIHdoZXRoZXIgb3Igbm90IHRoZSBhdHRhY2sgaGl0IGEgc2hpcFxuICAvLyB0aGVuIHNlbmRzIHRoZSDigJhoaXTigJkgZnVuY3Rpb24gdG8gdGhlIGNvcnJlY3Qgc2hpcCwgb3IgcmVjb3JkcyB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIG1pc3NlZCBzaG90LlxuICByZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGUpIHtcbiAgICB0aGlzLmFsbFNob3RzLnB1c2goY29vcmRpbmF0ZSk7XG4gICAgY29uc3Qgc2hpcCA9IHRoaXMuI2ZpbmRTaGlwKGNvb3JkaW5hdGUpO1xuICAgIGlmIChzaGlwKSB7XG4gICAgICBzaGlwLmhpdCgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWlzc2VkU2hvdHMucHVzaChjb29yZGluYXRlKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBnYW1lT3ZlcigpIHtcbiAgICBsZXQgYWxsU3VuayA9IHRydWU7XG4gICAgLy8gSWYgc2hpcHMgaGF2ZW4ndCB5ZXQgYmVlbiBwbGFjZWQsIHJldHVybiBmYWxzZS5cbiAgICBpZiAodGhpcy5hbGxTaGlwcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5hbGxTaGlwcy5mb3JFYWNoKHNoaXAgPT4ge1xuICAgICAgaWYgKCFzaGlwWzBdLmlzU3VuaygpKSB7XG4gICAgICAgIGFsbFN1bmsgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBhbGxTdW5rO1xuICB9XG5cbiAgI2J1aWxkQ29vcmRpbmF0ZXMoc2l6ZSwgZmlyc3RDb29yZCwgb3JpZW50YXRpb24pIHtcbiAgICBsZXQgY29vcmRpbmF0ZXMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgaWYgKG9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgY29vcmRpbmF0ZXMucHVzaChbZmlyc3RDb29yZFswXSArIGksIGZpcnN0Q29vcmRbMV1dKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvb3JkaW5hdGVzLnB1c2goW2ZpcnN0Q29vcmRbMF0sIGZpcnN0Q29vcmRbMV0gKyBpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb29yZGluYXRlcztcbiAgfVxuXG4gICNmaW5kU2hpcChjb29yZGluYXRlKSB7XG4gICAgbGV0IGZvdW5kU2hpcCA9IGZhbHNlO1xuICAgIHRoaXMuYWxsU2hpcHMuZm9yRWFjaChzaGlwID0+IHtcbiAgICAgIGlmIChzaGlwWzFdLnNvbWUoKHgpID0+IHhbMF0gPT09IGNvb3JkaW5hdGVbMF0gJiYgeFsxXSA9PT0gY29vcmRpbmF0ZVsxXSkpIHtcbiAgICAgICAgZm91bmRTaGlwID0gc2hpcFswXTtcbiAgICB9fSlcbiAgICByZXR1cm4gZm91bmRTaGlwO1xuICB9XG59XG4iLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuL3BsYXllcnNcIjtcbmltcG9ydCBET01idWlsZGVyIGZyb20gXCIuL2RvbUJ1aWxkZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZWxvb3Age1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmh1bWFuID0gbmV3IFBsYXllcih0cnVlKTtcbiAgICB0aGlzLmFpID0gbmV3IFBsYXllcihmYWxzZSk7XG4gICAgdGhpcy5wbGF5ZXJzID0gW3RoaXMuaHVtYW4sIHRoaXMuYWldO1xuICAgIHRoaXMuY3VycmVudFBsYXllciA9IHRoaXMuYWk7XG4gICAgdGhpcy5yb3VuZCA9IG51bGw7XG4gICAgdGhpcy5wYWdlID0gbmV3IERPTWJ1aWxkZXIoKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuI2FpU2hpcHMoKTtcbiAgICB0aGlzLmFpR3JpZExpc3RlbmVycygpO1xuICAgIHRoaXMuaHVtYW5HcmlkTGlzdGVuZXJzKCk7XG5cbiAgICBsZXQgY3VycmVudFJvdW5kID0gdGhpcy5yb3VuZDtcblxuICAgIGNvbnN0IHBsYXlSb3VuZCA9ICgpID0+IHtcbiAgICAgIGlmICghdGhpcy4jZ2FtZU92ZXIoKSkge1xuICAgICAgICB0aGlzLiNhaUF0dGFjaygpO1xuICAgICAgICBpZiAoY3VycmVudFJvdW5kICE9PSB0aGlzLnJvdW5kKSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50UGxheWVyID0gdGhpcy5jdXJyZW50UGxheWVyID09PSB0aGlzLmh1bWFuID8gdGhpcy5haSA6IHRoaXMuaHVtYW47XG4gICAgICAgICAgY3VycmVudFJvdW5kID0gdGhpcy5yb3VuZDtcbiAgICAgICAgfVxuICAgICAgICBzZXRUaW1lb3V0KHBsYXlSb3VuZCwgMCk7IC8vIFNjaGVkdWxlIHRoZSBuZXh0IHJvdW5kIGFmdGVyIGEgdmVyeSBzaG9ydCBkZWxheVxuICAgICAgfVxuICAgIH07XG5cbiAgICBwbGF5Um91bmQoKTtcbiAgfVxuXG5cbiAgaHVtYW5HcmlkTGlzdGVuZXJzKCkge1xuICAgIHRoaXMuI29yaWVudGF0aW9uQnRuTGlzdGVuZXIoKTtcbiAgICBjb25zdCBvcmllbnRhdGlvbkJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JpZW50YXRpb25CdG5cIik7XG4gICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ncmlkLWl0ZW0uaHVtYW5cIik7XG4gICAgbGV0IHBsYWNlbWVudENvdW50ZXIgPSAwO1xuICAgIGxldCBzaGlwU2l6ZSA9IFs1LCA0LCAzLCAzLCAyXTtcblxuICAgIGdyaWRJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGlmIChwbGFjZW1lbnRDb3VudGVyID49IHNoaXBTaXplLmxlbmd0aCAtIDEgJiYgIXRoaXMucm91bmQpIHtcbiAgICAgICAgICB0aGlzLnBhZ2UuaGlkZUVsZW1lbnQob3JpZW50YXRpb25CdG4pO1xuICAgICAgICAgIHRoaXMucm91bmQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9yaWVudGF0aW9uID0gb3JpZW50YXRpb25CdG4udGV4dENvbnRlbnQ7XG4gICAgICAgIGxldCBjb29yZHMgPSBpdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXNcbiAgICAgICAgICAuc3BsaXQoXCIsXCIpXG4gICAgICAgICAgLm1hcCgoeCkgPT4gcGFyc2VJbnQoeCwgMTApKTtcbiAgICAgICAgbGV0IGNvb3JkaW5hdGVzID0gdGhpcy5odW1hbi5ib2FyZC5wbGFjZVNoaXAoXG4gICAgICAgICAgc2hpcFNpemVbcGxhY2VtZW50Q291bnRlcl0sXG4gICAgICAgICAgY29vcmRzLFxuICAgICAgICAgIG9yaWVudGF0aW9uXG4gICAgICAgICk7XG4gICAgICAgIC8vIFNob3cgc2hpcCBvbiBzY3JlZW4uXG4gICAgICAgIGNvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkKSA9PiB7XG4gICAgICAgICAgdGhpcy5wYWdlLnNoaXAodGhpcy4jZmluZEdyaWRJdGVtKGNvb3JkLCBcImh1bWFuXCIpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHBsYWNlbWVudENvdW50ZXIrKztcbiAgICAgICAgdGhpcy5wYWdlLnVwZGF0ZVBsYXllck1zZyhwbGFjZW1lbnRDb3VudGVyKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgI29yaWVudGF0aW9uQnRuTGlzdGVuZXIoKSB7XG4gICAgY29uc3Qgb3JpZW50YXRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yaWVudGF0aW9uQnRuXCIpO1xuICAgIG9yaWVudGF0aW9uLmRpc3BsYXkgPSBcImJsb2NrXCI7XG5cbiAgICBvcmllbnRhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgbGV0IHRleHQgPSBvcmllbnRhdGlvbi50ZXh0Q29udGVudDtcbiAgICAgIG9yaWVudGF0aW9uLnRleHRDb250ZW50ID1cbiAgICAgICAgdGV4dCA9PT0gXCJob3Jpem9udGFsXCIgPyBcInZlcnRpY2FsXCIgOiBcImhvcml6b250YWxcIjtcbiAgICB9KTtcbiAgfVxuXG4gIGFpR3JpZExpc3RlbmVycygpIHtcbiAgICBjb25zdCBncmlkSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdyaWQtaXRlbS5haVwiKTtcbiAgICBncmlkSXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGxheWVyID09PSB0aGlzLmh1bWFuKSB7XG4gICAgICAgICAgbGV0IGNvb3JkcyA9IGl0ZW0uZGF0YXNldC5jb29yZGluYXRlc1xuICAgICAgICAgICAgLnNwbGl0KFwiLFwiKVxuICAgICAgICAgICAgLm1hcCgoeCkgPT4gcGFyc2VJbnQoeCwgMTApKTtcbiAgICAgICAgICBpZiAodGhpcy5haS5ib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkcykpIHtcbiAgICAgICAgICAgIC8vIGlmIGEgc2hpcCBpcyBoaXQgdGhlbiAuLi5cbiAgICAgICAgICAgIHRoaXMucGFnZS5oaXQoaXRlbSk7XG4gICAgICAgICAgICB0aGlzLnJvdW5kKys7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGlmIGEgc2hpcCBpcyBub3QgaGl0IHRoZW4gLi4uXG4gICAgICAgICAgICB0aGlzLnBhZ2UubWlzcyhpdGVtKTtcbiAgICAgICAgICAgIHRoaXMucm91bmQrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgI2FpU2hpcHMoKSB7XG4gICAgY29uc3Qgc2hpcFNpemVzID0gWzUsIDQsIDMsIDMsIDJdO1xuICAgIHNoaXBTaXplcy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBsZXQgY29vcmRpbmF0ZXMgPSB0aGlzLiNhaVNoaXBQbGFjZW1lbnQoc2hpcCk7XG5cbiAgICAgIHdoaWxlICghY29vcmRpbmF0ZXMpIHtcbiAgICAgICAgY29vcmRpbmF0ZXMgPSB0aGlzLiNhaVNoaXBQbGFjZW1lbnQoc2hpcCk7XG4gICAgICB9XG5cbiAgICAgIC8vIHNob3cgYWkgc2hpcHMgd2hpbGUgdGVzdGluZy5cbiAgICAgIGNvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkKSA9PiB7XG4gICAgICAgIHRoaXMucGFnZS5zaGlwKHRoaXMuI2ZpbmRHcmlkSXRlbShjb29yZCwgXCJhaVwiKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gICNhaVNoaXBQbGFjZW1lbnQoc2hpcCkge1xuICAgIGxldCBvcmllbnRhdGlvbiA9IHRoaXMuI3JhbmRvbU51bSgyKSA9PT0gMCA/IFwiaG9yaXpvbnRhbFwiIDogXCJ2ZXJ0aWNhbFwiO1xuICAgIGxldCBjb29yZCA9XG4gICAgICBvcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCJcbiAgICAgICAgPyBbdGhpcy4jcmFuZG9tTnVtKDEwIC0gc2hpcCksIHRoaXMuI3JhbmRvbU51bSgxMCldXG4gICAgICAgIDogW3RoaXMuI3JhbmRvbU51bSgxMCksIHRoaXMuI3JhbmRvbU51bSgxMCAtIHNoaXApXTtcbiAgICBsZXQgY29vcmRpbmF0ZXMgPSB0aGlzLmFpLmJvYXJkLnBsYWNlU2hpcChzaGlwLCBjb29yZCwgb3JpZW50YXRpb24pO1xuICAgIHJldHVybiBjb29yZGluYXRlcztcbiAgfVxuXG4gICNhaUF0dGFjaygpIHtcbiAgICBpZiAodGhpcy5jdXJyZW50UGxheWVyID09PSB0aGlzLmFpICYmIHRoaXMucm91bmQpIHtcbiAgICAgIGxldCBjb29yZCA9IHRoaXMuI2FpQ29vcmRTZWxlY3RvcigpO1xuICAgICAgbGV0IGl0ZW0gPSB0aGlzLiNmaW5kR3JpZEl0ZW0oY29vcmQsICdodW1hbicpO1xuICAgICAgaWYgKHRoaXMuaHVtYW4uYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZCkpIHtcbiAgICAgICAgLy8gaWYgYSBzaGlwIGlzIGhpdCB0aGVuIC4uLlxuICAgICAgICB0aGlzLnBhZ2UuaGl0KGl0ZW0pO1xuICAgICAgICB0aGlzLnJvdW5kKys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpZiBhIHNoaXAgaXMgbm90IGhpdCB0aGVuIC4uLlxuICAgICAgICB0aGlzLnBhZ2UubWlzcyhpdGVtKTtcbiAgICAgICAgdGhpcy5yb3VuZCsrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gICNhaUNvb3JkU2VsZWN0b3IoKSB7XG4gICAgbGV0IGNvb3JkID0gW3RoaXMuI3JhbmRvbU51bSgxMCksIHRoaXMuI3JhbmRvbU51bSgxMCldO1xuICAgIC8vIENoZWNrIGlmIGNvb3JkIGhhcyBhbHJlYWR5IGJlZW4gdXNlZCwgaWYgc28gcmVydW4gZnVuY3Rpb24uXG4gICAgdGhpcy5odW1hbi5ib2FyZC5hbGxTaG90cy5mb3JFYWNoKHNob3QgPT4ge1xuICAgICAgaWYgKHNob3RbMF0gPT09IGNvb3JkWzBdICYmIHNob3RbMV0gPT09IGNvb3JkWzFdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNhaUNvb3JkU2VsZWN0b3IoKTtcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBjb29yZDtcbiAgfVxuXG4gICNyYW5kb21OdW0obWF4KSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1heCk7XG4gIH1cblxuICAjZmluZEdyaWRJdGVtKGNvb3JkLCBwbGF5ZXIpIHtcbiAgICBjb25zdCBncmlkSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuZ3JpZC1pdGVtLiR7cGxheWVyfWApO1xuICAgIGxldCBmb3VuZEl0ZW0gPSBmYWxzZTtcbiAgICBncmlkSXRlbXMuZm9yRWFjaCgoZ3JpZEl0ZW0pID0+IHtcbiAgICAgIGlmIChncmlkSXRlbS5kYXRhc2V0LmNvb3JkaW5hdGVzID09PSBjb29yZC50b1N0cmluZygpKSB7XG4gICAgICAgIGZvdW5kSXRlbSA9IGdyaWRJdGVtO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBmb3VuZEl0ZW07XG4gIH1cblxuICAjZ2FtZU92ZXIoKSB7XG4gICAgaWYgKHRoaXMuaHVtYW4uYm9hcmQuZ2FtZU92ZXIoKSB8fCB0aGlzLmFpLmJvYXJkLmdhbWVPdmVyKCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgR2FtZWJvYXJkIGZyb20gXCIuL2dhbWVib2FyZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihodW1hbj10cnVlKSB7XG4gICAgdGhpcy5ib2FyZCA9IG5ldyBHYW1lYm9hcmQ7XG4gICAgdGhpcy5pc0h1bWFuID0gaHVtYW47XG4gICAgdGhpcy5wcmV2aW91c1BsYXlzID0gW107XG4gIH07XG5cbiAgYXR0YWNrKHBsYXllciwgY29vcmRpbmF0ZSkge1xuICAgIGlmICghdGhpcy5pc0h1bWFuKSB7XG4gICAgICBjb29yZGluYXRlID0gdGhpcy4jYWlBdHRhY2socGxheWVyLmJvYXJkKTtcbiAgICB9XG5cbiAgICB0aGlzLnByZXZpb3VzUGxheXMucHVzaChjb29yZGluYXRlKTtcbiAgICBwbGF5ZXIuYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZGluYXRlKTtcbiAgfVxuXG4gICNhaUF0dGFjayhib2FyZCkge1xuICAgIGxldCBjb29yZGluYXRlID0gdGhpcy4jcmFuZG9tQ29vcmQoKTtcbiAgICBpZiAodGhpcy5wcmV2aW91c1BsYXlzLmluY2x1ZGVzKGNvb3JkaW5hdGUpKSB7XG4gICAgICB0aGlzLiNhaUF0dGFjayhib2FyZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjb29yZGluYXRlO1xuICAgIH1cbiAgfVxuXG4gIC8vIEdlbmVyYXRlIHJhbmRvbSBjb29yZGluYXRlcyBiZXR3ZWVuIDAgLSA5LlxuICAjcmFuZG9tQ29vcmQoKSB7XG4gICAgcmV0dXJuIFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCksIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKV07XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoaXAge1xuICBjb25zdHJ1Y3RvcihzaXplKSB7XG4gICAgdGhpcy5sZW5ndGggPSBzaXplO1xuICAgIHRoaXMuaGl0cyA9IDA7XG4gICAgdGhpcy5zdW5rID0gZmFsc2U7XG4gIH1cblxuICBoaXQoKSB7XG4gICAgdGhpcy5oaXRzKys7XG4gICAgdGhpcy5pc1N1bmsoKTtcbiAgfVxuXG4gIGlzU3VuaygpIHtcbiAgICBpZiAodGhpcy5oaXRzID09PSB0aGlzLmxlbmd0aCkge1xuICAgICAgdGhpcy5zdW5rID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3VuaztcbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgR2FtZWxvb3AgZnJvbSBcIi4vZ2FtZWxvb3BcIjtcblxuY29uc3QgZ2FtZSA9IG5ldyBHYW1lbG9vcCgpO1xuZ2FtZS5zdGFydCgpO1xuIl0sIm5hbWVzIjpbIkRPTWJ1aWxkZXIiLCJjb25zdHJ1Y3RvciIsInNoaXBzIiwic2hpcE5hbWVzIiwic2hpcFNpemVzIiwiZ2FtZUNvbnRhaW5lciIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJwbGF5ZXJDb250YWluZXIiLCJjcmVhdGVFbGVtZW50IiwiYWlDb250YWluZXIiLCJjbGFzc0xpc3QiLCJhZGQiLCJwbGF5ZXJUaXRsZSIsInRleHRDb250ZW50IiwiYWlUaXRsZSIsInBsYXllckdyaWQiLCJncmlkUG9wdWxhdGUiLCJhaUdyaWQiLCJwbGF5ZXJNc2ciLCJjcmVhdGVUZXh0Tm9kZSIsInVwZGF0ZVBsYXllck1zZyIsImlkIiwib3JpZW50YXRpb25CdG4iLCJhcHBlbmQiLCJoaXQiLCJncmlkSXRlbSIsInJlbW92ZSIsIm1pc3MiLCJzaGlwIiwiaGlkZUVsZW1lbnQiLCJlbGVtZW50Iiwic3R5bGUiLCJkaXNwbGF5IiwiY291bnRlciIsIm1zZyIsIiNncmlkUG9wdWxhdGUiLCJwbGF5ZXIiLCJncmlkIiwiaSIsImRhdGFzZXQiLCJjb29yZGluYXRlcyIsImNvb3Jkc1BvcHVsYXRlIiwiYXBwZW5kQ2hpbGQiLCIjY29vcmRzUG9wdWxhdGUiLCJkaWdpdHMiLCJ0b1N0cmluZyIsInNwbGl0IiwiU2hpcCIsIkdhbWVib2FyZCIsImFsbFNoaXBzIiwibWlzc2VkU2hvdHMiLCJhbGxTaG90cyIsInBsYWNlU2hpcCIsInNpemUiLCJmaXJzdENvb3JkIiwib3JpZW50YXRpb24iLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJidWlsZENvb3JkaW5hdGVzIiwiZm9yRWFjaCIsImNvb3JkIiwiZmluZFNoaXAiLCJuZXdTaGlwIiwic2hpcEVudHJ5IiwicHVzaCIsInJlY2VpdmVBdHRhY2siLCJjb29yZGluYXRlIiwiZ2FtZU92ZXIiLCJhbGxTdW5rIiwiaXNTdW5rIiwiI2J1aWxkQ29vcmRpbmF0ZXMiLCIjZmluZFNoaXAiLCJmb3VuZFNoaXAiLCJzb21lIiwieCIsIlBsYXllciIsIkdhbWVsb29wIiwiaHVtYW4iLCJhaSIsInBsYXllcnMiLCJjdXJyZW50UGxheWVyIiwicm91bmQiLCJwYWdlIiwic3RhcnQiLCJhaVNoaXBzIiwiYWlHcmlkTGlzdGVuZXJzIiwiaHVtYW5HcmlkTGlzdGVuZXJzIiwiY3VycmVudFJvdW5kIiwicGxheVJvdW5kIiwiYWlBdHRhY2siLCJzZXRUaW1lb3V0Iiwib3JpZW50YXRpb25CdG5MaXN0ZW5lciIsImdyaWRJdGVtcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJwbGFjZW1lbnRDb3VudGVyIiwic2hpcFNpemUiLCJpdGVtIiwiYWRkRXZlbnRMaXN0ZW5lciIsImNvb3JkcyIsIm1hcCIsInBhcnNlSW50IiwiYm9hcmQiLCJmaW5kR3JpZEl0ZW0iLCIjb3JpZW50YXRpb25CdG5MaXN0ZW5lciIsInRleHQiLCIjYWlTaGlwcyIsImFpU2hpcFBsYWNlbWVudCIsIiNhaVNoaXBQbGFjZW1lbnQiLCJyYW5kb21OdW0iLCIjYWlBdHRhY2siLCJhaUNvb3JkU2VsZWN0b3IiLCIjYWlDb29yZFNlbGVjdG9yIiwic2hvdCIsIiNyYW5kb21OdW0iLCJtYXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCIjZmluZEdyaWRJdGVtIiwiZm91bmRJdGVtIiwiI2dhbWVPdmVyIiwiaXNIdW1hbiIsInByZXZpb3VzUGxheXMiLCJhdHRhY2siLCJyYW5kb21Db29yZCIsImluY2x1ZGVzIiwiI3JhbmRvbUNvb3JkIiwiaGl0cyIsInN1bmsiLCJnYW1lIl0sInNvdXJjZVJvb3QiOiIifQ==