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
    document.querySelector("h1.title").style.display = "none"
}
function showModalIinicio() {
    document.querySelector("#modalInicio").style.display = "";
    document.querySelector("h1.title").style.display = ""

    namePlayer.value = ""
}


const divPlayer = document.querySelector("div.playerDiv")
const namePlayer = divPlayer.querySelector("input")

var jogoIniciado = false;


const startGameBtn = document.querySelector("button#startGameBtn")
startGameBtn.addEventListener("click", startGame)

function startGame() {

    if(namePlayer.value == "" || namePlayer.value == " ") {
        $(function() {
            $("#dialogPlayer").dialog(dialogOptions);
        });
    } 
    else {
        mostrarCanvas();
        hideModal();
        direita.name = namePlayer.value
    }
}
////////////////////////////////////////EFEITOS SONOROS//////////////////////////////////////////////////
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);

    this.play = function(){
      this.sound.play();
    }

    this.stop = function(){
      this.sound.pause();
    }
}

mySound = new sound("assets/sound.mp3")


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

var vidasMax = 3;

var jogo = {
    rebatidas: 0,
    iniciado: jogoIniciado
}

var bola = {
    x: (canvas.width / 2) - 10,
    y: (canvas.height / 2) - 10,
    altura: 20,
    largura: 20,
    dirx: 1, 
    diry: 1,
    speed: 4,
    mod: 0
};

//BOT
var esquerda = {
    x: 15,
    y: (canvas.height / 2) - 80,
    altura: 160,
    largura: 15,
    score: 0,
    speed: 10,
    name: "BOT"
};

//Player
var direita = {
    x: canvas.width - 30,
    y: (canvas.height / 2) - 80,
    altura: 160,
    largura: 15,
    score: 0,
    max_score: 0,
    vidas: vidasMax,
    speed: 10,
    name: "Player"
};

//Ouvidor de eventos para quando uma tecla for pressionada
document.addEventListener("keydown", function(e) {
    teclas[e.keyCode] = true;
})

document.addEventListener("keyup", function(e) {
    delete teclas[e.keyCode];
})

canvas.addEventListener("click", function(e) {
    jogo.iniciado = true;
})

function movePlayer() {
    //move o BOT
    esquerda.y = bola.y - (esquerda.altura/2)
    

    //tecla 'W'    
    if(87 in teclas && direita.y > 0) 
        direita.y -= direita.speed;

    //tecla 'S'
    if(83 in teclas && direita.y + direita.altura < canvas.height)
        direita.y += direita.speed;

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
}

function moveBola() {
    direcao = Math.random();

    //Move horizontalmente
    if(bola.y + bola.altura >= esquerda.y && bola.y <= esquerda.y + esquerda.altura && bola.x <= esquerda.x + esquerda.largura + 9) {
        bola.dirx = direcao < 0.5 && jogo.rebatidas < 10 ? 1 * 0.6 : 1 * direcao;

        bola.mod += 0.3;
        jogo.rebatidas++;

        som = new sound("assets/sound.mp3")
        som.play();
    }

    else if(bola.y + bola.altura >= direita.y && bola.y <= direita.y + direita.altura && bola.x + bola.largura >= direita.x + 8) {
        bola.dirx = direcao < 0.5 && jogo.rebatidas < 10 ? -1 * 0.6 : -1 * direcao;

        bola.mod += 0.4;
        jogo.rebatidas++;

        som = new sound("assets/sound.mp3")
        som.play();
    }

    //Move verticalmente
    if(bola.y <= 0)  {
        bola.diry = 1;
        som = new sound("assets/sound.mp3")
        som.play();

    }

    else if(bola.y + bola.altura >= canvas.height) {
        bola.diry = -1;
        som = new sound("assets/sound.mp3")
        som.play();

    }

    bola.x += (bola.speed + bola.mod) * bola.dirx;
    bola.y += (bola.speed + bola.mod) * bola.diry;

    //Se a bola passar do bloco da direita
    if(bola.x + bola.largura/2 > direita.x + direita.largura){
        //BOT ganhou
        increaseScore("bot")
        newGame();
    }
}

function increaseScore(winner) {
    if(winner == "bot") {
        esquerda.score++;
        direita.vidas--;

        if(direita.max_score < jogo.rebatidas) {
            direita.max_score = jogo.rebatidas;
        }

        if(direita.vidas == 0) {
            // salvarPontuacao(direita);
            showModalConfirm(direita)
            jogo.iniciado = false;
        }
    }

    if(winner == "player") {
        direita.score++;
    }
}

function newGame() {
    //Volta a posição inicial
    esquerda.y = (canvas.height / 2) - 80,
    direita.y = esquerda.y
    bola.x = (canvas.width / 2) - 10,
    bola.y = (canvas.height / 2) - 10,
    bola.mod = 0;
    bola.diry = 0.6;
    bola.dirx = 1;
    jogo.rebatidas = 0;
}

