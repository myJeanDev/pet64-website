let galleryArray = [];
let gatheredData = [];

function rand(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

async function pullDisplayData() {
  try {
    const response = await fetch('/displays');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const displays = await response.json();
    displays.forEach(display => {
      const date = new Date(display.timeCreated).toLocaleDateString();
      const displayArray = [
        display.title,
        date,
        display.dotImage,
        display.uuid
      ];
      createGalleryGrid(displayArray);
    });

  } catch (error) {
    console.error('Error fetching displays:', error);
  }
}

function stringToArray(array) {
  let rows = array.split("#");
  let storage = [];
  for (let columns = 0; columns < rows.length; columns++) {
    storage[columns] = rows[columns].split("");
  }
  return storage;
}

function mapConversion(map) {
  let reduction = 2;
  let newMap = [];
  let average = 0;
  for (let x = 0; x < map.length; x += reduction) {
    newMap[x / reduction] = [];
    for (let y = 0; y < map[x].length; y += reduction) {
      average = 0;
      for (let checkX = 0; checkX < reduction; checkX++) {
        for (let checkY = 0; checkY < reduction; checkY++) {
          if (map[x + checkX][y + checkY] == 1) {
            average++;
          }
        }
      }
      if (average > (reduction * reduction) - reduction) {
        newMap[x / reduction][y / reduction] = 1;
      } else if (average == (reduction * reduction) / 2) {
        newMap[x / reduction][y / reduction] = .5;
      } else {
        newMap[x / reduction][y / reduction] = 0;
      }
    }
  }
  return newMap;
}

function pageDisplay(map) {
  let previewBoxContainer = document.createElement("div");
  let previewBox = {
    body: document.createElement("div"),
    array: [],
  };

  let exitButton = document.createElement("div");
  exitButton.classList.add("buttonSmaller");
  exitButton.classList.add("shadow");
  exitButton.classList.add("exitButton");
  exitButton.innerHTML = "x";
  exitButton.addEventListener("click", () => {
    document.body.removeChild(previewBoxContainer);
  });
  previewBoxContainer.classList.add("previewBoxContainer");
  previewBox.body.classList.add("previewBox");
  createDots(map, previewBox);
  previewBox.body.appendChild(exitButton);
  previewBoxContainer.appendChild(previewBox.body);

  document.body.appendChild(previewBoxContainer);
  let rowBounceNumber = previewBox.array.length / 2;
  function bounceAnimation(n) {
    for (let m = 0; m < previewBox.array.length; m++) {
      for (let k = 0; k < rowBounceNumber; k++) {
        let percentString = previewBox.array[m][k].body.style.top;
        let removedPercent = percentString.toString().replace('%', '');
        removedPercent -= n;
        previewBox.array[m][k].body.style.top = removedPercent + "%";
      }
    }
    setTimeout(() => {
      bounceAnimation(n * -1);
    }, 1000);
  }
  bounceAnimation(-1.3999999999);
}

function createGalleryGrid(array) {
  new grid(stringToArray(array[2]), mapConversion(stringToArray(array[2])), array[1], array[0], array[3]);
}

function grid(originalMap, map, date, title, uniqueId) {
  console.log("grid: " + uniqueId);
  this.container = document.createElement("div");
  this.textContainer = document.createElement("div");
  this.title = document.createElement("div");
  this.author = document.createElement("div");
  this.body = document.createElement("div");
  this.originalMap = originalMap;
  this.map = map;
  this.array = [];
  this.create = (that) => {
    that.container.classList.add("galleryRow");
    that.container.appendChild(that.body);
    that.container.appendChild(that.textContainer);
    that.textContainer.appendChild(that.title);
    that.textContainer.appendChild(that.author);
    that.title.classList.add("galleryText");
    that.textContainer.classList.add("galleryTextContainer");
    that.body.classList.add("galleryGrid");
    that.title.innerHTML = title;
    that.author.innerHTML = date;
    that.author.classList.add("galleryTextSmaller");
    createDots(map, that);
    document.getElementById("galleryContainer").appendChild(that.container);
    that.body.addEventListener("click", () => {
      pageDisplay(that.originalMap);
    });
  };
  this.rowBounceNumber = map.length / 2;
  this.bounceAnimation = (n, that) => {
    for (let m = 0; m < that.array.length; m++) {
      for (let k = 0; k < this.rowBounceNumber; k++) {
        let percentString = that.array[m][k].body.style.top;
        let removedPercent = percentString.toString().replace('%', '');
        removedPercent -= n;
        that.array[m][k].body.style.top = removedPercent + "%";
      }
    }
    setTimeout(() => {
      this.bounceAnimation(n * -1, that);
    }, rand(2500, 4500));
  }
  this.bounceAnimation(3, this);
  this.create(this);
}

function createDots(map, parent) {
  for (let x = 0; x < map.length - 1; x++) {
    parent.array[x] = [];
    for (let y = 0; y < map.length - 1; y++) {
      let active = map[x][y];
      parent.array[x][y] = new dot(parent, x, y, map.length - 1, active);
    }
  }
};

function dot(parent, x, y, count, active) {
  this.body = document.createElement("div");
  this.dot = document.createElement("div");
  this.active = active;
  this.createSelf = (that) => {
    if (active == 1) {
      that.dot.classList.add("activeDot");
    } else if (active == .5) {
      that.dot.classList.add("halfActiveDot");
    }
    that.body.classList.add("dotBody");
    that.body.appendChild(that.dot);
    that.dot.classList.add("dot");
    that.body.style.width = (300 / count) * .29 + "%";
    that.body.style.height = (300 / count) * .29 + "%";
    that.body.style.left = (x / count) * 100 + "%";
    that.body.style.top = (y / count) * 100 + "%";
    parent.body.appendChild(that.body);
  };
  this.createSelf(this);
}

document.addEventListener('DOMContentLoaded', pullDisplayData);