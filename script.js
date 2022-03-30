const delay = new URL(window.location.href).searchParams.get('delay') || 50;

window.onbeforeunload = () => {
  window.scrollTo(0, 0);
};

const delaySelectEl = document.getElementById('delay-select');
delaySelectEl.value = delay;
delaySelectEl.addEventListener('change', (e) => {
  const currDelayValue = e.target.value;
  const url = new URL(window.location.href);
  url.searchParams.set('delay', currDelayValue);
  window.location.href = url;
});

/**
 * When we create a new fake server
 * An array of 50 element is created from index 0 to 49
 * On each request we remove the first three elements and return them
 * in this after some time array will be empty
 */

class FakeServer {
  #elements = [...Array(50).keys()].map((e) => ({
    value: e,
    color: `#${Math.floor(16777215 * Math.random()).toString(16)}`,
  }));
  #delayValue;

  constructor(delay) {
    this.#delayValue = delay;
  }

  fakeRequest = () =>
    new Promise((resolve) => {
      const response = {
        items: this.#elements.splice(0, 3),
        hasMore: this.#elements.length > 0,
      };
      setTimeout(() => resolve(response), this.#delayValue);
    });
}
function infiniteScroll() {
  let responseBuffer = [];
  let hasMore;
  let requestPending = false;
  const loadingButtonEl = document.querySelector('#infinite-scroll-button');
  const containerEl = document.querySelector('#infinite-scroll-container');
  const sentinelEl = document.querySelector('#sentinel');
  const fakeServer = new FakeServer(delay);

  const insertNewItems = () => {
    while (responseBuffer.length > 0) {
      const data = responseBuffer.shift();
      const el = document.createElement('div');
      el.textContent = data.value;
      el.style.backgroundColor = data.color;
      el.classList.add('item');
      el.classList.add('new');
      containerEl.insertBefore(el, loadingButtonEl);
      console.log(`inserted: ${data}`);
    }
    sentinelObserver.observe(sentinelEl);
    if (hasMore === false) {
      loadingButtonEl.style = 'display: none';
      sentinelObserver.unobserve(sentinelEl);
      listObserver.unobserve(loadingButtonEl);
    }
    loadingButtonEl.disabled = true;
  };
  loadingButtonEl.addEventListener('click', insertNewItems);
  const requestHandler = () => {
    if (requestPending) return;
    console.log('making request');
    requestPending = true;
    fakeServer.fakeRequest().then((response) => {
      console.log('server response', response);
      requestPending = false;
      responseBuffer = responseBuffer.concat(response.items);
      hasMore = response.hasMore;
      loadingButtonEl.disabled = false;
    });
  };
  const sentinelObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        observer.unobserve(sentinelEl);
        requestHandler();
      }
    });
  });
  const listObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > 0 && entry.intersectionRatio < 1) {
          insertNewItems();
        }
      });
    },
    {
      rootMargin: '0px 0px 200px 0px',
    }
  );
  sentinelObserver.observe(sentinelEl);
  listObserver.observe(loadingButtonEl);
}
infiniteScroll();
