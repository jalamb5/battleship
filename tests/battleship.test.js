const Ship = require('../src/ships');

test("a ship is created of length 1", () => {
  const smallShip = new Ship(1);
  expect(smallShip.length).toBe(1);
});

test("a ship is created of length 20", () => {
  const largeShip = new Ship(20);
  expect(largeShip.length).toBe(20);
})
