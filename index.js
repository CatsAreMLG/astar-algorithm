const cols = 50;
const rows = 50;
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
  this.wall = false;

  if (random(1) < 0.5) {
    this.wall = true;
  }

  this.show = function (color) {
    this.wall ? fill(0) : fill(color);
    stroke(0);
    rect(this.x * w, this.y * h, w, h);
  };

  this.addNeighbors = function () {
    if (this.x < cols - 1) this.neighbors.push(grid[this.x + 1][this.y]);
    if (this.x > 0) this.neighbors.push(grid[this.x - 1][this.y]);
    if (this.y < rows - 1) this.neighbors.push(grid[this.x][this.y + 1]);
    if (this.y > 0) this.neighbors.push(grid[this.x][this.y - 1]);
    if (this.x > 0 && this.y > 0)
      this.neighbors.push(grid[this.x - 1][this.y - 1]);
    if (this.x < cols - 1 && this.y > 0)
      this.neighbors.push(grid[this.x + 1][this.y - 1]);
    if (this.x > 0 && this.y < rows - 1)
      this.neighbors.push(grid[this.x - 1][this.y + 1]);
    if (this.x < cols - 1 && this.y < rows - 1)
      this.neighbors.push(grid[this.x + 1][this.y + 1]);
  };
}

function setup() {
  createCanvas(800, 800);
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
  start.wall = false;
  end.wall = false;

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

      let newPath = false;

      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        let temp_gScore = current.g + 1;

        if (openSet.includes(neighbor)) {
          if (temp_gScore <= neighbor.g) {
            neighbor.g = temp_gScore;
            newPath = true;
          }
        } else {
          neighbor.g = temp_gScore;
          newPath = true;
          openSet.push(neighbor);
        }
        if (newPath) {
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.prev = current;
        }
      }
    }
  } else {
    console.log('NO SOLUTION');
    noLoop();
    return;
  }

  background(255);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j].show(color(255));
    }
  }

  for (let i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(255, 0, 0));
  }
  for (let i = 0; i < openSet.length; i++) {
    openSet[i].show(color(0, 0, 255));
  }

  path = [];
  let temp = current;
  path.push(temp);
  while (temp.prev) {
    path.push(temp.prev);
    temp = temp.prev;
  }

  for (let i = 0; i < path.length; i++) {
    path[i].show(color(0, 255, 0));
  }
}
