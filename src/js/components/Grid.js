import { select, classNames } from '../settings.js';

class Grid {
  constructor() {
    const thisGrid = this;
    thisGrid.getData();
    thisGrid.initValues();
    thisGrid.isValidAsNeighbour();
    thisGrid.updateUI();
    thisGrid.drawGrid();
    thisGrid.manageGridState();
    thisGrid.finishDrawingBtnHandler();
    thisGrid.computeBtnHandler();
    thisGrid.startAgainBtnHandler();
  }

  getData() {
    const thisGrid = this;
    thisGrid.gridContainer = document.querySelector(select.containerOf.grid);
    thisGrid.finishDrawingBtn = document.querySelector(select.button.finish);
    thisGrid.computeRouteBtn = document.querySelector(select.button.compute);
    thisGrid.startAgainBtn = document.querySelector(select.button.startAgain);
    thisGrid.instructions = document.querySelector(select.element.text);
  }

  initValues() {
    const thisGrid = this;
    thisGrid.state = [];
    thisGrid.selected = [];
    thisGrid.neighbours = [];
    thisGrid.startPoint = [];
    thisGrid.finishPoint = [];
    thisGrid.pathNeighbours = [];
    thisGrid.visitedNodes = [];
    thisGrid.queue = [];
    thisGrid.isFirstClick = true;
    thisGrid.isFinishedDrawing = false;
    thisGrid.isStartSelected = false;
    thisGrid.isFinishSelected = false;
  }

  updateUI(row, col) {
    const thisGrid = this;
    let allTiles = document.querySelectorAll('.tile');

    for (let tile of allTiles) {
      thisGrid.state[row][col] === 0 ? tile.classList.remove(classNames.tile.selected) : '';

      thisGrid.startPoint.forEach(el => {
        if (+tile.dataset.row === el[0] && +tile.dataset.column === el[1]) {
          tile.classList.remove(classNames.tile.selected);
          tile.classList.add(classNames.tile.start);
        }
      });

      thisGrid.finishPoint.forEach(el => {
        if (+tile.dataset.row === el[0] && +tile.dataset.column === el[1]) {
          tile.classList.remove(classNames.tile.selected);
          tile.classList.add(classNames.tile.finish);
        }
      });

      thisGrid.neighbours.forEach(el => {
        if (+tile.dataset.row === el[0] && +tile.dataset.column === el[1]) {
          tile.classList.add(classNames.tile.neighbour);
        }
      });

      thisGrid.selected.forEach(el => {
        if (+tile.dataset.row === el[0] && +tile.dataset.column === el[1]) {
          tile.classList.remove(classNames.tile.neighbour);
          tile.classList.add(classNames.tile.selected);
        }
      });
    }
  }

  initGridState() {
    const thisGrid = this;
    // States:
    // 0 - initial state after loading for all tiles
    // 1 - selected element
    // 2 - neighbour of selected element
    // 3 - start point to compute route
    // 4 - end point to compute route

    for (let i = 0; i < 10; i++) {
      thisGrid.state.push(new Array(10).fill(0));
    }
  }

  drawGrid() {
    const thisGrid = this;

    // create grid and add datasets attributes
    for (let rows = 0; rows < 10; rows++) {
      for (let columns = 0; columns < 10; columns++) {
        const cell = document.createElement('div');
        cell.classList.add(classNames.tile.tile);
        cell.setAttribute('data-row', rows);
        cell.setAttribute('data-column', columns);
        thisGrid.gridContainer.appendChild(cell);
      }
    }
    thisGrid.initGridState();
  }

