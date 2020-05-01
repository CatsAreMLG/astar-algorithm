const cols = 25;
const rows = 25;
let grid = new Array(cols);

let openSet = [];
let closedSet = [];
let start;
let end;
let current;
let w, h;
let path = [];

function removeFromArray(arr, elt) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

function heuristic(a, b) {
  // return abs(a.x - b.x) + abs(a.y - b.y);
  return dist(a.x, a.y, b.x, b.y);
}

function Spot(x, y) {
  this.x = x;
  this.y = y;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.prev;
  this.neighbors = [];

  this.show = function (color) {
    fill(color);
    stroke(255);
    rect(this.x * w, this.y * h, w, h);
  };

  this.addNeighbors = function () {
    if (this.x < cols - 1) this.neighbors.push(grid[this.x + 1][this.y]);
    if (this.x > 0) this.neighbors.push(grid[this.x - 1][this.y]);
    if (this.y < rows - 1) this.neighbors.push(grid[this.x][this.y + 1]);
    if (this.y > 0) this.neighbors.push(grid[this.x][this.y - 1]);
  };
}

function setup() {
  createCanvas(400, 400);
  console.log('A*');

  w = width / cols;
  h = height / rows;

  // make 2d array
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeighbors();
    }
  }

  start = grid[0][0];
  end = grid[cols - 1][rows - 1];

  openSet.push(start);
}

function draw() {
  if (openSet.length > 0) {
    let lowestIndex = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIndex].f) {
        lowestIndex = i;
      }
    }

    current = openSet[lowestIndex];

    if (openSet[lowestIndex] === end) {
      noLoop();
      console.log('DONE!');
    }

    removeFromArray(openSet, current);
    closedSet.push(current);

    let neighbors = current.neighbors;

    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];

      if (!closedSet.includes(neighbor)) {
        let temp_gScore = current.g + 1;

        if (openSet.includes(neighbor)) {
          if (temp_gScore <= neighbor.g) {
            neighbor.g = temp_gScore;
          }
        } else {
          neighbor.g = temp_gScore;
          openSet.push(neighbor);
        }

        neighbor.h = heuristic(neighbor, end);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.prev = current;
      }
    }
  } else {
    // no solution
  }

  background(0);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j].show(color(0));
    }
  }

  for (let i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(255, 0, 0));
  }
  for (let i = 0; i < openSet.length; i++) {
    openSet[i].show(color(0, 255, 0));
  }

  path = [];
  let temp = current;
  path.push(temp);
  while (temp.prev) {
    path.push(temp.prev);
    temp = temp.prev;
  }

  for (let i = 0; i < path.length; i++) {
    path[i].show(color(0, 0, 255));
  }
}
