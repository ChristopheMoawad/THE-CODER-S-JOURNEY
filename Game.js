"use strict";

const player = document.getElementById("Player");
const enemy = document.getElementById("Enemy");
const savedUsername = localStorage.getItem('username');
document.getElementById('Playername').textContent = savedUsername || 'Player1';

//GAME SCREEN LOGIC
let currentLevel = parseInt(localStorage.getItem('currentLevel')) || 1;

let unlockedLevel = parseInt(localStorage.getItem('unlockedLevel')) || 1;
currentLevel = Math.min(currentLevel, unlockedLevel); // Ensure currentLevel doesn't exceed unlockedLevel
let playerFrame = 1;
let enemyFrame = 1;
let playerState = 'idle' 
let enemyState = 'idle' 

/// TIMER / RECORD SYSTEM
let fightStartTime = Date.now();
let pausedTime = 0;
let pauseStartedAt = 0;

// format milliseconds into mm:ss
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

//ENEMY LOGIC
const enemies = [
  { name: "HtmlStructure", attacks: { damage: 10 }, type: "html", health: 80 ,source: "Structure"},

  { name: "HtmlElements", attacks: { damage: 12 }, type: "html", health: 100 ,source: "Elements"},

  { name: "FilesAndLinks", attacks: { damage: 14 }, type: "html", health: 120 ,source: "FilesAndLinks"},

  { name: "StructureCSS", attacks: { damage: 16 }, type: "css", health: 120 ,source: "StructureCSS"},

  {name: "VisualImprovements", attacks: { damage: 18 }, type: "css", health: 140 ,source: "VisualImprovements"},

  {name: "Responsiveness", attacks: { damage: 20 }, type: "css", health: 160 ,source: "Responsiveness"},

  {name: "StructureJS", attacks: { damage: 22 }, type: "js", health: 160 ,source: "StructureJS"},

  {name: "Events", attacks: { damage: 24 }, type: "js", health: 180 ,source: "Events"},

  {name: "Animations", attacks: { damage: 26 }, type: "js", health: 200 ,source: "Animations"},

  {name: "Server-APIs", attacks: { damage: 28 }, type: "js", health: 220 ,source: "Server-APIs"},
];
let currentEnemy = {
    ...enemies[currentLevel - 1],
    maxHealth: enemies[currentLevel - 1].health,
    currentHealth: enemies[currentLevel - 1].health
}; //... is the spread operator, it copies all properties from the enemy template and allows us to add/override properties like maxHealth and currentHealth without modifying the original enemy objects in the array.
loadEnemy();
function loadEnemy() {
    const enemyImg = document.getElementById("Enemy");

    // Set base frame
    enemyFrame = 1;
    enemyImg.src = `${currentEnemy.source}${enemyFrame}.png`;

    // Name
    document.getElementById("Enemyname").textContent = currentEnemy.name;

    // styling tweaks per enemy
    if (currentLevel === 2) {
        enemyImg.style.transform = "translateX(5%) translateY(10%)";
    } 
    else if (currentLevel === 3) {
        enemyImg.style.width = "45svw";
        enemyImg.style.height = "50vh";
        enemyImg.style.transform = "translateX(5%) translateY(25%)";
    } 
    else if (currentLevel === 4) {
        enemyImg.style.width = "55svw";
        enemyImg.style.height = "60vh";
        enemyImg.style.transform = "translateX(5%) translateY(40%)";
    }
    else if (currentLevel === 5) {
        enemyImg.style.transform = "translateX(5%)";
    }
    else if (currentLevel === 6) {
        enemyImg.style.width = "50svw";
        enemyImg.style.height = "70vh";
        enemyImg.style.transform = "translateX(-5%) translateY(20%)";
    }
    else if (currentLevel === 7) {
        enemyImg.style.width = "55svw";
        enemyImg.style.height = "60vh";
        enemyImg.style.transform = "translateX(5%) translateY(40%)";
    }
    else if (currentLevel === 8) {
        enemyImg.style.width = "50svw";
        enemyImg.style.height = "70vh";
        enemyImg.style.transform = "translateX(5%) translateY(27%)";
    }
    else if (currentLevel === 9) {
        enemyImg.style.width = "35svw";
        enemyImg.style.height = "45vh";
        enemyImg.style.transform = "translateX(5%) translateY(10%)";
    }
    else if (currentLevel === 10) {
        enemyImg.style.width = "45svw";
        enemyImg.style.height = "65vh";
        enemyImg.style.transform = "translateX(10%) translateY(20%)";
    }
}
//PLAYER OBJECT
let playerData = {
    maxHealth: 100,
    currentHealth: 100,
    maxEnergy: 20,
    currentEnergy: 20
};

