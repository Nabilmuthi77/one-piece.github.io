let currentPage = 1;
const itemsPerPage = 30;
let filteredCharacters = [];

const gridContainer = document.getElementById('grid');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');
const loadingIndicator = document.getElementById('loading');

function initGallery(data) {
    filteredCharacters = data;
    renderPage(1);
}

function renderPage(page) {
    currentPage = page;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredCharacters.slice(startIndex, endIndex);

    gridContainer.innerHTML = '';
    
    pageData.forEach((char) => {
        const div = document.createElement('div');
        div.className = 'card';
        
        const imgSrc = char.image ? `${BASE_IMG_URL}${char.image}` : 'https://via.placeholder.com/400x500?text=No+Image';
        
        div.innerHTML = `
            <img src="${imgSrc}" loading="lazy" alt="${char.name}">
            <div class="card-overlay">
                <div class="card-name">${char.name}</div>
            </div>
        `;
        
        div.onclick = () => openViewer(char);
        gridContainer.appendChild(div);
    });

    updatePagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updatePagination() {
    const totalPages = Math.ceil(filteredCharacters.length / itemsPerPage);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

prevBtn.onclick = () => {
    if (currentPage > 1) {
        renderPage(currentPage - 1);
    }
};

nextBtn.onclick = () => {
    const totalPages = Math.ceil(filteredCharacters.length / itemsPerPage);
    if (currentPage < totalPages) {
        renderPage(currentPage + 1);
    }
};

async function loadApp() {
    const data = await fetchCharactersData();
    loadingIndicator.style.display = 'none';
    
    if (data) {
        document.getElementById('pagination-container').style.display = 'flex';
        initGallery(data);
    } else {
        gridContainer.innerHTML = '<p style="color:#ef4444">Failed to load characters.</p>';
    }
}

// Start app
loadApp();
