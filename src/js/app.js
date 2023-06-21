const app = {
  initGrid: function () {
    // const thisApp = this;
    let gridContainer = document.querySelector('.container');

    // create grid and add datasets attributes
    for (let rows = 1; rows <= 10; rows++) {
      for (let columns = 1; columns <= 10; columns++) {
        const cell = document.createElement('div');
        cell.classList.add('row');
        cell.setAttribute('data-row', `${rows}`);
        cell.setAttribute('data-column', `${columns}`);
        gridContainer.appendChild(cell);
      }
    }
    console.log(gridContainer);
  },

  init: function () {
    const thisApp = this;
    thisApp.initGrid();
  },
};
app.init();
