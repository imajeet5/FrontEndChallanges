// const gridEl = document.querySelector('#grid');
// console.log(gridEl);

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

class PixelArt {
  gridEl;
  rows;
  cols;
  selectedColor = '#000';
  isMouseDown = false;

  constructor(selector, rows, cols) {
    this.gridEl = document.querySelector(selector);
    this.rows = rows;
    this.cols = cols;
    this.gridEl.style.gridTemplate = `repeat(${rows}, 1fr) / repeat(${cols}, 1fr)`;
    this.addGridElements();
    this.addLastColorRow();
    this.setUpEvents();
  }

  addGridElements() {
    const totalElements = this.rows * this.cols;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < totalElements; i++) {
      const el = document.createElement('div');
      el.classList.add('box');
      el.dataset.type = 'grid-item';
      el.addEventListener(
        'click',
        () => (el.style.backgroundColor = this.selectedColor)
      );
      fragment.appendChild(el);
    }

    this.gridEl.appendChild(fragment);
  }
  addLastColorRow() {
    const fragment = document.createDocumentFragment();
    // we will add one extra row for color picker
    for (let i = 0; i < this.cols; i++) {
      const el = document.createElement('div');
      el.classList.add('box');
      el.classList.add('last-row');
      const color = getRandomColor();
      el.style.backgroundColor = color;
      el.addEventListener('click', () => (this.selectedColor = color));
      fragment.appendChild(el);
    }
    this.gridEl.appendChild(fragment);
  }

  paintOnMove(e) {
    if (this.isMouseDown) {
      e.target.dataset.type === 'grid-item' &&
        (e.target.style.backgroundColor = this.selectedColor);
    }
  }

  setUpEvents() {
    this.gridEl.addEventListener('mousedown', () => (this.isMouseDown = true));
    this.gridEl.addEventListener('mouseup', () => (this.isMouseDown = false));
    this.gridEl.addEventListener('mousemove', this.paintOnMove.bind(this));
  }
}

new PixelArt('#grid', 10, 10);
