const gameboard = require('../src/gameboard');

test('a ship is placed at a coordinate', () => {
  const board = new gameboard;
  board.placeShip(1, [0, 0]);
  expect(board.allShips.length).toBe(1);
})