//Player and enemy logic 
function updateHealthBar(entity, barId) {
    const bar = document.getElementById(barId);
    const textEl = document.getElementById(barId + "Text");
    let percent = (entity.currentHealth / entity.maxHealth) * 100;
    percent = Math.max(0, percent);
    bar.style.width = percent + "%";
    if (textEl) textEl.textContent = Math.ceil(entity.currentHealth);
    if (percent < 30) {
        bar.style.backgroundColor = "red";
    } else if (percent < 60) {
        bar.style.backgroundColor = "orange";
    } else {
        bar.style.backgroundColor = "limegreen";
    }

    // ENEMY DEATH
    if (entity === currentEnemy && entity.currentHealth <= 0) {
        entity.currentHealth = 0;
        setTimeout(() => {
            levelCompleted(currentLevel);
        }, 450);
        return;
    }
    // PLAYER DEATH
    if (entity === playerData && entity.currentHealth <= 0) {
        entity.currentHealth = 0;
        setTimeout(() => {
            alert("You were defeated! Returning to game menu.");
            window.location.href = 'GameMenu.html';
        }, 450);
    }
}

function updateEnergyBar() {
    const percent = (playerData.currentEnergy / playerData.maxEnergy) * 100;
    const energyText = document.getElementById("EnergyText");
    energyDiv.style.width = percent + "%";
    if (energyText) energyText.textContent = Math.ceil(playerData.currentEnergy);
}

let animationInterval = setInterval(runAnimation, 450);
let enemyHasAttacked = false;
function runAnimation() {
    // PLAYER
    if (playerState === 'attack') {
        player.src = `CoderAttack.png`;
    } else if (playerState === 'heal') {
        player.src = `CoderBoost.png`;
    }
    else if (playerState === 'damage') {
        player.src = `CoderDamage.png`;
    }
    else {
        playerFrame = playerFrame === 1 ? 2 : 1;
        player.src = `Coder${playerFrame}.png`;
    }

    // ENEMY
    if (enemyState === 'attack') {
         if (currentEnemy.name === "Events") {
            enemyHasAttacked = true;
            enemy.style.transform = `translateX(-55%) translateY(27%)`;
        }
        enemy.src = `${currentEnemy.source}Attack.png`;
    } 
    else {
        if (currentEnemy.name === "Events" && enemyHasAttacked) {
            enemyHasAttacked = false;
            enemy.style.transform = `translateX(5%) translateY(27%)`;
        }
        enemyFrame = enemyFrame === 1 ? 2 : 1;
        enemy.src = `${currentEnemy.source}${enemyFrame}.png`;
    }
}

//PAUSE MENU LOGIC
const PauseButton = document.getElementById('PauseButton');
const PauseMenu = document.getElementById('PauseMenu');
const ResumeButton = document.getElementById('ResumeButton');
const GameMenuButton = document.getElementById('GameMenuButton');

PauseButton.addEventListener('click', () => {
    PauseMenu.style.display = 'flex';
    clearInterval(animationInterval); // pause animations
    pauseStartedAt = Date.now(); // pause timer logic 
});

ResumeButton.addEventListener('click', () => {
    PauseMenu.style.display = 'none';
    animationInterval = setInterval(runAnimation, 450); // resume animations
    pausedTime += Date.now() - pauseStartedAt; // add paused duration to total paused time
});

GameMenuButton.addEventListener('click', () => {
    window.location.href = 'GameMenu.html';
});

