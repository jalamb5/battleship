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
    let hitShip = false;
    this.allShips.forEach(ship => {
      if (ship[1].some(x => x = coordinate)) {
        hitShip = ship[0];
      }
    });
    return hitShip;
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
  gridListeners() {
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => {
      item.addEventListener("click", () => {
        let coords = item.dataset.coordinates.split(',').map(x => parseInt(x, 10));
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
      let coord = [this.#randomNum(10 - ship), this.#randomNum(10 - ship)];
      let orientation = this.#randomNum(2) === 0 ? 'horizontal' : 'vertical';
      const shipLocations = this.ai.board.placeShip(ship, coord, orientation);
      shipLocations.forEach(location => {
        this.page.ship(this.#findGridItem(location, 'ai'));
      });
    });
  }
  #randomNum(max) {
    return Math.floor(Math.random() * max);
  }
  #findGridItem(coords, player) {
    const gridItems = document.querySelectorAll(`.grid-item.${player}`);
    let foundItem = false;
    gridItems.forEach(gridItem => {
      if (gridItem.dataset.coordinates === coords.toString()) {
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
game.gridListeners();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNsQjtBQUNGOzs7Ozs7VUNsQkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05rQztBQUVsQyxNQUFNQyxJQUFJLEdBQUcsSUFBSXZDLGlEQUFRLENBQUMsQ0FBQztBQUMzQnVDLElBQUksQ0FBQ2pDLGFBQWEsQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RvbUJ1aWxkZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lbG9vcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3BsYXllcnMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgRE9NYnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGNvbnN0IHNoaXBzID0geydDYXJyaWVyJzogNSwgJ0JhdHRsZXNoaXAnOiA0LCAnRGVzdHJveWVyJzogMywgJ1N1Ym1hcmluZSc6IDMsICdQYXRyb2wgQm9hdCc6IDJ9XG5cbiAgICB0aGlzLmdhbWVDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZS1jb250YWluZXInKTtcbiAgICAvLyBjcmVhdGUgY29udGFpbmVycyBmb3IgZWxlbWVudHM6XG4gICAgICAvLyAyIHBsYXllciBjb250YWluZXJzXG4gICAgdGhpcy5wbGF5ZXJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmFpQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5wbGF5ZXJDb250YWluZXIuY2xhc3NMaXN0LmFkZCgncGxheWVyLWNvbnRhaW5lcicpO1xuICAgIHRoaXMuYWlDb250YWluZXIuY2xhc3NMaXN0LmFkZCgncGxheWVyLWNvbnRhaW5lcicpO1xuICAgICAgLy8gZWFjaCBjb250YWluZXIgY29udGFpbnM6XG4gICAgICAgIC8vIFBsYXllciB0aXRsZVxuICAgICAgICBjb25zdCBwbGF5ZXJUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJylcbiAgICAgICAgcGxheWVyVGl0bGUudGV4dENvbnRlbnQgPSAnUGxheWVyJztcblxuICAgICAgICBjb25zdCBhaVRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbiAgICAgICAgYWlUaXRsZS50ZXh0Q29udGVudCA9ICdDb21wdXRlcic7XG5cbiAgICAgICAgLy8gR2FtZSBib2FyZCBncmlkICgxMCB4IDEwKVxuICAgICAgICBjb25zdCBwbGF5ZXJHcmlkID0gdGhpcy4jZ3JpZFBvcHVsYXRlKCdodW1hbicpO1xuICAgICAgICBjb25zdCBhaUdyaWQgPSB0aGlzLiNncmlkUG9wdWxhdGUoJ2FpJyk7XG5cbiAgICAgIHRoaXMucGxheWVyQ29udGFpbmVyLmFwcGVuZChwbGF5ZXJUaXRsZSwgcGxheWVyR3JpZCk7XG4gICAgICB0aGlzLmFpQ29udGFpbmVyLmFwcGVuZChhaVRpdGxlLCBhaUdyaWQpO1xuXG4gICAgdGhpcy5nYW1lQ29udGFpbmVyLmFwcGVuZCh0aGlzLnBsYXllckNvbnRhaW5lciwgdGhpcy5haUNvbnRhaW5lcik7XG4gIH1cblxuICBoaXQoZ3JpZEl0ZW0pIHtcbiAgICBncmlkSXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdzaGlwJyk7XG4gICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZCgnaGl0Jyk7XG4gIH07XG5cbiAgbWlzcyhncmlkSXRlbSkge1xuICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5hZGQoJ21pc3MnKTtcbiAgfVxuXG4gIHNoaXAoZ3JpZEl0ZW0pIHtcbiAgICBncmlkSXRlbS5jbGFzc0xpc3QuYWRkKCdzaGlwJyk7XG4gIH07XG5cbiAgI2dyaWRQb3B1bGF0ZShwbGF5ZXIpIHtcbiAgICBjb25zdCBncmlkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZ3JpZC5jbGFzc0xpc3QuYWRkKCdncmlkJywgcGxheWVyKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyBpKyspIHtcbiAgICAgIGNvbnN0IGdyaWRJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBncmlkSXRlbS5jbGFzc0xpc3QuYWRkKCdncmlkLWl0ZW0nLCBwbGF5ZXIpO1xuICAgICAgZ3JpZEl0ZW0uZGF0YXNldC5jb29yZGluYXRlcyA9IHRoaXMuI2Nvb3Jkc1BvcHVsYXRlKGkpO1xuICAgICAgZ3JpZC5hcHBlbmRDaGlsZChncmlkSXRlbSk7XG4gICAgfVxuICAgIHJldHVybiBncmlkO1xuICB9XG5cbiAgI2Nvb3Jkc1BvcHVsYXRlKGkpIHtcbiAgICBpZiAoaSA8IDEwKSB7XG4gICAgICByZXR1cm4gW2ksIDBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgZGlnaXRzID0gaS50b1N0cmluZygpLnNwbGl0KCcnKTtcbiAgICAgIHJldHVybiBbZGlnaXRzWzFdLCBkaWdpdHNbMF1dO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IFNoaXAgZnJvbSAnLi9zaGlwcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVib2FyZCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYWxsU2hpcHMgPSBbXTtcbiAgICB0aGlzLm1pc3NlZFNob3RzID0gW107XG4gIH07XG5cbiAgcGxhY2VTaGlwKHNpemUsIGZpcnN0Q29vcmQsIG9yaWVudGF0aW9uPSdob3Jpem9udGFsJykge1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gdGhpcy4jYnVpbGRDb29yZGluYXRlcyhzaXplLCBmaXJzdENvb3JkLCBvcmllbnRhdGlvbik7XG4gICAgY29uc3QgbmV3U2hpcCA9IG5ldyBTaGlwKHNpemUpO1xuICAgIGNvbnN0IHNoaXBFbnRyeSA9IFtuZXdTaGlwLCBjb29yZGluYXRlc107XG4gICAgdGhpcy5hbGxTaGlwcy5wdXNoKHNoaXBFbnRyeSk7XG4gICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xuICB9XG5cbiAgLy8gcmVjZWl2ZUF0dGFjayBmdW5jdGlvbiB0YWtlcyBjb29yZGluYXRlcywgZGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCB0aGUgYXR0YWNrIGhpdCBhIHNoaXBcbiAgLy8gdGhlbiBzZW5kcyB0aGUg4oCYaGl04oCZIGZ1bmN0aW9uIHRvIHRoZSBjb3JyZWN0IHNoaXAsIG9yIHJlY29yZHMgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBtaXNzZWQgc2hvdC5cbiAgcmVjZWl2ZUF0dGFjayhjb29yZGluYXRlKSB7XG4gICAgY29uc3Qgc2hpcCA9IHRoaXMuI2ZpbmRTaGlwKGNvb3JkaW5hdGUpO1xuICAgIGlmIChzaGlwKSB7XG4gICAgICBzaGlwLmhpdCgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWlzc2VkU2hvdHMucHVzaChjb29yZGluYXRlKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBnYW1lT3ZlcigpIHtcbiAgICBsZXQgYWxsU3VuayA9IHRydWU7XG4gICAgdGhpcy5hbGxTaGlwcy5mb3JFYWNoKHNoaXAgPT4ge1xuICAgICAgaWYgKCFzaGlwWzBdLmlzU3VuaygpKSB7XG4gICAgICAgIGFsbFN1bmsgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBhbGxTdW5rO1xuICB9XG5cbiAgI2J1aWxkQ29vcmRpbmF0ZXMoc2l6ZSwgZmlyc3RDb29yZCwgb3JpZW50YXRpb24pIHtcbiAgICBsZXQgY29vcmRpbmF0ZXMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgaWYgKG9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgY29vcmRpbmF0ZXMucHVzaChbZmlyc3RDb29yZFswXSArIGksIGZpcnN0Q29vcmRbMV1dKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvb3JkaW5hdGVzLnB1c2goW2ZpcnN0Q29vcmRbMF0sIGZpcnN0Q29vcmRbMV0gKyBpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb29yZGluYXRlcztcbiAgfVxuXG4gICNmaW5kU2hpcChjb29yZGluYXRlKSB7XG4gICAgbGV0IGhpdFNoaXAgPSBmYWxzZTtcbiAgICB0aGlzLmFsbFNoaXBzLmZvckVhY2goc2hpcCA9PiB7XG4gICAgICBpZiAoc2hpcFsxXS5zb21lKCh4KSA9PiB4ID0gY29vcmRpbmF0ZSkpIHtcbiAgICAgICAgaGl0U2hpcCA9IHNoaXBbMF07XG4gICAgfX0pXG4gICAgcmV0dXJuIGhpdFNoaXA7XG4gIH1cbn1cbiIsImltcG9ydCBQbGF5ZXIgZnJvbSAnLi9wbGF5ZXJzJztcbmltcG9ydCBET01idWlsZGVyIGZyb20gJy4vZG9tQnVpbGRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVsb29wIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5odW1hbiA9IG5ldyBQbGF5ZXIodHJ1ZSk7XG4gICAgdGhpcy5haSA9IG5ldyBQbGF5ZXIoZmFsc2UpO1xuICAgIHRoaXMucGxheWVycyA9IFt0aGlzLmh1bWFuLCB0aGlzLmFpXTtcbiAgICB0aGlzLnBhZ2UgPSBuZXcgRE9NYnVpbGRlcjtcbiAgICB0aGlzLiNhaVNoaXBzKCk7XG4gIH1cblxuICBncmlkTGlzdGVuZXJzKCkge1xuICAgIGNvbnN0IGdyaWRJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ncmlkLWl0ZW0nKTtcbiAgICBncmlkSXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBsZXQgY29vcmRzID0gaXRlbS5kYXRhc2V0LmNvb3JkaW5hdGVzLnNwbGl0KCcsJykubWFwKCh4KSA9PiBwYXJzZUludCh4LCAxMCkpO1xuICAgICAgICBpZiAodGhpcy5haS5ib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkcykpIHtcbiAgICAgICAgICAvLyBpZiBhIHNoaXAgaXMgaGl0IHRoZW4gLi4uXG4gICAgICAgICAgdGhpcy5wYWdlLmhpdChpdGVtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBpZiBhIHNoaXAgaXMgbm90IGhpdCB0aGVuIC4uLlxuICAgICAgICAgIHRoaXMucGFnZS5taXNzKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICAjYWlTaGlwcygpIHtcbiAgICBjb25zdCBzaGlwU2l6ZXMgPSBbNSwgNCwgMywgMywgMl07XG4gICAgc2hpcFNpemVzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIGxldCBjb29yZCA9IFt0aGlzLiNyYW5kb21OdW0oMTAgLSBzaGlwKSwgdGhpcy4jcmFuZG9tTnVtKDEwIC0gc2hpcCldO1xuICAgICAgbGV0IG9yaWVudGF0aW9uID0gdGhpcy4jcmFuZG9tTnVtKDIpID09PSAwID8gJ2hvcml6b250YWwnIDogJ3ZlcnRpY2FsJztcbiAgICAgIGNvbnN0IHNoaXBMb2NhdGlvbnMgPSB0aGlzLmFpLmJvYXJkLnBsYWNlU2hpcChzaGlwLCBjb29yZCwgb3JpZW50YXRpb24pO1xuICAgICAgc2hpcExvY2F0aW9ucy5mb3JFYWNoKChsb2NhdGlvbikgPT4ge1xuICAgICAgICB0aGlzLnBhZ2Uuc2hpcCh0aGlzLiNmaW5kR3JpZEl0ZW0obG9jYXRpb24sICdhaScpKTtcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gICNyYW5kb21OdW0obWF4KSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1heCk7XG4gIH1cblxuICAjZmluZEdyaWRJdGVtKGNvb3JkcywgcGxheWVyKSB7XG4gICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLmdyaWQtaXRlbS4ke3BsYXllcn1gKTtcbiAgICBsZXQgZm91bmRJdGVtID0gZmFsc2U7XG4gICAgZ3JpZEl0ZW1zLmZvckVhY2goKGdyaWRJdGVtKSA9PiB7XG4gICAgICBpZiAoZ3JpZEl0ZW0uZGF0YXNldC5jb29yZGluYXRlcyA9PT0gY29vcmRzLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgZm91bmRJdGVtID0gZ3JpZEl0ZW07XG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gZm91bmRJdGVtO1xuICB9XG59XG4iLCJpbXBvcnQgR2FtZWJvYXJkIGZyb20gXCIuL2dhbWVib2FyZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihodW1hbj10cnVlKSB7XG4gICAgdGhpcy5ib2FyZCA9IG5ldyBHYW1lYm9hcmQ7XG4gICAgdGhpcy5pc0h1bWFuID0gaHVtYW47XG4gICAgdGhpcy5wcmV2aW91c1BsYXlzID0gW107XG4gIH07XG5cbiAgYXR0YWNrKHBsYXllciwgY29vcmRpbmF0ZSkge1xuICAgIGlmICghdGhpcy5pc0h1bWFuKSB7XG4gICAgICBjb29yZGluYXRlID0gdGhpcy4jYWlBdHRhY2socGxheWVyLmJvYXJkKTtcbiAgICB9XG5cbiAgICB0aGlzLnByZXZpb3VzUGxheXMucHVzaChjb29yZGluYXRlKTtcbiAgICBwbGF5ZXIuYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZGluYXRlKTtcbiAgfVxuXG4gICNhaUF0dGFjayhib2FyZCkge1xuICAgIGxldCBjb29yZGluYXRlID0gdGhpcy4jcmFuZG9tQ29vcmQoKTtcbiAgICBpZiAodGhpcy5wcmV2aW91c1BsYXlzLmluY2x1ZGVzKGNvb3JkaW5hdGUpKSB7XG4gICAgICB0aGlzLiNhaUF0dGFjayhib2FyZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjb29yZGluYXRlO1xuICAgIH1cbiAgfVxuXG4gIC8vIEdlbmVyYXRlIHJhbmRvbSBjb29yZGluYXRlcyBiZXR3ZWVuIDAgLSA5LlxuICAjcmFuZG9tQ29vcmQoKSB7XG4gICAgcmV0dXJuIFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCksIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKV07XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoaXAge1xuICBjb25zdHJ1Y3RvcihzaXplKSB7XG4gICAgdGhpcy5sZW5ndGggPSBzaXplO1xuICAgIHRoaXMuaGl0cyA9IDA7XG4gICAgdGhpcy5zdW5rID0gZmFsc2U7XG4gIH1cblxuICBoaXQoKSB7XG4gICAgdGhpcy5oaXRzKys7XG4gICAgdGhpcy5pc1N1bmsoKTtcbiAgfVxuXG4gIGlzU3VuaygpIHtcbiAgICBpZiAodGhpcy5oaXRzID09PSB0aGlzLmxlbmd0aCkge1xuICAgICAgdGhpcy5zdW5rID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3VuaztcbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgR2FtZWxvb3AgZnJvbSBcIi4vZ2FtZWxvb3BcIjtcblxuY29uc3QgZ2FtZSA9IG5ldyBHYW1lbG9vcCgpO1xuZ2FtZS5ncmlkTGlzdGVuZXJzKCk7XG4iXSwibmFtZXMiOlsiRE9NYnVpbGRlciIsImNvbnN0cnVjdG9yIiwic2hpcHMiLCJnYW1lQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInBsYXllckNvbnRhaW5lciIsImNyZWF0ZUVsZW1lbnQiLCJhaUNvbnRhaW5lciIsImNsYXNzTGlzdCIsImFkZCIsInBsYXllclRpdGxlIiwidGV4dENvbnRlbnQiLCJhaVRpdGxlIiwicGxheWVyR3JpZCIsImdyaWRQb3B1bGF0ZSIsImFpR3JpZCIsImFwcGVuZCIsImhpdCIsImdyaWRJdGVtIiwicmVtb3ZlIiwibWlzcyIsInNoaXAiLCIjZ3JpZFBvcHVsYXRlIiwicGxheWVyIiwiZ3JpZCIsImkiLCJkYXRhc2V0IiwiY29vcmRpbmF0ZXMiLCJjb29yZHNQb3B1bGF0ZSIsImFwcGVuZENoaWxkIiwiI2Nvb3Jkc1BvcHVsYXRlIiwiZGlnaXRzIiwidG9TdHJpbmciLCJzcGxpdCIsIlNoaXAiLCJHYW1lYm9hcmQiLCJhbGxTaGlwcyIsIm1pc3NlZFNob3RzIiwicGxhY2VTaGlwIiwic2l6ZSIsImZpcnN0Q29vcmQiLCJvcmllbnRhdGlvbiIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsImJ1aWxkQ29vcmRpbmF0ZXMiLCJuZXdTaGlwIiwic2hpcEVudHJ5IiwicHVzaCIsInJlY2VpdmVBdHRhY2siLCJjb29yZGluYXRlIiwiZmluZFNoaXAiLCJnYW1lT3ZlciIsImFsbFN1bmsiLCJmb3JFYWNoIiwiaXNTdW5rIiwiI2J1aWxkQ29vcmRpbmF0ZXMiLCIjZmluZFNoaXAiLCJoaXRTaGlwIiwic29tZSIsIngiLCJQbGF5ZXIiLCJHYW1lbG9vcCIsImh1bWFuIiwiYWkiLCJwbGF5ZXJzIiwicGFnZSIsImFpU2hpcHMiLCJncmlkTGlzdGVuZXJzIiwiZ3JpZEl0ZW1zIiwicXVlcnlTZWxlY3RvckFsbCIsIml0ZW0iLCJhZGRFdmVudExpc3RlbmVyIiwiY29vcmRzIiwibWFwIiwicGFyc2VJbnQiLCJib2FyZCIsIiNhaVNoaXBzIiwic2hpcFNpemVzIiwiY29vcmQiLCJyYW5kb21OdW0iLCJzaGlwTG9jYXRpb25zIiwibG9jYXRpb24iLCJmaW5kR3JpZEl0ZW0iLCIjcmFuZG9tTnVtIiwibWF4IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiI2ZpbmRHcmlkSXRlbSIsImZvdW5kSXRlbSIsImlzSHVtYW4iLCJwcmV2aW91c1BsYXlzIiwiYXR0YWNrIiwiYWlBdHRhY2siLCIjYWlBdHRhY2siLCJyYW5kb21Db29yZCIsImluY2x1ZGVzIiwiI3JhbmRvbUNvb3JkIiwiaGl0cyIsInN1bmsiLCJnYW1lIl0sInNvdXJjZVJvb3QiOiIifQ==