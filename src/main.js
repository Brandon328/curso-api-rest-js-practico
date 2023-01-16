
const API_URL = 'https://api.themoviedb.org/3';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'content-type': 'application/json;charset=utf-8'
  },
  params: {
    'api_key': API_KEY,
  }
});

// Intersection Obersever (Lazy Load)
let options = {
  root: trendingMoviesPreviewList,
}
let moviesObserver = new IntersectionObserver(lazyLoad, options);
let globalObserver = new IntersectionObserver(lazyLoad, null);
function lazyLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const movieImg = entry.target;
      const movieSrc = movieImg.getAttribute('data-src');
      movieImg.setAttribute('src', movieSrc);
      observer.unobserve(entry.target); // buenas practicas
    }
  });
}

// Utils
async function loadCategoryList() {
  const obj = {};
  const { data } = await api('/genre/movie/list');
  data.genres.forEach(genre => {
    obj[genre.name.toLowerCase()] = genre.id;
  });
  return obj;
}

async function loadMovies(container, path, observer, optionalConfig = {}, clean = true) {
  const { data } = await api(path, optionalConfig);

  const movies = data.results;
  if (clean) container.innerHTML = '';
  movies.forEach(movie => {
    if (movie.poster_path != null) {
      const movieContainer = document.createElement('div');
      movieContainer.classList.add('movie-container');
      movieContainer.addEventListener('click', () => {
        location.hash = `#movie=${movie.id}`;
      });

      const movieImg = document.createElement('img');
      movieImg.classList.add('movie-img');
      movieImg.setAttribute('alt', movie.title);
      movieImg.setAttribute('data-src', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`);

      movieContainer.appendChild(movieImg);
      container.appendChild(movieContainer);

      observer.observe(movieImg);
    }
  });
  return data.total_results;
}

function loadCategories(categories, container) {
  container.innerHTML = '';
  categories.forEach(category => {
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category-container');

    const categoryTitle = document.createElement('h3');
    categoryTitle.classList.add('category-title');
    categoryTitle.setAttribute('id', `id${category.id}`);
    categoryTitle.addEventListener('click', () => {
      location.hash = `#category=${category.name.toLowerCase()}`;
    });
    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
  });
}

// API
async function getTrendingMoviesPreview() {
  loadMovies(trendingMoviesPreviewList, '/trending/movie/day', moviesObserver);
}

async function getCategoriesPreview() {
  const { data } = await api('/genre/movie/list');
  loadCategories(data.genres, categoriesPreviewList);
}

async function getMoviesByCategory(category_id) {
  loadMovies(genericSection, '/discover/movie', globalObserver, {
    params: {
      with_genres: category_id,
    },
  });
}

async function getMoviesBySearch(query) {
  let counter = 0;
  while (counter < 2) {
    const total_results = await loadMovies(genericSection, '/search/movie', globalObserver, {
      params: {
        query,
      },
    });
    if (total_results == 0)
      if (localStorage.getItem('search-movie-title') == '') break;
      else query = localStorage.getItem('search-movie-title');
    else {
      localStorage.setItem('search-movie-title', '');
      break;
    }
    counter++;
  }
}

async function getTrendingMovies() {
  loadMovies(genericSection, '/trending/movie/day', globalObserver);
}

async function getMovieById(movieId) {
  const { data: movie } = await api(`/movie/${movieId}`);

  const movieImgUrl = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
  headerSection.style.background = `
    linear-gradient(
      180deg,
      rgba(0,0,0,0.35) 19.27%,
      rgba(0,0,0,0) 29.17%
    ),
    url(${movieImgUrl})
  `;

  movieDetailTitle.classList.remove('movieDetail-title--loading');
  movieDetailDescription.classList.remove('movieDetail-description--loading');
  movieDetailScore.classList.remove('inactive');
  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average.toFixed(1);

  loadCategories(movie.genres, movieDetailCategoriesList);
  getRelatedMoviesById(movieId)
}

async function getRelatedMoviesById(movieId) {
  const total_results = await loadMovies(relatedMoviesContainer, `/movie/${movieId}/recommendations`, globalObserver);
  if (total_results == 0) relatedMoviesPreContainer.classList.add('inactive');
  else relatedMoviesPreContainer.classList.remove('inactive');
}