document.addEventListener("DOMContentLoaded", function () {

    function fetchMovieDetails() {
        const movieId = new URLSearchParams(window.location.search).get('id');
        console.log("ID du film:", movieId);

        const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=8c4b867188ee47a1d4e40854b27391ec&language=fr-FR`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayMovieDetails(data);
                console.log(data);
            })
            .catch(error => {
                console.log("Erreur lors de la récupération des détails du film :", error);
            });
    }

    function displayMovieDetails(movie) {
        const movieTitle = document.getElementById('title');
        const moviePoster = document.getElementById('poster');
        //const movieDescription = document.getElementById('description');
        //const movieCategory = document.getElementById('category');


        if (movie) {
            movieTitle.textContent = movie.title;
            moviePoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        } else {
            console.error("Le film n'a pas pu être trouvé.");
        }
    }
    
    fetchMovieDetails();


});
