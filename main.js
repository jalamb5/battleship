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

  // start() {
  //   this.#aiShips();
  //   this.aiGridListeners();
  //   this.humanGridListeners();
  //   let currentRound = this.round;

  //   while (!this.#gameOver()) {
  //     if (currentRound !== this.round) {
  //       this.currentPlayer = this.currentPlayer === this.human ? this.ai : this.human;
  //       currentRound = this.round;
  //     }
  //   }
  // }

  start() {
    this.#aiShips();
    this.aiGridListeners();
    this.humanGridListeners();
    // this.#playRound(this.round);
    let currentRound = this.round;

    // console.log(this.currentPlayer === this.human);
    const playRound = () => {
      if (!this.#gameOver()) {
        if (currentRound !== this.round) {
          this.currentPlayer = this.currentPlayer === this.human ? this.ai : this.human;
          currentRound = this.round;
        }
        setTimeout(playRound, 0); // Schedule the next round after a very short delay
      }
    };

    playRound(); // Start the first round
  }

  #playRound(currentRound) {
    if (!this.#gameOver()) {
      if (currentRound !== this.round) {
        this.currentPlayer = this.currentPlayer === this.human ? this.ai : this.human;
        currentRound = this.round;
      }
      setTimeout(this.#playRound(currentRound), 5000); // Schedule the next round after a very short delay
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFlLE1BQU1BLFVBQVUsQ0FBQztFQUM5QkMsV0FBV0EsQ0FBQSxFQUFHO0lBQ1osTUFBTUMsS0FBSyxHQUFHO01BQUMsU0FBUyxFQUFFLENBQUM7TUFBRSxZQUFZLEVBQUUsQ0FBQztNQUFFLFdBQVcsRUFBRSxDQUFDO01BQUUsV0FBVyxFQUFFLENBQUM7TUFBRSxhQUFhLEVBQUU7SUFBQyxDQUFDO0lBQy9GLElBQUksQ0FBQ0MsU0FBUyxHQUFHLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLGFBQWEsQ0FBQztJQUNuRixJQUFJLENBQUNDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFaEMsSUFBSSxDQUFDQyxhQUFhLEdBQUdDLFFBQVEsQ0FBQ0MsY0FBYyxDQUFDLGdCQUFnQixDQUFDO0lBQzlEO0lBQ0U7SUFDRixJQUFJLENBQUNDLGVBQWUsR0FBR0YsUUFBUSxDQUFDRyxhQUFhLENBQUMsS0FBSyxDQUFDO0lBQ3BELElBQUksQ0FBQ0MsV0FBVyxHQUFHSixRQUFRLENBQUNHLGFBQWEsQ0FBQyxLQUFLLENBQUM7SUFDaEQsSUFBSSxDQUFDRCxlQUFlLENBQUNHLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLGtCQUFrQixDQUFDO0lBQ3RELElBQUksQ0FBQ0YsV0FBVyxDQUFDQyxTQUFTLENBQUNDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztJQUNoRDtJQUNFO0lBQ0EsTUFBTUMsV0FBVyxHQUFHUCxRQUFRLENBQUNHLGFBQWEsQ0FBQyxJQUFJLENBQUM7SUFDaERJLFdBQVcsQ0FBQ0MsV0FBVyxHQUFHLFFBQVE7SUFFbEMsTUFBTUMsT0FBTyxHQUFHVCxRQUFRLENBQUNHLGFBQWEsQ0FBQyxJQUFJLENBQUM7SUFDNUNNLE9BQU8sQ0FBQ0QsV0FBVyxHQUFHLFVBQVU7O0lBRWhDO0lBQ0EsTUFBTUUsVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDQyxZQUFZLENBQUMsT0FBTyxDQUFDO0lBQzlDLE1BQU1DLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQ0QsWUFBWSxDQUFDLElBQUksQ0FBQztJQUV2QyxJQUFJLENBQUNFLFNBQVMsR0FBR2IsUUFBUSxDQUFDYyxjQUFjLENBQUMsRUFBRSxDQUFDO0lBQzVDLElBQUksQ0FBQ0MsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUN2QixJQUFJLENBQUNGLFNBQVMsQ0FBQ0csRUFBRSxHQUFHLFdBQVc7SUFFL0IsTUFBTUMsY0FBYyxHQUFHakIsUUFBUSxDQUFDRyxhQUFhLENBQUMsUUFBUSxDQUFDO0lBQ3ZEYyxjQUFjLENBQUNULFdBQVcsR0FBRyxZQUFZO0lBQ3pDUyxjQUFjLENBQUNELEVBQUUsR0FBRyxnQkFBZ0I7SUFFdEMsSUFBSSxDQUFDZCxlQUFlLENBQUNnQixNQUFNLENBQUNYLFdBQVcsRUFBRUcsVUFBVSxFQUFFLElBQUksQ0FBQ0csU0FBUyxFQUFFSSxjQUFjLENBQUM7SUFDcEYsSUFBSSxDQUFDYixXQUFXLENBQUNjLE1BQU0sQ0FBQ1QsT0FBTyxFQUFFRyxNQUFNLENBQUM7SUFFMUMsSUFBSSxDQUFDYixhQUFhLENBQUNtQixNQUFNLENBQUMsSUFBSSxDQUFDaEIsZUFBZSxFQUFFLElBQUksQ0FBQ0UsV0FBVyxDQUFDO0VBQ25FO0VBRUFlLEdBQUdBLENBQUNDLFFBQVEsRUFBRTtJQUNaQSxRQUFRLENBQUNmLFNBQVMsQ0FBQ2dCLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDakNELFFBQVEsQ0FBQ2YsU0FBUyxDQUFDQyxHQUFHLENBQUMsS0FBSyxDQUFDO0VBQy9CO0VBRUFnQixJQUFJQSxDQUFDRixRQUFRLEVBQUU7SUFDYkEsUUFBUSxDQUFDZixTQUFTLENBQUNDLEdBQUcsQ0FBQyxNQUFNLENBQUM7RUFDaEM7RUFFQWlCLElBQUlBLENBQUNILFFBQVEsRUFBRTtJQUNiQSxRQUFRLENBQUNmLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLE1BQU0sQ0FBQztFQUNoQztFQUVBa0IsV0FBV0EsQ0FBQ0MsT0FBTyxFQUFFO0lBQ25CQSxPQUFPLENBQUNDLEtBQUssQ0FBQ0MsT0FBTyxHQUFHLE1BQU07RUFDaEM7RUFFQVosZUFBZUEsQ0FBQ2EsT0FBTyxFQUFFO0lBQ3ZCLElBQUlDLEdBQUcsR0FBRyxJQUFJLENBQUNoQixTQUFTO0lBQ3hCLElBQUllLE9BQU8sR0FBRyxDQUFDLEVBQUU7TUFDZkMsR0FBRyxDQUFDckIsV0FBVyxHQUFJLHVCQUFzQixJQUFJLENBQUNYLFNBQVMsQ0FBQytCLE9BQU8sQ0FBRSxXQUFVLElBQUksQ0FBQzlCLFNBQVMsQ0FBQzhCLE9BQU8sQ0FBRSxHQUFFO0lBQ3ZHLENBQUMsTUFBTTtNQUNMQyxHQUFHLENBQUNyQixXQUFXLEdBQUcsRUFBRTtJQUN0QjtFQUNGO0VBRUEsQ0FBQ0csWUFBWW1CLENBQUNDLE1BQU0sRUFBRTtJQUNwQixNQUFNQyxJQUFJLEdBQUdoQyxRQUFRLENBQUNHLGFBQWEsQ0FBQyxLQUFLLENBQUM7SUFDMUM2QixJQUFJLENBQUMzQixTQUFTLENBQUNDLEdBQUcsQ0FBQyxNQUFNLEVBQUV5QixNQUFNLENBQUM7SUFFbEMsS0FBSyxJQUFJRSxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUcsR0FBRyxFQUFFQSxDQUFDLEVBQUUsRUFBRTtNQUM1QixNQUFNYixRQUFRLEdBQUdwQixRQUFRLENBQUNHLGFBQWEsQ0FBQyxLQUFLLENBQUM7TUFDOUNpQixRQUFRLENBQUNmLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFdBQVcsRUFBRXlCLE1BQU0sQ0FBQztNQUMzQ1gsUUFBUSxDQUFDYyxPQUFPLENBQUNDLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQ0MsY0FBYyxDQUFDSCxDQUFDLENBQUM7TUFDdERELElBQUksQ0FBQ0ssV0FBVyxDQUFDakIsUUFBUSxDQUFDO0lBQzVCO0lBQ0EsT0FBT1ksSUFBSTtFQUNiO0VBRUEsQ0FBQ0ksY0FBY0UsQ0FBQ0wsQ0FBQyxFQUFFO0lBQ2pCLElBQUlBLENBQUMsR0FBRyxFQUFFLEVBQUU7TUFDVixPQUFPLENBQUNBLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDZixDQUFDLE1BQU07TUFDTCxJQUFJTSxNQUFNLEdBQUdOLENBQUMsQ0FBQ08sUUFBUSxDQUFDLENBQUMsQ0FBQ0MsS0FBSyxDQUFDLEVBQUUsQ0FBQztNQUNuQyxPQUFPLENBQUNGLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRUEsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9CO0VBQ0Y7QUFDRjs7Ozs7Ozs7Ozs7Ozs7O0FDdEYyQjtBQUVaLE1BQU1JLFNBQVMsQ0FBQztFQUM3QmhELFdBQVdBLENBQUEsRUFBRztJQUNaLElBQUksQ0FBQ2lELFFBQVEsR0FBRyxFQUFFO0lBQ2xCLElBQUksQ0FBQ0MsV0FBVyxHQUFHLEVBQUU7RUFDdkI7RUFFQUMsU0FBU0EsQ0FBQ0MsSUFBSSxFQUFFQyxVQUFVLEVBQTRCO0lBQUEsSUFBMUJDLFdBQVcsR0FBQUMsU0FBQSxDQUFBQyxNQUFBLFFBQUFELFNBQUEsUUFBQUUsU0FBQSxHQUFBRixTQUFBLE1BQUMsWUFBWTtJQUNsRCxNQUFNZixXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUNrQixnQkFBZ0IsQ0FBQ04sSUFBSSxFQUFFQyxVQUFVLEVBQUVDLFdBQVcsQ0FBQztJQUN6RWQsV0FBVyxDQUFDbUIsT0FBTyxDQUFFQyxLQUFLLElBQUs7TUFDN0I7TUFDQSxJQUFJLElBQUksQ0FBQyxDQUFDQyxRQUFRLENBQUNELEtBQUssQ0FBQyxFQUFFO1FBQ3pCLE9BQU8sS0FBSztNQUNkO0lBQ0YsQ0FBQyxDQUFDO0lBQ0YsTUFBTUUsT0FBTyxHQUFHLElBQUlmLDhDQUFJLENBQUNLLElBQUksQ0FBQztJQUM5QixNQUFNVyxTQUFTLEdBQUcsQ0FBQ0QsT0FBTyxFQUFFdEIsV0FBVyxDQUFDO0lBQ3hDLElBQUksQ0FBQ1MsUUFBUSxDQUFDZSxJQUFJLENBQUNELFNBQVMsQ0FBQztJQUM3QixPQUFPdkIsV0FBVztFQUNwQjs7RUFFQTtFQUNBO0VBQ0F5QixhQUFhQSxDQUFDQyxVQUFVLEVBQUU7SUFDeEIsTUFBTXRDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQ2lDLFFBQVEsQ0FBQ0ssVUFBVSxDQUFDO0lBQ3ZDLElBQUl0QyxJQUFJLEVBQUU7TUFDUkEsSUFBSSxDQUFDSixHQUFHLENBQUMsQ0FBQztNQUNWLE9BQU8sSUFBSTtJQUNiLENBQUMsTUFBTTtNQUNMLElBQUksQ0FBQzBCLFdBQVcsQ0FBQ2MsSUFBSSxDQUFDRSxVQUFVLENBQUM7TUFDakMsT0FBTyxLQUFLO0lBQ2Q7RUFDRjtFQUVBQyxRQUFRQSxDQUFBLEVBQUc7SUFDVCxJQUFJQyxPQUFPLEdBQUcsSUFBSTtJQUNsQjtJQUNBLElBQUksSUFBSSxDQUFDbkIsUUFBUSxDQUFDTyxNQUFNLEtBQUssQ0FBQyxFQUFFO01BQzlCLE9BQU8sS0FBSztJQUNkO0lBQ0EsSUFBSSxDQUFDUCxRQUFRLENBQUNVLE9BQU8sQ0FBQy9CLElBQUksSUFBSTtNQUM1QixJQUFJLENBQUNBLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQ3lDLE1BQU0sQ0FBQyxDQUFDLEVBQUU7UUFDckJELE9BQU8sR0FBRyxLQUFLO01BQ2pCO0lBQ0YsQ0FBQyxDQUFDO0lBQ0YsT0FBT0EsT0FBTztFQUNoQjtFQUVBLENBQUNWLGdCQUFnQlksQ0FBQ2xCLElBQUksRUFBRUMsVUFBVSxFQUFFQyxXQUFXLEVBQUU7SUFDL0MsSUFBSWQsV0FBVyxHQUFHLEVBQUU7SUFDcEIsS0FBSyxJQUFJRixDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdjLElBQUksRUFBRWQsQ0FBQyxFQUFFLEVBQUU7TUFDN0IsSUFBSWdCLFdBQVcsS0FBSyxZQUFZLEVBQUU7UUFDaENkLFdBQVcsQ0FBQ3dCLElBQUksQ0FBQyxDQUFDWCxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUdmLENBQUMsRUFBRWUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDdEQsQ0FBQyxNQUFNO1FBQ0xiLFdBQVcsQ0FBQ3dCLElBQUksQ0FBQyxDQUFDWCxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUVBLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBR2YsQ0FBQyxDQUFDLENBQUM7TUFDdEQ7SUFDRjtJQUNBLE9BQU9FLFdBQVc7RUFDcEI7RUFFQSxDQUFDcUIsUUFBUVUsQ0FBQ0wsVUFBVSxFQUFFO0lBQ3BCLElBQUlNLFNBQVMsR0FBRyxLQUFLO0lBQ3JCLElBQUksQ0FBQ3ZCLFFBQVEsQ0FBQ1UsT0FBTyxDQUFDL0IsSUFBSSxJQUFJO01BQzVCLElBQUlBLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzZDLElBQUksQ0FBRUMsQ0FBQyxJQUFLQSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUtSLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLUixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUN6RU0sU0FBUyxHQUFHNUMsSUFBSSxDQUFDLENBQUMsQ0FBQztNQUN2QjtJQUFDLENBQUMsQ0FBQztJQUNILE9BQU80QyxTQUFTO0VBQ2xCO0FBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyRStCO0FBQ087QUFFdkIsTUFBTUksUUFBUSxDQUFDO0VBQzVCNUUsV0FBV0EsQ0FBQSxFQUFHO0lBQ1osSUFBSSxDQUFDNkUsS0FBSyxHQUFHLElBQUlGLGdEQUFNLENBQUMsSUFBSSxDQUFDO0lBQzdCLElBQUksQ0FBQ0csRUFBRSxHQUFHLElBQUlILGdEQUFNLENBQUMsS0FBSyxDQUFDO0lBQzNCLElBQUksQ0FBQ0ksT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDRixLQUFLLEVBQUUsSUFBSSxDQUFDQyxFQUFFLENBQUM7SUFDcEMsSUFBSSxDQUFDRSxhQUFhLEdBQUcsSUFBSSxDQUFDRixFQUFFO0lBQzVCLElBQUksQ0FBQ0csS0FBSyxHQUFHLElBQUk7SUFDakIsSUFBSSxDQUFDQyxJQUFJLEdBQUcsSUFBSW5GLG1EQUFVLENBQUMsQ0FBQztFQUM5Qjs7RUFFQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUVBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUVBb0YsS0FBS0EsQ0FBQSxFQUFHO0lBQ04sSUFBSSxDQUFDLENBQUNDLE9BQU8sQ0FBQyxDQUFDO0lBQ2YsSUFBSSxDQUFDQyxlQUFlLENBQUMsQ0FBQztJQUN0QixJQUFJLENBQUNDLGtCQUFrQixDQUFDLENBQUM7SUFDekI7SUFDQSxJQUFJQyxZQUFZLEdBQUcsSUFBSSxDQUFDTixLQUFLOztJQUU3QjtJQUNBLE1BQU1PLFNBQVMsR0FBR0EsQ0FBQSxLQUFNO01BQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQ3JCLFFBQVEsQ0FBQyxDQUFDLEVBQUU7UUFDckIsSUFBSW9CLFlBQVksS0FBSyxJQUFJLENBQUNOLEtBQUssRUFBRTtVQUMvQixJQUFJLENBQUNELGFBQWEsR0FBRyxJQUFJLENBQUNBLGFBQWEsS0FBSyxJQUFJLENBQUNILEtBQUssR0FBRyxJQUFJLENBQUNDLEVBQUUsR0FBRyxJQUFJLENBQUNELEtBQUs7VUFDN0VVLFlBQVksR0FBRyxJQUFJLENBQUNOLEtBQUs7UUFDM0I7UUFDQVEsVUFBVSxDQUFDRCxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUM1QjtJQUNGLENBQUM7O0lBRURBLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmOztFQUVBLENBQUNBLFNBQVNFLENBQUNILFlBQVksRUFBRTtJQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUNwQixRQUFRLENBQUMsQ0FBQyxFQUFFO01BQ3JCLElBQUlvQixZQUFZLEtBQUssSUFBSSxDQUFDTixLQUFLLEVBQUU7UUFDL0IsSUFBSSxDQUFDRCxhQUFhLEdBQUcsSUFBSSxDQUFDQSxhQUFhLEtBQUssSUFBSSxDQUFDSCxLQUFLLEdBQUcsSUFBSSxDQUFDQyxFQUFFLEdBQUcsSUFBSSxDQUFDRCxLQUFLO1FBQzdFVSxZQUFZLEdBQUcsSUFBSSxDQUFDTixLQUFLO01BQzNCO01BQ0FRLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQ0QsU0FBUyxDQUFDRCxZQUFZLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ25EO0VBQ0Y7O0VBRUFELGtCQUFrQkEsQ0FBQSxFQUFHO0lBQ25CLElBQUksQ0FBQyxDQUFDSyxzQkFBc0IsQ0FBQyxDQUFDO0lBQzlCLE1BQU1yRSxjQUFjLEdBQUdqQixRQUFRLENBQUNDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQztJQUNoRSxNQUFNc0YsU0FBUyxHQUFHdkYsUUFBUSxDQUFDd0YsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUM7SUFDL0QsSUFBSUMsZ0JBQWdCLEdBQUcsQ0FBQztJQUN4QixJQUFJQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRTlCSCxTQUFTLENBQUNqQyxPQUFPLENBQUVxQyxJQUFJLElBQUs7TUFDMUJBLElBQUksQ0FBQ0MsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU07UUFDbkMsSUFBSUgsZ0JBQWdCLElBQUlDLFFBQVEsQ0FBQ3ZDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUN5QixLQUFLLEVBQUU7VUFDMUQsSUFBSSxDQUFDQyxJQUFJLENBQUNyRCxXQUFXLENBQUNQLGNBQWMsQ0FBQztVQUNyQyxJQUFJLENBQUMyRCxLQUFLLEdBQUcsQ0FBQztRQUNoQjtRQUNBLE1BQU0zQixXQUFXLEdBQUdoQyxjQUFjLENBQUNULFdBQVc7UUFDOUMsSUFBSXFGLE1BQU0sR0FBR0YsSUFBSSxDQUFDekQsT0FBTyxDQUFDQyxXQUFXLENBQ2xDTSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQ1ZxRCxHQUFHLENBQUV6QixDQUFDLElBQUswQixRQUFRLENBQUMxQixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDOUIsSUFBSWxDLFdBQVcsR0FBRyxJQUFJLENBQUNxQyxLQUFLLENBQUN3QixLQUFLLENBQUNsRCxTQUFTLENBQzFDNEMsUUFBUSxDQUFDRCxnQkFBZ0IsQ0FBQyxFQUMxQkksTUFBTSxFQUNONUMsV0FDRixDQUFDO1FBQ0Q7UUFDQWQsV0FBVyxDQUFDbUIsT0FBTyxDQUFFQyxLQUFLLElBQUs7VUFDN0IsSUFBSSxDQUFDc0IsSUFBSSxDQUFDdEQsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDMEUsWUFBWSxDQUFDMUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQztRQUNGa0MsZ0JBQWdCLEVBQUU7UUFDbEIsSUFBSSxDQUFDWixJQUFJLENBQUM5RCxlQUFlLENBQUMwRSxnQkFBZ0IsQ0FBQztNQUM3QyxDQUFDLENBQUM7SUFDSixDQUFDLENBQUM7RUFDSjtFQUVBLENBQUNILHNCQUFzQlksQ0FBQSxFQUFHO0lBQ3hCLE1BQU1qRCxXQUFXLEdBQUdqRCxRQUFRLENBQUNDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQztJQUM3RGdELFdBQVcsQ0FBQ3RCLE9BQU8sR0FBRyxPQUFPO0lBRTdCc0IsV0FBVyxDQUFDMkMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU07TUFDMUMsSUFBSU8sSUFBSSxHQUFHbEQsV0FBVyxDQUFDekMsV0FBVztNQUNsQ3lDLFdBQVcsQ0FBQ3pDLFdBQVcsR0FDckIyRixJQUFJLEtBQUssWUFBWSxHQUFHLFVBQVUsR0FBRyxZQUFZO0lBQ3JELENBQUMsQ0FBQztFQUNKO0VBRUFuQixlQUFlQSxDQUFBLEVBQUc7SUFDaEIsTUFBTU8sU0FBUyxHQUFHdkYsUUFBUSxDQUFDd0YsZ0JBQWdCLENBQUMsZUFBZSxDQUFDO0lBQzVERCxTQUFTLENBQUNqQyxPQUFPLENBQUVxQyxJQUFJLElBQUs7TUFDMUJBLElBQUksQ0FBQ0MsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU07UUFDbkMsSUFBSSxJQUFJLENBQUNqQixhQUFhLEtBQUssSUFBSSxDQUFDSCxLQUFLLEVBQUU7VUFDckMsSUFBSXFCLE1BQU0sR0FBR0YsSUFBSSxDQUFDekQsT0FBTyxDQUFDQyxXQUFXLENBQ2xDTSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQ1ZxRCxHQUFHLENBQUV6QixDQUFDLElBQUswQixRQUFRLENBQUMxQixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7VUFDOUIsSUFBSSxJQUFJLENBQUNJLEVBQUUsQ0FBQ3VCLEtBQUssQ0FBQ3BDLGFBQWEsQ0FBQ2lDLE1BQU0sQ0FBQyxFQUFFO1lBQ3ZDO1lBQ0EsSUFBSSxDQUFDaEIsSUFBSSxDQUFDMUQsR0FBRyxDQUFDd0UsSUFBSSxDQUFDO1lBQ25CLElBQUksQ0FBQ2YsS0FBSyxFQUFFO1VBQ2QsQ0FBQyxNQUFNO1lBQ0w7WUFDQSxJQUFJLENBQUNDLElBQUksQ0FBQ3ZELElBQUksQ0FBQ3FFLElBQUksQ0FBQztZQUNwQixJQUFJLENBQUNmLEtBQUssRUFBRTtVQUNkO1FBQ0Y7TUFDRixDQUFDLENBQUM7SUFDSixDQUFDLENBQUM7RUFDSjtFQUVBLENBQUNHLE9BQU9xQixDQUFBLEVBQUc7SUFDVCxNQUFNdEcsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNqQ0EsU0FBUyxDQUFDd0QsT0FBTyxDQUFFL0IsSUFBSSxJQUFLO01BQzFCLElBQUlZLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQ2tFLGVBQWUsQ0FBQzlFLElBQUksQ0FBQztNQUU3QyxPQUFPLENBQUNZLFdBQVcsRUFBRTtRQUNuQkEsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDa0UsZUFBZSxDQUFDOUUsSUFBSSxDQUFDO01BQzNDOztNQUVBO01BQ0FZLFdBQVcsQ0FBQ21CLE9BQU8sQ0FBRUMsS0FBSyxJQUFLO1FBQzdCLElBQUksQ0FBQ3NCLElBQUksQ0FBQ3RELElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzBFLFlBQVksQ0FBQzFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztNQUNqRCxDQUFDLENBQUM7SUFDSixDQUFDLENBQUM7RUFDSjtFQUVBLENBQUM4QyxlQUFlQyxDQUFDL0UsSUFBSSxFQUFFO0lBQ3JCLElBQUkwQixXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUNzRCxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLFlBQVksR0FBRyxVQUFVO0lBQ3RFLElBQUloRCxLQUFLLEdBQ1BOLFdBQVcsS0FBSyxZQUFZLEdBQ3hCLENBQUMsSUFBSSxDQUFDLENBQUNzRCxTQUFTLENBQUMsRUFBRSxHQUFHaEYsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUNnRixTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsR0FDakQsQ0FBQyxJQUFJLENBQUMsQ0FBQ0EsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDQSxTQUFTLENBQUMsRUFBRSxHQUFHaEYsSUFBSSxDQUFDLENBQUM7SUFDdkQsSUFBSVksV0FBVyxHQUFHLElBQUksQ0FBQ3NDLEVBQUUsQ0FBQ3VCLEtBQUssQ0FBQ2xELFNBQVMsQ0FBQ3ZCLElBQUksRUFBRWdDLEtBQUssRUFBRU4sV0FBVyxDQUFDO0lBQ25FLE9BQU9kLFdBQVc7RUFDcEI7RUFFQSxDQUFDb0UsU0FBU0MsQ0FBQ0MsR0FBRyxFQUFFO0lBQ2QsT0FBT0MsSUFBSSxDQUFDQyxLQUFLLENBQUNELElBQUksQ0FBQ0UsTUFBTSxDQUFDLENBQUMsR0FBR0gsR0FBRyxDQUFDO0VBQ3hDO0VBRUEsQ0FBQ1IsWUFBWVksQ0FBQ3RELEtBQUssRUFBRXhCLE1BQU0sRUFBRTtJQUMzQixNQUFNd0QsU0FBUyxHQUFHdkYsUUFBUSxDQUFDd0YsZ0JBQWdCLENBQUUsY0FBYXpELE1BQU8sRUFBQyxDQUFDO0lBQ25FLElBQUkrRSxTQUFTLEdBQUcsS0FBSztJQUNyQnZCLFNBQVMsQ0FBQ2pDLE9BQU8sQ0FBRWxDLFFBQVEsSUFBSztNQUM5QixJQUFJQSxRQUFRLENBQUNjLE9BQU8sQ0FBQ0MsV0FBVyxLQUFLb0IsS0FBSyxDQUFDZixRQUFRLENBQUMsQ0FBQyxFQUFFO1FBQ3JEc0UsU0FBUyxHQUFHMUYsUUFBUTtNQUN0QjtJQUNGLENBQUMsQ0FBQztJQUNGLE9BQU8wRixTQUFTO0VBQ2xCO0VBRUEsQ0FBQ2hELFFBQVFpRCxDQUFBLEVBQUc7SUFDVixJQUFJLElBQUksQ0FBQ3ZDLEtBQUssQ0FBQ3dCLEtBQUssQ0FBQ2xDLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDVyxFQUFFLENBQUN1QixLQUFLLENBQUNsQyxRQUFRLENBQUMsQ0FBQyxFQUFFO01BQzNELE9BQU8sSUFBSTtJQUNiLENBQUMsTUFBTTtNQUNMLE9BQU8sS0FBSztJQUNkO0VBQ0Y7QUFDRjs7Ozs7Ozs7Ozs7Ozs7O0FDM0tvQztBQUVyQixNQUFNUSxNQUFNLENBQUM7RUFDMUIzRSxXQUFXQSxDQUFBLEVBQWE7SUFBQSxJQUFaNkUsS0FBSyxHQUFBdEIsU0FBQSxDQUFBQyxNQUFBLFFBQUFELFNBQUEsUUFBQUUsU0FBQSxHQUFBRixTQUFBLE1BQUMsSUFBSTtJQUNwQixJQUFJLENBQUM4QyxLQUFLLEdBQUcsSUFBSXJELGtEQUFTLENBQUQsQ0FBQztJQUMxQixJQUFJLENBQUNxRSxPQUFPLEdBQUd4QyxLQUFLO0lBQ3BCLElBQUksQ0FBQ3lDLGFBQWEsR0FBRyxFQUFFO0VBQ3pCO0VBRUFDLE1BQU1BLENBQUNuRixNQUFNLEVBQUU4QixVQUFVLEVBQUU7SUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQ21ELE9BQU8sRUFBRTtNQUNqQm5ELFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBQ3NELFFBQVEsQ0FBQ3BGLE1BQU0sQ0FBQ2lFLEtBQUssQ0FBQztJQUMzQztJQUVBLElBQUksQ0FBQ2lCLGFBQWEsQ0FBQ3RELElBQUksQ0FBQ0UsVUFBVSxDQUFDO0lBQ25DOUIsTUFBTSxDQUFDaUUsS0FBSyxDQUFDcEMsYUFBYSxDQUFDQyxVQUFVLENBQUM7RUFDeEM7RUFFQSxDQUFDc0QsUUFBUUMsQ0FBQ3BCLEtBQUssRUFBRTtJQUNmLElBQUluQyxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUN3RCxXQUFXLENBQUMsQ0FBQztJQUNwQyxJQUFJLElBQUksQ0FBQ0osYUFBYSxDQUFDSyxRQUFRLENBQUN6RCxVQUFVLENBQUMsRUFBRTtNQUMzQyxJQUFJLENBQUMsQ0FBQ3NELFFBQVEsQ0FBQ25CLEtBQUssQ0FBQztJQUN2QixDQUFDLE1BQU07TUFDTCxPQUFPbkMsVUFBVTtJQUNuQjtFQUNGOztFQUVBO0VBQ0EsQ0FBQ3dELFdBQVdFLENBQUEsRUFBRztJQUNiLE9BQU8sQ0FBQ2IsSUFBSSxDQUFDQyxLQUFLLENBQUNELElBQUksQ0FBQ0UsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRUYsSUFBSSxDQUFDQyxLQUFLLENBQUNELElBQUksQ0FBQ0UsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztFQUN6RTtBQUNGOzs7Ozs7Ozs7Ozs7OztBQy9CZSxNQUFNbEUsSUFBSSxDQUFDO0VBQ3hCL0MsV0FBV0EsQ0FBQ29ELElBQUksRUFBRTtJQUNoQixJQUFJLENBQUNJLE1BQU0sR0FBR0osSUFBSTtJQUNsQixJQUFJLENBQUN5RSxJQUFJLEdBQUcsQ0FBQztJQUNiLElBQUksQ0FBQ0MsSUFBSSxHQUFHLEtBQUs7RUFDbkI7RUFFQXRHLEdBQUdBLENBQUEsRUFBRztJQUNKLElBQUksQ0FBQ3FHLElBQUksRUFBRTtJQUNYLElBQUksQ0FBQ3hELE1BQU0sQ0FBQyxDQUFDO0VBQ2Y7RUFFQUEsTUFBTUEsQ0FBQSxFQUFHO0lBQ1AsSUFBSSxJQUFJLENBQUN3RCxJQUFJLEtBQUssSUFBSSxDQUFDckUsTUFBTSxFQUFFO01BQzdCLElBQUksQ0FBQ3NFLElBQUksR0FBRyxJQUFJO0lBQ2xCO0lBQ0EsT0FBTyxJQUFJLENBQUNBLElBQUk7RUFDbEI7QUFDRjs7Ozs7O1VDbEJBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOa0M7QUFFbEMsTUFBTUMsSUFBSSxHQUFHLElBQUluRCxpREFBUSxDQUFDLENBQUM7QUFDM0JtRCxJQUFJLENBQUM1QyxLQUFLLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9kb21CdWlsZGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWxvb3AuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXJzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2NyaXB0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIERPTWJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBjb25zdCBzaGlwcyA9IHsnQ2Fycmllcic6IDUsICdCYXR0bGVzaGlwJzogNCwgJ0Rlc3Ryb3llcic6IDMsICdTdWJtYXJpbmUnOiAzLCAnUGF0cm9sIEJvYXQnOiAyfVxuICAgIHRoaXMuc2hpcE5hbWVzID0gWydDYXJyaWVyJywgJ0JhdHRsZXNoaXAnLCAnRGVzdHJveWVyJywgJ1N1Ym1hcmluZScsICdQYXRyb2wgQm9hdCddO1xuICAgIHRoaXMuc2hpcFNpemVzID0gWzUsIDQsIDMsIDMsIDJdO1xuXG4gICAgdGhpcy5nYW1lQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtY29udGFpbmVyJyk7XG4gICAgLy8gY3JlYXRlIGNvbnRhaW5lcnMgZm9yIGVsZW1lbnRzOlxuICAgICAgLy8gMiBwbGF5ZXIgY29udGFpbmVyc1xuICAgIHRoaXMucGxheWVyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5haUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMucGxheWVyQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3BsYXllci1jb250YWluZXInKTtcbiAgICB0aGlzLmFpQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3BsYXllci1jb250YWluZXInKTtcbiAgICAgIC8vIGVhY2ggY29udGFpbmVyIGNvbnRhaW5zOlxuICAgICAgICAvLyBQbGF5ZXIgdGl0bGVcbiAgICAgICAgY29uc3QgcGxheWVyVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpXG4gICAgICAgIHBsYXllclRpdGxlLnRleHRDb250ZW50ID0gJ1BsYXllcic7XG5cbiAgICAgICAgY29uc3QgYWlUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG4gICAgICAgIGFpVGl0bGUudGV4dENvbnRlbnQgPSAnQ29tcHV0ZXInO1xuXG4gICAgICAgIC8vIEdhbWUgYm9hcmQgZ3JpZCAoMTAgeCAxMClcbiAgICAgICAgY29uc3QgcGxheWVyR3JpZCA9IHRoaXMuI2dyaWRQb3B1bGF0ZSgnaHVtYW4nKTtcbiAgICAgICAgY29uc3QgYWlHcmlkID0gdGhpcy4jZ3JpZFBvcHVsYXRlKCdhaScpO1xuXG4gICAgICAgIHRoaXMucGxheWVyTXNnID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICAgICAgICB0aGlzLnVwZGF0ZVBsYXllck1zZygwKTtcbiAgICAgICAgdGhpcy5wbGF5ZXJNc2cuaWQgPSAncGxheWVyTXNnJztcblxuICAgICAgICBjb25zdCBvcmllbnRhdGlvbkJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBvcmllbnRhdGlvbkJ0bi50ZXh0Q29udGVudCA9ICdob3Jpem9udGFsJztcbiAgICAgICAgb3JpZW50YXRpb25CdG4uaWQgPSAnb3JpZW50YXRpb25CdG4nO1xuXG4gICAgICB0aGlzLnBsYXllckNvbnRhaW5lci5hcHBlbmQocGxheWVyVGl0bGUsIHBsYXllckdyaWQsIHRoaXMucGxheWVyTXNnLCBvcmllbnRhdGlvbkJ0bik7XG4gICAgICB0aGlzLmFpQ29udGFpbmVyLmFwcGVuZChhaVRpdGxlLCBhaUdyaWQpO1xuXG4gICAgdGhpcy5nYW1lQ29udGFpbmVyLmFwcGVuZCh0aGlzLnBsYXllckNvbnRhaW5lciwgdGhpcy5haUNvbnRhaW5lcik7XG4gIH1cblxuICBoaXQoZ3JpZEl0ZW0pIHtcbiAgICBncmlkSXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdzaGlwJyk7XG4gICAgZ3JpZEl0ZW0uY2xhc3NMaXN0LmFkZCgnaGl0Jyk7XG4gIH07XG5cbiAgbWlzcyhncmlkSXRlbSkge1xuICAgIGdyaWRJdGVtLmNsYXNzTGlzdC5hZGQoJ21pc3MnKTtcbiAgfVxuXG4gIHNoaXAoZ3JpZEl0ZW0pIHtcbiAgICBncmlkSXRlbS5jbGFzc0xpc3QuYWRkKCdzaGlwJyk7XG4gIH07XG5cbiAgaGlkZUVsZW1lbnQoZWxlbWVudCkge1xuICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfVxuXG4gIHVwZGF0ZVBsYXllck1zZyhjb3VudGVyKSB7XG4gICAgbGV0IG1zZyA9IHRoaXMucGxheWVyTXNnO1xuICAgIGlmIChjb3VudGVyIDwgNSkge1xuICAgICAgbXNnLnRleHRDb250ZW50ID0gYENsaWNrIGdyaWQgdG8gcGxhY2UgJHt0aGlzLnNoaXBOYW1lc1tjb3VudGVyXX0gKHNpemU6ICR7dGhpcy5zaGlwU2l6ZXNbY291bnRlcl19KWBcbiAgICB9IGVsc2Uge1xuICAgICAgbXNnLnRleHRDb250ZW50ID0gJyc7XG4gICAgfVxuICB9XG5cbiAgI2dyaWRQb3B1bGF0ZShwbGF5ZXIpIHtcbiAgICBjb25zdCBncmlkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZ3JpZC5jbGFzc0xpc3QuYWRkKCdncmlkJywgcGxheWVyKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyBpKyspIHtcbiAgICAgIGNvbnN0IGdyaWRJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBncmlkSXRlbS5jbGFzc0xpc3QuYWRkKCdncmlkLWl0ZW0nLCBwbGF5ZXIpO1xuICAgICAgZ3JpZEl0ZW0uZGF0YXNldC5jb29yZGluYXRlcyA9IHRoaXMuI2Nvb3Jkc1BvcHVsYXRlKGkpO1xuICAgICAgZ3JpZC5hcHBlbmRDaGlsZChncmlkSXRlbSk7XG4gICAgfVxuICAgIHJldHVybiBncmlkO1xuICB9XG5cbiAgI2Nvb3Jkc1BvcHVsYXRlKGkpIHtcbiAgICBpZiAoaSA8IDEwKSB7XG4gICAgICByZXR1cm4gW2ksIDBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgZGlnaXRzID0gaS50b1N0cmluZygpLnNwbGl0KCcnKTtcbiAgICAgIHJldHVybiBbZGlnaXRzWzFdLCBkaWdpdHNbMF1dO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IFNoaXAgZnJvbSAnLi9zaGlwcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVib2FyZCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYWxsU2hpcHMgPSBbXTtcbiAgICB0aGlzLm1pc3NlZFNob3RzID0gW107XG4gIH07XG5cbiAgcGxhY2VTaGlwKHNpemUsIGZpcnN0Q29vcmQsIG9yaWVudGF0aW9uPSdob3Jpem9udGFsJykge1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gdGhpcy4jYnVpbGRDb29yZGluYXRlcyhzaXplLCBmaXJzdENvb3JkLCBvcmllbnRhdGlvbik7XG4gICAgY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmQpID0+IHtcbiAgICAgIC8vIElmIGEgc2hpcCBhbHJlYWR5IGV4aXN0cyBhdCBsb2NhdGlvbiwgcmVqZWN0IGl0LlxuICAgICAgaWYgKHRoaXMuI2ZpbmRTaGlwKGNvb3JkKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSlcbiAgICBjb25zdCBuZXdTaGlwID0gbmV3IFNoaXAoc2l6ZSk7XG4gICAgY29uc3Qgc2hpcEVudHJ5ID0gW25ld1NoaXAsIGNvb3JkaW5hdGVzXTtcbiAgICB0aGlzLmFsbFNoaXBzLnB1c2goc2hpcEVudHJ5KTtcbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gIH1cblxuICAvLyByZWNlaXZlQXR0YWNrIGZ1bmN0aW9uIHRha2VzIGNvb3JkaW5hdGVzLCBkZXRlcm1pbmVzIHdoZXRoZXIgb3Igbm90IHRoZSBhdHRhY2sgaGl0IGEgc2hpcFxuICAvLyB0aGVuIHNlbmRzIHRoZSDigJhoaXTigJkgZnVuY3Rpb24gdG8gdGhlIGNvcnJlY3Qgc2hpcCwgb3IgcmVjb3JkcyB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIG1pc3NlZCBzaG90LlxuICByZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGUpIHtcbiAgICBjb25zdCBzaGlwID0gdGhpcy4jZmluZFNoaXAoY29vcmRpbmF0ZSk7XG4gICAgaWYgKHNoaXApIHtcbiAgICAgIHNoaXAuaGl0KCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5taXNzZWRTaG90cy5wdXNoKGNvb3JkaW5hdGUpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGdhbWVPdmVyKCkge1xuICAgIGxldCBhbGxTdW5rID0gdHJ1ZTtcbiAgICAvLyBJZiBzaGlwcyBoYXZlbid0IHlldCBiZWVuIHBsYWNlZCwgcmV0dXJuIGZhbHNlLlxuICAgIGlmICh0aGlzLmFsbFNoaXBzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLmFsbFNoaXBzLmZvckVhY2goc2hpcCA9PiB7XG4gICAgICBpZiAoIXNoaXBbMF0uaXNTdW5rKCkpIHtcbiAgICAgICAgYWxsU3VuayA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGFsbFN1bms7XG4gIH1cblxuICAjYnVpbGRDb29yZGluYXRlcyhzaXplLCBmaXJzdENvb3JkLCBvcmllbnRhdGlvbikge1xuICAgIGxldCBjb29yZGluYXRlcyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBpZiAob3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICBjb29yZGluYXRlcy5wdXNoKFtmaXJzdENvb3JkWzBdICsgaSwgZmlyc3RDb29yZFsxXV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29vcmRpbmF0ZXMucHVzaChbZmlyc3RDb29yZFswXSwgZmlyc3RDb29yZFsxXSArIGldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xuICB9XG5cbiAgI2ZpbmRTaGlwKGNvb3JkaW5hdGUpIHtcbiAgICBsZXQgZm91bmRTaGlwID0gZmFsc2U7XG4gICAgdGhpcy5hbGxTaGlwcy5mb3JFYWNoKHNoaXAgPT4ge1xuICAgICAgaWYgKHNoaXBbMV0uc29tZSgoeCkgPT4geFswXSA9PT0gY29vcmRpbmF0ZVswXSAmJiB4WzFdID09PSBjb29yZGluYXRlWzFdKSkge1xuICAgICAgICBmb3VuZFNoaXAgPSBzaGlwWzBdO1xuICAgIH19KVxuICAgIHJldHVybiBmb3VuZFNoaXA7XG4gIH1cbn1cbiIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vcGxheWVyc1wiO1xuaW1wb3J0IERPTWJ1aWxkZXIgZnJvbSBcIi4vZG9tQnVpbGRlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lbG9vcCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaHVtYW4gPSBuZXcgUGxheWVyKHRydWUpO1xuICAgIHRoaXMuYWkgPSBuZXcgUGxheWVyKGZhbHNlKTtcbiAgICB0aGlzLnBsYXllcnMgPSBbdGhpcy5odW1hbiwgdGhpcy5haV07XG4gICAgdGhpcy5jdXJyZW50UGxheWVyID0gdGhpcy5haTtcbiAgICB0aGlzLnJvdW5kID0gbnVsbDtcbiAgICB0aGlzLnBhZ2UgPSBuZXcgRE9NYnVpbGRlcigpO1xuICB9XG5cbiAgLy8gc3RhcnQoKSB7XG4gIC8vICAgdGhpcy4jYWlTaGlwcygpO1xuICAvLyAgIHRoaXMuYWlHcmlkTGlzdGVuZXJzKCk7XG4gIC8vICAgdGhpcy5odW1hbkdyaWRMaXN0ZW5lcnMoKTtcbiAgLy8gICBsZXQgY3VycmVudFJvdW5kID0gdGhpcy5yb3VuZDtcblxuICAvLyAgIHdoaWxlICghdGhpcy4jZ2FtZU92ZXIoKSkge1xuICAvLyAgICAgaWYgKGN1cnJlbnRSb3VuZCAhPT0gdGhpcy5yb3VuZCkge1xuICAvLyAgICAgICB0aGlzLmN1cnJlbnRQbGF5ZXIgPSB0aGlzLmN1cnJlbnRQbGF5ZXIgPT09IHRoaXMuaHVtYW4gPyB0aGlzLmFpIDogdGhpcy5odW1hbjtcbiAgLy8gICAgICAgY3VycmVudFJvdW5kID0gdGhpcy5yb3VuZDtcbiAgLy8gICAgIH1cbiAgLy8gICB9XG4gIC8vIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLiNhaVNoaXBzKCk7XG4gICAgdGhpcy5haUdyaWRMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLmh1bWFuR3JpZExpc3RlbmVycygpO1xuICAgIC8vIHRoaXMuI3BsYXlSb3VuZCh0aGlzLnJvdW5kKTtcbiAgICBsZXQgY3VycmVudFJvdW5kID0gdGhpcy5yb3VuZDtcblxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuY3VycmVudFBsYXllciA9PT0gdGhpcy5odW1hbik7XG4gICAgY29uc3QgcGxheVJvdW5kID0gKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLiNnYW1lT3ZlcigpKSB7XG4gICAgICAgIGlmIChjdXJyZW50Um91bmQgIT09IHRoaXMucm91bmQpIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRQbGF5ZXIgPSB0aGlzLmN1cnJlbnRQbGF5ZXIgPT09IHRoaXMuaHVtYW4gPyB0aGlzLmFpIDogdGhpcy5odW1hbjtcbiAgICAgICAgICBjdXJyZW50Um91bmQgPSB0aGlzLnJvdW5kO1xuICAgICAgICB9XG4gICAgICAgIHNldFRpbWVvdXQocGxheVJvdW5kLCAwKTsgLy8gU2NoZWR1bGUgdGhlIG5leHQgcm91bmQgYWZ0ZXIgYSB2ZXJ5IHNob3J0IGRlbGF5XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYXlSb3VuZCgpOyAvLyBTdGFydCB0aGUgZmlyc3Qgcm91bmRcbiAgfVxuXG4gICNwbGF5Um91bmQoY3VycmVudFJvdW5kKSB7XG4gICAgaWYgKCF0aGlzLiNnYW1lT3ZlcigpKSB7XG4gICAgICBpZiAoY3VycmVudFJvdW5kICE9PSB0aGlzLnJvdW5kKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFBsYXllciA9IHRoaXMuY3VycmVudFBsYXllciA9PT0gdGhpcy5odW1hbiA/IHRoaXMuYWkgOiB0aGlzLmh1bWFuO1xuICAgICAgICBjdXJyZW50Um91bmQgPSB0aGlzLnJvdW5kO1xuICAgICAgfVxuICAgICAgc2V0VGltZW91dCh0aGlzLiNwbGF5Um91bmQoY3VycmVudFJvdW5kKSwgNTAwMCk7IC8vIFNjaGVkdWxlIHRoZSBuZXh0IHJvdW5kIGFmdGVyIGEgdmVyeSBzaG9ydCBkZWxheVxuICAgIH1cbiAgfVxuXG4gIGh1bWFuR3JpZExpc3RlbmVycygpIHtcbiAgICB0aGlzLiNvcmllbnRhdGlvbkJ0bkxpc3RlbmVyKCk7XG4gICAgY29uc3Qgb3JpZW50YXRpb25CdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yaWVudGF0aW9uQnRuXCIpO1xuICAgIGNvbnN0IGdyaWRJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ3JpZC1pdGVtLmh1bWFuXCIpO1xuICAgIGxldCBwbGFjZW1lbnRDb3VudGVyID0gMDtcbiAgICBsZXQgc2hpcFNpemUgPSBbNSwgNCwgMywgMywgMl07XG5cbiAgICBncmlkSXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBpZiAocGxhY2VtZW50Q291bnRlciA+PSBzaGlwU2l6ZS5sZW5ndGggLSAxICYmICF0aGlzLnJvdW5kKSB7XG4gICAgICAgICAgdGhpcy5wYWdlLmhpZGVFbGVtZW50KG9yaWVudGF0aW9uQnRuKTtcbiAgICAgICAgICB0aGlzLnJvdW5kID0gMDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uQnRuLnRleHRDb250ZW50O1xuICAgICAgICBsZXQgY29vcmRzID0gaXRlbS5kYXRhc2V0LmNvb3JkaW5hdGVzXG4gICAgICAgICAgLnNwbGl0KFwiLFwiKVxuICAgICAgICAgIC5tYXAoKHgpID0+IHBhcnNlSW50KHgsIDEwKSk7XG4gICAgICAgIGxldCBjb29yZGluYXRlcyA9IHRoaXMuaHVtYW4uYm9hcmQucGxhY2VTaGlwKFxuICAgICAgICAgIHNoaXBTaXplW3BsYWNlbWVudENvdW50ZXJdLFxuICAgICAgICAgIGNvb3JkcyxcbiAgICAgICAgICBvcmllbnRhdGlvblxuICAgICAgICApO1xuICAgICAgICAvLyBTaG93IHNoaXAgb24gc2NyZWVuLlxuICAgICAgICBjb29yZGluYXRlcy5mb3JFYWNoKChjb29yZCkgPT4ge1xuICAgICAgICAgIHRoaXMucGFnZS5zaGlwKHRoaXMuI2ZpbmRHcmlkSXRlbShjb29yZCwgXCJodW1hblwiKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBwbGFjZW1lbnRDb3VudGVyKys7XG4gICAgICAgIHRoaXMucGFnZS51cGRhdGVQbGF5ZXJNc2cocGxhY2VtZW50Q291bnRlcik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gICNvcmllbnRhdGlvbkJ0bkxpc3RlbmVyKCkge1xuICAgIGNvbnN0IG9yaWVudGF0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmllbnRhdGlvbkJ0blwiKTtcbiAgICBvcmllbnRhdGlvbi5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXG4gICAgb3JpZW50YXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGxldCB0ZXh0ID0gb3JpZW50YXRpb24udGV4dENvbnRlbnQ7XG4gICAgICBvcmllbnRhdGlvbi50ZXh0Q29udGVudCA9XG4gICAgICAgIHRleHQgPT09IFwiaG9yaXpvbnRhbFwiID8gXCJ2ZXJ0aWNhbFwiIDogXCJob3Jpem9udGFsXCI7XG4gICAgfSk7XG4gIH1cblxuICBhaUdyaWRMaXN0ZW5lcnMoKSB7XG4gICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ncmlkLWl0ZW0uYWlcIik7XG4gICAgZ3JpZEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBsYXllciA9PT0gdGhpcy5odW1hbikge1xuICAgICAgICAgIGxldCBjb29yZHMgPSBpdGVtLmRhdGFzZXQuY29vcmRpbmF0ZXNcbiAgICAgICAgICAgIC5zcGxpdChcIixcIilcbiAgICAgICAgICAgIC5tYXAoKHgpID0+IHBhcnNlSW50KHgsIDEwKSk7XG4gICAgICAgICAgaWYgKHRoaXMuYWkuYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZHMpKSB7XG4gICAgICAgICAgICAvLyBpZiBhIHNoaXAgaXMgaGl0IHRoZW4gLi4uXG4gICAgICAgICAgICB0aGlzLnBhZ2UuaGl0KGl0ZW0pO1xuICAgICAgICAgICAgdGhpcy5yb3VuZCsrO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBpZiBhIHNoaXAgaXMgbm90IGhpdCB0aGVuIC4uLlxuICAgICAgICAgICAgdGhpcy5wYWdlLm1pc3MoaXRlbSk7XG4gICAgICAgICAgICB0aGlzLnJvdW5kKys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gICNhaVNoaXBzKCkge1xuICAgIGNvbnN0IHNoaXBTaXplcyA9IFs1LCA0LCAzLCAzLCAyXTtcbiAgICBzaGlwU2l6ZXMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgbGV0IGNvb3JkaW5hdGVzID0gdGhpcy4jYWlTaGlwUGxhY2VtZW50KHNoaXApO1xuXG4gICAgICB3aGlsZSAoIWNvb3JkaW5hdGVzKSB7XG4gICAgICAgIGNvb3JkaW5hdGVzID0gdGhpcy4jYWlTaGlwUGxhY2VtZW50KHNoaXApO1xuICAgICAgfVxuXG4gICAgICAvLyBzaG93IGFpIHNoaXBzIHdoaWxlIHRlc3RpbmcuXG4gICAgICBjb29yZGluYXRlcy5mb3JFYWNoKChjb29yZCkgPT4ge1xuICAgICAgICB0aGlzLnBhZ2Uuc2hpcCh0aGlzLiNmaW5kR3JpZEl0ZW0oY29vcmQsIFwiYWlcIikpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAjYWlTaGlwUGxhY2VtZW50KHNoaXApIHtcbiAgICBsZXQgb3JpZW50YXRpb24gPSB0aGlzLiNyYW5kb21OdW0oMikgPT09IDAgPyBcImhvcml6b250YWxcIiA6IFwidmVydGljYWxcIjtcbiAgICBsZXQgY29vcmQgPVxuICAgICAgb3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiXG4gICAgICAgID8gW3RoaXMuI3JhbmRvbU51bSgxMCAtIHNoaXApLCB0aGlzLiNyYW5kb21OdW0oMTApXVxuICAgICAgICA6IFt0aGlzLiNyYW5kb21OdW0oMTApLCB0aGlzLiNyYW5kb21OdW0oMTAgLSBzaGlwKV07XG4gICAgbGV0IGNvb3JkaW5hdGVzID0gdGhpcy5haS5ib2FyZC5wbGFjZVNoaXAoc2hpcCwgY29vcmQsIG9yaWVudGF0aW9uKTtcbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gIH1cblxuICAjcmFuZG9tTnVtKG1heCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xuICB9XG5cbiAgI2ZpbmRHcmlkSXRlbShjb29yZCwgcGxheWVyKSB7XG4gICAgY29uc3QgZ3JpZEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLmdyaWQtaXRlbS4ke3BsYXllcn1gKTtcbiAgICBsZXQgZm91bmRJdGVtID0gZmFsc2U7XG4gICAgZ3JpZEl0ZW1zLmZvckVhY2goKGdyaWRJdGVtKSA9PiB7XG4gICAgICBpZiAoZ3JpZEl0ZW0uZGF0YXNldC5jb29yZGluYXRlcyA9PT0gY29vcmQudG9TdHJpbmcoKSkge1xuICAgICAgICBmb3VuZEl0ZW0gPSBncmlkSXRlbTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZm91bmRJdGVtO1xuICB9XG5cbiAgI2dhbWVPdmVyKCkge1xuICAgIGlmICh0aGlzLmh1bWFuLmJvYXJkLmdhbWVPdmVyKCkgfHwgdGhpcy5haS5ib2FyZC5nYW1lT3ZlcigpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IEdhbWVib2FyZCBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IoaHVtYW49dHJ1ZSkge1xuICAgIHRoaXMuYm9hcmQgPSBuZXcgR2FtZWJvYXJkO1xuICAgIHRoaXMuaXNIdW1hbiA9IGh1bWFuO1xuICAgIHRoaXMucHJldmlvdXNQbGF5cyA9IFtdO1xuICB9O1xuXG4gIGF0dGFjayhwbGF5ZXIsIGNvb3JkaW5hdGUpIHtcbiAgICBpZiAoIXRoaXMuaXNIdW1hbikge1xuICAgICAgY29vcmRpbmF0ZSA9IHRoaXMuI2FpQXR0YWNrKHBsYXllci5ib2FyZCk7XG4gICAgfVxuXG4gICAgdGhpcy5wcmV2aW91c1BsYXlzLnB1c2goY29vcmRpbmF0ZSk7XG4gICAgcGxheWVyLmJvYXJkLnJlY2VpdmVBdHRhY2soY29vcmRpbmF0ZSk7XG4gIH1cblxuICAjYWlBdHRhY2soYm9hcmQpIHtcbiAgICBsZXQgY29vcmRpbmF0ZSA9IHRoaXMuI3JhbmRvbUNvb3JkKCk7XG4gICAgaWYgKHRoaXMucHJldmlvdXNQbGF5cy5pbmNsdWRlcyhjb29yZGluYXRlKSkge1xuICAgICAgdGhpcy4jYWlBdHRhY2soYm9hcmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY29vcmRpbmF0ZTtcbiAgICB9XG4gIH1cblxuICAvLyBHZW5lcmF0ZSByYW5kb20gY29vcmRpbmF0ZXMgYmV0d2VlbiAwIC0gOS5cbiAgI3JhbmRvbUNvb3JkKCkge1xuICAgIHJldHVybiBbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApLCBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCldO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTaGlwIHtcbiAgY29uc3RydWN0b3Ioc2l6ZSkge1xuICAgIHRoaXMubGVuZ3RoID0gc2l6ZTtcbiAgICB0aGlzLmhpdHMgPSAwO1xuICAgIHRoaXMuc3VuayA9IGZhbHNlO1xuICB9XG5cbiAgaGl0KCkge1xuICAgIHRoaXMuaGl0cysrO1xuICAgIHRoaXMuaXNTdW5rKCk7XG4gIH1cblxuICBpc1N1bmsoKSB7XG4gICAgaWYgKHRoaXMuaGl0cyA9PT0gdGhpcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc3VuayA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN1bms7XG4gIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEdhbWVsb29wIGZyb20gXCIuL2dhbWVsb29wXCI7XG5cbmNvbnN0IGdhbWUgPSBuZXcgR2FtZWxvb3AoKTtcbmdhbWUuc3RhcnQoKTtcbiJdLCJuYW1lcyI6WyJET01idWlsZGVyIiwiY29uc3RydWN0b3IiLCJzaGlwcyIsInNoaXBOYW1lcyIsInNoaXBTaXplcyIsImdhbWVDb250YWluZXIiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwicGxheWVyQ29udGFpbmVyIiwiY3JlYXRlRWxlbWVudCIsImFpQ29udGFpbmVyIiwiY2xhc3NMaXN0IiwiYWRkIiwicGxheWVyVGl0bGUiLCJ0ZXh0Q29udGVudCIsImFpVGl0bGUiLCJwbGF5ZXJHcmlkIiwiZ3JpZFBvcHVsYXRlIiwiYWlHcmlkIiwicGxheWVyTXNnIiwiY3JlYXRlVGV4dE5vZGUiLCJ1cGRhdGVQbGF5ZXJNc2ciLCJpZCIsIm9yaWVudGF0aW9uQnRuIiwiYXBwZW5kIiwiaGl0IiwiZ3JpZEl0ZW0iLCJyZW1vdmUiLCJtaXNzIiwic2hpcCIsImhpZGVFbGVtZW50IiwiZWxlbWVudCIsInN0eWxlIiwiZGlzcGxheSIsImNvdW50ZXIiLCJtc2ciLCIjZ3JpZFBvcHVsYXRlIiwicGxheWVyIiwiZ3JpZCIsImkiLCJkYXRhc2V0IiwiY29vcmRpbmF0ZXMiLCJjb29yZHNQb3B1bGF0ZSIsImFwcGVuZENoaWxkIiwiI2Nvb3Jkc1BvcHVsYXRlIiwiZGlnaXRzIiwidG9TdHJpbmciLCJzcGxpdCIsIlNoaXAiLCJHYW1lYm9hcmQiLCJhbGxTaGlwcyIsIm1pc3NlZFNob3RzIiwicGxhY2VTaGlwIiwic2l6ZSIsImZpcnN0Q29vcmQiLCJvcmllbnRhdGlvbiIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsImJ1aWxkQ29vcmRpbmF0ZXMiLCJmb3JFYWNoIiwiY29vcmQiLCJmaW5kU2hpcCIsIm5ld1NoaXAiLCJzaGlwRW50cnkiLCJwdXNoIiwicmVjZWl2ZUF0dGFjayIsImNvb3JkaW5hdGUiLCJnYW1lT3ZlciIsImFsbFN1bmsiLCJpc1N1bmsiLCIjYnVpbGRDb29yZGluYXRlcyIsIiNmaW5kU2hpcCIsImZvdW5kU2hpcCIsInNvbWUiLCJ4IiwiUGxheWVyIiwiR2FtZWxvb3AiLCJodW1hbiIsImFpIiwicGxheWVycyIsImN1cnJlbnRQbGF5ZXIiLCJyb3VuZCIsInBhZ2UiLCJzdGFydCIsImFpU2hpcHMiLCJhaUdyaWRMaXN0ZW5lcnMiLCJodW1hbkdyaWRMaXN0ZW5lcnMiLCJjdXJyZW50Um91bmQiLCJwbGF5Um91bmQiLCJzZXRUaW1lb3V0IiwiI3BsYXlSb3VuZCIsIm9yaWVudGF0aW9uQnRuTGlzdGVuZXIiLCJncmlkSXRlbXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwicGxhY2VtZW50Q291bnRlciIsInNoaXBTaXplIiwiaXRlbSIsImFkZEV2ZW50TGlzdGVuZXIiLCJjb29yZHMiLCJtYXAiLCJwYXJzZUludCIsImJvYXJkIiwiZmluZEdyaWRJdGVtIiwiI29yaWVudGF0aW9uQnRuTGlzdGVuZXIiLCJ0ZXh0IiwiI2FpU2hpcHMiLCJhaVNoaXBQbGFjZW1lbnQiLCIjYWlTaGlwUGxhY2VtZW50IiwicmFuZG9tTnVtIiwiI3JhbmRvbU51bSIsIm1heCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIiNmaW5kR3JpZEl0ZW0iLCJmb3VuZEl0ZW0iLCIjZ2FtZU92ZXIiLCJpc0h1bWFuIiwicHJldmlvdXNQbGF5cyIsImF0dGFjayIsImFpQXR0YWNrIiwiI2FpQXR0YWNrIiwicmFuZG9tQ29vcmQiLCJpbmNsdWRlcyIsIiNyYW5kb21Db29yZCIsImhpdHMiLCJzdW5rIiwiZ2FtZSJdLCJzb3VyY2VSb290IjoiIn0=