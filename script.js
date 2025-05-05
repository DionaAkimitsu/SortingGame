document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("startBtn");
    const gameBoard = document.querySelector(".game-board");
    const timerElement = document.getElementById("timer");
    const historyList = document.getElementById("historyList");
    const stepCountElement = document.getElementById("stepCount");
    const winMessage = document.getElementById("winMessage");

    let time = 0, timerInterval, moves = 0;
    let tiles = Array.from({ length: 11 }, (_, i) => i + 1).concat([""]); 
    let emptyIndex = tiles.length - 1;
    let gameHistory = [];

    

    function shuffleTiles() {
        for (let i = 0; i < 100; i++) {
            const emptyPos = tiles.indexOf("");
            const possibleMoves = [];

            if (emptyPos % 4 !== 0) possibleMoves.push(emptyPos - 1); 
            if (emptyPos % 4 !== 3) possibleMoves.push(emptyPos + 1); 
            if (emptyPos >= 4) possibleMoves.push(emptyPos - 4); 
            if (emptyPos < tiles.length - 4) possibleMoves.push(emptyPos + 4);

            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            [tiles[emptyPos], tiles[randomMove]] = [tiles[randomMove], tiles[emptyPos]];
        }

        emptyIndex = tiles.indexOf("");
        renderBoard();
    }

    function renderBoard() {
        gameBoard.innerHTML = "";
        tiles.forEach((tile, index) => {
            const div = document.createElement("div");
            div.classList.add("tile");
    
            if (tile === "") {
                div.classList.add("empty"); 
            } else {
                div.textContent = tile;
                div.classList.add(`tile-${tile}`); 
            }
    
            gameBoard.appendChild(div);
        });
    }

document.addEventListener("keydown", (event) => {
    if (!gameStarted) return; 

    event.preventDefault(); 

    if (["w", "a", "s", "d", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        moveTile(event.key); 
        moves++; 
        stepCountElement.textContent = move; 
    }
});

function moveTile(direction) {
    let targetIndex;
    const cols = 4;

    switch (direction) {
        case "w":
        case "ArrowUp":
            if (emptyIndex >= cols) targetIndex = emptyIndex - cols; 
            break;
        case "s":
        case "ArrowDown":
            if (emptyIndex + cols < tiles.length) targetIndex = emptyIndex + cols; 
            break;
        case "a":
        case "ArrowLeft":
            if (emptyIndex % cols !== 0) targetIndex = emptyIndex - 1; 
            break;
        case "d":
        case "ArrowRight":
            if ((emptyIndex + 1) % cols !== 0) targetIndex = emptyIndex + 1; 
    }

    if (targetIndex !== undefined) {
        [tiles[emptyIndex], tiles[targetIndex]] = [tiles[targetIndex], tiles[emptyIndex]];
        emptyIndex = targetIndex; 
        renderBoard();
        checkWin();
    }
}
    
    

function checkWin() {
    const isWinning = tiles.slice(0, 11).every((num, index) => num === index + 1); 

    if (isWinning) {
        clearInterval(timerInterval); 
        winMessage.classList.remove("hidden"); 

        gameHistory.push({
            round: gameHistory.length + 1,
            steps: moves,
            time: time
        });

        updateHistory(); 
        startBtn.textContent = "Bắt đầu";
        startBtn.classList.remove("end");
        startBtn.classList.add("start");

        gameStarted = false
    }
}

    function updateHistory() {
        historyList.innerHTML = "";
        gameHistory.forEach((entry, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${entry.steps}</td>
                <td>${entry.time} giây</td>
            `;
            historyList.appendChild(row);
        });
    }

    startBtn.addEventListener("click", function () {
        if (this.textContent === "Bắt đầu") {
            gameStarted = true
            this.textContent = "Kết thúc";
            this.classList.remove("start");
            this.classList.add("end");

            winMessage.classList.add("hidden");
            time = 0;
            timerElement.textContent = "00:00";
            clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                time++;
                timerElement.textContent = (Math.floor(time / 60)).toString().padStart(2, '0') + ":" + (time % 60).toString().padStart(2, '0');
            }, 1000);

            shuffleTiles();
            renderBoard();
        } else {
            gameStarted = false;
            this.textContent = "Bắt đầu";
            this.classList.remove("end");
            this.classList.add("start");

            clearInterval(timerInterval);
            renderBoard();
            emptyIndex = tiles.indexOf("");
        }
    });

    renderBoard();
});