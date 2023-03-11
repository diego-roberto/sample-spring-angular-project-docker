
export class Service {

    id: number;
    name: string;
    stages_of_construction_id: number;
    

    initializeWithJSON(json: any) {
        this.id = json.id;
        this.name = json.name;
        this.stages_of_construction_id = json.stages_of_construction_id;
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            stages_of_construction_id: this.stages_of_construction_id,            
        };
    }
}
