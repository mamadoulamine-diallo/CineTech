
const container = document.getElementById('series-container');
const additionalSeriesContainer = document.getElementById('additional-series-container');
const suggestionsBox = document.getElementById('suggestions');

let currentIndex = 0;     
let currentPage = 1;      
let allAdditionalSeries = [];

const apiKey = '8c4b867188ee47a1d4e40854b27391ec';
const language = 'fr-FR';
const itemsPerPage = 8;                
const totalPaginationPages = 20;      
const totalItemsNeeded = totalPaginationPages * itemsPerPage; 
const itemsPerApiPage = 20;           
const apiPagesToFetch = Math.ceil(totalItemsNeeded / itemsPerApiPage); 


fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=${language}&page=1`)
    .then(res => res.json())
    .then(data => {
       const carouselSeries = data.results.slice(0, 8);
       carouselSeries.forEach(serie => {
         const card = createSerieCard(serie);
         container.appendChild(card);
       });
    })
    .catch(err => console.error("Erreur lors du chargement du carrousel:", err));

Promise.all(
  Array.from({ length: apiPagesToFetch }, (_, i) =>
    fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=${language}&page=${i + 1}`)
      .then(res => res.json())
  )
).then(results => {
   let series = [];
   results.forEach(data => {
      series = series.concat(data.results);
   });

   allAdditionalSeries = series.slice(0, totalItemsNeeded);
   initPagination();
}).catch(err => console.error("Erreur lors du chargement des séries supplémentaires:", err));


function createSerieCard(serie) {
    const card = document.createElement('div');
    card.className = 'serie-card';
    card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w300${serie.poster_path}" alt="${serie.name}">
        <div class="bottom"><strong>${serie.name}</strong></div>
    `;
    
    card.addEventListener('click', () => {
      window.location.href = `../views/seriesdetail.html?id=${serie.id}`;
    });
    return card;
}


function initPagination() {
    $('#pagination-container').pagination({
        dataSource: allAdditionalSeries,
        pageSize: itemsPerPage,          
        showGoInput: true,
        showGoButton: true,
        formatGoInput: 'Page <%= input %>',
        callback: function(data, pagination) {
            currentPage = pagination.pageNumber;
            displayAdditionalSeries(data);
        }
    });
}


function displayAdditionalSeries(data) {
    additionalSeriesContainer.innerHTML = '';
    data.forEach(serie => {
       const card = createSerieCard(serie);
       additionalSeriesContainer.appendChild(card);
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
