import Gameboard from "../src/gameboard";

test('a ship is placed at a coordinate', () => {
  const board = new Gameboard;
  board.placeShip(1, [0, 0]);
  expect(board.allShips.length).toBe(1);
})

test('multiple ships can be placed on board', () => {
  const board = new Gameboard;
  board.placeShip(1, [0, 0]);
  board.placeShip(2, [1, 0]);
  expect(board.allShips.length).toBe(2);
})

test('ship of size 4 is placed at mutliple coordinates', () => {
  const board = new Gameboard;
  board.placeShip(4, [0, 0]);
  expect(board.allShips[0][1]).toStrictEqual([[0, 0],[1, 0],[2, 0], [3, 0]])
})

test('ship of size 10 is placed at multiple coordinates', () => {
  const board = new Gameboard;
  board.placeShip(10, [0, 0]);
  expect(board.allShips[0][1].length).toBe(10);
})

test('Gameboard received an attack and hits the correct ship', () => {
  const board = new Gameboard;
  board.placeShip(3, [0, 0]);
  board.receiveAttack([1, 0]);
  expect(board.allShips[0][0].hits).toBe(1);
})

test('Gameboard receives a missed attack and records it', () => {
  const board = new Gameboard;
  board.receiveAttack([1, 0]);
  expect(board.missedShots.length).toBe(1);
})

test('gameOver returns true when all ships are sunk', () => {
  const board = new Gameboard;
  board.placeShip(1, [0, 0]);
  board.receiveAttack([0, 0]);
  expect(board.gameOver()).toBe(true);
})

test('gameOver returns false if not all ships are sunk', () => {
  const board = new Gameboard;
  board.placeShip(1, [0, 0]);
  board.placeShip(2, [1, 0]);
  board.receiveAttack([0, 0]);
  expect(board.gameOver()).toBe(false);
})
