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
    msg.textContent = `Click grid to place ${this.shipNames[counter]} (size: ${this.shipSizes[counter]})`;
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
game.aiGridListeners();
game.humanGridListeners();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNuQjtFQUVBL0YsR0FBR0EsQ0FBQSxFQUFHO0lBQ0osSUFBSSxDQUFDOEYsSUFBSSxFQUFFO0lBQ1gsSUFBSSxDQUFDakQsTUFBTSxDQUFDLENBQUM7RUFDZjtFQUVBQSxNQUFNQSxDQUFBLEVBQUc7SUFDUCxJQUFJLElBQUksQ0FBQ2lELElBQUksS0FBSyxJQUFJLENBQUM5RCxNQUFNLEVBQUU7TUFDN0IsSUFBSSxDQUFDK0QsSUFBSSxHQUFHLElBQUk7SUFDbEI7SUFDQSxPQUFPLElBQUksQ0FBQ0EsSUFBSTtFQUNsQjtBQUNGOzs7Ozs7VUNsQkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05rQztBQUVsQyxNQUFNQyxJQUFJLEdBQUcsSUFBSTVDLGlEQUFRLENBQUMsQ0FBQztBQUMzQjRDLElBQUksQ0FBQ3RCLGVBQWUsQ0FBQyxDQUFDO0FBQ3RCc0IsSUFBSSxDQUFDckMsa0JBQWtCLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9kb21CdWlsZGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWxvb3AuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXJzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2NyaXB0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIERPTWJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBjb25zdCBzaGlwcyA9IHsnQ2Fycmllcic6IDUsICdCYXR0bGVzaGlwJzogNCwgJ0Rlc3Ryb3llcic6IDMsICdTdWJtYXJpbmUnOiAzLCAnUGF0cm9sIEJvYXQnOiAyfVxuICAgIHRoaXMuc2hpcE5hbWVzID0gWydDYXJyaWVyJywgJ0JhdHRsZXNoaXAnLCAnRGVzdHJveWVyJywgJ1N1Ym1hcmluZScsICdQYXRyb2wgQm9hdCddO1xuICAgIHRoaXMuc2hpcFNpemVzID0gWzUsIDQsIDMsIDMsIDJdO1xuXG4gICAgdGhpcy5nYW1lQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtY29udGFpbmVyJyk7XG4gICAgLy8gY3JlYXRlIGNvbnRhaW5lcnMgZm9yIGVsZW1lbnRzOlxuICAgICAgLy8gMiBwbGF5ZXIgY29udGFpbmVyc1xuICAgIHRoaXMucGxheWVyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5haUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMucGxheWVyQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3BsYXllci1jb250YWluZXInKTtcbiAgICB0aGlzLmFpQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3BsYXllci1jb250YWluZXInKTtcbiAgICAgIC8vIGVhY2ggY29udGFpbmVyIGNvbnRhaW5zOlxuICAgICAgICAvLyBQbGF5ZXIgdGl0bGVcbiAgICAgICAgY29uc3QgcGxheWVyVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpXG4gICAgICAgIHBsYXllclRpdGxlLnRleHRDb250ZW50ID0gJ1BsYXllcic7XG5cbiAgICAgICAgY29uc3QgYWlUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG4gICAgICAgIGFpVGl0bGUudGV4dENvbnRlbnQgPSAnQ29tcHV0ZXInO1xuXG4gICAgICAgIC8vIEdhbWUgYm9hcmQgZ3JpZCAoMTAgeCAxMClcbiAgICAgICAgY29uc3QgcGxheWVyR3JpZCA9IHRoaXMuI2dyaWRQb3B1bGF0ZSgnaHVtYW4nKTtcbiAgICAgICAgY29uc3QgYWlHcmlkID0gdGhpcy4jZ3JpZFBvcHVsYXRlKCdhaScpO1xuXG4gICAgICAgIHRoaXMucGxheWVyTXNnID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICAgICAgICB0aGlzLnVwZGF0ZVBsYXllck1zZygwKTtcbiAgICAgICAgdGhpcy5wbGF5ZXJNc2cuaWQgPSAncGxheWVyTXNnJztcblxuICAgICAgICBjb25zdCBvcmllbnRhdGlvbkJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBvcmllbnRhdGlvbkJ0bi50ZXh0Q29udGVudCA9ICdob3Jpem9udGFsJztcbiAgICAgICAgb3JpZW50YXRpb25CdG4uaWQgPSAnb3JpZW50YXRpb25CdG4nO1xuXG4gICAgICB0aGlzLnBsYXllckNvbnRhaW5lci5hcHBlbmQocGxheWVyVGl0bGUsIHBsYXllckdyaWQsIHRoaXMucGxheWVyTXNnLCBvcmllbnRhdGlvbkJ0bik7XG4gICAgICB0aGlzLmFpQ29udGFpbmVyLmFwcGVuZChhaVRpdGxlLCBhaUdyaWQpO1xuXG4gICAgdGhpcy5nYW1lQ29udGFpbmVyLmFwcGVuZCh0aGlzLnBsYXllckNvbnRhaW5lciwgdGhpcy5haUNvbnRhaW5lcik7XG4gIH1cblxuICBoaXQoZ3JpZEl0ZW0pIHtcbiAgICBncmlkSXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdzaGlwJyk7XG4gICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZCgnaGl0Jyk7XG4gIH07XG5cbiAgbWlzcyhncmlkSXRlbSkge1xuICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5hZGQoJ21pc3MnKTtcbiAgfVxuXG4gIHNoaXAoZ3JpZEl0ZW0pIHtcbiAgICBncmlkSXRlbS5jbGFzc0xpc3QuYWRkKCdzaGlwJyk7XG4gIH07XG5cbiAgaGlkZUVsZW1lbnQoZWxlbWVudCkge1xuICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfVxuXG4gIHVwZGF0ZVBsYXllck1zZyhjb3VudGVyKSB7XG4gICAgbGV0IG1zZyA9IHRoaXMucGxheWVyTXNnO1xuICAgIG1zZy50ZXh0Q29udGVudCA9IGBDbGljayBncmlkIHRvIHBsYWNlICR7dGhpcy5zaGlwTmFtZXNbY291bnRlcl19IChzaXplOiAke3RoaXMuc2hpcFNpemVzW2NvdW50ZXJdfSlgXG4gIH1cblxuICAjZ3JpZFBvcHVsYXRlKHBsYXllcikge1xuICAgIGNvbnN0IGdyaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBncmlkLmNsYXNzTGlzdC5hZGQoJ2dyaWQnLCBwbGF5ZXIpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDA7IGkrKykge1xuICAgICAgY29uc3QgZ3JpZEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5hZGQoJ2dyaWQtaXRlbScsIHBsYXllcik7XG4gICAgICBncmlkSXRlbS5kYXRhc2V0LmNvb3JkaW5hdGVzID0gdGhpcy4jY29vcmRzUG9wdWxhdGUoaSk7XG4gICAgICBncmlkLmFwcGVuZENoaWxkKGdyaWRJdGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIGdyaWQ7XG4gIH1cblxuICAjY29vcmRzUG9wdWxhdGUoaSkge1xuICAgIGlmIChpIDwgMTApIHtcbiAgICAgIHJldHVybiBbaSwgMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBkaWdpdHMgPSBpLnRvU3RyaW5nKCkuc3BsaXQoJycpO1xuICAgICAgcmV0dXJuIFtkaWdpdHNbMV0sIGRpZ2l0c1swXV07XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgU2hpcCBmcm9tICcuL3NoaXBzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZWJvYXJkIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hbGxTaGlwcyA9IFtdO1xuICAgIHRoaXMubWlzc2VkU2hvdHMgPSBbXTtcbiAgfTtcblxuICBwbGFjZVNoaXAoc2l6ZSwgZmlyc3RDb29yZCwgb3JpZW50YXRpb249J2hvcml6b250YWwnKSB7XG4gICAgY29uc3QgY29vcmRpbmF0ZXMgPSB0aGlzLiNidWlsZENvb3JkaW5hdGVzKHNpemUsIGZpcnN0Q29vcmQsIG9yaWVudGF0aW9uKTtcbiAgICBjb29yZGluYXRlcy5mb3JFYWNoKChjb29yZCkgPT4ge1xuICAgICAgLy8gSWYgYSBzaGlwIGFscmVhZHkgZXhpc3RzIGF0IGxvY2F0aW9uLCByZWplY3QgaXQuXG4gICAgICBpZiAodGhpcy4jZmluZFNoaXAoY29vcmQpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KVxuICAgIGNvbnN0IG5ld1NoaXAgPSBuZXcgU2hpcChzaXplKTtcbiAgICBjb25zdCBzaGlwRW50cnkgPSBbbmV3U2hpcCwgY29vcmRpbmF0ZXNdO1xuICAgIHRoaXMuYWxsU2hpcHMucHVzaChzaGlwRW50cnkpO1xuICAgIHJldHVybiBjb29yZGluYXRlcztcbiAgfVxuXG4gIC8vIHJlY2VpdmVBdHRhY2sgZnVuY3Rpb24gdGFrZXMgY29vcmRpbmF0ZXMsIGRldGVybWluZXMgd2hldGhlciBvciBub3QgdGhlIGF0dGFjayBoaXQgYSBzaGlwXG4gIC8vIHRoZW4gc2VuZHMgdGhlIOKAmGhpdOKAmSBmdW5jdGlvbiB0byB0aGUgY29ycmVjdCBzaGlwLCBvciByZWNvcmRzIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgbWlzc2VkIHNob3QuXG4gIHJlY2VpdmVBdHRhY2soY29vcmRpbmF0ZSkge1xuICAgIGNvbnN0IHNoaXAgPSB0aGlzLiNmaW5kU2hpcChjb29yZGluYXRlKTtcbiAgICBpZiAoc2hpcCkge1xuICAgICAgc2hpcC5oaXQoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1pc3NlZFNob3RzLnB1c2goY29vcmRpbmF0ZSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZ2FtZU92ZXIoKSB7XG4gICAgbGV0IGFsbFN1bmsgPSB0cnVlO1xuICAgIHRoaXMuYWxsU2hpcHMuZm9yRWFjaChzaGlwID0+IHtcbiAgICAgIGlmICghc2hpcFswXS5pc1N1bmsoKSkge1xuICAgICAgICBhbGxTdW5rID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gYWxsU3VuaztcbiAgfVxuXG4gICNidWlsZENvb3JkaW5hdGVzKHNpemUsIGZpcnN0Q29vcmQsIG9yaWVudGF0aW9uKSB7XG4gICAgbGV0IGNvb3JkaW5hdGVzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgIGNvb3JkaW5hdGVzLnB1c2goW2ZpcnN0Q29vcmRbMF0gKyBpLCBmaXJzdENvb3JkWzFdXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb29yZGluYXRlcy5wdXNoKFtmaXJzdENvb3JkWzBdLCBmaXJzdENvb3JkWzFdICsgaV0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gIH1cblxuICAjZmluZFNoaXAoY29vcmRpbmF0ZSkge1xuICAgIGxldCBmb3VuZFNoaXAgPSBmYWxzZTtcbiAgICB0aGlzLmFsbFNoaXBzLmZvckVhY2goc2hpcCA9PiB7XG4gICAgICBpZiAoc2hpcFsxXS5zb21lKCh4KSA9PiB4WzBdID09PSBjb29yZGluYXRlWzBdICYmIHhbMV0gPT09IGNvb3JkaW5hdGVbMV0pKSB7XG4gICAgICAgIGZvdW5kU2hpcCA9IHNoaXBbMF07XG4gICAgfX0pXG4gICAgcmV0dXJuIGZvdW5kU2hpcDtcbiAgfVxufVxuIiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi9wbGF5ZXJzXCI7XG5pbXBvcnQgRE9NYnVpbGRlciBmcm9tIFwiLi9kb21CdWlsZGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVsb29wIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5odW1hbiA9IG5ldyBQbGF5ZXIodHJ1ZSk7XG4gICAgdGhpcy5haSA9IG5ldyBQbGF5ZXIoZmFsc2UpO1xuICAgIHRoaXMucGxheWVycyA9IFt0aGlzLmh1bWFuLCB0aGlzLmFpXTtcbiAgICB0aGlzLnBhZ2UgPSBuZXcgRE9NYnVpbGRlcigpO1xuICAgIHRoaXMuc2hpcFR5cGVzID0geydDYXJyaWVyJzogNSwgJ0JhdHRsZXNoaXAnOiA0LCAnRGVzdHJveWVyJzogMywgJ1N1Ym1hcmluZSc6IDMsICdQYXRyb2wgQm9hdCc6IDJ9XG4gICAgdGhpcy4jYWlTaGlwcygpO1xuICB9XG5cbiAgaHVtYW5HcmlkTGlzdGVuZXJzKCkge1xuICAgIHRoaXMuI29yaWVudGF0aW9uQnRuTGlzdGVuZXIoKTtcbiAgICBjb25zdCBvcmllbnRhdGlvbkJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvcmllbnRhdGlvbkJ0bicpO1xuICAgIGNvbnN0IGdyaWRJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ3JpZC1pdGVtLmh1bWFuXCIpO1xuICAgIGxldCBwbGFjZW1lbnRDb3VudGVyID0gMDtcbiAgICBsZXQgc2hpcFNpemUgPSBbNSwgNCwgMywgMywgMl07XG5cbiAgICBncmlkSXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBpZiAocGxhY2VtZW50Q291bnRlciA+PSBzaGlwU2l6ZS5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgdGhpcy5wYWdlLmhpZGVFbGVtZW50KG9yaWVudGF0aW9uQnRuKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uQnRuLnRleHRDb250ZW50O1xuICAgICAgICBsZXQgY29vcmRzID0gaXRlbS5kYXRhc2V0LmNvb3JkaW5hdGVzXG4gICAgICAgICAgLnNwbGl0KFwiLFwiKVxuICAgICAgICAgIC5tYXAoKHgpID0+IHBhcnNlSW50KHgsIDEwKSk7XG4gICAgICAgIGxldCBjb29yZGluYXRlcyA9IHRoaXMuaHVtYW4uYm9hcmQucGxhY2VTaGlwKHNoaXBTaXplW3BsYWNlbWVudENvdW50ZXJdLCBjb29yZHMsIG9yaWVudGF0aW9uKTtcbiAgICAgICAgLy8gU2hvdyBzaGlwIG9uIHNjcmVlbi5cbiAgICAgICAgY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmQpID0+IHtcbiAgICAgICAgICB0aGlzLnBhZ2Uuc2hpcCh0aGlzLiNmaW5kR3JpZEl0ZW0oY29vcmQsIFwiaHVtYW5cIikpO1xuICAgICAgICB9KTtcbiAgICAgICAgcGxhY2VtZW50Q291bnRlcisrO1xuICAgICAgICB0aGlzLnBhZ2UudXBkYXRlUGxheWVyTXNnKHBsYWNlbWVudENvdW50ZXIpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBhc3luYyBodW1hbkJ0bkxpc3RlbmVyKCkge1xuICAvLyAgIGNvbnN0IGh1bWFuU2hpcHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheWVyU2hpcHNCdG4nKTtcblxuICAvLyAgIGh1bWFuU2hpcHMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XG4gIC8vICAgICB0aGlzLiNvcmllbnRhdGlvbkJ0bkxpc3RlbmVyKCk7XG4gIC8vICAgICBmb3IgKGxldCBlbnRyeSBvZiBPYmplY3QuZW50cmllcyh0aGlzLnNoaXBUeXBlcykpIHtcbiAgLy8gICAgICAgY29uc3QgW3NoaXBUeXBlLCBzaGlwU2l6ZV0gPSBlbnRyeTtcbiAgLy8gICAgICAgaHVtYW5TaGlwcy50ZXh0Q29udGVudCA9IGBQbGFjZSAke3NoaXBUeXBlfWA7XG4gIC8vICAgICAgIGh1bWFuU2hpcHMuZGF0YXNldC5zaGlwU2l6ZSA9IHNoaXBTaXplO1xuICAvLyAgICAgICBhd2FpdCB0aGlzLiNodW1hbkdyaWRMaXN0ZW5lcnMoc2hpcFNpemUpO1xuICAvLyAgICAgfVxuICAvLyAgIH0pXG4gIC8vIH1cblxuICAvLyBhc3luYyAjaHVtYW5HcmlkTGlzdGVuZXJzKHNoaXBTaXplKSB7XG4gIC8vICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ncmlkLWl0ZW0uaHVtYW5cIik7XG5cbiAgLy8gICBncmlkSXRlbXMuZm9yRWFjaChhc3luYyAoaXRlbSkgPT4ge1xuICAvLyAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xuICAvLyAgICAgICBsZXQgY29vcmRzID0gaXRlbS5kYXRhc2V0LmNvb3JkaW5hdGVzXG4gIC8vICAgICAgICAgLnNwbGl0KFwiLFwiKVxuICAvLyAgICAgICAgIC5tYXAoKHgpID0+IHBhcnNlSW50KHgsIDEwKSk7XG4gIC8vICAgICAgIHRoaXMuaHVtYW4uYm9hcmQucGxhY2VTaGlwKHNoaXBTaXplLCBjb29yZHMsIG9yaWVudGF0aW9uKTtcbiAgLy8gICAgIH0pLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAvLyAgICAgICByZXR1cm4gdHJ1ZTtcbiAgLy8gICAgIH0pXG4gIC8vICAgfSk7XG4gIC8vIH1cblxuICAvLyBhc3luYyAjaHVtYW5TaGlwUGxhY2VtZW50KHNoaXBTaXplKSB7XG4gIC8vICAgY29uc3Qgb3JpZW50YXRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3JpZW50YXRpb25CdG4nKS50ZXh0Q29udGVudDtcbiAgLy8gICBjb25zdCBjb29yZCA9IHRoaXMuI2h1bWFuR3JpZExpc3RlbmVycygpO1xuICAvLyAgIHRoaXMuaHVtYW4uYm9hcmQucGxhY2VTaGlwKHNoaXBTaXplLCBjb29yZCwgb3JpZW50YXRpb24pXG4gIC8vIH1cblxuICAjb3JpZW50YXRpb25CdG5MaXN0ZW5lcigpIHtcbiAgICBjb25zdCBvcmllbnRhdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvcmllbnRhdGlvbkJ0bicpO1xuICAgIG9yaWVudGF0aW9uLmRpc3BsYXkgPSAnYmxvY2snO1xuXG4gICAgb3JpZW50YXRpb24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBsZXQgdGV4dCA9IG9yaWVudGF0aW9uLnRleHRDb250ZW50O1xuICAgICAgb3JpZW50YXRpb24udGV4dENvbnRlbnQgPSB0ZXh0ID09PSAnaG9yaXpvbnRhbCcgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xuICAgIH0pXG4gIH1cblxuICBhaUdyaWRMaXN0ZW5lcnMoKSB7XG4gICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ncmlkLWl0ZW0uYWlcIik7XG4gICAgZ3JpZEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgbGV0IGNvb3JkcyA9IGl0ZW0uZGF0YXNldC5jb29yZGluYXRlc1xuICAgICAgICAgIC5zcGxpdChcIixcIilcbiAgICAgICAgICAubWFwKCh4KSA9PiBwYXJzZUludCh4LCAxMCkpO1xuICAgICAgICBpZiAodGhpcy5haS5ib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkcykpIHtcbiAgICAgICAgICAvLyBpZiBhIHNoaXAgaXMgaGl0IHRoZW4gLi4uXG4gICAgICAgICAgdGhpcy5wYWdlLmhpdChpdGVtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBpZiBhIHNoaXAgaXMgbm90IGhpdCB0aGVuIC4uLlxuICAgICAgICAgIHRoaXMucGFnZS5taXNzKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gICNhaVNoaXBzKCkge1xuICAgIGNvbnN0IHNoaXBTaXplcyA9IFs1LCA0LCAzLCAzLCAyXTtcbiAgICBzaGlwU2l6ZXMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgbGV0IGNvb3JkaW5hdGVzID0gdGhpcy4jYWlTaGlwUGxhY2VtZW50KHNoaXApO1xuXG4gICAgICB3aGlsZSAoIWNvb3JkaW5hdGVzKSB7XG4gICAgICAgIGNvb3JkaW5hdGVzID0gdGhpcy4jYWlTaGlwUGxhY2VtZW50KHNoaXApO1xuICAgICAgfVxuXG4gICAgICAvLyBzaG93IGFpIHNoaXBzIHdoaWxlIHRlc3RpbmcuXG4gICAgICBjb29yZGluYXRlcy5mb3JFYWNoKChjb29yZCkgPT4ge1xuICAgICAgICB0aGlzLnBhZ2Uuc2hpcCh0aGlzLiNmaW5kR3JpZEl0ZW0oY29vcmQsIFwiYWlcIikpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAjYWlTaGlwUGxhY2VtZW50KHNoaXApIHtcbiAgICBsZXQgb3JpZW50YXRpb24gPSB0aGlzLiNyYW5kb21OdW0oMikgPT09IDAgPyBcImhvcml6b250YWxcIiA6IFwidmVydGljYWxcIjtcbiAgICBsZXQgY29vcmQgPVxuICAgICAgb3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiXG4gICAgICAgID8gW3RoaXMuI3JhbmRvbU51bSgxMCAtIHNoaXApLCB0aGlzLiNyYW5kb21OdW0oMTApXVxuICAgICAgICA6IFt0aGlzLiNyYW5kb21OdW0oMTApLCB0aGlzLiNyYW5kb21OdW0oMTAgLSBzaGlwKV07XG4gICAgbGV0IGNvb3JkaW5hdGVzID0gdGhpcy5haS5ib2FyZC5wbGFjZVNoaXAoc2hpcCwgY29vcmQsIG9yaWVudGF0aW9uKTtcbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gIH1cblxuICAjcmFuZG9tTnVtKG1heCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xuICB9XG5cbiAgI2ZpbmRHcmlkSXRlbShjb29yZCwgcGxheWVyKSB7XG4gICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLmdyaWQtaXRlbS4ke3BsYXllcn1gKTtcbiAgICBsZXQgZm91bmRJdGVtID0gZmFsc2U7XG4gICAgZ3JpZEl0ZW1zLmZvckVhY2goKGdyaWRJdGVtKSA9PiB7XG4gICAgICBpZiAoZ3JpZEl0ZW0uZGF0YXNldC5jb29yZGluYXRlcyA9PT0gY29vcmQudG9TdHJpbmcoKSkge1xuICAgICAgICBmb3VuZEl0ZW0gPSBncmlkSXRlbTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZm91bmRJdGVtO1xuICB9XG59XG4iLCJpbXBvcnQgR2FtZWJvYXJkIGZyb20gXCIuL2dhbWVib2FyZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihodW1hbj10cnVlKSB7XG4gICAgdGhpcy5ib2FyZCA9IG5ldyBHYW1lYm9hcmQ7XG4gICAgdGhpcy5pc0h1bWFuID0gaHVtYW47XG4gICAgdGhpcy5wcmV2aW91c1BsYXlzID0gW107XG4gIH07XG5cbiAgYXR0YWNrKHBsYXllciwgY29vcmRpbmF0ZSkge1xuICAgIGlmICghdGhpcy5pc0h1bWFuKSB7XG4gICAgICBjb29yZGluYXRlID0gdGhpcy4jYWlBdHRhY2socGxheWVyLmJvYXJkKTtcbiAgICB9XG5cbiAgICB0aGlzLnByZXZpb3VzUGxheXMucHVzaChjb29yZGluYXRlKTtcbiAgICBwbGF5ZXIuYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZGluYXRlKTtcbiAgfVxuXG4gICNhaUF0dGFjayhib2FyZCkge1xuICAgIGxldCBjb29yZGluYXRlID0gdGhpcy4jcmFuZG9tQ29vcmQoKTtcbiAgICBpZiAodGhpcy5wcmV2aW91c1BsYXlzLmluY2x1ZGVzKGNvb3JkaW5hdGUpKSB7XG4gICAgICB0aGlzLiNhaUF0dGFjayhib2FyZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjb29yZGluYXRlO1xuICAgIH1cbiAgfVxuXG4gIC8vIEdlbmVyYXRlIHJhbmRvbSBjb29yZGluYXRlcyBiZXR3ZWVuIDAgLSA5LlxuICAjcmFuZG9tQ29vcmQoKSB7XG4gICAgcmV0dXJuIFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCksIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKV07XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoaXAge1xuICBjb25zdHJ1Y3RvcihzaXplKSB7XG4gICAgdGhpcy5sZW5ndGggPSBzaXplO1xuICAgIHRoaXMuaGl0cyA9IDA7XG4gICAgdGhpcy5zdW5rID0gZmFsc2U7XG4gIH1cblxuICBoaXQoKSB7XG4gICAgdGhpcy5oaXRzKys7XG4gICAgdGhpcy5pc1N1bmsoKTtcbiAgfVxuXG4gIGlzU3VuaygpIHtcbiAgICBpZiAodGhpcy5oaXRzID09PSB0aGlzLmxlbmd0aCkge1xuICAgICAgdGhpcy5zdW5rID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3VuaztcbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgR2FtZWxvb3AgZnJvbSBcIi4vZ2FtZWxvb3BcIjtcblxuY29uc3QgZ2FtZSA9IG5ldyBHYW1lbG9vcCgpO1xuZ2FtZS5haUdyaWRMaXN0ZW5lcnMoKTtcbmdhbWUuaHVtYW5HcmlkTGlzdGVuZXJzKCk7XG4iXSwibmFtZXMiOlsiRE9NYnVpbGRlciIsImNvbnN0cnVjdG9yIiwic2hpcHMiLCJzaGlwTmFtZXMiLCJzaGlwU2l6ZXMiLCJnYW1lQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInBsYXllckNvbnRhaW5lciIsImNyZWF0ZUVsZW1lbnQiLCJhaUNvbnRhaW5lciIsImNsYXNzTGlzdCIsImFkZCIsInBsYXllclRpdGxlIiwidGV4dENvbnRlbnQiLCJhaVRpdGxlIiwicGxheWVyR3JpZCIsImdyaWRQb3B1bGF0ZSIsImFpR3JpZCIsInBsYXllck1zZyIsImNyZWF0ZVRleHROb2RlIiwidXBkYXRlUGxheWVyTXNnIiwiaWQiLCJvcmllbnRhdGlvbkJ0biIsImFwcGVuZCIsImhpdCIsImdyaWRJdGVtIiwicmVtb3ZlIiwibWlzcyIsInNoaXAiLCJoaWRlRWxlbWVudCIsImVsZW1lbnQiLCJzdHlsZSIsImRpc3BsYXkiLCJjb3VudGVyIiwibXNnIiwiI2dyaWRQb3B1bGF0ZSIsInBsYXllciIsImdyaWQiLCJpIiwiZGF0YXNldCIsImNvb3JkaW5hdGVzIiwiY29vcmRzUG9wdWxhdGUiLCJhcHBlbmRDaGlsZCIsIiNjb29yZHNQb3B1bGF0ZSIsImRpZ2l0cyIsInRvU3RyaW5nIiwic3BsaXQiLCJTaGlwIiwiR2FtZWJvYXJkIiwiYWxsU2hpcHMiLCJtaXNzZWRTaG90cyIsInBsYWNlU2hpcCIsInNpemUiLCJmaXJzdENvb3JkIiwib3JpZW50YXRpb24iLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJidWlsZENvb3JkaW5hdGVzIiwiZm9yRWFjaCIsImNvb3JkIiwiZmluZFNoaXAiLCJuZXdTaGlwIiwic2hpcEVudHJ5IiwicHVzaCIsInJlY2VpdmVBdHRhY2siLCJjb29yZGluYXRlIiwiZ2FtZU92ZXIiLCJhbGxTdW5rIiwiaXNTdW5rIiwiI2J1aWxkQ29vcmRpbmF0ZXMiLCIjZmluZFNoaXAiLCJmb3VuZFNoaXAiLCJzb21lIiwieCIsIlBsYXllciIsIkdhbWVsb29wIiwiaHVtYW4iLCJhaSIsInBsYXllcnMiLCJwYWdlIiwic2hpcFR5cGVzIiwiYWlTaGlwcyIsImh1bWFuR3JpZExpc3RlbmVycyIsIm9yaWVudGF0aW9uQnRuTGlzdGVuZXIiLCJncmlkSXRlbXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwicGxhY2VtZW50Q291bnRlciIsInNoaXBTaXplIiwiaXRlbSIsImFkZEV2ZW50TGlzdGVuZXIiLCJjb29yZHMiLCJtYXAiLCJwYXJzZUludCIsImJvYXJkIiwiZmluZEdyaWRJdGVtIiwiI29yaWVudGF0aW9uQnRuTGlzdGVuZXIiLCJ0ZXh0IiwiYWlHcmlkTGlzdGVuZXJzIiwiI2FpU2hpcHMiLCJhaVNoaXBQbGFjZW1lbnQiLCIjYWlTaGlwUGxhY2VtZW50IiwicmFuZG9tTnVtIiwiI3JhbmRvbU51bSIsIm1heCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIiNmaW5kR3JpZEl0ZW0iLCJmb3VuZEl0ZW0iLCJpc0h1bWFuIiwicHJldmlvdXNQbGF5cyIsImF0dGFjayIsImFpQXR0YWNrIiwiI2FpQXR0YWNrIiwicmFuZG9tQ29vcmQiLCJpbmNsdWRlcyIsIiNyYW5kb21Db29yZCIsImhpdHMiLCJzdW5rIiwiZ2FtZSJdLCJzb3VyY2VSb290IjoiIn0=