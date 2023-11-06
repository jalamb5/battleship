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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDeEQsTUFBTSxFQUFFO01BQzdCLElBQUksQ0FBQ3lELElBQUksR0FBRyxJQUFJO0lBQ2xCO0lBQ0EsT0FBTyxJQUFJLENBQUNBLElBQUk7RUFDbEI7QUFDRjs7Ozs7O1VDbEJBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOa0M7QUFFbEMsTUFBTUMsSUFBSSxHQUFHLElBQUl2QyxpREFBUSxDQUFDLENBQUM7QUFDM0J1QyxJQUFJLENBQUNqQyxhQUFhLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9kb21CdWlsZGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWxvb3AuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXJzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2NyaXB0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIERPTWJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBjb25zdCBzaGlwcyA9IHsnQ2Fycmllcic6IDUsICdCYXR0bGVzaGlwJzogNCwgJ0Rlc3Ryb3llcic6IDMsICdTdWJtYXJpbmUnOiAzLCAnUGF0cm9sIEJvYXQnOiAyfVxuXG4gICAgdGhpcy5nYW1lQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtY29udGFpbmVyJyk7XG4gICAgLy8gY3JlYXRlIGNvbnRhaW5lcnMgZm9yIGVsZW1lbnRzOlxuICAgICAgLy8gMiBwbGF5ZXIgY29udGFpbmVyc1xuICAgIHRoaXMucGxheWVyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5haUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMucGxheWVyQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3BsYXllci1jb250YWluZXInKTtcbiAgICB0aGlzLmFpQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3BsYXllci1jb250YWluZXInKTtcbiAgICAgIC8vIGVhY2ggY29udGFpbmVyIGNvbnRhaW5zOlxuICAgICAgICAvLyBQbGF5ZXIgdGl0bGVcbiAgICAgICAgY29uc3QgcGxheWVyVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpXG4gICAgICAgIHBsYXllclRpdGxlLnRleHRDb250ZW50ID0gJ1BsYXllcic7XG5cbiAgICAgICAgY29uc3QgYWlUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG4gICAgICAgIGFpVGl0bGUudGV4dENvbnRlbnQgPSAnQ29tcHV0ZXInO1xuXG4gICAgICAgIC8vIEdhbWUgYm9hcmQgZ3JpZCAoMTAgeCAxMClcbiAgICAgICAgY29uc3QgcGxheWVyR3JpZCA9IHRoaXMuI2dyaWRQb3B1bGF0ZSgnaHVtYW4nKTtcbiAgICAgICAgY29uc3QgYWlHcmlkID0gdGhpcy4jZ3JpZFBvcHVsYXRlKCdhaScpO1xuXG4gICAgICB0aGlzLnBsYXllckNvbnRhaW5lci5hcHBlbmQocGxheWVyVGl0bGUsIHBsYXllckdyaWQpO1xuICAgICAgdGhpcy5haUNvbnRhaW5lci5hcHBlbmQoYWlUaXRsZSwgYWlHcmlkKTtcblxuICAgIHRoaXMuZ2FtZUNvbnRhaW5lci5hcHBlbmQodGhpcy5wbGF5ZXJDb250YWluZXIsIHRoaXMuYWlDb250YWluZXIpO1xuICB9XG5cbiAgaGl0KGdyaWRJdGVtKSB7XG4gICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnc2hpcCcpO1xuICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5hZGQoJ2hpdCcpO1xuICB9O1xuXG4gIG1pc3MoZ3JpZEl0ZW0pIHtcbiAgICBncmlkSXRlbS5jbGFzc0xpc3QuYWRkKCdtaXNzJyk7XG4gIH1cblxuICBzaGlwKGdyaWRJdGVtKSB7XG4gICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZCgnc2hpcCcpO1xuICB9O1xuXG4gICNncmlkUG9wdWxhdGUocGxheWVyKSB7XG4gICAgY29uc3QgZ3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGdyaWQuY2xhc3NMaXN0LmFkZCgnZ3JpZCcsIHBsYXllcik7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDsgaSsrKSB7XG4gICAgICBjb25zdCBncmlkSXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZCgnZ3JpZC1pdGVtJywgcGxheWVyKTtcbiAgICAgIGdyaWRJdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXMgPSB0aGlzLiNjb29yZHNQb3B1bGF0ZShpKTtcbiAgICAgIGdyaWQuYXBwZW5kQ2hpbGQoZ3JpZEl0ZW0pO1xuICAgIH1cbiAgICByZXR1cm4gZ3JpZDtcbiAgfVxuXG4gICNjb29yZHNQb3B1bGF0ZShpKSB7XG4gICAgaWYgKGkgPCAxMCkge1xuICAgICAgcmV0dXJuIFtpLCAwXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGRpZ2l0cyA9IGkudG9TdHJpbmcoKS5zcGxpdCgnJyk7XG4gICAgICByZXR1cm4gW2RpZ2l0c1sxXSwgZGlnaXRzWzBdXTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBTaGlwIGZyb20gJy4vc2hpcHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lYm9hcmQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFsbFNoaXBzID0gW107XG4gICAgdGhpcy5taXNzZWRTaG90cyA9IFtdO1xuICB9O1xuXG4gIHBsYWNlU2hpcChzaXplLCBmaXJzdENvb3JkLCBvcmllbnRhdGlvbj0naG9yaXpvbnRhbCcpIHtcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IHRoaXMuI2J1aWxkQ29vcmRpbmF0ZXMoc2l6ZSwgZmlyc3RDb29yZCwgb3JpZW50YXRpb24pO1xuICAgIGNvbnN0IG5ld1NoaXAgPSBuZXcgU2hpcChzaXplKTtcbiAgICBjb25zdCBzaGlwRW50cnkgPSBbbmV3U2hpcCwgY29vcmRpbmF0ZXNdO1xuICAgIHRoaXMuYWxsU2hpcHMucHVzaChzaGlwRW50cnkpO1xuICAgIHJldHVybiBjb29yZGluYXRlcztcbiAgfVxuXG4gIC8vIHJlY2VpdmVBdHRhY2sgZnVuY3Rpb24gdGFrZXMgY29vcmRpbmF0ZXMsIGRldGVybWluZXMgd2hldGhlciBvciBub3QgdGhlIGF0dGFjayBoaXQgYSBzaGlwXG4gIC8vIHRoZW4gc2VuZHMgdGhlIOKAmGhpdOKAmSBmdW5jdGlvbiB0byB0aGUgY29ycmVjdCBzaGlwLCBvciByZWNvcmRzIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgbWlzc2VkIHNob3QuXG4gIHJlY2VpdmVBdHRhY2soY29vcmRpbmF0ZSkge1xuICAgIGNvbnN0IHNoaXAgPSB0aGlzLiNmaW5kU2hpcChjb29yZGluYXRlKTtcbiAgICBpZiAoc2hpcCkge1xuICAgICAgc2hpcC5oaXQoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1pc3NlZFNob3RzLnB1c2goY29vcmRpbmF0ZSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZ2FtZU92ZXIoKSB7XG4gICAgbGV0IGFsbFN1bmsgPSB0cnVlO1xuICAgIHRoaXMuYWxsU2hpcHMuZm9yRWFjaChzaGlwID0+IHtcbiAgICAgIGlmICghc2hpcFswXS5pc1N1bmsoKSkge1xuICAgICAgICBhbGxTdW5rID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gYWxsU3VuaztcbiAgfVxuXG4gICNidWlsZENvb3JkaW5hdGVzKHNpemUsIGZpcnN0Q29vcmQsIG9yaWVudGF0aW9uKSB7XG4gICAgbGV0IGNvb3JkaW5hdGVzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgIGNvb3JkaW5hdGVzLnB1c2goW2ZpcnN0Q29vcmRbMF0gKyBpLCBmaXJzdENvb3JkWzFdXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb29yZGluYXRlcy5wdXNoKFtmaXJzdENvb3JkWzBdLCBmaXJzdENvb3JkWzFdICsgaV0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gIH1cblxuICAjZmluZFNoaXAoY29vcmRpbmF0ZSkge1xuICAgIGxldCBoaXRTaGlwID0gZmFsc2U7XG4gICAgdGhpcy5hbGxTaGlwcy5mb3JFYWNoKHNoaXAgPT4ge1xuICAgICAgaWYgKHNoaXBbMV0uc29tZSgoeCkgPT4geFswXSA9PT0gY29vcmRpbmF0ZVswXSAmJiB4WzFdID09PSBjb29yZGluYXRlWzFdKSkge1xuICAgICAgICBoaXRTaGlwID0gc2hpcFswXTtcbiAgICB9fSlcbiAgICByZXR1cm4gaGl0U2hpcDtcbiAgfVxufVxuIiwiaW1wb3J0IFBsYXllciBmcm9tICcuL3BsYXllcnMnO1xuaW1wb3J0IERPTWJ1aWxkZXIgZnJvbSAnLi9kb21CdWlsZGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZWxvb3Age1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmh1bWFuID0gbmV3IFBsYXllcih0cnVlKTtcbiAgICB0aGlzLmFpID0gbmV3IFBsYXllcihmYWxzZSk7XG4gICAgdGhpcy5wbGF5ZXJzID0gW3RoaXMuaHVtYW4sIHRoaXMuYWldO1xuICAgIHRoaXMucGFnZSA9IG5ldyBET01idWlsZGVyO1xuICAgIHRoaXMuI2FpU2hpcHMoKTtcbiAgfVxuXG4gIGdyaWRMaXN0ZW5lcnMoKSB7XG4gICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmdyaWQtaXRlbScpO1xuICAgIGdyaWRJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGxldCBjb29yZHMgPSBpdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXMuc3BsaXQoJywnKS5tYXAoKHgpID0+IHBhcnNlSW50KHgsIDEwKSk7XG4gICAgICAgIGlmICh0aGlzLmFpLmJvYXJkLnJlY2VpdmVBdHRhY2soY29vcmRzKSkge1xuICAgICAgICAgIC8vIGlmIGEgc2hpcCBpcyBoaXQgdGhlbiAuLi5cbiAgICAgICAgICB0aGlzLnBhZ2UuaGl0KGl0ZW0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGlmIGEgc2hpcCBpcyBub3QgaGl0IHRoZW4gLi4uXG4gICAgICAgICAgdGhpcy5wYWdlLm1pc3MoaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gICNhaVNoaXBzKCkge1xuICAgIGNvbnN0IHNoaXBTaXplcyA9IFs1LCA0LCAzLCAzLCAyXTtcbiAgICBzaGlwU2l6ZXMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgbGV0IGNvb3JkID0gW3RoaXMuI3JhbmRvbU51bSgxMCAtIHNoaXApLCB0aGlzLiNyYW5kb21OdW0oMTAgLSBzaGlwKV07XG4gICAgICBsZXQgb3JpZW50YXRpb24gPSB0aGlzLiNyYW5kb21OdW0oMikgPT09IDAgPyAnaG9yaXpvbnRhbCcgOiAndmVydGljYWwnO1xuICAgICAgY29uc3Qgc2hpcExvY2F0aW9ucyA9IHRoaXMuYWkuYm9hcmQucGxhY2VTaGlwKHNoaXAsIGNvb3JkLCBvcmllbnRhdGlvbik7XG4gICAgICBzaGlwTG9jYXRpb25zLmZvckVhY2goKGxvY2F0aW9uKSA9PiB7XG4gICAgICAgIHRoaXMucGFnZS5zaGlwKHRoaXMuI2ZpbmRHcmlkSXRlbShsb2NhdGlvbiwgJ2FpJykpO1xuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgI3JhbmRvbU51bShtYXgpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWF4KTtcbiAgfVxuXG4gICNmaW5kR3JpZEl0ZW0oY29vcmRzLCBwbGF5ZXIpIHtcbiAgICBjb25zdCBncmlkSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuZ3JpZC1pdGVtLiR7cGxheWVyfWApO1xuICAgIGxldCBmb3VuZEl0ZW0gPSBmYWxzZTtcbiAgICBncmlkSXRlbXMuZm9yRWFjaCgoZ3JpZEl0ZW0pID0+IHtcbiAgICAgIGlmIChncmlkSXRlbS5kYXRhc2V0LmNvb3JkaW5hdGVzID09PSBjb29yZHMudG9TdHJpbmcoKSkge1xuICAgICAgICBmb3VuZEl0ZW0gPSBncmlkSXRlbTtcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBmb3VuZEl0ZW07XG4gIH1cbn1cbiIsImltcG9ydCBHYW1lYm9hcmQgZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKGh1bWFuPXRydWUpIHtcbiAgICB0aGlzLmJvYXJkID0gbmV3IEdhbWVib2FyZDtcbiAgICB0aGlzLmlzSHVtYW4gPSBodW1hbjtcbiAgICB0aGlzLnByZXZpb3VzUGxheXMgPSBbXTtcbiAgfTtcblxuICBhdHRhY2socGxheWVyLCBjb29yZGluYXRlKSB7XG4gICAgaWYgKCF0aGlzLmlzSHVtYW4pIHtcbiAgICAgIGNvb3JkaW5hdGUgPSB0aGlzLiNhaUF0dGFjayhwbGF5ZXIuYm9hcmQpO1xuICAgIH1cblxuICAgIHRoaXMucHJldmlvdXNQbGF5cy5wdXNoKGNvb3JkaW5hdGUpO1xuICAgIHBsYXllci5ib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGUpO1xuICB9XG5cbiAgI2FpQXR0YWNrKGJvYXJkKSB7XG4gICAgbGV0IGNvb3JkaW5hdGUgPSB0aGlzLiNyYW5kb21Db29yZCgpO1xuICAgIGlmICh0aGlzLnByZXZpb3VzUGxheXMuaW5jbHVkZXMoY29vcmRpbmF0ZSkpIHtcbiAgICAgIHRoaXMuI2FpQXR0YWNrKGJvYXJkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNvb3JkaW5hdGU7XG4gICAgfVxuICB9XG5cbiAgLy8gR2VuZXJhdGUgcmFuZG9tIGNvb3JkaW5hdGVzIGJldHdlZW4gMCAtIDkuXG4gICNyYW5kb21Db29yZCgpIHtcbiAgICByZXR1cm4gW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSwgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApXTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hpcCB7XG4gIGNvbnN0cnVjdG9yKHNpemUpIHtcbiAgICB0aGlzLmxlbmd0aCA9IHNpemU7XG4gICAgdGhpcy5oaXRzID0gMDtcbiAgICB0aGlzLnN1bmsgPSBmYWxzZTtcbiAgfVxuXG4gIGhpdCgpIHtcbiAgICB0aGlzLmhpdHMrKztcbiAgICB0aGlzLmlzU3VuaygpO1xuICB9XG5cbiAgaXNTdW5rKCkge1xuICAgIGlmICh0aGlzLmhpdHMgPT09IHRoaXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLnN1bmsgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdW5rO1xuICB9XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBHYW1lbG9vcCBmcm9tIFwiLi9nYW1lbG9vcFwiO1xuXG5jb25zdCBnYW1lID0gbmV3IEdhbWVsb29wKCk7XG5nYW1lLmdyaWRMaXN0ZW5lcnMoKTtcbiJdLCJuYW1lcyI6WyJET01idWlsZGVyIiwiY29uc3RydWN0b3IiLCJzaGlwcyIsImdhbWVDb250YWluZXIiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwicGxheWVyQ29udGFpbmVyIiwiY3JlYXRlRWxlbWVudCIsImFpQ29udGFpbmVyIiwiY2xhc3NMaXN0IiwiYWRkIiwicGxheWVyVGl0bGUiLCJ0ZXh0Q29udGVudCIsImFpVGl0bGUiLCJwbGF5ZXJHcmlkIiwiZ3JpZFBvcHVsYXRlIiwiYWlHcmlkIiwiYXBwZW5kIiwiaGl0IiwiZ3JpZEl0ZW0iLCJyZW1vdmUiLCJtaXNzIiwic2hpcCIsIiNncmlkUG9wdWxhdGUiLCJwbGF5ZXIiLCJncmlkIiwiaSIsImRhdGFzZXQiLCJjb29yZGluYXRlcyIsImNvb3Jkc1BvcHVsYXRlIiwiYXBwZW5kQ2hpbGQiLCIjY29vcmRzUG9wdWxhdGUiLCJkaWdpdHMiLCJ0b1N0cmluZyIsInNwbGl0IiwiU2hpcCIsIkdhbWVib2FyZCIsImFsbFNoaXBzIiwibWlzc2VkU2hvdHMiLCJwbGFjZVNoaXAiLCJzaXplIiwiZmlyc3RDb29yZCIsIm9yaWVudGF0aW9uIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwiYnVpbGRDb29yZGluYXRlcyIsIm5ld1NoaXAiLCJzaGlwRW50cnkiLCJwdXNoIiwicmVjZWl2ZUF0dGFjayIsImNvb3JkaW5hdGUiLCJmaW5kU2hpcCIsImdhbWVPdmVyIiwiYWxsU3VuayIsImZvckVhY2giLCJpc1N1bmsiLCIjYnVpbGRDb29yZGluYXRlcyIsIiNmaW5kU2hpcCIsImhpdFNoaXAiLCJzb21lIiwieCIsIlBsYXllciIsIkdhbWVsb29wIiwiaHVtYW4iLCJhaSIsInBsYXllcnMiLCJwYWdlIiwiYWlTaGlwcyIsImdyaWRMaXN0ZW5lcnMiLCJncmlkSXRlbXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaXRlbSIsImFkZEV2ZW50TGlzdGVuZXIiLCJjb29yZHMiLCJtYXAiLCJwYXJzZUludCIsImJvYXJkIiwiI2FpU2hpcHMiLCJzaGlwU2l6ZXMiLCJjb29yZCIsInJhbmRvbU51bSIsInNoaXBMb2NhdGlvbnMiLCJsb2NhdGlvbiIsImZpbmRHcmlkSXRlbSIsIiNyYW5kb21OdW0iLCJtYXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCIjZmluZEdyaWRJdGVtIiwiZm91bmRJdGVtIiwiaXNIdW1hbiIsInByZXZpb3VzUGxheXMiLCJhdHRhY2siLCJhaUF0dGFjayIsIiNhaUF0dGFjayIsInJhbmRvbUNvb3JkIiwiaW5jbHVkZXMiLCIjcmFuZG9tQ29vcmQiLCJoaXRzIiwic3VuayIsImdhbWUiXSwic291cmNlUm9vdCI6IiJ9