//GAMEPLAY LOGIC
let turn = 'player'; // default to player turn
const turnIndicator = document.getElementById('TurnIndicator');
turnIndicator.textContent = turn === 'player' ? "Player's Turn" : "Enemy's Turn";
const attacksDiv = document.getElementById("attacksDiv");
// Scroll logic for attack selection. Also handles the click events for attacks and healers.
attacksDiv.addEventListener("wheel", (e) => {
    e.preventDefault(); //stops the browser’s default scrolling behavior.

    attacksDiv.scrollBy({
        left: e.deltaY,
        behavior: "smooth"
    });
}, { passive: false });
let ticking = false;
attacksDiv.addEventListener("scroll", () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateActiveCard();
            ticking = false;
        });
        ticking = true;
    }
});
const energyDiv = document.getElementById("PlayerEnergy");

let inventoryIndex = 0;
const inventoryItems = [
    {name: "Attacks"},
    {name: "Healers"},
    {name: "Skip Turn"}
]

let selectedAttackIndex = 0;
const attacks = [
  { name: "Broken Div",          cost: 4, damage: 12, type: "syntax" },
  { name: "Missing Semicolon",   cost: 3, damage: 9,  type: "syntax" },
  { name: "Unclosed Tag",        cost: 6, damage: 18, type: "syntax" },
  { name: "Null Image",          cost: 4, damage: 11, type: "runtime" },
  { name: "404 Strike",          cost: 5, damage: 15, type: "runtime" },
  { name: "Missing Resource",    cost: 4, damage: 12, type: "runtime" },
  { name: "Cross-Origin Block",  cost: 4, damage: 11, type: "logic" },
  { name: "Incorrect Nesting",   cost: 5, damage: 15, type: "logic" },
  { name: "Infinite Loop Trap",  cost: 5, damage: 13, type: "logic" },
  { name: "Wrong Attribute Misuse", cost: 7, damage: 22, type: "logic" },
  { name: "Semantic Confusion",  cost: 6, damage: 18, type: "logic" },
];
if (currentLevel >= 4) {
    attacks[0].damage = 16; attacks[0].cost = 4;  // Broken Div
    attacks[2].damage = 24; attacks[2].cost = 6;  // Unclosed Tag
    attacks[4].damage = 20; attacks[4].cost = 5;  // 404 Strike
    attacks[9].damage = 28; attacks[9].cost = 7;  // Wrong Attribute Misuse
    attacks[10].damage = 24; attacks[10].cost = 6; // Semantic Confusion
    attacks.push({ name: "Specificity War",   cost: 5, damage: 18, type: "syntax" });
    attacks.push({ name: "Cascade Collapse",  cost: 7, damage: 25, type: "logic" });
    attacks.push({ name: "Overflow Flood",    cost: 4, damage: 14, type: "runtime" });
}
if (currentLevel >= 7) {
    attacks[0].damage = 20; attacks[0].cost = 4;  
    attacks[2].damage = 30; attacks[2].cost = 6;  
    attacks[4].damage = 26; attacks[4].cost = 5;  
    attacks[9].damage = 36; attacks[9].cost = 7;  
    attacks[10].damage = 30; attacks[10].cost = 6; 
    attacks.push({ name: "Scope Creep",       cost: 6, damage: 26, type: "logic" });
    attacks.push({ name: "Promise Rejected",  cost: 5, damage: 22, type: "runtime" });
    attacks.push({ name: "Stack Overflow",    cost: 8, damage: 38, type: "runtime" });
}

let selectedHealerIndex = 0;
const healers = [
  { name: "Debugging Session",     heal: 18, uses: 2, type: "HealthHeal" },
  { name: "Stack Overflow Search", heal: 8,  uses: 2, type: "EnergyHeal" },
  { name: "Coffee Break",          heal: 22, uses: 1, type: "HealthHeal" },
  { name: "Code Refactor",         heal: 10, uses: 1, type: "EnergyHeal" },
  { name: "Pair Programming",      heal: 26, uses: 1, type: "HealthHeal" },
];
if (currentLevel >= 4) {
    healers[0].heal = 24; healers[0].uses = 2;
    healers[1].heal = 11; healers[1].uses = 2;
    healers[2].heal = 28; healers[2].uses = 2;
    healers[3].heal = 13; healers[3].uses = 2;
    healers[4].heal = 32; healers[4].uses = 1;
    healers.push({ name: "Optimization",      heal: 38, uses: 1, type: "HealthHeal" });
    healers.push({ name: "Rubber Duck Debug", heal: 15, uses: 2, type: "EnergyHeal" });
}
if (currentLevel >= 7) {
    healers[0].heal = 31; healers[0].uses = 3;
    healers[1].heal = 12; healers[1].uses = 3;
    healers[2].heal = 35; healers[2].uses = 2;
    healers[3].heal = 15; healers[3].uses = 3;
    healers[4].heal = 40; healers[4].uses = 2;
    healers[5].heal = 45; healers[5].uses = 2;
    healers[6].heal = 17; healers[6].uses = 3;
    healers.push({ name: "Tech Debt Payoff",  heal: 50, uses: 1, type: "HealthHeal" });
    healers.push({ name: "Async Await Fix",   heal: 20, uses: 2, type: "EnergyHeal" });
}

