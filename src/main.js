// Language
btnLanguage.value = localStorage.getItem('language') || navigator.language;
selectLanguage(false);

// Data
const API_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'content-type': 'application/json;charset=utf-8'
  },
  params: {
    'api_key': API_KEY,
    'language': btnLanguage.value
  }
});

const translateApi = axios.create({
  baseURL: 'https://api.mymemory.translated.net/get',
});


function getLikedMovieList() {
  const likedMovieList = JSON.parse(localStorage.getItem('liked_movies'));
  let movies;
  if (likedMovieList) {
    movies = likedMovieList;
  }
  else {
    movies = {};
  }
  return movies;
}

function likeMovie(movie) {
  const likedMovieList = getLikedMovieList();
  if (likedMovieList[movie.id]) {
    delete likedMovieList[movie.id];
    trendingMoviesPreviewList.childNodes.forEach(node => {
      const id = node.getAttribute('data-id');
      if (movie.id == id)
        node.querySelector('button').classList.remove('movie-btn--liked');
    });
  }
  else
    likedMovieList[movie.id] = movie;

  localStorage.setItem('liked_movies', JSON.stringify(likedMovieList));
  getLikedMovies(500);
}

// Helpers
let maxPage;
function loadMovies(movies, container, observer, { clean = true, isLiked = false } = {}) {
  if (clean) container.innerHTML = '';
  const likedMovieList = getLikedMovieList();
  movies.forEach(movie => {
    if (movie.poster_path != null) {
      const movieContainer = document.createElement('div');
      movieContainer.classList.add('movie-container');
      movieContainer.setAttribute('data-id', movie.id);
      movieContainer.addEventListener('click', () => {
        location.hash = `#movie=${movie.id}`;
      });

      const movieImg = document.createElement('img');
      movieImg.classList.add('movie-img');
      movieImg.setAttribute('alt', movie.title);
      movieImg.setAttribute('data-src', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`);

      const movieBtn = document.createElement('button');
      movieBtn.classList.add('movie-btn');
      movieBtn.addEventListener('click', event => {
        event.stopPropagation();
        movieBtn.classList.toggle('movie-btn--liked');
        likeMovie(movie, event.target.parentNode);
      });

      if (likedMovieList || isLiked) {
        if (likedMovieList[movie.id]) movieBtn.classList.add('movie-btn--liked');
      }

      movieContainer.appendChild(movieImg);
      movieContainer.appendChild(movieBtn);
      container.appendChild(movieContainer);

      observer.observe(movieImg);
    }
  });
}

// Intersection Observer (Lazy Load)
let options = {
  root: trendingMoviesPreviewList,
}
let options2 = {
  root: likedMovieSection,
}
let moviesObserver = new IntersectionObserver(lazyLoad, options);
let likedMovieObserver = new IntersectionObserver(lazyLoad, options2);
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

async function queryLoadMovies(container, path, observer, optionalConfig = {}, clean = true) {
  const { data } = await api(path, optionalConfig);
  maxPage = data.total_pages;
  const movies = data.results;
  loadMovies(movies, container, observer, { clean });
  // return data.total_results;
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
  queryLoadMovies(trendingMoviesPreviewList, '/trending/movie/day', moviesObserver);
}

async function getCategoriesPreview() {
  const { data } = await api('/genre/movie/list');
  loadCategories(data.genres, categoriesPreviewList);
}

async function getMoviesByCategory(category_id) {
  queryLoadMovies(genericSection, '/discover/movie', globalObserver, {
    params: {
      with_genres: category_id,
    },
  });
}

function getMoviesBySearch(query) {
  queryLoadMovies(genericSection, '/search/movie', globalObserver, {
    params: {
      query,
    },
  });
}

async function getTrendingMovies() {
  queryLoadMovies(genericSection, '/trending/movie/day', globalObserver);
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
  const total_results = await queryLoadMovies(relatedMoviesContainer, `/movie/${movieId}/recommendations`, globalObserver);
  if (total_results == 0) relatedMoviesPreContainer.classList.add('inactive');
  else relatedMoviesPreContainer.classList.remove('inactive');
}

function getLikedMovies(delay = 0) {
  const likedMovieList = getLikedMovieList();
  if (likedMovieList) {
    setTimeout(() => {
      const moviesArray = Object.values(likedMovieList);
      loadMovies(moviesArray, likedMovieSection, likedMovieObserver);
    }, delay);
  }
}

// Language
function selectLanguage(reload = true) {
  const language = btnLanguage.value;
  switch (language) {
    case 'es-PE':
      flag.src = 'src/img/peru.svg';
      break;
    case 'es-ES':
      flag.src = 'src/img/spain.svg';
      break;
    case 'en-US':
      flag.src = 'src/img/us.svg';
      break;
    case 'fr-FR':
      flag.src = 'src/img/france.svg';
      break;
    case 'ja-JP':
      flag.src = 'src/img/japan.svg';
      break;
  }
  localStorage.setItem('language', language);
  if (reload) location.reload();
}

const [lang,] = btnLanguage.value.split('-');
if (lang == 'es') fillHeader();
else fillHeader(true, lang);

function fillHeader(translate = false, lang = '') {
  const headers = [
    ['Acci??n', headerCategoryTitle],
    ['Tendencias', trendingHeader],
    ['Ver m??s', trendingBtn],
    ['Categor??as', categoryHeader],
    ['Pel??culas favoritas', likedHeader],
    ['Pel??culas similares', relatedMoviesHeader],
    ['Hecho con amor en Platzi por @Brandon328', footer],
    ['Ingresa el nombre de la pel??cula', searchFormInput, true]
  ];

  headers.forEach(header => {
    if (translate) translateHeaders(header[0], header[1], lang, header[2]);
    else {
      if (header[2]) {
        header[1].placeholder = header[0];
      }
      else {
        header[1].textContent = header[0];
      }
    }
  });
}

async function translateHeaders(text, headerTag, lang, placeholder = false) {
  const { data } = await translateApi('', {
    params: {
      'q': text,
      'langpair': `es|${lang}`
    }
  });
  if (placeholder) headerTag.placeholder = data.responseData.translatedText;
  else headerTag.textContent = data.responseData.translatedText;
}