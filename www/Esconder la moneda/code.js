class DataRecord {
    constructor() {
        this.total = 0;
        this.counts = {};
    };
};

class GamePredictor {

    constructor() {
        this.data = {};
    };

    RegisterActions(_actions) {

        //Dividir la string
        let key;
        if (_actions.length > 1)
            key = _actions.substr(0, _actions.length - 1);
        else
            key = _actions;

        let value = _actions[_actions.length - 1];

        if (!this.data.hasOwnProperty(key)) {
            this.data[key] = new DataRecord();
        }

        let record = this.data[key];

        if (!record.counts.hasOwnProperty(value)) {
            record.counts[value] = 0;
        }

        record.counts[value]++;
        record.total++;

    };

    GetMostLikely(_actions) {
        let bestAction = ' ';

        let highestValue = 0;
        let record;

        if (this.data.hasOwnProperty(_actions)) {
            record = this.data[_actions];

            for (let key in record.counts) {

                if (record.counts[_actions] > highestValue) {

                    bestAction = _actions;
                    highestValue = record.counts[_actions];

                } else if (record.counts[_actions] == highestValue) {

                    if (Math.random() <= 0.5) {
                        bestAction = _actions;
                        highestValue = record.counts[_actions];
                    }
                }
            }
        }

        return bestAction;
    }

    toString() {
        let respuesta = "";
        for (let key in this.data) {
            respuesta += "<br>" + key + ": ";
            let record = this.data[key];
            for (let actions in record.counts) {
                respuesta += " " + actions + "->" + record.counts[actions];
            }

        }

        return respuesta;
    }

};

class IA {

    constructor(_nVentana = 2) {
        this.windowSize = _nVentana;
        this.totalActions = "";
        this.posibleActions = "";
        this.predictor = new GamePredictor();
        this.acierto = 0;
        this.total = 0;
    }

    addAction(_action) {

        this.posibleActions += _action;

    }

    Guess(_correctAnswer) {
        let lastActions = "";
        let frase = "";
        this.total++;

        let guess = '';
        if (this.totalActions.length >= this.windowSize) {
            lastActions = this.totalActions.substr(this.totalActions.length - this.windowSize, this.windowSize);
            guess = this.predictor.GetMostLikely(lastActions);
            if (guess == ' ') {
                guess = this.randomGuess();
            }
        }
        else
            guess = this.randomGuess();


        if (guess == _correctAnswer) {
            this.acierto++;
            frase += "ACIERTO";
            $("#WhoWin").removeClass();
            $("#WhoWin").addClass("green");
        } else {
            frase += "FALLO";
            $("#WhoWin").removeClass();
            $("#WhoWin").addClass("red");
        }

        frase += " Tasa de aciertos: " + (this.acierto / this.total).toFixed(2) + "\n";


        $("#WhoWin").addClass("Winner");
        $("#WhoWin").text(frase);

        this.totalActions += _correctAnswer;
        lastActions = this.totalActions.substr(this.totalActions.length - this.windowSize - 1, this.windowSize + 1);
        this.predictor.RegisterActions(lastActions);

        //Enlazar el to string
        $("#InfoTable").html(this.predictor.toString());

        return guess;

    }

    randomGuess() {
        return this.posibleActions[Math.floor(Math.random() * this.posibleActions.length)];
    }

};


let inteligencia = new IA();

//Añadimos todas las posibes acciones
inteligencia.addAction('R');
inteligencia.addAction('L');

function SelectOption(opc) {

    //Drawsprite the player
    $("#EleccionJugador").removeClass();
    $("#EleccionJugador").addClass("Eleccion");
    if (opc === 'R')
        $("#EleccionJugador").addClass("CerradoDer");
    else
        $("#EleccionJugador").addClass("CerradoIzq");



    //IA Logic
    let guess = inteligencia.Guess(opc);

    //Drawsprite the IA
    $("#EleccionAI").removeClass();
    $("#EleccionAI").addClass("Eleccion");


    if (guess === 'L')
        $("#EleccionAI").addClass("manoIzq");
    else
        $("#EleccionAI").addClass("manoDech");
}

function cambiarVentana() {

    let num = parseInt($("#valueVentana").val());
    if (num === undefined || isNaN(num))
        num = 2;

    inteligencia = new IA(num);

    //Añadimos todas las posibes acciones
    inteligencia.addAction('R');
    inteligencia.addAction('L');

}