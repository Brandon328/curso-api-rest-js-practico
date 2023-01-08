let historyNav = [];

searchFormBtn.addEventListener('click', () => {
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
    trendsPage();
  } else if (location.hash.startsWith('#search=')) {
    searchPage();
  } else if (location.hash.startsWith('#movie=')) {
    moviePage();
  } else if (location.hash.startsWith('#category=')) {
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