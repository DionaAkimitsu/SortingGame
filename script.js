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
                div.classList.add("empty"); // Đảm bảo ô đen luôn giữ màu
            } else {
                div.textContent = tile;
                div.classList.add(`tile-${tile}`); // Gán đúng lớp CSS cho từng ô số
            }
    
            gameBoard.appendChild(div);
        });
    }

document.addEventListener("keydown", (event) => {
    if (!gameStarted) return; // Ngăn chặn di chuyển nếu chưa bấm "Bắt đầu"

    event.preventDefault(); // Ngăn hành động mặc định của phím

    if (["w", "a", "s", "d", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        moveTile(event.key); // Di chuyển ô đen trước khi cập nhật số lần nhấn
        moves++; // Tăng biến `move` sau khi di chuyển thành công
        stepCountElement.textContent = move; // Hiển thị số lần nhấn trên giao diện
    }
});

function moveTile(direction) {
    let targetIndex;
    const cols = 4;

    switch (direction) {
        case "w":
        case "ArrowUp":
            if (emptyIndex >= cols) targetIndex = emptyIndex - cols; // Lên
            break;
        case "s":
        case "ArrowDown":
            if (emptyIndex + cols < tiles.length) targetIndex = emptyIndex + cols; // Xuống
            break;
        case "a":
        case "ArrowLeft":
            if (emptyIndex % cols !== 0) targetIndex = emptyIndex - 1; // Trái
            break;
        case "d":
        case "ArrowRight":
            if ((emptyIndex + 1) % cols !== 0) targetIndex = emptyIndex + 1; // Phải
            break;
    }

    if (targetIndex !== undefined) {
        [tiles[emptyIndex], tiles[targetIndex]] = [tiles[targetIndex], tiles[emptyIndex]];
        emptyIndex = targetIndex; // Cập nhật vị trí ô trống
        renderBoard();
        checkWin();
    }
}
    
    

function checkWin() {
    const isWinning = tiles.slice(0, 11).every((num, index) => num === index + 1); // Kiểm tra thứ tự đúng

    if (isWinning) {
        clearInterval(timerInterval); // Dừng bộ đếm thời gian
        winMessage.classList.remove("hidden"); // Hiển thị thông báo chiến thắng

        gameHistory.push({
            round: gameHistory.length + 1,
            steps: moves,
            time: time
        });

        updateHistory(); // Cập nhật bảng xếp hạng

        // Đổi nút thành "Bắt đầu" để chơi lại
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
            gameStarted = false; // Ngăn di chuyển khi kết thúc trò chơi
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