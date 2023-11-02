import Player from './players';
import DOMbuilder from './domBuilder';

export default class Gameloop {
  constructor() {
    const human = new Player(true);
    const ai = new Player(false);
    this.players = [human, ai];
  }

  gridListeners() {
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach((item) => {
      item.addEventListener("click", () => {
        let coords = item.dataset.coordinates.split(',');
        console.log(coords);
      })
    })
  }
}

// module.exports = Gameloop;
