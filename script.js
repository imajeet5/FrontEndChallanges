const slidesEl = document.querySelector('.slides');

const backButtonEl = document.querySelector('#back');
const forwardButtonEl = document.querySelector('#forward');

backButtonEl.addEventListener('click', () => navigate('backward'));

forwardButtonEl.addEventListener('click', () => navigate('forward'));

const slideWidth = slidesEl.offsetWidth;
const overallWidth = slidesEl.scrollWidth;

function calculateNewPosition(direction) {
  const str = slidesEl.style.transform;
  const x = str ? parseInt(str.match(/-?(\d+)/g)) : 0;

  if (direction === 'forward') {
    const atLastSlide = x === -overallWidth + slideWidth;
    // Non-looping carousel: Stops at last slide
    return atLastSlide ? x : x - slideWidth;
    // Looping carousel: Transitions from last slide to first slide
    // return atLastSlide ? 0 : x-slideWidth;
  } else if (direction === 'backward') {
    const atFirstSlide = x === 0;
    // Non-looping carousel: Stops at first slide
    return atFirstSlide ? x : x + slideWidth;
    // Looping carousel: Transitions from first slide to last slide
    // return atFirstSlide ? -overallWidth + slideWidth : x + slideWidth;
  }
}

function navigate(direction) {
  const x = calculateNewPosition(direction);
  slidesEl.style.transform = `translateX(${x}px)`;
}
