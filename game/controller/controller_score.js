function redirect() {
    getUserName();
    window.location.href='../score/score_board.html';
}

function getUserName() {
    var user = document.getElementById("textbox-playerName").value;
    localStorage.setItem('gameFinishScoreUser', user);
}

function kvUserScoreToTable() {
    var user = localStorage.getItem('gameFinishScoreUser');
    var score = localStorage.getItem('gameFinishScore');
    var dCnt = localStorage.getItem('gameFinishDCnt');

    var scoreBoard = document.getElementById("scoreBoard");
    var row = scoreBoard.insertRow(1);
    var cellUsername = row.insertCell(0);
    var cellScore = row.insertCell(1);
    var cellDeathCount = row.insertCell(2);

    cellUsername.innerHTML = user;
    cellScore.innerHTML = score;
    cellDeathCount.innerHTML = dCnt;
}

function newGame() {
    window.location.href='../../index.html';
}