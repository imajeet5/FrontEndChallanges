/*
 * Creates star rating functionality
 * @param el DOM Element
 * @param count Number of stars
 * @param callback Returns selected star count to callback
 */
// function Star(el, count, callback) {

// }

class Star {
  el;
  count;
  callback;
  active = -1;
  constructor(el, count, callback) {
    this.el = document.querySelector(el);
    this.count = count;
    this.callback = callback;

    this.init();
    this.bindEvent();
  }

  init() {
    const fragment = document.createDocumentFragment();
    for (let i = 1; i <= this.count; i++) {
      const startElement = document.createElement('i');
      startElement.classList.add('fa');
      startElement.classList.add('fa-star-o');

      // now we also need to store, the rating value this element represent
      startElement.dataset.ratingVal = i;
      fragment.appendChild(startElement);
    }
    this.el.appendChild(fragment);
  }

  fill(ratingValue) {
    // we will iterate over all the start and add the fill call upto the rating value
    for (let i = 0; i < this.count; i++) {
      if (i < ratingValue) {
        // that means we want to show the filled start
        this.el.children[i].classList.add('fa-star');
      } else {
        this.el.children[i].classList.remove('fa-star');
      }
    }
  }

  onMouseOver(e) {
    const ratingVal = e.target.dataset.ratingVal;
    if (!ratingVal) {
      return;
    }
    this.fill(ratingVal);
  }

  // we also need an handle for onMouse leave, as when mouse leave, we will restore rating to initial rating
  onMouseLeave() {
    // we will fill the current active starts
    this.fill(this.active);
  }

  bindEvent() {
    this.el.addEventListener('mouseover', this.onMouseOver.bind(this));
    this.el.addEventListener('mouseleave', this.onMouseLeave.bind(this));
  }
}

function getStar(value) {
  document.getElementById('display-star-value').innerHTML = value;
}
new Star('#star', 5, getStar);
