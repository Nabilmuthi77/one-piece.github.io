const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    if (!query) {
        initGallery(allCharacters);
        return;
    }

    const filtered = allCharacters.filter(char => {
        return char.name && char.name.toLowerCase().includes(query);
    });
    
    initGallery(filtered);
});
