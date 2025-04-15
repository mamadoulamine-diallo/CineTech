const apiKey = '8c4b867188ee47a1d4e40854b27391ec';
const serieId = new URLSearchParams(window.location.search).get('id');
const container = document.getElementById('serie-details');

async function fetchSerieDetails() {
  try {
    const [detailsRes, creditsRes, videoRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/tv/${serieId}?api_key=${apiKey}&language=fr-FR`),
      fetch(`https://api.themoviedb.org/3/tv/${serieId}/credits?api_key=${apiKey}&language=fr-FR`),
      fetch(`https://api.themoviedb.org/3/tv/${serieId}/videos?api_key=${apiKey}&language=fr-FR`)
    ]);

    const details = await detailsRes.json();
    const credits = await creditsRes.json();
   



    container.innerHTML = `
      <div class="serie-header">
        <div class="poster">
          <img src="https://image.tmdb.org/t/p/w500${details.poster_path}" alt="${details.name}">
        </div>
        <div class="info">
          <h1>${details.name}</h1>
          <div class="meta">
            <strong>Genres:</strong> ${details.genres.map(g => g.name).join(', ')}<br>
            <strong>Date de première diffusion:</strong> ${details.first_air_date}
          </div>
          <button class="fav-btn" onclick="addToFavorites('${details.name}')"> Ajouter aux favoris</button>
        </div>
      </div>

      <div class="overview">
        <h2>Résumé</h2>
        <p>${details.overview}</p>
      </div>

      <div class="actors">
        <h2>Acteurs principaux</h2>
        <ul>
          ${credits.cast.slice(0, 6).map(actor => `<li>${actor.name}</li>`).join('')}
        </ul>
      </div>

    
    `;
  } catch (error) {
    container.innerHTML = '<p>Erreur de chargement des données.</p>';
    console.error(error);
  }
}



fetchSerieDetails();