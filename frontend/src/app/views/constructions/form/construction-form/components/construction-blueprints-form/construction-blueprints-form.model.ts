import { CanMerge } from 'app/shared/util/generic/form/can-merge';
import { Construction } from 'app/shared/models/construction.model';
import { Equipment } from 'app/shared/models/equipment.model';
import { Sector } from 'app/shared/models/sector.model';
import { Worker } from 'app/shared/models/worker.model';

export class ConstructionBlueprints implements CanMerge<Construction> {

    sectors: Array<Sector>;
    equipments: Array<Equipment>;
    workers: Array<Worker>;

    initializeWithModel(model: Construction) {
        this.sectors = model.sectors ? model.sectors : [];
        this.equipments = model.equipments ? model.equipments : [];
        this.workers = model.workers ? model.workers : [];
    }

    merge(model: Construction) {
        model.sectors = this.sectors ? this.sectors : [];
        model.equipments = this.equipments ? this.equipments : [];
        model.workers = this.workers ? this.workers : [];
    }
}
