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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFJO0lBQ2xCLElBQUksQ0FBQ3pCLFFBQVEsR0FBR3lHLFNBQVMsQ0FBQ2hGLElBQUksQ0FBQztJQUMvQixJQUFJLENBQUNpRixJQUFJLEdBQUcsQ0FBQztJQUNiLElBQUksQ0FBQ0MsSUFBSSxHQUFHLEtBQUs7RUFDbkI7RUFFQXpILEdBQUdBLENBQUEsRUFBRztJQUNKLElBQUksQ0FBQ3dILElBQUksRUFBRTtJQUNYLElBQUksQ0FBQ2hFLE1BQU0sQ0FBQyxDQUFDO0VBQ2Y7RUFFQUEsTUFBTUEsQ0FBQSxFQUFHO0lBQ1AsSUFBSSxJQUFJLENBQUNnRSxJQUFJLEtBQUssSUFBSSxDQUFDN0UsTUFBTSxFQUFFO01BQzdCLElBQUksQ0FBQzhFLElBQUksR0FBRyxJQUFJO0lBQ2xCO0lBQ0EsT0FBTyxJQUFJLENBQUNBLElBQUk7RUFDbEI7QUFDRjs7Ozs7O1VDcEJBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOa0M7QUFFbEMsTUFBTUMsSUFBSSxHQUFHLElBQUkzRCxpREFBUSxDQUFDLENBQUM7QUFDM0IyRCxJQUFJLENBQUNwRCxLQUFLLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9kb21CdWlsZGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWxvb3AuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXJzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2NyaXB0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIERPTWJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBjb25zdCBzaGlwcyA9IHsnQ2Fycmllcic6IDUsICdCYXR0bGVzaGlwJzogNCwgJ0Rlc3Ryb3llcic6IDMsICdTdWJtYXJpbmUnOiAzLCAnUGF0cm9sIEJvYXQnOiAyfVxuICAgIHRoaXMuc2hpcE5hbWVzID0gWydDYXJyaWVyJywgJ0JhdHRsZXNoaXAnLCAnRGVzdHJveWVyJywgJ1N1Ym1hcmluZScsICdQYXRyb2wgQm9hdCddO1xuICAgIHRoaXMuc2hpcFNpemVzID0gWzUsIDQsIDMsIDMsIDJdO1xuXG4gICAgdGhpcy5nYW1lQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtY29udGFpbmVyJyk7XG4gICAgLy8gY3JlYXRlIGNvbnRhaW5lcnMgZm9yIGVsZW1lbnRzOlxuICAgICAgLy8gMiBwbGF5ZXIgY29udGFpbmVyc1xuICAgIHRoaXMucGxheWVyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5haUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuZ2xvYmFsTXNnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5nbG9iYWxNc2cuaWQgPSAnZ2xvYmFsLW1zZyc7XG4gICAgdGhpcy5wbGF5ZXJDb250YWluZXIuY2xhc3NMaXN0LmFkZCgncGxheWVyLWNvbnRhaW5lcicpO1xuICAgIHRoaXMuYWlDb250YWluZXIuY2xhc3NMaXN0LmFkZCgncGxheWVyLWNvbnRhaW5lcicpO1xuICAgICAgLy8gZWFjaCBjb250YWluZXIgY29udGFpbnM6XG4gICAgICAgIC8vIFBsYXllciB0aXRsZVxuICAgICAgICBjb25zdCBwbGF5ZXJUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJylcbiAgICAgICAgcGxheWVyVGl0bGUudGV4dENvbnRlbnQgPSAnUGxheWVyJztcblxuICAgICAgICBjb25zdCBhaVRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbiAgICAgICAgYWlUaXRsZS50ZXh0Q29udGVudCA9ICdDb21wdXRlcic7XG5cbiAgICAgICAgLy8gR2FtZSBib2FyZCBncmlkICgxMCB4IDEwKVxuICAgICAgICBjb25zdCBwbGF5ZXJHcmlkID0gdGhpcy4jZ3JpZFBvcHVsYXRlKCdodW1hbicpO1xuICAgICAgICBjb25zdCBhaUdyaWQgPSB0aGlzLiNncmlkUG9wdWxhdGUoJ2FpJyk7XG5cbiAgICAgICAgdGhpcy5wbGF5ZXJNc2cgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgICAgIHRoaXMudXBkYXRlUGxheWVyTXNnKDApO1xuICAgICAgICB0aGlzLnBsYXllck1zZy5pZCA9ICdwbGF5ZXJNc2cnO1xuXG4gICAgICAgIGNvbnN0IG9yaWVudGF0aW9uQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgIG9yaWVudGF0aW9uQnRuLnRleHRDb250ZW50ID0gJ2hvcml6b250YWwnO1xuICAgICAgICBvcmllbnRhdGlvbkJ0bi5pZCA9ICdvcmllbnRhdGlvbkJ0bic7XG5cbiAgICAgIHRoaXMucGxheWVyQ29udGFpbmVyLmFwcGVuZChwbGF5ZXJUaXRsZSwgcGxheWVyR3JpZCwgdGhpcy5wbGF5ZXJNc2csIG9yaWVudGF0aW9uQnRuKTtcbiAgICAgIHRoaXMuYWlDb250YWluZXIuYXBwZW5kKGFpVGl0bGUsIGFpR3JpZCk7XG5cbiAgICB0aGlzLmdhbWVDb250YWluZXIuYXBwZW5kKHRoaXMucGxheWVyQ29udGFpbmVyLCB0aGlzLmFpQ29udGFpbmVyLCB0aGlzLmdsb2JhbE1zZyk7XG4gIH1cblxuICBoaXQoZ3JpZEl0ZW0pIHtcbiAgICBncmlkSXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdzaGlwJyk7XG4gICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZCgnaGl0Jyk7XG4gIH07XG5cbiAgbWlzcyhncmlkSXRlbSkge1xuICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5hZGQoJ21pc3MnKTtcbiAgfVxuXG4gIHNoaXAoZ3JpZEl0ZW0pIHtcbiAgICBncmlkSXRlbS5jbGFzc0xpc3QuYWRkKCdzaGlwJyk7XG4gIH07XG5cbiAgaGlkZUVsZW1lbnQoZWxlbWVudCkge1xuICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfVxuXG4gIHVwZGF0ZVBsYXllck1zZyhjb3VudGVyKSB7XG4gICAgbGV0IG1zZyA9IHRoaXMucGxheWVyTXNnO1xuICAgIGlmIChjb3VudGVyIDwgNSkge1xuICAgICAgbXNnLnRleHRDb250ZW50ID0gYENsaWNrIGdyaWQgdG8gcGxhY2UgJHt0aGlzLnNoaXBOYW1lc1tjb3VudGVyXX0gKHNpemU6ICR7dGhpcy5zaGlwU2l6ZXNbY291bnRlcl19KWBcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4jY2xlYXJNc2cobXNnKTtcbiAgICB9XG4gIH1cblxuICBkaXNwbGF5U3Vua01lc3NhZ2Uoc2hpcCkge1xuICAgIGNvbnN0IHN1bmtNc2cgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShgJHtzaGlwLnNoaXBUeXBlfSBoYXMgYmVlbiBzdW5rLmApXG4gICAgdGhpcy5nbG9iYWxNc2cuYXBwZW5kQ2hpbGQoc3Vua01zZyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLiNjbGVhck1zZyhzdW5rTXNnKTtcbiAgICB9LCAzMDAwKTtcbiAgfVxuXG4gIGRpc3BsYXlXaW5uZXIod2lubmVyKSB7XG4gICAgY29uc3Qgd2lubmVyTXNnID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYFdpbm5lcjogJHt3aW5uZXJ9IWApO1xuICAgIHRoaXMuZ2xvYmFsTXNnLmFwcGVuZENoaWxkKHdpbm5lck1zZyk7XG4gIH1cblxuICAjY2xlYXJNc2cobXNnRWxlbWVudCkge1xuICAgIG1zZ0VsZW1lbnQucmVtb3ZlKCk7XG4gIH1cblxuICAjZ3JpZFBvcHVsYXRlKHBsYXllcikge1xuICAgIGNvbnN0IGdyaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBncmlkLmNsYXNzTGlzdC5hZGQoJ2dyaWQnLCBwbGF5ZXIpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDA7IGkrKykge1xuICAgICAgY29uc3QgZ3JpZEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5hZGQoJ2dyaWQtaXRlbScsIHBsYXllcik7XG4gICAgICBncmlkSXRlbS5kYXRhc2V0LmNvb3JkaW5hdGVzID0gdGhpcy4jY29vcmRzUG9wdWxhdGUoaSk7XG4gICAgICBncmlkLmFwcGVuZENoaWxkKGdyaWRJdGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIGdyaWQ7XG4gIH1cblxuICAjY29vcmRzUG9wdWxhdGUoaSkge1xuICAgIGlmIChpIDwgMTApIHtcbiAgICAgIHJldHVybiBbaSwgMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBkaWdpdHMgPSBpLnRvU3RyaW5nKCkuc3BsaXQoJycpO1xuICAgICAgcmV0dXJuIFtkaWdpdHNbMV0sIGRpZ2l0c1swXV07XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgU2hpcCBmcm9tICcuL3NoaXBzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZWJvYXJkIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hbGxTaGlwcyA9IFtdO1xuICAgIHRoaXMubWlzc2VkU2hvdHMgPSBbXTtcbiAgICB0aGlzLmFsbFNob3RzID0gW107XG4gIH07XG5cbiAgcGxhY2VTaGlwKHNpemUsIGZpcnN0Q29vcmQsIG9yaWVudGF0aW9uPSdob3Jpem9udGFsJykge1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gdGhpcy4jYnVpbGRDb29yZGluYXRlcyhzaXplLCBmaXJzdENvb3JkLCBvcmllbnRhdGlvbik7XG4gICAgY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmQpID0+IHtcbiAgICAgIC8vIElmIGEgc2hpcCBhbHJlYWR5IGV4aXN0cyBhdCBsb2NhdGlvbiwgcmVqZWN0IGl0LlxuICAgICAgaWYgKHRoaXMuI2ZpbmRTaGlwKGNvb3JkKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSlcbiAgICBjb25zdCBuZXdTaGlwID0gbmV3IFNoaXAoc2l6ZSk7XG4gICAgY29uc3Qgc2hpcEVudHJ5ID0gW25ld1NoaXAsIGNvb3JkaW5hdGVzXTtcbiAgICB0aGlzLmFsbFNoaXBzLnB1c2goc2hpcEVudHJ5KTtcbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gIH1cblxuICAvLyByZWNlaXZlQXR0YWNrIGZ1bmN0aW9uIHRha2VzIGNvb3JkaW5hdGVzLCBkZXRlcm1pbmVzIHdoZXRoZXIgb3Igbm90IHRoZSBhdHRhY2sgaGl0IGEgc2hpcFxuICAvLyB0aGVuIHNlbmRzIHRoZSDigJhoaXTigJkgZnVuY3Rpb24gdG8gdGhlIGNvcnJlY3Qgc2hpcCwgb3IgcmVjb3JkcyB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIG1pc3NlZCBzaG90LlxuICByZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGUpIHtcbiAgICB0aGlzLmFsbFNob3RzLnB1c2goY29vcmRpbmF0ZSk7XG4gICAgY29uc3Qgc2hpcCA9IHRoaXMuI2ZpbmRTaGlwKGNvb3JkaW5hdGUpO1xuICAgIGlmIChzaGlwKSB7XG4gICAgICBzaGlwLmhpdCgpO1xuICAgICAgcmV0dXJuIHNoaXA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWlzc2VkU2hvdHMucHVzaChjb29yZGluYXRlKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBnYW1lT3ZlcigpIHtcbiAgICBsZXQgYWxsU3VuayA9IHRydWU7XG4gICAgLy8gSWYgc2hpcHMgaGF2ZW4ndCB5ZXQgYmVlbiBwbGFjZWQsIHJldHVybiBmYWxzZS5cbiAgICBpZiAodGhpcy5hbGxTaGlwcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5hbGxTaGlwcy5mb3JFYWNoKHNoaXAgPT4ge1xuICAgICAgaWYgKCFzaGlwWzBdLmlzU3VuaygpKSB7XG4gICAgICAgIGFsbFN1bmsgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBhbGxTdW5rO1xuICB9XG5cbiAgI2J1aWxkQ29vcmRpbmF0ZXMoc2l6ZSwgZmlyc3RDb29yZCwgb3JpZW50YXRpb24pIHtcbiAgICBsZXQgY29vcmRpbmF0ZXMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgaWYgKG9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgY29vcmRpbmF0ZXMucHVzaChbZmlyc3RDb29yZFswXSArIGksIGZpcnN0Q29vcmRbMV1dKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvb3JkaW5hdGVzLnB1c2goW2ZpcnN0Q29vcmRbMF0sIGZpcnN0Q29vcmRbMV0gKyBpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb29yZGluYXRlcztcbiAgfVxuXG4gICNmaW5kU2hpcChjb29yZGluYXRlKSB7XG4gICAgbGV0IGZvdW5kU2hpcCA9IGZhbHNlO1xuICAgIHRoaXMuYWxsU2hpcHMuZm9yRWFjaChzaGlwID0+IHtcbiAgICAgIGlmIChzaGlwWzFdLnNvbWUoKHgpID0+IHhbMF0gPT09IGNvb3JkaW5hdGVbMF0gJiYgeFsxXSA9PT0gY29vcmRpbmF0ZVsxXSkpIHtcbiAgICAgICAgZm91bmRTaGlwID0gc2hpcFswXTtcbiAgICB9fSlcbiAgICByZXR1cm4gZm91bmRTaGlwO1xuICB9XG59XG4iLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuL3BsYXllcnNcIjtcbmltcG9ydCBET01idWlsZGVyIGZyb20gXCIuL2RvbUJ1aWxkZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZWxvb3Age1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmh1bWFuID0gbmV3IFBsYXllcih0cnVlKTtcbiAgICB0aGlzLmFpID0gbmV3IFBsYXllcihmYWxzZSk7XG4gICAgdGhpcy5wbGF5ZXJzID0gW3RoaXMuaHVtYW4sIHRoaXMuYWldO1xuICAgIHRoaXMuY3VycmVudFBsYXllciA9IHRoaXMuYWk7XG4gICAgdGhpcy5yb3VuZCA9IG51bGw7XG4gICAgdGhpcy5wYWdlID0gbmV3IERPTWJ1aWxkZXIoKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuI2FpU2hpcHMoKTtcbiAgICB0aGlzLmFpR3JpZExpc3RlbmVycygpO1xuICAgIHRoaXMuaHVtYW5HcmlkTGlzdGVuZXJzKCk7XG5cbiAgICBsZXQgY3VycmVudFJvdW5kID0gdGhpcy5yb3VuZDtcblxuICAgIGNvbnN0IHBsYXlSb3VuZCA9ICgpID0+IHtcbiAgICAgIGlmICghdGhpcy4jZ2FtZU92ZXIoKSkge1xuICAgICAgICB0aGlzLiNhaUF0dGFjaygpO1xuICAgICAgICBpZiAoY3VycmVudFJvdW5kICE9PSB0aGlzLnJvdW5kKSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50UGxheWVyID0gdGhpcy5jdXJyZW50UGxheWVyID09PSB0aGlzLmh1bWFuID8gdGhpcy5haSA6IHRoaXMuaHVtYW47XG4gICAgICAgICAgY3VycmVudFJvdW5kID0gdGhpcy5yb3VuZDtcbiAgICAgICAgfVxuICAgICAgICBzZXRUaW1lb3V0KHBsYXlSb3VuZCwgMCk7IC8vIFNjaGVkdWxlIHRoZSBuZXh0IHJvdW5kIGFmdGVyIGEgdmVyeSBzaG9ydCBkZWxheVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4jZW5kR2FtZSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwbGF5Um91bmQoKTtcbiAgfVxuXG4gICNlbmRHYW1lKCkge1xuICAgIGNvbnN0IHdpbm5lciA9IHRoaXMuI2dhbWVPdmVyKCkgPT09IHRoaXMuaHVtYW4gPyAnWW91JyA6ICdDb21wdXRlcic7XG4gICAgY29uc3QgYWlHcmlkSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdyaWQtaXRlbS5haVwiKTtcbiAgICAvLyBkaXNwbGF5IHRoZSB3aW5uZXJcbiAgICB0aGlzLnBhZ2UuZGlzcGxheVdpbm5lcih3aW5uZXIpO1xuICAgIC8vIHJldmVhbCBhbGwgYm9hcmRzXG4gICAgYWlHcmlkSXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGxldCBjb29yZHMgPSBpdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXNcbiAgICAgIC5zcGxpdChcIixcIilcbiAgICAgIC5tYXAoKHgpID0+IHBhcnNlSW50KHgsIDEwKSk7XG4gICAgICB0aGlzLiNhaUJvYXJkQXR0YWNrKGNvb3JkcywgaXRlbSk7XG4gICAgfSlcbiAgfVxuXG4gIGh1bWFuR3JpZExpc3RlbmVycygpIHtcbiAgICB0aGlzLiNvcmllbnRhdGlvbkJ0bkxpc3RlbmVyKCk7XG4gICAgY29uc3Qgb3JpZW50YXRpb25CdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yaWVudGF0aW9uQnRuXCIpO1xuICAgIGNvbnN0IGdyaWRJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ3JpZC1pdGVtLmh1bWFuXCIpO1xuICAgIGxldCBwbGFjZW1lbnRDb3VudGVyID0gMDtcbiAgICBsZXQgc2hpcFNpemUgPSBbNSwgNCwgMywgMywgMl07XG5cbiAgICBncmlkSXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBpZiAocGxhY2VtZW50Q291bnRlciA+PSBzaGlwU2l6ZS5sZW5ndGggLSAxICYmICF0aGlzLnJvdW5kKSB7XG4gICAgICAgICAgdGhpcy5wYWdlLmhpZGVFbGVtZW50KG9yaWVudGF0aW9uQnRuKTtcbiAgICAgICAgICB0aGlzLnJvdW5kID0gMDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uQnRuLnRleHRDb250ZW50O1xuICAgICAgICBsZXQgY29vcmRzID0gaXRlbS5kYXRhc2V0LmNvb3JkaW5hdGVzXG4gICAgICAgICAgLnNwbGl0KFwiLFwiKVxuICAgICAgICAgIC5tYXAoKHgpID0+IHBhcnNlSW50KHgsIDEwKSk7XG4gICAgICAgIGxldCBjb29yZGluYXRlcyA9IHRoaXMuaHVtYW4uYm9hcmQucGxhY2VTaGlwKFxuICAgICAgICAgIHNoaXBTaXplW3BsYWNlbWVudENvdW50ZXJdLFxuICAgICAgICAgIGNvb3JkcyxcbiAgICAgICAgICBvcmllbnRhdGlvblxuICAgICAgICApO1xuICAgICAgICAvLyBTaG93IHNoaXAgb24gc2NyZWVuLlxuICAgICAgICBjb29yZGluYXRlcy5mb3JFYWNoKChjb29yZCkgPT4ge1xuICAgICAgICAgIHRoaXMucGFnZS5zaGlwKHRoaXMuI2ZpbmRHcmlkSXRlbShjb29yZCwgXCJodW1hblwiKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBwbGFjZW1lbnRDb3VudGVyKys7XG4gICAgICAgIHRoaXMucGFnZS51cGRhdGVQbGF5ZXJNc2cocGxhY2VtZW50Q291bnRlcik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gICNvcmllbnRhdGlvbkJ0bkxpc3RlbmVyKCkge1xuICAgIGNvbnN0IG9yaWVudGF0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmllbnRhdGlvbkJ0blwiKTtcbiAgICBvcmllbnRhdGlvbi5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXG4gICAgb3JpZW50YXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGxldCB0ZXh0ID0gb3JpZW50YXRpb24udGV4dENvbnRlbnQ7XG4gICAgICBvcmllbnRhdGlvbi50ZXh0Q29udGVudCA9XG4gICAgICAgIHRleHQgPT09IFwiaG9yaXpvbnRhbFwiID8gXCJ2ZXJ0aWNhbFwiIDogXCJob3Jpem9udGFsXCI7XG4gICAgfSk7XG4gIH1cblxuICBhaUdyaWRMaXN0ZW5lcnMoKSB7XG4gICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ncmlkLWl0ZW0uYWlcIik7XG4gICAgZ3JpZEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBsYXllciA9PT0gdGhpcy5odW1hbikge1xuICAgICAgICAgIGxldCBjb29yZHMgPSBpdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXNcbiAgICAgICAgICAgIC5zcGxpdChcIixcIilcbiAgICAgICAgICAgIC5tYXAoKHgpID0+IHBhcnNlSW50KHgsIDEwKSk7XG4gICAgICAgICAgdGhpcy4jYWlCb2FyZEF0dGFjayhjb29yZHMsIGl0ZW0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gICNhaUJvYXJkQXR0YWNrKGNvb3JkcywgZ3JpZEl0ZW0pIHtcbiAgICBsZXQgYXR0YWNrZWRTaGlwID0gdGhpcy5haS5ib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkcylcbiAgICBpZiAoYXR0YWNrZWRTaGlwKSB7XG4gICAgICAvLyBpZiBhIHNoaXAgaXMgaGl0LCBtYXJrIHNxdWFyZSBhcyByZWQuXG4gICAgICB0aGlzLnBhZ2UuaGl0KGdyaWRJdGVtKTtcbiAgICAgIHRoaXMucm91bmQrKztcbiAgICAgIC8vIGlmIHNoaXAgaXMgc3VuaywgZGlzcGxheSBnbG9iYWwgbWVzc2FnZS5cbiAgICAgIGlmIChhdHRhY2tlZFNoaXAuaXNTdW5rKCkgJiYgIXRoaXMuI2dhbWVPdmVyKCkpIHtcbiAgICAgICAgdGhpcy5wYWdlLmRpc3BsYXlTdW5rTWVzc2FnZShhdHRhY2tlZFNoaXApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBpZiBhIHNoaXAgaXMgbm90IGhpdCwgbWFyayBzcXVhcmUgYXMgYmx1ZS5cbiAgICAgIHRoaXMucGFnZS5taXNzKGdyaWRJdGVtKTtcbiAgICAgIHRoaXMucm91bmQrKztcbiAgICB9XG4gIH1cblxuICAjYWlTaGlwcygpIHtcbiAgICBjb25zdCBzaGlwU2l6ZXMgPSBbNSwgNCwgMywgMywgMl07XG4gICAgc2hpcFNpemVzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIGxldCBjb29yZGluYXRlcyA9IHRoaXMuI2FpU2hpcFBsYWNlbWVudChzaGlwKTtcblxuICAgICAgd2hpbGUgKCFjb29yZGluYXRlcykge1xuICAgICAgICBjb29yZGluYXRlcyA9IHRoaXMuI2FpU2hpcFBsYWNlbWVudChzaGlwKTtcbiAgICAgIH1cblxuICAgICAgLy8gc2hvdyBhaSBzaGlwcyB3aGlsZSB0ZXN0aW5nLlxuICAgICAgY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmQpID0+IHtcbiAgICAgICAgdGhpcy5wYWdlLnNoaXAodGhpcy4jZmluZEdyaWRJdGVtKGNvb3JkLCBcImFpXCIpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgI2FpU2hpcFBsYWNlbWVudChzaGlwKSB7XG4gICAgbGV0IG9yaWVudGF0aW9uID0gdGhpcy4jcmFuZG9tTnVtKDIpID09PSAwID8gXCJob3Jpem9udGFsXCIgOiBcInZlcnRpY2FsXCI7XG4gICAgbGV0IGNvb3JkID1cbiAgICAgIG9yaWVudGF0aW9uID09PSBcImhvcml6b250YWxcIlxuICAgICAgICA/IFt0aGlzLiNyYW5kb21OdW0oMTAgLSBzaGlwKSwgdGhpcy4jcmFuZG9tTnVtKDEwKV1cbiAgICAgICAgOiBbdGhpcy4jcmFuZG9tTnVtKDEwKSwgdGhpcy4jcmFuZG9tTnVtKDEwIC0gc2hpcCldO1xuICAgIGxldCBjb29yZGluYXRlcyA9IHRoaXMuYWkuYm9hcmQucGxhY2VTaGlwKHNoaXAsIGNvb3JkLCBvcmllbnRhdGlvbik7XG4gICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xuICB9XG5cbiAgI2FpQXR0YWNrKCkge1xuICAgIGlmICh0aGlzLmN1cnJlbnRQbGF5ZXIgPT09IHRoaXMuYWkgJiYgdGhpcy5yb3VuZCkge1xuICAgICAgbGV0IGNvb3JkID0gdGhpcy4jYWlDb29yZFNlbGVjdG9yKCk7XG4gICAgICBsZXQgZ3JpZEl0ZW0gPSB0aGlzLiNmaW5kR3JpZEl0ZW0oY29vcmQsICdodW1hbicpO1xuICAgICAgbGV0IGF0dGFja2VkU2hpcCA9IHRoaXMuaHVtYW4uYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZClcbiAgICAgIGlmIChhdHRhY2tlZFNoaXApIHtcbiAgICAgICAgLy8gaWYgYSBzaGlwIGlzIGhpdCwgbWFyayBzcXVhcmUgYXMgcmVkLlxuICAgICAgICB0aGlzLnBhZ2UuaGl0KGdyaWRJdGVtKTtcbiAgICAgICAgdGhpcy5yb3VuZCsrO1xuICAgICAgICAvLyBpZiBzaGlwIGlzIHN1bmssIGRpc3BsYXkgZ2xvYmFsIG1lc3NhZ2UuXG4gICAgICAgIGlmIChhdHRhY2tlZFNoaXAuaXNTdW5rKCkpIHtcbiAgICAgICAgICB0aGlzLnBhZ2UuZGlzcGxheVN1bmtNZXNzYWdlKGF0dGFja2VkU2hpcCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGlmIGEgc2hpcCBpcyBub3QgaGl0LCBtYXJrIHNxdWFyZSBhcyBibHVlLlxuICAgICAgICB0aGlzLnBhZ2UubWlzcyhncmlkSXRlbSk7XG4gICAgICAgIHRoaXMucm91bmQrKztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAjYWlDb29yZFNlbGVjdG9yKCkge1xuICAgIGxldCBjb29yZCA9IFt0aGlzLiNyYW5kb21OdW0oMTApLCB0aGlzLiNyYW5kb21OdW0oMTApXTtcbiAgICAvLyBDaGVjayBpZiBjb29yZCBoYXMgYWxyZWFkeSBiZWVuIHVzZWQsIGlmIHNvIHJlcnVuIGZ1bmN0aW9uLlxuICAgIHRoaXMuaHVtYW4uYm9hcmQuYWxsU2hvdHMuZm9yRWFjaChzaG90ID0+IHtcbiAgICAgIGlmIChzaG90WzBdID09PSBjb29yZFswXSAmJiBzaG90WzFdID09PSBjb29yZFsxXSkge1xuICAgICAgICByZXR1cm4gdGhpcy4jYWlDb29yZFNlbGVjdG9yKCk7XG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gY29vcmQ7XG4gIH1cblxuICAjcmFuZG9tTnVtKG1heCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xuICB9XG5cbiAgI2ZpbmRHcmlkSXRlbShjb29yZCwgcGxheWVyKSB7XG4gICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLmdyaWQtaXRlbS4ke3BsYXllcn1gKTtcbiAgICBsZXQgZm91bmRJdGVtID0gZmFsc2U7XG4gICAgZ3JpZEl0ZW1zLmZvckVhY2goKGdyaWRJdGVtKSA9PiB7XG4gICAgICBpZiAoZ3JpZEl0ZW0uZGF0YXNldC5jb29yZGluYXRlcyA9PT0gY29vcmQudG9TdHJpbmcoKSkge1xuICAgICAgICBmb3VuZEl0ZW0gPSBncmlkSXRlbTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZm91bmRJdGVtO1xuICB9XG5cbiAgI2dhbWVPdmVyKCkge1xuICAgIC8vIEFJIHdpbnMgaWYgaHVtYW4gYm9hcmQgaXMgZ2FtZSBvdmVyLlxuICAgIGlmICh0aGlzLmh1bWFuLmJvYXJkLmdhbWVPdmVyKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmFpO1xuICAgIC8vIEh1bWFuIHdpbnMgaWYgYWkgYm9hcmQgaXMgZ2FtZSBvdmVyLlxuICAgIH0gZWxzZSBpZiAodGhpcy5haS5ib2FyZC5nYW1lT3ZlcigpKSB7XG4gICAgICByZXR1cm4gdGhpcy5odW1hbjtcbiAgICAvLyBFbHNlIGdhbWUgY29udGludWVzLlxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgR2FtZWJvYXJkIGZyb20gXCIuL2dhbWVib2FyZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihodW1hbj10cnVlKSB7XG4gICAgdGhpcy5ib2FyZCA9IG5ldyBHYW1lYm9hcmQ7XG4gICAgdGhpcy5pc0h1bWFuID0gaHVtYW47XG4gICAgdGhpcy5wcmV2aW91c1BsYXlzID0gW107XG4gIH07XG5cbiAgYXR0YWNrKHBsYXllciwgY29vcmRpbmF0ZSkge1xuICAgIGlmICghdGhpcy5pc0h1bWFuKSB7XG4gICAgICBjb29yZGluYXRlID0gdGhpcy4jYWlBdHRhY2socGxheWVyLmJvYXJkKTtcbiAgICB9XG5cbiAgICB0aGlzLnByZXZpb3VzUGxheXMucHVzaChjb29yZGluYXRlKTtcbiAgICBwbGF5ZXIuYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZGluYXRlKTtcbiAgfVxuXG4gICNhaUF0dGFjayhib2FyZCkge1xuICAgIGxldCBjb29yZGluYXRlID0gdGhpcy4jcmFuZG9tQ29vcmQoKTtcbiAgICBpZiAodGhpcy5wcmV2aW91c1BsYXlzLmluY2x1ZGVzKGNvb3JkaW5hdGUpKSB7XG4gICAgICB0aGlzLiNhaUF0dGFjayhib2FyZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjb29yZGluYXRlO1xuICAgIH1cbiAgfVxuXG4gIC8vIEdlbmVyYXRlIHJhbmRvbSBjb29yZGluYXRlcyBiZXR3ZWVuIDAgLSA5LlxuICAjcmFuZG9tQ29vcmQoKSB7XG4gICAgcmV0dXJuIFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCksIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKV07XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoaXAge1xuICBjb25zdHJ1Y3RvcihzaXplKSB7XG4gICAgY29uc3Qgc2hpcFR5cGVzID0gezUgOiAnQ2FycmllcicsIDQgOiAnQmF0dGxlc2hpcCcsIDMgOiAnRGVzdHJveWVyJywgMyA6ICdTdWJtYXJpbmUnLCAyIDogJ1BhdHJvbCBCb2F0J31cbiAgICB0aGlzLmxlbmd0aCA9IHNpemU7XG4gICAgdGhpcy5zaGlwVHlwZSA9IHNoaXBUeXBlc1tzaXplXTtcbiAgICB0aGlzLmhpdHMgPSAwO1xuICAgIHRoaXMuc3VuayA9IGZhbHNlO1xuICB9XG5cbiAgaGl0KCkge1xuICAgIHRoaXMuaGl0cysrO1xuICAgIHRoaXMuaXNTdW5rKCk7XG4gIH1cblxuICBpc1N1bmsoKSB7XG4gICAgaWYgKHRoaXMuaGl0cyA9PT0gdGhpcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc3VuayA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN1bms7XG4gIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEdhbWVsb29wIGZyb20gXCIuL2dhbWVsb29wXCI7XG5cbmNvbnN0IGdhbWUgPSBuZXcgR2FtZWxvb3AoKTtcbmdhbWUuc3RhcnQoKTtcbiJdLCJuYW1lcyI6WyJET01idWlsZGVyIiwiY29uc3RydWN0b3IiLCJzaGlwcyIsInNoaXBOYW1lcyIsInNoaXBTaXplcyIsImdhbWVDb250YWluZXIiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwicGxheWVyQ29udGFpbmVyIiwiY3JlYXRlRWxlbWVudCIsImFpQ29udGFpbmVyIiwiZ2xvYmFsTXNnIiwiaWQiLCJjbGFzc0xpc3QiLCJhZGQiLCJwbGF5ZXJUaXRsZSIsInRleHRDb250ZW50IiwiYWlUaXRsZSIsInBsYXllckdyaWQiLCJncmlkUG9wdWxhdGUiLCJhaUdyaWQiLCJwbGF5ZXJNc2ciLCJjcmVhdGVUZXh0Tm9kZSIsInVwZGF0ZVBsYXllck1zZyIsIm9yaWVudGF0aW9uQnRuIiwiYXBwZW5kIiwiaGl0IiwiZ3JpZEl0ZW0iLCJyZW1vdmUiLCJtaXNzIiwic2hpcCIsImhpZGVFbGVtZW50IiwiZWxlbWVudCIsInN0eWxlIiwiZGlzcGxheSIsImNvdW50ZXIiLCJtc2ciLCJjbGVhck1zZyIsImRpc3BsYXlTdW5rTWVzc2FnZSIsInN1bmtNc2ciLCJzaGlwVHlwZSIsImFwcGVuZENoaWxkIiwic2V0VGltZW91dCIsImRpc3BsYXlXaW5uZXIiLCJ3aW5uZXIiLCJ3aW5uZXJNc2ciLCIjY2xlYXJNc2ciLCJtc2dFbGVtZW50IiwiI2dyaWRQb3B1bGF0ZSIsInBsYXllciIsImdyaWQiLCJpIiwiZGF0YXNldCIsImNvb3JkaW5hdGVzIiwiY29vcmRzUG9wdWxhdGUiLCIjY29vcmRzUG9wdWxhdGUiLCJkaWdpdHMiLCJ0b1N0cmluZyIsInNwbGl0IiwiU2hpcCIsIkdhbWVib2FyZCIsImFsbFNoaXBzIiwibWlzc2VkU2hvdHMiLCJhbGxTaG90cyIsInBsYWNlU2hpcCIsInNpemUiLCJmaXJzdENvb3JkIiwib3JpZW50YXRpb24iLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJidWlsZENvb3JkaW5hdGVzIiwiZm9yRWFjaCIsImNvb3JkIiwiZmluZFNoaXAiLCJuZXdTaGlwIiwic2hpcEVudHJ5IiwicHVzaCIsInJlY2VpdmVBdHRhY2siLCJjb29yZGluYXRlIiwiZ2FtZU92ZXIiLCJhbGxTdW5rIiwiaXNTdW5rIiwiI2J1aWxkQ29vcmRpbmF0ZXMiLCIjZmluZFNoaXAiLCJmb3VuZFNoaXAiLCJzb21lIiwieCIsIlBsYXllciIsIkdhbWVsb29wIiwiaHVtYW4iLCJhaSIsInBsYXllcnMiLCJjdXJyZW50UGxheWVyIiwicm91bmQiLCJwYWdlIiwic3RhcnQiLCJhaVNoaXBzIiwiYWlHcmlkTGlzdGVuZXJzIiwiaHVtYW5HcmlkTGlzdGVuZXJzIiwiY3VycmVudFJvdW5kIiwicGxheVJvdW5kIiwiYWlBdHRhY2siLCJlbmRHYW1lIiwiI2VuZEdhbWUiLCJhaUdyaWRJdGVtcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpdGVtIiwiY29vcmRzIiwibWFwIiwicGFyc2VJbnQiLCJhaUJvYXJkQXR0YWNrIiwib3JpZW50YXRpb25CdG5MaXN0ZW5lciIsImdyaWRJdGVtcyIsInBsYWNlbWVudENvdW50ZXIiLCJzaGlwU2l6ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJib2FyZCIsImZpbmRHcmlkSXRlbSIsIiNvcmllbnRhdGlvbkJ0bkxpc3RlbmVyIiwidGV4dCIsIiNhaUJvYXJkQXR0YWNrIiwiYXR0YWNrZWRTaGlwIiwiI2FpU2hpcHMiLCJhaVNoaXBQbGFjZW1lbnQiLCIjYWlTaGlwUGxhY2VtZW50IiwicmFuZG9tTnVtIiwiI2FpQXR0YWNrIiwiYWlDb29yZFNlbGVjdG9yIiwiI2FpQ29vcmRTZWxlY3RvciIsInNob3QiLCIjcmFuZG9tTnVtIiwibWF4IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiI2ZpbmRHcmlkSXRlbSIsImZvdW5kSXRlbSIsIiNnYW1lT3ZlciIsImlzSHVtYW4iLCJwcmV2aW91c1BsYXlzIiwiYXR0YWNrIiwicmFuZG9tQ29vcmQiLCJpbmNsdWRlcyIsIiNyYW5kb21Db29yZCIsInNoaXBUeXBlcyIsImhpdHMiLCJzdW5rIiwiZ2FtZSJdLCJzb3VyY2VSb290IjoiIn0=