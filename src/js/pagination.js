import Pagination from 'tui-pagination';
import { Loading } from 'notiflix';
import arrowIcon from '../images/pagination-icons/arrow-right.svg';
import { apiService, parseObjects, refs } from '../index';
import MovieTemplate from '../templates/movieTemplate.hbs';

export const container = document.getElementById('pagination');
export const paginationSettings = {
  startPage: 1,
  searchType: null,
  pagination: null,
  totalItems: null,
  searchQuery: null,
};

export function initPagination({ page, itemsPerPage, totalItems }) {
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

  pagination.on('afterMove', async ({ page }) => {
    if (paginationSettings.searchType === 'homeSearch') {
      apiService.page = page;
      window.scroll(0, 0);
      Loading.standard();
      try {
        const {
          data: { results, total_results },
        } = await apiService.getTrendingMovies();
        const markup = await parseObjects(results);
        refs.movieListRef.innerHTML = MovieTemplate(markup);
      } catch (err) {
        console.log(err.message);
      } finally {
        Loading.remove();
      }
    } else if (paginationSettings.searchType === 'inputSearch') {
      window.scroll(0, 0);
      Loading.standard();
      try {
        const {
          data: { results, total_results },
        } = await apiService.getMovieByName(
          paginationSettings.searchQuery,
          page
        );

        const newArr = await parseObjects(results);
        refs.movieListRef.innerHTML = MovieTemplate(newArr);
      } catch (err) {
        console.log(err.message);
      } finally {
        Loading.remove();
      }
    }
  });
}
