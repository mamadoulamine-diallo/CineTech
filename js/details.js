const apiKey = '8c4b867188ee47a1d4e40854b27391ec';
const serieId = new URLSearchParams(window.location.search).get('id');
const container = document.getElementById('serie-details');

async function fetchSerieDetails() {
  try {
    // Récupération des détails, casting et suggestions
    const [detailsRes, creditsRes, recRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/tv/${serieId}?api_key=${apiKey}&language=fr-FR`),
      fetch(`https://api.themoviedb.org/3/tv/${serieId}/credits?api_key=${apiKey}&language=fr-FR`),
      fetch(`https://api.themoviedb.org/3/tv/${serieId}/recommendations?api_key=${apiKey}&language=fr-FR&page=1`)
    ]);

    const details = await detailsRes.json();
    const credits = await creditsRes.json();
    const recommendations = await recRes.json();

    // Sélection des 5 premiers acteurs et 5 premières suggestions
    const topActors = credits.cast.slice(0, 5);
    const topSeries = recommendations.results.slice(0, 5);

    // Construction du HTML
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
          </div>
        </div>

        <hr>

        <!-- Acteurs principaux -->
        <div class="actors-section">
          <h3>Acteurs principaux :</h3>
          <div class="actors-list">
            ${topActors.map(actor => `
              <div class="actor-card">
                <img src="https://image.tmdb.org/t/p/w200${actor.profile_path}" alt="${actor.name}" class="actor-photo">
                <p><strong>${actor.name}</strong> (${actor.character})</p>
              </div>
            `).join('')}
          </div>
        </div>

        <hr>

        <!-- Suggestions de séries similaires -->
        <div class="suggestions-section">
          <h3>Suggestions de séries similaires :</h3>
          <div class="suggestions-list">
            ${topSeries.map(s => `
              <div class="suggestion-card">
                <a href="serie.html?id=${s.id}">
                  <img src="https://image.tmdb.org/t/p/w200${s.poster_path}" alt="${s.name}" class="suggestion-poster">
                  <p>${s.name}</p>
                </a>
              </div>
            `).join('')}
          </div>
        </div>

        <hr>

        <!-- Formulaire de commentaires -->
        <div class="bottom-section">
          <div class="comment-form">
            <label>Entrez votre prénom :</label>
            <input type="text" id="prenom" placeholder="Prénom">
            <textarea id="commentaire" placeholder="Rédigez votre commentaire ..."></textarea>
            <button class="send-btn" id="sendComment">Envoyer</button>
          </div>

          <div class="comments-section">
            <h3>Commentaires :</h3>
            <div id="commentsContainer"></div>
          </div>
        </div>
      </div>
    `;

    // Initialisation commentaires
    loadCommentsFromLocalStorage();
    setupCommentHandler();

  } catch (error) {
    container.innerHTML = '<p>Erreur de chargement des données.</p>';
    console.error(error);
  }
}

function setupCommentHandler() {
  const sendButton = document.getElementById('sendComment');
  sendButton.addEventListener('click', () => {
    const prenom = document.getElementById('prenom').value.trim();
    const commentaire = document.getElementById('commentaire').value.trim();

    if (prenom && commentaire) {
      const comment = { prenom, commentaire, replies: [] };
      saveCommentToLocalStorage(comment);
      addCommentToDOM(comment);
      document.getElementById('prenom').value = '';
      document.getElementById('commentaire').value = '';
    } else {
      alert('Veuillez remplir les deux champs avant d\'envoyer votre commentaire.');
    }
  });
}

// Fonctions de gestion des commentaires (inchangées)
function saveCommentToLocalStorage(comment) {
  const comments = JSON.parse(localStorage.getItem(`comments_${serieId}`)) || [];
  comments.push(comment);
  localStorage.setItem(`comments_${serieId}`, JSON.stringify(comments));
}

function loadCommentsFromLocalStorage() {
  const comments = JSON.parse(localStorage.getItem(`comments_${serieId}`)) || [];
  comments.forEach(addCommentToDOM);
}

function addCommentToDOM(comment) {
  const commentsContainer = document.getElementById('commentsContainer');
  const commentBubble = document.createElement('div');
  commentBubble.classList.add('comment-bubble');
  commentBubble.innerHTML = `
    <strong>${comment.prenom}:</strong> ${comment.commentaire}
    <div class="replies"></div>
    <a href="#" class="reply-link">Répondre</a>
    <div class="reply-form" style="display: none;"></div>
  `;

  comment.replies.forEach(reply => addReplyToDOM(reply, commentBubble.querySelector('.replies')));
  commentsContainer.appendChild(commentBubble);
}

function addReplyToDOM(reply, container) {
  const replyBubble = document.createElement('div');
  replyBubble.classList.add('reply-bubble');
  replyBubble.innerHTML = `<strong>${reply.prenom}:</strong> ${reply.commentaire}`;
  container.appendChild(replyBubble);
}

fetchSerieDetails();
