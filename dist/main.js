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
    this.playerContainer.append(playerTitle, playerGrid);
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
    this.#aiShips();
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
game.aiGridListeners();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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IjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RvbUJ1aWxkZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lbG9vcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3BsYXllcnMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgRE9NYnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGNvbnN0IHNoaXBzID0geydDYXJyaWVyJzogNSwgJ0JhdHRsZXNoaXAnOiA0LCAnRGVzdHJveWVyJzogMywgJ1N1Ym1hcmluZSc6IDMsICdQYXRyb2wgQm9hdCc6IDJ9XG5cbiAgICB0aGlzLmdhbWVDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZS1jb250YWluZXInKTtcbiAgICAvLyBjcmVhdGUgY29udGFpbmVycyBmb3IgZWxlbWVudHM6XG4gICAgICAvLyAyIHBsYXllciBjb250YWluZXJzXG4gICAgdGhpcy5wbGF5ZXJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmFpQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5wbGF5ZXJDb250YWluZXIuY2xhc3NMaXN0LmFkZCgncGxheWVyLWNvbnRhaW5lcicpO1xuICAgIHRoaXMuYWlDb250YWluZXIuY2xhc3NMaXN0LmFkZCgncGxheWVyLWNvbnRhaW5lcicpO1xuICAgICAgLy8gZWFjaCBjb250YWluZXIgY29udGFpbnM6XG4gICAgICAgIC8vIFBsYXllciB0aXRsZVxuICAgICAgICBjb25zdCBwbGF5ZXJUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJylcbiAgICAgICAgcGxheWVyVGl0bGUudGV4dENvbnRlbnQgPSAnUGxheWVyJztcblxuICAgICAgICBjb25zdCBhaVRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbiAgICAgICAgYWlUaXRsZS50ZXh0Q29udGVudCA9ICdDb21wdXRlcic7XG5cbiAgICAgICAgLy8gR2FtZSBib2FyZCBncmlkICgxMCB4IDEwKVxuICAgICAgICBjb25zdCBwbGF5ZXJHcmlkID0gdGhpcy4jZ3JpZFBvcHVsYXRlKCdodW1hbicpO1xuICAgICAgICBjb25zdCBhaUdyaWQgPSB0aGlzLiNncmlkUG9wdWxhdGUoJ2FpJyk7XG5cbiAgICAgIHRoaXMucGxheWVyQ29udGFpbmVyLmFwcGVuZChwbGF5ZXJUaXRsZSwgcGxheWVyR3JpZCk7XG4gICAgICB0aGlzLmFpQ29udGFpbmVyLmFwcGVuZChhaVRpdGxlLCBhaUdyaWQpO1xuXG4gICAgdGhpcy5nYW1lQ29udGFpbmVyLmFwcGVuZCh0aGlzLnBsYXllckNvbnRhaW5lciwgdGhpcy5haUNvbnRhaW5lcik7XG4gIH1cblxuICBoaXQoZ3JpZEl0ZW0pIHtcbiAgICBncmlkSXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdzaGlwJyk7XG4gICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZCgnaGl0Jyk7XG4gIH07XG5cbiAgbWlzcyhncmlkSXRlbSkge1xuICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5hZGQoJ21pc3MnKTtcbiAgfVxuXG4gIHNoaXAoZ3JpZEl0ZW0pIHtcbiAgICBncmlkSXRlbS5jbGFzc0xpc3QuYWRkKCdzaGlwJyk7XG4gIH07XG5cbiAgI2dyaWRQb3B1bGF0ZShwbGF5ZXIpIHtcbiAgICBjb25zdCBncmlkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZ3JpZC5jbGFzc0xpc3QuYWRkKCdncmlkJywgcGxheWVyKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyBpKyspIHtcbiAgICAgIGNvbnN0IGdyaWRJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBncmlkSXRlbS5jbGFzc0xpc3QuYWRkKCdncmlkLWl0ZW0nLCBwbGF5ZXIpO1xuICAgICAgZ3JpZEl0ZW0uZGF0YXNldC5jb29yZGluYXRlcyA9IHRoaXMuI2Nvb3Jkc1BvcHVsYXRlKGkpO1xuICAgICAgZ3JpZC5hcHBlbmRDaGlsZChncmlkSXRlbSk7XG4gICAgfVxuICAgIHJldHVybiBncmlkO1xuICB9XG5cbiAgI2Nvb3Jkc1BvcHVsYXRlKGkpIHtcbiAgICBpZiAoaSA8IDEwKSB7XG4gICAgICByZXR1cm4gW2ksIDBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgZGlnaXRzID0gaS50b1N0cmluZygpLnNwbGl0KCcnKTtcbiAgICAgIHJldHVybiBbZGlnaXRzWzFdLCBkaWdpdHNbMF1dO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IFNoaXAgZnJvbSAnLi9zaGlwcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVib2FyZCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYWxsU2hpcHMgPSBbXTtcbiAgICB0aGlzLm1pc3NlZFNob3RzID0gW107XG4gIH07XG5cbiAgcGxhY2VTaGlwKHNpemUsIGZpcnN0Q29vcmQsIG9yaWVudGF0aW9uPSdob3Jpem9udGFsJykge1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gdGhpcy4jYnVpbGRDb29yZGluYXRlcyhzaXplLCBmaXJzdENvb3JkLCBvcmllbnRhdGlvbik7XG4gICAgY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmQpID0+IHtcbiAgICAgIC8vIElmIGEgc2hpcCBhbHJlYWR5IGV4aXN0cyBhdCBsb2NhdGlvbiwgcmVqZWN0IGl0LlxuICAgICAgaWYgKHRoaXMuI2ZpbmRTaGlwKGNvb3JkKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSlcbiAgICBjb25zdCBuZXdTaGlwID0gbmV3IFNoaXAoc2l6ZSk7XG4gICAgY29uc3Qgc2hpcEVudHJ5ID0gW25ld1NoaXAsIGNvb3JkaW5hdGVzXTtcbiAgICB0aGlzLmFsbFNoaXBzLnB1c2goc2hpcEVudHJ5KTtcbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gIH1cblxuICAvLyByZWNlaXZlQXR0YWNrIGZ1bmN0aW9uIHRha2VzIGNvb3JkaW5hdGVzLCBkZXRlcm1pbmVzIHdoZXRoZXIgb3Igbm90IHRoZSBhdHRhY2sgaGl0IGEgc2hpcFxuICAvLyB0aGVuIHNlbmRzIHRoZSDigJhoaXTigJkgZnVuY3Rpb24gdG8gdGhlIGNvcnJlY3Qgc2hpcCwgb3IgcmVjb3JkcyB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIG1pc3NlZCBzaG90LlxuICByZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGUpIHtcbiAgICBjb25zdCBzaGlwID0gdGhpcy4jZmluZFNoaXAoY29vcmRpbmF0ZSk7XG4gICAgaWYgKHNoaXApIHtcbiAgICAgIHNoaXAuaGl0KCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5taXNzZWRTaG90cy5wdXNoKGNvb3JkaW5hdGUpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGdhbWVPdmVyKCkge1xuICAgIGxldCBhbGxTdW5rID0gdHJ1ZTtcbiAgICB0aGlzLmFsbFNoaXBzLmZvckVhY2goc2hpcCA9PiB7XG4gICAgICBpZiAoIXNoaXBbMF0uaXNTdW5rKCkpIHtcbiAgICAgICAgYWxsU3VuayA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGFsbFN1bms7XG4gIH1cblxuICAjYnVpbGRDb29yZGluYXRlcyhzaXplLCBmaXJzdENvb3JkLCBvcmllbnRhdGlvbikge1xuICAgIGxldCBjb29yZGluYXRlcyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBpZiAob3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICBjb29yZGluYXRlcy5wdXNoKFtmaXJzdENvb3JkWzBdICsgaSwgZmlyc3RDb29yZFsxXV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29vcmRpbmF0ZXMucHVzaChbZmlyc3RDb29yZFswXSwgZmlyc3RDb29yZFsxXSArIGldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xuICB9XG5cbiAgI2ZpbmRTaGlwKGNvb3JkaW5hdGUpIHtcbiAgICBsZXQgZm91bmRTaGlwID0gZmFsc2U7XG4gICAgdGhpcy5hbGxTaGlwcy5mb3JFYWNoKHNoaXAgPT4ge1xuICAgICAgaWYgKHNoaXBbMV0uc29tZSgoeCkgPT4geFswXSA9PT0gY29vcmRpbmF0ZVswXSAmJiB4WzFdID09PSBjb29yZGluYXRlWzFdKSkge1xuICAgICAgICBmb3VuZFNoaXAgPSBzaGlwWzBdO1xuICAgIH19KVxuICAgIHJldHVybiBmb3VuZFNoaXA7XG4gIH1cbn1cbiIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vcGxheWVyc1wiO1xuaW1wb3J0IERPTWJ1aWxkZXIgZnJvbSBcIi4vZG9tQnVpbGRlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lbG9vcCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaHVtYW4gPSBuZXcgUGxheWVyKHRydWUpO1xuICAgIHRoaXMuYWkgPSBuZXcgUGxheWVyKGZhbHNlKTtcbiAgICB0aGlzLnBsYXllcnMgPSBbdGhpcy5odW1hbiwgdGhpcy5haV07XG4gICAgdGhpcy5wYWdlID0gbmV3IERPTWJ1aWxkZXIoKTtcbiAgICB0aGlzLiNhaVNoaXBzKCk7XG4gIH1cblxuICBhaUdyaWRMaXN0ZW5lcnMoKSB7XG4gICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ncmlkLWl0ZW0uYWlcIik7XG4gICAgZ3JpZEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgbGV0IGNvb3JkcyA9IGl0ZW0uZGF0YXNldC5jb29yZGluYXRlc1xuICAgICAgICAgIC5zcGxpdChcIixcIilcbiAgICAgICAgICAubWFwKCh4KSA9PiBwYXJzZUludCh4LCAxMCkpO1xuICAgICAgICBpZiAodGhpcy5haS5ib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkcykpIHtcbiAgICAgICAgICAvLyBpZiBhIHNoaXAgaXMgaGl0IHRoZW4gLi4uXG4gICAgICAgICAgdGhpcy5wYWdlLmhpdChpdGVtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBpZiBhIHNoaXAgaXMgbm90IGhpdCB0aGVuIC4uLlxuICAgICAgICAgIHRoaXMucGFnZS5taXNzKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gICNhaVNoaXBzKCkge1xuICAgIGNvbnN0IHNoaXBTaXplcyA9IFs1LCA0LCAzLCAzLCAyXTtcbiAgICBzaGlwU2l6ZXMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgbGV0IGNvb3JkaW5hdGVzID0gdGhpcy4jYWlTaGlwUGxhY2VtZW50KHNoaXApO1xuXG4gICAgICB3aGlsZSAoIWNvb3JkaW5hdGVzKSB7XG4gICAgICAgIGNvb3JkaW5hdGVzID0gdGhpcy4jYWlTaGlwUGxhY2VtZW50KHNoaXApO1xuICAgICAgfVxuXG4gICAgICBjb29yZGluYXRlcy5mb3JFYWNoKChjb29yZCkgPT4ge1xuICAgICAgICB0aGlzLnBhZ2Uuc2hpcCh0aGlzLiNmaW5kR3JpZEl0ZW0oY29vcmQsIFwiYWlcIikpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAjYWlTaGlwUGxhY2VtZW50KHNoaXApIHtcbiAgICBsZXQgb3JpZW50YXRpb24gPSB0aGlzLiNyYW5kb21OdW0oMikgPT09IDAgPyBcImhvcml6b250YWxcIiA6IFwidmVydGljYWxcIjtcbiAgICBsZXQgY29vcmQgPVxuICAgICAgb3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiXG4gICAgICAgID8gW3RoaXMuI3JhbmRvbU51bSgxMCAtIHNoaXApLCB0aGlzLiNyYW5kb21OdW0oMTApXVxuICAgICAgICA6IFt0aGlzLiNyYW5kb21OdW0oMTApLCB0aGlzLiNyYW5kb21OdW0oMTAgLSBzaGlwKV07XG4gICAgbGV0IGNvb3JkaW5hdGVzID0gdGhpcy5haS5ib2FyZC5wbGFjZVNoaXAoc2hpcCwgY29vcmQsIG9yaWVudGF0aW9uKTtcbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gIH1cblxuICAjcmFuZG9tTnVtKG1heCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xuICB9XG5cbiAgI2ZpbmRHcmlkSXRlbShjb29yZCwgcGxheWVyKSB7XG4gICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLmdyaWQtaXRlbS4ke3BsYXllcn1gKTtcbiAgICBsZXQgZm91bmRJdGVtID0gZmFsc2U7XG4gICAgZ3JpZEl0ZW1zLmZvckVhY2goKGdyaWRJdGVtKSA9PiB7XG4gICAgICBpZiAoZ3JpZEl0ZW0uZGF0YXNldC5jb29yZGluYXRlcyA9PT0gY29vcmQudG9TdHJpbmcoKSkge1xuICAgICAgICBmb3VuZEl0ZW0gPSBncmlkSXRlbTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZm91bmRJdGVtO1xuICB9XG59XG4iLCJpbXBvcnQgR2FtZWJvYXJkIGZyb20gXCIuL2dhbWVib2FyZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihodW1hbj10cnVlKSB7XG4gICAgdGhpcy5ib2FyZCA9IG5ldyBHYW1lYm9hcmQ7XG4gICAgdGhpcy5pc0h1bWFuID0gaHVtYW47XG4gICAgdGhpcy5wcmV2aW91c1BsYXlzID0gW107XG4gIH07XG5cbiAgYXR0YWNrKHBsYXllciwgY29vcmRpbmF0ZSkge1xuICAgIGlmICghdGhpcy5pc0h1bWFuKSB7XG4gICAgICBjb29yZGluYXRlID0gdGhpcy4jYWlBdHRhY2socGxheWVyLmJvYXJkKTtcbiAgICB9XG5cbiAgICB0aGlzLnByZXZpb3VzUGxheXMucHVzaChjb29yZGluYXRlKTtcbiAgICBwbGF5ZXIuYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZGluYXRlKTtcbiAgfVxuXG4gICNhaUF0dGFjayhib2FyZCkge1xuICAgIGxldCBjb29yZGluYXRlID0gdGhpcy4jcmFuZG9tQ29vcmQoKTtcbiAgICBpZiAodGhpcy5wcmV2aW91c1BsYXlzLmluY2x1ZGVzKGNvb3JkaW5hdGUpKSB7XG4gICAgICB0aGlzLiNhaUF0dGFjayhib2FyZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjb29yZGluYXRlO1xuICAgIH1cbiAgfVxuXG4gIC8vIEdlbmVyYXRlIHJhbmRvbSBjb29yZGluYXRlcyBiZXR3ZWVuIDAgLSA5LlxuICAjcmFuZG9tQ29vcmQoKSB7XG4gICAgcmV0dXJuIFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCksIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKV07XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoaXAge1xuICBjb25zdHJ1Y3RvcihzaXplKSB7XG4gICAgdGhpcy5sZW5ndGggPSBzaXplO1xuICAgIHRoaXMuaGl0cyA9IDA7XG4gICAgdGhpcy5zdW5rID0gZmFsc2U7XG4gIH1cblxuICBoaXQoKSB7XG4gICAgdGhpcy5oaXRzKys7XG4gICAgdGhpcy5pc1N1bmsoKTtcbiAgfVxuXG4gIGlzU3VuaygpIHtcbiAgICBpZiAodGhpcy5oaXRzID09PSB0aGlzLmxlbmd0aCkge1xuICAgICAgdGhpcy5zdW5rID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3VuaztcbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgR2FtZWxvb3AgZnJvbSBcIi4vZ2FtZWxvb3BcIjtcblxuY29uc3QgZ2FtZSA9IG5ldyBHYW1lbG9vcCgpO1xuZ2FtZS5haUdyaWRMaXN0ZW5lcnMoKTtcbiJdLCJuYW1lcyI6WyJET01idWlsZGVyIiwiY29uc3RydWN0b3IiLCJzaGlwcyIsImdhbWVDb250YWluZXIiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwicGxheWVyQ29udGFpbmVyIiwiY3JlYXRlRWxlbWVudCIsImFpQ29udGFpbmVyIiwiY2xhc3NMaXN0IiwiYWRkIiwicGxheWVyVGl0bGUiLCJ0ZXh0Q29udGVudCIsImFpVGl0bGUiLCJwbGF5ZXJHcmlkIiwiZ3JpZFBvcHVsYXRlIiwiYWlHcmlkIiwiYXBwZW5kIiwiaGl0IiwiZ3JpZEl0ZW0iLCJyZW1vdmUiLCJtaXNzIiwic2hpcCIsIiNncmlkUG9wdWxhdGUiLCJwbGF5ZXIiLCJncmlkIiwiaSIsImRhdGFzZXQiLCJjb29yZGluYXRlcyIsImNvb3Jkc1BvcHVsYXRlIiwiYXBwZW5kQ2hpbGQiLCIjY29vcmRzUG9wdWxhdGUiLCJkaWdpdHMiLCJ0b1N0cmluZyIsInNwbGl0IiwiU2hpcCIsIkdhbWVib2FyZCIsImFsbFNoaXBzIiwibWlzc2VkU2hvdHMiLCJwbGFjZVNoaXAiLCJzaXplIiwiZmlyc3RDb29yZCIsIm9yaWVudGF0aW9uIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwiYnVpbGRDb29yZGluYXRlcyIsImZvckVhY2giLCJjb29yZCIsImZpbmRTaGlwIiwibmV3U2hpcCIsInNoaXBFbnRyeSIsInB1c2giLCJyZWNlaXZlQXR0YWNrIiwiY29vcmRpbmF0ZSIsImdhbWVPdmVyIiwiYWxsU3VuayIsImlzU3VuayIsIiNidWlsZENvb3JkaW5hdGVzIiwiI2ZpbmRTaGlwIiwiZm91bmRTaGlwIiwic29tZSIsIngiLCJQbGF5ZXIiLCJHYW1lbG9vcCIsImh1bWFuIiwiYWkiLCJwbGF5ZXJzIiwicGFnZSIsImFpU2hpcHMiLCJhaUdyaWRMaXN0ZW5lcnMiLCJncmlkSXRlbXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaXRlbSIsImFkZEV2ZW50TGlzdGVuZXIiLCJjb29yZHMiLCJtYXAiLCJwYXJzZUludCIsImJvYXJkIiwiI2FpU2hpcHMiLCJzaGlwU2l6ZXMiLCJhaVNoaXBQbGFjZW1lbnQiLCJmaW5kR3JpZEl0ZW0iLCIjYWlTaGlwUGxhY2VtZW50IiwicmFuZG9tTnVtIiwiI3JhbmRvbU51bSIsIm1heCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIiNmaW5kR3JpZEl0ZW0iLCJmb3VuZEl0ZW0iLCJpc0h1bWFuIiwicHJldmlvdXNQbGF5cyIsImF0dGFjayIsImFpQXR0YWNrIiwiI2FpQXR0YWNrIiwicmFuZG9tQ29vcmQiLCJpbmNsdWRlcyIsIiNyYW5kb21Db29yZCIsImhpdHMiLCJzdW5rIiwiZ2FtZSJdLCJzb3VyY2VSb290IjoiIn0=