function resetGame() {
    esquerda.score = 0;
    direita.score = 0;
    direita.vidas = vidasMax;
    direita.max_score = 0;
    newGame()
    jogo.iniciado = false;
}

function desenha() {
    //Limpa o canvas atual
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if(jogo.iniciado == true) {
        moveBola()
        movePlayer()
    }

    //Estilo dos desenhos --> cor branca
    ctx.fillStyle = "white";

    //Renderiza o BOT (jogador da esquerda) 
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

    //Renderiza o placar do BOT
    ctx.fillText("BOT", 20, 30)

    //Renderiza as vidas do player 
    const image = document.getElementById('image');

    for(let i=1; i <= direita.vidas; i++) {
        ctx.drawImage(image, canvas.width - (40*i), 15);
    }

    //Renderiza a quantidade total de rebatidas
    ctx.fillStyle = "red"
    ctx.font = "24pt Arial";
    ctx.fillText(jogo.rebatidas, (canvas.width/2), 30)
}
//Chama a função desenha a cada 10 milissegundos
setInterval(desenha, 10)

/////////////////////////////MODAL CONFIRMAR PONTUAÇÃO////////////////////////////////////////////////////
function currentDate() {
    var today = new Date();
    var dia = String(today.getDate()).padStart(2, '0');
    var mes = String(today.getMonth() + 1).padStart(2, '0'); 
    var ano = today.getFullYear();
    var hora = String(today.getHours()).padStart(2, '0');
    var min = String(today.getMinutes()).padStart(2, '0');
    var sec = String(today.getSeconds()).padStart(2, '0');

    today = `${dia}/${mes}/${ano} - ${hora}:${min}:${sec}`

    // today = dd + '/' + mm + '/' + yyyy;
    
    return today;
}

const allPlayers = JSON.parse(localStorage.getItem("allPlayers"));
var arrayPlayers;

if(allPlayers == null) {
    arrayPlayers = [];
}
else {
    arrayPlayers = allPlayers;
} 

var newPlayer = {}
function showModalConfirm(player) {
    newPlayer = {
        name: player.name,
        score: player.max_score,
        date: currentDate()
    }

    canvas.style.display = "none"
    document.querySelector("#modalConfirm").style.display = "block";

    construirTabelaConfirmacao(newPlayer);
}

const dontSaveScoreBtn = document.querySelector("button#dontSaveScoreBtn")
dontSaveScoreBtn.addEventListener("click", dontSaveScore)

const saveScoreBtn = document.querySelector("button#saveScoreBtn")
saveScoreBtn.addEventListener("click", () => {
    saveScore(newPlayer)
})

function construirTabelaConfirmacao(player) {
    const tableConfirm = document.querySelector("#modalConfirm table")
    const tbody = tableConfirm.querySelector('tbody')
    
    const row = document.createElement("tr")

    const nameCell = document.createElement("th")
    nameCell.innerHTML = player.name;

    const scoreCell = document.createElement("td")
    scoreCell.innerHTML = player.score

    const dateCell = document.createElement("td")
    dateCell.innerHTML = player.date

    row.append(nameCell, scoreCell, dateCell)
    
    tbody.innerHTML = ""

    tbody.appendChild(row)
}


/////////////////////////////////////////MODAL-FIM///////////////////////////////////////////////////////
function dontSaveScore() {
    document.querySelector("#modalConfirm").style.display = "none";

    document.querySelector("#modalFim").style.display = "block";
    construirTabela();
}

function saveScore(newPlayer) {
    document.querySelector("#modalConfirm").style.display = "none";

    document.querySelector("#modalFim").style.display = "block";

    arrayPlayers.push(newPlayer)

    setLocalStorage(arrayPlayers)
    construirTabela();
}

const playAgainBtn = document.querySelector("button#playAgainBtn")
playAgainBtn.addEventListener("click", playAgain)

function playAgain() {
    showModalIinicio();

    document.querySelector("#modalFim").style.display = "none";

    resetConfig();
}

function resetConfig() {
    direita.vidas = vidasMax;
    direita.score = 0;
    jogo.rebatidas = 0;
}

function setLocalStorage(arrayPlayers) {
    localStorage.setItem("allPlayers", JSON.stringify(arrayPlayers));
}


function construirTabela() {
    const table = document.querySelector("table")
    const tbody = table.querySelector('tbody')
    const rows = []
    
    arrayPlayers.forEach(player => {
        const row = document.createElement("tr")

        const nameCell = document.createElement("th")
        nameCell.innerHTML = player.name

        const scoreCell = document.createElement("td")
        scoreCell.innerHTML = player.score

        const dateCell = document.createElement("td")
        dateCell.innerHTML = player.date

        row.append(nameCell, scoreCell, dateCell)
        rows.push(row)
    });

    tbody.innerHTML = ""

    rows.forEach(element => {
        tbody.appendChild(element)
    })
}