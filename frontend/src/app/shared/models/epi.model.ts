import { EpiTypes } from './epi-types.model';


export class Epi {
    id: number;
    description: string;
    epiType: EpiTypes;

    initializeWithJSON(json: any) {
        this.id = json.id;
        this.description = json.description;
        this.epiType = json.epiType ? new EpiTypes().initializeWithJSON(json.epiType) : null;
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            description: this.description,
            epiType: this.epiType
        };
    }
}
