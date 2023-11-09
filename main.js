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
      let coord = [this.#randomNum(10), this.#randomNum(10)];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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d0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTmtDO0FBRWxDLE1BQU1DLElBQUksR0FBRyxJQUFJbEQsaURBQVEsQ0FBQyxDQUFDO0FBQzNCa0QsSUFBSSxDQUFDM0MsS0FBSyxDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZG9tQnVpbGRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVsb29wLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcGxheWVycy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NjcmlwdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBET01idWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY29uc3Qgc2hpcHMgPSB7J0NhcnJpZXInOiA1LCAnQmF0dGxlc2hpcCc6IDQsICdEZXN0cm95ZXInOiAzLCAnU3VibWFyaW5lJzogMywgJ1BhdHJvbCBCb2F0JzogMn1cbiAgICB0aGlzLnNoaXBOYW1lcyA9IFsnQ2FycmllcicsICdCYXR0bGVzaGlwJywgJ0Rlc3Ryb3llcicsICdTdWJtYXJpbmUnLCAnUGF0cm9sIEJvYXQnXTtcbiAgICB0aGlzLnNoaXBTaXplcyA9IFs1LCA0LCAzLCAzLCAyXTtcblxuICAgIHRoaXMuZ2FtZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLWNvbnRhaW5lcicpO1xuICAgIC8vIGNyZWF0ZSBjb250YWluZXJzIGZvciBlbGVtZW50czpcbiAgICAgIC8vIDIgcGxheWVyIGNvbnRhaW5lcnNcbiAgICB0aGlzLnBsYXllckNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuYWlDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLnBsYXllckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItY29udGFpbmVyJyk7XG4gICAgdGhpcy5haUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItY29udGFpbmVyJyk7XG4gICAgICAvLyBlYWNoIGNvbnRhaW5lciBjb250YWluczpcbiAgICAgICAgLy8gUGxheWVyIHRpdGxlXG4gICAgICAgIGNvbnN0IHBsYXllclRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKVxuICAgICAgICBwbGF5ZXJUaXRsZS50ZXh0Q29udGVudCA9ICdQbGF5ZXInO1xuXG4gICAgICAgIGNvbnN0IGFpVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICAgICAgICBhaVRpdGxlLnRleHRDb250ZW50ID0gJ0NvbXB1dGVyJztcblxuICAgICAgICAvLyBHYW1lIGJvYXJkIGdyaWQgKDEwIHggMTApXG4gICAgICAgIGNvbnN0IHBsYXllckdyaWQgPSB0aGlzLiNncmlkUG9wdWxhdGUoJ2h1bWFuJyk7XG4gICAgICAgIGNvbnN0IGFpR3JpZCA9IHRoaXMuI2dyaWRQb3B1bGF0ZSgnYWknKTtcblxuICAgICAgICB0aGlzLnBsYXllck1zZyA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICAgICAgdGhpcy51cGRhdGVQbGF5ZXJNc2coMCk7XG4gICAgICAgIHRoaXMucGxheWVyTXNnLmlkID0gJ3BsYXllck1zZyc7XG5cbiAgICAgICAgY29uc3Qgb3JpZW50YXRpb25CdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgb3JpZW50YXRpb25CdG4udGV4dENvbnRlbnQgPSAnaG9yaXpvbnRhbCc7XG4gICAgICAgIG9yaWVudGF0aW9uQnRuLmlkID0gJ29yaWVudGF0aW9uQnRuJztcblxuICAgICAgdGhpcy5wbGF5ZXJDb250YWluZXIuYXBwZW5kKHBsYXllclRpdGxlLCBwbGF5ZXJHcmlkLCB0aGlzLnBsYXllck1zZywgb3JpZW50YXRpb25CdG4pO1xuICAgICAgdGhpcy5haUNvbnRhaW5lci5hcHBlbmQoYWlUaXRsZSwgYWlHcmlkKTtcblxuICAgIHRoaXMuZ2FtZUNvbnRhaW5lci5hcHBlbmQodGhpcy5wbGF5ZXJDb250YWluZXIsIHRoaXMuYWlDb250YWluZXIpO1xuICB9XG5cbiAgaGl0KGdyaWRJdGVtKSB7XG4gICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnc2hpcCcpO1xuICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5hZGQoJ2hpdCcpO1xuICB9O1xuXG4gIG1pc3MoZ3JpZEl0ZW0pIHtcbiAgICBncmlkSXRlbS5jbGFzc0xpc3QuYWRkKCdtaXNzJyk7XG4gIH1cblxuICBzaGlwKGdyaWRJdGVtKSB7XG4gICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZCgnc2hpcCcpO1xuICB9O1xuXG4gIGhpZGVFbGVtZW50KGVsZW1lbnQpIHtcbiAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIH1cblxuICB1cGRhdGVQbGF5ZXJNc2coY291bnRlcikge1xuICAgIGxldCBtc2cgPSB0aGlzLnBsYXllck1zZztcbiAgICBpZiAoY291bnRlciA8IDUpIHtcbiAgICAgIG1zZy50ZXh0Q29udGVudCA9IGBDbGljayBncmlkIHRvIHBsYWNlICR7dGhpcy5zaGlwTmFtZXNbY291bnRlcl19IChzaXplOiAke3RoaXMuc2hpcFNpemVzW2NvdW50ZXJdfSlgXG4gICAgfSBlbHNlIHtcbiAgICAgIG1zZy50ZXh0Q29udGVudCA9ICcnO1xuICAgIH1cbiAgfVxuXG4gICNncmlkUG9wdWxhdGUocGxheWVyKSB7XG4gICAgY29uc3QgZ3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGdyaWQuY2xhc3NMaXN0LmFkZCgnZ3JpZCcsIHBsYXllcik7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDsgaSsrKSB7XG4gICAgICBjb25zdCBncmlkSXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZCgnZ3JpZC1pdGVtJywgcGxheWVyKTtcbiAgICAgIGdyaWRJdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXMgPSB0aGlzLiNjb29yZHNQb3B1bGF0ZShpKTtcbiAgICAgIGdyaWQuYXBwZW5kQ2hpbGQoZ3JpZEl0ZW0pO1xuICAgIH1cbiAgICByZXR1cm4gZ3JpZDtcbiAgfVxuXG4gICNjb29yZHNQb3B1bGF0ZShpKSB7XG4gICAgaWYgKGkgPCAxMCkge1xuICAgICAgcmV0dXJuIFtpLCAwXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGRpZ2l0cyA9IGkudG9TdHJpbmcoKS5zcGxpdCgnJyk7XG4gICAgICByZXR1cm4gW2RpZ2l0c1sxXSwgZGlnaXRzWzBdXTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBTaGlwIGZyb20gJy4vc2hpcHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lYm9hcmQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFsbFNoaXBzID0gW107XG4gICAgdGhpcy5taXNzZWRTaG90cyA9IFtdO1xuICB9O1xuXG4gIHBsYWNlU2hpcChzaXplLCBmaXJzdENvb3JkLCBvcmllbnRhdGlvbj0naG9yaXpvbnRhbCcpIHtcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IHRoaXMuI2J1aWxkQ29vcmRpbmF0ZXMoc2l6ZSwgZmlyc3RDb29yZCwgb3JpZW50YXRpb24pO1xuICAgIGNvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkKSA9PiB7XG4gICAgICAvLyBJZiBhIHNoaXAgYWxyZWFkeSBleGlzdHMgYXQgbG9jYXRpb24sIHJlamVjdCBpdC5cbiAgICAgIGlmICh0aGlzLiNmaW5kU2hpcChjb29yZCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pXG4gICAgY29uc3QgbmV3U2hpcCA9IG5ldyBTaGlwKHNpemUpO1xuICAgIGNvbnN0IHNoaXBFbnRyeSA9IFtuZXdTaGlwLCBjb29yZGluYXRlc107XG4gICAgdGhpcy5hbGxTaGlwcy5wdXNoKHNoaXBFbnRyeSk7XG4gICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xuICB9XG5cbiAgLy8gcmVjZWl2ZUF0dGFjayBmdW5jdGlvbiB0YWtlcyBjb29yZGluYXRlcywgZGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCB0aGUgYXR0YWNrIGhpdCBhIHNoaXBcbiAgLy8gdGhlbiBzZW5kcyB0aGUg4oCYaGl04oCZIGZ1bmN0aW9uIHRvIHRoZSBjb3JyZWN0IHNoaXAsIG9yIHJlY29yZHMgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBtaXNzZWQgc2hvdC5cbiAgcmVjZWl2ZUF0dGFjayhjb29yZGluYXRlKSB7XG4gICAgY29uc3Qgc2hpcCA9IHRoaXMuI2ZpbmRTaGlwKGNvb3JkaW5hdGUpO1xuICAgIGlmIChzaGlwKSB7XG4gICAgICBzaGlwLmhpdCgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWlzc2VkU2hvdHMucHVzaChjb29yZGluYXRlKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBnYW1lT3ZlcigpIHtcbiAgICBsZXQgYWxsU3VuayA9IHRydWU7XG4gICAgLy8gSWYgc2hpcHMgaGF2ZW4ndCB5ZXQgYmVlbiBwbGFjZWQsIHJldHVybiBmYWxzZS5cbiAgICBpZiAodGhpcy5hbGxTaGlwcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5hbGxTaGlwcy5mb3JFYWNoKHNoaXAgPT4ge1xuICAgICAgaWYgKCFzaGlwWzBdLmlzU3VuaygpKSB7XG4gICAgICAgIGFsbFN1bmsgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBhbGxTdW5rO1xuICB9XG5cbiAgI2J1aWxkQ29vcmRpbmF0ZXMoc2l6ZSwgZmlyc3RDb29yZCwgb3JpZW50YXRpb24pIHtcbiAgICBsZXQgY29vcmRpbmF0ZXMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgaWYgKG9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgY29vcmRpbmF0ZXMucHVzaChbZmlyc3RDb29yZFswXSArIGksIGZpcnN0Q29vcmRbMV1dKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvb3JkaW5hdGVzLnB1c2goW2ZpcnN0Q29vcmRbMF0sIGZpcnN0Q29vcmRbMV0gKyBpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb29yZGluYXRlcztcbiAgfVxuXG4gICNmaW5kU2hpcChjb29yZGluYXRlKSB7XG4gICAgbGV0IGZvdW5kU2hpcCA9IGZhbHNlO1xuICAgIHRoaXMuYWxsU2hpcHMuZm9yRWFjaChzaGlwID0+IHtcbiAgICAgIGlmIChzaGlwWzFdLnNvbWUoKHgpID0+IHhbMF0gPT09IGNvb3JkaW5hdGVbMF0gJiYgeFsxXSA9PT0gY29vcmRpbmF0ZVsxXSkpIHtcbiAgICAgICAgZm91bmRTaGlwID0gc2hpcFswXTtcbiAgICB9fSlcbiAgICByZXR1cm4gZm91bmRTaGlwO1xuICB9XG59XG4iLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuL3BsYXllcnNcIjtcbmltcG9ydCBET01idWlsZGVyIGZyb20gXCIuL2RvbUJ1aWxkZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZWxvb3Age1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmh1bWFuID0gbmV3IFBsYXllcih0cnVlKTtcbiAgICB0aGlzLmFpID0gbmV3IFBsYXllcihmYWxzZSk7XG4gICAgdGhpcy5wbGF5ZXJzID0gW3RoaXMuaHVtYW4sIHRoaXMuYWldO1xuICAgIHRoaXMuY3VycmVudFBsYXllciA9IHRoaXMuYWk7XG4gICAgdGhpcy5yb3VuZCA9IG51bGw7XG4gICAgdGhpcy5wYWdlID0gbmV3IERPTWJ1aWxkZXIoKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuI2FpU2hpcHMoKTtcbiAgICB0aGlzLmFpR3JpZExpc3RlbmVycygpO1xuICAgIHRoaXMuaHVtYW5HcmlkTGlzdGVuZXJzKCk7XG5cbiAgICBsZXQgY3VycmVudFJvdW5kID0gdGhpcy5yb3VuZDtcblxuICAgIGNvbnN0IHBsYXlSb3VuZCA9ICgpID0+IHtcbiAgICAgIGlmICghdGhpcy4jZ2FtZU92ZXIoKSkge1xuICAgICAgICB0aGlzLiNhaUF0dGFjaygpO1xuICAgICAgICBpZiAoY3VycmVudFJvdW5kICE9PSB0aGlzLnJvdW5kKSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50UGxheWVyID0gdGhpcy5jdXJyZW50UGxheWVyID09PSB0aGlzLmh1bWFuID8gdGhpcy5haSA6IHRoaXMuaHVtYW47XG4gICAgICAgICAgY3VycmVudFJvdW5kID0gdGhpcy5yb3VuZDtcbiAgICAgICAgfVxuICAgICAgICBzZXRUaW1lb3V0KHBsYXlSb3VuZCwgMCk7IC8vIFNjaGVkdWxlIHRoZSBuZXh0IHJvdW5kIGFmdGVyIGEgdmVyeSBzaG9ydCBkZWxheVxuICAgICAgfVxuICAgIH07XG5cbiAgICBwbGF5Um91bmQoKTtcbiAgfVxuXG5cbiAgaHVtYW5HcmlkTGlzdGVuZXJzKCkge1xuICAgIHRoaXMuI29yaWVudGF0aW9uQnRuTGlzdGVuZXIoKTtcbiAgICBjb25zdCBvcmllbnRhdGlvbkJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JpZW50YXRpb25CdG5cIik7XG4gICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ncmlkLWl0ZW0uaHVtYW5cIik7XG4gICAgbGV0IHBsYWNlbWVudENvdW50ZXIgPSAwO1xuICAgIGxldCBzaGlwU2l6ZSA9IFs1LCA0LCAzLCAzLCAyXTtcblxuICAgIGdyaWRJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGlmIChwbGFjZW1lbnRDb3VudGVyID49IHNoaXBTaXplLmxlbmd0aCAtIDEgJiYgIXRoaXMucm91bmQpIHtcbiAgICAgICAgICB0aGlzLnBhZ2UuaGlkZUVsZW1lbnQob3JpZW50YXRpb25CdG4pO1xuICAgICAgICAgIHRoaXMucm91bmQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9yaWVudGF0aW9uID0gb3JpZW50YXRpb25CdG4udGV4dENvbnRlbnQ7XG4gICAgICAgIGxldCBjb29yZHMgPSBpdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXNcbiAgICAgICAgICAuc3BsaXQoXCIsXCIpXG4gICAgICAgICAgLm1hcCgoeCkgPT4gcGFyc2VJbnQoeCwgMTApKTtcbiAgICAgICAgbGV0IGNvb3JkaW5hdGVzID0gdGhpcy5odW1hbi5ib2FyZC5wbGFjZVNoaXAoXG4gICAgICAgICAgc2hpcFNpemVbcGxhY2VtZW50Q291bnRlcl0sXG4gICAgICAgICAgY29vcmRzLFxuICAgICAgICAgIG9yaWVudGF0aW9uXG4gICAgICAgICk7XG4gICAgICAgIC8vIFNob3cgc2hpcCBvbiBzY3JlZW4uXG4gICAgICAgIGNvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkKSA9PiB7XG4gICAgICAgICAgdGhpcy5wYWdlLnNoaXAodGhpcy4jZmluZEdyaWRJdGVtKGNvb3JkLCBcImh1bWFuXCIpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHBsYWNlbWVudENvdW50ZXIrKztcbiAgICAgICAgdGhpcy5wYWdlLnVwZGF0ZVBsYXllck1zZyhwbGFjZW1lbnRDb3VudGVyKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgI29yaWVudGF0aW9uQnRuTGlzdGVuZXIoKSB7XG4gICAgY29uc3Qgb3JpZW50YXRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yaWVudGF0aW9uQnRuXCIpO1xuICAgIG9yaWVudGF0aW9uLmRpc3BsYXkgPSBcImJsb2NrXCI7XG5cbiAgICBvcmllbnRhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgbGV0IHRleHQgPSBvcmllbnRhdGlvbi50ZXh0Q29udGVudDtcbiAgICAgIG9yaWVudGF0aW9uLnRleHRDb250ZW50ID1cbiAgICAgICAgdGV4dCA9PT0gXCJob3Jpem9udGFsXCIgPyBcInZlcnRpY2FsXCIgOiBcImhvcml6b250YWxcIjtcbiAgICB9KTtcbiAgfVxuXG4gIGFpR3JpZExpc3RlbmVycygpIHtcbiAgICBjb25zdCBncmlkSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdyaWQtaXRlbS5haVwiKTtcbiAgICBncmlkSXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGxheWVyID09PSB0aGlzLmh1bWFuKSB7XG4gICAgICAgICAgbGV0IGNvb3JkcyA9IGl0ZW0uZGF0YXNldC5jb29yZGluYXRlc1xuICAgICAgICAgICAgLnNwbGl0KFwiLFwiKVxuICAgICAgICAgICAgLm1hcCgoeCkgPT4gcGFyc2VJbnQoeCwgMTApKTtcbiAgICAgICAgICBpZiAodGhpcy5haS5ib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkcykpIHtcbiAgICAgICAgICAgIC8vIGlmIGEgc2hpcCBpcyBoaXQgdGhlbiAuLi5cbiAgICAgICAgICAgIHRoaXMucGFnZS5oaXQoaXRlbSk7XG4gICAgICAgICAgICB0aGlzLnJvdW5kKys7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGlmIGEgc2hpcCBpcyBub3QgaGl0IHRoZW4gLi4uXG4gICAgICAgICAgICB0aGlzLnBhZ2UubWlzcyhpdGVtKTtcbiAgICAgICAgICAgIHRoaXMucm91bmQrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgI2FpU2hpcHMoKSB7XG4gICAgY29uc3Qgc2hpcFNpemVzID0gWzUsIDQsIDMsIDMsIDJdO1xuICAgIHNoaXBTaXplcy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBsZXQgY29vcmRpbmF0ZXMgPSB0aGlzLiNhaVNoaXBQbGFjZW1lbnQoc2hpcCk7XG5cbiAgICAgIHdoaWxlICghY29vcmRpbmF0ZXMpIHtcbiAgICAgICAgY29vcmRpbmF0ZXMgPSB0aGlzLiNhaVNoaXBQbGFjZW1lbnQoc2hpcCk7XG4gICAgICB9XG5cbiAgICAgIC8vIHNob3cgYWkgc2hpcHMgd2hpbGUgdGVzdGluZy5cbiAgICAgIGNvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkKSA9PiB7XG4gICAgICAgIHRoaXMucGFnZS5zaGlwKHRoaXMuI2ZpbmRHcmlkSXRlbShjb29yZCwgXCJhaVwiKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gICNhaVNoaXBQbGFjZW1lbnQoc2hpcCkge1xuICAgIGxldCBvcmllbnRhdGlvbiA9IHRoaXMuI3JhbmRvbU51bSgyKSA9PT0gMCA/IFwiaG9yaXpvbnRhbFwiIDogXCJ2ZXJ0aWNhbFwiO1xuICAgIGxldCBjb29yZCA9XG4gICAgICBvcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCJcbiAgICAgICAgPyBbdGhpcy4jcmFuZG9tTnVtKDEwIC0gc2hpcCksIHRoaXMuI3JhbmRvbU51bSgxMCldXG4gICAgICAgIDogW3RoaXMuI3JhbmRvbU51bSgxMCksIHRoaXMuI3JhbmRvbU51bSgxMCAtIHNoaXApXTtcbiAgICBsZXQgY29vcmRpbmF0ZXMgPSB0aGlzLmFpLmJvYXJkLnBsYWNlU2hpcChzaGlwLCBjb29yZCwgb3JpZW50YXRpb24pO1xuICAgIHJldHVybiBjb29yZGluYXRlcztcbiAgfVxuXG4gICNhaUF0dGFjaygpIHtcbiAgICBpZiAodGhpcy5jdXJyZW50UGxheWVyID09PSB0aGlzLmFpICYmIHRoaXMucm91bmQpIHtcbiAgICAgIGxldCBjb29yZCA9IFt0aGlzLiNyYW5kb21OdW0oMTApLCB0aGlzLiNyYW5kb21OdW0oMTApXTtcbiAgICAgIGxldCBpdGVtID0gdGhpcy4jZmluZEdyaWRJdGVtKGNvb3JkLCAnaHVtYW4nKTtcbiAgICAgIGlmICh0aGlzLmh1bWFuLmJvYXJkLnJlY2VpdmVBdHRhY2soY29vcmQpKSB7XG4gICAgICAgIC8vIGlmIGEgc2hpcCBpcyBoaXQgdGhlbiAuLi5cbiAgICAgICAgdGhpcy5wYWdlLmhpdChpdGVtKTtcbiAgICAgICAgdGhpcy5yb3VuZCsrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaWYgYSBzaGlwIGlzIG5vdCBoaXQgdGhlbiAuLi5cbiAgICAgICAgdGhpcy5wYWdlLm1pc3MoaXRlbSk7XG4gICAgICAgIHRoaXMucm91bmQrKztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAjcmFuZG9tTnVtKG1heCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xuICB9XG5cbiAgI2ZpbmRHcmlkSXRlbShjb29yZCwgcGxheWVyKSB7XG4gICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLmdyaWQtaXRlbS4ke3BsYXllcn1gKTtcbiAgICBsZXQgZm91bmRJdGVtID0gZmFsc2U7XG4gICAgZ3JpZEl0ZW1zLmZvckVhY2goKGdyaWRJdGVtKSA9PiB7XG4gICAgICBpZiAoZ3JpZEl0ZW0uZGF0YXNldC5jb29yZGluYXRlcyA9PT0gY29vcmQudG9TdHJpbmcoKSkge1xuICAgICAgICBmb3VuZEl0ZW0gPSBncmlkSXRlbTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZm91bmRJdGVtO1xuICB9XG5cbiAgI2dhbWVPdmVyKCkge1xuICAgIGlmICh0aGlzLmh1bWFuLmJvYXJkLmdhbWVPdmVyKCkgfHwgdGhpcy5haS5ib2FyZC5nYW1lT3ZlcigpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IEdhbWVib2FyZCBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IoaHVtYW49dHJ1ZSkge1xuICAgIHRoaXMuYm9hcmQgPSBuZXcgR2FtZWJvYXJkO1xuICAgIHRoaXMuaXNIdW1hbiA9IGh1bWFuO1xuICAgIHRoaXMucHJldmlvdXNQbGF5cyA9IFtdO1xuICB9O1xuXG4gIGF0dGFjayhwbGF5ZXIsIGNvb3JkaW5hdGUpIHtcbiAgICBpZiAoIXRoaXMuaXNIdW1hbikge1xuICAgICAgY29vcmRpbmF0ZSA9IHRoaXMuI2FpQXR0YWNrKHBsYXllci5ib2FyZCk7XG4gICAgfVxuXG4gICAgdGhpcy5wcmV2aW91c1BsYXlzLnB1c2goY29vcmRpbmF0ZSk7XG4gICAgcGxheWVyLmJvYXJkLnJlY2VpdmVBdHRhY2soY29vcmRpbmF0ZSk7XG4gIH1cblxuICAjYWlBdHRhY2soYm9hcmQpIHtcbiAgICBsZXQgY29vcmRpbmF0ZSA9IHRoaXMuI3JhbmRvbUNvb3JkKCk7XG4gICAgaWYgKHRoaXMucHJldmlvdXNQbGF5cy5pbmNsdWRlcyhjb29yZGluYXRlKSkge1xuICAgICAgdGhpcy4jYWlBdHRhY2soYm9hcmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY29vcmRpbmF0ZTtcbiAgICB9XG4gIH1cblxuICAvLyBHZW5lcmF0ZSByYW5kb20gY29vcmRpbmF0ZXMgYmV0d2VlbiAwIC0gOS5cbiAgI3JhbmRvbUNvb3JkKCkge1xuICAgIHJldHVybiBbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApLCBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCldO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTaGlwIHtcbiAgY29uc3RydWN0b3Ioc2l6ZSkge1xuICAgIHRoaXMubGVuZ3RoID0gc2l6ZTtcbiAgICB0aGlzLmhpdHMgPSAwO1xuICAgIHRoaXMuc3VuayA9IGZhbHNlO1xuICB9XG5cbiAgaGl0KCkge1xuICAgIHRoaXMuaGl0cysrO1xuICAgIHRoaXMuaXNTdW5rKCk7XG4gIH1cblxuICBpc1N1bmsoKSB7XG4gICAgaWYgKHRoaXMuaGl0cyA9PT0gdGhpcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc3VuayA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN1bms7XG4gIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEdhbWVsb29wIGZyb20gXCIuL2dhbWVsb29wXCI7XG5cbmNvbnN0IGdhbWUgPSBuZXcgR2FtZWxvb3AoKTtcbmdhbWUuc3RhcnQoKTtcbiJdLCJuYW1lcyI6WyJET01idWlsZGVyIiwiY29uc3RydWN0b3IiLCJzaGlwcyIsInNoaXBOYW1lcyIsInNoaXBTaXplcyIsImdhbWVDb250YWluZXIiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwicGxheWVyQ29udGFpbmVyIiwiY3JlYXRlRWxlbWVudCIsImFpQ29udGFpbmVyIiwiY2xhc3NMaXN0IiwiYWRkIiwicGxheWVyVGl0bGUiLCJ0ZXh0Q29udGVudCIsImFpVGl0bGUiLCJwbGF5ZXJHcmlkIiwiZ3JpZFBvcHVsYXRlIiwiYWlHcmlkIiwicGxheWVyTXNnIiwiY3JlYXRlVGV4dE5vZGUiLCJ1cGRhdGVQbGF5ZXJNc2ciLCJpZCIsIm9yaWVudGF0aW9uQnRuIiwiYXBwZW5kIiwiaGl0IiwiZ3JpZEl0ZW0iLCJyZW1vdmUiLCJtaXNzIiwic2hpcCIsImhpZGVFbGVtZW50IiwiZWxlbWVudCIsInN0eWxlIiwiZGlzcGxheSIsImNvdW50ZXIiLCJtc2ciLCIjZ3JpZFBvcHVsYXRlIiwicGxheWVyIiwiZ3JpZCIsImkiLCJkYXRhc2V0IiwiY29vcmRpbmF0ZXMiLCJjb29yZHNQb3B1bGF0ZSIsImFwcGVuZENoaWxkIiwiI2Nvb3Jkc1BvcHVsYXRlIiwiZGlnaXRzIiwidG9TdHJpbmciLCJzcGxpdCIsIlNoaXAiLCJHYW1lYm9hcmQiLCJhbGxTaGlwcyIsIm1pc3NlZFNob3RzIiwicGxhY2VTaGlwIiwic2l6ZSIsImZpcnN0Q29vcmQiLCJvcmllbnRhdGlvbiIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsImJ1aWxkQ29vcmRpbmF0ZXMiLCJmb3JFYWNoIiwiY29vcmQiLCJmaW5kU2hpcCIsIm5ld1NoaXAiLCJzaGlwRW50cnkiLCJwdXNoIiwicmVjZWl2ZUF0dGFjayIsImNvb3JkaW5hdGUiLCJnYW1lT3ZlciIsImFsbFN1bmsiLCJpc1N1bmsiLCIjYnVpbGRDb29yZGluYXRlcyIsIiNmaW5kU2hpcCIsImZvdW5kU2hpcCIsInNvbWUiLCJ4IiwiUGxheWVyIiwiR2FtZWxvb3AiLCJodW1hbiIsImFpIiwicGxheWVycyIsImN1cnJlbnRQbGF5ZXIiLCJyb3VuZCIsInBhZ2UiLCJzdGFydCIsImFpU2hpcHMiLCJhaUdyaWRMaXN0ZW5lcnMiLCJodW1hbkdyaWRMaXN0ZW5lcnMiLCJjdXJyZW50Um91bmQiLCJwbGF5Um91bmQiLCJhaUF0dGFjayIsInNldFRpbWVvdXQiLCJvcmllbnRhdGlvbkJ0bkxpc3RlbmVyIiwiZ3JpZEl0ZW1zIiwicXVlcnlTZWxlY3RvckFsbCIsInBsYWNlbWVudENvdW50ZXIiLCJzaGlwU2l6ZSIsIml0ZW0iLCJhZGRFdmVudExpc3RlbmVyIiwiY29vcmRzIiwibWFwIiwicGFyc2VJbnQiLCJib2FyZCIsImZpbmRHcmlkSXRlbSIsIiNvcmllbnRhdGlvbkJ0bkxpc3RlbmVyIiwidGV4dCIsIiNhaVNoaXBzIiwiYWlTaGlwUGxhY2VtZW50IiwiI2FpU2hpcFBsYWNlbWVudCIsInJhbmRvbU51bSIsIiNhaUF0dGFjayIsIiNyYW5kb21OdW0iLCJtYXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCIjZmluZEdyaWRJdGVtIiwiZm91bmRJdGVtIiwiI2dhbWVPdmVyIiwiaXNIdW1hbiIsInByZXZpb3VzUGxheXMiLCJhdHRhY2siLCJyYW5kb21Db29yZCIsImluY2x1ZGVzIiwiI3JhbmRvbUNvb3JkIiwiaGl0cyIsInN1bmsiLCJnYW1lIl0sInNvdXJjZVJvb3QiOiIifQ==