let TURNO = "MIN"; //MIN ES EL JUGADOR
let TABLERO = [
    "undefined", "undefined", "undefined",
    "undefined", "undefined", "undefined",
    "undefined", "undefined", "undefined"
];


function crearTablero() {
    let tablero = $(".GameContainer")[0];
    Array.from(tablero.children).forEach(element => {
        element.classList = [];
        if (parseInt(element.id, 10) % 2 == 0) {
            element.classList.add("game-field");
            element.classList.add("blue");
        } else {
            element.classList.add("game-field");
            element.classList.add("green");
        }

    });
}

function selectBox(box, isMachine = false) {


    if (TURNO === "MIN" || (TURNO === "MAX" && isMachine)) {
        let object = $("#" + box)[0];

        if (object.classList.contains("blue"))
            object.classList.remove("blue");
        else if (object.classList.contains("green"))
            object.classList.remove("green");
        else
            return false;

        let numeroCasilla = parseInt(box, 10);

        if (TURNO === "MIN") { //TURNO DEL JUGADOR
            TABLERO[numeroCasilla] = "MIN";
            object.classList.add("purple");
            TURNO = "MAX";
        } else {
            TABLERO[numeroCasilla] = "MAX";
            object.classList.add("orange");
            TURNO = "MIN";
        }

        if (checkIfGanador()) {
            mostrarGanador();
            acabarElJuego();
            return true;
        }

        if (TURNO === "MAX") {
            turnoDeMAX(TABLERO)

        }
    }

}


function acabarElJuego() {
    TURNO = "";
}

function restart() {
    TURNO = "MIN"; //MIN ES EL JUGADOR
    TABLERO = [
        "undefined", "undefined", "undefined",
        "undefined", "undefined", "undefined",
        "undefined", "undefined", "undefined"
    ];

    $("#TextoFinal")[0].innerText = "¡Tres en raya!";
    crearTablero();
    
    let empezar = getRandomArbitrary(1, 3);
    if (empezar == 1) {
        let posicion = getRandomArbitrary(0, 9);
        TURNO = "MAX"; //MIN ES EL JUGADOR
        selectBox(posicion, true);
    }


}

function mostrarGanador() {
    let panel = $("#TextoFinal")[0];
    if (TURNO === "MIN") //GANA MAX
        panel.innerText = "Ha ganado la Máquina";
    else if (TURNO === "MAX") //GANA MIN
        panel.innerText = "Has ganado tú";
    else
        panel.innerText = "Hemos empatado";

}

function checkIfGanador() {

    let comprobar = "MAX"; // Por defecto compruebo para MAX
    if (TURNO === "MAX") //Compruebo para MIN
        comprobar = "MIN";
    if (
        (TABLERO[2] === comprobar && TABLERO[5] === comprobar && TABLERO[8] === comprobar) ||
        (TABLERO[0] === comprobar && TABLERO[1] === comprobar && TABLERO[2] === comprobar) ||
        (TABLERO[3] === comprobar && TABLERO[4] === comprobar && TABLERO[5] === comprobar) ||
        (TABLERO[6] === comprobar && TABLERO[7] === comprobar && TABLERO[8] === comprobar) ||
        (TABLERO[0] === comprobar && TABLERO[3] === comprobar && TABLERO[6] === comprobar) ||
        (TABLERO[1] === comprobar && TABLERO[4] === comprobar && TABLERO[7] === comprobar) ||
        (TABLERO[0] === comprobar && TABLERO[4] === comprobar && TABLERO[8] === comprobar) ||
        (TABLERO[6] === comprobar && TABLERO[4] === comprobar && TABLERO[2] === comprobar)
    ) {
        return true
    }

    if (!TABLERO.includes("undefined")) //HEMOS EMPATADO
    {
        TURNO = "";
        return true;
    }

    return false;
}

function turnoDeMAX(_tablero) {

    var movimientoGanador = MINIMAX(_tablero, 1, 0);

    setTimeout(function () {
        selectBox(movimientoGanador.index, true);
    }, 500);

}

/**
 * Returns a random integer between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function esGanador(_tablero, _turno) {

    let comprobar = _turno == 1 ? "MAX" : "MIN"; // Por defecto compruebo para MAX

    if (
        (_tablero[2] === comprobar && _tablero[5] === comprobar && _tablero[8] === comprobar) ||
        (_tablero[0] === comprobar && _tablero[1] === comprobar && _tablero[2] === comprobar) ||
        (_tablero[3] === comprobar && _tablero[4] === comprobar && _tablero[5] === comprobar) ||
        (_tablero[6] === comprobar && _tablero[7] === comprobar && _tablero[8] === comprobar) ||
        (_tablero[0] === comprobar && _tablero[3] === comprobar && _tablero[6] === comprobar) ||
        (_tablero[1] === comprobar && _tablero[4] === comprobar && _tablero[7] === comprobar) ||
        (_tablero[0] === comprobar && _tablero[4] === comprobar && _tablero[8] === comprobar) ||
        (_tablero[6] === comprobar && _tablero[4] === comprobar && _tablero[2] === comprobar)
    ) {
        return true
    }

    return false;
}


function generarSucesores(_tablero) {

    let sucesores = [];

    for (let i = 0; i < _tablero.length; i++) {
        if (_tablero[i] === "undefined") {
            sucesores.push(i);
        }
    }

    return sucesores;


}

/**
 * Algoritmo de MINMAX para obtener la mejor jugada
 * TURNO == 1 -- MAX - TURNO == 2 -- MIN
 */
function MINIMAX(_tablero, _turno, _nivel) {

    let sucesores = generarSucesores(_tablero, _turno);
    //Casos finales
    if (esGanador(_tablero, 1)) //AI WIN
        return { score: 10 - _nivel };
    else if (esGanador(_tablero, 2)) //PLAYER WIN
        return { score: -10 + _nivel };
    else if (sucesores.length == 0)
        return { score: 0 };

    let moves = [];

    for (let i = 0; i < sucesores.length; i++) {
        var move = {};
        move.index = sucesores[i];
        _tablero[sucesores[i]] = _turno == 1 ? "MAX" : "MIN";

        if (_turno == 1) {

            let valor = MINIMAX(_tablero, 2, _nivel + 1);
            move.score = valor.score;

        } else {

            let valor = MINIMAX(_tablero, 1, _nivel + 1);
            move.score = valor.score;

        }

        _tablero[sucesores[i]] = "undefined";

        moves.push(move);

    }

    var mejorMovimiento;
    if (_turno == 1) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                mejorMovimiento = i;
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                mejorMovimiento = i;
            }
        }
    }

    return moves[mejorMovimiento];





}