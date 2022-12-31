searchFormBtn.addEventListener('click', () => {
  localStorage.setItem('search-movie-title', searchFormInput.value);
  location.hash = `#search=${searchFormInput.value}`;
});
trendingBtn.addEventListener('click', () => {
  location.hash = '#trends';
});
arrowBtn.addEventListener('click', () => {
  location.hash = window.history.back();
});
window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

function navigator() {
  if (location.hash) location.replace(location.hash.replace(/\+|%20/g, "-"));
  if (location.hash.startsWith('#trends')) {
    trendsPage();
  } else if (location.hash.startsWith('#search=')) {
    searchPage();
  } else if (location.hash.startsWith('#movie=')) {
    moviePage();
  } else if (location.hash.startsWith('#category=')) {
    categoryPage();
  } else {
    homePage();
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

  const [, query] = location.hash.split('=');
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

  getMoviesByCategory();
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

  if (!trendingMoviesPreviewList.childElementCount) getTrendingMoviesPreview();
  if (!categoriesPreviewList.childElementCount) getCategoriesPreview();
}