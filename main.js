import "./style.scss";

const GAME_SPEED = 250;
const keyCodes = ["KeyW", "KeyD", "KeyS", "KeyA"];

const TITLES = {
  win: "Перемога буде люди!!!",
  lose: "Зрада тотальна",
};

const DESCS = {
  win: "15 травня буде перемога!!!",
  lose: "Руки опускаються, в очах сльози",
};

class Game {
  constructor(width = 10, height = 10) {
    this.width = width;
    this.height = height;
    this.board = document.getElementById("board");
    this.scoreBoard = document.getElementById("score-count");
    this.head = {
      x: Math.floor(this.width / 2),
      y: Math.floor(this.height / 2),
    };
    this.results = document.getElementById("results");
    this.body = [];
    this.prevDir = "";
    this.direction = "";
    this.started = false;
    this.init();
    this.step();
  }

  init() {
    this.drawBoard();
    this.setListeners();
  }

  drawBoard() {
    for (let w = 0; w < this.width; w++) {
      const column = document.createElement("div");
      column.classList.add("column");
      for (let h = 0; h < this.height; h++) {
        const box = document.createElement("div");
        box.classList.add("box");
        column.appendChild(box);
      }
      this.board.appendChild(column);
    }
  }

  step() {
    if (this.started) {
      this.body.push({ ...this.head });
    }
    switch (this.direction) {
      case "up":
        this.head = { x: this.head.x, y: --this.head.y };
        break;
      case "right":
        this.head = { x: ++this.head.x, y: this.head.y };
        break;
      case "down":
        this.head = { x: this.head.x, y: ++this.head.y };
        break;
      case "left":
        this.head = { x: --this.head.x, y: this.head.y };
        break;
    }

    if (!this.stillLiving()) {
      return this.stopGame(false);
    }

    if (this.fruit?.x === this.head.x && this.fruit?.y === this.head.y) {
      this.spawnFruit();
    } else {
      this.body.shift();
    }
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const box = this.board.children[x].children[y];
        if (x === this.head.x && y === this.head.y) {
          box.classList.add("head");
        } else {
          box.classList.remove("head");
        }
        if (this.body.some((el) => el.y === y && el.x === x)) {
          box.classList.add("body");
        } else {
          box.classList.remove("body");
        }
        if (x === this.fruit?.x && y === this.fruit?.y) {
          box.classList.add("fruit");
        } else {
          box.classList.remove("fruit");
        }
      }
    }

    this.scoreBoard.innerHTML = this.body.length.toString();
  }

  stillLiving() {
    return (
      this.head.x < this.width &&
      this.head.y < this.height &&
      this.head.x !== -1 &&
      this.head.y !== -1 &&
      (!this.body.length ||
        !this.body.some((el) => el.x === this.head.x && el.y === this.head.y))
    );
  }

  runGame() {
    this.spawnFruit();
    this.interval = setInterval(() => {
      this.prevDir = this.direction;
      this.step();
    }, GAME_SPEED);
  }

  stopGame(win) {
    clearInterval(this.interval);
    this.results.children[0].children[0].innerHTML =
      TITLES[win ? "win" : "lose"];
    this.results.children[0].children[1].innerHTML =
      DESCS[win ? "win" : "lose"];
    this.results.classList.add("active");
  }

  restartGame() {
    this.results.classList.remove("active");
    this.body = [];
    this.head = {
      x: Math.floor(this.width / 2) - 1,
      y: Math.floor(this.height / 2),
    };
    this.started = false;
    this.step();
  }

  setListeners() {
    window.addEventListener("keydown", (e) => {
      if (keyCodes.includes(e.code) && !this.started) {
        this.runGame();
        this.started = true;
      }
      switch (e.code) {
        case "KeyW":
          this.direction !== "down" &&
            this.prevDir !== "down" &&
            (this.direction = "up");
          break;
        case "KeyD":
          this.direction !== "left" &&
            this.prevDir !== "left" &&
            (this.direction = "right");
          break;
        case "KeyS":
          this.direction !== "up" &&
            this.prevDir !== "up" &&
            (this.direction = "down");
          break;
        case "KeyA":
          this.direction !== "right" &&
            this.prevDir !== "right" &&
            (this.direction = "left");
          break;
      }
    });
  }
  spawnFruit() {
    const possibleCoords = [];
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (
          this.head.x !== x &&
          this.head.y !== y &&
          !this.body.some((el) => el.y === y && el.x === x)
        ) {
          possibleCoords.push({ x, y });
        }
      }
    }
    this.fruit =
      possibleCoords[Math.floor(Math.random() * possibleCoords.length)];
  }
}

window.game = new Game(11, 11);

document.getElementById("restart").addEventListener("click", () => {
  window.game.restartGame();
});
