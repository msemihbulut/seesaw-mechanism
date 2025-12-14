const plank = document.getElementById('plank');
const leftTotalWeightDisplay = document.getElementById('left-total-weight');
const rightTotalWeightDisplay = document.getElementById('right-total-weight');
const nextWeightDisplay = document.getElementById('next-weight');
const angleDisplay = document.getElementById('angle');
const weightPreviewDisplay = document.getElementById('weight-preview');
const historyContainer = document.getElementById('history-container');
const soundEffect = document.getElementById('sound-effect');

const resetBtn = document.getElementById('reset-btn');
const pauseBtn = document.getElementById('pause-btn');

const PLANK_WIDTH = 600;

let objects = [];
let nextWeight = 0;
let nextColor = '';
let activityHistory = [];
let isPause = false;

const COLORS = [
    '#e74c3c', '#8e44ad', '#3498db', '#1abc9c', '#f1c40f', 
    '#d35400', '#c0392b', '#16a085', '#2980b9', '#27ae60',
    '#f39c12', '#9b59b6', '#2c3e50', '#e67e22', '#e84393'
];

window.addEventListener('load', () => {
    const savedData = localStorage.getItem('seesawStatus');
    const savedHistory = localStorage.getItem('seesawHistory');

    createScaler();

    createNextWeight();

    if (savedHistory) {
        activityHistory = JSON.parse(savedHistory);
        activityHistory.forEach(log => {
            pushHistoryEntry(log.weight, log.position, true);
        });
    }
    
    if (savedData) {
        const savedObjects = JSON.parse(savedData);
        savedObjects.forEach(obj => {
            createObjectElement(obj.weight, obj.position, obj.color, true); 
        });
        updateSimulation();
    }
});

function getRandomWeight(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
    const index = Math.floor(Math.random() * COLORS.length);
    return COLORS[index];
}

function playSoundEffect() {
    soundEffect.currentTime = 0;
    
    soundEffect.play().catch(error => {
        console.log(error);
    });
}

function pushHistoryEntry(weight, position, isRestoring = false) {
    const placeholder = document.querySelector('.placeholder');
    if (placeholder) {
        placeholder.remove();
    }

    const side = position < 0 ? "left" : "right";
    const distance = Math.abs(position).toFixed(0);

    const historyEntry = document.createElement('div');
    historyEntry.classList.add('history-entry');
    historyEntry.innerText = ` ${weight}kg dropped on ${side} side at ${distance}px from pivot`;

    historyContainer.prepend(historyEntry);

    if (!isRestoring) {
        activityHistory.push({ weight, position });
        localStorage.setItem('seesawHistory', JSON.stringify(activityHistory));
    }
}

function createNextWeight() {
    nextWeight = getRandomWeight(1, 10);
    nextColor = getRandomColor();

    nextWeightDisplay.innerText = nextWeight + ' kg';
    nextWeightDisplay.style.backgroundColor = nextColor;

    weightPreviewDisplay.innerText = nextWeight + 'kg';
    weightPreviewDisplay.style.backgroundColor = nextColor;
}

function createObjectElement(weight, distance, color, storage = false ) {
    const weightDiv = document.createElement('div');
    weightDiv.classList.add('weight');
    weightDiv.innerText = weight + 'kg';
    
    weightDiv.style.backgroundColor = color;

    const leftPosition = (PLANK_WIDTH / 2) + distance;
    weightDiv.style.left = leftPosition + 'px';

    plank.appendChild(weightDiv);
    
    objects.push({
        weight: weight,
        position: distance,
        color: color,
        element: weightDiv
    });

    if (!storage) {
        playSoundEffect();
    }
}

function updateSimulation() {
    let leftTorque = 0;
    let rightTorque = 0;
    let leftTotalWeight = 0;
    let rightTotalWeight = 0;

    objects.forEach(obj => {
        const normalizedDistance = Math.abs(obj.position) / 10;
        const torque = obj.weight * normalizedDistance;

        if (obj.position < 0) {
            leftTorque += torque;
            leftTotalWeight += obj.weight;
        } else {
            rightTorque += torque;
            rightTotalWeight += obj.weight;
        }
    });

    let angle = (rightTorque - leftTorque) / 10;
    if (angle > 30) angle = 30;
    if (angle < -30) angle = -30;

    if (!isPause) {
        plank.style.transform = `rotate(${angle}deg)`;
        angleDisplay.innerText = Math.round(angle) + '°';
    }

    leftTotalWeightDisplay.innerText = leftTotalWeight + ' kg';
    rightTotalWeightDisplay.innerText = rightTotalWeight + ' kg';

    saveStatus();
}

function saveStatus() {
    const statusToSave = objects.map(obj => ({
        weight: obj.weight,
        position: obj.position,
        color: obj.color
    }));
    localStorage.setItem('seesawStatus', JSON.stringify(statusToSave));
}

function createScaler() {
    const scaleContainer = document.getElementById('scale');
    
    for (let i = -250; i <= 250; i += 50) {
        if (i === 0) continue;
        
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.left = (PLANK_WIDTH / 2) + i + 'px';
        scaleContainer.appendChild(line);
        
        const label = document.createElement('div');
        label.classList.add('line-label');
        label.innerText = Math.abs(i);
        label.style.left = (PLANK_WIDTH / 2) + i + 'px';
        
        if (i % 100 === 0) {
            label.style.fontWeight = 'bold';
            label.style.color = '#34495e';
            line.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
        }
        
        scaleContainer.appendChild(label);
    }
}

plank.addEventListener('click', function(event) {
    const rect = plank.getBoundingClientRect();
    const pivotX = rect.left + rect.width / 2;
    const clickX = event.clientX;
    let distanceFromPivot = clickX - pivotX;

    const weight = nextWeight;
    const color = nextColor;

    createObjectElement(weight, distanceFromPivot, color);
    updateSimulation();

    pushHistoryEntry(weight, distanceFromPivot);

    createNextWeight();
});

plank.addEventListener('mousemove', (event) => {
    const rect = plank.getBoundingClientRect();
    const x = event.clientX - rect.left;

    weightPreviewDisplay.style.display = 'flex';
    weightPreviewDisplay.style.left = x + 'px';
});


plank.addEventListener('mouseleave', () => {
    weightPreviewDisplay.style.display = 'none';
});

resetBtn.addEventListener('click', () => {
    objects = [];
    
    const weights = document.querySelectorAll('.weight');

    weights.forEach(el => {
        if (el.id !== 'weight-preview') {
            el.remove();
        }
    });
    
    localStorage.removeItem('seesawStatus');
    
    plank.style.transform = 'rotate(0deg)';
    document.getElementById('left-total-weight').innerText = '0 kg';
    document.getElementById('right-total-weight').innerText = '0 kg';
    angleDisplay.innerText = '0°';

    activityHistory = [];
    localStorage.removeItem('seesawHistory');
    historyContainer.innerHTML = '<div class="history-entry placeholder">No action has been taken.</div>';

    isPause = false;
    pauseBtn.innerText = "Pause Mechanism";
    pauseBtn.classList.remove('resume-mode');

    createNextWeight();
});

pauseBtn.addEventListener('click', () => {
    isPause = !isPause; 
    
    if (isPause) {
        pauseBtn.innerText = "Resume Mechanism";
        pauseBtn.classList.add('resume-mode');
        plank.style.transform = 'rotate(0deg)';
        angleDisplay.innerText = '0° (Paused)';
        
    } else {
        pauseBtn.innerText = "Pause Mechanism";
        pauseBtn.classList.remove('resume-mode');
        updateSimulation();
    }
});