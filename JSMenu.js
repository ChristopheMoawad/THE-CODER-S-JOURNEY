"use strict";

const backButton = document.getElementById('BackButton');
const structure = document.getElementById('Structure');
const events = document.getElementById('Events');
const animations = document.getElementById('Animations');
const api = document.getElementById('API');
const teaser = document.getElementById('Teaser');

backButton.addEventListener('click', () => {
    window.location.href = 'MainMenu.html';
});
const unlockedLevel = parseInt(localStorage.getItem('unlockedLevel'))
if (unlockedLevel >= 11) {    
    structure.style.display = 'block';
    events.style.display = 'block';
    animations.style.display = 'block';
    api.style.display = 'block';
    teaser.style.display = 'none';
}
else if (unlockedLevel >= 10) {    
    structure.style.display = 'block';
    events.style.display = 'block';
    animations.style.display = 'block';
    animations.after(teaser);
}else if (unlockedLevel >= 9) {
    structure.style.display = 'block';
    events.style.display = 'block';
    events.after(teaser);
}else if (unlockedLevel >= 8) {
    structure.style.display = 'block';
    structure.after(teaser);
}
