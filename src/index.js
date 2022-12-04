import { Loading } from 'notiflix';
import './js/footer-modal';
import './js/button-up.js';
import './js/modal.js';
import ApiService from './js/apiService';
import Movie from './js/movie';
import MovieTemplate from './templates/movieTemplate.hbs';
import { paginationSettings, initPagination } from './js/pagination';

export const refs = {
  movieListRef: document.querySelector('.movie-list'),
  formRef: document.querySelector('.header__search'),
};

refs.formRef.addEventListener('submit', onFormSubmit);

export const apiService = new ApiService();

async function onPageLoad(page) {
  Loading.standard();
  try {
    const {
      data: { results, total_results },
    } = await apiService.getTrendingMovies();

    initPagination({
      page,
      itemsPerPage: results.length,
      totalItems: total_results,
    });
    paginationSettings.searchType = 'homeSearch';
    const markup = await parseObjects(results);

    refs.movieListRef.innerHTML = MovieTemplate(markup);
  } catch (err) {
    console.log(err.message);
  } finally {
    Loading.remove();
  }
}

onPageLoad(paginationSettings.startPage);

async function onFormSubmit(e) {
  e.preventDefault();

  const query = e.target.elements.input.value.trim();
  if (query === '') {
    return;
  }

  Loading.standard();

  paginationSettings.searchType = 'inputSearch';
  paginationSettings.searchQuery = query;

  try {
    const {
      data: { results, total_results, page },
    } = await apiService.getMovieByName(
      paginationSettings.searchQuery,
      paginationSettings.startPage
    );
    const newArr = await parseObjects(results);

    // Додаткова перевірка для Input
    if (newArr.length == 0) {
      refs.formRef.parentNode.classList.add('header__alert');
      const removeAlert = () => {
        const setID = setTimeout(() => {
          refs.formRef.parentNode.classList.remove('header__alert');
        }, 3500);
      };
      removeAlert();
      return;
    } else {
      refs.movieListRef.innerHTML = MovieTemplate(newArr);
    }

    initPagination({
      page,
      itemsPerPage: results.length,
      totalItems: total_results,
    });
  } catch (err) {
    console.log(err.message);
  } finally {
    e.target.reset();
    Loading.remove();
  }
}

export async function parseObjects(arr) {
  try {
    const {
      data: { genres },
    } = await apiService.getGenges();

    return arr.map(el => new Movie(el, genres));
  } catch (err) {
    console.log(err.message);
  }
}
