import { Notify, Loading } from 'notiflix';
import ApiService from './apiService';
import TrailerTemplate from '../templates/trailerTemplate.hbs';
import nothingImg from '../images/empty_library.jpg';
const youtubeContainerEl = document.querySelector(
  '.modal_youtube_video_container'
);

const libraryWatch = document.querySelector('.watched');
const libraryQueue = document.querySelector('.queue');
const youtubeTrailerEl = document.querySelector('.modal_youtube_video');

const movieItemEl = document.querySelector('.movie-list');
const imageEl = document.querySelector('.modal_image');
const titleNameValueEl = document.querySelector('.modal_info_name');
const voteValueEl = document.querySelector('[data-vote]');
const votesSumValueEl = document.querySelector('[data-votes]');
const popularityValueEl = document.querySelector('[data-popularity]');
const original_titleValueEl = document.querySelector('[data-title]');
const genresValueEl = document.querySelector('[data-genres]');
const overviewValueEl = document.querySelector('[data-text-overview]');
const modalWindowEl = document.getElementById('modal_window');
const addToWatchedListBtn = document.querySelector('.js-toWatchBtn');
const addToQueueListBtn = document.querySelector('.js-toAddtoQue');
const showTrailerBtn = document.querySelector('.modal_movie_trailer--ref');
let addedToWatchedArray = [];
let addedToQueueArray = [];

export const LISTNAME_TO_WATCH = 'added-to-watched';
export const LISTNAME_TO_QUEUE = 'added-to-queue';

const onClickOpenModal = event => {
  if (event.target.tagName === 'UL') {
    return;
  }
  Loading.standard({
    clickToClose: true,
    svgSize: '100px',
    cssAnimationDuration: 0,
  });
  const movieId = event.target.closest('li').getAttribute('data-id');
  const newMovie = new ApiService();

  newMovie
    .getMovieById(movieId)
    .then(object => {
      addToWatchedListBtn.dataset.movieId = movieId;
      addToQueueListBtn.dataset.movieId = movieId;
      titleNameValueEl.textContent = object.data.original_title;
      voteValueEl.textContent = object.data.vote_average;
      votesSumValueEl.textContent = object.data.vote_count;
      popularityValueEl.textContent = object.data.popularity;
      original_titleValueEl.textContent = object.data.original_title;
      overviewValueEl.textContent = object.data.overview;
      genresValueEl.textContent = object.data.genres
        .map(el => el.name)
        .join(', ');
      imageEl.src = event.target.closest('LI').querySelector('img').src;
      modalWindowEl.showModal();
    })
    .catch(err =>
      Notify.info('Sorry, this movie is currently unavailable!', {
        fontSize: '16px',
        width: '200px',
      })
    )
    .finally(Loading.remove);

  if (localStorage.getItem(LISTNAME_TO_WATCH)) {
    if (JSON.parse(localStorage.getItem(LISTNAME_TO_WATCH)).includes(movieId)) {
      addToWatchedListBtn.textContent = 'REMOVE FROM WATCHED';
      addToWatchedListBtn.style.color = 'white';
      addToWatchedListBtn.style.backgroundColor = '#ff6b02';
    }
    if (
      !JSON.parse(localStorage.getItem(LISTNAME_TO_WATCH)).includes(movieId)
    ) {
      addToWatchedListBtn.style.backgroundColor = 'white';
      addToWatchedListBtn.style.color = 'black';
      addToWatchedListBtn.textContent = 'ADD TO WATCHED';
    }
  }

  if (localStorage.getItem(LISTNAME_TO_QUEUE)) {
    if (JSON.parse(localStorage.getItem(LISTNAME_TO_QUEUE)).includes(movieId)) {
      addToQueueListBtn.textContent = 'REMOVE FROM QUEUE';
      addToQueueListBtn.style.color = 'white';
      addToQueueListBtn.style.backgroundColor = '#ff6b02';
    }
    if (
      !JSON.parse(localStorage.getItem(LISTNAME_TO_QUEUE)).includes(movieId)
    ) {
      addToQueueListBtn.style.backgroundColor = 'white';
      addToQueueListBtn.style.color = 'black';
      addToQueueListBtn.textContent = 'ADD TO QUEUE';
    }
  }

  newMovie
    .getMovieTrailerByID(movieId)
    .then(response => {
      let trailerKey = response.data.results[0].key;
      // showTrailerBtn.href = `https://www.youtube.com/watch?v=${trailerKey}`
      // youtubeTrailerEl.src = `https://www.youtube.com/embed/${trailerKey}`;
      // youtubeContainerEl.style.display = 'flex';
      youtubeContainerEl.innerHTML = TrailerTemplate(trailerKey);
    })
    .catch(err => {
      youtubeContainerEl.innerHTML = '';
      console.log(err.message);
    });
};

