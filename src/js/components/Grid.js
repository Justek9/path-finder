import { select } from '../settings.js'

class Grid {
	constructor() {
		const thisGrid = this
		thisGrid.getData()
		thisGrid.isValidAsNeighbour()
		thisGrid.updateUI()
		thisGrid.drawGrid()
		thisGrid.manageGrid()
	}

	getData() {
		const thisGrid = this
		thisGrid.gridContainer = document.querySelector(select.containerOf.grid)
		thisGrid.state = []
		thisGrid.selected = []
		thisGrid.neighbours = []
		thisGrid.isFirstClick = true
	}

	updateUI(row, col) {
		const thisGrid = this
		let allTiles = document.querySelectorAll('.tile')

		for (let tile of allTiles) {
			thisGrid.state[row][col] === 0 ? tile.classList.remove('selected') : ''

			thisGrid.neighbours.forEach(el => {
				if (+tile.dataset.row === el[0] && +tile.dataset.column === el[1]) {
					tile.classList.add('neighbour')
				}
			})

			thisGrid.selected.forEach(el => {
				if (+tile.dataset.row === el[0] && +tile.dataset.column === el[1]) {
					tile.classList.remove('neighbour')
					tile.classList.add('selected')
				}
			})
		}
	}

	gridState() {
		const thisGrid = this
		// States:
		// 0 - initial state after loading for all tiles
		// 1 - selected element
		// 2 - neighbour of selected element

		for (let i = 0; i < 10; i++) {
			thisGrid.state.push(new Array(10).fill(0))
		}
	}

	drawGrid() {
		const thisGrid = this

		// create grid and add datasets attributes
		for (let rows = 0; rows < 10; rows++) {
			for (let columns = 0; columns < 10; columns++) {
				const cell = document.createElement('div')
				cell.classList.add('tile')
				cell.setAttribute('data-row', rows)
				cell.setAttribute('data-column', columns)
				thisGrid.gridContainer.appendChild(cell)
			}
		}
		thisGrid.gridState()
	}

	manageGrid() {
		const thisGrid = this
		// add event listener on cells
		thisGrid.gridContainer.addEventListener('click', function (event) {
			// get data of selected cell
			let row = Number(event.target.dataset.row)
			let column = Number(event.target.dataset.column)

			// Set grid state to 0, 1 or 2
			if (thisGrid.state[row][column] === 2) {
				thisGrid.state[row][column] = 1
				let index = thisGrid.neighbours.indexOf([row, column])
				thisGrid.neighbours.splice(index, 1)
				thisGrid.setAsSelected(row, column)
			} else if (thisGrid.isFirstClick && thisGrid.state[row][column] === 0) {
				thisGrid.state[row][column] = 1
				thisGrid.setAsSelected(row, column)
			} else if (!thisGrid.isFirstClick && thisGrid.state[row][column] === 0)
				alert('Please choose correct tile (green bakground)')

			thisGrid.updateUI(row, column)
			thisGrid.isFirstClick = false
		})
	}

	setAsSelected(row, column) {
		const thisGrid = this
		thisGrid.selected.push([row, column])

		// check: 1) if neighbour is within grid border, 2) if it is not already a naighbour, 3) is not selected
		if (!(row - 1 < 0) && thisGrid.isValidAsNeighbour(row - 1, column)) {
			thisGrid.neighbours.push([row - 1, column])
			thisGrid.state[row - 1][column] = 2
		}
		if (!(row + 1 > 9) && thisGrid.isValidAsNeighbour(row + 1, column)) {
			thisGrid.neighbours.push([row + 1, column])
			thisGrid.state[row + 1][column] = 2
		}
		if (!(column - 1 < 0) && thisGrid.isValidAsNeighbour(row, column - 1)) {
			thisGrid.neighbours.push([row, column - 1])
			thisGrid.state[row][column - 1] = 2
		}
		if (!(column + 1 > 9) && thisGrid.isValidAsNeighbour(row, column + 1)) {
			thisGrid.neighbours.push([row, column + 1])
			thisGrid.state[row][column + 1] = 2
		}
	}

	isValidAsNeighbour(r, c) {
		const thisGrid = this
		if (
			thisGrid.neighbours.filter(el => {
				return el[0] === r && el[1] === c
			}).length === 0 &&
			thisGrid.selected.filter(el => {
				return el[0] === r && el[1] === c
			}).length === 0
		)
			return true
	}
}
export default Grid
