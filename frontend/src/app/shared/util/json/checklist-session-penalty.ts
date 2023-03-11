import { ChecklistQuestionPenalty } from './checklist-question-penalty';

export class ChecklistSessionPenalty {
    sessionId: number;
    penalty: number;
    questionsPenalty: Array<ChecklistQuestionPenalty>;

    initializeWithJSON(json: any): ChecklistSessionPenalty {
        this.sessionId = json.sessionId;
        this.penalty = json.penalty;
        this.questionsPenalty = json.questionsPenalty ? json.questionsPenalty.map(question => new ChecklistQuestionPenalty().initializeWithJSON(question)) : null;

        return this;
    }
}
