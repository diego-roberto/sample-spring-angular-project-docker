import { Clonable } from 'app/shared/util/generic/form/clonable';
import { Checklist } from './checklist.model';
import { ChecklistQuestion } from './checklist-question.model';

export class ChecklistReplicateProccess implements Clonable<ChecklistReplicateProccess> {
    // ChecklistSession
    id: number;
    createdAt:Date;
    checklistId: number;
    companyId: number;
    companyName: string;
    companyChecklistId: number;
    status: string; 
    statusName: string;  

    clone(): ChecklistReplicateProccess {
        const item = Object.assign(new ChecklistReplicateProccess(), this);
        return item;
    }

  
}
