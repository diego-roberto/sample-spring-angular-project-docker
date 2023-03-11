import { Aso } from './aso.model';

export class Health {

    asoList: Array<Aso> = [];
    errorMsg: String;
    canAddNew: Boolean;
    allergies: '';
    diseases: '';
    submitted: boolean;

    public initializeWithJSON(json: any) {
        return this;
    }

    public toJSON() {
        return {};
    }
}
