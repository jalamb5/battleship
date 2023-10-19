const Player = require('../src/players');

test('a player is created', () => {
  const player = new Player;
  expect(player).toBeTruthy();
});
