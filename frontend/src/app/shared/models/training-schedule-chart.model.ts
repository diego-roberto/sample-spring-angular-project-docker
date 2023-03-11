export class TrainingScheduleChart {
	legend: string;
	trabalhadorCapacitado: number;
	trabalhadorNaoCapacitado: number;
	capacitacaoRealizada: number;
	capacitacaoAgendada: number;

    public constructor() { }

    public initializeWithJSON(json: any): TrainingScheduleChart {
        this.legend = json.legend;
        this.trabalhadorCapacitado = json.trabalhadorCapacitado;
        this.trabalhadorNaoCapacitado = json.trabalhadorNaoCapacitado;
        this.capacitacaoRealizada = json.capacitacaoRealizada;
        this.capacitacaoAgendada = json.capacitacaoAgendada;

        return this;
    }

    public toJSON() {
        return {
            legend: this.legend,
            trabalhadorCapacitado: this.trabalhadorCapacitado,
            trabalhadorNaoCapacitado: this.trabalhadorNaoCapacitado,
            capacitacaoRealizada: this.capacitacaoRealizada,
            capacitacaoAgendada: this.capacitacaoAgendada
        };
    }

}
