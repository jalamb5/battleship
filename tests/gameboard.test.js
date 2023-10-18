const gameboard = require('../src/gameboard');

test('a ship is placed at a coordinate', () => {
  const board = new gameboard;
  board.placeShip(1, [0, 0]);
  expect(board.allShips.length).toBe(1);
})

test('multiple ships can be placed on board', () => {
  const board = new gameboard;
  board.placeShip(1, [0, 0]);
  board.placeShip(2, [1, 0]);
  expect(board.allShips.length).toBe(2);
})

test('ship of size 4 is placed at mutliple coordinates', () => {
  const board = new gameboard;
  board.placeShip(4, [0, 0]);
  expect(board.allShips[0][1]).toStrictEqual([[0, 0],[1, 0],[2, 0], [3, 0]])
})

test('ship of size 20 is placed at multiple coordinates', () => {
  const board = new gameboard;
  board.placeShip(20, [0, 0]);
  expect(board.allShips[0][1].length).toBe(20);
})

test('gameboard received an attack and hits the correct ship', () => {
  const board = new gameboard;
  board.placeShip(3, [0, 0]);
  board.receiveAttack([1, 0]);
  expect(board.allShips[0][0].hits).toBe(1);
})
