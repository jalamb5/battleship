import Player from './players';

export default class Gameloop {
  constructor() {
    const human = new Player(true);
    const ai = new Player(false);
    this.players = [human, ai];
  }
}

module.exports = Gameloop;
