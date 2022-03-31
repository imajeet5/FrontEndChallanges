console.log('Hi');
// A reference to the <main> element's HTMLElement object in the DOM. This is where we'll insert the articles and ads.
let contentBox;
// Each article is given a unique ID number; this variable tracks the next ID to use, starting with 1.
let nextArticleID = 1;
// A Set which we'll use to track the ads currently visible on the screen.
let visibleAds = new Set();
//Used to temporarily store the list of visible ads while the document is not visible (for example, if the user has tabbed to another page).
let previouslyVisibleAds = null;
//Will hold our IntersectionObserver used to track the intersection between the ads and the <main> element's bounds.
let adObserver;
//Used to store the interval ID returned by setInterval(). This interval will be used to trigger our periodic refreshes of the ads' content.
let refreshIntervalID = 0;

window.addEventListener('load', startup, false);

function startup() {
  contentBox = document.querySelector('main');

  document.addEventListener('visibilitychange', handleVisibilityChange, false);

  let observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: [0.0, 0.75],
  };

  adObserver = new IntersectionObserver(intersectionCallback, observerOptions);

  buildContents();
  refreshIntervalID = window.setInterval(handleRefreshInterval, 1000);
}

function handleVisibilityChange() {
  if (document.hidden) {
    if (!previouslyVisibleAds) {
      previouslyVisibleAds = visibleAds;
      visibleAds = [];
      previouslyVisibleAds.forEach(function (adBox) {
        updateAdTimer(adBox);
        adBox.dataset.lastViewStarted = 0;
      });
    }
  } else {
    previouslyVisibleAds.forEach(function (adBox) {
      adBox.dataset.lastViewStarted = performance.now();
    });
    visibleAds = previouslyVisibleAds;
    previouslyVisibleAds = null;
  }
}

function intersectionCallback(entries) {
  entries.forEach(function (entry) {
    let adBox = entry.target;

    if (entry.isIntersecting) {
      if (entry.intersectionRatio >= 0.75) {
          // when it enter the view port, it's lastViewStarted time will the the entry.time
        adBox.dataset.lastViewStarted = entry.time;
        visibleAds.add(adBox);
      }
    } else {
    // if it is not intersecting then we will remove it from the list of visibleAds
    // in that way it is removed from the update and it's total time and lastViewTime will not change
      visibleAds.delete(adBox);
      if (
        entry.intersectionRatio === 0.0 &&
        adBox.dataset.totalViewTime >= 30000
      ) {
        replaceAd(adBox);
      }
    }
  });
}

function handleRefreshInterval() {
  let redrawList = [];

  visibleAds.forEach(function (adBox) {
    let previousTime = adBox.dataset.totalViewTime;
    updateAdTimer(adBox);

    if (previousTime != adBox.dataset.totalViewTime) {
      redrawList.push(adBox);
    }
  });

  if (redrawList.length) {
    window.requestAnimationFrame(function (time) {
      redrawList.forEach(function (adBox) {
        drawAdTimer(adBox);
      });
    });
  }
}

function updateAdTimer(adBox) {
  let lastStarted = adBox.dataset.lastViewStarted;
  let currentTime = performance.now();
  // time that has passed since it was last viewed by the user
  if (lastStarted) {
    let diff = currentTime - lastStarted;

    adBox.dataset.totalViewTime =
      parseFloat(adBox.dataset.totalViewTime) + diff;
  }
  // we will update lastViewStarted time for every second it is on screen, as it is being viewed by user
  adBox.dataset.lastViewStarted = currentTime;
}

function drawAdTimer(adBox) {
  let timerBox = adBox.querySelector('.timer');
  let totalSeconds = adBox.dataset.totalViewTime / 1000;
  let sec = Math.floor(totalSeconds % 60);
  let min = Math.floor(totalSeconds / 60);

  timerBox.innerText = min + ':' + sec.toString().padStart(2, '0');
}

