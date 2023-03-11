
export class ChecklistQuestionsAnswersCount {
    answerId: number;
    yesAnswer: number;
    noAnswer: number;
    partiallyAnswer: number;
    notApplicableAnswer: number;
    notAnswered: number;
    totalAnswers: number;


    initializeWithJSON(json: any): ChecklistQuestionsAnswersCount {
        this.answerId = json.answerId;
        this.yesAnswer = json.yesAnswer;
        this.noAnswer = json.noAnswer;
        this.partiallyAnswer = json.partiallyAnswer;
        this.notApplicableAnswer = json.notApplicableAnswer;
        this.notAnswered = json.notAnswered;
        this.totalAnswers = this.yesAnswer + this.noAnswer + this.partiallyAnswer + this.notAnswered + this.notApplicableAnswer;

        return this;
    }
}
