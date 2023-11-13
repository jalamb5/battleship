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
    let msg = this.playerMsg;
    if (counter < 5) {
      msg.textContent = `Click grid to place ${this.shipNames[counter]} (size: ${this.shipSizes[counter]})`;
    } else {
      msg.textContent = '';
    }
  }
  displaySunkMessage(ship) {
    this.globalMsg.textContent = `${ship.shipType} has been sunk.`;
    setTimeout(() => {
      this.#clearGlobalMsg();
    }, 3000);
  }
  displayWinner(winner) {
    const winnerMsg = document.createElement('p');
    winnerMsg.textContent = `Winner: ${winner}!`;
    this.globalMsg.appendChild(winnerMsg);
  }
  #clearGlobalMsg() {
    this.globalMsg.textContent = '';
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
      if (attackedShip.isSunk()) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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R0FBRyxDQUFDO0lBQ2IsSUFBSSxDQUFDQyxJQUFJLEdBQUcsS0FBSztFQUNuQjtFQUVBdkgsR0FBR0EsQ0FBQSxFQUFHO0lBQ0osSUFBSSxDQUFDc0gsSUFBSSxFQUFFO0lBQ1gsSUFBSSxDQUFDaEUsTUFBTSxDQUFDLENBQUM7RUFDZjtFQUVBQSxNQUFNQSxDQUFBLEVBQUc7SUFDUCxJQUFJLElBQUksQ0FBQ2dFLElBQUksS0FBSyxJQUFJLENBQUM3RSxNQUFNLEVBQUU7TUFDN0IsSUFBSSxDQUFDOEUsSUFBSSxHQUFHLElBQUk7SUFDbEI7SUFDQSxPQUFPLElBQUksQ0FBQ0EsSUFBSTtFQUNsQjtBQUNGOzs7Ozs7VUNwQkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05rQztBQUVsQyxNQUFNQyxJQUFJLEdBQUcsSUFBSTNELGlEQUFRLENBQUMsQ0FBQztBQUMzQjJELElBQUksQ0FBQ3BELEtBQUssQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RvbUJ1aWxkZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lbG9vcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3BsYXllcnMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgRE9NYnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGNvbnN0IHNoaXBzID0geydDYXJyaWVyJzogNSwgJ0JhdHRsZXNoaXAnOiA0LCAnRGVzdHJveWVyJzogMywgJ1N1Ym1hcmluZSc6IDMsICdQYXRyb2wgQm9hdCc6IDJ9XG4gICAgdGhpcy5zaGlwTmFtZXMgPSBbJ0NhcnJpZXInLCAnQmF0dGxlc2hpcCcsICdEZXN0cm95ZXInLCAnU3VibWFyaW5lJywgJ1BhdHJvbCBCb2F0J107XG4gICAgdGhpcy5zaGlwU2l6ZXMgPSBbNSwgNCwgMywgMywgMl07XG5cbiAgICB0aGlzLmdhbWVDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZS1jb250YWluZXInKTtcbiAgICAvLyBjcmVhdGUgY29udGFpbmVycyBmb3IgZWxlbWVudHM6XG4gICAgICAvLyAyIHBsYXllciBjb250YWluZXJzXG4gICAgdGhpcy5wbGF5ZXJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmFpQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5nbG9iYWxNc2cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmdsb2JhbE1zZy5pZCA9ICdnbG9iYWwtbXNnJztcbiAgICB0aGlzLnBsYXllckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItY29udGFpbmVyJyk7XG4gICAgdGhpcy5haUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItY29udGFpbmVyJyk7XG4gICAgICAvLyBlYWNoIGNvbnRhaW5lciBjb250YWluczpcbiAgICAgICAgLy8gUGxheWVyIHRpdGxlXG4gICAgICAgIGNvbnN0IHBsYXllclRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKVxuICAgICAgICBwbGF5ZXJUaXRsZS50ZXh0Q29udGVudCA9ICdQbGF5ZXInO1xuXG4gICAgICAgIGNvbnN0IGFpVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICAgICAgICBhaVRpdGxlLnRleHRDb250ZW50ID0gJ0NvbXB1dGVyJztcblxuICAgICAgICAvLyBHYW1lIGJvYXJkIGdyaWQgKDEwIHggMTApXG4gICAgICAgIGNvbnN0IHBsYXllckdyaWQgPSB0aGlzLiNncmlkUG9wdWxhdGUoJ2h1bWFuJyk7XG4gICAgICAgIGNvbnN0IGFpR3JpZCA9IHRoaXMuI2dyaWRQb3B1bGF0ZSgnYWknKTtcblxuICAgICAgICB0aGlzLnBsYXllck1zZyA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICAgICAgdGhpcy51cGRhdGVQbGF5ZXJNc2coMCk7XG4gICAgICAgIHRoaXMucGxheWVyTXNnLmlkID0gJ3BsYXllck1zZyc7XG5cbiAgICAgICAgY29uc3Qgb3JpZW50YXRpb25CdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgb3JpZW50YXRpb25CdG4udGV4dENvbnRlbnQgPSAnaG9yaXpvbnRhbCc7XG4gICAgICAgIG9yaWVudGF0aW9uQnRuLmlkID0gJ29yaWVudGF0aW9uQnRuJztcblxuICAgICAgdGhpcy5wbGF5ZXJDb250YWluZXIuYXBwZW5kKHBsYXllclRpdGxlLCBwbGF5ZXJHcmlkLCB0aGlzLnBsYXllck1zZywgb3JpZW50YXRpb25CdG4pO1xuICAgICAgdGhpcy5haUNvbnRhaW5lci5hcHBlbmQoYWlUaXRsZSwgYWlHcmlkKTtcblxuICAgIHRoaXMuZ2FtZUNvbnRhaW5lci5hcHBlbmQodGhpcy5wbGF5ZXJDb250YWluZXIsIHRoaXMuYWlDb250YWluZXIsIHRoaXMuZ2xvYmFsTXNnKTtcbiAgfVxuXG4gIGhpdChncmlkSXRlbSkge1xuICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3NoaXAnKTtcbiAgICBncmlkSXRlbS5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgfTtcblxuICBtaXNzKGdyaWRJdGVtKSB7XG4gICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZCgnbWlzcycpO1xuICB9XG5cbiAgc2hpcChncmlkSXRlbSkge1xuICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5hZGQoJ3NoaXAnKTtcbiAgfTtcblxuICBoaWRlRWxlbWVudChlbGVtZW50KSB7XG4gICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICB9XG5cbiAgdXBkYXRlUGxheWVyTXNnKGNvdW50ZXIpIHtcbiAgICBsZXQgbXNnID0gdGhpcy5wbGF5ZXJNc2c7XG4gICAgaWYgKGNvdW50ZXIgPCA1KSB7XG4gICAgICBtc2cudGV4dENvbnRlbnQgPSBgQ2xpY2sgZ3JpZCB0byBwbGFjZSAke3RoaXMuc2hpcE5hbWVzW2NvdW50ZXJdfSAoc2l6ZTogJHt0aGlzLnNoaXBTaXplc1tjb3VudGVyXX0pYFxuICAgIH0gZWxzZSB7XG4gICAgICBtc2cudGV4dENvbnRlbnQgPSAnJztcbiAgICB9XG4gIH1cblxuICBkaXNwbGF5U3Vua01lc3NhZ2Uoc2hpcCkge1xuICAgIHRoaXMuZ2xvYmFsTXNnLnRleHRDb250ZW50ID0gYCR7c2hpcC5zaGlwVHlwZX0gaGFzIGJlZW4gc3Vuay5gXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLiNjbGVhckdsb2JhbE1zZygpO1xuICAgIH0sIDMwMDApO1xuICB9XG5cbiAgZGlzcGxheVdpbm5lcih3aW5uZXIpIHtcbiAgICBjb25zdCB3aW5uZXJNc2cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgd2lubmVyTXNnLnRleHRDb250ZW50ID0gYFdpbm5lcjogJHt3aW5uZXJ9IWBcbiAgICB0aGlzLmdsb2JhbE1zZy5hcHBlbmRDaGlsZCh3aW5uZXJNc2cpO1xuICB9XG5cbiAgI2NsZWFyR2xvYmFsTXNnKCkge1xuICAgIHRoaXMuZ2xvYmFsTXNnLnRleHRDb250ZW50ID0gJyc7XG4gIH1cblxuICAjZ3JpZFBvcHVsYXRlKHBsYXllcikge1xuICAgIGNvbnN0IGdyaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBncmlkLmNsYXNzTGlzdC5hZGQoJ2dyaWQnLCBwbGF5ZXIpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDA7IGkrKykge1xuICAgICAgY29uc3QgZ3JpZEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5hZGQoJ2dyaWQtaXRlbScsIHBsYXllcik7XG4gICAgICBncmlkSXRlbS5kYXRhc2V0LmNvb3JkaW5hdGVzID0gdGhpcy4jY29vcmRzUG9wdWxhdGUoaSk7XG4gICAgICBncmlkLmFwcGVuZENoaWxkKGdyaWRJdGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIGdyaWQ7XG4gIH1cblxuICAjY29vcmRzUG9wdWxhdGUoaSkge1xuICAgIGlmIChpIDwgMTApIHtcbiAgICAgIHJldHVybiBbaSwgMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBkaWdpdHMgPSBpLnRvU3RyaW5nKCkuc3BsaXQoJycpO1xuICAgICAgcmV0dXJuIFtkaWdpdHNbMV0sIGRpZ2l0c1swXV07XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgU2hpcCBmcm9tICcuL3NoaXBzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZWJvYXJkIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hbGxTaGlwcyA9IFtdO1xuICAgIHRoaXMubWlzc2VkU2hvdHMgPSBbXTtcbiAgICB0aGlzLmFsbFNob3RzID0gW107XG4gIH07XG5cbiAgcGxhY2VTaGlwKHNpemUsIGZpcnN0Q29vcmQsIG9yaWVudGF0aW9uPSdob3Jpem9udGFsJykge1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gdGhpcy4jYnVpbGRDb29yZGluYXRlcyhzaXplLCBmaXJzdENvb3JkLCBvcmllbnRhdGlvbik7XG4gICAgY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmQpID0+IHtcbiAgICAgIC8vIElmIGEgc2hpcCBhbHJlYWR5IGV4aXN0cyBhdCBsb2NhdGlvbiwgcmVqZWN0IGl0LlxuICAgICAgaWYgKHRoaXMuI2ZpbmRTaGlwKGNvb3JkKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSlcbiAgICBjb25zdCBuZXdTaGlwID0gbmV3IFNoaXAoc2l6ZSk7XG4gICAgY29uc3Qgc2hpcEVudHJ5ID0gW25ld1NoaXAsIGNvb3JkaW5hdGVzXTtcbiAgICB0aGlzLmFsbFNoaXBzLnB1c2goc2hpcEVudHJ5KTtcbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gIH1cblxuICAvLyByZWNlaXZlQXR0YWNrIGZ1bmN0aW9uIHRha2VzIGNvb3JkaW5hdGVzLCBkZXRlcm1pbmVzIHdoZXRoZXIgb3Igbm90IHRoZSBhdHRhY2sgaGl0IGEgc2hpcFxuICAvLyB0aGVuIHNlbmRzIHRoZSDigJhoaXTigJkgZnVuY3Rpb24gdG8gdGhlIGNvcnJlY3Qgc2hpcCwgb3IgcmVjb3JkcyB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIG1pc3NlZCBzaG90LlxuICByZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGUpIHtcbiAgICB0aGlzLmFsbFNob3RzLnB1c2goY29vcmRpbmF0ZSk7XG4gICAgY29uc3Qgc2hpcCA9IHRoaXMuI2ZpbmRTaGlwKGNvb3JkaW5hdGUpO1xuICAgIGlmIChzaGlwKSB7XG4gICAgICBzaGlwLmhpdCgpO1xuICAgICAgcmV0dXJuIHNoaXA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWlzc2VkU2hvdHMucHVzaChjb29yZGluYXRlKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBnYW1lT3ZlcigpIHtcbiAgICBsZXQgYWxsU3VuayA9IHRydWU7XG4gICAgLy8gSWYgc2hpcHMgaGF2ZW4ndCB5ZXQgYmVlbiBwbGFjZWQsIHJldHVybiBmYWxzZS5cbiAgICBpZiAodGhpcy5hbGxTaGlwcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5hbGxTaGlwcy5mb3JFYWNoKHNoaXAgPT4ge1xuICAgICAgaWYgKCFzaGlwWzBdLmlzU3VuaygpKSB7XG4gICAgICAgIGFsbFN1bmsgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBhbGxTdW5rO1xuICB9XG5cbiAgI2J1aWxkQ29vcmRpbmF0ZXMoc2l6ZSwgZmlyc3RDb29yZCwgb3JpZW50YXRpb24pIHtcbiAgICBsZXQgY29vcmRpbmF0ZXMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgaWYgKG9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgY29vcmRpbmF0ZXMucHVzaChbZmlyc3RDb29yZFswXSArIGksIGZpcnN0Q29vcmRbMV1dKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvb3JkaW5hdGVzLnB1c2goW2ZpcnN0Q29vcmRbMF0sIGZpcnN0Q29vcmRbMV0gKyBpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb29yZGluYXRlcztcbiAgfVxuXG4gICNmaW5kU2hpcChjb29yZGluYXRlKSB7XG4gICAgbGV0IGZvdW5kU2hpcCA9IGZhbHNlO1xuICAgIHRoaXMuYWxsU2hpcHMuZm9yRWFjaChzaGlwID0+IHtcbiAgICAgIGlmIChzaGlwWzFdLnNvbWUoKHgpID0+IHhbMF0gPT09IGNvb3JkaW5hdGVbMF0gJiYgeFsxXSA9PT0gY29vcmRpbmF0ZVsxXSkpIHtcbiAgICAgICAgZm91bmRTaGlwID0gc2hpcFswXTtcbiAgICB9fSlcbiAgICByZXR1cm4gZm91bmRTaGlwO1xuICB9XG59XG4iLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuL3BsYXllcnNcIjtcbmltcG9ydCBET01idWlsZGVyIGZyb20gXCIuL2RvbUJ1aWxkZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZWxvb3Age1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmh1bWFuID0gbmV3IFBsYXllcih0cnVlKTtcbiAgICB0aGlzLmFpID0gbmV3IFBsYXllcihmYWxzZSk7XG4gICAgdGhpcy5wbGF5ZXJzID0gW3RoaXMuaHVtYW4sIHRoaXMuYWldO1xuICAgIHRoaXMuY3VycmVudFBsYXllciA9IHRoaXMuYWk7XG4gICAgdGhpcy5yb3VuZCA9IG51bGw7XG4gICAgdGhpcy5wYWdlID0gbmV3IERPTWJ1aWxkZXIoKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuI2FpU2hpcHMoKTtcbiAgICB0aGlzLmFpR3JpZExpc3RlbmVycygpO1xuICAgIHRoaXMuaHVtYW5HcmlkTGlzdGVuZXJzKCk7XG5cbiAgICBsZXQgY3VycmVudFJvdW5kID0gdGhpcy5yb3VuZDtcblxuICAgIGNvbnN0IHBsYXlSb3VuZCA9ICgpID0+IHtcbiAgICAgIGlmICghdGhpcy4jZ2FtZU92ZXIoKSkge1xuICAgICAgICB0aGlzLiNhaUF0dGFjaygpO1xuICAgICAgICBpZiAoY3VycmVudFJvdW5kICE9PSB0aGlzLnJvdW5kKSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50UGxheWVyID0gdGhpcy5jdXJyZW50UGxheWVyID09PSB0aGlzLmh1bWFuID8gdGhpcy5haSA6IHRoaXMuaHVtYW47XG4gICAgICAgICAgY3VycmVudFJvdW5kID0gdGhpcy5yb3VuZDtcbiAgICAgICAgfVxuICAgICAgICBzZXRUaW1lb3V0KHBsYXlSb3VuZCwgMCk7IC8vIFNjaGVkdWxlIHRoZSBuZXh0IHJvdW5kIGFmdGVyIGEgdmVyeSBzaG9ydCBkZWxheVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4jZW5kR2FtZSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwbGF5Um91bmQoKTtcbiAgfVxuXG4gICNlbmRHYW1lKCkge1xuICAgIGNvbnN0IHdpbm5lciA9IHRoaXMuI2dhbWVPdmVyKCkgPT09IHRoaXMuaHVtYW4gPyAnWW91JyA6ICdDb21wdXRlcic7XG4gICAgY29uc3QgYWlHcmlkSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdyaWQtaXRlbS5haVwiKTtcbiAgICAvLyBkaXNwbGF5IHRoZSB3aW5uZXJcbiAgICB0aGlzLnBhZ2UuZGlzcGxheVdpbm5lcih3aW5uZXIpO1xuICAgIC8vIHJldmVhbCBhbGwgYm9hcmRzXG4gICAgYWlHcmlkSXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGxldCBjb29yZHMgPSBpdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXNcbiAgICAgIC5zcGxpdChcIixcIilcbiAgICAgIC5tYXAoKHgpID0+IHBhcnNlSW50KHgsIDEwKSk7XG4gICAgICB0aGlzLiNhaUJvYXJkQXR0YWNrKGNvb3JkcywgaXRlbSk7XG4gICAgfSlcbiAgfVxuXG4gIGh1bWFuR3JpZExpc3RlbmVycygpIHtcbiAgICB0aGlzLiNvcmllbnRhdGlvbkJ0bkxpc3RlbmVyKCk7XG4gICAgY29uc3Qgb3JpZW50YXRpb25CdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yaWVudGF0aW9uQnRuXCIpO1xuICAgIGNvbnN0IGdyaWRJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ3JpZC1pdGVtLmh1bWFuXCIpO1xuICAgIGxldCBwbGFjZW1lbnRDb3VudGVyID0gMDtcbiAgICBsZXQgc2hpcFNpemUgPSBbNSwgNCwgMywgMywgMl07XG5cbiAgICBncmlkSXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBpZiAocGxhY2VtZW50Q291bnRlciA+PSBzaGlwU2l6ZS5sZW5ndGggLSAxICYmICF0aGlzLnJvdW5kKSB7XG4gICAgICAgICAgdGhpcy5wYWdlLmhpZGVFbGVtZW50KG9yaWVudGF0aW9uQnRuKTtcbiAgICAgICAgICB0aGlzLnJvdW5kID0gMDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uQnRuLnRleHRDb250ZW50O1xuICAgICAgICBsZXQgY29vcmRzID0gaXRlbS5kYXRhc2V0LmNvb3JkaW5hdGVzXG4gICAgICAgICAgLnNwbGl0KFwiLFwiKVxuICAgICAgICAgIC5tYXAoKHgpID0+IHBhcnNlSW50KHgsIDEwKSk7XG4gICAgICAgIGxldCBjb29yZGluYXRlcyA9IHRoaXMuaHVtYW4uYm9hcmQucGxhY2VTaGlwKFxuICAgICAgICAgIHNoaXBTaXplW3BsYWNlbWVudENvdW50ZXJdLFxuICAgICAgICAgIGNvb3JkcyxcbiAgICAgICAgICBvcmllbnRhdGlvblxuICAgICAgICApO1xuICAgICAgICAvLyBTaG93IHNoaXAgb24gc2NyZWVuLlxuICAgICAgICBjb29yZGluYXRlcy5mb3JFYWNoKChjb29yZCkgPT4ge1xuICAgICAgICAgIHRoaXMucGFnZS5zaGlwKHRoaXMuI2ZpbmRHcmlkSXRlbShjb29yZCwgXCJodW1hblwiKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBwbGFjZW1lbnRDb3VudGVyKys7XG4gICAgICAgIHRoaXMucGFnZS51cGRhdGVQbGF5ZXJNc2cocGxhY2VtZW50Q291bnRlcik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gICNvcmllbnRhdGlvbkJ0bkxpc3RlbmVyKCkge1xuICAgIGNvbnN0IG9yaWVudGF0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmllbnRhdGlvbkJ0blwiKTtcbiAgICBvcmllbnRhdGlvbi5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXG4gICAgb3JpZW50YXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGxldCB0ZXh0ID0gb3JpZW50YXRpb24udGV4dENvbnRlbnQ7XG4gICAgICBvcmllbnRhdGlvbi50ZXh0Q29udGVudCA9XG4gICAgICAgIHRleHQgPT09IFwiaG9yaXpvbnRhbFwiID8gXCJ2ZXJ0aWNhbFwiIDogXCJob3Jpem9udGFsXCI7XG4gICAgfSk7XG4gIH1cblxuICBhaUdyaWRMaXN0ZW5lcnMoKSB7XG4gICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ncmlkLWl0ZW0uYWlcIik7XG4gICAgZ3JpZEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBsYXllciA9PT0gdGhpcy5odW1hbikge1xuICAgICAgICAgIGxldCBjb29yZHMgPSBpdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXNcbiAgICAgICAgICAgIC5zcGxpdChcIixcIilcbiAgICAgICAgICAgIC5tYXAoKHgpID0+IHBhcnNlSW50KHgsIDEwKSk7XG4gICAgICAgICAgdGhpcy4jYWlCb2FyZEF0dGFjayhjb29yZHMsIGl0ZW0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gICNhaUJvYXJkQXR0YWNrKGNvb3JkcywgZ3JpZEl0ZW0pIHtcbiAgICBsZXQgYXR0YWNrZWRTaGlwID0gdGhpcy5haS5ib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkcylcbiAgICBpZiAoYXR0YWNrZWRTaGlwKSB7XG4gICAgICAvLyBpZiBhIHNoaXAgaXMgaGl0LCBtYXJrIHNxdWFyZSBhcyByZWQuXG4gICAgICB0aGlzLnBhZ2UuaGl0KGdyaWRJdGVtKTtcbiAgICAgIHRoaXMucm91bmQrKztcbiAgICAgIC8vIGlmIHNoaXAgaXMgc3VuaywgZGlzcGxheSBnbG9iYWwgbWVzc2FnZS5cbiAgICAgIGlmIChhdHRhY2tlZFNoaXAuaXNTdW5rKCkpIHtcbiAgICAgICAgdGhpcy5wYWdlLmRpc3BsYXlTdW5rTWVzc2FnZShhdHRhY2tlZFNoaXApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBpZiBhIHNoaXAgaXMgbm90IGhpdCwgbWFyayBzcXVhcmUgYXMgYmx1ZS5cbiAgICAgIHRoaXMucGFnZS5taXNzKGdyaWRJdGVtKTtcbiAgICAgIHRoaXMucm91bmQrKztcbiAgICB9XG4gIH1cblxuICAjYWlTaGlwcygpIHtcbiAgICBjb25zdCBzaGlwU2l6ZXMgPSBbNSwgNCwgMywgMywgMl07XG4gICAgc2hpcFNpemVzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIGxldCBjb29yZGluYXRlcyA9IHRoaXMuI2FpU2hpcFBsYWNlbWVudChzaGlwKTtcblxuICAgICAgd2hpbGUgKCFjb29yZGluYXRlcykge1xuICAgICAgICBjb29yZGluYXRlcyA9IHRoaXMuI2FpU2hpcFBsYWNlbWVudChzaGlwKTtcbiAgICAgIH1cblxuICAgICAgLy8gc2hvdyBhaSBzaGlwcyB3aGlsZSB0ZXN0aW5nLlxuICAgICAgY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmQpID0+IHtcbiAgICAgICAgdGhpcy5wYWdlLnNoaXAodGhpcy4jZmluZEdyaWRJdGVtKGNvb3JkLCBcImFpXCIpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgI2FpU2hpcFBsYWNlbWVudChzaGlwKSB7XG4gICAgbGV0IG9yaWVudGF0aW9uID0gdGhpcy4jcmFuZG9tTnVtKDIpID09PSAwID8gXCJob3Jpem9udGFsXCIgOiBcInZlcnRpY2FsXCI7XG4gICAgbGV0IGNvb3JkID1cbiAgICAgIG9yaWVudGF0aW9uID09PSBcImhvcml6b250YWxcIlxuICAgICAgICA/IFt0aGlzLiNyYW5kb21OdW0oMTAgLSBzaGlwKSwgdGhpcy4jcmFuZG9tTnVtKDEwKV1cbiAgICAgICAgOiBbdGhpcy4jcmFuZG9tTnVtKDEwKSwgdGhpcy4jcmFuZG9tTnVtKDEwIC0gc2hpcCldO1xuICAgIGxldCBjb29yZGluYXRlcyA9IHRoaXMuYWkuYm9hcmQucGxhY2VTaGlwKHNoaXAsIGNvb3JkLCBvcmllbnRhdGlvbik7XG4gICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xuICB9XG5cbiAgI2FpQXR0YWNrKCkge1xuICAgIGlmICh0aGlzLmN1cnJlbnRQbGF5ZXIgPT09IHRoaXMuYWkgJiYgdGhpcy5yb3VuZCkge1xuICAgICAgbGV0IGNvb3JkID0gdGhpcy4jYWlDb29yZFNlbGVjdG9yKCk7XG4gICAgICBsZXQgZ3JpZEl0ZW0gPSB0aGlzLiNmaW5kR3JpZEl0ZW0oY29vcmQsICdodW1hbicpO1xuICAgICAgbGV0IGF0dGFja2VkU2hpcCA9IHRoaXMuaHVtYW4uYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZClcbiAgICAgIGlmIChhdHRhY2tlZFNoaXApIHtcbiAgICAgICAgLy8gaWYgYSBzaGlwIGlzIGhpdCwgbWFyayBzcXVhcmUgYXMgcmVkLlxuICAgICAgICB0aGlzLnBhZ2UuaGl0KGdyaWRJdGVtKTtcbiAgICAgICAgdGhpcy5yb3VuZCsrO1xuICAgICAgICAvLyBpZiBzaGlwIGlzIHN1bmssIGRpc3BsYXkgZ2xvYmFsIG1lc3NhZ2UuXG4gICAgICAgIGlmIChhdHRhY2tlZFNoaXAuaXNTdW5rKCkpIHtcbiAgICAgICAgICB0aGlzLnBhZ2UuZGlzcGxheVN1bmtNZXNzYWdlKGF0dGFja2VkU2hpcCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGlmIGEgc2hpcCBpcyBub3QgaGl0LCBtYXJrIHNxdWFyZSBhcyBibHVlLlxuICAgICAgICB0aGlzLnBhZ2UubWlzcyhncmlkSXRlbSk7XG4gICAgICAgIHRoaXMucm91bmQrKztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAjYWlDb29yZFNlbGVjdG9yKCkge1xuICAgIGxldCBjb29yZCA9IFt0aGlzLiNyYW5kb21OdW0oMTApLCB0aGlzLiNyYW5kb21OdW0oMTApXTtcbiAgICAvLyBDaGVjayBpZiBjb29yZCBoYXMgYWxyZWFkeSBiZWVuIHVzZWQsIGlmIHNvIHJlcnVuIGZ1bmN0aW9uLlxuICAgIHRoaXMuaHVtYW4uYm9hcmQuYWxsU2hvdHMuZm9yRWFjaChzaG90ID0+IHtcbiAgICAgIGlmIChzaG90WzBdID09PSBjb29yZFswXSAmJiBzaG90WzFdID09PSBjb29yZFsxXSkge1xuICAgICAgICByZXR1cm4gdGhpcy4jYWlDb29yZFNlbGVjdG9yKCk7XG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gY29vcmQ7XG4gIH1cblxuICAjcmFuZG9tTnVtKG1heCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xuICB9XG5cbiAgI2ZpbmRHcmlkSXRlbShjb29yZCwgcGxheWVyKSB7XG4gICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLmdyaWQtaXRlbS4ke3BsYXllcn1gKTtcbiAgICBsZXQgZm91bmRJdGVtID0gZmFsc2U7XG4gICAgZ3JpZEl0ZW1zLmZvckVhY2goKGdyaWRJdGVtKSA9PiB7XG4gICAgICBpZiAoZ3JpZEl0ZW0uZGF0YXNldC5jb29yZGluYXRlcyA9PT0gY29vcmQudG9TdHJpbmcoKSkge1xuICAgICAgICBmb3VuZEl0ZW0gPSBncmlkSXRlbTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZm91bmRJdGVtO1xuICB9XG5cbiAgI2dhbWVPdmVyKCkge1xuICAgIC8vIEFJIHdpbnMgaWYgaHVtYW4gYm9hcmQgaXMgZ2FtZSBvdmVyLlxuICAgIGlmICh0aGlzLmh1bWFuLmJvYXJkLmdhbWVPdmVyKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmFpO1xuICAgIC8vIEh1bWFuIHdpbnMgaWYgYWkgYm9hcmQgaXMgZ2FtZSBvdmVyLlxuICAgIH0gZWxzZSBpZiAodGhpcy5haS5ib2FyZC5nYW1lT3ZlcigpKSB7XG4gICAgICByZXR1cm4gdGhpcy5odW1hbjtcbiAgICAvLyBFbHNlIGdhbWUgY29udGludWVzLlxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgR2FtZWJvYXJkIGZyb20gXCIuL2dhbWVib2FyZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihodW1hbj10cnVlKSB7XG4gICAgdGhpcy5ib2FyZCA9IG5ldyBHYW1lYm9hcmQ7XG4gICAgdGhpcy5pc0h1bWFuID0gaHVtYW47XG4gICAgdGhpcy5wcmV2aW91c1BsYXlzID0gW107XG4gIH07XG5cbiAgYXR0YWNrKHBsYXllciwgY29vcmRpbmF0ZSkge1xuICAgIGlmICghdGhpcy5pc0h1bWFuKSB7XG4gICAgICBjb29yZGluYXRlID0gdGhpcy4jYWlBdHRhY2socGxheWVyLmJvYXJkKTtcbiAgICB9XG5cbiAgICB0aGlzLnByZXZpb3VzUGxheXMucHVzaChjb29yZGluYXRlKTtcbiAgICBwbGF5ZXIuYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZGluYXRlKTtcbiAgfVxuXG4gICNhaUF0dGFjayhib2FyZCkge1xuICAgIGxldCBjb29yZGluYXRlID0gdGhpcy4jcmFuZG9tQ29vcmQoKTtcbiAgICBpZiAodGhpcy5wcmV2aW91c1BsYXlzLmluY2x1ZGVzKGNvb3JkaW5hdGUpKSB7XG4gICAgICB0aGlzLiNhaUF0dGFjayhib2FyZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjb29yZGluYXRlO1xuICAgIH1cbiAgfVxuXG4gIC8vIEdlbmVyYXRlIHJhbmRvbSBjb29yZGluYXRlcyBiZXR3ZWVuIDAgLSA5LlxuICAjcmFuZG9tQ29vcmQoKSB7XG4gICAgcmV0dXJuIFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCksIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKV07XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoaXAge1xuICBjb25zdHJ1Y3RvcihzaXplKSB7XG4gICAgY29uc3Qgc2hpcFR5cGVzID0gezUgOiAnQ2FycmllcicsIDQgOiAnQmF0dGxlc2hpcCcsIDMgOiAnRGVzdHJveWVyJywgMyA6ICdTdWJtYXJpbmUnLCAyIDogJ1BhdHJvbCBCb2F0J31cbiAgICB0aGlzLmxlbmd0aCA9IHNpemU7XG4gICAgdGhpcy5zaGlwVHlwZSA9IHNoaXBUeXBlc1tzaXplXTtcbiAgICB0aGlzLmhpdHMgPSAwO1xuICAgIHRoaXMuc3VuayA9IGZhbHNlO1xuICB9XG5cbiAgaGl0KCkge1xuICAgIHRoaXMuaGl0cysrO1xuICAgIHRoaXMuaXNTdW5rKCk7XG4gIH1cblxuICBpc1N1bmsoKSB7XG4gICAgaWYgKHRoaXMuaGl0cyA9PT0gdGhpcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc3VuayA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN1bms7XG4gIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEdhbWVsb29wIGZyb20gXCIuL2dhbWVsb29wXCI7XG5cbmNvbnN0IGdhbWUgPSBuZXcgR2FtZWxvb3AoKTtcbmdhbWUuc3RhcnQoKTtcbiJdLCJuYW1lcyI6WyJET01idWlsZGVyIiwiY29uc3RydWN0b3IiLCJzaGlwcyIsInNoaXBOYW1lcyIsInNoaXBTaXplcyIsImdhbWVDb250YWluZXIiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwicGxheWVyQ29udGFpbmVyIiwiY3JlYXRlRWxlbWVudCIsImFpQ29udGFpbmVyIiwiZ2xvYmFsTXNnIiwiaWQiLCJjbGFzc0xpc3QiLCJhZGQiLCJwbGF5ZXJUaXRsZSIsInRleHRDb250ZW50IiwiYWlUaXRsZSIsInBsYXllckdyaWQiLCJncmlkUG9wdWxhdGUiLCJhaUdyaWQiLCJwbGF5ZXJNc2ciLCJjcmVhdGVUZXh0Tm9kZSIsInVwZGF0ZVBsYXllck1zZyIsIm9yaWVudGF0aW9uQnRuIiwiYXBwZW5kIiwiaGl0IiwiZ3JpZEl0ZW0iLCJyZW1vdmUiLCJtaXNzIiwic2hpcCIsImhpZGVFbGVtZW50IiwiZWxlbWVudCIsInN0eWxlIiwiZGlzcGxheSIsImNvdW50ZXIiLCJtc2ciLCJkaXNwbGF5U3Vua01lc3NhZ2UiLCJzaGlwVHlwZSIsInNldFRpbWVvdXQiLCJjbGVhckdsb2JhbE1zZyIsImRpc3BsYXlXaW5uZXIiLCJ3aW5uZXIiLCJ3aW5uZXJNc2ciLCJhcHBlbmRDaGlsZCIsIiNjbGVhckdsb2JhbE1zZyIsIiNncmlkUG9wdWxhdGUiLCJwbGF5ZXIiLCJncmlkIiwiaSIsImRhdGFzZXQiLCJjb29yZGluYXRlcyIsImNvb3Jkc1BvcHVsYXRlIiwiI2Nvb3Jkc1BvcHVsYXRlIiwiZGlnaXRzIiwidG9TdHJpbmciLCJzcGxpdCIsIlNoaXAiLCJHYW1lYm9hcmQiLCJhbGxTaGlwcyIsIm1pc3NlZFNob3RzIiwiYWxsU2hvdHMiLCJwbGFjZVNoaXAiLCJzaXplIiwiZmlyc3RDb29yZCIsIm9yaWVudGF0aW9uIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwiYnVpbGRDb29yZGluYXRlcyIsImZvckVhY2giLCJjb29yZCIsImZpbmRTaGlwIiwibmV3U2hpcCIsInNoaXBFbnRyeSIsInB1c2giLCJyZWNlaXZlQXR0YWNrIiwiY29vcmRpbmF0ZSIsImdhbWVPdmVyIiwiYWxsU3VuayIsImlzU3VuayIsIiNidWlsZENvb3JkaW5hdGVzIiwiI2ZpbmRTaGlwIiwiZm91bmRTaGlwIiwic29tZSIsIngiLCJQbGF5ZXIiLCJHYW1lbG9vcCIsImh1bWFuIiwiYWkiLCJwbGF5ZXJzIiwiY3VycmVudFBsYXllciIsInJvdW5kIiwicGFnZSIsInN0YXJ0IiwiYWlTaGlwcyIsImFpR3JpZExpc3RlbmVycyIsImh1bWFuR3JpZExpc3RlbmVycyIsImN1cnJlbnRSb3VuZCIsInBsYXlSb3VuZCIsImFpQXR0YWNrIiwiZW5kR2FtZSIsIiNlbmRHYW1lIiwiYWlHcmlkSXRlbXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaXRlbSIsImNvb3JkcyIsIm1hcCIsInBhcnNlSW50IiwiYWlCb2FyZEF0dGFjayIsIm9yaWVudGF0aW9uQnRuTGlzdGVuZXIiLCJncmlkSXRlbXMiLCJwbGFjZW1lbnRDb3VudGVyIiwic2hpcFNpemUiLCJhZGRFdmVudExpc3RlbmVyIiwiYm9hcmQiLCJmaW5kR3JpZEl0ZW0iLCIjb3JpZW50YXRpb25CdG5MaXN0ZW5lciIsInRleHQiLCIjYWlCb2FyZEF0dGFjayIsImF0dGFja2VkU2hpcCIsIiNhaVNoaXBzIiwiYWlTaGlwUGxhY2VtZW50IiwiI2FpU2hpcFBsYWNlbWVudCIsInJhbmRvbU51bSIsIiNhaUF0dGFjayIsImFpQ29vcmRTZWxlY3RvciIsIiNhaUNvb3JkU2VsZWN0b3IiLCJzaG90IiwiI3JhbmRvbU51bSIsIm1heCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIiNmaW5kR3JpZEl0ZW0iLCJmb3VuZEl0ZW0iLCIjZ2FtZU92ZXIiLCJpc0h1bWFuIiwicHJldmlvdXNQbGF5cyIsImF0dGFjayIsInJhbmRvbUNvb3JkIiwiaW5jbHVkZXMiLCIjcmFuZG9tQ29vcmQiLCJzaGlwVHlwZXMiLCJoaXRzIiwic3VuayIsImdhbWUiXSwic291cmNlUm9vdCI6IiJ9