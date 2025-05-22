function generateRandomCode(length = 32) {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

let grid = {
  collisionArray: [],
  collisionNumbersArray: [[], []],
  exportedArray: "",
  array: [],
  dotCount: 64,
  speed: 100,
  marg: 5,
  changer: 15,
  container: document.getElementById('display'),
  newContainer: document.createElement("div"),
  xMid: document.getElementById("display").getBoundingClientRect().width / 2,
  yMid: (document.getElementById("display").getBoundingClientRect().width / 2) + document.getElementById("display").getBoundingClientRect().y,
  size: { x: 0, y: 0 },
  calcSize: () => {
    grid.size.x = 800;
    grid.size.y = 800;
  },
  createCollisionStorage: () => {
    for (let k = 0; k < 64; k++) {
      grid.collisionArray.push([]);
    }
  },
  createCollision: () => {
    console.log(grid.xMid);
    for (let clearNum = 0; clearNum < grid.collisionNumbersArray.length; clearNum++) {
      grid.collisionNumbersArray[clearNum] = [];
    }
    for (let m = 0; m < grid.collisionArray.length; m++) {
      for (let k = 0; k < grid.collisionArray[m].length; k++) {
        let check = grid.collisionArray[m][k].body.getBoundingClientRect();
        let position = grid.collisionArray[m][k].position;
        let obj = grid.collisionArray[m][k];
        let x1 = check.x;
        let x2 = x1 + check.width;
        let y1 = check.y;
        let y2 = y1 - check.height
        let gathered = { position: position, obj: obj, x1: x1, x2: x2, y1: y1, y2: y2 };
        let hash = 0;
        if (x2 < grid.xMid) {
          hash = 0;
        } else {
          hash = 1;
        }
        console.log(hash);
        grid.collisionNumbersArray[hash].push(gathered);
      }
    }
    console.log(grid.collisionNumbersArray);
  },
  collisionCheck: () => {
    document.body.addEventListener("touchmove", (event) => {
      event.preventDefault();
      event.stopPropagation();
      let userX = event.touches[0].clientX;
      let userY = event.touches[0].clientY;
      let hash = 0;
      console.log(userX);
      if (userX < grid.xMid) {
        hash = 0;
      } else {
        hash = 1
      }
      for (let m = 0; m < grid.collisionNumbersArray[hash].length; m++) {
        if (userX > grid.collisionNumbersArray[hash][m].x1 && userX < grid.collisionNumbersArray[hash][m].x2 && userY < grid.collisionNumbersArray[hash][m].y1 && userY > grid.collisionNumbersArray[hash][m].y2) {
          console.log(grid.collisionNumbersArray[hash][m].position.x);
          if (controls.brush.color === true) {
            for (let checkX = Math.round((controls.brush.size / 2) - controls.brush.size); checkX < controls.brush.size; checkX++) {
              for (let checkY = Math.round((controls.brush.size / 2) - controls.brush.size); checkY < controls.brush.size; checkY++) {
                grid.array[grid.collisionNumbersArray[hash][m].position.x + checkX][grid.collisionNumbersArray[hash][m].position.y + checkY].active = true;
                grid.array[grid.collisionNumbersArray[hash][m].position.x + checkX][grid.collisionNumbersArray[hash][m].position.y + checkY].dot.classList.remove("colorRevert");
                grid.array[grid.collisionNumbersArray[hash][m].position.x + checkX][grid.collisionNumbersArray[hash][m].position.y + checkY].dot.classList.add("colorChange");
              }
            }
          } else {
            for (let checkX = Math.round((controls.brush.size / 2) - controls.brush.size); checkX < controls.brush.size; checkX++) {
              for (let checkY = Math.round((controls.brush.size / 2) - controls.brush.size); checkY < controls.brush.size; checkY++) {
                grid.array[grid.collisionNumbersArray[hash][m].position.x + checkX][grid.collisionNumbersArray[hash][m].position.y + checkY].active = false;
                grid.array[grid.collisionNumbersArray[hash][m].position.x + checkX][grid.collisionNumbersArray[hash][m].position.y + checkY].dot.classList.remove("colorChange");
                grid.array[grid.collisionNumbersArray[hash][m].position.x + checkX][grid.collisionNumbersArray[hash][m].position.y + checkY].dot.classList.add("colorRevert");
              }
            }
          }
        }
      }
    }, { passive: false });
  },
  create: () => {
    function dot(x, y) {
      this.body = document.createElement("div");
      this.dot = document.createElement("div");
      this.position = { x: x, y: y };
      this.active = false;
      this.createSelf = (that) => {
        that.body.setAttribute('draggable', false);
        that.dot.setAttribute('draggable', false);
        that.body.classList.add("dotBody");
        that.body.appendChild(that.dot);
        that.dot.classList.add("dot");
        that.body.style.width = (grid.size.x / grid.dotCount) * .14 + "%";
        that.body.style.height = (grid.size.y / grid.dotCount) * .14 + "%";
        grid.newContainer.appendChild(that.body);
        that.body.style.left = (x / grid.dotCount) * 100 + "%";
        that.body.style.top = (y / grid.dotCount) * 100 + "%";
        grid.collisionArray[that.position.x][that.position.y] = that;
        that.body.addEventListener("mousemove", () => {
          if (controls.user.isClicking === true) {
            if (controls.brush.color === true) {
              for (let checkX = Math.round((controls.brush.size / 2) - controls.brush.size); checkX < controls.brush.size; checkX++) {
                for (let checkY = Math.round((controls.brush.size / 2) - controls.brush.size); checkY < controls.brush.size; checkY++) {
                  grid.array[x + checkX][y + checkY].active = true;
                  grid.array[x + checkX][y + checkY].dot.classList.remove("colorRevert");
                  grid.array[x + checkX][y + checkY].dot.classList.add("colorChange");
                }
              }
            } else {
              for (let checkX = Math.round((controls.brush.size / 2) - controls.brush.size); checkX < controls.brush.size; checkX++) {
                for (let checkY = Math.round((controls.brush.size / 2) - controls.brush.size); checkY < controls.brush.size; checkY++) {
                  grid.array[x + checkX][y + checkY].active = false;
                  grid.array[x + checkX][y + checkY].dot.classList.remove("colorChange");
                  grid.array[x + checkX][y + checkY].dot.classList.add("colorRevert");
                }
              }
            }
          }
        });
      };
      this.createSelf(this);
    }
    for (let x = 0; x < grid.dotCount; x++) {
      grid.array[x] = [];
      for (let y = 0; y < grid.dotCount; y++) {
        grid.array[x][y] = new dot(x, y);
      }
    }
    grid.container.replaceWith(grid.newContainer);
    grid.newContainer.setAttribute('id', 'display');
    grid.createCollision();
  },
  clear: () => {
    for (let x = 0; x < grid.array.length; x++) {
      function loop(y) {
        if (y < grid.array[x].length) {
          if (grid.array[x][y].active == true) {
            grid.array[x][y].active = false;
            grid.array[x][y].dot.classList.remove("colorChange");
            grid.array[x][y].dot.classList.add("colorRevert");
            if (grid.speed < 200) {
              grid.speed += grid.changer;
            }
            setTimeout(() => { loop(y + 1) }, grid.speed);
          } else {
            if (grid.speed > 10) {
              grid.speed -= grid.changer;
            }
            loop(y + 1);
          }
        }
      }
      loop(0);
    }
  },
  clearReverse: () => {
    for (let x = grid.array.length - 1; x >= 0; x--) {
      function loop(y) {
        if (y >= 0) {
          if (grid.array[x][y].active == true) {
            grid.array[x][y].active = false;
            grid.array[x][y].dot.classList.remove("colorChange");
            grid.array[x][y].dot.classList.add("colorRevert");
            if (grid.speed < 200) {
              grid.speed += grid.changer;
            }
            setTimeout(() => { loop(y - 1) }, grid.speed);
          } else {
            if (grid.speed > 10) {
              grid.speed -= grid.changer;
            }
            loop(y - 1);
          }
        }
      }
      loop(grid.array[x].length - 1);
    }
  },
  pattern: (map) => {
    console.log(map);
    let rows = map.split("#");
    let storage = [];
    for (let columns = 0; columns < rows.length; columns++) {
      storage[columns] = rows[columns].split("");
    }
    for (let x = 0; x < grid.array.length; x++) {
      function loop(y) {
        if (y < grid.array[x].length) {
          if (storage[x][y] == 1) {
            grid.array[x][y].active = true;
            grid.array[x][y].dot.classList.remove("colorRevert");
            grid.array[x][y].dot.classList.add("colorChange");
            if (grid.speed < 200) {
              grid.speed += grid.changer;
            }
            setTimeout(() => { loop(y + 1) }, grid.speed);
          } else {
            if (grid.speed > 10) {
              grid.speed -= grid.changer;
            }
            loop(y + 1);
          }
        }
      }
      loop(0);
    }
  },
  pushData: async () => {
    grid.exportedArray = "";
    for (let x = 0; x < grid.array.length; x++) {
      for (let y = 0; y < grid.array[x].length; y++) {
        if (grid.array[x][y].active) {
          grid.exportedArray += "1";
        } else {
          grid.exportedArray += "0";
        }
      }
      grid.exportedArray += "#";
    }

    console.log(grid.exportedArray);
    try {
      const formData = new FormData();
      formData.append('title', document.getElementById("canvasTitle").value);
      formData.append('map', grid.exportedArray);
      formData.append('code', generateRandomCode()); // You'll need this function

      const response = await fetch('/createDisplay', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Drawing saved successfully!");
      grid.clearReverse();

    } catch (error) {
      console.error("Error saving drawing:", error);
      throw error; // Re-throw so createSubmitButton can handle it
    }
  },
  pullData: (query) => {
    $(document).ready(function () {
      $.ajax({
        url: "../gridPhp/pullCanvasDots.php",
        type: 'GET',
        success: function (result) {
          let resultArray = result.split("&");
          console.log(resultArray);
          if (result != false) {
            document.getElementById("canvasTitle").value = resultArray[1];
            grid.pattern(resultArray[0]);
          }
        }
      });
    });
  },
  initilize: () => {
    grid.calcSize();
    grid.dotCount = 64;
    grid.create();
  },
};

let controls = {
  disable: false,
  submitButton: document.getElementById("canvasSubmit"),
  colorIndicator: document.createElement("div"),
  brushSizeIndicator: document.createElement("div"),
  user: {
    isClicking: false,
  },
  brush: {
    color: true,
    size: 1,
    changeSize: (n) => {
      controls.brush.size += n;
      console.log(controls.brush.size);
      controls.brushSizeIndicator.style.width = (controls.brush.size * 4) + 8 + "px";
      controls.brushSizeIndicator.style.height = (controls.brush.size * 4) + 8 + "px";
    },
    changeColor: () => {
      if (controls.brush.color == false) {
        controls.brush.color = true;
        controls.colorIndicator.style.background = "radial-gradient(rgb(40,40,40) 45%, rgba(220,220,220,.5))";
      } else {
        controls.brush.color = false;
        controls.colorIndicator.style.background = "radial-gradient(rgba(220,220,220,.5) 55%, rgb(40,40,40))";
      }
    },
  },
  buttonElements: {
    increase: document.createElement("div"),
    decrease: document.createElement("div"),
    color: document.createElement("div"),
    clear: document.createElement("div"),
  },
  functions: {
    createButtonVisuals: () => {
      let container = document.getElementById("controls");
      let brushSizeContainer = document.createElement("div");
      brushSizeContainer.classList.add("shadow");
      brushSizeContainer.style.position = "absolute";
      brushSizeContainer.style.top = "-10%";
      container.appendChild(brushSizeContainer);
      brushSizeContainer.appendChild(controls.brushSizeIndicator);
      controls.brushSizeIndicator.classList.add("brushSizeIndicator");
      controls.brushSizeIndicator.style.width = (controls.brush.size * 4) + 8 + "px";
      controls.brushSizeIndicator.style.height = (controls.brush.size * 4) + 8 + "px";


      for (const [key, value] of Object.entries(controls.buttonElements)) {
        value.classList.add("controlButton");
        value.classList.add("shadow");
        container.appendChild(value);
      }
      let minus = document.createElement("p");
      let minusText = document.createTextNode("-");
      minus.appendChild(minusText);
      minus.classList.add("alignText");
      minus.classList.add("noselect");
      controls.buttonElements.decrease.appendChild(minus);

      let plus = document.createElement("p");
      let plusText = document.createTextNode("+");
      plus.appendChild(plusText);
      plus.classList.add("alignText");
      plus.classList.add("noselect");
      controls.buttonElements.increase.appendChild(plus);

      let c = document.createElement("p");
      let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svg.setAttribute("height", "1em");
      svg.setAttribute("fill", "currentColor");
      svg.setAttribute("viewBox", "0 0 512 512");
      let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M 189 27 L 166 64 L 189 27 L 166 64 L 346 64 L 346 64 L 323 27 L 323 27 Q 315 16 302 16 L 210 16 L 210 16 Q 197 16 189 27 L 189 27 Z M 148 64 L 176 19 L 148 64 L 176 19 Q 188 1 210 0 L 302 0 L 302 0 Q 324 1 336 19 L 364 64 L 364 64 L 472 64 L 472 64 Q 479 65 480 72 Q 479 79 472 80 L 40 80 L 40 80 Q 33 79 32 72 Q 33 65 40 64 L 148 64 L 148 64 Z M 72 112 Q 79 113 80 120 L 80 440 L 80 440 Q 81 464 96 480 Q 112 495 136 496 L 376 496 L 376 496 Q 400 495 416 480 Q 431 464 432 440 L 432 120 L 432 120 Q 433 113 440 112 Q 447 113 448 120 L 448 440 L 448 440 Q 447 471 427 491 Q 407 511 376 512 L 136 512 L 136 512 Q 105 511 85 491 Q 65 471 64 440 L 64 120 L 64 120 Q 65 113 72 112 L 72 112 Z M 168 160 L 168 416 L 168 160 L 168 416 Q 167 423 160 424 Q 153 423 152 416 L 152 160 L 152 160 Q 153 153 160 152 Q 167 153 168 160 L 168 160 Z M 264 160 L 264 416 L 264 160 L 264 416 Q 263 423 256 424 Q 249 423 248 416 L 248 160 L 248 160 Q 249 153 256 152 Q 263 153 264 160 L 264 160 Z M 360 160 L 360 416 L 360 160 L 360 416 Q 359 423 352 424 Q 345 423 344 416 L 344 160 L 344 160 Q 345 153 352 152 Q 359 153 360 160 L 360 160 Z");
      svg.appendChild(path);
      c.appendChild(svg);
      c.classList.add("clearButton");
      c.classList.add("alignText");
      c.classList.add("noselect");
      controls.buttonElements.clear.appendChild(c);

      controls.colorIndicator.classList.add("indicator");
      controls.colorIndicator.style.background = "radial-gradient(rgb(40,40,40) 45%, rgba(220,220,220,.5))";
      controls.buttonElements.color.appendChild(controls.colorIndicator);
    },
    createKeyPress: () => {
      document.body.addEventListener("keydown", (event) => {
        if (event.key == " " || event.code == "Space" || event.keyCode == 32) {
          controls.brush.changeColor();
        }
        if (event.key == "[" && controls.brush.size > 1) {
          controls.brush.changeSize(-1);
        }
        if (event.key == "]" && controls.brush.size < 4) {
          controls.brush.changeSize(1);
        }
      });
      document.body.addEventListener("touchstart", () => {
        controls.user.isClicking = true;
      });
      document.body.addEventListener("mousedown", () => {
        controls.user.isClicking = true;
      });
      document.body.addEventListener("mouseup", () => {
        controls.user.isClicking = false;
      });
      document.body.addEventListener("touchend", () => {
        controls.user.isClicking = true;
      });
    },
    createButtons: () => {
      console.log("creatingButtons");
      controls.buttonElements.increase.addEventListener("click", () => {
        if (controls.brush.size < 4) {
          controls.brush.changeSize(1);
        }
      });
      controls.buttonElements.decrease.addEventListener("click", () => {
        if (controls.brush.size > 1) {
          controls.brush.changeSize(-1);
        }
      });
      controls.buttonElements.color.addEventListener("click", () => {
        console.log("o");
        controls.brush.changeColor();
      });
      controls.buttonElements.clear.addEventListener("click", () => {
        console.log("Clearing");
        grid.clear();
      });
    },
    createSubmitButton: () => {
      console.log("submitButton Active");
      controls.submitButton.addEventListener("click", async () => {
        if (controls.disable == false) {
          controls.disable = true;
          grid.pushData();
          setTimeout(() => {
            window.location.href = "/gallery";
          }, 3000);
        } else {
          console.log("cant Upload Again");
        }
      });
    },
  },
  initilize: () => {
    controls.functions.createButtonVisuals();
    controls.functions.createKeyPress();
    controls.functions.createSubmitButton();
    controls.functions.createButtons();
  },
};

grid.createCollisionStorage();
controls.initilize();
grid.initilize();
grid.pullData();
grid.collisionCheck();

document.body.addEventListener("scroll", () => {
  grid.createCollision();
});
