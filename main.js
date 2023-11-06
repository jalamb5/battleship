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
      if (ship[1].some(x => x[0] === coordinate[0] && x[1] === coordinate[1])) {
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
  aiGridListeners() {
    const gridItems = document.querySelectorAll('.grid-item.ai');
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
game.aiGridListeners();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBQ3hELE1BQU0sRUFBRTtNQUM3QixJQUFJLENBQUN5RCxJQUFJLEdBQUcsSUFBSTtJQUNsQjtJQUNBLE9BQU8sSUFBSSxDQUFDQSxJQUFJO0VBQ2xCO0FBQ0Y7Ozs7OztVQ2xCQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTmtDO0FBRWxDLE1BQU1DLElBQUksR0FBRyxJQUFJdkMsaURBQVEsQ0FBQyxDQUFDO0FBQzNCdUMsSUFBSSxDQUFDakMsZUFBZSxDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZG9tQnVpbGRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVsb29wLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcGxheWVycy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NjcmlwdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBET01idWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY29uc3Qgc2hpcHMgPSB7J0NhcnJpZXInOiA1LCAnQmF0dGxlc2hpcCc6IDQsICdEZXN0cm95ZXInOiAzLCAnU3VibWFyaW5lJzogMywgJ1BhdHJvbCBCb2F0JzogMn1cblxuICAgIHRoaXMuZ2FtZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLWNvbnRhaW5lcicpO1xuICAgIC8vIGNyZWF0ZSBjb250YWluZXJzIGZvciBlbGVtZW50czpcbiAgICAgIC8vIDIgcGxheWVyIGNvbnRhaW5lcnNcbiAgICB0aGlzLnBsYXllckNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuYWlDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLnBsYXllckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItY29udGFpbmVyJyk7XG4gICAgdGhpcy5haUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItY29udGFpbmVyJyk7XG4gICAgICAvLyBlYWNoIGNvbnRhaW5lciBjb250YWluczpcbiAgICAgICAgLy8gUGxheWVyIHRpdGxlXG4gICAgICAgIGNvbnN0IHBsYXllclRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKVxuICAgICAgICBwbGF5ZXJUaXRsZS50ZXh0Q29udGVudCA9ICdQbGF5ZXInO1xuXG4gICAgICAgIGNvbnN0IGFpVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICAgICAgICBhaVRpdGxlLnRleHRDb250ZW50ID0gJ0NvbXB1dGVyJztcblxuICAgICAgICAvLyBHYW1lIGJvYXJkIGdyaWQgKDEwIHggMTApXG4gICAgICAgIGNvbnN0IHBsYXllckdyaWQgPSB0aGlzLiNncmlkUG9wdWxhdGUoJ2h1bWFuJyk7XG4gICAgICAgIGNvbnN0IGFpR3JpZCA9IHRoaXMuI2dyaWRQb3B1bGF0ZSgnYWknKTtcblxuICAgICAgdGhpcy5wbGF5ZXJDb250YWluZXIuYXBwZW5kKHBsYXllclRpdGxlLCBwbGF5ZXJHcmlkKTtcbiAgICAgIHRoaXMuYWlDb250YWluZXIuYXBwZW5kKGFpVGl0bGUsIGFpR3JpZCk7XG5cbiAgICB0aGlzLmdhbWVDb250YWluZXIuYXBwZW5kKHRoaXMucGxheWVyQ29udGFpbmVyLCB0aGlzLmFpQ29udGFpbmVyKTtcbiAgfVxuXG4gIGhpdChncmlkSXRlbSkge1xuICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3NoaXAnKTtcbiAgICBncmlkSXRlbS5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgfTtcblxuICBtaXNzKGdyaWRJdGVtKSB7XG4gICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZCgnbWlzcycpO1xuICB9XG5cbiAgc2hpcChncmlkSXRlbSkge1xuICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5hZGQoJ3NoaXAnKTtcbiAgfTtcblxuICAjZ3JpZFBvcHVsYXRlKHBsYXllcikge1xuICAgIGNvbnN0IGdyaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBncmlkLmNsYXNzTGlzdC5hZGQoJ2dyaWQnLCBwbGF5ZXIpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDA7IGkrKykge1xuICAgICAgY29uc3QgZ3JpZEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5hZGQoJ2dyaWQtaXRlbScsIHBsYXllcik7XG4gICAgICBncmlkSXRlbS5kYXRhc2V0LmNvb3JkaW5hdGVzID0gdGhpcy4jY29vcmRzUG9wdWxhdGUoaSk7XG4gICAgICBncmlkLmFwcGVuZENoaWxkKGdyaWRJdGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIGdyaWQ7XG4gIH1cblxuICAjY29vcmRzUG9wdWxhdGUoaSkge1xuICAgIGlmIChpIDwgMTApIHtcbiAgICAgIHJldHVybiBbaSwgMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBkaWdpdHMgPSBpLnRvU3RyaW5nKCkuc3BsaXQoJycpO1xuICAgICAgcmV0dXJuIFtkaWdpdHNbMV0sIGRpZ2l0c1swXV07XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgU2hpcCBmcm9tICcuL3NoaXBzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZWJvYXJkIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hbGxTaGlwcyA9IFtdO1xuICAgIHRoaXMubWlzc2VkU2hvdHMgPSBbXTtcbiAgfTtcblxuICBwbGFjZVNoaXAoc2l6ZSwgZmlyc3RDb29yZCwgb3JpZW50YXRpb249J2hvcml6b250YWwnKSB7XG4gICAgY29uc3QgY29vcmRpbmF0ZXMgPSB0aGlzLiNidWlsZENvb3JkaW5hdGVzKHNpemUsIGZpcnN0Q29vcmQsIG9yaWVudGF0aW9uKTtcbiAgICBjb25zdCBuZXdTaGlwID0gbmV3IFNoaXAoc2l6ZSk7XG4gICAgY29uc3Qgc2hpcEVudHJ5ID0gW25ld1NoaXAsIGNvb3JkaW5hdGVzXTtcbiAgICB0aGlzLmFsbFNoaXBzLnB1c2goc2hpcEVudHJ5KTtcbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gIH1cblxuICAvLyByZWNlaXZlQXR0YWNrIGZ1bmN0aW9uIHRha2VzIGNvb3JkaW5hdGVzLCBkZXRlcm1pbmVzIHdoZXRoZXIgb3Igbm90IHRoZSBhdHRhY2sgaGl0IGEgc2hpcFxuICAvLyB0aGVuIHNlbmRzIHRoZSDigJhoaXTigJkgZnVuY3Rpb24gdG8gdGhlIGNvcnJlY3Qgc2hpcCwgb3IgcmVjb3JkcyB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIG1pc3NlZCBzaG90LlxuICByZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGUpIHtcbiAgICBjb25zdCBzaGlwID0gdGhpcy4jZmluZFNoaXAoY29vcmRpbmF0ZSk7XG4gICAgaWYgKHNoaXApIHtcbiAgICAgIHNoaXAuaGl0KCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5taXNzZWRTaG90cy5wdXNoKGNvb3JkaW5hdGUpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGdhbWVPdmVyKCkge1xuICAgIGxldCBhbGxTdW5rID0gdHJ1ZTtcbiAgICB0aGlzLmFsbFNoaXBzLmZvckVhY2goc2hpcCA9PiB7XG4gICAgICBpZiAoIXNoaXBbMF0uaXNTdW5rKCkpIHtcbiAgICAgICAgYWxsU3VuayA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGFsbFN1bms7XG4gIH1cblxuICAjYnVpbGRDb29yZGluYXRlcyhzaXplLCBmaXJzdENvb3JkLCBvcmllbnRhdGlvbikge1xuICAgIGxldCBjb29yZGluYXRlcyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBpZiAob3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICBjb29yZGluYXRlcy5wdXNoKFtmaXJzdENvb3JkWzBdICsgaSwgZmlyc3RDb29yZFsxXV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29vcmRpbmF0ZXMucHVzaChbZmlyc3RDb29yZFswXSwgZmlyc3RDb29yZFsxXSArIGldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xuICB9XG5cbiAgI2ZpbmRTaGlwKGNvb3JkaW5hdGUpIHtcbiAgICBsZXQgaGl0U2hpcCA9IGZhbHNlO1xuICAgIHRoaXMuYWxsU2hpcHMuZm9yRWFjaChzaGlwID0+IHtcbiAgICAgIGlmIChzaGlwWzFdLnNvbWUoKHgpID0+IHhbMF0gPT09IGNvb3JkaW5hdGVbMF0gJiYgeFsxXSA9PT0gY29vcmRpbmF0ZVsxXSkpIHtcbiAgICAgICAgaGl0U2hpcCA9IHNoaXBbMF07XG4gICAgfX0pXG4gICAgcmV0dXJuIGhpdFNoaXA7XG4gIH1cbn1cbiIsImltcG9ydCBQbGF5ZXIgZnJvbSAnLi9wbGF5ZXJzJztcbmltcG9ydCBET01idWlsZGVyIGZyb20gJy4vZG9tQnVpbGRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVsb29wIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5odW1hbiA9IG5ldyBQbGF5ZXIodHJ1ZSk7XG4gICAgdGhpcy5haSA9IG5ldyBQbGF5ZXIoZmFsc2UpO1xuICAgIHRoaXMucGxheWVycyA9IFt0aGlzLmh1bWFuLCB0aGlzLmFpXTtcbiAgICB0aGlzLnBhZ2UgPSBuZXcgRE9NYnVpbGRlcjtcbiAgICB0aGlzLiNhaVNoaXBzKCk7XG4gIH1cblxuICBhaUdyaWRMaXN0ZW5lcnMoKSB7XG4gICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmdyaWQtaXRlbS5haScpO1xuICAgIGdyaWRJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGxldCBjb29yZHMgPSBpdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXMuc3BsaXQoJywnKS5tYXAoKHgpID0+IHBhcnNlSW50KHgsIDEwKSk7XG4gICAgICAgIGlmICh0aGlzLmFpLmJvYXJkLnJlY2VpdmVBdHRhY2soY29vcmRzKSkge1xuICAgICAgICAgIC8vIGlmIGEgc2hpcCBpcyBoaXQgdGhlbiAuLi5cbiAgICAgICAgICB0aGlzLnBhZ2UuaGl0KGl0ZW0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGlmIGEgc2hpcCBpcyBub3QgaGl0IHRoZW4gLi4uXG4gICAgICAgICAgdGhpcy5wYWdlLm1pc3MoaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gICNhaVNoaXBzKCkge1xuICAgIGNvbnN0IHNoaXBTaXplcyA9IFs1LCA0LCAzLCAzLCAyXTtcbiAgICBzaGlwU2l6ZXMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgbGV0IGNvb3JkID0gW3RoaXMuI3JhbmRvbU51bSgxMCAtIHNoaXApLCB0aGlzLiNyYW5kb21OdW0oMTAgLSBzaGlwKV07XG4gICAgICBsZXQgb3JpZW50YXRpb24gPSB0aGlzLiNyYW5kb21OdW0oMikgPT09IDAgPyAnaG9yaXpvbnRhbCcgOiAndmVydGljYWwnO1xuICAgICAgY29uc3Qgc2hpcExvY2F0aW9ucyA9IHRoaXMuYWkuYm9hcmQucGxhY2VTaGlwKHNoaXAsIGNvb3JkLCBvcmllbnRhdGlvbik7XG4gICAgICBzaGlwTG9jYXRpb25zLmZvckVhY2goKGxvY2F0aW9uKSA9PiB7XG4gICAgICAgIHRoaXMucGFnZS5zaGlwKHRoaXMuI2ZpbmRHcmlkSXRlbShsb2NhdGlvbiwgJ2FpJykpO1xuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgI3JhbmRvbU51bShtYXgpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWF4KTtcbiAgfVxuXG4gICNmaW5kR3JpZEl0ZW0oY29vcmRzLCBwbGF5ZXIpIHtcbiAgICBjb25zdCBncmlkSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuZ3JpZC1pdGVtLiR7cGxheWVyfWApO1xuICAgIGxldCBmb3VuZEl0ZW0gPSBmYWxzZTtcbiAgICBncmlkSXRlbXMuZm9yRWFjaCgoZ3JpZEl0ZW0pID0+IHtcbiAgICAgIGlmIChncmlkSXRlbS5kYXRhc2V0LmNvb3JkaW5hdGVzID09PSBjb29yZHMudG9TdHJpbmcoKSkge1xuICAgICAgICBmb3VuZEl0ZW0gPSBncmlkSXRlbTtcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBmb3VuZEl0ZW07XG4gIH1cbn1cbiIsImltcG9ydCBHYW1lYm9hcmQgZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKGh1bWFuPXRydWUpIHtcbiAgICB0aGlzLmJvYXJkID0gbmV3IEdhbWVib2FyZDtcbiAgICB0aGlzLmlzSHVtYW4gPSBodW1hbjtcbiAgICB0aGlzLnByZXZpb3VzUGxheXMgPSBbXTtcbiAgfTtcblxuICBhdHRhY2socGxheWVyLCBjb29yZGluYXRlKSB7XG4gICAgaWYgKCF0aGlzLmlzSHVtYW4pIHtcbiAgICAgIGNvb3JkaW5hdGUgPSB0aGlzLiNhaUF0dGFjayhwbGF5ZXIuYm9hcmQpO1xuICAgIH1cblxuICAgIHRoaXMucHJldmlvdXNQbGF5cy5wdXNoKGNvb3JkaW5hdGUpO1xuICAgIHBsYXllci5ib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGUpO1xuICB9XG5cbiAgI2FpQXR0YWNrKGJvYXJkKSB7XG4gICAgbGV0IGNvb3JkaW5hdGUgPSB0aGlzLiNyYW5kb21Db29yZCgpO1xuICAgIGlmICh0aGlzLnByZXZpb3VzUGxheXMuaW5jbHVkZXMoY29vcmRpbmF0ZSkpIHtcbiAgICAgIHRoaXMuI2FpQXR0YWNrKGJvYXJkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNvb3JkaW5hdGU7XG4gICAgfVxuICB9XG5cbiAgLy8gR2VuZXJhdGUgcmFuZG9tIGNvb3JkaW5hdGVzIGJldHdlZW4gMCAtIDkuXG4gICNyYW5kb21Db29yZCgpIHtcbiAgICByZXR1cm4gW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSwgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApXTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hpcCB7XG4gIGNvbnN0cnVjdG9yKHNpemUpIHtcbiAgICB0aGlzLmxlbmd0aCA9IHNpemU7XG4gICAgdGhpcy5oaXRzID0gMDtcbiAgICB0aGlzLnN1bmsgPSBmYWxzZTtcbiAgfVxuXG4gIGhpdCgpIHtcbiAgICB0aGlzLmhpdHMrKztcbiAgICB0aGlzLmlzU3VuaygpO1xuICB9XG5cbiAgaXNTdW5rKCkge1xuICAgIGlmICh0aGlzLmhpdHMgPT09IHRoaXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLnN1bmsgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdW5rO1xuICB9XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBHYW1lbG9vcCBmcm9tIFwiLi9nYW1lbG9vcFwiO1xuXG5jb25zdCBnYW1lID0gbmV3IEdhbWVsb29wKCk7XG5nYW1lLmFpR3JpZExpc3RlbmVycygpO1xuIl0sIm5hbWVzIjpbIkRPTWJ1aWxkZXIiLCJjb25zdHJ1Y3RvciIsInNoaXBzIiwiZ2FtZUNvbnRhaW5lciIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJwbGF5ZXJDb250YWluZXIiLCJjcmVhdGVFbGVtZW50IiwiYWlDb250YWluZXIiLCJjbGFzc0xpc3QiLCJhZGQiLCJwbGF5ZXJUaXRsZSIsInRleHRDb250ZW50IiwiYWlUaXRsZSIsInBsYXllckdyaWQiLCJncmlkUG9wdWxhdGUiLCJhaUdyaWQiLCJhcHBlbmQiLCJoaXQiLCJncmlkSXRlbSIsInJlbW92ZSIsIm1pc3MiLCJzaGlwIiwiI2dyaWRQb3B1bGF0ZSIsInBsYXllciIsImdyaWQiLCJpIiwiZGF0YXNldCIsImNvb3JkaW5hdGVzIiwiY29vcmRzUG9wdWxhdGUiLCJhcHBlbmRDaGlsZCIsIiNjb29yZHNQb3B1bGF0ZSIsImRpZ2l0cyIsInRvU3RyaW5nIiwic3BsaXQiLCJTaGlwIiwiR2FtZWJvYXJkIiwiYWxsU2hpcHMiLCJtaXNzZWRTaG90cyIsInBsYWNlU2hpcCIsInNpemUiLCJmaXJzdENvb3JkIiwib3JpZW50YXRpb24iLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJidWlsZENvb3JkaW5hdGVzIiwibmV3U2hpcCIsInNoaXBFbnRyeSIsInB1c2giLCJyZWNlaXZlQXR0YWNrIiwiY29vcmRpbmF0ZSIsImZpbmRTaGlwIiwiZ2FtZU92ZXIiLCJhbGxTdW5rIiwiZm9yRWFjaCIsImlzU3VuayIsIiNidWlsZENvb3JkaW5hdGVzIiwiI2ZpbmRTaGlwIiwiaGl0U2hpcCIsInNvbWUiLCJ4IiwiUGxheWVyIiwiR2FtZWxvb3AiLCJodW1hbiIsImFpIiwicGxheWVycyIsInBhZ2UiLCJhaVNoaXBzIiwiYWlHcmlkTGlzdGVuZXJzIiwiZ3JpZEl0ZW1zIiwicXVlcnlTZWxlY3RvckFsbCIsIml0ZW0iLCJhZGRFdmVudExpc3RlbmVyIiwiY29vcmRzIiwibWFwIiwicGFyc2VJbnQiLCJib2FyZCIsIiNhaVNoaXBzIiwic2hpcFNpemVzIiwiY29vcmQiLCJyYW5kb21OdW0iLCJzaGlwTG9jYXRpb25zIiwibG9jYXRpb24iLCJmaW5kR3JpZEl0ZW0iLCIjcmFuZG9tTnVtIiwibWF4IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiI2ZpbmRHcmlkSXRlbSIsImZvdW5kSXRlbSIsImlzSHVtYW4iLCJwcmV2aW91c1BsYXlzIiwiYXR0YWNrIiwiYWlBdHRhY2siLCIjYWlBdHRhY2siLCJyYW5kb21Db29yZCIsImluY2x1ZGVzIiwiI3JhbmRvbUNvb3JkIiwiaGl0cyIsInN1bmsiLCJnYW1lIl0sInNvdXJjZVJvb3QiOiIifQ==