document.addEventListener("DOMContentLoaded", function () {

    const url = 'https://api.themoviedb.org/3/movie/popular?api_key=8c4b867188ee47a1d4e40854b27391ec&language=fr-FR&page=1';

    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })


    function displayMovies(){
        
    }

});