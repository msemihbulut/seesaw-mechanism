const plank = document.getElementById('plank');

const leftTotalWeightDisplay = document.getElementById('left-total-weight');
const rightTotalWeightDisplay = document.getElementById('right-total-weight');
const nextWeightDisplay = document.getElementById('next-weight');
const angleDisplay = document.getElementById('angle');
const weightPreviewDisplay = document.getElementById('weight-preview');
const historyContainer = document.getElementById('history-container');

const resetBtn = document.getElementById('reset-btn');
const pauseBtn = document.getElementById('pause-btn');

const PLANK_WIDTH = 600;

let objects = [];
let nextWeight = 0;
let activityHistory = [];
let isPause = false;

window.addEventListener('load', () => {
    const savedData = localStorage.getItem('seesawStatus');

    createNextWeight();
    
    if (savedData) {
        const savedObjects = JSON.parse(savedData);
        
        savedObjects.forEach(obj => {
            createObjectElement(obj.weight, obj.position); 
        });
        updateSimulation();
    }
});

function getRandomWeight(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pushHistoryEntry(weight, position) {
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
}

function createNextWeight() {
    nextWeight = getRandomWeight(1, 10);
    nextWeightDisplay.innerText = nextWeight + ' kg';
    
    nextWeightDisplay.style.backgroundColor = '#8e44ad';
    nextWeightDisplay.style.borderColor = '#6c3483';

    weightPreviewDisplay.innerText = nextWeight + 'kg';
    weightPreviewDisplay.style.backgroundColor = '#8e44ad';
    weightPreviewDisplay.style.borderColor = '#6c3483';
}

function createObjectElement(weight, distance) {
    const weightDiv = document.createElement('div');
    weightDiv.classList.add('weight');
    weightDiv.innerText = weight + 'kg';
    
    weightDiv.style.backgroundColor = '#8e44ad';
    weightDiv.style.borderColor = '#6c3483';

    const leftPosition = (PLANK_WIDTH / 2) + distance;
    weightDiv.style.left = leftPosition + 'px';

    plank.appendChild(weightDiv);
    
    objects.push({
        weight: weight,
        position: distance,
        element: weightDiv
    });
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
        position: obj.position
    }));
    
    localStorage.setItem('seesawStatus', JSON.stringify(statusToSave));
}

plank.addEventListener('click', function(event) {
    const rect = plank.getBoundingClientRect();
    const pivotX = rect.left + rect.width / 2;
    const clickX = event.clientX;

    let distanceFromPivot = clickX - pivotX;

    const weight = nextWeight;

    createObjectElement(weight, distanceFromPivot);

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

    historyContainer.innerHTML = '<div class="log-entry placeholder">No action has been taken.</div>';

    isPause = false;
    pauseBtn.innerText = "Pause";
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