const Ship = require('../src/ships');

test("a ship is created of length 1", () => {
  const smallShip = new Ship(1);
  expect(smallShip.length).toBe(1);
});

test("a ship is created of length 20", () => {
  const largeShip = new Ship(20);
  expect(largeShip.length).toBe(20);
})

test("a ship can be hit", () => {
  const ship = new Ship(2);
  ship.hit();
  expect(ship.hits).toBe(1);
})

test("a ship can be sunk", () => {
  const ship = new Ship(1);
  ship.hit();
  expect(ship.sunk).toBe(true);
})
