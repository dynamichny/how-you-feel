const h1 = document.querySelector('h1');
const body = document.querySelector('body');
const editBtn = document.querySelector('#btn-edit');
const statsBtn = document.querySelector('#btn-stats');
const list = document.querySelector('.list>ul');
const navBtns = document.querySelectorAll('nav>button');
const days = JSON.parse(localStorage.getItem('days')) || [];
const currnetDate = new Date();
const spotifyRegex = /spotify/g;
const youtubeRegex = /youtu?.be/g;
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

newSubmition();
buildList();

window.addEventListener('scroll', debounce(checkSlide));

// nav button .active add/remove
navBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    if (document.querySelector('.active')) {
      document.querySelector('.active').classList.remove('active');
    }
    if (e.target.localName === 'img') {
      e.target.parentElement.classList.add('active');
    } else {
      e.target.classList.add('active');
    }
  });
});

editBtn.addEventListener('click', editBtnOnClick);
statsBtn.addEventListener('click', statsOnClick);

/* getCover('0ENset31OyeLe6nfRReuDv')
function getCover(uri) {
    fetch(`https://api.spotify.com/v1/tracks/${uri}`)
        .then(response => response.json())
        .then(json => {
            console.log(json.images)
        })
        .catch(error => console.log(error))
} */

function buildList() {
  document.querySelector('.list>ul').innerHTML = '';
  days.forEach(day => {
    const icon = `${day.mood}.svg`;

    /*  if(day.song.match(spotifyRegex)){
            let link = `https://api.spotify.com/v1/tracks/${day.song.split(':')[2]}`;
        } */

    const listComponent = document.createElement('li');
    listComponent.classList.add('list-component');
    listComponent.innerHTML = `
            <div class="daily-icon">
                <img src="src/img/${icon}">
            </div>
            <div class="daily-text">
                <h3 class="date" data-key="${days.findIndex(
                  element => element === day
                )}">${day.date[0]} ${months[day.date[1]]}</h3>
                <p>${day.description}</p>
            </div>
        `;
    document.querySelector('.list>ul').appendChild(listComponent);
  });
  document.querySelectorAll('.list-component').forEach(li => {
    li.addEventListener('click', songOnClick);
  });
  document.querySelectorAll('.list-component').forEach(element => {
    if (days[element.children[1].children[0].dataset.key].song) {
      element.addEventListener('mouseover', () => {
        element.classList.add('mouseover');
      });

      element.addEventListener('mouseleave', () => {
        element.classList.remove('mouseover');
      });
    }
  });
}

function buildSubmitionWindow() {
  const newSubmitionWindow = document.createElement('div');
  newSubmitionWindow.classList.add('newSubmition');
  newSubmitionWindow.classList.add('rem');
  newSubmitionWindow.innerHTML = `
        <div class="submitionWindow">
            <button class="close"><div></div></button>
            <h2>How do you feel today?</h2>
            <form>
                <ul>
                    <li class="mood" data-key="1" >
                        <img src="src/img/1.svg">
                    </li>
                    <li class="mood" data-key="2">
                        <img src="src/img/2.svg">
                    </li>
                    <li class="mood" data-key="3">
                        <img src="src/img/3.svg">
                    </li>
                    <li class="mood" data-key="4">
                        <img src="src/img/4.svg">
                    </li>
                    <li class="mood" data-key="5">
                        <img src="src/img/5.svg">
                    </li>
                </ul>
                <textarea id="describe" cols="1" rows="10" placeholder="Describe your day!"></textarea>
                <div class="song">
                    <label for="songRadio">
                        <input type="checkbox" id="songCheck">
                        Song of the day
                    </label>
                    <input type="text" class="songLink" placeholder="Spotify URl / YouTube link">
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
            `;
  document.querySelector('body').appendChild(newSubmitionWindow);
  setTimeout(() => {
    newSubmitionWindow.classList.remove('rem');
  }, 500);
  document.querySelectorAll('.mood').forEach(li => {
    li.addEventListener('click', e => {
      if (document.querySelector('.selected')) {
        document.querySelector('.selected').classList.remove('selected');
      }
      if (e.target.localName === 'img') {
        e.target.parentElement.classList.add('selected');
      } else {
        e.target.classList.add('selected');
      }
    });
  });
  document
    .querySelector('.song>label>#songCheck')
    .addEventListener('change', e => {
      if (e.target.checked) {
        document.querySelector('.songLink').classList.add('checked');
      } else {
        document.querySelector('.songLink').classList.remove('checked');
      }
    });
  document.querySelector('button.close').addEventListener('click', () => {
    close();
  });
}

