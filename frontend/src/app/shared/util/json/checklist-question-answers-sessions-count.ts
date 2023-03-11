
export class ChecklistQuestionAnswersSessionsCount {
    sessionId: number;
    yesAnswers: number;
    noAnswers: number;
    partiallyAnswers: number;
    notApplyAnswers: number;
    unanswered: number;
    totalAnswers: number;

    initializeWithJSON(json: any): ChecklistQuestionAnswersSessionsCount {

        this.sessionId = json.sessionId;
        this.yesAnswers = json.yesAnswers;
        this.noAnswers = json.noAnswers;
        this.partiallyAnswers = json.partiallyAnswers;
        this.notApplyAnswers = json.notApplyAnswers;
        this.unanswered = json.unanswered;
        this.totalAnswers = this.yesAnswers + this.noAnswers + this.partiallyAnswers + this.notApplyAnswers + this.unanswered;

        return this;
    }
}
