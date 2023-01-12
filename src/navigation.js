let historyNav = [];
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
  genericSection.innerHTML = nodesMovies
  localStorage.setItem('search-movie-title', searchFormInput.value);
  location.hash = `#search=${searchFormInput.value}`;
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

function navigator() {
  window.scrollTo(0, 0);
  if (location.hash.startsWith('#trends')) {
    genericSection.innerHTML = nodesMovies;
    trendsPage();
  } else if (location.hash.startsWith('#search=')) {
    genericSection.innerHTML = nodesMovies;
    searchPage();
  } else if (location.hash.startsWith('#movie=')) {
    movieDetailCategoriesList.innerHTML = nodesCategories;
    relatedMoviesContainer.innerHTML = nodesRelatedMovies;
    moviePage();
  } else if (location.hash.startsWith('#category=')) {
    genericSection.innerHTML = nodesMovies;
    categoryPage();
  } else {
    historyNav = [];
    homePage();
  }
  if (location.hash.startsWith('#trends') || location.hash.startsWith('#search=')
    || location.hash.startsWith('#movie=') || location.hash.startsWith('#category=')) {
    if (historyNav[historyNav.length - 1] != location.hash) {
      historyNav.push(location.hash);
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

  movieDetailTitle.classList.add('movieDetail-title--loading');
  movieDetailDescription.classList.add('movieDetail-description--loading');
  movieDetailScore.classList.add('inactive');
  movieDetailTitle.textContent = '';
  movieDetailDescription.textContent = '';
  movieDetailScore.textContent = '';

  const [, movieId] = location.hash.split('=');
  getMovieById(movieId);
}
function categoryPage() {
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

  let [, category] = location.hash.split('=');
  category = category.toLocaleLowerCase().replace(/\+|%20/g, " ");
  headerCategoryTitle.textContent = category[0].toUpperCase() + category.substring(1);
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

  getTrendingMoviesPreview();
  getCategoriesPreview();
}