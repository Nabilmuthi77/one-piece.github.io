const viewer = document.getElementById('viewer');
const closeBtn = document.getElementById('closeBtn');
const viewImg = document.getElementById('viewImg');

function formatBounty(bounty) {
    if (!bounty) return 'Unknown';
    if (typeof bounty === 'string') return bounty;
    return new Intl.NumberFormat('en-US').format(bounty) + ' Berries';
}

function formatHaki(haki) {
    if (!haki || !haki.length) return 'No Haki or Unknown';
    return haki.join(', ');
}

function openViewer(char) {
    viewImg.src = char.image ? `${BASE_IMG_URL}${char.image}` : 'https://via.placeholder.com/400x500?text=No+Image';
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

function closeViewer() {
    viewer.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

closeBtn.onclick = closeViewer;

viewer.addEventListener('click', (e) => {
    if (e.target === viewer) {
        closeViewer();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const fsViewer = document.getElementById('fsViewer');
        if (fsViewer && fsViewer.classList.contains('active')) {
            // let fullscreen logic handle it
        } else if (viewer.classList.contains('active')) {
            closeViewer();
        }
    }
});
