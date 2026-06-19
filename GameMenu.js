"use strict";

const levelButtons = document.querySelectorAll('.button');

// unlock/setup all levels
levelButtons.forEach(button => UnlockingLevels(button));

// click events
levelButtons.forEach(button => {
    if (button.classList.contains('unlocked')) {
        button.addEventListener('click', () => {
            const level = parseInt(button.dataset.level);
            localStorage.setItem("currentLevel", level);
            window.location.href = "Game.html";
        });
    }
});

// FORMAT RECORD TIME
function formatTime(ms) {
    if (!ms) return "--:--";

    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; //padstart ensures we get 2 digits even for single-digit numbers by adding 0s
}

function UnlockingLevels(button) {
    const level = parseInt(button.dataset.level);
    const unlockedLevel = parseInt(localStorage.getItem('unlockedLevel')) || 1;
    const image = button.nextElementSibling;

    const recordKey = `level${level}Record`;
    const recordTime = localStorage.getItem(recordKey);
    const timeElement = document.createElement("div");
    timeElement.classList.add("level-time");
    timeElement.textContent = recordTime
        ? formatTime(parseInt(recordTime))
        : "--:--";
    // insert ABOVE level image button
    button.parentElement.insertBefore(timeElement, button);
    if (level <= unlockedLevel) {
        button.classList.add('unlocked');
        button.classList.remove('locked');
        button.src = 'unlockedLevel.png';
        image.classList.remove('locked');
    } else {
        button.classList.add('locked');
        button.classList.remove('unlocked');
        button.src = 'lockedLevel.png';
        image.classList.add('locked');
    }
}

const backButton = document.getElementById('BackButton');
backButton.addEventListener('click', () => {
    window.location.href = 'MainMenu.html';
});