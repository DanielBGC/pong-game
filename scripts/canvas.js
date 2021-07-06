// import {qtdPlayers, jogoIniciado} from "./modal-inicio.js"
// console.log(qtdPlayers)
// console.log(jogoIniciado)

/////////////////////////////////////////MODAL INÍCIO///////////////////////////////////////////////////////
dialogOptions = {
    show: {
      effect: "blind",
      duration: 300
    },
    hide: {
      effect: "explode",
      duration: 300
    }
}

function hideModal() {
    document.querySelector("#modalInicio").style.display = "none";
}
function showModal() {
    document.querySelector("#modalInicio").style.display = "";
}


const divPlayer1 = document.querySelector("div.player1")
const divPlayer2 = document.querySelector("div.player2")
const namePlayer1 = divPlayer1.querySelector("input")
const namePlayer2 = divPlayer2.querySelector("input")

var players = 1;
setPlayers(players)

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
    console.log(players)
}

const startGameBtn = document.querySelector("button#startGameBtn")
startGameBtn.addEventListener("click", startGame)

function startGame() {
    if(players == 1) {
        if(namePlayer1.value == "" || namePlayer1.value == " ") {
            $(function() {
                $("#dialogPlayer1").dialog(dialogOptions);
            });
        } 
        else {
            mostrarCanvas();
            hideModal();
            esquerda.name = namePlayer1.value
        }
    }

    else if(players == 2) {
        if(namePlayer1.value == "" || namePlayer1.value == " ") {
            $(function() {
                $("#dialogPlayer1").dialog(dialogOptions);
            });
        }
        else if(namePlayer2.value == "" || namePlayer2.value == " ") {
            $(function() {
                $("#dialogPlayer2").dialog(dialogOptions);
            });
        }
        else {
            mostrarCanvas();
            hideModal();
            esquerda.name = namePlayer1.value
            direita.name = namePlayer2.value
        }
    }
}


/////////////////////////////////////////////CANVAS/////////////////////////////////////////////////////


