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
    this.page = new _domBuilder__WEBPACK_IMPORTED_MODULE_1__["default"]();
    this.shipTypes = {
      'Carrier': 5,
      'Battleship': 4,
      'Destroyer': 3,
      'Submarine': 3,
      'Patrol Boat': 2
    };
    this.#aiShips();
  }
  start() {
    this.aiGridListeners();
    this.humanGridListeners();
  }
  humanGridListeners() {
    this.#orientationBtnListener();
    const orientationBtn = document.getElementById('orientationBtn');
    const gridItems = document.querySelectorAll(".grid-item.human");
    let placementCounter = 0;
    let shipSize = [5, 4, 3, 3, 2];
    gridItems.forEach(item => {
      item.addEventListener("click", () => {
        if (placementCounter >= shipSize.length - 1) {
          this.page.hideElement(orientationBtn);
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

  // async humanBtnListener() {
  //   const humanShips = document.getElementById('playerShipsBtn');

  //   humanShips.addEventListener('click', async () => {
  //     this.#orientationBtnListener();
  //     for (let entry of Object.entries(this.shipTypes)) {
  //       const [shipType, shipSize] = entry;
  //       humanShips.textContent = `Place ${shipType}`;
  //       humanShips.dataset.shipSize = shipSize;
  //       await this.#humanGridListeners(shipSize);
  //     }
  //   })
  // }

  // async #humanGridListeners(shipSize) {
  //   const gridItems = document.querySelectorAll(".grid-item.human");

  //   gridItems.forEach(async (item) => {
  //     item.addEventListener("click", async () => {
  //       let coords = item.dataset.coordinates
  //         .split(",")
  //         .map((x) => parseInt(x, 10));
  //       this.human.board.placeShip(shipSize, coords, orientation);
  //     }).then(response => {
  //       return true;
  //     })
  //   });
  // }

  // async #humanShipPlacement(shipSize) {
  //   const orientation = document.getElementById('orientationBtn').textContent;
  //   const coord = this.#humanGridListeners();
  //   this.human.board.placeShip(shipSize, coord, orientation)
  // }

  #orientationBtnListener() {
    const orientation = document.getElementById('orientationBtn');
    orientation.display = 'block';
    orientation.addEventListener('click', () => {
      let text = orientation.textContent;
      orientation.textContent = text === 'horizontal' ? 'vertical' : 'horizontal';
    });
  }
  aiGridListeners() {
    const gridItems = document.querySelectorAll(".grid-item.ai");
    gridItems.forEach(item => {
      item.addEventListener("click", () => {
        let coords = item.dataset.coordinates.split(",").map(x => parseInt(x, 10));
        if (this.ai.board.receiveAttack(coords)) {
          // if a ship is hit then ...
          this.page.hit(item);
        } else {
          // if a ship is not hit then ...
          this.page.miss(item);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUFDekU7QUFDRjs7Ozs7Ozs7Ozs7Ozs7QUMvQmUsTUFBTTdELElBQUksQ0FBQztFQUN4Qi9DLFdBQVdBLENBQUNvRCxJQUFJLEVBQUU7SUFDaEIsSUFBSSxDQUFDSSxNQUFNLEdBQUdKLElBQUk7SUFDbEIsSUFBSSxDQUFDbUUsSUFBSSxHQUFHLENBQUM7SUFDYixJQUFJLENBQUNDLElBQUksR0FBRyxLQUFLO0VBQ25CO0VBRUFoRyxHQUFHQSxDQUFBLEVBQUc7SUFDSixJQUFJLENBQUMrRixJQUFJLEVBQUU7SUFDWCxJQUFJLENBQUNsRCxNQUFNLENBQUMsQ0FBQztFQUNmO0VBRUFBLE1BQU1BLENBQUEsRUFBRztJQUNQLElBQUksSUFBSSxDQUFDa0QsSUFBSSxLQUFLLElBQUksQ0FBQy9ELE1BQU0sRUFBRTtNQUM3QixJQUFJLENBQUNnRSxJQUFJLEdBQUcsSUFBSTtJQUNsQjtJQUNBLE9BQU8sSUFBSSxDQUFDQSxJQUFJO0VBQ2xCO0FBQ0Y7Ozs7OztVQ2xCQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTmtDO0FBRWxDLE1BQU1DLElBQUksR0FBRyxJQUFJN0MsaURBQVEsQ0FBQyxDQUFDO0FBQzNCNkMsSUFBSSxDQUFDdEMsS0FBSyxDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZG9tQnVpbGRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVsb29wLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcGxheWVycy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NjcmlwdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBET01idWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY29uc3Qgc2hpcHMgPSB7J0NhcnJpZXInOiA1LCAnQmF0dGxlc2hpcCc6IDQsICdEZXN0cm95ZXInOiAzLCAnU3VibWFyaW5lJzogMywgJ1BhdHJvbCBCb2F0JzogMn1cbiAgICB0aGlzLnNoaXBOYW1lcyA9IFsnQ2FycmllcicsICdCYXR0bGVzaGlwJywgJ0Rlc3Ryb3llcicsICdTdWJtYXJpbmUnLCAnUGF0cm9sIEJvYXQnXTtcbiAgICB0aGlzLnNoaXBTaXplcyA9IFs1LCA0LCAzLCAzLCAyXTtcblxuICAgIHRoaXMuZ2FtZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLWNvbnRhaW5lcicpO1xuICAgIC8vIGNyZWF0ZSBjb250YWluZXJzIGZvciBlbGVtZW50czpcbiAgICAgIC8vIDIgcGxheWVyIGNvbnRhaW5lcnNcbiAgICB0aGlzLnBsYXllckNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuYWlDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLnBsYXllckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItY29udGFpbmVyJyk7XG4gICAgdGhpcy5haUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItY29udGFpbmVyJyk7XG4gICAgICAvLyBlYWNoIGNvbnRhaW5lciBjb250YWluczpcbiAgICAgICAgLy8gUGxheWVyIHRpdGxlXG4gICAgICAgIGNvbnN0IHBsYXllclRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKVxuICAgICAgICBwbGF5ZXJUaXRsZS50ZXh0Q29udGVudCA9ICdQbGF5ZXInO1xuXG4gICAgICAgIGNvbnN0IGFpVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICAgICAgICBhaVRpdGxlLnRleHRDb250ZW50ID0gJ0NvbXB1dGVyJztcblxuICAgICAgICAvLyBHYW1lIGJvYXJkIGdyaWQgKDEwIHggMTApXG4gICAgICAgIGNvbnN0IHBsYXllckdyaWQgPSB0aGlzLiNncmlkUG9wdWxhdGUoJ2h1bWFuJyk7XG4gICAgICAgIGNvbnN0IGFpR3JpZCA9IHRoaXMuI2dyaWRQb3B1bGF0ZSgnYWknKTtcblxuICAgICAgICB0aGlzLnBsYXllck1zZyA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICAgICAgdGhpcy51cGRhdGVQbGF5ZXJNc2coMCk7XG4gICAgICAgIHRoaXMucGxheWVyTXNnLmlkID0gJ3BsYXllck1zZyc7XG5cbiAgICAgICAgY29uc3Qgb3JpZW50YXRpb25CdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgb3JpZW50YXRpb25CdG4udGV4dENvbnRlbnQgPSAnaG9yaXpvbnRhbCc7XG4gICAgICAgIG9yaWVudGF0aW9uQnRuLmlkID0gJ29yaWVudGF0aW9uQnRuJztcblxuICAgICAgdGhpcy5wbGF5ZXJDb250YWluZXIuYXBwZW5kKHBsYXllclRpdGxlLCBwbGF5ZXJHcmlkLCB0aGlzLnBsYXllck1zZywgb3JpZW50YXRpb25CdG4pO1xuICAgICAgdGhpcy5haUNvbnRhaW5lci5hcHBlbmQoYWlUaXRsZSwgYWlHcmlkKTtcblxuICAgIHRoaXMuZ2FtZUNvbnRhaW5lci5hcHBlbmQodGhpcy5wbGF5ZXJDb250YWluZXIsIHRoaXMuYWlDb250YWluZXIpO1xuICB9XG5cbiAgaGl0KGdyaWRJdGVtKSB7XG4gICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnc2hpcCcpO1xuICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5hZGQoJ2hpdCcpO1xuICB9O1xuXG4gIG1pc3MoZ3JpZEl0ZW0pIHtcbiAgICBncmlkSXRlbS5jbGFzc0xpc3QuYWRkKCdtaXNzJyk7XG4gIH1cblxuICBzaGlwKGdyaWRJdGVtKSB7XG4gICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZCgnc2hpcCcpO1xuICB9O1xuXG4gIGhpZGVFbGVtZW50KGVsZW1lbnQpIHtcbiAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIH1cblxuICB1cGRhdGVQbGF5ZXJNc2coY291bnRlcikge1xuICAgIGxldCBtc2cgPSB0aGlzLnBsYXllck1zZztcbiAgICBpZiAoY291bnRlciA8IDUpIHtcbiAgICAgIG1zZy50ZXh0Q29udGVudCA9IGBDbGljayBncmlkIHRvIHBsYWNlICR7dGhpcy5zaGlwTmFtZXNbY291bnRlcl19IChzaXplOiAke3RoaXMuc2hpcFNpemVzW2NvdW50ZXJdfSlgXG4gICAgfSBlbHNlIHtcbiAgICAgIG1zZy50ZXh0Q29udGVudCA9ICcnO1xuICAgIH1cbiAgfVxuXG4gICNncmlkUG9wdWxhdGUocGxheWVyKSB7XG4gICAgY29uc3QgZ3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGdyaWQuY2xhc3NMaXN0LmFkZCgnZ3JpZCcsIHBsYXllcik7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDsgaSsrKSB7XG4gICAgICBjb25zdCBncmlkSXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZCgnZ3JpZC1pdGVtJywgcGxheWVyKTtcbiAgICAgIGdyaWRJdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXMgPSB0aGlzLiNjb29yZHNQb3B1bGF0ZShpKTtcbiAgICAgIGdyaWQuYXBwZW5kQ2hpbGQoZ3JpZEl0ZW0pO1xuICAgIH1cbiAgICByZXR1cm4gZ3JpZDtcbiAgfVxuXG4gICNjb29yZHNQb3B1bGF0ZShpKSB7XG4gICAgaWYgKGkgPCAxMCkge1xuICAgICAgcmV0dXJuIFtpLCAwXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGRpZ2l0cyA9IGkudG9TdHJpbmcoKS5zcGxpdCgnJyk7XG4gICAgICByZXR1cm4gW2RpZ2l0c1sxXSwgZGlnaXRzWzBdXTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBTaGlwIGZyb20gJy4vc2hpcHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lYm9hcmQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFsbFNoaXBzID0gW107XG4gICAgdGhpcy5taXNzZWRTaG90cyA9IFtdO1xuICB9O1xuXG4gIHBsYWNlU2hpcChzaXplLCBmaXJzdENvb3JkLCBvcmllbnRhdGlvbj0naG9yaXpvbnRhbCcpIHtcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IHRoaXMuI2J1aWxkQ29vcmRpbmF0ZXMoc2l6ZSwgZmlyc3RDb29yZCwgb3JpZW50YXRpb24pO1xuICAgIGNvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkKSA9PiB7XG4gICAgICAvLyBJZiBhIHNoaXAgYWxyZWFkeSBleGlzdHMgYXQgbG9jYXRpb24sIHJlamVjdCBpdC5cbiAgICAgIGlmICh0aGlzLiNmaW5kU2hpcChjb29yZCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pXG4gICAgY29uc3QgbmV3U2hpcCA9IG5ldyBTaGlwKHNpemUpO1xuICAgIGNvbnN0IHNoaXBFbnRyeSA9IFtuZXdTaGlwLCBjb29yZGluYXRlc107XG4gICAgdGhpcy5hbGxTaGlwcy5wdXNoKHNoaXBFbnRyeSk7XG4gICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xuICB9XG5cbiAgLy8gcmVjZWl2ZUF0dGFjayBmdW5jdGlvbiB0YWtlcyBjb29yZGluYXRlcywgZGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCB0aGUgYXR0YWNrIGhpdCBhIHNoaXBcbiAgLy8gdGhlbiBzZW5kcyB0aGUg4oCYaGl04oCZIGZ1bmN0aW9uIHRvIHRoZSBjb3JyZWN0IHNoaXAsIG9yIHJlY29yZHMgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBtaXNzZWQgc2hvdC5cbiAgcmVjZWl2ZUF0dGFjayhjb29yZGluYXRlKSB7XG4gICAgY29uc3Qgc2hpcCA9IHRoaXMuI2ZpbmRTaGlwKGNvb3JkaW5hdGUpO1xuICAgIGlmIChzaGlwKSB7XG4gICAgICBzaGlwLmhpdCgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWlzc2VkU2hvdHMucHVzaChjb29yZGluYXRlKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBnYW1lT3ZlcigpIHtcbiAgICBsZXQgYWxsU3VuayA9IHRydWU7XG4gICAgdGhpcy5hbGxTaGlwcy5mb3JFYWNoKHNoaXAgPT4ge1xuICAgICAgaWYgKCFzaGlwWzBdLmlzU3VuaygpKSB7XG4gICAgICAgIGFsbFN1bmsgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBhbGxTdW5rO1xuICB9XG5cbiAgI2J1aWxkQ29vcmRpbmF0ZXMoc2l6ZSwgZmlyc3RDb29yZCwgb3JpZW50YXRpb24pIHtcbiAgICBsZXQgY29vcmRpbmF0ZXMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgaWYgKG9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgY29vcmRpbmF0ZXMucHVzaChbZmlyc3RDb29yZFswXSArIGksIGZpcnN0Q29vcmRbMV1dKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvb3JkaW5hdGVzLnB1c2goW2ZpcnN0Q29vcmRbMF0sIGZpcnN0Q29vcmRbMV0gKyBpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb29yZGluYXRlcztcbiAgfVxuXG4gICNmaW5kU2hpcChjb29yZGluYXRlKSB7XG4gICAgbGV0IGZvdW5kU2hpcCA9IGZhbHNlO1xuICAgIHRoaXMuYWxsU2hpcHMuZm9yRWFjaChzaGlwID0+IHtcbiAgICAgIGlmIChzaGlwWzFdLnNvbWUoKHgpID0+IHhbMF0gPT09IGNvb3JkaW5hdGVbMF0gJiYgeFsxXSA9PT0gY29vcmRpbmF0ZVsxXSkpIHtcbiAgICAgICAgZm91bmRTaGlwID0gc2hpcFswXTtcbiAgICB9fSlcbiAgICByZXR1cm4gZm91bmRTaGlwO1xuICB9XG59XG4iLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuL3BsYXllcnNcIjtcbmltcG9ydCBET01idWlsZGVyIGZyb20gXCIuL2RvbUJ1aWxkZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZWxvb3Age1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmh1bWFuID0gbmV3IFBsYXllcih0cnVlKTtcbiAgICB0aGlzLmFpID0gbmV3IFBsYXllcihmYWxzZSk7XG4gICAgdGhpcy5wbGF5ZXJzID0gW3RoaXMuaHVtYW4sIHRoaXMuYWldO1xuICAgIHRoaXMucGFnZSA9IG5ldyBET01idWlsZGVyKCk7XG4gICAgdGhpcy5zaGlwVHlwZXMgPSB7J0NhcnJpZXInOiA1LCAnQmF0dGxlc2hpcCc6IDQsICdEZXN0cm95ZXInOiAzLCAnU3VibWFyaW5lJzogMywgJ1BhdHJvbCBCb2F0JzogMn1cbiAgICB0aGlzLiNhaVNoaXBzKCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLmFpR3JpZExpc3RlbmVycygpO1xuICAgIHRoaXMuaHVtYW5HcmlkTGlzdGVuZXJzKCk7XG4gIH1cblxuICBodW1hbkdyaWRMaXN0ZW5lcnMoKSB7XG4gICAgdGhpcy4jb3JpZW50YXRpb25CdG5MaXN0ZW5lcigpO1xuICAgIGNvbnN0IG9yaWVudGF0aW9uQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ29yaWVudGF0aW9uQnRuJyk7XG4gICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ncmlkLWl0ZW0uaHVtYW5cIik7XG4gICAgbGV0IHBsYWNlbWVudENvdW50ZXIgPSAwO1xuICAgIGxldCBzaGlwU2l6ZSA9IFs1LCA0LCAzLCAzLCAyXTtcblxuICAgIGdyaWRJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGlmIChwbGFjZW1lbnRDb3VudGVyID49IHNoaXBTaXplLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICB0aGlzLnBhZ2UuaGlkZUVsZW1lbnQob3JpZW50YXRpb25CdG4pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9yaWVudGF0aW9uID0gb3JpZW50YXRpb25CdG4udGV4dENvbnRlbnQ7XG4gICAgICAgIGxldCBjb29yZHMgPSBpdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXNcbiAgICAgICAgICAuc3BsaXQoXCIsXCIpXG4gICAgICAgICAgLm1hcCgoeCkgPT4gcGFyc2VJbnQoeCwgMTApKTtcbiAgICAgICAgbGV0IGNvb3JkaW5hdGVzID0gdGhpcy5odW1hbi5ib2FyZC5wbGFjZVNoaXAoc2hpcFNpemVbcGxhY2VtZW50Q291bnRlcl0sIGNvb3Jkcywgb3JpZW50YXRpb24pO1xuICAgICAgICAvLyBTaG93IHNoaXAgb24gc2NyZWVuLlxuICAgICAgICBjb29yZGluYXRlcy5mb3JFYWNoKChjb29yZCkgPT4ge1xuICAgICAgICAgIHRoaXMucGFnZS5zaGlwKHRoaXMuI2ZpbmRHcmlkSXRlbShjb29yZCwgXCJodW1hblwiKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBwbGFjZW1lbnRDb3VudGVyKys7XG4gICAgICAgIHRoaXMucGFnZS51cGRhdGVQbGF5ZXJNc2cocGxhY2VtZW50Q291bnRlcik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIGFzeW5jIGh1bWFuQnRuTGlzdGVuZXIoKSB7XG4gIC8vICAgY29uc3QgaHVtYW5TaGlwcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5ZXJTaGlwc0J0bicpO1xuXG4gIC8vICAgaHVtYW5TaGlwcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jICgpID0+IHtcbiAgLy8gICAgIHRoaXMuI29yaWVudGF0aW9uQnRuTGlzdGVuZXIoKTtcbiAgLy8gICAgIGZvciAobGV0IGVudHJ5IG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuc2hpcFR5cGVzKSkge1xuICAvLyAgICAgICBjb25zdCBbc2hpcFR5cGUsIHNoaXBTaXplXSA9IGVudHJ5O1xuICAvLyAgICAgICBodW1hblNoaXBzLnRleHRDb250ZW50ID0gYFBsYWNlICR7c2hpcFR5cGV9YDtcbiAgLy8gICAgICAgaHVtYW5TaGlwcy5kYXRhc2V0LnNoaXBTaXplID0gc2hpcFNpemU7XG4gIC8vICAgICAgIGF3YWl0IHRoaXMuI2h1bWFuR3JpZExpc3RlbmVycyhzaGlwU2l6ZSk7XG4gIC8vICAgICB9XG4gIC8vICAgfSlcbiAgLy8gfVxuXG4gIC8vIGFzeW5jICNodW1hbkdyaWRMaXN0ZW5lcnMoc2hpcFNpemUpIHtcbiAgLy8gICBjb25zdCBncmlkSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdyaWQtaXRlbS5odW1hblwiKTtcblxuICAvLyAgIGdyaWRJdGVtcy5mb3JFYWNoKGFzeW5jIChpdGVtKSA9PiB7XG4gIC8vICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XG4gIC8vICAgICAgIGxldCBjb29yZHMgPSBpdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXNcbiAgLy8gICAgICAgICAuc3BsaXQoXCIsXCIpXG4gIC8vICAgICAgICAgLm1hcCgoeCkgPT4gcGFyc2VJbnQoeCwgMTApKTtcbiAgLy8gICAgICAgdGhpcy5odW1hbi5ib2FyZC5wbGFjZVNoaXAoc2hpcFNpemUsIGNvb3Jkcywgb3JpZW50YXRpb24pO1xuICAvLyAgICAgfSkudGhlbihyZXNwb25zZSA9PiB7XG4gIC8vICAgICAgIHJldHVybiB0cnVlO1xuICAvLyAgICAgfSlcbiAgLy8gICB9KTtcbiAgLy8gfVxuXG4gIC8vIGFzeW5jICNodW1hblNoaXBQbGFjZW1lbnQoc2hpcFNpemUpIHtcbiAgLy8gICBjb25zdCBvcmllbnRhdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvcmllbnRhdGlvbkJ0bicpLnRleHRDb250ZW50O1xuICAvLyAgIGNvbnN0IGNvb3JkID0gdGhpcy4jaHVtYW5HcmlkTGlzdGVuZXJzKCk7XG4gIC8vICAgdGhpcy5odW1hbi5ib2FyZC5wbGFjZVNoaXAoc2hpcFNpemUsIGNvb3JkLCBvcmllbnRhdGlvbilcbiAgLy8gfVxuXG4gICNvcmllbnRhdGlvbkJ0bkxpc3RlbmVyKCkge1xuICAgIGNvbnN0IG9yaWVudGF0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ29yaWVudGF0aW9uQnRuJyk7XG4gICAgb3JpZW50YXRpb24uZGlzcGxheSA9ICdibG9jayc7XG5cbiAgICBvcmllbnRhdGlvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGxldCB0ZXh0ID0gb3JpZW50YXRpb24udGV4dENvbnRlbnQ7XG4gICAgICBvcmllbnRhdGlvbi50ZXh0Q29udGVudCA9IHRleHQgPT09ICdob3Jpem9udGFsJyA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XG4gICAgfSlcbiAgfVxuXG4gIGFpR3JpZExpc3RlbmVycygpIHtcbiAgICBjb25zdCBncmlkSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdyaWQtaXRlbS5haVwiKTtcbiAgICBncmlkSXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBsZXQgY29vcmRzID0gaXRlbS5kYXRhc2V0LmNvb3JkaW5hdGVzXG4gICAgICAgICAgLnNwbGl0KFwiLFwiKVxuICAgICAgICAgIC5tYXAoKHgpID0+IHBhcnNlSW50KHgsIDEwKSk7XG4gICAgICAgIGlmICh0aGlzLmFpLmJvYXJkLnJlY2VpdmVBdHRhY2soY29vcmRzKSkge1xuICAgICAgICAgIC8vIGlmIGEgc2hpcCBpcyBoaXQgdGhlbiAuLi5cbiAgICAgICAgICB0aGlzLnBhZ2UuaGl0KGl0ZW0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGlmIGEgc2hpcCBpcyBub3QgaGl0IHRoZW4gLi4uXG4gICAgICAgICAgdGhpcy5wYWdlLm1pc3MoaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgI2FpU2hpcHMoKSB7XG4gICAgY29uc3Qgc2hpcFNpemVzID0gWzUsIDQsIDMsIDMsIDJdO1xuICAgIHNoaXBTaXplcy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBsZXQgY29vcmRpbmF0ZXMgPSB0aGlzLiNhaVNoaXBQbGFjZW1lbnQoc2hpcCk7XG5cbiAgICAgIHdoaWxlICghY29vcmRpbmF0ZXMpIHtcbiAgICAgICAgY29vcmRpbmF0ZXMgPSB0aGlzLiNhaVNoaXBQbGFjZW1lbnQoc2hpcCk7XG4gICAgICB9XG5cbiAgICAgIC8vIHNob3cgYWkgc2hpcHMgd2hpbGUgdGVzdGluZy5cbiAgICAgIGNvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkKSA9PiB7XG4gICAgICAgIHRoaXMucGFnZS5zaGlwKHRoaXMuI2ZpbmRHcmlkSXRlbShjb29yZCwgXCJhaVwiKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gICNhaVNoaXBQbGFjZW1lbnQoc2hpcCkge1xuICAgIGxldCBvcmllbnRhdGlvbiA9IHRoaXMuI3JhbmRvbU51bSgyKSA9PT0gMCA/IFwiaG9yaXpvbnRhbFwiIDogXCJ2ZXJ0aWNhbFwiO1xuICAgIGxldCBjb29yZCA9XG4gICAgICBvcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCJcbiAgICAgICAgPyBbdGhpcy4jcmFuZG9tTnVtKDEwIC0gc2hpcCksIHRoaXMuI3JhbmRvbU51bSgxMCldXG4gICAgICAgIDogW3RoaXMuI3JhbmRvbU51bSgxMCksIHRoaXMuI3JhbmRvbU51bSgxMCAtIHNoaXApXTtcbiAgICBsZXQgY29vcmRpbmF0ZXMgPSB0aGlzLmFpLmJvYXJkLnBsYWNlU2hpcChzaGlwLCBjb29yZCwgb3JpZW50YXRpb24pO1xuICAgIHJldHVybiBjb29yZGluYXRlcztcbiAgfVxuXG4gICNyYW5kb21OdW0obWF4KSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1heCk7XG4gIH1cblxuICAjZmluZEdyaWRJdGVtKGNvb3JkLCBwbGF5ZXIpIHtcbiAgICBjb25zdCBncmlkSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuZ3JpZC1pdGVtLiR7cGxheWVyfWApO1xuICAgIGxldCBmb3VuZEl0ZW0gPSBmYWxzZTtcbiAgICBncmlkSXRlbXMuZm9yRWFjaCgoZ3JpZEl0ZW0pID0+IHtcbiAgICAgIGlmIChncmlkSXRlbS5kYXRhc2V0LmNvb3JkaW5hdGVzID09PSBjb29yZC50b1N0cmluZygpKSB7XG4gICAgICAgIGZvdW5kSXRlbSA9IGdyaWRJdGVtO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBmb3VuZEl0ZW07XG4gIH1cbn1cbiIsImltcG9ydCBHYW1lYm9hcmQgZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKGh1bWFuPXRydWUpIHtcbiAgICB0aGlzLmJvYXJkID0gbmV3IEdhbWVib2FyZDtcbiAgICB0aGlzLmlzSHVtYW4gPSBodW1hbjtcbiAgICB0aGlzLnByZXZpb3VzUGxheXMgPSBbXTtcbiAgfTtcblxuICBhdHRhY2socGxheWVyLCBjb29yZGluYXRlKSB7XG4gICAgaWYgKCF0aGlzLmlzSHVtYW4pIHtcbiAgICAgIGNvb3JkaW5hdGUgPSB0aGlzLiNhaUF0dGFjayhwbGF5ZXIuYm9hcmQpO1xuICAgIH1cblxuICAgIHRoaXMucHJldmlvdXNQbGF5cy5wdXNoKGNvb3JkaW5hdGUpO1xuICAgIHBsYXllci5ib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGUpO1xuICB9XG5cbiAgI2FpQXR0YWNrKGJvYXJkKSB7XG4gICAgbGV0IGNvb3JkaW5hdGUgPSB0aGlzLiNyYW5kb21Db29yZCgpO1xuICAgIGlmICh0aGlzLnByZXZpb3VzUGxheXMuaW5jbHVkZXMoY29vcmRpbmF0ZSkpIHtcbiAgICAgIHRoaXMuI2FpQXR0YWNrKGJvYXJkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNvb3JkaW5hdGU7XG4gICAgfVxuICB9XG5cbiAgLy8gR2VuZXJhdGUgcmFuZG9tIGNvb3JkaW5hdGVzIGJldHdlZW4gMCAtIDkuXG4gICNyYW5kb21Db29yZCgpIHtcbiAgICByZXR1cm4gW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSwgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApXTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hpcCB7XG4gIGNvbnN0cnVjdG9yKHNpemUpIHtcbiAgICB0aGlzLmxlbmd0aCA9IHNpemU7XG4gICAgdGhpcy5oaXRzID0gMDtcbiAgICB0aGlzLnN1bmsgPSBmYWxzZTtcbiAgfVxuXG4gIGhpdCgpIHtcbiAgICB0aGlzLmhpdHMrKztcbiAgICB0aGlzLmlzU3VuaygpO1xuICB9XG5cbiAgaXNTdW5rKCkge1xuICAgIGlmICh0aGlzLmhpdHMgPT09IHRoaXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLnN1bmsgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdW5rO1xuICB9XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBHYW1lbG9vcCBmcm9tIFwiLi9nYW1lbG9vcFwiO1xuXG5jb25zdCBnYW1lID0gbmV3IEdhbWVsb29wKCk7XG5nYW1lLnN0YXJ0KCk7XG4iXSwibmFtZXMiOlsiRE9NYnVpbGRlciIsImNvbnN0cnVjdG9yIiwic2hpcHMiLCJzaGlwTmFtZXMiLCJzaGlwU2l6ZXMiLCJnYW1lQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInBsYXllckNvbnRhaW5lciIsImNyZWF0ZUVsZW1lbnQiLCJhaUNvbnRhaW5lciIsImNsYXNzTGlzdCIsImFkZCIsInBsYXllclRpdGxlIiwidGV4dENvbnRlbnQiLCJhaVRpdGxlIiwicGxheWVyR3JpZCIsImdyaWRQb3B1bGF0ZSIsImFpR3JpZCIsInBsYXllck1zZyIsImNyZWF0ZVRleHROb2RlIiwidXBkYXRlUGxheWVyTXNnIiwiaWQiLCJvcmllbnRhdGlvbkJ0biIsImFwcGVuZCIsImhpdCIsImdyaWRJdGVtIiwicmVtb3ZlIiwibWlzcyIsInNoaXAiLCJoaWRlRWxlbWVudCIsImVsZW1lbnQiLCJzdHlsZSIsImRpc3BsYXkiLCJjb3VudGVyIiwibXNnIiwiI2dyaWRQb3B1bGF0ZSIsInBsYXllciIsImdyaWQiLCJpIiwiZGF0YXNldCIsImNvb3JkaW5hdGVzIiwiY29vcmRzUG9wdWxhdGUiLCJhcHBlbmRDaGlsZCIsIiNjb29yZHNQb3B1bGF0ZSIsImRpZ2l0cyIsInRvU3RyaW5nIiwic3BsaXQiLCJTaGlwIiwiR2FtZWJvYXJkIiwiYWxsU2hpcHMiLCJtaXNzZWRTaG90cyIsInBsYWNlU2hpcCIsInNpemUiLCJmaXJzdENvb3JkIiwib3JpZW50YXRpb24iLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJidWlsZENvb3JkaW5hdGVzIiwiZm9yRWFjaCIsImNvb3JkIiwiZmluZFNoaXAiLCJuZXdTaGlwIiwic2hpcEVudHJ5IiwicHVzaCIsInJlY2VpdmVBdHRhY2siLCJjb29yZGluYXRlIiwiZ2FtZU92ZXIiLCJhbGxTdW5rIiwiaXNTdW5rIiwiI2J1aWxkQ29vcmRpbmF0ZXMiLCIjZmluZFNoaXAiLCJmb3VuZFNoaXAiLCJzb21lIiwieCIsIlBsYXllciIsIkdhbWVsb29wIiwiaHVtYW4iLCJhaSIsInBsYXllcnMiLCJwYWdlIiwic2hpcFR5cGVzIiwiYWlTaGlwcyIsInN0YXJ0IiwiYWlHcmlkTGlzdGVuZXJzIiwiaHVtYW5HcmlkTGlzdGVuZXJzIiwib3JpZW50YXRpb25CdG5MaXN0ZW5lciIsImdyaWRJdGVtcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJwbGFjZW1lbnRDb3VudGVyIiwic2hpcFNpemUiLCJpdGVtIiwiYWRkRXZlbnRMaXN0ZW5lciIsImNvb3JkcyIsIm1hcCIsInBhcnNlSW50IiwiYm9hcmQiLCJmaW5kR3JpZEl0ZW0iLCIjb3JpZW50YXRpb25CdG5MaXN0ZW5lciIsInRleHQiLCIjYWlTaGlwcyIsImFpU2hpcFBsYWNlbWVudCIsIiNhaVNoaXBQbGFjZW1lbnQiLCJyYW5kb21OdW0iLCIjcmFuZG9tTnVtIiwibWF4IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiI2ZpbmRHcmlkSXRlbSIsImZvdW5kSXRlbSIsImlzSHVtYW4iLCJwcmV2aW91c1BsYXlzIiwiYXR0YWNrIiwiYWlBdHRhY2siLCIjYWlBdHRhY2siLCJyYW5kb21Db29yZCIsImluY2x1ZGVzIiwiI3JhbmRvbUNvb3JkIiwiaGl0cyIsInN1bmsiLCJnYW1lIl0sInNvdXJjZVJvb3QiOiIifQ==