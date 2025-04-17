const additionalSeriesContainer = document.getElementById('serie-card');
const apiKey = '8c4b867188ee47a1d4e40854b27391ec';
const language = 'fr-FR';
const itemsPerPage = 12;
const totalPaginationPages = 20;
const totalItemsNeeded = totalPaginationPages * itemsPerPage;
const itemsPerApiPage = 20;
const apiPagesToFetch = Math.ceil(totalItemsNeeded / itemsPerApiPage);
let currentPage = 1;
let allAdditionalSeries = [];


fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=${language}&page=1`)
  .then(res => res.json())
  .then(data => {
  
  })
 

Promise.all(
  Array.from({ length: apiPagesToFetch }, (_, i) =>
    fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=${language}&page=${i + 1}`)
      .then(res => res.json())
  )
).then(results => {
  let series = [];
  results.forEach(data => series = series.concat(data.results));
  allAdditionalSeries = series.slice(0, totalItemsNeeded);
  initPagination();
}).catch(err => console.error("Erreur lors du chargement des séries supplémentaires:", err));

function initPagination() {
  displayAdditionalSeries(getCurrentPageData());
  updatePaginationControls();
}

function getCurrentPageData() {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return allAdditionalSeries.slice(start, end);
}

function updatePaginationControls() {
  document.getElementById("page-number").textContent = `Page ${currentPage}`;
  document.getElementById("prev").disabled = currentPage === 1;
  document.getElementById("next").disabled = currentPage === totalPaginationPages;
}

document.getElementById("prev").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayAdditionalSeries(getCurrentPageData());
    updatePaginationControls();
  }
});
document.getElementById("next").addEventListener("click", () => {
  if (currentPage < totalPaginationPages) {
    currentPage++;
    displayAdditionalSeries(getCurrentPageData());
    updatePaginationControls();
  }
});

function displayAdditionalSeries(data) {
  additionalSeriesContainer.innerHTML = '';
  data.forEach(serie => {
    const card = createSerieCard(serie);
    additionalSeriesContainer.appendChild(card);
  });
}

function createSerieCard(serie) {
  const card = document.createElement('div');
  card.className = 'card-wrapper';

  const link = document.createElement('a');
  link.href = `../views/seriesdetail.html?id=${serie.id}`;
  link.className = 'serie-link';
  link.style.display = "block";

  link.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w300${serie.poster_path}" alt="${serie.name}" class="serie-image">
    <div class="bottom">
      <strong class="title">${serie.name}</strong>
      <span class="rating">${serie.vote_average}</span>
      <button class="favorite-btn" aria-label="Ajouter aux favoris" data-id="${serie.id}">
        <span class="plus-icon" title="Ajouter aux favoris">+</span>
      </button>
    </div>
  `;
  
  card.appendChild(link);

  const favoriteButton = card.querySelector('.favorite-btn');
  favoriteButton.addEventListener('click', (event) => {
    event.stopPropagation();
    console.log("Ajout aux favoris:", serie.id);
  });

  return card;
}

// Recherche et suggestions
const searchInput = document.getElementById('searchInput');
let searchTimeout;

searchInput.addEventListener('input', () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(handleSearchInput, 500);
});

function handleSearchInput() {
  const query = searchInput.value.trim();
  if (query === "") {
    hideSuggestions();
  } else {
    fetchSuggestions(query);
  }
}

function fetchSuggestions(query) {
  const url = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&language=${language}&query=${encodeURIComponent(query)}`;
  
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const suggestions = data.results;
      displaySuggestions(suggestions);
    })
    .catch(err => console.error("Erreur de récupération des suggestions:", err));
}

function displaySuggestions(suggestions) {
  const suggestionsBox = document.getElementById('suggestions');
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
      if (serie.id) {
        window.location.href = `../views/seriesdetail.html?id=${serie.id}`;
      }
    });
  } else {
    div.textContent = "Aucune série trouvée";
  }

  return div;
}

function hideSuggestions() {
  const suggestionsBox = document.getElementById('suggestions');
  suggestionsBox.style.display = "none";
}
