document.addEventListener("DOMContentLoaded", function () {

    function fetchMovieDetails() {
        const movieId = new URLSearchParams(window.location.search).get('id');
        console.log("ID du film:", movieId);

        const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=8c4b867188ee47a1d4e40854b27391ec&language=fr-FR`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayMovieDetails(data);
                fetchMovieReviews(data.id); // Ajout commentaires API + locaux
                console.log(data);
            })
            .catch(error => {
                console.log("Erreur lors de la récupération des détails du film :", error);
            });
    }

    function displayMovieDetails(movie) {
        const movieTitle = document.getElementById('title');
        const moviePoster = document.getElementById('poster');
        const movieDescription = document.getElementById('description');
        const movieCategory = document.getElementById('category');
        const movieDate = document.getElementById('release-date');

        if (movie) {
            movieTitle.textContent = movie.title;
            moviePoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            movieDescription.textContent = movie.overview;
            movieCategory.textContent = movie.genres.map(genre => genre.name).join(', ');
            movieDate.textContent = movie.release_date;
        } else {
            console.error("Le film n'a pas pu être trouvé.");
        }
    }

    function fetchMovieReviews(movieId) {
        const reviewsUrl = `https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=8c4b867188ee47a1d4e40854b27391ec&language=fr-FR`;
    
        fetch(reviewsUrl)
            .then(response => response.json())
            .then(data => {
                const apiReviews = data.results || [];
                const localReviews = JSON.parse(localStorage.getItem(`comments_${movieId}`)) || [];
    
                displayAllReviews([...apiReviews, ...localReviews]); // fusion API + local
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des commentaires :", error);
            });
    }
    
    function displayAllReviews(reviews) {
        const commentsList = document.getElementById('comments-list');
        commentsList.innerHTML = '';
    
        if (reviews.length === 0) {
            commentsList.innerHTML = '<p>Aucun commentaire disponible pour ce film.</p>';
            return;
        }
    
        reviews.forEach(review => {
            const comment = document.createElement('div');
            comment.classList.add('comment');
    
            comment.innerHTML = `
                <h4>${review.author || "Utilisateur"}</h4>
                <p>${review.content}</p>
            `;
    
            commentsList.appendChild(comment);
        });
    }
    

    function displayLocalComments(comments) {
        const commentsList = document.getElementById('comments-list');

        comments.forEach(comment => {
            const div = document.createElement('div');
            div.classList.add('comment');

            div.innerHTML = `
                <h4>${comment.author}</h4>
                <p>${comment.content}</p>
            `;

            commentsList.appendChild(div);
        });
    }

    document.getElementById('comment-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const movieId = new URLSearchParams(window.location.search).get('id');
        const commentInput = document.getElementById('comment-input');
        const commentText = commentInput.value.trim();

        if (commentText === '') return;

        const localComments = JSON.parse(localStorage.getItem(`comments_${movieId}`)) || [];

        localComments.push({
            author: 'Utilisateur',
            content: commentText
        });

        localStorage.setItem(`comments_${movieId}`, JSON.stringify(localComments));

        displayLocalComments([{
            author: 'Utilisateur',
            content: commentText
        }]);

        commentInput.value = '';
    });

    fetchMovieDetails();
});
