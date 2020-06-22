var canvas = document.querySelector("#mycanvas");

//Determina que todo o elemento canvas é bidimensional (2D)
var ctx = canvas.getContext("2d");

var teclas = {};

var jogo = {
    rebatidas: 0
}

var bola = {
    x: (canvas.width / 2) - 10,
    y: (canvas.height / 2) - 10,
    altura: 20,
    largura: 20,
    dirx: -1, 
    diry: 1,
    speed: 2,
    mod: 0
};

//Player 1
var esquerda = {
    x: 10,
    y: (canvas.height / 2) - 60,
    altura: 120,
    largura: 30,
    score: 0,
    speed: 10
};

//Player 2
var direita = {
    x: 560,
    y: (canvas.height / 2) - 60,
    altura: 120,
    largura: 30,
    score: 0,
    speed: 10
};

//Ouvidor de eventos para quando uma tecla for pressionada
document.addEventListener("keydown", function(e) {
    teclas[e.keyCode] = true;
})

document.addEventListener("keyup", function(e) {
    delete teclas[e.keyCode];
})

function moveBloco() {
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
    if(bola.y <= 0) 
        bola.diry = 1;

    else if(bola.y + bola.altura >= canvas.height)
        bola.diry = -1;

    bola.x += (bola.speed + bola.mod) * bola.dirx;
    bola.y += (bola.speed + bola.mod) * bola.diry;

    //Se a bola passar do bloco da esquerda
    if(bola.x < esquerda.x + esquerda.largura - 8)
        newGame("player 2")

    //Se a bola passar do bloco da direita
    else if(bola.x + bola.largura > direita.x + 15)
        newGame("player 1")
}

function newGame(winner) {
    if(winner == "player 1")
        esquerda.score++;
    else 
        direita.score++;

    //Volta a posição inicial
    esquerda.y = (canvas.height / 2) - 60
    direita.y = esquerda.y
    bola.y = (canvas.height / 2) - bola.altura / 2
    bola.x = (canvas.width / 2) - bola.largura / 2
    bola.mod = 0;
    jogo.rebatidas = 0;
}

function desenha() {
    //Limpa o canvas atual
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    moveBloco()
    moveBola()

    //Estilo dos desenhos --> cor branca
    ctx.fillStyle = "white";

    //Renderiza o jogador da esquerda 
    ctx.fillRect(esquerda.x, esquerda.y, esquerda.largura, esquerda.altura);
    
    //Renderiza o jogador da direita 
    ctx.fillRect(direita.x, direita.y, direita.largura, direita.altura);

    //Renderiza a bola 
    // ctx.fillRect(bola.x, bola.y, bola.largura, bola.altura);
    ctx.beginPath();
    ctx.arc(bola.x, bola.y, 10, 0, Math.PI * 2, true);  // Olho esquerdo
    ctx.stroke();
    ctx.fill();
    
    //Determina a fonte utilizada dentro do canvas
    ctx.font = "20px Arial";

    //Renderiza o placar do player 1
    ctx.fillText("Player 1: " + esquerda.score, 50, 30)

    //Renderiza o placar do player 2
    ctx.fillText("Player 2: " + direita.score, 450, 30)

    //Renderiza a quantidade total de rebatidas
    ctx.fillStyle = "red"
    ctx.fillText("Rebatidas: " + jogo.rebatidas, 250, 30)
}
//Chama a função desenha a cada 10 milissegundos
setInterval(desenha, 10)