  manageGridState() {
    const thisGrid = this;

    // add event listener on cells
    thisGrid.gridContainer.addEventListener('click', function (event) {
      // get data of selected cell
      let row = Number(event.target.dataset.row);
      let column = Number(event.target.dataset.column);

      // guard clauses
      if (thisGrid.isStartSelected === true && thisGrid.isFinishSelected === true) return;
      if (thisGrid.isFinishedDrawing === true && thisGrid.state[row][column] !== 1) {
        return;
      }
      // Set grid state to  1, 3, 4

      if (
        thisGrid.isFinishedDrawing === true &&
				thisGrid.state[row][column] === 1 &&
				thisGrid.isStartSelected === false
      ) {
        thisGrid.state[row][column] = 3;
        thisGrid.isStartSelected = true;
        thisGrid.startPoint.push([row, column]);
      }

      if (thisGrid.state[row][column] === 1 && thisGrid.isStartSelected == true) {
        thisGrid.state[row][column] = 4;
        thisGrid.isFinishSelected = true;
        thisGrid.finishPoint.push([row, column]);
      }

      if (thisGrid.state[row][column] === 2) {
        thisGrid.state[row][column] = 1;
        thisGrid.setAsSelected(row, column);
      } else if (thisGrid.isFirstClick && thisGrid.state[row][column] === 0) {
        thisGrid.state[row][column] = 1;
        thisGrid.setAsSelected(row, column);
      } else if (!thisGrid.isFirstClick && thisGrid.state[row][column] === 0)
        alert('Please choose correct tile (green bakground)');

      thisGrid.updateUI(row, column);
      thisGrid.isFirstClick = false;
    });
  }

  setAsSelected(row, column) {
    const thisGrid = this;

    thisGrid.selected.push([row, column]);

    // check: 1) if neighbour is within grid border, 2) if it is not already a naighbour, 3) is not selected
    // Set grid state to  2

    if (!(row - 1 < 0) && thisGrid.isValidAsNeighbour(row - 1, column)) {
      thisGrid.neighbours.push([row - 1, column]);
      thisGrid.state[row - 1][column] = 2;
    }
    if (!(row + 1 > 9) && thisGrid.isValidAsNeighbour(row + 1, column)) {
      thisGrid.neighbours.push([row + 1, column]);
      thisGrid.state[row + 1][column] = 2;
    }
    if (!(column - 1 < 0) && thisGrid.isValidAsNeighbour(row, column - 1)) {
      thisGrid.neighbours.push([row, column - 1]);
      thisGrid.state[row][column - 1] = 2;
    }
    if (!(column + 1 > 9) && thisGrid.isValidAsNeighbour(row, column + 1)) {
      thisGrid.neighbours.push([row, column + 1]);
      thisGrid.state[row][column + 1] = 2;
    }
  }

  isNotIncluded(array, r, c) {
    if (
      array.filter(el => {
        return el[0] === r && el[1] === c;
      }).length === 0
    )
      return true;
    else return false;
  }

  isValidAsNeighbour(r, c) {
    const thisGrid = this;

    // check if is not in neighbours arary and not in selected arary
    return thisGrid.isNotIncluded(thisGrid.neighbours, r, c) && thisGrid.isNotIncluded(thisGrid.selected, r, c);
  }

  isNotVisited(r, c) {
    const thisGrid = this;

    // check if is not in visitedNodess array
    return thisGrid.isNotIncluded(thisGrid.visitedNodes, r, c);
  }

  isValidAsPathNeighbour(r, c) {
    const thisGrid = this;

    // check if is not in pathNeighbours array already
    return thisGrid.isNotIncluded(thisGrid.pathNeighbours, r, c);
  }

  finishDrawingBtnHandler() {
    const thisGrid = this;
    thisGrid.finishDrawingBtn.addEventListener('click', function () {
      thisGrid.isFinishedDrawing = true;
      thisGrid.instructions.innerHTML = 'Pick start and finish';
      thisGrid.finishDrawingBtn.classList.remove('active-btn');
      thisGrid.computeRouteBtn.classList.add('active-btn');

      let allTiles = document.querySelectorAll('.tile');

      for (let tile of allTiles) {
        thisGrid.neighbours.forEach(el => {
          if (+tile.dataset.row === el[0] && +tile.dataset.column === el[1]) {
            tile.classList.remove(classNames.tile.neighbour);
          }
        });
      }
    });
  }

  computeBtnHandler() {
    const thisGrid = this;
    thisGrid.computeRouteBtn.addEventListener('click', function () {
      thisGrid.instructions.innerHTML = 'The best route is...';
      thisGrid.computeRouteBtn.classList.remove('active-btn');
      thisGrid.startAgainBtn.classList.add('active-btn');
      thisGrid.shortestPath();
    });
  }

