import { Construction } from 'app/shared/models/construction.model';
import { CanMerge } from 'app/shared/util/generic/form/can-merge';
import { ResponsibleEngineer } from 'app/shared/models/responsible-engineer';
import { ResponsibleSafety } from 'app/shared/models/responsible-safety';

export class ConstructionManagers implements CanMerge<Construction> {

    responsibleEngineer: ResponsibleEngineer;
    responsibleSafety: ResponsibleSafety;

    initializeWithModel(model: Construction) {
        this.responsibleEngineer = model.responsibleEngineer ? model.responsibleEngineer : new ResponsibleEngineer();
        this.responsibleSafety = model.responsibleSafety ? model.responsibleSafety : new ResponsibleSafety();
    }

    merge(model: Construction) {
        model.responsibleEngineer = this.responsibleEngineer;
        model.responsibleSafety = this.responsibleSafety;
    }
}
