const API_URL = 'https://oparchive.com/data/characters.json';
const BASE_IMG_URL = 'https://oparchive.com';

const grid = document.getElementById('grid');
const loading = document.getElementById('loading');
const viewer = document.getElementById('viewer');
const closeBtn = document.getElementById('closeBtn');
const viewImg = document.getElementById('viewImg');

const fsViewer = document.getElementById('fsViewer');
const fsImg = document.getElementById('fsImg');
const lockBtn = document.getElementById('lockBtn');
const unlockBtn = document.getElementById('unlockBtn');
const fsCloseBtn = document.getElementById('fsCloseBtn');

let charactersData = [];
let wakeLock = null;

// Fetch data
async function fetchCharacters() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        charactersData = data.slice(0, 100);
        renderGrid();
    } catch (error) {
        console.error('Error fetching data:', error);
        loading.innerHTML = '<p style="color:#ef4444">Failed to load characters.</p>';
    }
}

// Render grid
function renderGrid() {
    loading.style.display = 'none';
    grid.innerHTML = '';
    
    charactersData.forEach((char, index) => {
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
        grid.appendChild(div);
    });
}

function formatBounty(bounty) {
    if (!bounty) return 'Unknown';
    if (typeof bounty === 'string') return bounty;
    return new Intl.NumberFormat('en-US').format(bounty) + ' Berries';
}

function formatHaki(haki) {
    if (!haki || !haki.length) return 'No Haki or Unknown';
    return haki.join(', ');
}

// Open modal
function openViewer(char) {
    document.getElementById('viewImg').src = char.image ? `${BASE_IMG_URL}${char.image}` : 'https://via.placeholder.com/400x500?text=No+Image';
    document.getElementById('charName').textContent = char.name || 'Unknown';
    
    const statusEl = document.getElementById('charStatus');
    const status = char.status || 'Unknown';
    statusEl.textContent = status;
    statusEl.className = 'tag';
    if (status.toLowerCase() === 'alive') statusEl.classList.add('status-alive');
    else if (status.toLowerCase() === 'deceased') statusEl.classList.add('status-deceased');
    else statusEl.classList.add('status-unknown');
    
    document.getElementById('charBounty').textContent = formatBounty(char.bounty);
    document.getElementById('charHaki').textContent = formatHaki(char.haki);
    document.getElementById('charAffiliation').textContent = char.affiliation || 'None';
    document.getElementById('charOrigin').textContent = char.origin || 'Unknown';
    document.getElementById('charRace').textContent = char.race || 'Unknown';
    document.getElementById('charAppearance').textContent = char.first_appearance_arc || 'Unknown';
    document.getElementById('charDesc').textContent = char.description || 'No description available.';

    viewer.classList.add('active');
    document.body.classList.add('no-scroll');
}

// Close modal
function closeViewer() {
    viewer.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

closeBtn.onclick = closeViewer;

viewImg.style.cursor = 'pointer';
viewImg.onclick = () => {
    fsImg.src = viewImg.src;
    fsViewer.classList.add('active');
};

function prevent(e) { e.preventDefault(); }

async function enableLock() {
    try {
        if (fsViewer.requestFullscreen) await fsViewer.requestFullscreen();
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
        }
        fsViewer.classList.add('locked');
        fsViewer.addEventListener('touchmove', prevent, { passive: false });
        fsImg.addEventListener('touchmove', prevent, { passive: false });
        if (navigator.vibrate) navigator.vibrate(100);
    } catch (e) { alert("Gagal lock: " + e.message) }
}

async function releaseLock() {
    try {
        if (wakeLock) { await wakeLock.release(); wakeLock = null; }
        if (document.fullscreenElement) await document.exitFullscreen();
    } catch { }
    fsViewer.classList.remove('locked');
    fsViewer.removeEventListener('touchmove', prevent);
    fsImg.removeEventListener('touchmove', prevent);
}

function closeFullscreenViewer() {
    releaseLock();
    fsViewer.classList.remove('active');
}

lockBtn.onclick = enableLock;
unlockBtn.onclick = releaseLock;
fsCloseBtn.onclick = closeFullscreenViewer;

document.addEventListener('visibilitychange', async () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
        try { wakeLock = await navigator.wakeLock.request('screen'); } catch { }
    }
});

viewer.addEventListener('click', (e) => {
    if (e.target === viewer) {
        closeViewer();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (fsViewer.classList.contains('active')) {
            closeFullscreenViewer();
        } else if (viewer.classList.contains('active')) {
            closeViewer();
        }
    }
});

// Init
fetchCharacters();