  shortestPath() {
    const thisGrid = this;

    // Find shortest path from startPoint to finishPoint based on BFS algorithm
    thisGrid.queue.push(thisGrid.startPoint[0]);
    thisGrid.visitedNodes.push(thisGrid.startPoint[0]);

    // declare helper variable to keep track of previously visited cells
    thisGrid.previousCell = [];
    for (let i = 0; i < 10; i++) {
      thisGrid.previousCell.push(new Array(10).fill(false));
    }

    while (thisGrid.queue.length > 0) {
      let curr = thisGrid.queue.shift();

      // check if current cell is finish point

      if (curr[0] === thisGrid.finishPoint[0][0] && curr[1] === thisGrid.finishPoint[0][1]) {
        thisGrid.renderPath();
        return true;
      }

      // get neighbours of current cell
      thisGrid.getPathNeighbours(curr[0], curr[1]);

      // for each neighbour add it to visited and to queue, update previousCell array
      for (let i = 0; i < thisGrid.pathNeighbours.length; i++) {
        if (this.isNotVisited(thisGrid.pathNeighbours[i][0], thisGrid.pathNeighbours[i][1])) {
          thisGrid.visitedNodes.push(thisGrid.pathNeighbours[i]);
          thisGrid.queue.push(thisGrid.pathNeighbours[i]);
          thisGrid.previousCell[thisGrid.pathNeighbours[i][0]][thisGrid.pathNeighbours[i][1]] = curr;
        }
      }
    }

    return false;
  }

  renderPath() {
    const thisGrid = this;
    let path = [];
    path.push(thisGrid.finishPoint[0]);

    while (thisGrid.previousCell[path[path.length - 1][0]][path[path.length - 1][1]] !== false) {
      let toPush = thisGrid.previousCell[path[path.length - 1][0]][path[path.length - 1][1]];
      path.push(toPush);
    }

    let allTiles = document.querySelectorAll('.tile');

    for (let tile of allTiles) {
      path.forEach(el => {
        if (+tile.dataset.row === el[0] && +tile.dataset.column === el[1]) {
          tile.classList.remove(classNames.tile.selected);
          tile.classList.add(classNames.tile.path);
        }
      });
    }
  }

  startAgainBtnHandler() {
    const thisGrid = this;

    // reset grid state and initial values, draw new grid
    thisGrid.startAgainBtn.addEventListener('click', function () {
      thisGrid.startAgainBtn.classList.remove('active-btn');
      thisGrid.finishDrawingBtn.classList.add('active-btn');
      thisGrid.instructions.innerHTML = 'Draw routes';

      thisGrid.initValues();
      thisGrid.state = [];
      thisGrid.initGridState();
      thisGrid.gridContainer.innerHTML = '';
      thisGrid.drawGrid();
    });
  }

  getPathNeighbours(row, column) {
    const thisGrid = this;
    thisGrid.pathNeighbours = [];

    if (
      !(column + 1 > 9) &&
			(thisGrid.state[row][column + 1] === 1 || thisGrid.state[row][column + 1] === 4) &&
			thisGrid.isValidAsPathNeighbour(row, column + 1) &&
			thisGrid.isNotVisited(row, column + 1)
    ) {
      thisGrid.pathNeighbours.push([row, column + 1]);
    }
    if (
      !(column - 1 < 0) &&
			(thisGrid.state[row][column - 1] === 1 || thisGrid.state[row][column - 1] === 4) &&
			thisGrid.isValidAsPathNeighbour(row, column - 1) &&
			thisGrid.isNotVisited(row, column - 1)
    ) {
      thisGrid.pathNeighbours.push([row, column - 1]);
    }
    if (
      !(row + 1 > 9) &&
			(thisGrid.state[row + 1][column] === 1 || thisGrid.state[row + 1][column] === 4) &&
			thisGrid.isValidAsPathNeighbour(row + 1, column) &&
			thisGrid.isNotVisited(row + 1, column)
    ) {
      thisGrid.pathNeighbours.push([row + 1, column]);
    }
    if (
      !(row - 1 < 0) &&
			(thisGrid.state[row - 1][column] === 1 || thisGrid.state[row - 1][column] === 4) &&
			thisGrid.isValidAsPathNeighbour(row - 1, column) &&
			thisGrid.isNotVisited(row - 1, column)
    ) {
      thisGrid.pathNeighbours.push([row - 1, column]);
    }
  }
}
export default Grid;