let loremIpsum =
  '<p>Lorem ipsum dolor sit amet, consectetur adipiscing' +
  ' elit. Cras at sem diam. Vestibulum venenatis massa in tincidunt' +
  ' egestas. Morbi eu lorem vel est sodales auctor hendrerit placerat' +
  ' risus. Etiam rutrum faucibus sem, vitae mattis ipsum ullamcorper' +
  ' eu. Donec nec imperdiet nibh, nec vehicula libero. Phasellus vel' +
  ' malesuada nulla. Aliquam sed magna aliquam, vestibulum nisi at,' +
  ' cursus nunc.</p>';

function buildContents() {
  for (let i = 0; i < 5; i++) {
    contentBox.appendChild(createArticle(loremIpsum));

    if (!(i % 2)) {
      loadRandomAd();
    }
  }
}

function createArticle(contents) {
  let articleElem = document.createElement('article');
  articleElem.id = nextArticleID;

  let titleElem = document.createElement('h2');
  titleElem.id = nextArticleID;
  titleElem.innerText = 'Article ' + nextArticleID + ' title';
  articleElem.appendChild(titleElem);

  articleElem.innerHTML += contents;
  nextArticleID += 1;

  return articleElem;
}

function loadRandomAd(replaceBox) {
  let ads = [
    {
      bgcolor: '#cec',
      title: 'Ad1: Eat Green Beans',
      body: "Make your mother proud—they're good for you!",
    },
    {
      bgcolor: 'aquamarine',
      title: 'Ad2: MillionsOfFreeBooks.whatever',
      body: 'Read classic literature online free!',
    },
    {
      bgcolor: 'lightgrey',
      title: 'Ad3: Shades of Gray: A novel',
      body: 'Love really does make the world go round...',
    },
    {
      bgcolor: '#fee',
      title: 'Ad4: Flexbox Florist',
      body: "When life's layout gets complicated, send flowers.",
    }, {
      bgcolor: 'pink',
      title: 'Ad:5 Pink color ad',
      body: "Some random text about pink color",
    },
    {
      bgcolor: 'lightblue',
      title: 'Ad:6 Light Blue Color ad',
      body: 'Sky is light blue',
    },
    {
      bgcolor: 'orangered',
      title: 'Ad:7 Orange Red Ad',
      body: 'Orange Red is very cool color',
    },
    {
      bgcolor: 'gold',
      title: 'Ad:8 Golden Ad',
      body: "Hey Look this ad is golden in color.",
    },
    
  ];
  let adBox, title, body, timerElem;

  let ad = ads[Math.floor(Math.random() * ads.length)];

  if (replaceBox) {
    adObserver.unobserve(replaceBox);
    adBox = replaceBox;
    title = replaceBox.querySelector('.title');
    body = replaceBox.querySelector('.body');
    timerElem = replaceBox.querySelector('.timer');
  } else {
    adBox = document.createElement('div');
    adBox.className = 'ad';
    title = document.createElement('h2');
    body = document.createElement('p');
    timerElem = document.createElement('div');
    adBox.appendChild(title);
    adBox.appendChild(body);
    adBox.appendChild(timerElem);
  }

  adBox.style.backgroundColor = ad.bgcolor;

  title.className = 'title';
  body.className = 'body';
  title.innerText = ad.title;
  body.innerHTML = ad.body;

  adBox.dataset.totalViewTime = 0;
  adBox.dataset.lastViewStarted = 0;

  timerElem.className = 'timer';
  timerElem.innerText = '0:00';

  if (!replaceBox) {
    contentBox.appendChild(adBox);
  }

  adObserver.observe(adBox);
}

function replaceAd(adBox) {
  let visibleTime;

  updateAdTimer(adBox);

  visibleTime = adBox.dataset.totalViewTime;
  console.log(
    '  Replacing ad: ' +
      adBox.querySelector('h2').innerText +
      ' - visible for ' +
      visibleTime
  );

  loadRandomAd(adBox);
}
