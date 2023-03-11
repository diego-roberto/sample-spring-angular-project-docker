import { Worker } from './worker.model';
import { IndividualEquipment } from 'app/shared/models/individual-equipment.model';

export class IndividualEquipmentWorker {
    id: string;

    loanDate: Date;
    returnDate: Date;

    individualEquipment: IndividualEquipment;
    worker: Worker;

    initializeWithJSON(json: any): IndividualEquipmentWorker {
        this.id = json.id;

        this.loanDate = json.loanDate;
        this.returnDate = json.returnDate;

        this.individualEquipment = new IndividualEquipment().initializeWithJSON(json.individualEquipment);
        this.worker = new Worker().initializeWithJSON(json.worker);

        return this;
    }
}
