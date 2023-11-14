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
    if (this.#validateCoordinates(coordinates)) {
      const newShip = new _ships__WEBPACK_IMPORTED_MODULE_0__["default"](size);
      const shipEntry = [newShip, coordinates];
      this.allShips.push(shipEntry);
      return coordinates;
    } else {
      return false;
    }
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
  #validateCoordinates(coordinates) {
    let validCoords = true;
    coordinates.forEach(coord => {
      // If a ship already exists at location, reject it.
      if (this.#findShip(coord) || coord > 9) {
        validCoords = false;
      }
    });
    return validCoords;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFlLE1BQU1BLFVBQVUsQ0FBQztFQUM5QkMsV0FBV0EsQ0FBQSxFQUFHO0lBQ1osTUFBTUMsS0FBSyxHQUFHO01BQUMsU0FBUyxFQUFFLENBQUM7TUFBRSxZQUFZLEVBQUUsQ0FBQztNQUFFLFdBQVcsRUFBRSxDQUFDO01BQUUsV0FBVyxFQUFFLENBQUM7TUFBRSxhQUFhLEVBQUU7SUFBQyxDQUFDO0lBQy9GLElBQUksQ0FBQ0MsU0FBUyxHQUFHLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLGFBQWEsQ0FBQztJQUNuRixJQUFJLENBQUNDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFaEMsSUFBSSxDQUFDQyxhQUFhLEdBQUdDLFFBQVEsQ0FBQ0MsY0FBYyxDQUFDLGdCQUFnQixDQUFDO0lBQzlEO0lBQ0U7SUFDRixJQUFJLENBQUNDLGVBQWUsR0FBR0YsUUFBUSxDQUFDRyxhQUFhLENBQUMsS0FBSyxDQUFDO0lBQ3BELElBQUksQ0FBQ0MsV0FBVyxHQUFHSixRQUFRLENBQUNHLGFBQWEsQ0FBQyxLQUFLLENBQUM7SUFDaEQsSUFBSSxDQUFDRSxTQUFTLEdBQUdMLFFBQVEsQ0FBQ0csYUFBYSxDQUFDLEtBQUssQ0FBQztJQUM5QyxJQUFJLENBQUNFLFNBQVMsQ0FBQ0MsRUFBRSxHQUFHLFlBQVk7SUFDaEMsSUFBSSxDQUFDSixlQUFlLENBQUNLLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLGtCQUFrQixDQUFDO0lBQ3RELElBQUksQ0FBQ0osV0FBVyxDQUFDRyxTQUFTLENBQUNDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztJQUNoRDtJQUNFO0lBQ0EsTUFBTUMsV0FBVyxHQUFHVCxRQUFRLENBQUNHLGFBQWEsQ0FBQyxJQUFJLENBQUM7SUFDaERNLFdBQVcsQ0FBQ0MsV0FBVyxHQUFHLFFBQVE7SUFFbEMsTUFBTUMsT0FBTyxHQUFHWCxRQUFRLENBQUNHLGFBQWEsQ0FBQyxJQUFJLENBQUM7SUFDNUNRLE9BQU8sQ0FBQ0QsV0FBVyxHQUFHLFVBQVU7O0lBRWhDO0lBQ0EsTUFBTUUsVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDQyxZQUFZLENBQUMsT0FBTyxDQUFDO0lBQzlDLE1BQU1DLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQ0QsWUFBWSxDQUFDLElBQUksQ0FBQztJQUV2QyxJQUFJLENBQUNFLFNBQVMsR0FBR2YsUUFBUSxDQUFDZ0IsY0FBYyxDQUFDLEVBQUUsQ0FBQztJQUM1QyxJQUFJLENBQUNDLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDdkIsSUFBSSxDQUFDRixTQUFTLENBQUNULEVBQUUsR0FBRyxXQUFXO0lBRS9CLE1BQU1ZLGNBQWMsR0FBR2xCLFFBQVEsQ0FBQ0csYUFBYSxDQUFDLFFBQVEsQ0FBQztJQUN2RGUsY0FBYyxDQUFDUixXQUFXLEdBQUcsWUFBWTtJQUN6Q1EsY0FBYyxDQUFDWixFQUFFLEdBQUcsZ0JBQWdCO0lBRXRDLElBQUksQ0FBQ0osZUFBZSxDQUFDaUIsTUFBTSxDQUFDVixXQUFXLEVBQUVHLFVBQVUsRUFBRSxJQUFJLENBQUNHLFNBQVMsRUFBRUcsY0FBYyxDQUFDO0lBQ3BGLElBQUksQ0FBQ2QsV0FBVyxDQUFDZSxNQUFNLENBQUNSLE9BQU8sRUFBRUcsTUFBTSxDQUFDO0lBRTFDLElBQUksQ0FBQ2YsYUFBYSxDQUFDb0IsTUFBTSxDQUFDLElBQUksQ0FBQ2pCLGVBQWUsRUFBRSxJQUFJLENBQUNFLFdBQVcsRUFBRSxJQUFJLENBQUNDLFNBQVMsQ0FBQztFQUNuRjtFQUVBZSxHQUFHQSxDQUFDQyxRQUFRLEVBQUU7SUFDWkEsUUFBUSxDQUFDZCxTQUFTLENBQUNlLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDakNELFFBQVEsQ0FBQ2QsU0FBUyxDQUFDQyxHQUFHLENBQUMsS0FBSyxDQUFDO0VBQy9CO0VBRUFlLElBQUlBLENBQUNGLFFBQVEsRUFBRTtJQUNiQSxRQUFRLENBQUNkLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLE1BQU0sQ0FBQztFQUNoQztFQUVBZ0IsSUFBSUEsQ0FBQ0gsUUFBUSxFQUFFO0lBQ2JBLFFBQVEsQ0FBQ2QsU0FBUyxDQUFDQyxHQUFHLENBQUMsTUFBTSxDQUFDO0VBQ2hDO0VBRUFpQixXQUFXQSxDQUFDQyxPQUFPLEVBQUU7SUFDbkJBLE9BQU8sQ0FBQ0MsS0FBSyxDQUFDQyxPQUFPLEdBQUcsTUFBTTtFQUNoQztFQUVBWCxlQUFlQSxDQUFDWSxPQUFPLEVBQUU7SUFDdkIsSUFBSUMsR0FBRyxHQUFHLElBQUksQ0FBQ2YsU0FBUztJQUN4QixJQUFJYyxPQUFPLEdBQUcsQ0FBQyxFQUFFO01BQ2ZDLEdBQUcsQ0FBQ3BCLFdBQVcsR0FBSSx1QkFBc0IsSUFBSSxDQUFDYixTQUFTLENBQUNnQyxPQUFPLENBQUUsV0FBVSxJQUFJLENBQUMvQixTQUFTLENBQUMrQixPQUFPLENBQUUsR0FBRTtJQUN2RyxDQUFDLE1BQU07TUFDTCxJQUFJLENBQUMsQ0FBQ0UsUUFBUSxDQUFDRCxHQUFHLENBQUM7SUFDckI7RUFDRjtFQUVBRSxrQkFBa0JBLENBQUNSLElBQUksRUFBRTtJQUN2QixNQUFNUyxPQUFPLEdBQUdqQyxRQUFRLENBQUNnQixjQUFjLENBQUUsR0FBRVEsSUFBSSxDQUFDVSxRQUFTLGlCQUFnQixDQUFDO0lBQzFFLElBQUksQ0FBQzdCLFNBQVMsQ0FBQzhCLFdBQVcsQ0FBQ0YsT0FBTyxDQUFDO0lBQ25DRyxVQUFVLENBQUMsTUFBTTtNQUNmLElBQUksQ0FBQyxDQUFDTCxRQUFRLENBQUNFLE9BQU8sQ0FBQztJQUN6QixDQUFDLEVBQUUsSUFBSSxDQUFDO0VBQ1Y7RUFFQUksYUFBYUEsQ0FBQ0MsTUFBTSxFQUFFO0lBQ3BCLE1BQU1DLFNBQVMsR0FBR3ZDLFFBQVEsQ0FBQ2dCLGNBQWMsQ0FBRSxXQUFVc0IsTUFBTyxHQUFFLENBQUM7SUFDL0QsSUFBSSxDQUFDakMsU0FBUyxDQUFDOEIsV0FBVyxDQUFDSSxTQUFTLENBQUM7RUFDdkM7RUFFQSxDQUFDUixRQUFRUyxDQUFDQyxVQUFVLEVBQUU7SUFDcEJBLFVBQVUsQ0FBQ25CLE1BQU0sQ0FBQyxDQUFDO0VBQ3JCO0VBRUEsQ0FBQ1QsWUFBWTZCLENBQUNDLE1BQU0sRUFBRTtJQUNwQixNQUFNQyxJQUFJLEdBQUc1QyxRQUFRLENBQUNHLGFBQWEsQ0FBQyxLQUFLLENBQUM7SUFDMUN5QyxJQUFJLENBQUNyQyxTQUFTLENBQUNDLEdBQUcsQ0FBQyxNQUFNLEVBQUVtQyxNQUFNLENBQUM7SUFFbEMsS0FBSyxJQUFJRSxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUcsR0FBRyxFQUFFQSxDQUFDLEVBQUUsRUFBRTtNQUM1QixNQUFNeEIsUUFBUSxHQUFHckIsUUFBUSxDQUFDRyxhQUFhLENBQUMsS0FBSyxDQUFDO01BQzlDa0IsUUFBUSxDQUFDZCxTQUFTLENBQUNDLEdBQUcsQ0FBQyxXQUFXLEVBQUVtQyxNQUFNLENBQUM7TUFDM0N0QixRQUFRLENBQUN5QixPQUFPLENBQUNDLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQ0MsY0FBYyxDQUFDSCxDQUFDLENBQUM7TUFDdERELElBQUksQ0FBQ1QsV0FBVyxDQUFDZCxRQUFRLENBQUM7SUFDNUI7SUFDQSxPQUFPdUIsSUFBSTtFQUNiO0VBRUEsQ0FBQ0ksY0FBY0MsQ0FBQ0osQ0FBQyxFQUFFO0lBQ2pCLElBQUlBLENBQUMsR0FBRyxFQUFFLEVBQUU7TUFDVixPQUFPLENBQUNBLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDZixDQUFDLE1BQU07TUFDTCxJQUFJSyxNQUFNLEdBQUdMLENBQUMsQ0FBQ00sUUFBUSxDQUFDLENBQUMsQ0FBQ0MsS0FBSyxDQUFDLEVBQUUsQ0FBQztNQUNuQyxPQUFPLENBQUNGLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRUEsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9CO0VBQ0Y7QUFDRjs7Ozs7Ozs7Ozs7Ozs7O0FDekcyQjtBQUVaLE1BQU1JLFNBQVMsQ0FBQztFQUM3QjNELFdBQVdBLENBQUEsRUFBRztJQUNaLElBQUksQ0FBQzRELFFBQVEsR0FBRyxFQUFFO0lBQ2xCLElBQUksQ0FBQ0MsV0FBVyxHQUFHLEVBQUU7SUFDckIsSUFBSSxDQUFDQyxRQUFRLEdBQUcsRUFBRTtFQUNwQjtFQUVBQyxTQUFTQSxDQUFDQyxJQUFJLEVBQUVDLFVBQVUsRUFBNEI7SUFBQSxJQUExQkMsV0FBVyxHQUFBQyxTQUFBLENBQUFDLE1BQUEsUUFBQUQsU0FBQSxRQUFBRSxTQUFBLEdBQUFGLFNBQUEsTUFBQyxZQUFZO0lBQ2xELE1BQU1mLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQ2tCLGdCQUFnQixDQUFDTixJQUFJLEVBQUVDLFVBQVUsRUFBRUMsV0FBVyxDQUFDO0lBQ3pFLElBQUksSUFBSSxDQUFDLENBQUNLLG1CQUFtQixDQUFDbkIsV0FBVyxDQUFDLEVBQUU7TUFDMUMsTUFBTW9CLE9BQU8sR0FBRyxJQUFJZCw4Q0FBSSxDQUFDTSxJQUFJLENBQUM7TUFDOUIsTUFBTVMsU0FBUyxHQUFHLENBQUNELE9BQU8sRUFBRXBCLFdBQVcsQ0FBQztNQUN4QyxJQUFJLENBQUNRLFFBQVEsQ0FBQ2MsSUFBSSxDQUFDRCxTQUFTLENBQUM7TUFDN0IsT0FBT3JCLFdBQVc7SUFDcEIsQ0FBQyxNQUFNO01BQ0wsT0FBTyxLQUFLO0lBQ2Q7RUFDRjs7RUFFQTtFQUNBO0VBQ0F1QixhQUFhQSxDQUFDQyxVQUFVLEVBQUU7SUFDeEIsSUFBSSxDQUFDZCxRQUFRLENBQUNZLElBQUksQ0FBQ0UsVUFBVSxDQUFDO0lBQzlCLE1BQU0vQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUNnRCxRQUFRLENBQUNELFVBQVUsQ0FBQztJQUN2QyxJQUFJL0MsSUFBSSxFQUFFO01BQ1JBLElBQUksQ0FBQ0osR0FBRyxDQUFDLENBQUM7TUFDVixPQUFPSSxJQUFJO0lBQ2IsQ0FBQyxNQUFNO01BQ0wsSUFBSSxDQUFDZ0MsV0FBVyxDQUFDYSxJQUFJLENBQUNFLFVBQVUsQ0FBQztNQUNqQyxPQUFPLEtBQUs7SUFDZDtFQUNGO0VBRUFFLFFBQVFBLENBQUEsRUFBRztJQUNULElBQUlDLE9BQU8sR0FBRyxJQUFJO0lBQ2xCO0lBQ0EsSUFBSSxJQUFJLENBQUNuQixRQUFRLENBQUNRLE1BQU0sS0FBSyxDQUFDLEVBQUU7TUFDOUIsT0FBTyxLQUFLO0lBQ2Q7SUFDQSxJQUFJLENBQUNSLFFBQVEsQ0FBQ29CLE9BQU8sQ0FBQ25ELElBQUksSUFBSTtNQUM1QixJQUFJLENBQUNBLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQ29ELE1BQU0sQ0FBQyxDQUFDLEVBQUU7UUFDckJGLE9BQU8sR0FBRyxLQUFLO01BQ2pCO0lBQ0YsQ0FBQyxDQUFDO0lBQ0YsT0FBT0EsT0FBTztFQUNoQjtFQUVBLENBQUNULGdCQUFnQlksQ0FBQ2xCLElBQUksRUFBRUMsVUFBVSxFQUFFQyxXQUFXLEVBQUU7SUFDL0MsSUFBSWQsV0FBVyxHQUFHLEVBQUU7SUFDcEIsS0FBSyxJQUFJRixDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdjLElBQUksRUFBRWQsQ0FBQyxFQUFFLEVBQUU7TUFDN0IsSUFBSWdCLFdBQVcsS0FBSyxZQUFZLEVBQUU7UUFDaENkLFdBQVcsQ0FBQ3NCLElBQUksQ0FBQyxDQUFDVCxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUdmLENBQUMsRUFBRWUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDdEQsQ0FBQyxNQUFNO1FBQ0xiLFdBQVcsQ0FBQ3NCLElBQUksQ0FBQyxDQUFDVCxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUVBLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBR2YsQ0FBQyxDQUFDLENBQUM7TUFDdEQ7SUFDRjtJQUNBLE9BQU9FLFdBQVc7RUFDcEI7RUFFQSxDQUFDbUIsbUJBQW1CWSxDQUFDL0IsV0FBVyxFQUFFO0lBQ2hDLElBQUlnQyxXQUFXLEdBQUcsSUFBSTtJQUN0QmhDLFdBQVcsQ0FBQzRCLE9BQU8sQ0FBRUssS0FBSyxJQUFLO01BQzdCO01BQ0EsSUFBSSxJQUFJLENBQUMsQ0FBQ1IsUUFBUSxDQUFDUSxLQUFLLENBQUMsSUFBSUEsS0FBSyxHQUFHLENBQUMsRUFBRTtRQUN0Q0QsV0FBVyxHQUFHLEtBQUs7TUFDckI7SUFDRixDQUFDLENBQUM7SUFDRixPQUFPQSxXQUFXO0VBQ3BCO0VBRUEsQ0FBQ1AsUUFBUVMsQ0FBQ1YsVUFBVSxFQUFFO0lBQ3BCLElBQUlXLFNBQVMsR0FBRyxLQUFLO0lBQ3JCLElBQUksQ0FBQzNCLFFBQVEsQ0FBQ29CLE9BQU8sQ0FBQ25ELElBQUksSUFBSTtNQUM1QixJQUFJQSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMyRCxJQUFJLENBQUVDLENBQUMsSUFBS0EsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLYixVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUlhLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBS2IsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDekVXLFNBQVMsR0FBRzFELElBQUksQ0FBQyxDQUFDLENBQUM7TUFDdkI7SUFBQyxDQUFDLENBQUM7SUFDSCxPQUFPMEQsU0FBUztFQUNsQjtBQUNGOzs7Ozs7Ozs7Ozs7Ozs7O0FDaEYrQjtBQUNPO0FBRXZCLE1BQU1JLFFBQVEsQ0FBQztFQUM1QjNGLFdBQVdBLENBQUEsRUFBRztJQUNaLElBQUksQ0FBQzRGLEtBQUssR0FBRyxJQUFJRixnREFBTSxDQUFDLElBQUksQ0FBQztJQUM3QixJQUFJLENBQUNHLEVBQUUsR0FBRyxJQUFJSCxnREFBTSxDQUFDLEtBQUssQ0FBQztJQUMzQixJQUFJLENBQUNJLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQ0YsS0FBSyxFQUFFLElBQUksQ0FBQ0MsRUFBRSxDQUFDO0lBQ3BDLElBQUksQ0FBQ0UsYUFBYSxHQUFHLElBQUksQ0FBQ0YsRUFBRTtJQUM1QixJQUFJLENBQUNHLEtBQUssR0FBRyxJQUFJO0lBQ2pCLElBQUksQ0FBQ0MsSUFBSSxHQUFHLElBQUlsRyxtREFBVSxDQUFDLENBQUM7RUFDOUI7RUFFQW1HLEtBQUtBLENBQUEsRUFBRztJQUNOLElBQUksQ0FBQyxDQUFDQyxPQUFPLENBQUMsQ0FBQztJQUNmLElBQUksQ0FBQ0MsZUFBZSxDQUFDLENBQUM7SUFDdEIsSUFBSSxDQUFDQyxrQkFBa0IsQ0FBQyxDQUFDO0lBRXpCLElBQUlDLFlBQVksR0FBRyxJQUFJLENBQUNOLEtBQUs7SUFFN0IsTUFBTU8sU0FBUyxHQUFHQSxDQUFBLEtBQU07TUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDekIsUUFBUSxDQUFDLENBQUMsRUFBRTtRQUNyQixJQUFJLENBQUMsQ0FBQzBCLFFBQVEsQ0FBQyxDQUFDO1FBQ2hCLElBQUlGLFlBQVksS0FBSyxJQUFJLENBQUNOLEtBQUssRUFBRTtVQUMvQixJQUFJLENBQUNELGFBQWEsR0FBRyxJQUFJLENBQUNBLGFBQWEsS0FBSyxJQUFJLENBQUNILEtBQUssR0FBRyxJQUFJLENBQUNDLEVBQUUsR0FBRyxJQUFJLENBQUNELEtBQUs7VUFDN0VVLFlBQVksR0FBRyxJQUFJLENBQUNOLEtBQUs7UUFDM0I7UUFDQXZELFVBQVUsQ0FBQzhELFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQzVCLENBQUMsTUFBTTtRQUNMLElBQUksQ0FBQyxDQUFDRSxPQUFPLENBQUMsQ0FBQztNQUNqQjtJQUNGLENBQUM7SUFFREYsU0FBUyxDQUFDLENBQUM7RUFDYjtFQUVBLENBQUNFLE9BQU9DLENBQUEsRUFBRztJQUNULE1BQU0vRCxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUNtQyxRQUFRLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQ2MsS0FBSyxHQUFHLEtBQUssR0FBRyxVQUFVO0lBQ25FLE1BQU1lLFdBQVcsR0FBR3RHLFFBQVEsQ0FBQ3VHLGdCQUFnQixDQUFDLGVBQWUsQ0FBQztJQUM5RDtJQUNBLElBQUksQ0FBQ1gsSUFBSSxDQUFDdkQsYUFBYSxDQUFDQyxNQUFNLENBQUM7SUFDL0I7SUFDQWdFLFdBQVcsQ0FBQzNCLE9BQU8sQ0FBQzZCLElBQUksSUFBSTtNQUMxQixJQUFJQyxNQUFNLEdBQUdELElBQUksQ0FBQzFELE9BQU8sQ0FBQ0MsV0FBVyxDQUNwQ0ssS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUNWc0QsR0FBRyxDQUFFdEIsQ0FBQyxJQUFLdUIsUUFBUSxDQUFDdkIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO01BQzVCLElBQUksQ0FBQyxDQUFDd0IsYUFBYSxDQUFDSCxNQUFNLEVBQUVELElBQUksQ0FBQztJQUNuQyxDQUFDLENBQUM7RUFDSjtFQUVBUixrQkFBa0JBLENBQUEsRUFBRztJQUNuQixJQUFJLENBQUMsQ0FBQ2Esc0JBQXNCLENBQUMsQ0FBQztJQUM5QixNQUFNM0YsY0FBYyxHQUFHbEIsUUFBUSxDQUFDQyxjQUFjLENBQUMsZ0JBQWdCLENBQUM7SUFDaEUsTUFBTTZHLFNBQVMsR0FBRzlHLFFBQVEsQ0FBQ3VHLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDO0lBQy9ELElBQUlRLGdCQUFnQixHQUFHLENBQUM7SUFDeEIsSUFBSUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUU5QkYsU0FBUyxDQUFDbkMsT0FBTyxDQUFFNkIsSUFBSSxJQUFLO01BQzFCQSxJQUFJLENBQUNTLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNO1FBQ25DLElBQUlGLGdCQUFnQixJQUFJQyxRQUFRLENBQUNqRCxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDNEIsS0FBSyxFQUFFO1VBQzFELElBQUksQ0FBQ0MsSUFBSSxDQUFDbkUsV0FBVyxDQUFDUCxjQUFjLENBQUM7VUFDckMsSUFBSSxDQUFDeUUsS0FBSyxHQUFHLENBQUM7UUFDaEI7UUFDQSxNQUFNOUIsV0FBVyxHQUFHM0MsY0FBYyxDQUFDUixXQUFXO1FBQzlDLElBQUkrRixNQUFNLEdBQUdELElBQUksQ0FBQzFELE9BQU8sQ0FBQ0MsV0FBVyxDQUNsQ0ssS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUNWc0QsR0FBRyxDQUFFdEIsQ0FBQyxJQUFLdUIsUUFBUSxDQUFDdkIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzlCLElBQUlyQyxXQUFXLEdBQUcsSUFBSSxDQUFDd0MsS0FBSyxDQUFDMkIsS0FBSyxDQUFDeEQsU0FBUyxDQUMxQ3NELFFBQVEsQ0FBQ0QsZ0JBQWdCLENBQUMsRUFDMUJOLE1BQU0sRUFDTjVDLFdBQ0YsQ0FBQztRQUNEO1FBQ0FkLFdBQVcsQ0FBQzRCLE9BQU8sQ0FBRUssS0FBSyxJQUFLO1VBQzdCLElBQUksQ0FBQ1ksSUFBSSxDQUFDcEUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDMkYsWUFBWSxDQUFDbkMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQztRQUNGK0IsZ0JBQWdCLEVBQUU7UUFDbEIsSUFBSSxDQUFDbkIsSUFBSSxDQUFDM0UsZUFBZSxDQUFDOEYsZ0JBQWdCLENBQUM7TUFDN0MsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDO0VBQ0o7RUFFQSxDQUFDRixzQkFBc0JPLENBQUEsRUFBRztJQUN4QixNQUFNdkQsV0FBVyxHQUFHN0QsUUFBUSxDQUFDQyxjQUFjLENBQUMsZ0JBQWdCLENBQUM7SUFDN0Q0RCxXQUFXLENBQUNqQyxPQUFPLEdBQUcsT0FBTztJQUU3QmlDLFdBQVcsQ0FBQ29ELGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNO01BQzFDLElBQUlJLElBQUksR0FBR3hELFdBQVcsQ0FBQ25ELFdBQVc7TUFDbENtRCxXQUFXLENBQUNuRCxXQUFXLEdBQ3JCMkcsSUFBSSxLQUFLLFlBQVksR0FBRyxVQUFVLEdBQUcsWUFBWTtJQUNyRCxDQUFDLENBQUM7RUFDSjtFQUVBdEIsZUFBZUEsQ0FBQSxFQUFHO0lBQ2hCLE1BQU1lLFNBQVMsR0FBRzlHLFFBQVEsQ0FBQ3VHLGdCQUFnQixDQUFDLGVBQWUsQ0FBQztJQUM1RE8sU0FBUyxDQUFDbkMsT0FBTyxDQUFFNkIsSUFBSSxJQUFLO01BQzFCQSxJQUFJLENBQUNTLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNO1FBQ25DLElBQUksSUFBSSxDQUFDdkIsYUFBYSxLQUFLLElBQUksQ0FBQ0gsS0FBSyxFQUFFO1VBQ3JDLElBQUlrQixNQUFNLEdBQUdELElBQUksQ0FBQzFELE9BQU8sQ0FBQ0MsV0FBVyxDQUNsQ0ssS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUNWc0QsR0FBRyxDQUFFdEIsQ0FBQyxJQUFLdUIsUUFBUSxDQUFDdkIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1VBQzlCLElBQUksQ0FBQyxDQUFDd0IsYUFBYSxDQUFDSCxNQUFNLEVBQUVELElBQUksQ0FBQztRQUNuQztNQUNGLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQztFQUNKO0VBRUEsQ0FBQ0ksYUFBYVUsQ0FBQ2IsTUFBTSxFQUFFcEYsUUFBUSxFQUFFO0lBQy9CLElBQUlrRyxZQUFZLEdBQUcsSUFBSSxDQUFDL0IsRUFBRSxDQUFDMEIsS0FBSyxDQUFDNUMsYUFBYSxDQUFDbUMsTUFBTSxDQUFDO0lBQ3RELElBQUljLFlBQVksRUFBRTtNQUNoQjtNQUNBLElBQUksQ0FBQzNCLElBQUksQ0FBQ3hFLEdBQUcsQ0FBQ0MsUUFBUSxDQUFDO01BQ3ZCLElBQUksQ0FBQ3NFLEtBQUssRUFBRTtNQUNaO01BQ0EsSUFBSTRCLFlBQVksQ0FBQzNDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQ0gsUUFBUSxDQUFDLENBQUMsRUFBRTtRQUM5QyxJQUFJLENBQUNtQixJQUFJLENBQUM1RCxrQkFBa0IsQ0FBQ3VGLFlBQVksQ0FBQztNQUM1QztJQUNGLENBQUMsTUFBTTtNQUNMO01BQ0EsSUFBSSxDQUFDM0IsSUFBSSxDQUFDckUsSUFBSSxDQUFDRixRQUFRLENBQUM7TUFDeEIsSUFBSSxDQUFDc0UsS0FBSyxFQUFFO0lBQ2Q7RUFDRjtFQUVBLENBQUNHLE9BQU8wQixDQUFBLEVBQUc7SUFDVCxNQUFNMUgsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNqQ0EsU0FBUyxDQUFDNkUsT0FBTyxDQUFFbkQsSUFBSSxJQUFLO01BQzFCLElBQUl1QixXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUMwRSxlQUFlLENBQUNqRyxJQUFJLENBQUM7TUFFN0MsT0FBTyxDQUFDdUIsV0FBVyxFQUFFO1FBQ25CQSxXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUMwRSxlQUFlLENBQUNqRyxJQUFJLENBQUM7TUFDM0M7O01BRUE7TUFDQXVCLFdBQVcsQ0FBQzRCLE9BQU8sQ0FBRUssS0FBSyxJQUFLO1FBQzdCLElBQUksQ0FBQ1ksSUFBSSxDQUFDcEUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDMkYsWUFBWSxDQUFDbkMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO01BQ2pELENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQztFQUNKO0VBRUEsQ0FBQ3lDLGVBQWVDLENBQUNsRyxJQUFJLEVBQUU7SUFDckIsSUFBSXFDLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQzhELFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsWUFBWSxHQUFHLFVBQVU7SUFDdEUsSUFBSTNDLEtBQUssR0FDUG5CLFdBQVcsS0FBSyxZQUFZLEdBQ3hCLENBQUMsSUFBSSxDQUFDLENBQUM4RCxTQUFTLENBQUMsRUFBRSxHQUFHbkcsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUNtRyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsR0FDakQsQ0FBQyxJQUFJLENBQUMsQ0FBQ0EsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDQSxTQUFTLENBQUMsRUFBRSxHQUFHbkcsSUFBSSxDQUFDLENBQUM7SUFDdkQsSUFBSXVCLFdBQVcsR0FBRyxJQUFJLENBQUN5QyxFQUFFLENBQUMwQixLQUFLLENBQUN4RCxTQUFTLENBQUNsQyxJQUFJLEVBQUV3RCxLQUFLLEVBQUVuQixXQUFXLENBQUM7SUFDbkUsT0FBT2QsV0FBVztFQUNwQjtFQUVBLENBQUNvRCxRQUFReUIsQ0FBQSxFQUFHO0lBQ1YsSUFBSSxJQUFJLENBQUNsQyxhQUFhLEtBQUssSUFBSSxDQUFDRixFQUFFLElBQUksSUFBSSxDQUFDRyxLQUFLLEVBQUU7TUFDaEQsSUFBSVgsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDNkMsZUFBZSxDQUFDLENBQUM7TUFDbkMsSUFBSXhHLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQzhGLFlBQVksQ0FBQ25DLEtBQUssRUFBRSxPQUFPLENBQUM7TUFDakQsSUFBSXVDLFlBQVksR0FBRyxJQUFJLENBQUNoQyxLQUFLLENBQUMyQixLQUFLLENBQUM1QyxhQUFhLENBQUNVLEtBQUssQ0FBQztNQUN4RCxJQUFJdUMsWUFBWSxFQUFFO1FBQ2hCO1FBQ0EsSUFBSSxDQUFDM0IsSUFBSSxDQUFDeEUsR0FBRyxDQUFDQyxRQUFRLENBQUM7UUFDdkIsSUFBSSxDQUFDc0UsS0FBSyxFQUFFO1FBQ1o7UUFDQSxJQUFJNEIsWUFBWSxDQUFDM0MsTUFBTSxDQUFDLENBQUMsRUFBRTtVQUN6QixJQUFJLENBQUNnQixJQUFJLENBQUM1RCxrQkFBa0IsQ0FBQ3VGLFlBQVksQ0FBQztRQUM1QztNQUNGLENBQUMsTUFBTTtRQUNMO1FBQ0EsSUFBSSxDQUFDM0IsSUFBSSxDQUFDckUsSUFBSSxDQUFDRixRQUFRLENBQUM7UUFDeEIsSUFBSSxDQUFDc0UsS0FBSyxFQUFFO01BQ2Q7SUFDRjtFQUNGO0VBRUEsQ0FBQ2tDLGVBQWVDLENBQUEsRUFBRztJQUNqQixJQUFJOUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMyQyxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUNBLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN0RDtJQUNBLElBQUksQ0FBQ3BDLEtBQUssQ0FBQzJCLEtBQUssQ0FBQ3pELFFBQVEsQ0FBQ2tCLE9BQU8sQ0FBQ29ELElBQUksSUFBSTtNQUN4QyxJQUFJQSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUsvQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUkrQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUsvQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDaEQsT0FBTyxJQUFJLENBQUMsQ0FBQzZDLGVBQWUsQ0FBQyxDQUFDO01BQ2hDO0lBQ0YsQ0FBQyxDQUFDO0lBQ0YsT0FBTzdDLEtBQUs7RUFDZDtFQUVBLENBQUMyQyxTQUFTSyxDQUFDQyxHQUFHLEVBQUU7SUFDZCxPQUFPQyxJQUFJLENBQUNDLEtBQUssQ0FBQ0QsSUFBSSxDQUFDRSxNQUFNLENBQUMsQ0FBQyxHQUFHSCxHQUFHLENBQUM7RUFDeEM7RUFFQSxDQUFDZCxZQUFZa0IsQ0FBQ3JELEtBQUssRUFBRXJDLE1BQU0sRUFBRTtJQUMzQixNQUFNbUUsU0FBUyxHQUFHOUcsUUFBUSxDQUFDdUcsZ0JBQWdCLENBQUUsY0FBYTVELE1BQU8sRUFBQyxDQUFDO0lBQ25FLElBQUkyRixTQUFTLEdBQUcsS0FBSztJQUNyQnhCLFNBQVMsQ0FBQ25DLE9BQU8sQ0FBRXRELFFBQVEsSUFBSztNQUM5QixJQUFJQSxRQUFRLENBQUN5QixPQUFPLENBQUNDLFdBQVcsS0FBS2lDLEtBQUssQ0FBQzdCLFFBQVEsQ0FBQyxDQUFDLEVBQUU7UUFDckRtRixTQUFTLEdBQUdqSCxRQUFRO01BQ3RCO0lBQ0YsQ0FBQyxDQUFDO0lBQ0YsT0FBT2lILFNBQVM7RUFDbEI7RUFFQSxDQUFDN0QsUUFBUThELENBQUEsRUFBRztJQUNWO0lBQ0EsSUFBSSxJQUFJLENBQUNoRCxLQUFLLENBQUMyQixLQUFLLENBQUN6QyxRQUFRLENBQUMsQ0FBQyxFQUFFO01BQy9CLE9BQU8sSUFBSSxDQUFDZSxFQUFFO01BQ2hCO0lBQ0EsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDQSxFQUFFLENBQUMwQixLQUFLLENBQUN6QyxRQUFRLENBQUMsQ0FBQyxFQUFFO01BQ25DLE9BQU8sSUFBSSxDQUFDYyxLQUFLO01BQ25CO0lBQ0EsQ0FBQyxNQUFNO01BQ0wsT0FBTyxLQUFLO0lBQ2Q7RUFDRjtBQUNGOzs7Ozs7Ozs7Ozs7Ozs7QUNqTm9DO0FBRXJCLE1BQU1GLE1BQU0sQ0FBQztFQUMxQjFGLFdBQVdBLENBQUEsRUFBYTtJQUFBLElBQVo0RixLQUFLLEdBQUF6QixTQUFBLENBQUFDLE1BQUEsUUFBQUQsU0FBQSxRQUFBRSxTQUFBLEdBQUFGLFNBQUEsTUFBQyxJQUFJO0lBQ3BCLElBQUksQ0FBQ29ELEtBQUssR0FBRyxJQUFJNUQsa0RBQVMsQ0FBRCxDQUFDO0lBQzFCLElBQUksQ0FBQ2tGLE9BQU8sR0FBR2pELEtBQUs7SUFDcEIsSUFBSSxDQUFDa0QsYUFBYSxHQUFHLEVBQUU7RUFDekI7RUFFQUMsTUFBTUEsQ0FBQy9GLE1BQU0sRUFBRTRCLFVBQVUsRUFBRTtJQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDaUUsT0FBTyxFQUFFO01BQ2pCakUsVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDNEIsUUFBUSxDQUFDeEQsTUFBTSxDQUFDdUUsS0FBSyxDQUFDO0lBQzNDO0lBRUEsSUFBSSxDQUFDdUIsYUFBYSxDQUFDcEUsSUFBSSxDQUFDRSxVQUFVLENBQUM7SUFDbkM1QixNQUFNLENBQUN1RSxLQUFLLENBQUM1QyxhQUFhLENBQUNDLFVBQVUsQ0FBQztFQUN4QztFQUVBLENBQUM0QixRQUFReUIsQ0FBQ1YsS0FBSyxFQUFFO0lBQ2YsSUFBSTNDLFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBQ29FLFdBQVcsQ0FBQyxDQUFDO0lBQ3BDLElBQUksSUFBSSxDQUFDRixhQUFhLENBQUNHLFFBQVEsQ0FBQ3JFLFVBQVUsQ0FBQyxFQUFFO01BQzNDLElBQUksQ0FBQyxDQUFDNEIsUUFBUSxDQUFDZSxLQUFLLENBQUM7SUFDdkIsQ0FBQyxNQUFNO01BQ0wsT0FBTzNDLFVBQVU7SUFDbkI7RUFDRjs7RUFFQTtFQUNBLENBQUNvRSxXQUFXRSxDQUFBLEVBQUc7SUFDYixPQUFPLENBQUNYLElBQUksQ0FBQ0MsS0FBSyxDQUFDRCxJQUFJLENBQUNFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUVGLElBQUksQ0FBQ0MsS0FBSyxDQUFDRCxJQUFJLENBQUNFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7RUFDekU7QUFDRjs7Ozs7Ozs7Ozs7Ozs7QUMvQmUsTUFBTS9FLElBQUksQ0FBQztFQUN4QjFELFdBQVdBLENBQUNnRSxJQUFJLEVBQUU7SUFDaEIsTUFBTW1GLFNBQVMsR0FBRztNQUFDLENBQUMsRUFBRyxTQUFTO01BQUUsQ0FBQyxFQUFHLFlBQVk7TUFBRSxDQUFDLEVBQUcsV0FBVztNQUFFLENBQUMsRUFBRyxXQUFXO01BQUUsQ0FBQyxFQUFHO0lBQWEsQ0FBQztJQUN4RyxJQUFJLENBQUMvRSxNQUFNLEdBQUdKLElBQUk7SUFDbEIsSUFBSSxDQUFDekIsUUFBUSxHQUFHNEcsU0FBUyxDQUFDbkYsSUFBSSxDQUFDO0lBQy9CLElBQUksQ0FBQ29GLElBQUksR0FBRyxDQUFDO0lBQ2IsSUFBSSxDQUFDQyxJQUFJLEdBQUcsS0FBSztFQUNuQjtFQUVBNUgsR0FBR0EsQ0FBQSxFQUFHO0lBQ0osSUFBSSxDQUFDMkgsSUFBSSxFQUFFO0lBQ1gsSUFBSSxDQUFDbkUsTUFBTSxDQUFDLENBQUM7RUFDZjtFQUVBQSxNQUFNQSxDQUFBLEVBQUc7SUFDUCxJQUFJLElBQUksQ0FBQ21FLElBQUksS0FBSyxJQUFJLENBQUNoRixNQUFNLEVBQUU7TUFDN0IsSUFBSSxDQUFDaUYsSUFBSSxHQUFHLElBQUk7SUFDbEI7SUFDQSxPQUFPLElBQUksQ0FBQ0EsSUFBSTtFQUNsQjtBQUNGOzs7Ozs7VUNwQkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05rQztBQUVsQyxNQUFNQyxJQUFJLEdBQUcsSUFBSTNELGlEQUFRLENBQUMsQ0FBQztBQUMzQjJELElBQUksQ0FBQ3BELEtBQUssQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RvbUJ1aWxkZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lbG9vcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3BsYXllcnMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgRE9NYnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGNvbnN0IHNoaXBzID0geydDYXJyaWVyJzogNSwgJ0JhdHRsZXNoaXAnOiA0LCAnRGVzdHJveWVyJzogMywgJ1N1Ym1hcmluZSc6IDMsICdQYXRyb2wgQm9hdCc6IDJ9XG4gICAgdGhpcy5zaGlwTmFtZXMgPSBbJ0NhcnJpZXInLCAnQmF0dGxlc2hpcCcsICdEZXN0cm95ZXInLCAnU3VibWFyaW5lJywgJ1BhdHJvbCBCb2F0J107XG4gICAgdGhpcy5zaGlwU2l6ZXMgPSBbNSwgNCwgMywgMywgMl07XG5cbiAgICB0aGlzLmdhbWVDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZS1jb250YWluZXInKTtcbiAgICAvLyBjcmVhdGUgY29udGFpbmVycyBmb3IgZWxlbWVudHM6XG4gICAgICAvLyAyIHBsYXllciBjb250YWluZXJzXG4gICAgdGhpcy5wbGF5ZXJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmFpQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5nbG9iYWxNc2cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmdsb2JhbE1zZy5pZCA9ICdnbG9iYWwtbXNnJztcbiAgICB0aGlzLnBsYXllckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItY29udGFpbmVyJyk7XG4gICAgdGhpcy5haUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItY29udGFpbmVyJyk7XG4gICAgICAvLyBlYWNoIGNvbnRhaW5lciBjb250YWluczpcbiAgICAgICAgLy8gUGxheWVyIHRpdGxlXG4gICAgICAgIGNvbnN0IHBsYXllclRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKVxuICAgICAgICBwbGF5ZXJUaXRsZS50ZXh0Q29udGVudCA9ICdQbGF5ZXInO1xuXG4gICAgICAgIGNvbnN0IGFpVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICAgICAgICBhaVRpdGxlLnRleHRDb250ZW50ID0gJ0NvbXB1dGVyJztcblxuICAgICAgICAvLyBHYW1lIGJvYXJkIGdyaWQgKDEwIHggMTApXG4gICAgICAgIGNvbnN0IHBsYXllckdyaWQgPSB0aGlzLiNncmlkUG9wdWxhdGUoJ2h1bWFuJyk7XG4gICAgICAgIGNvbnN0IGFpR3JpZCA9IHRoaXMuI2dyaWRQb3B1bGF0ZSgnYWknKTtcblxuICAgICAgICB0aGlzLnBsYXllck1zZyA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICAgICAgdGhpcy51cGRhdGVQbGF5ZXJNc2coMCk7XG4gICAgICAgIHRoaXMucGxheWVyTXNnLmlkID0gJ3BsYXllck1zZyc7XG5cbiAgICAgICAgY29uc3Qgb3JpZW50YXRpb25CdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgb3JpZW50YXRpb25CdG4udGV4dENvbnRlbnQgPSAnaG9yaXpvbnRhbCc7XG4gICAgICAgIG9yaWVudGF0aW9uQnRuLmlkID0gJ29yaWVudGF0aW9uQnRuJztcblxuICAgICAgdGhpcy5wbGF5ZXJDb250YWluZXIuYXBwZW5kKHBsYXllclRpdGxlLCBwbGF5ZXJHcmlkLCB0aGlzLnBsYXllck1zZywgb3JpZW50YXRpb25CdG4pO1xuICAgICAgdGhpcy5haUNvbnRhaW5lci5hcHBlbmQoYWlUaXRsZSwgYWlHcmlkKTtcblxuICAgIHRoaXMuZ2FtZUNvbnRhaW5lci5hcHBlbmQodGhpcy5wbGF5ZXJDb250YWluZXIsIHRoaXMuYWlDb250YWluZXIsIHRoaXMuZ2xvYmFsTXNnKTtcbiAgfVxuXG4gIGhpdChncmlkSXRlbSkge1xuICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3NoaXAnKTtcbiAgICBncmlkSXRlbS5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgfTtcblxuICBtaXNzKGdyaWRJdGVtKSB7XG4gICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZCgnbWlzcycpO1xuICB9XG5cbiAgc2hpcChncmlkSXRlbSkge1xuICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5hZGQoJ3NoaXAnKTtcbiAgfTtcblxuICBoaWRlRWxlbWVudChlbGVtZW50KSB7XG4gICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICB9XG5cbiAgdXBkYXRlUGxheWVyTXNnKGNvdW50ZXIpIHtcbiAgICBsZXQgbXNnID0gdGhpcy5wbGF5ZXJNc2c7XG4gICAgaWYgKGNvdW50ZXIgPCA1KSB7XG4gICAgICBtc2cudGV4dENvbnRlbnQgPSBgQ2xpY2sgZ3JpZCB0byBwbGFjZSAke3RoaXMuc2hpcE5hbWVzW2NvdW50ZXJdfSAoc2l6ZTogJHt0aGlzLnNoaXBTaXplc1tjb3VudGVyXX0pYFxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLiNjbGVhck1zZyhtc2cpO1xuICAgIH1cbiAgfVxuXG4gIGRpc3BsYXlTdW5rTWVzc2FnZShzaGlwKSB7XG4gICAgY29uc3Qgc3Vua01zZyA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGAke3NoaXAuc2hpcFR5cGV9IGhhcyBiZWVuIHN1bmsuYClcbiAgICB0aGlzLmdsb2JhbE1zZy5hcHBlbmRDaGlsZChzdW5rTXNnKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuI2NsZWFyTXNnKHN1bmtNc2cpO1xuICAgIH0sIDMwMDApO1xuICB9XG5cbiAgZGlzcGxheVdpbm5lcih3aW5uZXIpIHtcbiAgICBjb25zdCB3aW5uZXJNc2cgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShgV2lubmVyOiAke3dpbm5lcn0hYCk7XG4gICAgdGhpcy5nbG9iYWxNc2cuYXBwZW5kQ2hpbGQod2lubmVyTXNnKTtcbiAgfVxuXG4gICNjbGVhck1zZyhtc2dFbGVtZW50KSB7XG4gICAgbXNnRWxlbWVudC5yZW1vdmUoKTtcbiAgfVxuXG4gICNncmlkUG9wdWxhdGUocGxheWVyKSB7XG4gICAgY29uc3QgZ3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGdyaWQuY2xhc3NMaXN0LmFkZCgnZ3JpZCcsIHBsYXllcik7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDsgaSsrKSB7XG4gICAgICBjb25zdCBncmlkSXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZCgnZ3JpZC1pdGVtJywgcGxheWVyKTtcbiAgICAgIGdyaWRJdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXMgPSB0aGlzLiNjb29yZHNQb3B1bGF0ZShpKTtcbiAgICAgIGdyaWQuYXBwZW5kQ2hpbGQoZ3JpZEl0ZW0pO1xuICAgIH1cbiAgICByZXR1cm4gZ3JpZDtcbiAgfVxuXG4gICNjb29yZHNQb3B1bGF0ZShpKSB7XG4gICAgaWYgKGkgPCAxMCkge1xuICAgICAgcmV0dXJuIFtpLCAwXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGRpZ2l0cyA9IGkudG9TdHJpbmcoKS5zcGxpdCgnJyk7XG4gICAgICByZXR1cm4gW2RpZ2l0c1sxXSwgZGlnaXRzWzBdXTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBTaGlwIGZyb20gJy4vc2hpcHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lYm9hcmQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFsbFNoaXBzID0gW107XG4gICAgdGhpcy5taXNzZWRTaG90cyA9IFtdO1xuICAgIHRoaXMuYWxsU2hvdHMgPSBbXTtcbiAgfTtcblxuICBwbGFjZVNoaXAoc2l6ZSwgZmlyc3RDb29yZCwgb3JpZW50YXRpb249J2hvcml6b250YWwnKSB7XG4gICAgY29uc3QgY29vcmRpbmF0ZXMgPSB0aGlzLiNidWlsZENvb3JkaW5hdGVzKHNpemUsIGZpcnN0Q29vcmQsIG9yaWVudGF0aW9uKTtcbiAgICBpZiAodGhpcy4jdmFsaWRhdGVDb29yZGluYXRlcyhjb29yZGluYXRlcykpIHtcbiAgICAgIGNvbnN0IG5ld1NoaXAgPSBuZXcgU2hpcChzaXplKTtcbiAgICAgIGNvbnN0IHNoaXBFbnRyeSA9IFtuZXdTaGlwLCBjb29yZGluYXRlc107XG4gICAgICB0aGlzLmFsbFNoaXBzLnB1c2goc2hpcEVudHJ5KTtcbiAgICAgIHJldHVybiBjb29yZGluYXRlcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8vIHJlY2VpdmVBdHRhY2sgZnVuY3Rpb24gdGFrZXMgY29vcmRpbmF0ZXMsIGRldGVybWluZXMgd2hldGhlciBvciBub3QgdGhlIGF0dGFjayBoaXQgYSBzaGlwXG4gIC8vIHRoZW4gc2VuZHMgdGhlIOKAmGhpdOKAmSBmdW5jdGlvbiB0byB0aGUgY29ycmVjdCBzaGlwLCBvciByZWNvcmRzIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgbWlzc2VkIHNob3QuXG4gIHJlY2VpdmVBdHRhY2soY29vcmRpbmF0ZSkge1xuICAgIHRoaXMuYWxsU2hvdHMucHVzaChjb29yZGluYXRlKTtcbiAgICBjb25zdCBzaGlwID0gdGhpcy4jZmluZFNoaXAoY29vcmRpbmF0ZSk7XG4gICAgaWYgKHNoaXApIHtcbiAgICAgIHNoaXAuaGl0KCk7XG4gICAgICByZXR1cm4gc2hpcDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5taXNzZWRTaG90cy5wdXNoKGNvb3JkaW5hdGUpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGdhbWVPdmVyKCkge1xuICAgIGxldCBhbGxTdW5rID0gdHJ1ZTtcbiAgICAvLyBJZiBzaGlwcyBoYXZlbid0IHlldCBiZWVuIHBsYWNlZCwgcmV0dXJuIGZhbHNlLlxuICAgIGlmICh0aGlzLmFsbFNoaXBzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLmFsbFNoaXBzLmZvckVhY2goc2hpcCA9PiB7XG4gICAgICBpZiAoIXNoaXBbMF0uaXNTdW5rKCkpIHtcbiAgICAgICAgYWxsU3VuayA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGFsbFN1bms7XG4gIH1cblxuICAjYnVpbGRDb29yZGluYXRlcyhzaXplLCBmaXJzdENvb3JkLCBvcmllbnRhdGlvbikge1xuICAgIGxldCBjb29yZGluYXRlcyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBpZiAob3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICBjb29yZGluYXRlcy5wdXNoKFtmaXJzdENvb3JkWzBdICsgaSwgZmlyc3RDb29yZFsxXV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29vcmRpbmF0ZXMucHVzaChbZmlyc3RDb29yZFswXSwgZmlyc3RDb29yZFsxXSArIGldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xuICB9XG5cbiAgI3ZhbGlkYXRlQ29vcmRpbmF0ZXMoY29vcmRpbmF0ZXMpIHtcbiAgICBsZXQgdmFsaWRDb29yZHMgPSB0cnVlO1xuICAgIGNvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkKSA9PiB7XG4gICAgICAvLyBJZiBhIHNoaXAgYWxyZWFkeSBleGlzdHMgYXQgbG9jYXRpb24sIHJlamVjdCBpdC5cbiAgICAgIGlmICh0aGlzLiNmaW5kU2hpcChjb29yZCkgfHwgY29vcmQgPiA5KSB7XG4gICAgICAgIHZhbGlkQ29vcmRzID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gdmFsaWRDb29yZHM7XG4gIH1cblxuICAjZmluZFNoaXAoY29vcmRpbmF0ZSkge1xuICAgIGxldCBmb3VuZFNoaXAgPSBmYWxzZTtcbiAgICB0aGlzLmFsbFNoaXBzLmZvckVhY2goc2hpcCA9PiB7XG4gICAgICBpZiAoc2hpcFsxXS5zb21lKCh4KSA9PiB4WzBdID09PSBjb29yZGluYXRlWzBdICYmIHhbMV0gPT09IGNvb3JkaW5hdGVbMV0pKSB7XG4gICAgICAgIGZvdW5kU2hpcCA9IHNoaXBbMF07XG4gICAgfX0pXG4gICAgcmV0dXJuIGZvdW5kU2hpcDtcbiAgfVxufVxuIiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi9wbGF5ZXJzXCI7XG5pbXBvcnQgRE9NYnVpbGRlciBmcm9tIFwiLi9kb21CdWlsZGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVsb29wIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5odW1hbiA9IG5ldyBQbGF5ZXIodHJ1ZSk7XG4gICAgdGhpcy5haSA9IG5ldyBQbGF5ZXIoZmFsc2UpO1xuICAgIHRoaXMucGxheWVycyA9IFt0aGlzLmh1bWFuLCB0aGlzLmFpXTtcbiAgICB0aGlzLmN1cnJlbnRQbGF5ZXIgPSB0aGlzLmFpO1xuICAgIHRoaXMucm91bmQgPSBudWxsO1xuICAgIHRoaXMucGFnZSA9IG5ldyBET01idWlsZGVyKCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLiNhaVNoaXBzKCk7XG4gICAgdGhpcy5haUdyaWRMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLmh1bWFuR3JpZExpc3RlbmVycygpO1xuXG4gICAgbGV0IGN1cnJlbnRSb3VuZCA9IHRoaXMucm91bmQ7XG5cbiAgICBjb25zdCBwbGF5Um91bmQgPSAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuI2dhbWVPdmVyKCkpIHtcbiAgICAgICAgdGhpcy4jYWlBdHRhY2soKTtcbiAgICAgICAgaWYgKGN1cnJlbnRSb3VuZCAhPT0gdGhpcy5yb3VuZCkge1xuICAgICAgICAgIHRoaXMuY3VycmVudFBsYXllciA9IHRoaXMuY3VycmVudFBsYXllciA9PT0gdGhpcy5odW1hbiA/IHRoaXMuYWkgOiB0aGlzLmh1bWFuO1xuICAgICAgICAgIGN1cnJlbnRSb3VuZCA9IHRoaXMucm91bmQ7XG4gICAgICAgIH1cbiAgICAgICAgc2V0VGltZW91dChwbGF5Um91bmQsIDApOyAvLyBTY2hlZHVsZSB0aGUgbmV4dCByb3VuZCBhZnRlciBhIHZlcnkgc2hvcnQgZGVsYXlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuI2VuZEdhbWUoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGxheVJvdW5kKCk7XG4gIH1cblxuICAjZW5kR2FtZSgpIHtcbiAgICBjb25zdCB3aW5uZXIgPSB0aGlzLiNnYW1lT3ZlcigpID09PSB0aGlzLmh1bWFuID8gJ1lvdScgOiAnQ29tcHV0ZXInO1xuICAgIGNvbnN0IGFpR3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ncmlkLWl0ZW0uYWlcIik7XG4gICAgLy8gZGlzcGxheSB0aGUgd2lubmVyXG4gICAgdGhpcy5wYWdlLmRpc3BsYXlXaW5uZXIod2lubmVyKTtcbiAgICAvLyByZXZlYWwgYWxsIGJvYXJkc1xuICAgIGFpR3JpZEl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBsZXQgY29vcmRzID0gaXRlbS5kYXRhc2V0LmNvb3JkaW5hdGVzXG4gICAgICAuc3BsaXQoXCIsXCIpXG4gICAgICAubWFwKCh4KSA9PiBwYXJzZUludCh4LCAxMCkpO1xuICAgICAgdGhpcy4jYWlCb2FyZEF0dGFjayhjb29yZHMsIGl0ZW0pO1xuICAgIH0pXG4gIH1cblxuICBodW1hbkdyaWRMaXN0ZW5lcnMoKSB7XG4gICAgdGhpcy4jb3JpZW50YXRpb25CdG5MaXN0ZW5lcigpO1xuICAgIGNvbnN0IG9yaWVudGF0aW9uQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmllbnRhdGlvbkJ0blwiKTtcbiAgICBjb25zdCBncmlkSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdyaWQtaXRlbS5odW1hblwiKTtcbiAgICBsZXQgcGxhY2VtZW50Q291bnRlciA9IDA7XG4gICAgbGV0IHNoaXBTaXplID0gWzUsIDQsIDMsIDMsIDJdO1xuXG4gICAgZ3JpZEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgaWYgKHBsYWNlbWVudENvdW50ZXIgPj0gc2hpcFNpemUubGVuZ3RoIC0gMSAmJiAhdGhpcy5yb3VuZCkge1xuICAgICAgICAgIHRoaXMucGFnZS5oaWRlRWxlbWVudChvcmllbnRhdGlvbkJ0bik7XG4gICAgICAgICAgdGhpcy5yb3VuZCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb3JpZW50YXRpb24gPSBvcmllbnRhdGlvbkJ0bi50ZXh0Q29udGVudDtcbiAgICAgICAgbGV0IGNvb3JkcyA9IGl0ZW0uZGF0YXNldC5jb29yZGluYXRlc1xuICAgICAgICAgIC5zcGxpdChcIixcIilcbiAgICAgICAgICAubWFwKCh4KSA9PiBwYXJzZUludCh4LCAxMCkpO1xuICAgICAgICBsZXQgY29vcmRpbmF0ZXMgPSB0aGlzLmh1bWFuLmJvYXJkLnBsYWNlU2hpcChcbiAgICAgICAgICBzaGlwU2l6ZVtwbGFjZW1lbnRDb3VudGVyXSxcbiAgICAgICAgICBjb29yZHMsXG4gICAgICAgICAgb3JpZW50YXRpb25cbiAgICAgICAgKTtcbiAgICAgICAgLy8gU2hvdyBzaGlwIG9uIHNjcmVlbi5cbiAgICAgICAgY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmQpID0+IHtcbiAgICAgICAgICB0aGlzLnBhZ2Uuc2hpcCh0aGlzLiNmaW5kR3JpZEl0ZW0oY29vcmQsIFwiaHVtYW5cIikpO1xuICAgICAgICB9KTtcbiAgICAgICAgcGxhY2VtZW50Q291bnRlcisrO1xuICAgICAgICB0aGlzLnBhZ2UudXBkYXRlUGxheWVyTXNnKHBsYWNlbWVudENvdW50ZXIpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAjb3JpZW50YXRpb25CdG5MaXN0ZW5lcigpIHtcbiAgICBjb25zdCBvcmllbnRhdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JpZW50YXRpb25CdG5cIik7XG4gICAgb3JpZW50YXRpb24uZGlzcGxheSA9IFwiYmxvY2tcIjtcblxuICAgIG9yaWVudGF0aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICBsZXQgdGV4dCA9IG9yaWVudGF0aW9uLnRleHRDb250ZW50O1xuICAgICAgb3JpZW50YXRpb24udGV4dENvbnRlbnQgPVxuICAgICAgICB0ZXh0ID09PSBcImhvcml6b250YWxcIiA/IFwidmVydGljYWxcIiA6IFwiaG9yaXpvbnRhbFwiO1xuICAgIH0pO1xuICB9XG5cbiAgYWlHcmlkTGlzdGVuZXJzKCkge1xuICAgIGNvbnN0IGdyaWRJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ3JpZC1pdGVtLmFpXCIpO1xuICAgIGdyaWRJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQbGF5ZXIgPT09IHRoaXMuaHVtYW4pIHtcbiAgICAgICAgICBsZXQgY29vcmRzID0gaXRlbS5kYXRhc2V0LmNvb3JkaW5hdGVzXG4gICAgICAgICAgICAuc3BsaXQoXCIsXCIpXG4gICAgICAgICAgICAubWFwKCh4KSA9PiBwYXJzZUludCh4LCAxMCkpO1xuICAgICAgICAgIHRoaXMuI2FpQm9hcmRBdHRhY2soY29vcmRzLCBpdGVtKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAjYWlCb2FyZEF0dGFjayhjb29yZHMsIGdyaWRJdGVtKSB7XG4gICAgbGV0IGF0dGFja2VkU2hpcCA9IHRoaXMuYWkuYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZHMpXG4gICAgaWYgKGF0dGFja2VkU2hpcCkge1xuICAgICAgLy8gaWYgYSBzaGlwIGlzIGhpdCwgbWFyayBzcXVhcmUgYXMgcmVkLlxuICAgICAgdGhpcy5wYWdlLmhpdChncmlkSXRlbSk7XG4gICAgICB0aGlzLnJvdW5kKys7XG4gICAgICAvLyBpZiBzaGlwIGlzIHN1bmssIGRpc3BsYXkgZ2xvYmFsIG1lc3NhZ2UuXG4gICAgICBpZiAoYXR0YWNrZWRTaGlwLmlzU3VuaygpICYmICF0aGlzLiNnYW1lT3ZlcigpKSB7XG4gICAgICAgIHRoaXMucGFnZS5kaXNwbGF5U3Vua01lc3NhZ2UoYXR0YWNrZWRTaGlwKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaWYgYSBzaGlwIGlzIG5vdCBoaXQsIG1hcmsgc3F1YXJlIGFzIGJsdWUuXG4gICAgICB0aGlzLnBhZ2UubWlzcyhncmlkSXRlbSk7XG4gICAgICB0aGlzLnJvdW5kKys7XG4gICAgfVxuICB9XG5cbiAgI2FpU2hpcHMoKSB7XG4gICAgY29uc3Qgc2hpcFNpemVzID0gWzUsIDQsIDMsIDMsIDJdO1xuICAgIHNoaXBTaXplcy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBsZXQgY29vcmRpbmF0ZXMgPSB0aGlzLiNhaVNoaXBQbGFjZW1lbnQoc2hpcCk7XG5cbiAgICAgIHdoaWxlICghY29vcmRpbmF0ZXMpIHtcbiAgICAgICAgY29vcmRpbmF0ZXMgPSB0aGlzLiNhaVNoaXBQbGFjZW1lbnQoc2hpcCk7XG4gICAgICB9XG5cbiAgICAgIC8vIHNob3cgYWkgc2hpcHMgd2hpbGUgdGVzdGluZy5cbiAgICAgIGNvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkKSA9PiB7XG4gICAgICAgIHRoaXMucGFnZS5zaGlwKHRoaXMuI2ZpbmRHcmlkSXRlbShjb29yZCwgXCJhaVwiKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gICNhaVNoaXBQbGFjZW1lbnQoc2hpcCkge1xuICAgIGxldCBvcmllbnRhdGlvbiA9IHRoaXMuI3JhbmRvbU51bSgyKSA9PT0gMCA/IFwiaG9yaXpvbnRhbFwiIDogXCJ2ZXJ0aWNhbFwiO1xuICAgIGxldCBjb29yZCA9XG4gICAgICBvcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCJcbiAgICAgICAgPyBbdGhpcy4jcmFuZG9tTnVtKDEwIC0gc2hpcCksIHRoaXMuI3JhbmRvbU51bSgxMCldXG4gICAgICAgIDogW3RoaXMuI3JhbmRvbU51bSgxMCksIHRoaXMuI3JhbmRvbU51bSgxMCAtIHNoaXApXTtcbiAgICBsZXQgY29vcmRpbmF0ZXMgPSB0aGlzLmFpLmJvYXJkLnBsYWNlU2hpcChzaGlwLCBjb29yZCwgb3JpZW50YXRpb24pO1xuICAgIHJldHVybiBjb29yZGluYXRlcztcbiAgfVxuXG4gICNhaUF0dGFjaygpIHtcbiAgICBpZiAodGhpcy5jdXJyZW50UGxheWVyID09PSB0aGlzLmFpICYmIHRoaXMucm91bmQpIHtcbiAgICAgIGxldCBjb29yZCA9IHRoaXMuI2FpQ29vcmRTZWxlY3RvcigpO1xuICAgICAgbGV0IGdyaWRJdGVtID0gdGhpcy4jZmluZEdyaWRJdGVtKGNvb3JkLCAnaHVtYW4nKTtcbiAgICAgIGxldCBhdHRhY2tlZFNoaXAgPSB0aGlzLmh1bWFuLmJvYXJkLnJlY2VpdmVBdHRhY2soY29vcmQpXG4gICAgICBpZiAoYXR0YWNrZWRTaGlwKSB7XG4gICAgICAgIC8vIGlmIGEgc2hpcCBpcyBoaXQsIG1hcmsgc3F1YXJlIGFzIHJlZC5cbiAgICAgICAgdGhpcy5wYWdlLmhpdChncmlkSXRlbSk7XG4gICAgICAgIHRoaXMucm91bmQrKztcbiAgICAgICAgLy8gaWYgc2hpcCBpcyBzdW5rLCBkaXNwbGF5IGdsb2JhbCBtZXNzYWdlLlxuICAgICAgICBpZiAoYXR0YWNrZWRTaGlwLmlzU3VuaygpKSB7XG4gICAgICAgICAgdGhpcy5wYWdlLmRpc3BsYXlTdW5rTWVzc2FnZShhdHRhY2tlZFNoaXApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpZiBhIHNoaXAgaXMgbm90IGhpdCwgbWFyayBzcXVhcmUgYXMgYmx1ZS5cbiAgICAgICAgdGhpcy5wYWdlLm1pc3MoZ3JpZEl0ZW0pO1xuICAgICAgICB0aGlzLnJvdW5kKys7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgI2FpQ29vcmRTZWxlY3RvcigpIHtcbiAgICBsZXQgY29vcmQgPSBbdGhpcy4jcmFuZG9tTnVtKDEwKSwgdGhpcy4jcmFuZG9tTnVtKDEwKV07XG4gICAgLy8gQ2hlY2sgaWYgY29vcmQgaGFzIGFscmVhZHkgYmVlbiB1c2VkLCBpZiBzbyByZXJ1biBmdW5jdGlvbi5cbiAgICB0aGlzLmh1bWFuLmJvYXJkLmFsbFNob3RzLmZvckVhY2goc2hvdCA9PiB7XG4gICAgICBpZiAoc2hvdFswXSA9PT0gY29vcmRbMF0gJiYgc2hvdFsxXSA9PT0gY29vcmRbMV0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2FpQ29vcmRTZWxlY3RvcigpO1xuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGNvb3JkO1xuICB9XG5cbiAgI3JhbmRvbU51bShtYXgpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWF4KTtcbiAgfVxuXG4gICNmaW5kR3JpZEl0ZW0oY29vcmQsIHBsYXllcikge1xuICAgIGNvbnN0IGdyaWRJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5ncmlkLWl0ZW0uJHtwbGF5ZXJ9YCk7XG4gICAgbGV0IGZvdW5kSXRlbSA9IGZhbHNlO1xuICAgIGdyaWRJdGVtcy5mb3JFYWNoKChncmlkSXRlbSkgPT4ge1xuICAgICAgaWYgKGdyaWRJdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXMgPT09IGNvb3JkLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgZm91bmRJdGVtID0gZ3JpZEl0ZW07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGZvdW5kSXRlbTtcbiAgfVxuXG4gICNnYW1lT3ZlcigpIHtcbiAgICAvLyBBSSB3aW5zIGlmIGh1bWFuIGJvYXJkIGlzIGdhbWUgb3Zlci5cbiAgICBpZiAodGhpcy5odW1hbi5ib2FyZC5nYW1lT3ZlcigpKSB7XG4gICAgICByZXR1cm4gdGhpcy5haTtcbiAgICAvLyBIdW1hbiB3aW5zIGlmIGFpIGJvYXJkIGlzIGdhbWUgb3Zlci5cbiAgICB9IGVsc2UgaWYgKHRoaXMuYWkuYm9hcmQuZ2FtZU92ZXIoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuaHVtYW47XG4gICAgLy8gRWxzZSBnYW1lIGNvbnRpbnVlcy5cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IEdhbWVib2FyZCBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IoaHVtYW49dHJ1ZSkge1xuICAgIHRoaXMuYm9hcmQgPSBuZXcgR2FtZWJvYXJkO1xuICAgIHRoaXMuaXNIdW1hbiA9IGh1bWFuO1xuICAgIHRoaXMucHJldmlvdXNQbGF5cyA9IFtdO1xuICB9O1xuXG4gIGF0dGFjayhwbGF5ZXIsIGNvb3JkaW5hdGUpIHtcbiAgICBpZiAoIXRoaXMuaXNIdW1hbikge1xuICAgICAgY29vcmRpbmF0ZSA9IHRoaXMuI2FpQXR0YWNrKHBsYXllci5ib2FyZCk7XG4gICAgfVxuXG4gICAgdGhpcy5wcmV2aW91c1BsYXlzLnB1c2goY29vcmRpbmF0ZSk7XG4gICAgcGxheWVyLmJvYXJkLnJlY2VpdmVBdHRhY2soY29vcmRpbmF0ZSk7XG4gIH1cblxuICAjYWlBdHRhY2soYm9hcmQpIHtcbiAgICBsZXQgY29vcmRpbmF0ZSA9IHRoaXMuI3JhbmRvbUNvb3JkKCk7XG4gICAgaWYgKHRoaXMucHJldmlvdXNQbGF5cy5pbmNsdWRlcyhjb29yZGluYXRlKSkge1xuICAgICAgdGhpcy4jYWlBdHRhY2soYm9hcmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY29vcmRpbmF0ZTtcbiAgICB9XG4gIH1cblxuICAvLyBHZW5lcmF0ZSByYW5kb20gY29vcmRpbmF0ZXMgYmV0d2VlbiAwIC0gOS5cbiAgI3JhbmRvbUNvb3JkKCkge1xuICAgIHJldHVybiBbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApLCBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCldO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTaGlwIHtcbiAgY29uc3RydWN0b3Ioc2l6ZSkge1xuICAgIGNvbnN0IHNoaXBUeXBlcyA9IHs1IDogJ0NhcnJpZXInLCA0IDogJ0JhdHRsZXNoaXAnLCAzIDogJ0Rlc3Ryb3llcicsIDMgOiAnU3VibWFyaW5lJywgMiA6ICdQYXRyb2wgQm9hdCd9XG4gICAgdGhpcy5sZW5ndGggPSBzaXplO1xuICAgIHRoaXMuc2hpcFR5cGUgPSBzaGlwVHlwZXNbc2l6ZV07XG4gICAgdGhpcy5oaXRzID0gMDtcbiAgICB0aGlzLnN1bmsgPSBmYWxzZTtcbiAgfVxuXG4gIGhpdCgpIHtcbiAgICB0aGlzLmhpdHMrKztcbiAgICB0aGlzLmlzU3VuaygpO1xuICB9XG5cbiAgaXNTdW5rKCkge1xuICAgIGlmICh0aGlzLmhpdHMgPT09IHRoaXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLnN1bmsgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdW5rO1xuICB9XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBHYW1lbG9vcCBmcm9tIFwiLi9nYW1lbG9vcFwiO1xuXG5jb25zdCBnYW1lID0gbmV3IEdhbWVsb29wKCk7XG5nYW1lLnN0YXJ0KCk7XG4iXSwibmFtZXMiOlsiRE9NYnVpbGRlciIsImNvbnN0cnVjdG9yIiwic2hpcHMiLCJzaGlwTmFtZXMiLCJzaGlwU2l6ZXMiLCJnYW1lQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInBsYXllckNvbnRhaW5lciIsImNyZWF0ZUVsZW1lbnQiLCJhaUNvbnRhaW5lciIsImdsb2JhbE1zZyIsImlkIiwiY2xhc3NMaXN0IiwiYWRkIiwicGxheWVyVGl0bGUiLCJ0ZXh0Q29udGVudCIsImFpVGl0bGUiLCJwbGF5ZXJHcmlkIiwiZ3JpZFBvcHVsYXRlIiwiYWlHcmlkIiwicGxheWVyTXNnIiwiY3JlYXRlVGV4dE5vZGUiLCJ1cGRhdGVQbGF5ZXJNc2ciLCJvcmllbnRhdGlvbkJ0biIsImFwcGVuZCIsImhpdCIsImdyaWRJdGVtIiwicmVtb3ZlIiwibWlzcyIsInNoaXAiLCJoaWRlRWxlbWVudCIsImVsZW1lbnQiLCJzdHlsZSIsImRpc3BsYXkiLCJjb3VudGVyIiwibXNnIiwiY2xlYXJNc2ciLCJkaXNwbGF5U3Vua01lc3NhZ2UiLCJzdW5rTXNnIiwic2hpcFR5cGUiLCJhcHBlbmRDaGlsZCIsInNldFRpbWVvdXQiLCJkaXNwbGF5V2lubmVyIiwid2lubmVyIiwid2lubmVyTXNnIiwiI2NsZWFyTXNnIiwibXNnRWxlbWVudCIsIiNncmlkUG9wdWxhdGUiLCJwbGF5ZXIiLCJncmlkIiwiaSIsImRhdGFzZXQiLCJjb29yZGluYXRlcyIsImNvb3Jkc1BvcHVsYXRlIiwiI2Nvb3Jkc1BvcHVsYXRlIiwiZGlnaXRzIiwidG9TdHJpbmciLCJzcGxpdCIsIlNoaXAiLCJHYW1lYm9hcmQiLCJhbGxTaGlwcyIsIm1pc3NlZFNob3RzIiwiYWxsU2hvdHMiLCJwbGFjZVNoaXAiLCJzaXplIiwiZmlyc3RDb29yZCIsIm9yaWVudGF0aW9uIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwiYnVpbGRDb29yZGluYXRlcyIsInZhbGlkYXRlQ29vcmRpbmF0ZXMiLCJuZXdTaGlwIiwic2hpcEVudHJ5IiwicHVzaCIsInJlY2VpdmVBdHRhY2siLCJjb29yZGluYXRlIiwiZmluZFNoaXAiLCJnYW1lT3ZlciIsImFsbFN1bmsiLCJmb3JFYWNoIiwiaXNTdW5rIiwiI2J1aWxkQ29vcmRpbmF0ZXMiLCIjdmFsaWRhdGVDb29yZGluYXRlcyIsInZhbGlkQ29vcmRzIiwiY29vcmQiLCIjZmluZFNoaXAiLCJmb3VuZFNoaXAiLCJzb21lIiwieCIsIlBsYXllciIsIkdhbWVsb29wIiwiaHVtYW4iLCJhaSIsInBsYXllcnMiLCJjdXJyZW50UGxheWVyIiwicm91bmQiLCJwYWdlIiwic3RhcnQiLCJhaVNoaXBzIiwiYWlHcmlkTGlzdGVuZXJzIiwiaHVtYW5HcmlkTGlzdGVuZXJzIiwiY3VycmVudFJvdW5kIiwicGxheVJvdW5kIiwiYWlBdHRhY2siLCJlbmRHYW1lIiwiI2VuZEdhbWUiLCJhaUdyaWRJdGVtcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpdGVtIiwiY29vcmRzIiwibWFwIiwicGFyc2VJbnQiLCJhaUJvYXJkQXR0YWNrIiwib3JpZW50YXRpb25CdG5MaXN0ZW5lciIsImdyaWRJdGVtcyIsInBsYWNlbWVudENvdW50ZXIiLCJzaGlwU2l6ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJib2FyZCIsImZpbmRHcmlkSXRlbSIsIiNvcmllbnRhdGlvbkJ0bkxpc3RlbmVyIiwidGV4dCIsIiNhaUJvYXJkQXR0YWNrIiwiYXR0YWNrZWRTaGlwIiwiI2FpU2hpcHMiLCJhaVNoaXBQbGFjZW1lbnQiLCIjYWlTaGlwUGxhY2VtZW50IiwicmFuZG9tTnVtIiwiI2FpQXR0YWNrIiwiYWlDb29yZFNlbGVjdG9yIiwiI2FpQ29vcmRTZWxlY3RvciIsInNob3QiLCIjcmFuZG9tTnVtIiwibWF4IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiI2ZpbmRHcmlkSXRlbSIsImZvdW5kSXRlbSIsIiNnYW1lT3ZlciIsImlzSHVtYW4iLCJwcmV2aW91c1BsYXlzIiwiYXR0YWNrIiwicmFuZG9tQ29vcmQiLCJpbmNsdWRlcyIsIiNyYW5kb21Db29yZCIsInNoaXBUeXBlcyIsImhpdHMiLCJzdW5rIiwiZ2FtZSJdLCJzb3VyY2VSb290IjoiIn0=