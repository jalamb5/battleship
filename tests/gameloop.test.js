const gameloop = require('../src/gameloop');

test('a new game creates 2 players', () => {
  const game = new gameloop;
  expect(game.players.length).toBe(2);
})
