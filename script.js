const plank = document.getElementById('plank');

let objects = [];

const PLANK_WIDTH = 600;


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
    console.log(`Nesne eklendi: ${weight}kg, Konum: ${distance.toFixed(1)}px`);
}

plank.addEventListener('click', function(event) {
    const rect = plank.getBoundingClientRect();
    
    const pivotX = rect.left + rect.width / 2;
    
    const clickX = event.clientX;
    
    let distanceFromPivot = clickX - pivotX;

    const weight = getRandomWeight(1, 10);

    createObjectElement(weight, distanceFromPivot);
});