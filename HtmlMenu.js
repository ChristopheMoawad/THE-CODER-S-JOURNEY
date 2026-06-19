"use strict";

const backButton = document.getElementById('BackButton');
const structure = document.getElementById('Structure');
const elements = document.getElementById('Elements');
const files = document.getElementById('FilesAndLinks');
const errors = document.getElementById('Errors');
const teaser = document.getElementById('Teaser');
backButton.addEventListener('click', () => {
    window.location.href = 'MainMenu.html';
});
const unlockedLevel = parseInt(localStorage.getItem('unlockedLevel'))
if (unlockedLevel >= 4) {    
    structure.style.display = 'block';
    elements.style.display = 'block';
    files.style.display = 'block';
    errors.style.display = 'block';
    teaser.style.display = 'none';
}else if (unlockedLevel >= 3) {
    structure.style.display = 'block';
    elements.style.display = 'block';
    elements.after(teaser);
}else if (unlockedLevel >= 2) {
    structure.style.display = 'block';
    structure.after(teaser);
}