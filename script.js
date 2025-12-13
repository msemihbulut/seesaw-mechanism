const plank = document.getElementById('plank');
const leftWeightDisplay = document.getElementById('left-weight');
const rightWeightDisplay = document.getElementById('right-weight');
const PLANK_WIDTH = 600;

let objects = [];


function getRandomWeight(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
    
    // Console check
    console.log(`Object added: ${weight}kg, Location: ${distance.toFixed(1)}px`);
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

    plank.style.transform = `rotate(${angle}deg)`;

    leftWeightDisplay.innerText = leftTotalWeight + ' kg';
    rightWeightDisplay.innerText = rightTotalWeight + ' kg';

    // Console Check
    console.log(`Left Torque: ${leftTorque.toFixed(1)}, Right Torque: ${rightTorque.toFixed(1)}, Angle: ${angle}`);
}

plank.addEventListener('click', function(event) {
    const rect = plank.getBoundingClientRect();
    
    const pivotX = rect.left + rect.width / 2;
    const clickX = event.clientX;
    
    let distanceFromPivot = clickX - pivotX;

    const weight = getRandomWeight(1, 10);

    createObjectElement(weight, distanceFromPivot);

    updateSimulation();
});