const fsViewer = document.getElementById('fsViewer');
const fsImg = document.getElementById('fsImg');
const lockBtn = document.getElementById('lockBtn');
const unlockBtn = document.getElementById('unlockBtn');
const fsCloseBtn = document.getElementById('fsCloseBtn');

let wakeLock = null;

// Allow opening fullscreen from modal image
document.getElementById('viewImg').style.cursor = 'pointer';
document.getElementById('viewImg').onclick = () => {
    fsImg.src = document.getElementById('viewImg').src;
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

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fsViewer.classList.contains('active')) {
        closeFullscreenViewer();
    }
});