//MUST be after attacks array since renderAttacks uses it. This is the initial render when you load the game.
if (turn === 'player') {
    renderInventory();
    updateHealthBar(currentEnemy, "EnemyHealth");
    updateHealthBar(playerData, "PlayerHealth");
}

//Scrolling visuals and attack selection logic. 

//Next two functions is to choose between attacks, healers, and skip turn
function renderInventory() {
    inventoryIndex = 0;
    updateEnergyBar();
    attacksDiv.innerHTML = `
    ${inventoryItems.map((item, i) => `
      <button class="inventory-btn" onclick="selectInventory(${i})">
        <div class="attack-name">${item.name}</div>
      </button>
    `).join("")}
    `;
}
function selectInventory(index) {
    inventoryIndex = index;

    if (inventoryItems[index].name === "Attacks") {
        renderAttacks();
    } else if (inventoryItems[index].name === "Healers") {
        renderHealers();
    } else if (inventoryItems[index].name === "Skip Turn") {
        playerDealtDamage = false;
        BetweenTurns();
        hideAttacks();
    }
}

// Functions to render healers and handle their usage.
function renderHealers() {
    selectedHealerIndex = 0;

    updateEnergyBar();

    attacksDiv.innerHTML = `
    <button class="back-btn" onclick="renderInventory()">
        <div class="attack-name">Back</div>
    </button>
    ${healers.map((h, i) => `
      <button class="attack-btn" onclick="useHealer(${i})">
        <div class="attack-name">${h.name}</div>
        <div class="attack-meta">
      ${h.type === "EnergyHeal" ? "Energy Boost" : "Heal"}: ${h.heal}
    </div>
        <div class="attack-meta">Uses: ${h.uses}</div>
      </button>
    `).join("")}
    <div class="spacer"></div>
    `;

    attacksDiv.scrollLeft = attacksDiv.scrollWidth / 2;

    setTimeout(() => {
        updateActiveCard();
    }, 50);
}

let playerDealtDamage = false;
function useHealer(index) {
    if (index !== selectedHealerIndex) return;
    if (healers[index].uses <= 0) {
        alert("No uses left for this healer!");
        return;
    }
    const healer = healers[index];

    
    if (healer.type === "HealthHeal") {
        playerData.currentHealth = Math.min(playerData.currentHealth + healer.heal, playerData.maxHealth);
        updateHealthBar(playerData, "PlayerHealth");
    } else if (healer.type === "EnergyHeal") {
        playerData.currentEnergy = Math.min(playerData.currentEnergy + healer.heal, playerData.maxEnergy);
        updateEnergyBar();
    }
    healer.uses--;
    playerState = 'heal';
    setTimeout(() => {
        playerState = 'idle';
    }, 450);

    playerDealtDamage = false;
    BetweenTurns();
    hideAttacks();
}

// Functions to render attacks and handle their usage.
function renderAttacks() {
    selectedAttackIndex = 0;
    updateEnergyBar();
  attacksDiv.innerHTML = `
    <button class="back-btn" onclick="renderInventory()">
        <div class="attack-name">Back</div>
    </button>
    ${attacks.map((a, i) => `
      <button class="attack-btn" onclick="useAttack(${i})">
        <div class="attack-name">${a.name}</div>
        <div class="attack-meta">${a.type} | ${a.damage} dmg</div>
        <div class="attack-cost">Energy Cost: ${a.cost}</div>
      </button>
    `).join("")}
    <div class="spacer"></div>
  `;
  attacksDiv.scrollLeft = attacksDiv.scrollWidth / 2;
  setTimeout(() => {
    updateActiveCard();
}, 50);
}

