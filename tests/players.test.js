import Player from "../src/players";


test('a human player is created', () => {
  const player = new Player(true);
  expect(player.isHuman).toBe(true);
});

test('an ai player is created', () => {
  const player = new Player(false);
  expect(player.isHuman).toBe(false);
})

test('a human player can attack another player', () => {
  const humanPlayer = new Player(true);
  const aiPlayer = new Player(false);
  humanPlayer.attack(aiPlayer, [0, 0]);
  expect(aiPlayer.board.missedShots.length).toBe(1);
})

test('an ai player can attack another player', () => {
  const humanPlayer = new Player(true);
  const aiPlayer = new Player(false);
  aiPlayer.attack(humanPlayer);
  expect(humanPlayer.board.missedShots.length).toBe(1);
})
