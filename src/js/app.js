import Grid from './components/Grid.js'

const app = {
	initGrid: function () {
		new Grid()
	},

	init: function () {
		const thisApp = this
		thisApp.initGrid()
	},
}
app.init()
