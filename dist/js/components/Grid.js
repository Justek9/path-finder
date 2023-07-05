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
    thisGrid.previousState = [];
    thisGrid.selected = [];
    thisGrid.neighbours = [];
    thisGrid.previousNeighbours = [];
    thisGrid.startPoint = [];
    thisGrid.finishPoint = [];
    thisGrid.pathNeighbours = [];
    thisGrid.visitedNodes = [];
    thisGrid.queue = [];
    thisGrid.isFirstClick = true;
    thisGrid.isFinishedDrawing = false;
    thisGrid.isStartSelected = false;
    thisGrid.isFinishSelected = false;
    thisGrid.lastlySelectedTile = [];
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

  manageGridState() {
    const thisGrid = this;

    // add event listener on cells
    thisGrid.gridContainer.addEventListener('click', function (event) {
      // get data of selected cell
      let row = Number(event.target.dataset.row);
      let column = Number(event.target.dataset.column);

      // guard clauses
      if (thisGrid.isStartSelected === true && thisGrid.isFinishSelected === true) return;
      if (thisGrid.isFinishedDrawing === true && thisGrid.state[row][column] !== 1) return;

      //  unclick lastly selected
      if (
        thisGrid.isFinishedDrawing === false &&
				row === thisGrid.lastlySelectedTile[0] &&
				column === thisGrid.lastlySelectedTile[1] &&
				thisGrid.state[row][column] === 1 &&
				thisGrid.isStartSelected === false
      ) {
        thisGrid.state = thisGrid.previousState;
        thisGrid.neighbours = thisGrid.previousNeighbours;
        thisGrid.selected.pop();
        thisGrid.selected.length === 0 ? (thisGrid.isFirstClick = true) : (thisGrid.isFirstClick = false);
        thisGrid.lastlySelectedTile = [];
        thisGrid.updateUI();
        return;
      }

      // first click
      if (thisGrid.isFirstClick && thisGrid.state[row][column] === 0) {
        thisGrid.previousState = thisGrid.state.map(arr => arr.slice(0));
        thisGrid.state[row][column] = 1;
        thisGrid.lastlySelectedTile = [];
        thisGrid.lastlySelectedTile.push(row, column);
        thisGrid.selected.push([row, column]);
        thisGrid.previousNeighbours = thisGrid.neighbours.slice(0);
        thisGrid.setNeighbours(row, column);
      }

      //standard cases
      if (thisGrid.state[row][column] === 2) {
        thisGrid.previousState = thisGrid.state.map(arr => arr.slice(0));
        thisGrid.state[row][column] = 1;
        thisGrid.lastlySelectedTile = [];
        thisGrid.lastlySelectedTile.push(row, column);
        thisGrid.previousNeighbours = thisGrid.neighbours.slice(0);
        thisGrid.unsetAsNeighbour(row, column);
        thisGrid.selected.push([row, column]);
        thisGrid.setNeighbours(row, column);
      }

      // click on state 0
      if (!thisGrid.isFirstClick && thisGrid.state[row][column] === 0)
        alert('Please choose correct tile (green bakground)');

      // set start point

      if (
        thisGrid.isFinishedDrawing === true &&
				thisGrid.state[row][column] === 1 &&
				thisGrid.isStartSelected === false
      ) {
        thisGrid.state[row][column] = 3;
        thisGrid.isStartSelected = true;
        thisGrid.startPoint.push(row, column);
      }

      // set finish point
      if (thisGrid.state[row][column] === 1 && thisGrid.isStartSelected == true) {
        thisGrid.state[row][column] = 4;
        thisGrid.isFinishSelected = true;
        thisGrid.finishPoint.push(row, column);
      }

      thisGrid.updateUI();
      thisGrid.isFirstClick = false;
    });
  }

  unsetAsNeighbour(row, column) {
    const thisGrid = this;
    thisGrid.neighbours = thisGrid.neighbours.filter(el => {
      return !(el[0] === row && el[1] === column);
    });
  }
  setNeighbours(row, column) {
    const thisGrid = this;

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

  updateUI() {
    const thisGrid = this;
    thisGrid.allTiles = document.querySelectorAll(select.element.tiles);

    for (let tile of thisGrid.allTiles) {
      // thisGrid.state[row][col] === 0 ? tile.classList.remove(classNames.tile.selected) : ''

      tile.classList.remove(classNames.tile.selected);
      tile.classList.remove(classNames.tile.neighbour);

      if (thisGrid.startPoint[0] === +tile.dataset.row && thisGrid.startPoint[1] === +tile.dataset.column) {
        tile.classList.remove(classNames.tile.selected);
        tile.classList.add(classNames.tile.start);
      }

      if (thisGrid.finishPoint[0] === +tile.dataset.row && thisGrid.finishPoint[1] === +tile.dataset.column) {
        tile.classList.remove(classNames.tile.selected);
        tile.classList.add(classNames.tile.finish);
      }

      if (thisGrid.isFinishedDrawing === false) {
        thisGrid.neighbours.forEach(el => {
          if (+tile.dataset.row === el[0] && +tile.dataset.column === el[1]) {
            tile.classList.remove(classNames.tile.selected);
            tile.classList.add(classNames.tile.neighbour);
          }
        });
      }

      thisGrid.selected.forEach(el => {
        if (+tile.dataset.row === el[0] && +tile.dataset.column === el[1]) {
          tile.classList.remove(classNames.tile.neighbour);
          tile.classList.add(classNames.tile.selected);
        }
      });
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
      if (thisGrid.selected.length <= 1) {
        alert('Please choose at least two tiles');
        return;
      }

      thisGrid.isFinishedDrawing = true;
      thisGrid.instructions.innerText = 'Pick start and finish';
      thisGrid.finishDrawingBtn.classList.remove(classNames.button.active);
      thisGrid.computeRouteBtn.classList.add(classNames.button.active);

      for (let tile of thisGrid.allTiles) {
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
      thisGrid.instructions.innerText = 'The best route is...';
      thisGrid.computeRouteBtn.classList.remove(classNames.button.active);
      thisGrid.startAgainBtn.classList.add(classNames.button.active);
      thisGrid.findShortestPath();
    });
  }

  findShortestPath() {
    const thisGrid = this;

    // Find shortest path from startPoint to finishPoint based on BFS algorithm
    thisGrid.queue.push(thisGrid.startPoint);
    thisGrid.visitedNodes.push(thisGrid.startPoint);

    // declare helper variable to keep track of previously visited cells
    thisGrid.previousCell = [];
    for (let i = 0; i < 10; i++) {
      thisGrid.previousCell.push(new Array(10).fill(false));
    }

    while (thisGrid.queue.length > 0) {
      let curr = thisGrid.queue.shift();

      // check if current cell is finish point

      if (curr[0] === thisGrid.finishPoint[0] && curr[1] === thisGrid.finishPoint[1]) {
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
    path.push(thisGrid.finishPoint);

    // check previously visited cell and add it path array, when previous = false finish loop
    while (thisGrid.previousCell[path[path.length - 1][0]][path[path.length - 1][1]] !== false) {
      let addToPath = thisGrid.previousCell[path[path.length - 1][0]][path[path.length - 1][1]];
      path.push(addToPath);
    }

    for (let tile of thisGrid.allTiles) {
      path.forEach(el => {
        if (+tile.dataset.row === el[0] && +tile.dataset.column === el[1]) {
          tile.classList.remove(classNames.tile.selected);
          tile.classList.add(classNames.tile.path);
        }
      });
    }
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

  startAgainBtnHandler() {
    const thisGrid = this;

    // reset grid state and initial values, draw new grid
    thisGrid.startAgainBtn.addEventListener('click', function () {
      thisGrid.startAgainBtn.classList.remove(classNames.button.active);
      thisGrid.finishDrawingBtn.classList.add(classNames.button.active);
      thisGrid.instructions.innerText = 'Draw routes';
      thisGrid.initValues();
      thisGrid.state = [];
      thisGrid.initGridState();
      thisGrid.gridContainer.innerHTML = '';
      thisGrid.drawGrid();
    });
  }
}
export default Grid;
