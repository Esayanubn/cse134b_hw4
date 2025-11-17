
const THEME_KEY = 'theme-preference';
const THEME_DARK = 'dark';
const THEME_LIGHT = 'light';

// Get saved theme or default to light
function getTheme() {
    try {
        return localStorage.getItem(THEME_KEY) || THEME_LIGHT;
    } catch (e) {
        return THEME_LIGHT;
    }
}

// Save theme preference
function saveTheme(theme) {
    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
        console.warn('Failed to save theme preference:', e);
    }
}

// Apply theme to document
function applyTheme(theme) {
    if (theme === THEME_DARK) {
        document.documentElement.setAttribute('data-theme', THEME_DARK);
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

// Initialize theme on page load
function initTheme() {
    const theme = getTheme();
    applyTheme(theme);
    updateToggleButton(theme);
}

function updateToggleButton(theme) {
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.textContent = theme === THEME_DARK ? '☀️ Light' : '🌙 Dark';
        toggleBtn.setAttribute('aria-label', 
            theme === THEME_DARK ? 'Switch to light mode' : 'Switch to dark mode');
    }
}

// Toggle theme
function toggleTheme() {
    const currentTheme = getTheme();
    const newTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    applyTheme(newTheme);
    saveTheme(newTheme);
    updateToggleButton(newTheme);
}

// Show toggle button (JS is enabled)
function showToggleButton() {
    const container = document.querySelector('.theme-toggle-container');
    if (container) {
        container.classList.add('js-enabled');
    }
}

// Set up toggle button event listener
function setupToggleButton() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleTheme);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initTheme();
        showToggleButton();
        setupToggleButton();
    });
} else {
    initTheme();
    showToggleButton();
    setupToggleButton();
}
