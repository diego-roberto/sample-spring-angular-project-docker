
export class TrainingMinister {
    id: number;
    name: string;
    workerId: number;
    userId: number;

    public initializeWithJSON(json: any): TrainingMinister {
        this.id         = json.id;
        this.name       = json.name;
        this.workerId   = json.workerId;
        this.userId   = json.userId;
        return this;
    }

    public toJSON() {
        return {
            id:         this.id,
            name:       this.name,
            workerId:   this.workerId,
            userId:   this.userId
        };
    }
}

