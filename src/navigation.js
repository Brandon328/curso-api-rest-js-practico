window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

function navigator() {
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
  console.log('TRENDS!!');
}
function searchPage() {
  console.log('SEARCH!!');
}
function moviePage() {
  console.log('MOVIE!!');
}
function categoryPage() {
  console.log('CATEGORY!!');
}
function homePage() {
  console.log('HOME!!');
  getTrendingMoviesPreview();
  getCategoriesPreview();
}