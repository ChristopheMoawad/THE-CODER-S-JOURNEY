const backButton = document.getElementById('BackButton');
const structure = document.getElementById('Structure');
const visualimporvements = document.getElementById('VisualImprovements');
const responsiveness = document.getElementById('Responsiveness');
const teaser = document.getElementById('Teaser');
backButton.addEventListener('click', () => {
    window.location.href = 'MainMenu.html';
});
const unlockedLevel = parseInt(localStorage.getItem('unlockedLevel'))
if (unlockedLevel >= 7) {    
    structure.style.display = 'block';
    visualimporvements.style.display = 'block';
    responsiveness.style.display = 'block';
    teaser.style.display = 'none';
}else if (unlockedLevel >= 6) {
    structure.style.display = 'block';
    visualimporvements.style.display = 'block';
    visualimporvements.after(teaser);
}else if (unlockedLevel >= 5) {
    structure.style.display = 'block';
    structure.after(teaser);
}