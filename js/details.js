const apiKey = '8c4b867188ee47a1d4e40854b27391ec';
const serieId = new URLSearchParams(window.location.search).get('id');
const container = document.getElementById('serie-details');

async function fetchSerieDetails() {
  try {
    const [detailsRes, creditsRes, videoRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/tv/${serieId}?api_key=${apiKey}&language=fr-FR`),
      fetch(`https://api.themoviedb.org/3/tv/${serieId}/credits?api_key=${apiKey}&language=fr-FR`),
    
    ]);

    const details = await detailsRes.json();
    const credits = await creditsRes.json();
   



    container.innerHTML = `
    <div class="serie-details-container">
      <div class="top-section">
        <div class="left">
          <img src="https://image.tmdb.org/t/p/w500${details.poster_path}" alt="${details.name}" class="serie-poster">
        </div>
        <div class="right">
          <p><strong>Titre :</strong> ${details.name}</p>
        <p><strong>Description :</strong> <span class="light-italic">${details.overview}</span></p>
<p><strong>Catégorie :</strong> <span class="light-italic">${details.genres.map(g => g.name).join(', ')}</span></p>

          <button class="fav-btn" onclick="addToFavorites('${}')">Favoris</button>
        </div>
      </div>
  
      <hr>
  
      <div class="bottom-section">
        <div class="comment-form">
          <label>Entrez votre prénom :</label>
          <input type="text" placeholder="Prénom">
          <textarea placeholder="Rédigez votre commentaire ..."></textarea>
          <button class="send-btn">Envoyer</button>
        </div>
  
        <div class="comments-section">
          <h3>Commentaires</h3>
          <div class="comment-bubble"><strong>Prénom:</strong> Commentaire</div>
          <div class="comment-bubble"><strong>Prénom:</strong> Commentaire</div>
          <div class="comment-bubble"><strong>Prénom:</strong> Commentaire</div>
        </div>
      </div>
    </div>
  `;
  
  } catch (error) {
    container.innerHTML = '<p>Erreur de chargement des données.</p>';
    console.error(error);
  }
}



fetchSerieDetails();