const divPlayer1 = document.querySelector("div.player1")
const divPlayer2 = document.querySelector("div.player2")
var players = 1;
var jogoIniciado = false;

const player1Btn = document.querySelector("#player1_btn")
const player2Btn = document.querySelector("#player2_btn")
player1Btn.addEventListener("click", () => {
    setPlayers(1)
})
player2Btn.addEventListener("click", () => {
    setPlayers(2)
})

function setPlayers(num) {

    if(num == 1) {
        divPlayer1.style.display = "";
        divPlayer2.style.display = "none";
    }

    else if(num == 2) {
        divPlayer1.style.display = "";
        divPlayer2.style.display = "";
    }
    players = num;
}

const startGameBtn = document.querySelector("button#startGameBtn")
startGameBtn.addEventListener("click", startGame)

function startGame() {
    if(players == 1) {
        const namePlayer1 = divPlayer1.querySelector("input")

        console.log(namePlayer1.value)
    }

    else if(players == 2) {
        const namePlayer1 = divPlayer1.querySelector("input")
        const namePlayer2 = divPlayer2.querySelector("input")

        console.log(namePlayer1.value)
        console.log(namePlayer2.value)
    }

    jogoIniciado = true;
}