// This function updates the active card based on scroll position and highlights it. It also updates the selected attack or healer index accordingly.
function updateActiveCard() {
    const cards = document.querySelectorAll(".attack-btn");
    if (cards.length === 0) return;
    const containerRect = attacksDiv.getBoundingClientRect();
    const center = containerRect.left + containerRect.width / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;
    cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(center - cardCenter);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
        }
    });
    if (inventoryItems[inventoryIndex].name === "Attacks") {
        selectedAttackIndex = closestIndex;
    } else {
        selectedHealerIndex = closestIndex;
    }

    cards.forEach(card => card.classList.remove("active-attack"));
    cards[closestIndex].classList.add("active-attack");
}
function hideAttacks() {
    attacksDiv.innerHTML = "";
}

//User attack logic.
function useAttack(index) {
    if (index !== selectedAttackIndex) return;
    const attack = attacks[index];
    if (playerData.currentEnergy < attack.cost) {
        alert("Not enough energy!");
        return;
    }
    playerData.currentEnergy = Math.max(0, playerData.currentEnergy - attack.cost);
    updateEnergyBar();
    playerState = 'attack';
    currentEnemy.currentHealth = Math.max(0, currentEnemy.currentHealth - attack.damage);

    setTimeout(() => { playerState = 'idle'; }, 450);
    playerDealtDamage = true;
    BetweenTurns();
    hideAttacks();
}

//transition between turns.
function BetweenTurns() {
        if (turnIndicator.textContent == "Player's Turn") {
            if(playerDealtDamage) {
                setTimeout(() => {
                const enemyImg = document.getElementById("Enemy");
                enemyImg.classList.remove("enemy-hit");
                void enemyImg.offsetWidth; //used to retrigger the animation by forcing a reflow
                enemyImg.classList.add("enemy-hit");
                setTimeout(() => enemyImg.classList.remove("enemy-hit"), 400);
                }, 450);
            }
            setTimeout(() => {
                updateHealthBar(currentEnemy, "EnemyHealth");
                turn = 'enemy';
                turnIndicator.textContent = "Enemy's Turn";
                enemyAttack();
            }, 2000);
        } else {
            setTimeout(() => {
                playerState = 'damage';
            }, 450);
            setTimeout(() => {
            updateHealthBar(playerData, "PlayerHealth");
            playerState = 'idle';
            playerData.currentEnergy = Math.min(playerData.currentEnergy + 2, playerData.maxEnergy);
            updateEnergyBar();
            turn = 'player';
            turnIndicator.textContent = "Player's Turn";
            renderInventory();
        }, 2000);
        }
}

//Enemy attack logic.
function enemyAttack() {
    turnIndicator.textContent = "Enemy's Turn";
    setTimeout(() => {
        const damage = currentEnemy.attacks.damage;
        enemyState = 'attack';
        playerData.currentHealth = Math.max(0, playerData.currentHealth - damage);
         setTimeout(() => {
                enemyState = 'idle';
                playerState = 'idle';
            }, 450);
        BetweenTurns();
    }, 1000);
}

//This is to save progress on the device. Logic is you save the highest level unlocked.
function levelCompleted(currentLevel) {
    const finalTime = Date.now() - fightStartTime - pausedTime;
    const recordKey = `level${currentLevel}Record`;
    const oldRecord = localStorage.getItem(recordKey);
    if (!oldRecord || finalTime < parseInt(oldRecord)) {
        localStorage.setItem(recordKey, finalTime);
        alert(
            `Enemy defeated!\n` +
            `NEW RECORD: ${formatTime(finalTime)}`
        );
    } else {
        alert(
            `Enemy defeated!\n` +
            `Time: ${formatTime(finalTime)}\n` +
            `Record: ${formatTime(parseInt(oldRecord))}`
        );
    }

    if (currentLevel >= unlockedLevel) {
        localStorage.setItem('unlockedLevel', currentLevel + 1);
    }
    window.location.href = 'GameMenu.html';
}