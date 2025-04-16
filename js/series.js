const container = document.getElementById('series-container');
const additionalSeriesContainer = document.getElementById('additional-series-container');

let currentIndex = 0;
let currentPage = 1;
let totalPages = null;
let allAdditionalSeries = [];
const url = 'https://api.themoviedb.org/3/movie/popular?api_key=8c4b867188ee47a1d4e40854b27391ec&language=fr-FR&page=1';

    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })

function loadSeries(page) {
  const url = `https://api.themoviedb.org/3/tv/popular?api_key=8c4b867188ee47a1d4e40854b27391ec&language=fr-FR&page=${page}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      totalPages = data.total_pages;
      const newSeries = data.results;

      if (page === 1) {
        newSeries.forEach(serie => {
          const card = createSerieCard(serie);
          container.appendChild(card);
        });
      } else {
        allAdditionalSeries = allAdditionalSeries.concat(newSeries);
        initPagination();
      }
    })
    .catch(err => console.error("Erreur de chargement des séries:", err));
}

function createSerieCard(serie) {
  const card = document.createElement('div');
  card.className = 'serie-card';

  card.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w300${serie.poster_path}" alt="${serie.name}">
    <div class="bottom"><strong>${serie.name}</strong></div>
    <button class="add-to-fav-btn" onclick="event.stopPropagation(); addToFavorites('${serie.name}')">+</button>
  `;

  const favButton = card.querySelector('.add-to-fav-btn');

  function showTooltip(event) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = 'Ajouter aux favoris';
    document.body.appendChild(tooltip);
    const buttonRect = favButton.getBoundingClientRect();
    tooltip.style.position = 'absolute';
    tooltip.style.left = `${buttonRect.left + buttonRect.width / 2 - tooltip.offsetWidth / 2}px`;
    tooltip.style.top = `${buttonRect.top - tooltip.offsetHeight - 5}px`;
  }

  function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) tooltip.remove();
  }

  favButton.addEventListener('mouseover', showTooltip);
  favButton.addEventListener('mouseout', hideTooltip);

  card.addEventListener('click', () => {
    window.location.href = `../views/seriesdetails.html?id=${serie.id}`;
  });

  return card;
}

function addToFavorites(name) {
  alert(`${name} ajouté aux favoris !`);
}

function initPagination() {
  $('#pagination-container').pagination({
    dataSource: allAdditionalSeries,
    pageSize: 5,
    showGoInput: true,
    showGoButton: true,
    formatGoInput: 'Page <%= input %>',
    callback: function(data, pagination) {
      additionalSeriesContainer.innerHTML = '';
      data.forEach(serie => {
        const card = createSerieCard(serie);
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        additionalSeriesContainer.appendChild(card);
        setTimeout(() => {
          card.style.transition = 'all 0.5s ease';
          card.style.opacity = 1;
          card.style.transform = 'translateY(0)';
        }, 50);
      });
    }
  });
}

function scrollCarousel(direction) {
  const cardWidth = 210;
  const visibleCards = 4;
  const totalCards = container.children.length;
  const maxIndex = totalCards - visibleCards;
  currentIndex += direction;
  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex > maxIndex) currentIndex = maxIndex;
  const offset = currentIndex * cardWidth;
  container.style.transform = `translateX(-${offset}px)`;
}

const searchInput = document.getElementById('searchInput');
const searchIcon = document.getElementById('searchIcon');
const suggestionsBox = document.getElementById('suggestions');

searchIcon.addEventListener('click', () => {
  searchInput.focus();
  searchInput.style.display = 'block';
  suggestionsBox.style.display = 'none';
});

function initSearch() {
  searchInput.addEventListener('input', handleSearchInput);
}

function handleSearchInput() {
  const query = searchInput.value.trim();
  if (query === "") {
    hideSuggestions();
  } else {
    fetchSuggestions(query);
  }
}

function fetchSuggestions(query) {
  const url = `https://api.themoviedb.org/3/search/tv?api_key=8c4b867188ee47a1d4e40854b27391ec&language=fr-FR&query=${encodeURIComponent(query)}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const suggestions = data.results;
      displaySuggestions(suggestions);
    })
    .catch(err => console.error("Erreur de récupération des suggestions:", err));
}

function displaySuggestions(suggestions) {
  suggestionsBox.innerHTML = "";
  suggestionsBox.style.display = "block";
  if (suggestions.length > 0) {
    suggestions.forEach(serie => {
      const div = createSuggestionItem(serie);
      suggestionsBox.appendChild(div);
    });
  } else {
    const div = createSuggestionItem(null);
    div.textContent = "Aucune série trouvée";
    suggestionsBox.appendChild(div);
  }
}

function createSuggestionItem(serie) {
  const div = document.createElement("div");
  div.className = "suggestion-item";
  if (serie) {
    div.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w200${serie.poster_path}" alt="${serie.name}">
      <span>${serie.name}</span>
    `;
    div.addEventListener("click", () => {
      searchInput.value = serie.name;
      hideSuggestions();
      window.location.href = `../views/seriesdetails.html?id=${serie.id}`;
    });
  } else {
    div.textContent = "Aucune série trouvée";
  }
  return div;
}

function hideSuggestions() {
  suggestionsBox.style.display = "none";
}

initSearch();
loadSeries(1); 


for (let i = 2; i <= 5; i++) {
  loadSeries(i);
}
