// Definialom a vasznat es a kontextust
// Elobbi a szinterem lesz.
// Utobbival tudok festeni a vaszonra. (Csinalok tkp. egy CanvasRenderingContext2D peldanyt)
var canvas = document.getElementById("canvas-game");
var context = canvas.getContext("2d");
var clickCounter = 0;

// Beallitom az kezdooldalom hallhato dallamot (peldanYsitok)
// Hangerot szabalYzok
// Inditom a lejatszast
var intro = new Audio('../../../assets/sounds/Rolemusic - He Plays Me The Best Rhythms - Chiptune.mp3');
intro.volume = 0.5;
intro.play();

// Kezdooldal megjelenitese
init();

// Zenek
var LevelSound = new Audio('../../../assets/sounds/Rolemusic_-_07_-_Beach_Wedding_Dance.mp3');
var PlayerObstacleCollisionSound = new Audio('../../../assets/sounds/adcbicycle__17-CC0-FreeSoundCom.wav');
var PlayerBoxCollisionSound = new Audio("../../../assets/sounds/446111__justinvoke__success-jingle-FreeSoundCom.wav");

/**
 * A fomenut megvalosito fuggveny
 * @param e
 */
function init(e) {
    // Beallitom a szovegtulajdonsagokat
    context.font = "32px Times New Roman";
    context.fillStyle = 'white';
    context.fillText("Armand's Obstacle Course", 360, 50);
    // Udvozlo szoveg
    context.font = "24px Consolas";
    context.fillStyle = 'red';
    context.fillText("Remember: Try not to die!", 360, 100);
    // Itt jelzem, hogy mivel kattintson a kezdeshez
    context.font = "24px Consolas";
    context.fillStyle = 'yellow';
    context.fillText("Click LMB to start", 360, 150);
}

// Kezelem az egerkattintast
document.onmousedown = function (event) {

    event = event || window.event;

    // Gomb szamanak lekerese
    var e = event.button;

    // Ha jobb klikk tortent
    if (e === 0) {
        // Novelem a klikkek szamat
        clickCounter++;

        // Ha egy, indulhat a palya
        switch (clickCounter) {
            case 1:
                // Inditom a zenet
                // Leallitom az elozot
                LevelSound.play();
                intro.pause();
                go();
                break;
            default:
                break;
        }
    }
};

// Itt szamitom a pontokat
var sCnt = 0;
// Itt az utkozeseket, halalokat
var dCnt = 0;
// Itt az osszegyujtott dobozokat
var bCnt = 0;

// Jatekos objektuma
function Contestant(X, Y, R, V) {
    // Konstruktor parameterek beallitasa
    this.X = X;
    this.Y = Y;
    this.R = R;
    this.V = V;

    // Ellenorzom a vaszon sarkai es a jatekos objektumanak viszonyat.
    // Igy nem tud elvandorolni a canvas lathato teruletebol
    this.checkCanvasBounds = function () {
        if (contestant.X <= 0) {
            contestant.X += contestant.V;
        }
        if (contestant.Y <= 0) {
            contestant.Y += contestant.V;
        }
        if (contestant.X >= canvas.width - 32) {
            contestant.X -= contestant.V;
        }
        if (contestant.Y >= canvas.height - 32) {
            contestant.Y -= contestant.V;
        }

        //context.fillRect(this.X, this.Y, this.R, this.R);
        //context.strokeStyle;
        //context.lineWidth = 2;
        //context.strokeRect(this.X, this.Y, this.R, this.R);

        context.beginPath();
        context.arc(this.X, this.Y, this.R, 0.2 * Math.PI, 1.8 * Math.PI, false);
        context.lineTo(this.X, this.Y);
        context.closePath();

        context.strokeStyle = "#000000";
        context.stroke();
        context.fillStyle = "#FFFF00";
        context.fill();
    }
}

// Versenyzo peldanya
var contestant = new Contestant(50, 50, 20, 2);

// Biilentyuleutesek
var keys = [];
keys.UP = 38;
keys.LEFT = 37;
keys.RIGHT = 39;
keys.DOWN = 40;