function newSubmition() {
  if (
    days.length === 0 ||
    `${days[0].date[0]} ${days[0].date[1]} ${days[0].date[2]}` !==
      `${currnetDate.getDate()} ${currnetDate.getMonth()} ${currnetDate.getFullYear()}`
  ) {
    buildSubmitionWindow();
    document
      .querySelector('.submitionWindow>form')
      .addEventListener('submit', e => {
        e.preventDefault();
        if (document.querySelector('.selected')) {
          const newDay = {
            date: [
              currnetDate.getDate(),
              currnetDate.getMonth(),
              currnetDate.getFullYear(),
            ],
            mood: document.querySelector('.selected').dataset.key,
            description: document.querySelector('#describe').value,
            song: document.querySelector('.songLink').value,
          };
          days.unshift(newDay);
          localStorage.setItem('days', JSON.stringify(days));
          close();
          buildList();
        }
      });
  } else return false;
}

function close() {
  document.querySelector('.newSubmition').classList.add('rem');
  setTimeout(() => {
    document
      .querySelector('body')
      .removeChild(document.querySelector('.newSubmition'));
  }, 500);
  document.querySelector('.active').classList.remove('.active');
}

function debounce(func, wait = 15, immediate = true) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function checkSlide() {
  if (window.scrollY > 60) {
    navBtns.forEach(btn => {
      btn.classList.add('hidden');
    });
  } else {
    navBtns.forEach(btn => {
      btn.classList.remove('hidden');
    });
  }
}

function youtubeParser(url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : false;
}

function songOnClick() {
  const youtubecomRegex = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})\W/g;
  const { song } = days[this.children[1].children[0].dataset.key];
  if (youtubeParser(song)) {
    const filmId = youtubeParser(song);
    const songWindow = document.createElement('div');
    songWindow.classList.add('songWindow');
    songWindow.classList.add('rem');
    songWindow.innerHTML = `
            <iframe src="https://www.youtube.com/embed/${filmId}" height="" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        `;
    body.appendChild(songWindow);

    setTimeout(() => {
      songWindow.classList.remove('rem');
    }, 100);

    setVideoHeight();

    function setVideoHeight() {
      document.querySelector('.songWindow').children[0].attributes[1].value =
        songWindow.children[0].clientWidth * 0.562;
    }

    if (songWindow) {
      setVideoHeight();
      window.addEventListener('resize', () => {
        setVideoHeight();
      });

      songWindow.addEventListener('click', el => {
        if (el.target.classList[0] === 'songWindow') {
          songWindow.classList.add('rem');
          setTimeout(() => {
            body.removeChild(songWindow);
          }, 300);
        }
      });
    }
  }

  if (song.match(spotifyRegex)) {
    const spotifyId = song.split(':')[2];
    const songWindow = document.createElement('div');
    songWindow.classList.add('songWindow');
    songWindow.classList.add('rem');
    songWindow.innerHTML = `
            <iframe src="https://open.spotify.com/embed/track/${spotifyId}"  height="" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        `;
    body.appendChild(songWindow);

    setTimeout(() => {
      songWindow.classList.remove('rem');
    }, 100);

    function setVideoHeight() {
      document.querySelector('.songWindow').children[0].attributes[1].value =
        songWindow.children[0].clientWidth * 0.8;
    }

    if (songWindow) {
      setVideoHeight();
      window.addEventListener('resize', () => {
        setVideoHeight();
      });

      songWindow.addEventListener('click', el => {
        if (el.target.classList[0] === 'songWindow') {
          songWindow.classList.add('rem');
          setTimeout(() => {
            body.removeChild(songWindow);
          }, 300);
        }
      });
    }
  }
}

