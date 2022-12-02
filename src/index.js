import './js/footer-modal';
import './js/modal.js';
import ApiService from './js/apiService';
import Movie from './js/movie';
import MovieTemplate from './templates/movieTemplate.hbs';
import Pagination from 'tui-pagination';
// import 'tui-pagination/dist/tui-pagination.css';
import { container, paginationSettings } from './js/pagination';
import arrowIcon from './images/pagination-icons/arrow-right.svg';

const refs = {
  movieListRef: document.querySelector('.movie-list'),
  formRef: document.querySelector('.header__search'),
};

refs.formRef.addEventListener('submit', onFormSubmit);

export const apiService = new ApiService();

async function onPageLoad(page) {
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
  }
}

onPageLoad(paginationSettings.startPage);

async function onFormSubmit(e) {
  e.preventDefault();

  const query = e.target.elements.input.value.trim();
  if (query === '') {
    return;
  }

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
  }
}

async function parseObjects(arr) {
  try {
    const {
      data: { genres },
    } = await apiService.getGenges();

    return arr.map(el => new Movie(el, genres));
  } catch (err) {
    console.log(err.message);
  }
}

function initPagination({ page, itemsPerPage, totalItems }) {
  const options = {
    totalItems,
    itemsPerPage,
    page,
    visiblePages: 5,
    centerAlign: false,
    template: {
      page: '<a href="#" class="tui-page-btn">{{page}}</a>',
      currentPage:
        '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
      moveButton: `<a href="#" class="tui-page-btn tui-{{type}}">
          <span class="tui-ico-{{type}}"> <img src="${arrowIcon}" alt="arrow-icon">
          </span>
        </a>`,
      disabledMoveButton: `<span class="tui-page-btn tui-is-disabled tui-{{type}}"><span class="tui-ico-{{type}}"><img src="${arrowIcon}" alt="arrow-icon"></span></span>`,
      moreButton:
        '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
        '<span class="tui-ico-ellip">...</span>' +
        '</a>',
    },
  };
  const pagination = new Pagination(container, options);

  paginationSettings.pagination = pagination;
  // paginationSettings.pagination.reset(totalItems);
  pagination.on('afterMove', async ({ page }) => {
    if (paginationSettings.searchType === 'homeSearch') {
      apiService.page = page;
      window.scroll(0, 0);
      try {
        const {
          data: { results },
        } = await apiService.getTrendingMovies();
        const markup = await parseObjects(results);
        refs.movieListRef.innerHTML = MovieTemplate(markup);
      } catch (err) {
        console.log(err.message);
      }
    } else if (paginationSettings.searchType === 'inputSearch') {
      window.scroll(0, 0);
      try {
        const {
          data: { results },
        } = await apiService.getMovieByName(
          paginationSettings.searchQuery,
          page
        );

        const newArr = await parseObjects(results);
        refs.movieListRef.innerHTML = MovieTemplate(newArr);
      } catch (err) {
        console.log(err.message);
      }
    }
  });
}