// Billenytuleutesek kezelese
document.body.onkeyup =
    document.body.onkeydown = function (e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        else {
            e.returnValue = false;
        }

        var kc = e.keyCode || e.which;
        keys[kc] = e.type === 'keydown';
    };

    // Jatekos mozgatasa X es Y koordinatak menten
    var moveContestant = function (dx, dy) {

    contestant.X += (dx || 0) * contestant.V;
    contestant.Y += (dy || 0) * contestant.V;
};

// Billenytuleutesek ertelmezese
var contestantMove = function () {
    if (keys[keys.LEFT]) {
        moveContestant(-1, 0);
    }
    if (keys[keys.RIGHT]) {
        moveContestant(1, 0);
    }
    if (keys[keys.UP]) {
        moveContestant(0, -1);
    }
    if (keys[keys.DOWN]) {
        moveContestant(0, 1);
    }
};

// Felveendo doboz
function BoxToCollect(X, Y, W, H) {

    this.X = X;
    this.Y = Y;
    this.W = W;
    this.H = H;

    this.draw = function () {
        context.fillStyle = "blue";
        context.fillRect(this.X, this.Y, this.W, this.H);
        context.strokeStyle;
        context.lineWidth = 2;
        context.strokeRect(this.X, this.Y, this.W, this.H);

        // Jatekossal valo utkozes detektalasa
        if (contestant.X < this.X + this.W &&
            contestant.X + contestant.R > this.X &&
            contestant.Y < this.Y + this.H &&
            contestant.R + contestant.Y > this.Y) {

            // Utkozesnel hangeffekt
            PlayerBoxCollisionSound.play();
            // Doboz eltuntetese
            this.X = 0;
            this.Y = 0;
            this.W = 0;
            this.H = 0;
            // Dobozszamlalo megnovelese
            bCnt++;
        }
    }
}

// Akadaly
function Object(X, Y, W, H) {

    this.X = X;
    this.Y = Y;
    this.W = W;
    this.H = H;

    this.draw = function () {
        context.fillStyle = "red";
        context.fillRect(this.X, this.Y, this.W, this.H);
        context.strokeStyle;
        context.lineWidth = 2;
        context.strokeRect(this.X, this.Y, this.W, this.H);

        // Jatekossal valo utkozes detektalasa
        if (contestant.X < this.X + this.W &&
            contestant.X + contestant.R > this.X &&
            contestant.Y < this.Y + this.H &&
            contestant.R + contestant.Y > this.Y) {

            // Utkozesnel hangeffekt
            PlayerObstacleCollisionSound.play();

            // Resetelem a jatekos poziciojat es novelem a szamlalot
            contestant.X = 24;
            contestant.Y = canvas.height / 2;
            dCnt++;
        }
    }
}

// Hatterkep beallitasa es palya takaritasa
function setBackgroundAndClearLevel() {
    var gameBackgroundImage = new Image();
    gameBackgroundImage.src = "../../../assets/images/checkerboard_HQ.png";
    context.drawImage(gameBackgroundImage, 0, 0, canvas.width, canvas.height);
}

// Aktualis pontallas
function gameScore() {
    context.font = "20px Times New Roman";
    context.fillStyle = 'black';
    context.fillText("☠️", canvas.width - 64, 20);
    context.fillText(dCnt, canvas.width - 64, 50);
    // Dobozok
    context.fillText("⬜️", canvas.width - 64, 80);
    context.fillText(bCnt, canvas.width - 64, 110);
}

// Az aktualis szint szama
function showActualLevelText() {
    context.font = "20px Times New Roman";
    context.fillStyle = 'black';
    context.fillText("Level", canvas.width - 64, canvas.height - 32);
    context.fillText(actualLevel + " of 3", canvas.width - 64, canvas.height - 8);
}

// aktualis szint
var actualLevel = 1;

// A kezdo es palya vege csikok kirajzolasa
function StartStripEndStrip() {
    context.fillStyle = '#00FF00';
    context.fillRect(0, 0, 80, canvas.height);

    context.fillStyle = '#00FF00';
    context.fillRect(canvas.width - 80, 0, 80, canvas.height);
}

