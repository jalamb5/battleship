import DOMbuilder from "./domBuilder";
import Gameloop from "./gameloop";

const page = new DOMbuilder();
const game = new Gameloop();
game.gridListeners();
