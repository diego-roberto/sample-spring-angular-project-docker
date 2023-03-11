export class WorkerWearable {
    id: number;
    idWearable: string;
    activeRelation: boolean;
    returnDateAt: any;
    loanDateAt: any;
    name: string;
    valid: boolean;
    workerId: number;
    cpfWorker: string;
    workerName: string;

    initializeWithJSON(json: any) {
        this.id = json.id;
        this.idWearable = json.idWearable;
        this.activeRelation = json.activeRelation;
        this.returnDateAt = json.returnDateAt;
        this.loanDateAt = json.loanDateAt;
        this.workerId = json.workerId;
        this.cpfWorker = json.cpfWorker;
        this.name = json.name;
        this.valid = json.valid;

        return this;
    }

    toJSON() {
        return {
            id: this.id,
            idWearable: this.idWearable,
            activeRelation: this.activeRelation,
            returnDateAt: this.returnDateAt,
            loanDateAt: this.loanDateAt,
            workerId: this.workerId,
            cpfWorker: this.cpfWorker,
            name: this.name,
            valid: this.valid
        };
    }
}
