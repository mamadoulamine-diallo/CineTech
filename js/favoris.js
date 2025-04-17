function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
  }

  function createSerieCard(serie) {
    const card = document.createElement('div');
    card.className = 'card-wrapper';
    card.style.cursor = 'pointer';

    card.addEventListener('click', () => {
      window.location.href = `../views/seriesdetail.html?id=${serie.id}`;
    });

    const img = document.createElement('img');
    img.src = `https://image.tmdb.org/t/p/w300${serie.poster_path}`;
    img.alt = serie.name;
    img.className = 'serie-image';
    card.appendChild(img);

    const bottom = document.createElement('div');
    bottom.className = 'bottom';
    bottom.innerHTML = `
      <strong class="title">${serie.name}</strong>
      <span class="rating">${serie.vote_average}</span>
      <button class="favorite-btn" aria-label="Retirer des favoris">
        <span class="plus-icon" title="Retirer des favoris">–</span>
      </button>
    `;
    card.appendChild(bottom);

    const favBtn = bottom.querySelector('.favorite-btn');
    favBtn.addEventListener('click', event => {
      event.stopPropagation();
      const favs = getFavorites();
      const updated = favs.filter(s => s.id !== serie.id);
      localStorage.setItem('favorites', JSON.stringify(updated));
      card.remove();
    });

    return card;
  }

  function displayFavorites() {
    const container = document.getElementById('serie-card');
    const favorites = getFavorites();
    container.innerHTML = '';
    if (favorites.length === 0) {
      container.innerHTML = '<p>Aucune série dans vos favoris.</p>';
      return;
    }
    favorites.forEach(serie => {
      container.appendChild(createSerieCard(serie));
    });
  }

  document.addEventListener('DOMContentLoaded', displayFavorites);