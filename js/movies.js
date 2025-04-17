document.addEventListener("DOMContentLoaded", function () {
    let currentPage = 1;

    const moviesContainer = document.querySelector('.movies-container');
    const pageNumberDisplay = document.getElementById('page-number');
    const prevButton = document.querySelector('#prev');
    const nextButton = document.querySelector('#next');

    function fetchMovies(page) {
        const url = `https://api.themoviedb.org/3/movie/popular?api_key=8c4b867188ee47a1d4e40854b27391ec&language=fr-FR&page=${page}`;
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayMovies(data.results);
                pageNumberDisplay.textContent = `Page ${data.page}`;
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des films :", error);
            });
    }

    function displayMovies(movies) {
        moviesContainer.innerHTML = '';

        movies.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie');

            movieElement.innerHTML = `
                <div class="movie-card">
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
                    <div class="movie-footer">
                        <h2>${movie.title}</h2>
                        <span class="movie-rating">${movie.vote_average}</span>
                        <p class="favorites">+</p>
                    </div>
                </div>
            `;

            moviesContainer.appendChild(movieElement);

            const favButton = movieElement.querySelector('.favorites');
            favButton.addEventListener('click', function () {
                addToFavorites(movie);
            });
        });
    }

    function addToFavorites(movie) {
        const favorites = JSON.parse(localStorage.getItem('favorites-movies')) || [];

        const alreadyFavorited = favorites.some(fav => fav.id === movie.id);
        
        if (!alreadyFavorited) {
            favorites.push(movie);
            localStorage.setItem('favorites-movies', JSON.stringify(favorites));
            alert(`Film ajouté aux favoris : ${movie.title}`);
        } else {
            alert(`"${movie.title}" est déjà dans vos favoris.`);
        }
    }

    prevButton.addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage--;
            fetchMovies(currentPage);
        }
    });

    nextButton.addEventListener("click", function () {
        currentPage++;
        fetchMovies(currentPage);
    });

    fetchMovies(currentPage);
});
