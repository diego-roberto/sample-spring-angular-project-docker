export class ChecklistQuestionPenalty {
    questionId: number;
    penalty: number;

    initializeWithJSON(json: any): ChecklistQuestionPenalty {
        this.questionId = json.questionId;
        this.penalty = json.penalty;

        return this;
    }
}
