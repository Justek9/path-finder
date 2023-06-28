export const select = {
  containerOf: {
    grid: '.grid',
    pages: '#pages',
  },

  element: {
    tiles: '.tile',
    text: '.draw',
  },

  nav: {
    links: '.main-nav a',
  },

  button: {
    finish: '.finish',
    compute: '.compute',
    startAgain: '.start',
  },
};

export const classNames = {
  pages: {
    active: 'active',
  },
  nav: {
    active: 'active',
  },
  tile: {
    tile: 'tile',
    selected: 'selected',
    neighbour: 'neighbour',
    start: 'first-selected',
    finish: 'last-selected',
  },
};
