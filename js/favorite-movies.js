document.addEventListener("DOMContentLoaded", function () {

    const moviesContainer = document.querySelector('.movies-container');
    let favoritesMovies = JSON.parse(localStorage.getItem('favorites-movies')) || [];

    console.log(favoritesMovies);


    function displayFavorites(movies){
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
                    <p class="delete-favorites" data-id="${movie.id}">x</p>
                </div>
            </div>
        `;  

        moviesContainer.appendChild(movieElement);
        const deleteButton = movieElement.querySelector('.delete-favorites');
        deleteButton.addEventListener('click', function(){
            removeFromFavorites(movie);
            event.stopPropagation();
        })

        });

    }

    function removeFromFavorites(movie) {
        const favorites = JSON.parse(localStorage.getItem('favorites-movies')) || [];

        const updatedFavorites = favorites.filter(fav => fav.id !== movie.id);
        localStorage.setItem('favorites-movies', JSON.stringify(updatedFavorites));
        alert(`Film supprimé des favoris : ${movie.title}`);

        displayFavorites(updatedFavorites);


    }

    displayFavorites(favoritesMovies);

});