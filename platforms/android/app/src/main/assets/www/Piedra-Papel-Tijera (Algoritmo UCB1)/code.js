

var acciones = {

    0: 'PIEDRA',
    1: 'PAPEL',
    2: 'TIJERA'

}

var TotalActions;
var count;
var score;
var UCB1Scores;
var numAction;
var lastActions;
var scorePlayer;
var scoreIA;

var resultSheet = [

    //PIEDRA  PAPEL  TIJERA 
    [0, -1, 1], //ROCK
    [1, 0, -1], //PAPEL
    [-1, 1, 0]  //TIJERAS

];

init();

function init(){

    TotalActions = 0;
    scorePlayer = 0;
    scoreIA = 0;
    numAction = [acciones.PIEDRA, acciones.PAPEL, acciones.TIJERA];
    UCB1Scores=[];
    count = [];
    score = [];
    for(let i = 0; i < numAction.length; i++)
    {
        count[i] = 0;
        score[i] = 0;
    }

}

function play()
{

    var result = getNextActionUCB1();

    
    $("#EleccionAI").removeClass();
    $("#EleccionAI").addClass("Eleccion");


    if(result == 0)
        $("#EleccionAI").addClass("PIEDRA");
    else  if(result == 1)
         $("#EleccionAI").addClass("PAPEL");
    else 
        $("#EleccionAI").addClass("TIJERAS");


    return result;

}


function getNextActionUCB1()
{

    //Prueba todas las acciones que no ha probado
    for(let i = 0; i < numAction.length; i++)
    {
        if(count[i] == 0)
        {
            lastActions = i;
            return lastActions;
        }
    }

    //Si ya ha probado todas la acciones entonces aplica UCB1.
    let best = -1;
    let bestScore =  -10000;
    let tempScore = 0;

    for(let i = 0; i < numAction.length; i++)
    {
        tempScore = UCB1(score[i] / (count[i]), count[i], TotalActions);
        UCB1Scores[i] = tempScore;
        if(tempScore > bestScore)
        {
            best = i;
            bestScore = tempScore;
        }
    }

    lastActions = best;
    return lastActions;

}

function UCB1(_averageUtility, _count, _totalActions)
{
    return (_averageUtility + Math.sqrt(2 + Math.log10(_totalActions) / _count));
}

function TellOponentAction (action)
{

    TotalActions++;
    score[lastActions] += GetUtility(acciones[lastActions], acciones[action]);
    count[lastActions]++;

}

function GetUtility(_lastAction, _action) {

    return resultSheet[getNumber(_lastAction)][getNumber(_action)];

}

function getNumber(action) {

    for (let i = 0; i < numAction.length; i++) {
        if (acciones[i] == action)
            return i;
    }

    return -1;
}


function SelectOption(_action){
    //DRAW THE SPRITE

    $("#EleccionJugador").removeClass();
    $("#EleccionJugador").addClass("Eleccion");

    if(_action == 0)
        $("#EleccionJugador").addClass("PIEDRA");
    else  if(_action == 1)
         $("#EleccionJugador").addClass("PAPEL");
    else 
        $("#EleccionJugador").addClass("TIJERAS");



    let IaAction = play();

    if(GetUtility(acciones[IaAction], acciones[_action]) == 1)
    {
        $("#WhoWin").removeClass();
        $("#WhoWin").addClass("Winner");
        $("#WhoWin").addClass("red");
        $("#WhoWin").text("Has perdido");

        scoreIA++;

    } else if(GetUtility(acciones[IaAction], acciones[ _action]) == -1)
    {

        $("#WhoWin").removeClass();
        $("#WhoWin").addClass("Winner");
        $("#WhoWin").addClass("green");
        $("#WhoWin").text("Has ganado");

        scorePlayer++;
    }    else
    {
        
        $("#WhoWin").removeClass();
        $("#WhoWin").addClass("Winner");
        $("#WhoWin").addClass("white");
        $("#WhoWin").text("Es empate");

    }

    TellOponentAction(_action);

    $("#Piedra").text("PIEDRA: " + UCB1(score[0] / (count[0]), count[0], TotalActions).toFixed(2));
    $("#Papel").text("PAPEL: " + UCB1(score[1] / (count[1]), count[1], TotalActions).toFixed(2));
    $("#Tijera").text("TIJERA: " + UCB1(score[2] / (count[2]), count[2], TotalActions).toFixed(2));

}
