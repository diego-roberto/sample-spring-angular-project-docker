import { CaEpi } from './ca-epi.model';

export class EpiWorkers {
    id: number;
    dateReturnEquipment: Date;
    dateLoanEquipment: Date;
    epiId: number;
    workerId: number;
    workerName: string;
    caEpiId: CaEpi = new CaEpi;

    constructor(dateLoanEquipment?: Date, workerId?: number, caEpiId?: CaEpi, epiId?: number) {
        this.dateLoanEquipment = dateLoanEquipment;
        this.workerId = workerId;
        this.caEpiId = caEpiId;
        this.epiId = epiId;
    }

    initializeWithJSON(json: any) {
        this.id = json.id;
        this.dateReturnEquipment = json.dateReturnEquipment;
        this.dateLoanEquipment = json.dateLoanEquipment;
        this.epiId = json.epiId;
        if (json.worker) {
            this.workerId = json.worker.id;
            this.workerName = json.worker.name;
        }
        this.caEpiId = json.caEpiId ? new CaEpi().initializeWithJSON(json.caEpiId) : null;
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            dateReturnEquipment: this.dateReturnEquipment,
            dateLoanEquipment: this.dateLoanEquipment,
            epiId: this.epiId,
            worker: {
                id: this.workerId
            },
            caEpiId: this.caEpiId
        };
    }
}
