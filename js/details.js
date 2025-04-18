const url = 'https://api.themoviedb.org/3/movie/popular?api_key=8c4b867188ee47a1d4e40854b27391ec&language=fr-FR&page=1';

    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })

const apiKey = '8c4b867188ee47a1d4e40854b27391ec';
const serieId = new URLSearchParams(window.location.search).get('id');
const container = document.getElementById('serie-details');

async function fetchSerieDetails() {
  try {
    const [detailsRes, creditsRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/tv/${serieId}?api_key=${apiKey}&language=fr-FR`),
      fetch(`https://api.themoviedb.org/3/tv/${serieId}/credits?api_key=${apiKey}&language=fr-FR`),
    ]);

    const details = await detailsRes.json();
   

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

    loadCommentsFromLocalStorage();

    const sendButton = document.getElementById('sendComment');
    const commentsContainer = document.getElementById('commentsContainer');

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
  } catch (error) {
    container.innerHTML = '<p>Erreur de chargement des données.</p>';
    console.error(error);
  }
}

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
    <div class="reply-form" style="display: none;">
   <!----   <textarea class="reply-input" placeholder="Répondre..."></textarea>------>
     <!----     <button class="reply-btn">Envoyer</button> ------>
    </div>
  `;

  const replyLink = commentBubble.querySelector('.reply-link');
  const replyForm = commentBubble.querySelector('.reply-form');
 /* const replyButton = commentBubble.querySelector('.reply-btn');
  const replyInput = commentBubble.querySelector('.reply-input');
  const repliesContainer = commentBubble.querySelector('.replies');*/

 /* replyLink.addEventListener('click', (e) => {
    e.preventDefault();
    replyForm.style.display = 'block';
    replyLink.style.display = 'none';
  });

  replyButton.addEventListener('click', () => {
    const replyText = replyInput.value.trim();
    if (replyText) {
      const reply = { prenom: 'Vous', commentaire: replyText };
      comment.replies.push(reply);
      saveRepliesToLocalStorage(comment);
      addReplyToDOM(reply, repliesContainer);
      replyInput.value = '';
      replyForm.style.display = 'none';
      replyLink.style.display = 'inline';
    } else {
      alert('Veuillez entrer une réponse.');
    }
  });*/

  comment.replies.forEach(reply => addReplyToDOM(reply, repliesContainer));
  commentsContainer.appendChild(commentBubble);
}

/*function addReplyToDOM(reply, container) {
  const replyBubble = document.createElement('div');
  replyBubble.classList.add('reply-bubble');
  replyBubble.innerHTML = `<strong>${reply.prenom}:</strong> ${reply.commentaire}`;
  container.appendChild(replyBubble);
}

function saveRepliesToLocalStorage(updatedComment) {
  const comments = JSON.parse(localStorage.getItem(`comments_${serieId}`)) || [];
  const index = comments.findIndex(c => c.commentaire === updatedComment.commentaire && c.prenom === updatedComment.prenom);
  if (index !== -1) {
    comments[index] = updatedComment;
    localStorage.setItem(`comments_${serieId}`, JSON.stringify(comments));
  }
}*/
 
fetchSerieDetails(); 

