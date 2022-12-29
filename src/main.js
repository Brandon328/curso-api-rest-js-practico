
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

// Utils
async function loadMovies(container, path, optionalConfig = {}) {
  const { data } = await api(path, optionalConfig);

  const movies = data.results;

  movies.forEach(movie => {
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');

    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');
    movieImg.setAttribute('alt', movie.title);
    movieImg.setAttribute('src', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`);

    movieContainer.appendChild(movieImg);
    container.appendChild(movieContainer);
  });
}

function loadCategories(categories, container) {
  categories.forEach(category => {
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category-container');

    const categoryTitle = document.createElement('h3');
    categoryTitle.classList.add('category-title');
    categoryTitle.setAttribute('id', `id${category.id}`);
    categoryTitle.addEventListener('click', () => {
      localStorage.setItem('category-id', category.id);
      headerCategoryTitle.textContent = category.name;
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
  loadMovies(trendingMoviesPreviewList, '/trending/movie/day');
}

async function getCategoriesPreview() {
  const { data } = await api('/genre/movie/list');
  loadCategories(data.genres, categoriesPreviewList);
}

async function getMoviesByCategory() {
  genericSection.innerHTML = '';

  loadMovies(genericSection, '/discover/movie', {
    params: {
      with_genres: localStorage.getItem('category-id'),
    },
  });
}
