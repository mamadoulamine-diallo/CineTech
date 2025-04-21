const API_KEY = '8c4b867188ee47a1d4e40854b27391ec';
const BASE_URL = 'https://api.themoviedb.org/3';
const LANG = '&language=fr-FR';

const endpoints = {
  trending: `${BASE_URL}/trending/all/week?api_key=${API_KEY}${LANG}`,
  latestMovies: `${BASE_URL}/movie/now_playing?api_key=${API_KEY}${LANG}&page=1`,
  latestSeries: `${BASE_URL}/tv/airing_today?api_key=${API_KEY}${LANG}&page=1`,
  popular: `${BASE_URL}/movie/popular?api_key=${API_KEY}${LANG}&page=1`
};

const searchBtn = document.querySelector(".search-btn");

async function displayBanner() {
  const response = await fetch(endpoints.popular);
  const data = await response.json();
  const topMovies = data.results.slice(0, 5);
  
  const banner = document.getElementById("banner-carousel");

  banner.innerHTML = topMovies.map((movie, index) => `
    <div class="slide ${index === 0 ? 'active' : ''}" style="background-image: url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')">
      <div class="slide-content">
        <h2>${movie.original_title}</h2>
        <p>Date de sortie : ${movie.release_date}</p>
      </div>
    </div>
  `).join("");

  let current = 0;
  const slides = document.querySelectorAll(".slide");

  setInterval(() => {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
  }, 4000);
}

async function fetchAndDisplay(url, containerId) {
  const response = await fetch(url);
  const data = await response.json();
  const items = data.results;

  const container = document.getElementById(containerId);
  container.innerHTML = items.map(item => `
    <div class="card">
      <img src="https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}" alt="${item.original_title || item.name}">
      <h2>${item.original_title || item.name}</h2>
    </div>
  `).join('');
}

document.addEventListener("DOMContentLoaded", async () => {
  await displayBanner(); 
  fetchAndDisplay(endpoints.trending, "trending");
  fetchAndDisplay(endpoints.latestMovies, "latest-movies");
  fetchAndDisplay(endpoints.latestSeries, "latest-shows");

  // Fetch trending movies for search bar
  const response = await fetch(endpoints.trending);
  const data = await response.json();
  const movies = data.results;

  searchBar(movies);
});

// ==== search bar display and suggestions
document.addEventListener("DOMContentLoaded", function () {
  const searchIcon = document.querySelector('.search-icon');
  const searchBar = document.querySelector('.search-bar');

  function displaySearchBar() {
    searchIcon.addEventListener('click', function() {
      searchBar.classList.toggle('active');
    });
  }

  displaySearchBar();
});

function searchBar(movies) {
  const searchInput = document.querySelector('.search-input');
  const suggestionsContainer = document.querySelector('.suggestions');
  const moviesContainer = document.getElementById("result");

  if (!searchInput || !suggestionsContainer) return;

  searchInput.addEventListener('keyup', function () {
    const movie = searchInput.value.trim();

    const resultat = movies.filter(item =>
      (item.title || item.name || "").toLowerCase().includes(movie.toLowerCase())
    );

    let suggestionsHTML = '';

    if (movie.length > 0) {
      resultat.slice(0, 3).forEach(resultatItem => {
        suggestionsHTML += `
          <div class="suggestion-item" data-id="${resultatItem.title || resultatItem.name}">
            <img src="https://image.tmdb.org/t/p/w500${resultatItem.poster_path}" alt="${resultatItem.title || resultatItem.name}" />
            <h2>${resultatItem.title || resultatItem.name}</h2>
          </div>
          <hr/>
        `;
      });

      suggestionsContainer.innerHTML = suggestionsHTML;
    } else {
      suggestionsContainer.innerHTML = '';
    }
  });

  suggestionsContainer.addEventListener('click', function (event) {
    const target = event.target.closest('.suggestion-item');

    if (target) {
      const selectedTitle = target.getAttribute('data-id');
      searchInput.value = selectedTitle;
      suggestionsContainer.innerHTML = '';

      const selectedData = movies.find(item => (item.title || item.name) === selectedTitle);

      if (selectedData) {
        moviesContainer.innerHTML = '';

        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');

        movieElement.innerHTML = `
          <div class="movie-card">
            <img src="https://image.tmdb.org/t/p/w500${selectedData.poster_path}" alt="${selectedData.title || selectedData.name}" />
            <div class="movie-footer">
              <h2>${selectedData.title || selectedData.name}</h2>
              <span class="movie-rating">${selectedData.vote_average}</span>
              <p class="favorites">+</p>
            </div>
          </div>
        `;

        moviesContainer.appendChild(movieElement);

        const favButton = movieElement.querySelector('.favorites');
        favButton.addEventListener('click', function () {
          addToFavorites(selectedData);
        });
      }
    }
  });
}

function addToFavorites(movie) {
  console.log('Ajouté aux favoris :', movie);
}
