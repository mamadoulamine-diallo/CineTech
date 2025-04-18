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
                searchBar(data.results);
                console.log(data.results);
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

            const movieCard = movieElement.querySelector('.movie-card');
            movieCard.addEventListener('click', function () {
                redirectToDetail(movie.id);
            });

            const favButton = movieElement.querySelector('.favorites');
            favButton.addEventListener('click', function () {
                addToFavorites(movie);
            });
        });
    }

    function redirectToDetail(movieId) {
        window.location.href = `details-movie.html?id=${movieId}`;
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


    function searchBar(movies) {
        const searchInput = document.querySelector('.search-input');
        const suggestionsContainer = document.querySelector('.suggestions');
    
        searchInput.addEventListener('keyup', function () {
            const movie = searchInput.value.trim();
    
            const resultat = movies.filter(item =>
                item.title.toLowerCase().includes(movie.toLowerCase())
            );
    
            let suggestionsHTML = '';
    
            if (movie.length > 0) {
                resultat.slice(0, 3).forEach(resultatItem => {
                    suggestionsHTML += `
                        <div class="suggestion-item" data-id="${resultatItem.title}">
                            <img src="https://image.tmdb.org/t/p/w500${resultatItem.poster_path}" alt="${resultatItem.title}" />
                            <h2>${resultatItem.title}</h2>
                        </div>
                        <hr/>
                    `;
                });
    
                suggestionsContainer.innerHTML = suggestionsHTML;
            } else {
                suggestionsContainer.innerHTML = '';
                console.log('Aucun résultat trouvé');
            }
        });
    
        suggestionsContainer.addEventListener('click', function (event) {
            const target = event.target.closest('.suggestion-item');
    
            if (target) {
                const selectedMovieTitle = target.getAttribute('data-id');
                searchInput.value = selectedMovieTitle;
                suggestionsContainer.innerHTML = '';
    
                const selectedMovieData = movies.find(item => item.title === selectedMovieTitle);
    
                if (selectedMovieData) {
                    moviesContainer.innerHTML = '';
    
                    const movieElement = document.createElement('div');
                    movieElement.classList.add('movie');
    
                    movieElement.innerHTML = `
                        <div class="movie-card">
                            <img src="https://image.tmdb.org/t/p/w500${selectedMovieData.poster_path}" alt="${selectedMovieData.title}" />
                            <div class="movie-footer">
                                <h2>${selectedMovieData.title}</h2>
                                <span class="movie-rating">${selectedMovieData.vote_average}</span>
                                <p class="favorites">+</p>
                            </div>
                        </div>
                    `;
    
                    moviesContainer.appendChild(movieElement);
    
                    const favButton = movieElement.querySelector('.favorites');
                    favButton.addEventListener('click', function () {
                        addToFavorites(selectedMovieData);
                    });
                }
            }
        });
    }     


    fetchMovies(currentPage);
});
