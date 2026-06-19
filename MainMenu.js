"use strict";

const htmlheader = document.querySelector('#HtmlHeader');
const cssheader = document.querySelector('#CssHeader');
const jsheader = document.querySelector('#JsHeader');
const usernameInput = document.getElementById('UsernameInput');
usernameInput.value = localStorage.getItem('username') || '';
// Save on every keystroke
usernameInput.addEventListener('input', () => {
    localStorage.setItem('username', usernameInput.value.trim());
});

htmlheader.addEventListener('click', () => {
    window.location.href = 'HtmlMenu.html';
});
cssheader.addEventListener('click', () => {
    window.location.href = 'CssMenu.html';
}); 
jsheader.addEventListener('click', () => {
    window.location.href = 'JsMenu.html';
});
const playbutton = document.querySelector('#PlayButton');
playbutton.addEventListener('click', () => {
    window.location.href = 'GameMenu.html';
});

const unlockedLevel = parseInt(localStorage.getItem('unlockedLevel')) || 1; 
// const unlockedLevel = localStorage.setItem('unlockedLevel', 11) // For testing purposes only
const totalLevels = 11;
const target = (unlockedLevel / totalLevels) * 100;

const isMobile = () => window.innerWidth <= 768;

function setProgress(percent) {
    percent = Math.max(0, Math.min(100, percent));
    const bar = document.getElementById('ProgressBar');
    if (isMobile()) {
        bar.style.width  = percent + '%';
        bar.style.height = '100%';        // reset the other axis
    } else {
        bar.style.height = percent + '%';
        bar.style.width  = '100%';        // reset the other axis
    }
}

let p = 0;
const interval = setInterval(() => {
    p += 1;
    setProgress(p);
    if (p >= target) clearInterval(interval);
}, 20);

// Re-run the bar if the user resizes the window (e.g. rotating a phone)
window.addEventListener('resize', () => {
    setProgress(p);   // p holds the current fill level; just re-apply it
});

const HelpButton = document.getElementById('HelpButton');
const HelpMenu = document.getElementById('HelpMenu');
const BackButton = document.getElementById('BackButton');

HelpButton.addEventListener('click', () => {
    HelpMenu.style.display = 'flex';
});

BackButton.addEventListener('click', () => {
    HelpMenu.style.display = 'none';
});