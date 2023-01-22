let historyNav = [];
let page = 1;
const nodesMovies = `
  <div class="movie-container movie-container--loading"></div>
  <div class="movie-container movie-container--loading"></div>
  <div class="movie-container movie-container--loading"></div>
  <div class="movie-container movie-container--loading"></div>
`;
const nodesCategories = `
  <div class="category-skeleton"></div>
  <div class="category-skeleton"></div>
  <div class="category-skeleton"></div>
  <div class="category-skeleton"></div>
  <div class="category-skeleton"></div>
  <div class="category-skeleton"></div>
`;
const nodesRelatedMovies = `
  <div class="movie-container movie-skeleton"></div>
  <div class="movie-container movie-skeleton"></div>
  <div class="movie-container movie-skeleton"></div>
  <div class="movie-container movie-skeleton"></div>
  <div class="movie-container movie-skeleton"></div>
  <div class="movie-container movie-skeleton"></div>
`;

searchFormBtn.addEventListener('click', () => {
  if (searchFormInput.value != '') {
    genericSection.innerHTML = nodesMovies
    localStorage.setItem('search-movie-title', searchFormInput.value);
    location.hash = `#search=${searchFormInput.value}`;
  }
  // location.replace(location.hash.replace(/\+|%20/g, "-"))
});
trendingBtn.addEventListener('click', () => {
  location.hash = '#trends';
});
arrowBtn.addEventListener('click', () => {
  if (historyNav.length < 2) location.hash = '#home';
  else {
    location.hash = historyNav[historyNav.length - 2];
    historyNav.pop();
  }
});
window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('storage', e => {
  console.log(e);
}, false);

function navigator() {
  // window.removeEventListener('scroll', infiniteScroll);
  window.scrollTo(0, 0);
  if (location.hash.startsWith('#trends')) { // <=
    genericSection.innerHTML = nodesMovies;
    trendsPage();
  } else if (location.hash.startsWith('#search=')) { // <=
    genericSection.innerHTML = nodesMovies;
    searchPage();
  } else if (location.hash.startsWith('#movie=')) {
    movieDetailCategoriesList.innerHTML = nodesCategories;
    relatedMoviesContainer.innerHTML = nodesRelatedMovies;
    moviePage();
  } else if (location.hash.startsWith('#category=')) { // <=
    genericSection.innerHTML = nodesMovies;
    categoryPage();
  } else {
    historyNav = [];
    homePage();
  }
  if (!location.hash.startsWith('#home')) {
    if (historyNav[historyNav.length - 1] != location.hash) {
      historyNav.push(location.hash);
    }
  }
  if (location.hash.startsWith('#trends')
    || location.hash.startsWith('#category=')
    || location.hash.startsWith('#search=')) {
    page = 1;
    window.addEventListener('scroll', infiniteScroll);
  }
  else {
    window.removeEventListener('scroll', infiniteScroll);
  }
}

async function infiniteScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  const isAtBottom = (scrollTop + clientHeight) >= (scrollHeight - 5);
  const isNotMaxPage = page < maxPage;
  if (isAtBottom && isNotMaxPage) {
    page++;
    if (location.hash.startsWith('#trends')) {
      queryLoadMovies(genericSection, '/trending/movie/day',
        globalObserver, { params: { page, }, }, false);
    }
    if (location.hash.startsWith('#category=')) {
      let [, category] = location.hash.split('=');
      const obj = await loadCategoryList();
      queryLoadMovies(genericSection, '/discover/movie',
        globalObserver,
        {
          params: {
            with_genres: obj[category],
            page
          },
        }, false);
    }
    if (location.hash.startsWith('#search=')) {
      let query = localStorage.getItem('search-movie-title');
      queryLoadMovies(genericSection, '/search/movie', globalObserver, {
        params: {
          query,
          page
        },
      }, false);
    }
  }
}

function trendsPage() {
  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';

  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.remove('inactive');
  searchForm.classList.add('inactive');
  liked.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  headerCategoryTitle.innerText = 'Tendencias';

  getTrendingMovies();
}
function searchPage() {
  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';

  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.remove('inactive');
  liked.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  let [, query] = location.hash.split('=');
  query = query.replace(/\+|%20/g, " ");
  getMoviesBySearch(query);
}
function moviePage() {
  headerSection.classList.add('header-container--long');
  headerSection.style.background = '';

  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.add('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.add('inactive');
  movieDetailSection.classList.remove('inactive');
  liked.classList.add('inactive');

  movieDetailTitle.classList.add('movieDetail-title--loading');
  movieDetailDescription.classList.add('movieDetail-description--loading');
  movieDetailScore.classList.add('inactive');
  movieDetailTitle.textContent = '';
  movieDetailDescription.textContent = '';
  movieDetailScore.textContent = '';

  const [, movieId] = location.hash.split('=');
  getMovieById(movieId);
}
async function categoryPage() {
  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.remove('inactive');
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');
  liked.classList.add('inactive');

  let [, category] = location.hash.split('=');
  category = category.toLocaleLowerCase().replace(/\+|%20/g, " ");
  headerCategoryTitle.textContent = category[0].toUpperCase() + category.substring(1);
  const obj = await loadCategoryList();
  getMoviesByCategory(obj[category]);
}
function homePage() {
  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';

  arrowBtn.classList.add('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.remove('inactive');
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.remove('inactive');

  trendingPreviewSection.classList.remove('inactive');
  categoriesPreviewSection.classList.remove('inactive');
  genericSection.classList.add('inactive');
  movieDetailSection.classList.add('inactive');
  liked.classList.remove('inactive');

  getTrendingMoviesPreview();
  getCategoriesPreview();
  getLikedMovies();
}