function editBtnOnClick(e) {
  newSubmition();
  const today = days[0];
  const newSubmitionWindow = document.createElement('div');
  newSubmitionWindow.classList.add('newSubmition');
  newSubmitionWindow.classList.add('rem');
  newSubmitionWindow.innerHTML = `
          <div class="submitionWindow">
              <button class="close"><div></div></button>
              <h2>Has something changed?</h2>
              <form>
                  <ul>
                      <li class="mood ${
                        today.mood === '1' ? 'selected' : ''
                      }" data-key="1" >
                          <img src="src/img/1.svg">
                      </li>
                      <li class="mood ${
                        today.mood === '2' ? 'selected' : ''
                      }" data-key="2">
                          <img src="src/img/2.svg">
                      </li>
                      <li class="mood ${
                        today.mood === '3' ? 'selected' : ''
                      }" data-key="3">
                          <img src="src/img/3.svg">
                      </li>
                      <li class="mood ${
                        today.mood === '4' ? 'selected' : ''
                      }" data-key="4">
                          <img src="src/img/4.svg">
                      </li>
                      <li class="mood ${
                        today.mood === '5' ? 'selected' : ''
                      }" data-key="5">
                          <img src="src/img/5.svg">
                      </li>
                  </ul>
                  <textarea id="describe" cols="1" rows="10" placeholder="Describe your day!">${
                    today.description
                  }</textarea>
                  <div class="song">
                      <label for="songRadio">
                          <input type="checkbox" id="songCheck" ${
                            today.song ? 'checked' : ''
                          }>
                          Song of the day
                      </label>
                      <input type="text" class="songLink" placeholder="Spotify URl / YouTube link" value="${
                        today.song
                      }">
                  </div>
                  <button type="submit">Save</button>
              </form>
          </div>
              `;
  document.querySelector('body').appendChild(newSubmitionWindow);
  setTimeout(() => {
    newSubmitionWindow.classList.remove('rem');
  }, 500);
  if (document.querySelector('.song>label>#songCheck').attributes.checked) {
    document.querySelector('.songLink').classList.add('checked');
  }
  document.querySelectorAll('.mood').forEach(li => {
    li.addEventListener('click', e => {
      if (document.querySelector('.selected')) {
        document.querySelector('.selected').classList.remove('selected');
      }
      if (e.target.localName === 'img') {
        e.target.parentElement.classList.add('selected');
      } else {
        e.target.classList.add('selected');
      }
    });
  });
  document
    .querySelector('.song>label>#songCheck')
    .addEventListener('change', e => {
      if (e.target.checked) {
        document.querySelector('.songLink').classList.add('checked');
      } else {
        document.querySelector('.songLink').classList.remove('checked');
        document.querySelector('.songLink').value = '';
      }
    });
  document.querySelector('button.close').addEventListener('click', () => {
    close();
    document.querySelector('.active').classList.remove('active');
  });

  document
    .querySelector('.submitionWindow>form')
    .addEventListener('submit', e => {
      e.preventDefault();
      if (document.querySelector('.selected')) {
        const newDay = {
          date: [
            currnetDate.getDate(),
            currnetDate.getMonth(),
            currnetDate.getFullYear(),
          ],
          mood: document.querySelector('.selected').dataset.key,
          description: document.querySelector('#describe').value,
          song: document.querySelector('.songLink').value,
        };
        days[0] = newDay;
        localStorage.setItem('days', JSON.stringify(days));
        close();
        buildList();
      }
    });
}

function statsOnClick() {
  const newWindow = document.createElement('div');
  newWindow.classList.add('newSubmition');
  newWindow.classList.add('rem');
  newWindow.innerHTML = `
          <div class="statsWindow">
              <button class="close"><div></div></button>
              <h2>Statistics</h2>
              <p>Days from beginning: ${days[days.length - 1].date[0]} ${
    months[days[days.length - 1].date[1]]
  } ${days[days.length - 1].date[2]}</p>
              <p>Number of submitions: ${days.length}</p>
              <br>
              <p>Number of <span class="awesome">awesome</span> days:   ${numberOfMoods(
                '5'
              )}<p>
              <p>Number of <span class="good">good</span> days:   ${numberOfMoods(
                '4'
              )}<p>
              <p>Number of <span class="regular">regular</span> days:   ${numberOfMoods(
                '3'
              )}<p>
              <p>Number of <span class="bad">bad</span> days:   ${numberOfMoods(
                '2'
              )}<p>
              <p>Number of <span class="awful">awful</span> days:   ${numberOfMoods(
                '1'
              )}<p>


          </div>
              `;
  document.querySelector('body').appendChild(newWindow);
  setTimeout(() => {
    newWindow.classList.remove('rem');
  }, 500);
  document.querySelector('.close').addEventListener('click', close);
}

function numberOfMoods(mood) {
  let num = 0;
  days.forEach(day => {
    if (day.mood == mood) {
      num++;
    }
  });
  return num;
}
