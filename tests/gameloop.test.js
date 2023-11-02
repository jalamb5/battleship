import Gameloop from "../src/gameloop";

test('a new game creates 2 players', () => {
  const game = new Gameloop;
  expect(game.players.length).toBe(2);
})
