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
                //console.log(data);
                displayMovies(data);
                pageNumberDisplay.textContent = `Page ${data.page}`;
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des films :", error);
            });
    }

    function displayMovies(movies) {
        moviesContainer.innerHTML = '';
    
        movies.results.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie');
    
            movieElement.innerHTML = `
                <div class="movie-card">
                    <div class="movie-footer">
                        <h2>${movie.title}</h2>
                        <span class="movie-rating">${movie.vote_average}</span>
                    </div>
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
                </div>
            `;
    
            moviesContainer.appendChild(movieElement);
        });
    }


    prevButton.addEventListener("click", function () {
        if(currentPage > 1){
            currentPage--;
            fetchMovies(currentPage);
        }
        //console.log("button PREV cliqué");
    });


    nextButton.addEventListener("click", function() {
        //console.log("button clické");
        currentPage++;
        fetchMovies(currentPage);
        data.page = currentPage;
    });

    fetchMovies(currentPage);

});
