import { ChecklistSessionPenalty } from './checklist-session-penalty';

export class ChecklistPenalty {
    checklistPenalty: number;
    sessionsPenalty: Array<ChecklistSessionPenalty>;


    initializeWithJSON(json: any): ChecklistPenalty {
        this.checklistPenalty = json.checklistPenalty;
        this.sessionsPenalty = json.sessionsPenalty ? json.sessionsPenalty.map(session => new ChecklistSessionPenalty().initializeWithJSON(session)) : null;

        return this;
    }
}