// Frissitem a vasznat
function update() {
    setBackgroundAndClearLevel();
    StartStripEndStrip();
    contestant.checkCanvasBounds();
    gameScore();
    showActualLevelText();
}

// Elso palya
function go() {
    var actualLevelInt = setInterval(function () {
        obstacleMove();
        contestantMove();
        // 1ms alatt 60-szor fusson le. 60 FPS kb.
    }, 1000 / 60);

    // Akadalyok kirajzolasa
    function drawObstacle() {
        obstacle.draw();
        obstacle2.draw();
        obstacle3.draw();
        obstacle4.draw();
        obstacle5.draw();
        obstacle6.draw();
        obstacle7.draw();
        obstacle8.draw();
        obstacle9.draw();
        obstacle10.draw();
    }

    // Dobozok letrehozasa
    var box = new BoxToCollect(Math.floor(Math.random() * 800) + 100, Math.floor(Math.random() * 500) + 100, 25, 25);
    var box2 = new BoxToCollect(Math.floor(Math.random() * 800) + 100, Math.floor(Math.random() * 500) + 100, 25, 25);
    var box3 = new BoxToCollect(Math.floor(Math.random() * 800) + 100, Math.floor(Math.random() * 500) + 100, 25, 25);
    var box4 = new BoxToCollect(Math.floor(Math.random() * 800) + 100, Math.floor(Math.random() * 500) + 100, 25, 25);

    // Dobozok kirajzolasa
    function drawBox() {
        box.draw();
        box2.draw();
        box3.draw();
        box4.draw();
    }

    // Objektumok pozicioja
    // X: X koordinata
    // Y: Y koordinata
    // W: szelesseg
    // H: magasag
    var obstacle = new Object(100, 200, 25, 25);
    var obstacle2 = new Object(200, 200, 25, 25);
    var obstacle3 = new Object(320, 300, 25, 25);
    var obstacle4 = new Object(440, 400, 25, 25);
    var obstacle5 = new Object(560, 500, 25, 25);
    var obstacle6 = new Object(670, 320, 25, 25);
    var obstacle7 = new Object(780, 100, 25, 25);
    var obstacle8 = new Object(760, canvas.height / 2, 25, 25);
    var obstacle9 = new Object(780, 10, 25, 25);
    var obstacle10 = new Object(710, canvas.height - 35, 25, 25);

    // Irany flag
    var direction1 = 9;
    var direction2 = 9;

    // Akadaly mozgatasa
    function obstacleMove() {
        obstacle.Y -= direction1;
        obstacle2.Y += direction1;
        obstacle3.Y -= direction1;
        obstacle4.Y += direction1;
        obstacle5.Y -= direction1;
        obstacle6.Y += direction1;
        obstacle7.Y -= direction1;

        obstacle8.X -= direction2;
        obstacle9.X -= direction2;
        obstacle10.X -= direction2;

        if (obstacle.Y <= canvas.height - canvas.height) {
            direction1 = -7;
            obstacle.Y -= direction1;
        }

        if (obstacle.Y >= canvas.height - 10) {
            direction1 = 7;
            obstacle.Y -= direction1;
        }
        if (obstacle8.X <= 100) {
            direction2 = -7;
            obstacle8.X -= direction2;
        }
        if (obstacle8.X >= canvas.width - 150) {
            direction2 = 7;
            obstacle8.X -= direction2;
        }

        // Frissitem a vasznat
        // Kirajzolom az akadalyokat
        update();
        drawObstacle();
        // meg a dobozokat
        drawBox();

        // Amennyiben a palya vegehez ert a versenyzo
        if (contestant.X >= canvas.width - 100) {
            contestant.X = 1;
            contestant.Y = canvas.height / 2;
            sCnt += 1337;
            clearInterval(actualLevelInt);
            setBackgroundAndClearLevel();

            nextLevel();
            actualLevel++;
        }
    }

}

