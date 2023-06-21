const app = {
	initGrid: function () {
		const thisApp = this

		const gridEl = document.querySelector('.test')

		gridEl.addEventListener('click', function () {
			console.log('test')
		})
	},

	init: function () {
		const thisApp = this
		thisApp.initGrid()
	},
}
app.init()
