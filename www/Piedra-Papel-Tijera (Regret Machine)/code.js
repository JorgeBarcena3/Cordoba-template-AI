var acciones = {

    0: 'PIEDRA',
    1: 'PAPEL',
    2: 'TIJERA'

}

//  REGRET
var lastAction;
var numAction;
var initialRegret;
var regret;
var chance;

var resultSheet = [

    //PIEDRA  PAPEL  TIJERA 
    [0, -1, 1], //ROCK
    [1, 0, -1], //PAPEL
    [-1, 1, 0]  //TIJERAS

];


init();

function init() {

    initialRegret = 10;
    numAction = [acciones.PIEDRA, acciones.PAPEL, acciones.TIJERA];
    regret = [];
    chance = [];

    for (let i = 0; i < numAction.length; i++) {
        regret[i] = initialRegret;
        chance[i] = 0;
    }

}

function play() {

    var result = getNextActionRM();


    $("#EleccionAI").removeClass();
    $("#EleccionAI").addClass("Eleccion");


    if (result == 0)
        $("#EleccionAI").addClass("PIEDRA");
    else if (result == 1)
        $("#EleccionAI").addClass("PAPEL");
    else
        $("#EleccionAI").addClass("TIJERAS");


    return result;

}


function getNextActionRM() {


    let sum = 0;
    let prob = 0;

    for (let i = 0; i < numAction.length; i++) {
        if (regret[i] > 0)
            sum += regret[i];
    }

    if (sum <= 0) {
        lastAction = Math.floor(Math.random() * 3);
        return lastAction;
    }

    for (let i = 0; i < numAction.length; i++) {
        chance[i] = 0;
        if (regret[i] > 0) {
            chance[i] = regret[i];
        }

        if (i > 0) {
            chance[i] += chance[i - 1];
        }
    }

    if (chance[chance.length - 1] > 0) {
        prob = Math.floor(Math.random() * chance[chance.length - 1]);
        for (let i = 0; i < numAction.length; i++) {
            if (prob < chance[i]) {
                lastAction = i;
                return lastAction;
            }
        }
    }

    //No debe llegar aquí
    console.error("Error al elegir la accion seleccionada")
    lastAction = Math.floor(Math.random() * 3);
    return lastAction;
}


function TellOponentAction(action) {

    for (let i = 0; i < numAction.length; i++) {
        regret[i] += GetUtility(acciones[i], acciones[action]);
        regret[i] -= GetUtility(acciones[lastAction], acciones[action]);
    }
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

function SelectOption(_action) {

    //DRAW THE SPRITE
    $("#EleccionJugador").removeClass();
    $("#EleccionJugador").addClass("Eleccion");

    if (_action == 0)
        $("#EleccionJugador").addClass("PIEDRA");
    else if (_action == 1)
        $("#EleccionJugador").addClass("PAPEL");
    else
        $("#EleccionJugador").addClass("TIJERAS");



    let IaAction = play();

    if (GetUtility(acciones[IaAction], acciones[_action]) == 1) {
        $("#WhoWin").removeClass();
        $("#WhoWin").addClass("Winner");
        $("#WhoWin").addClass("red");
        $("#WhoWin").text("Has perdido");


    } else if (GetUtility(acciones[IaAction], acciones[_action]) == -1) {

        $("#WhoWin").removeClass();
        $("#WhoWin").addClass("Winner");
        $("#WhoWin").addClass("green");
        $("#WhoWin").text("Has ganado");

    } else {

        $("#WhoWin").removeClass();
        $("#WhoWin").addClass("Winner");
        $("#WhoWin").addClass("white");
        $("#WhoWin").text("Es empate");

    }

    TellOponentAction(_action);

    let RegretTotal =
        (regret[0] > 0 ? regret[0] : 0) +
        (regret[1] > 0 ? regret[1] : 0) +
        (regret[2] > 0 ? regret[2] : 0) ;

    $("#Piedra").text("PIEDRA: " + ((regret[0] > 0 ? regret[0] : 0) / RegretTotal * 100).toFixed(0) + "%");
    $("#Papel").text("PAPEL: " + ((regret[1] > 0 ? regret[1] : 0) / RegretTotal * 100).toFixed(0) + "%");
    $("#Tijera").text("TIJERA: " + ((regret[2] > 0 ? regret[2] : 0) / RegretTotal * 100).toFixed(0) + "%");

}