// Kovetkezo playa
function nextLevel() {
    // Beallitom a szovegtulajdonsagokat
    context.font = "32px Times New Roman";
    context.fillStyle = 'white';
    context.fillText("Oh, hello there!", 360, 50);
    // Itt jelzem, hogy mivel kattintson a kezdeshez
    context.font = "24px Consolas";
    context.fillStyle = 'yellow';
    context.fillText("Believe me, the next level will be harder!", 360, 100);

    // Kesleltetve indul (4s)
    setTimeout(level2, 4000);
}

// Masodik szint
function level2() {

    update();

    var lvl2 = setInterval(function () {
        moveObstacle();
        contestantMove();

    }, 1000 / 60);

    // Dobozok letrehozasa
    var box = new BoxToCollect(Math.floor(Math.random() * 800) + 100, Math.floor(Math.random() * 500) + 100, 25, 25);
    var box2 = new BoxToCollect(Math.floor(Math.random() * 800) + 100, Math.floor(Math.random() * 500) + 100, 25, 25);
    var box3 = new BoxToCollect(Math.floor(Math.random() * 800) + 100, Math.floor(Math.random() * 500) + 100, 25, 25);
    var box4 = new BoxToCollect(Math.floor(Math.random() * 800) + 100, Math.floor(Math.random() * 500) + 100, 25, 25);

    // Dobozok kirajzolasa
    function drawBox() {
        box.draw();
        box2.draw();
        box3.draw();
        box4.draw();
    }

    // Akadalyok a masodik szinthez
    var obstacle = new Object(180, 200, 25, 25);
    var obstacle2 = new Object(680, 200, 25, 25);
    var obstacle10 = new Object(730, 200, 25, 25);
    var obstacle11 = new Object(780, 200, 25, 25);
    var obstacle12 = new Object(820, 200, 25, 25);

    var obstacle13 = new Object(580, 200, 25, 25);

    var obstacle3 = new Object(150, 70, 400, 10);
    var obstacle4 = new Object(150, canvas.height - 70, 400, 10);
    var obstacle5 = new Object(150, 70, 10, canvas.height - 140);
    var obstacle6 = new Object(630, 0, 10, 170);
    var obstacle7 = new Object(630, canvas.height - 170, 10, 170);
    var obstacle8 = new Object(630 - 400, 170, 410, 10);
    var obstacle9 = new Object(630 - 400, canvas.height - 170, 400, 10);

    // Ki is rajzolom oket
    function drawObst() {

        obstacle.draw();
        obstacle2.draw();
        obstacle10.draw();
        obstacle11.draw();
        obstacle12.draw();
        obstacle13.draw();

        obstacle3.draw();
        obstacle4.draw();
        obstacle5.draw();
        obstacle6.draw();
        obstacle7.draw();

        obstacle8.draw();
        obstacle9.draw();
    }

    var directionLevel2 = 8;


    function moveObstacle() {
        obstacle.Y -= directionLevel2;
        obstacle2.Y += directionLevel2;
        obstacle10.Y -= directionLevel2;
        obstacle11.Y += directionLevel2;
        obstacle12.Y -= directionLevel2;
        obstacle13.Y -= directionLevel2;

        if (obstacle.Y <= canvas.height - canvas.height) {
            directionLevel2 = -8;
            obstacle.Y -= directionLevel2;
        }

        if (obstacle.Y >= canvas.height - 10) {
            directionLevel2 = 8;
            obstacle.Y -= directionLevel2;
        }

        update();
        drawObst();
        drawBox();

        // A cel eleresekor a kovetkezo szintre lepek
        if (contestant.X >= canvas.width - 100) {
            contestant.X = 1;
            contestant.Y = canvas.height / 2;

            sCnt += 1500;

            clearInterval(lvl2);
            setBackgroundAndClearLevel();
            nextLevel2();

            actualLevel++;
        }
    }

}

function nextLevel2() {
    // Itt jelzem, hogy mivel kattintson a kezdeshez
    context.font = "24px Consolas";
    context.fillStyle = 'red';
    context.fillText("The end is near!", 360, 100);

    setTimeout(level3, 4000);

}

