var colors = [];
for (var i = 0; i < 10; i++) {
  colors.push('square-' + i);
}

var gameSquares = [];
var score =0;

var firstSquare = null;
const TIEMPO_DEL_JUEGO = 30;

// Obtener el elemento del cronómetro
const timer = document.getElementById("tiempo");
// Establecer el tiempo inicial en 30 segundos
let timeLeft = TIEMPO_DEL_JUEGO;
var countdown;

var resetButton = document.getElementById("reset-button");


function GameSquare(el, color) {
  this.el = el;
  this.isOpen = false;
  this.isLocked = false;
  this.el.addEventListener("click", this, false);
  this.setColor(color); 
}

GameSquare.prototype.handleEvent = function(e) {
  switch (e.type) {
    case "click":
      if (this.isOpen || this.isLocked) {
        return;
      }
      this.isOpen = true;
      this.el.classList.add('flip');
      checkGame(this); // <- check the game here!
  }
}

GameSquare.prototype.reset = function() {
  this.isOpen = false;
  this.isLocked = false;
  this.el.classList.remove('flip');
}

GameSquare.prototype.lock = function() {
  this.isLocked = true;
  this.isOpen = true;
}

GameSquare.prototype.setColor = function(color) {
  this.el.children[0].children[1].classList.remove(this.color);
  this.color = color;
  this.el.children[0].children[1].classList.add(color);
}

var comenzar = document.getElementById("comenzar");
comenzar.addEventListener("click", function(event) {
  document.getElementById("pantalla-inicial").style.display = "none";
  document.getElementById("pantalla-juego").style.display = "block";
  setupGame();
  largarTiempo();
  
});

function setupGame() {
  var array = document.getElementsByClassName("game-square");
  var randomColors = getSomeColors();             // Get an array of 8 random color pairs
  for (var i = 0; i < array.length; i++) {  
    var index = random(randomColors.length);      // Get a random index
    var color = randomColors.splice(index, 1)[0]; // Get the color at that index
    // Use that color to initialize the GameSquare
    gameSquares.push(new GameSquare(array[i], color));
  }
  
}

function random(n) {
  return Math.floor(Math.random() * n);
}

function getSomeColors() {
  var colorscopy = colors.slice();
  var randomColors = [];
  for (var i = 0; i < 8; i++) {
    var index = random(colorscopy.length);
    randomColors.push(colorscopy.splice(index, 1)[0]);
  }
  return randomColors.concat(randomColors.slice());
}

function checkGame(gameSquare) {
  if (firstSquare === null) {
    firstSquare = gameSquare;
    return
  }

  if (firstSquare.color === gameSquare.color) {
    firstSquare.lock();
    gameSquare.lock();
    score++;

  } else {
    var a = firstSquare;
    var b = gameSquare;
    setTimeout(function() {
      a.reset();
      b.reset();
      firstSquare = null;
    }, 400);
  }
  firstSquare = null;
}

function randomizeColors() {
  var randomColors = getSomeColors();
  gameSquares.forEach(function(gameSquare) {
    var color = randomColors.splice(random(randomColors.length), 1)[0];
    gameSquare.setColor(color);
  });
}


function clearGame() {
  gameSquares.forEach(function(gameSquare) {
    gameSquare.reset();
    
  });
  setTimeout(function() {
    randomizeColors();
  }, 500);
  timeLeft = TIEMPO_DEL_JUEGO;
  timer.innerText = timeLeft;
  score=0;
    document.getElementById("pantalla-juego").style.display = "block";
      document.getElementById("pantalla-final").style.display = "none";

      largarTiempo();

}

resetButton.addEventListener("click", clearGame,false);

// Crear la función que se encargará de actualizar el cronómetro cada segundo
function largarTiempo(){
  countdown = setInterval(() => {
    // Restar un segundo al tiempo restante
    timeLeft--;
  
    // Actualizar el texto del cronómetro con el tiempo restante
    timer.innerText = timeLeft;
  
    // Si el tiempo llega a 0, detener el cronómetro
    if (timeLeft < 0) {
      clearInterval(countdown);
      mostrarPantallaFinal();
    }
  }, 1000);
}

function mostrarPantallaFinal(){
  document.getElementById("acertadas").textContent = score;
  document.getElementById("score").textContent = (score*100)/8 + "% de acierto";
  document.getElementById("pantalla-juego").style.display =  "none";
  document.getElementById("pantalla-final").style.display =  "block";
}


document.getElementById("pantalla-juego").style.display = "none";
document.getElementById("pantalla-final").style.display =  "none";

