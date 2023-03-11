
export class TrainingGenericAssign {
    idTraining: number;
    idRelationship: number;
    

    public initializeWithJSON(json: any): TrainingGenericAssign {

        this.idTraining                  = json.idTraining;
        this.idRelationship      = json.idRelationship;
       
        return this;
    }

    public toJSON() {
        return {
            idTraining:                  this.idTraining,
            idRelationship:      this.idRelationship,
            
        };
    }

    constains(value: string) {

    }
}
