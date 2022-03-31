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
    // here we will start observing the sentinel element again
    // bcz we again want to make a new request based on sentinel element position
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

  //sentinelObserver observes the position of the #sentinel element. When the sentinel becomes visible, more content is requested from the server. Adjusting the position of the sentinel is a way of controlling how far in advance that new content should be requested from the server.
  const sentinelObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        //   We will stop observing the sentinel Element here, as once it is in the viewport request to server
        // is send, to until the new content is added we are not observing the sentinel Observer.
        // When the new content is added new sentinel observer will be at new position adn we will observer, that again
        // also if the user scroll up and again scroll down we don't want to request to server again
        observer.unobserve(sentinelEl);
        requestHandler();
      }
    });
  });

  //listObserver observes the position of the #infinite-scroll-button that is located at the end of the infinite scroll list. When the button is nearing the viewport, uninserted content is added to the DOM.
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