var canvas = document.querySelector("#mycanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Determina que todo o elemento canvas é bidimensional (2D)
var ctx = canvas.getContext("2d");

function mostrarCanvas() {
    canvas.style.display = ""
}

if(!jogoIniciado) {
    canvas.style.display = "none"
} 

//objeto para identificar as teclas pressionadas no teclado
var teclas = {};

var jogo = {
    rebatidas: 0,
    iniciado: jogoIniciado
}

var bola = {
    x: (canvas.width / 2) - 10,
    y: (canvas.height / 2) - 10,
    altura: 20,
    largura: 20,
    dirx: -1, 
    diry: 0.6,
    speed: 4,
    mod: 0
};

//Player 1
var esquerda = {
    x: 15,
    y: (canvas.height / 2) - 80,
    altura: 160,
    largura: 15,
    score: 0,
    speed: 10,
    name: "Player 1"
};

//Player 2
var direita = {
    x: canvas.width - 30,
    y: (canvas.height / 2) - 80,
    altura: 160,
    largura: 15,
    score: 0,
    speed: 10,
    name: "Player 2"
};

//Ouvidor de eventos para quando uma tecla for pressionada
document.addEventListener("keydown", function(e) {
    teclas[e.keyCode] = true;
})

document.addEventListener("keyup", function(e) {
    delete teclas[e.keyCode];
})

function dificuldade(dif) {
    if(dif == 'facil')
        bola.speed = 2;
    if(dif == 'medio')
        bola.speed = 3;
    if(dif == 'dificil')
        bola.speed = 7;
}

function movePlayer() {
    if(players == 1) {
        //o bloco da esquerda acompanha a altura da bolinha
        esquerda.y = bola.y - (esquerda.altura/2)
    }

    //tecla 'W'    
    if(87 in teclas && esquerda.y > 0) 
        esquerda.y -= esquerda.speed;

    //tecla 'S'
    if(83 in teclas && esquerda.y + esquerda.altura < canvas.height)
        esquerda.y += esquerda.speed;

    //tecla 'arrowUp'    
    if(38 in teclas && direita.y > 0) 
        direita.y -= direita.speed;
    
    //tecla 'arrowDown'
    if(40 in teclas && direita.y + direita.altura < canvas.height)
        direita.y += direita.speed;

    //tecla 'R' 
    if(82 in teclas) { 
        esquerda.score = 0;
        direita.score = 0;
        resetGame()
    }

    //tecla 'Espaço'    
    if(32 in teclas)  {
        jogo.iniciado = true;
    }
}

function moveBola() {
    //Move horizontalmente
    if(bola.y + bola.altura >= esquerda.y && bola.y <= esquerda.y + esquerda.altura && bola.x <= esquerda.x + esquerda.largura + 9) {
        bola.dirx = 1;
        bola.mod += 0.1;
        jogo.rebatidas++;
    }

    else if(bola.y + bola.altura >= direita.y && bola.y <= direita.y + direita.altura && bola.x + bola.largura >= direita.x + 8) {
        bola.dirx = -1;
        bola.mod += 0.1;
        jogo.rebatidas++;
    }

    //Move verticalmente
    if(bola.y <= 0)  {
        bola.diry = 1;
    }

    else if(bola.y + bola.altura >= canvas.height) {
        bola.diry = -1;
    }

    bola.x += (bola.speed + bola.mod) * bola.dirx;
    bola.y += (bola.speed + bola.mod) * bola.diry;
    console.log(bola.speed + bola.mod)

    //Se a bola passar do bloco da esquerda
    if(bola.x - bola.largura/2 < esquerda.x + esquerda.largura/2) {
        //Player 2 ganhou
        increaseScore("p2")
        newGame()
    }

    //Se a bola passar do bloco da direita
    else if(bola.x + bola.largura/2 > direita.x + direita.largura){
        //Player 1 ganhou
        increaseScore("p1")
        newGame();

    }
}

function increaseScore(winner) {
    if(winner == "p1")
    esquerda.score++;

    if(winner == "p2")
        direita.score++;
}

function newGame() {
    //Volta a posição inicial
    esquerda.y = (canvas.height / 2) - 80,
    direita.y = esquerda.y
    bola.x = (canvas.width / 2) - 10,
    bola.y = (canvas.height / 2) - 10,
    bola.mod = 0;
    bola.diry = 0.6;
    jogo.rebatidas = 0;
}

function resetGame() {
    esquerda.score = 0;
    direita.score = 0;
    newGame()
    jogo.iniciado = false;
}

function desenha() {
    //Limpa o canvas atual
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    movePlayer()
    if(jogo.iniciado == true) {
        moveBola()
    }
    // players()

    //Estilo dos desenhos --> cor branca
    ctx.fillStyle = "white";

    //Renderiza o jogador da esquerda 
    ctx.fillRect(esquerda.x, esquerda.y, esquerda.largura, esquerda.altura);
    
    //Renderiza o jogador da direita 
    ctx.fillRect(direita.x, direita.y, direita.largura, direita.altura);

    //Renderiza a bola 
    ctx.beginPath();
    ctx.arc(bola.x, bola.y, 10, 0, Math.PI * 2, true); 
    ctx.stroke();
    ctx.fill();
    
    //Determina a fonte utilizada dentro do canvas
    ctx.font = "20px Arial";

    //Renderiza o placar do player 1
    let scoreP1 = `${esquerda.name}: ${esquerda.score}`
    ctx.fillText(scoreP1, 50, 30)

    //Renderiza o placar do player 2
    let scoreP2 = `${direita.name}: ${direita.score}`
    ctx.fillText(scoreP2, canvas.width - 150, 30)

    //Renderiza a quantidade total de rebatidas
    ctx.fillStyle = "red"
    ctx.fillText("Rebatidas: " + jogo.rebatidas, (canvas.width/2) - 70, 30)
}
//Chama a função desenha a cada 10 milissegundos
setInterval(desenha, 10)

/////////////////////////////////////////MODAL FIM///////////////////////////////////////////////////////
const playAgainBtn = document.querySelector("button#playAgainBtn")
playAgainBtn.addEventListener("click", playAgain)

function playAgain() {
    document.querySelector("#modalInicio").style.display = "block";

    document.querySelector("#modalFim").style.display = "none";
}