function level3() {
    update();

    var lvl3 = setInterval(function () {

        moveFinal();
        contestantMove();

    }, 1000 / 60);

    // Dobozok letrehozasa
    var box = new BoxToCollect(Math.floor(Math.random() * 800) + 100, Math.floor(Math.random() * 500) + 100, 25, 25);
    var box2 = new BoxToCollect(Math.floor(Math.random() * 800) + 100, Math.floor(Math.random() * 500) + 100, 25, 25);
    var box3 = new BoxToCollect(Math.floor(Math.random() * 800) + 100, Math.floor(Math.random() * 500) + 100, 25, 25);
    var box4 = new BoxToCollect(Math.floor(Math.random() * 800) + 100, Math.floor(Math.random() * 500) + 100, 25, 25);

    // Dobozok kirajzolasa
    function drawBox() {
        box.draw();
        box2.draw();
        box3.draw();
        box4.draw();
    }

    // Objektumok az utolso palyahoz
    var final = new Object(170, 200, 25, 25);
    var final8 = new Object(215, 200, 25, 25);

    var final9 = new Object(420, 200, 25, 25);
    var final10 = new Object(465, 200, 25, 25);

    var final11 = new Object(670, 200, 25, 25);
    var final12 = new Object(715, 200, 25, 25);

    var final13 = new Object(canvas.width / 2, canvas.height / 2, 25, 25);

    var final2 = new Object(200, 0, 10, 185);
    var final3 = new Object(200, canvas.height - 170, 10, 170);

    var final4 = new Object(450, 0, 10, 185);
    var final5 = new Object(450, canvas.height - 170, 10, 170);

    var final6 = new Object(700, 0, 10, 185);
    var final7 = new Object(700, canvas.height - 170, 10, 170);

    // Kirajzolom oket
    function drawFinal() {
        final.draw();
        final8.draw();
        final9.draw();
        final10.draw();
        final11.draw();
        final12.draw();
        final13.draw();

        final2.draw();
        final3.draw();
        final4.draw();
        final5.draw();
        final6.draw();
        final7.draw();
    }

    // Irany flagek az utolso palyahoz
    var directionLevel31 = 8;
    var directionLevel32 = 8;

    // Mozgassuk oket
    function moveFinal() {
        final.Y -= directionLevel31;
        final8.Y += directionLevel31;

        final9.Y -= directionLevel31;
        final10.Y += directionLevel31;

        final11.Y -= directionLevel31;
        final12.Y += directionLevel31;

        final13.X -= directionLevel32;

        if (final.Y <= canvas.height - canvas.height) {
            directionLevel31 = -8;
            final.Y -= directionLevel31;
        }
        if (final.Y >= canvas.height - 25) {
            directionLevel31 = 8;
            final.Y -= directionLevel31;
        }

        if (final13.X <= 100) {
            directionLevel32 = -8;
            final13.X -= directionLevel32;
        }
        if (final13.X >= canvas.width - 150) {
            directionLevel32 = 8;
            final13.X -= directionLevel32;
        }

        update();
        drawFinal();
        drawBox();

        if (contestant.X >= canvas.width - 100) {

            sCnt += 2000;
            dCnt++;

            clearInterval(lvl3);
            setBackgroundAndClearLevel();
            gameFinish();
        }
    }
}

// Jatek vege uzenet
function gameFinish() {
    var finalScore = Math.ceil(sCnt / dCnt);

    context.font = "40px Arial";
    context.fillStyle = 'red';
    context.fillText("Successfully survived the game!", 310, 50);

    context.fillStyle = 'black';
    context.fillText("Final score:", 355, 200);

    context.fillText(finalScore.toString(), 440, 250);

    context.font = "40px Arial";
    context.fillStyle = 'black';
    context.fillText("Redirecting to high scores!", 200, 100);

    // Itt lerakom localStorage-be a pontot
    localStorage.setItem('gameFinishScore', finalScore.toString());
    // Illetve a dCnt erteket
    localStorage.setItem('gameFinishDCnt', dCnt.toString());
    setTimeout(redir, 4000);
}

function redir() {
    window.location.href = "../score/score_board_input.html";
}


