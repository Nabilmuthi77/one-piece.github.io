const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check local storage for theme preference
const savedTheme = localStorage.getItem('op-theme');
if (savedTheme === 'light') {
    body.classList.add('light-theme');
    themeToggle.textContent = '🌙 Dark Mode';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    
    if (isLight) {
        themeToggle.textContent = '🌙 Dark Mode';
        localStorage.setItem('op-theme', 'light');
    } else {
        themeToggle.textContent = '☀️ Light Mode';
        localStorage.setItem('op-theme', 'dark');
    }
});
