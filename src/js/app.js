const app = {
	initGrid: function () {
		let gridContainer = document.querySelector('.container')

		// create grid and add datasets attributes
		for (let rows = 1; rows <= 10; rows++) {
			for (let columns = 1; columns <= 10; columns++) {
				const cell = document.createElement('div')
				cell.classList.add('row')
				cell.setAttribute('data-row', `${rows}`)
				cell.setAttribute('data-column', `${columns}`)
				gridContainer.appendChild(cell)
			}
		}

		// add event listener on cells
		gridContainer.addEventListener('click', function (event) {
				
			// get data of selected cell
			let currentlySelectedData = []
			currentlySelectedData.push(Number(event.target.dataset.row))
			currentlySelectedData.push(Number(event.target.dataset.column))
			// console.log(currentlySelectedData)

			// check if clicked cell has already been selected - y? remove, no? add
			event.target.classList.contains('selected')
				? event.target.classList.remove('selected')
				: event.target.classList.add('selected')

			// set neighbours of selected element
			// neighbour down
			let dataDownNeighbourRow = String(currentlySelectedData[0] + 1)
			let dataDownNeighbourColumn = String(currentlySelectedData[1])
			let neighbour1 = document.querySelector(
				`[data-row='${dataDownNeighbourRow}'][data-column='${dataDownNeighbourColumn}']`
			)
			neighbour1.classList.add('neighbour')

			// neighbour up

			let dataUpNeighbourRow = String(currentlySelectedData[0] - 1)
			let dataUpNeighbourColumn = String(currentlySelectedData[1])
			let neighbour2 = document.querySelector(
				`[data-row='${dataUpNeighbourRow}'][data-column='${dataUpNeighbourColumn}']`
			)
			neighbour2.classList.add('neighbour')

			// neighbour right
			let dataRightNeighbourRow = String(currentlySelectedData[0])
			let dataRigtNeighbourColumn = String(currentlySelectedData[1] + 1)
			let neighbour3 = document.querySelector(
				`[data-row='${dataRightNeighbourRow}'][data-column='${dataRigtNeighbourColumn}']`
			)
			neighbour3.classList.add('neighbour')
			// neighbour left
			let dataLeftNeighbourRow = String(currentlySelectedData[0])
			let dataLeftNeighbourColumn = String(currentlySelectedData[1] - 1)
			let neighbour4 = document.querySelector(
				`[data-row='${dataLeftNeighbourRow}'][data-column='${dataLeftNeighbourColumn}']`
			)
			neighbour4.classList.add('neighbour')
		})

		// disable clicking not neighbours


	},

	init: function () {
		const thisApp = this
		thisApp.initGrid()
	},
}
app.init()