const onClickCloseModal = event => {
  if (
    event.target.tagName === 'DIALOG' ||
    event.target.closest('.modal_close_btn')
  ) {
    modalWindowEl.close();
    // youtubeTrailerEl.src = '';
  }
};

const addToWatchedList = event => {
  let movieIdModal = event.target.dataset.movieId;
  if (JSON.parse(localStorage.getItem(LISTNAME_TO_WATCH)) === null) {
    addedToWatchedArray = [];
  } else {
    addedToWatchedArray = JSON.parse(localStorage.getItem(LISTNAME_TO_WATCH));
  }

  if (addedToWatchedArray.includes(movieIdModal)) {
    addedToWatchedArray.splice(addedToWatchedArray.indexOf(movieIdModal), 1);
    addToWatchedListBtn.style.backgroundColor = 'white';
    addToWatchedListBtn.style.color = 'black';
    addToWatchedListBtn.textContent = 'ADD TO WATCHED';

    if (location.pathname.includes('library')) {
      const itemDelete = libraryWatch.querySelector(
        `[data-id="${movieIdModal}"]`
      );

      modalWindowEl.close();
      setTimeout(() => {
        itemDelete.remove();
      }, 300);
      if (addedToWatchedArray.length === 0) {
        markupImg(libraryWatch);
      }
    }

    return localStorage.setItem(
      LISTNAME_TO_WATCH,
      JSON.stringify(addedToWatchedArray)
    );
  }
  if (!addedToWatchedArray.includes(movieIdModal)) {
    addedToWatchedArray.push(movieIdModal);
    addToWatchedListBtn.style.color = 'white';
    addToWatchedListBtn.style.backgroundColor = '#ff6b02';
    addToWatchedListBtn.textContent = 'REMOVE FROM WATCHED';
    return localStorage.setItem(
      LISTNAME_TO_WATCH,
      JSON.stringify(addedToWatchedArray)
    );
  }
};

const addToQueueList = event => {
  let movieIdModal = event.target.dataset.movieId;

  if (JSON.parse(localStorage.getItem(LISTNAME_TO_QUEUE)) === null) {
    addedToQueueArray = [];
  } else {
    addedToQueueArray = JSON.parse(localStorage.getItem(LISTNAME_TO_QUEUE));
  }

  if (addedToQueueArray.includes(movieIdModal)) {
    addedToQueueArray.splice(addedToQueueArray.indexOf(movieIdModal), 1);
    addToQueueListBtn.style.backgroundColor = 'white';
    addToQueueListBtn.style.color = 'black';
    addToQueueListBtn.textContent = 'ADD TO QUEUE';

    if (location.pathname.includes('library')) {
      const itemDelete = libraryQueue.querySelector(
        `[data-id="${movieIdModal}"]`
      );

      modalWindowEl.close();
      setTimeout(() => {
        itemDelete.remove();
      }, 300);
      if (addedToQueueArray.length === 0) {
        markupImg(libraryQueue);
      }
    }

    return localStorage.setItem(
      LISTNAME_TO_QUEUE,
      JSON.stringify(addedToQueueArray)
    );
  }
  if (!addedToQueueArray.includes(movieIdModal)) {
    addedToQueueArray.push(movieIdModal);
    addToQueueListBtn.style.color = 'white';
    addToQueueListBtn.style.backgroundColor = '#ff6b02';
    addToQueueListBtn.textContent = 'REMOVE FROM QUEUE';
    return localStorage.setItem(
      LISTNAME_TO_QUEUE,
      JSON.stringify(addedToQueueArray)
    );
  }
};

if (location.pathname.includes('library')) {
  libraryWatch.addEventListener('click', onClickOpenModal);
  libraryQueue.addEventListener('click', onClickOpenModal);
}

movieItemEl.addEventListener('click', onClickOpenModal);
window.addEventListener('click', onClickCloseModal);
addToWatchedListBtn.addEventListener('click', addToWatchedList);
addToQueueListBtn.addEventListener('click', addToQueueList);

// localStorage.clear()

export function markupImg(library) {
  const markup = `
  <li class='empty__item'>
  <img
    class='empty__img'
    width='440'
    src="${nothingImg}"
    loading='lazy'
  />
  </li>
`;
  library.innerHTML = markup;
}
