document.addEventListener("DOMContentLoaded", function () {
    const searchIcon = document.querySelector('.search-icon');
    const searchBar = document.querySelector('.search-bar');

    function displaySearchBar() {
        searchIcon.addEventListener('click', function() {
            searchBar.classList.toggle('active');
            if (searchBar.classList.contains('active')) {
                searchBar.focus();
            }
        });
    }

    displaySearchBar();
});
