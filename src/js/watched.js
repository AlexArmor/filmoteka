import ApiService from './apiService';
import { Loading } from 'notiflix';
import { LISTNAME_TO_WATCH, LISTNAME_TO_QUEUE } from './modal';
import nothingImg from '../images/empty_library.jpg';
import MovieTemplate from '../templates/movieTemplate.hbs';
const libraryWatch = document.querySelector('.watched');
const libraryQueue = document.querySelector('.queue');
const watchedBtn = document.querySelector('.header__bnt--watched');
const queueBtn = document.querySelector('.header__bnt--queue');

export const myLibraryApi = new ApiService();

watchedBtn.addEventListener('click', makeLibraryCollectionsWatched);
queueBtn.addEventListener('click', makeLibraryCollectionsQueue);

(async () => {
  makeLibraryCollections(LISTNAME_TO_WATCH, libraryWatch, libraryQueue);
})();

function makeLibraryCollectionsWatched() {
  watchedBtn.classList.add('header__bnt--active');
  queueBtn.classList.remove('header__bnt--active');
  makeLibraryCollections(LISTNAME_TO_WATCH, libraryWatch, libraryQueue);
}
function makeLibraryCollectionsQueue() {
  queueBtn.classList.add('header__bnt--active');
  watchedBtn.classList.remove('header__bnt--active');
  makeLibraryCollections(LISTNAME_TO_QUEUE, libraryQueue, libraryWatch);
}

export function makeLibraryCollections(
  localStorageKey,
  library,
  libraryDelete
) {
  const watchedFilms = localStorage.getItem(localStorageKey);
  const parsedWatchedFilms = JSON.parse(watchedFilms);
  libraryDelete.innerHTML = '';
  if (watchedFilms) {
    parsedWatchedFilms.forEach(async el => {
      Loading.standard();
      try {
        const res = await myLibraryApi.getMovieById(el);
        const movieById = res.data;
        const genres = movieById.genres.map(el => el.name).join(', ');
        const date = new Date(movieById.release_date).getFullYear() || '';
        const img = movieById.poster_path
          ? `https://image.tmdb.org/t/p/original/${movieById.poster_path}`
          : 'https://dummyimage.com/395x592/000/fff.jpg&text=MOVIE+POSTER+IS+NOT+DEFINED';
        const rating = movieById.vote_average.toFixed(1);

        const MovieObj = {
          id: movieById.id,
          img,
          title: movieById.title,
          genres,
          releaseDate: date,
          rating,
        };

        const markup = MovieTemplate([MovieObj]);

        library.insertAdjacentHTML('beforeend', markup);
      } catch (err) {
        console.log(err.message);
      } finally {
        Loading.remove();
      }
    });
  } else {
    markupImg(library);
  }
  if (parsedWatchedFilms.length === 0) {
    markupImg(library);
  }
}

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
