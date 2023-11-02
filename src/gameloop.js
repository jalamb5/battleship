import Player from './players';
import DOMbuilder from './domBuilder';

export default class Gameloop {
  constructor() {
    this.human = new Player(true);
    this.ai = new Player(false);
    this.players = [this.human, this.ai];
    this.page = new DOMbuilder;
  }

  gridListeners() {
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach((item) => {
      item.addEventListener("click", () => {
        let coords = item.dataset.coordinates.split(',').map((x) => parseInt(x, 10));
        if (this.ai.board.receiveAttack(coords)) {
          // if a ship is hit then ...
          this.page.hit(item);
        } else {
          // if a ship is not hit then ...
          this.page.miss(item);
        }
      })
    })
  }
}
