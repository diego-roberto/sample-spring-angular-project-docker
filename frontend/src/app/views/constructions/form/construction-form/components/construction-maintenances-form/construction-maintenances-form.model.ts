import * as _ from 'lodash/collection';

import { CanMerge } from 'app/shared/util/generic/form/can-merge';
import { Construction } from 'app/shared/models/construction.model';
import { Equipment } from 'app/shared/models/equipment.model';

export class ConstructionMaintenance implements CanMerge<Construction> {

    equipments: Array<Equipment> = [];

    initializeWithModel(model: Construction) {
        if (model.equipments) {
            this.equipments = model.equipments;
            this.equipments = _.orderBy(model.equipments,
                [(equipments) => equipments.category.name, (equipments) => equipments.type.name, (equipments) => equipments.identification]);
        }
    }

    merge(model: Construction) {
        model.equipments = this.equipments;
    }
}
