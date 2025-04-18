document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('#searchInput');
    const suggestionsContainer = document.querySelector('#suggestions');
    const searchIcon = document.querySelector('.search-icon');
    const searchBarContainer = document.querySelector('.search-bar-container');
  
    if (!searchIcon || !searchBarContainer) {
      console.error('Élément .search-icon ou .search-bar-container introuvable');
      return;
    }
  
    searchIcon.addEventListener('click', () => {
      console.log('Icône de recherche cliquée');
      if (searchBarContainer.classList.contains('hidden')) {
        searchBarContainer.classList.remove('hidden');
        searchBarContainer.classList.add('visible');
      } else {
        searchBarContainer.classList.remove('visible');
        searchBarContainer.classList.add('hidden');
      }
    });

    searchInput.addEventListener('input', async (e) => {
      const query = e.target.value.trim();
  
      if (query.length > 2) {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&language=fr-FR&query=${query}`
        );
        const data = await response.json();
  
        if (data.results && data.results.length > 0) {
          displaySuggestions(data.results);
        } else {
          suggestionsContainer.innerHTML = '<p style="color: white; padding: 10px;">Aucune série trouvée.</p>';
          suggestionsContainer.style.display = 'block';
        }
      } else {
        suggestionsContainer.style.display = 'none';
      }
    });
  
    function displaySuggestions(series) {
      suggestionsContainer.innerHTML = '';
      series.forEach((serie) => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w92${serie.poster_path}" alt="${serie.name}" />
          <span>${serie.name}</span>
        `;
        suggestionItem.addEventListener('click', () => {
          window.location.href = `details.html?id=${serie.id}`;
        });
        suggestionsContainer.appendChild(suggestionItem);
      });
      suggestionsContainer.style.display = 'block';
    }
  });