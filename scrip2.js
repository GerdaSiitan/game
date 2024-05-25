let correct = 0;
const total = 4;

// Camera parts data
const cameraParts = [
    { id: 'flash-box', name: 'Flash Placement' },
    { id: 'mode-dial', name: 'Mode Dial' },
    { id: 'programmable-buttons', name: 'Programmable Buttons' },
    { id: 'exposure', name: 'Exposure' }
];

// Query DOM elements
const scoreSection = document.querySelector(".score");
const correctSpan = scoreSection.querySelector(".correct");
const totalSpan = scoreSection.querySelector(".total");
const resetBtn = scoreSection.querySelector("#reset-btn");
const draggableItems = document.querySelector(".draggable-items");
const matchingPairs = document.querySelector(".matching-pairs");

let draggableElements;
let droppableElements;

// Function to initiate the game
function initiateGame() {
    correct = 0;
    updateScore();

    // Shuffle and create draggable items
    const shuffledParts = shuffleArray([...cameraParts]);
    draggableItems.innerHTML = ''; // Clear existing content
    shuffledParts.forEach(part => {
        draggableItems.insertAdjacentHTML(
            'beforeend',
            `<div class="draggable" draggable="true" id="${part.id}">
                ${part.name}
            </div>`
        );
    });

    // Clear droppable boxes
    droppableElements = document.querySelectorAll(".droppable");
    droppableElements.forEach(elem => {
        elem.classList.remove("dropped", "wrong");
        elem.textContent = "";
    });

    // Add event listeners for drag-and-drop functionality
    draggableElements = document.querySelectorAll(".draggable");
    draggableElements.forEach(elem => {
        elem.addEventListener("dragstart", dragStart);
    });

    droppableElements.forEach(elem => {
        elem.addEventListener("dragenter", dragEnter);
        elem.addEventListener("dragover", dragOver);
        elem.addEventListener("dragleave", dragLeave);
        elem.addEventListener("drop", drop);
    });

    // Hide the "Next Level" button
    playAgainBtn.style.display = "none";
}

// Shuffle array function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Drag-and-drop event handlers
function dragStart(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function dragEnter(event) {
    if (event.target.classList.contains("droppable") && !event.target.classList.contains("dropped")) {
        event.target.classList.add("droppable-hover");
    }
}

function dragOver(event) {
    if (event.target.classList.contains("droppable")) {
        event.preventDefault(); // Allows dropping
    }
}

function dragLeave(event) {
    if (event.target.classList.contains("droppable")) {
        event.target.classList.remove("droppable-hover");
    }
}

function drop(event) {
    event.preventDefault();
    const draggableElementId = event.dataTransfer.getData("text");
    const droppableElementPart = event.target.getAttribute("data-part");
    const isCorrectMatching = draggableElementId === droppableElementPart;

    const draggableElement = document.getElementById(draggableElementId);

    event.target.classList.remove("droppable-hover");
    event.target.classList.add("dropped");

    if (isCorrectMatching) {
        event.target.classList.remove("wrong");
        correct++;
    } else {
        event.target.classList.add("wrong");
    }

    // Place the element inside the box at the bottom
    event.target.appendChild(draggableElement);
    draggableElement.classList.add("dragged");
    draggableElement.setAttribute("draggable", "true");

    updateScore(); // Update score in the UI
}

function updateScore() {
    correctSpan.textContent = correct;
    totalSpan.textContent = total;
    scoreSection.style.opacity = 1;
}

resetBtn.addEventListener("click", () => {
    initiateGame(); // Re-initialize the game
});

// Start the game for the first time
initiateGame();
