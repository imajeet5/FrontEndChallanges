const runBtn = document.querySelector('#run');
const countEL = document.querySelector('#count');
const progressBarEL = document.querySelector('.progress__bar');
let clickQueue = [];

function handleBtnClick() {
  if (clickQueue.length === 0) {
    clickQueue.push(1);
    cleanQueue();
  } else {
    clickQueue.push(1);
  }
  countEL.textContent = clickQueue.length;
}

function cleanQueue() {
  // if we are already cleaning the queue, then we will not invoke the function again
  if (clickQueue.length === 0) {
    countEL.textContent = '';
    return;
  }
  countEL.textContent = clickQueue.length;

  progressBarEL.classList.add('animate');
  setTimeout(() => {
    clickQueue.pop();
    progressBarEL.classList.remove('animate');
    // Directly call clean queue will not work as in at the same time we are removing the call and also adding the class
    // do we need to do that in next frame
    // cleanQueue();
    requestAnimationFrame(() => {
      cleanQueue();
    });
  }, 4000);

  //   setTimeout(() => {}, 4100);
}

runBtn.addEventListener('click', handleBtnClick);
