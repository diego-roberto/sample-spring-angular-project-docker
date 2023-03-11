import { Clonable } from 'app/shared/util/generic/form/clonable';

import { Checklist } from './checklist.model';
import { ChecklistQuestion } from './checklist-question.model';
import { ChecklistConstructionInfo } from 'app/shared/models/checklist-construction-info';
import { ChecklistGeneralInfo } from 'app/shared/models/checklist-general-info';


export class ChecklistInfo implements Clonable<ChecklistInfo> {
    consideration: string;
    generalInfo: ChecklistGeneralInfo;
    constructionInfo: ChecklistConstructionInfo;

    initializeWithJSON(json) {
        this.consideration = json.consideration ? json.consideration : '';
        this.generalInfo = json.generalInfo ? json.generalInfo : new ChecklistGeneralInfo();
        this.constructionInfo = json.constructionInfo ? json.constructionInfo : new ChecklistConstructionInfo();

        return this;
    }

    toJSON() {
        return {
            consideration: this.consideration,
            generalInfo: this.generalInfo,
            constructionInfo: this.constructionInfo
        };
    }

    clone(): ChecklistInfo {
        const checklistInfo = Object.assign(new ChecklistInfo(), this);

        return checklistInfo;
    }
}
