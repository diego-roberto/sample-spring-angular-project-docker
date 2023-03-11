import { Construction } from 'app/shared/models/construction.model';
import { CanMerge } from 'app/shared/util/generic/form/can-merge';
import { ResponsibleEngineer } from 'app/shared/models/responsible-engineer';
import { ResponsibleSafety } from 'app/shared/models/responsible-safety';

export class ConstructionModules implements CanMerge<Construction> {

   

    initializeWithModel(model: Construction) {
    }

    merge(model: Construction) {
        
    }
}
