export class WorkerAsoChart {
	legend: string;
	proprioRealizado: number;
	proprioAtrasado: number;
	terceiroRealizado: number;
	terceiroAtrasado: number;

    public constructor() { }

    public initializeWithJSON(json: any): WorkerAsoChart {
        this.legend = json.legend;
        this.proprioRealizado = json.proprioRealizado;
        this.proprioAtrasado = json.proprioAtrasado;
        this.terceiroRealizado = json.terceiroRealizado;
        this.terceiroAtrasado = json.terceiroAtrasado;

        return this;
    }

    public toJSON() {
        return {
            legend: this.legend,
            proprioRealizado: this.proprioRealizado,
            proprioAtrasado: this.proprioAtrasado,
            terceiroRealizado: this.terceiroRealizado,
            terceiroAtrasado: this.terceiroAtrasado
        };
    }

}
