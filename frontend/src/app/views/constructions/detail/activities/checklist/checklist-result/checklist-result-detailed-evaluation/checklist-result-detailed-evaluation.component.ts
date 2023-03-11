import { Component, ViewChild, Input, OnInit } from '@angular/core';

import { ChecklistSession } from 'app/shared/models/checklist-session.model';
import { ChecklistAnswer } from 'app/shared/models/checklist-answer.model';
import { ChecklistPossibleAnswers } from 'app/shared/models/checklist-possible-answers.model';

import { ChecklistPenalty } from 'app/shared/util/json/checklist-penalty';

import { SafetyCardComponent } from 'app/shared/components/safety-card';
import { ChecklistService } from 'app/shared/services/checklist.service';
import { ChecklistQuestion } from 'app/shared/models/checklist-question.model';
import { ChecklistQuestionAnswer } from 'app/shared/models/checklist-question-answer.model';
import { ChecklistQuestionAnswerService } from 'app/shared/services/checklist-question-answer.service';

@Component({
    selector: 'checklist-result-detailed-evaluation',
    templateUrl: './checklist-result-detailed-evaluation.component.html',
    styleUrls: ['./checklist-result-detailed-evaluation.component.scss']
})
export class ChecklistResultDetailedEvaluationComponent implements OnInit {

    @Input()
    set checklistPenalty(checklistPenalty: ChecklistPenalty) { this._checklistPenalty = checklistPenalty; }
    get checklistPenalty(): ChecklistPenalty { return this._checklistPenalty; }
    @Input()
    set savedAnswer(savedAnswer: ChecklistAnswer) { this._savedAnswer = savedAnswer; }
    get savedAnswer(): ChecklistAnswer { return this._savedAnswer; }
    @Input()
    set resultSessions(resultSessions: ChecklistSession[]) { this._resultSessions = resultSessions; }
    get resultSessions(): ChecklistSession[] { return this._resultSessions; }
    @Input() checklistPossibleAnswers: ChecklistPossibleAnswers[];

    _savedAnswer: ChecklistAnswer;
    _resultSessions: ChecklistSession[];
    _checklistPenalty: ChecklistPenalty;

    sessions: ChecklistSession[];
    questionIndexes: Map<number, number>;
    questionAnswerRelation: Map<number, ChecklistPossibleAnswers> = new Map<number, ChecklistPossibleAnswers>();
    mapQuestionAnswerObservation : Map<number, string> = new Map<number, string>();

    @ViewChild('checklistResultDetailedEvaluationCard') checklistResultDetailedEvaluationCard: SafetyCardComponent;

    readonly title = 'RESULTADO DETALHADO DA AVALIAÇÃO';

    constructor(private checklistService: ChecklistService) { }

    ngOnInit() {
        this.sessions = this.resultSessions;
        // numerar as questoes
        this.questionIndexes = this.checklistService.getChecklistIndexes(this.sessions);

        this.setQuestionAnswerRelation();
    }

    setQuestionAnswerRelation() {
        for (const checklistQuestionAnswer of this._savedAnswer.checklistQuestionAnswers) {
            if (!checklistQuestionAnswer || !checklistQuestionAnswer.questionAnswered) {
                this.questionAnswerRelation.set(checklistQuestionAnswer.idQuestion, undefined);
            } else {
                const answerPossible: ChecklistPossibleAnswers = this.checklistPossibleAnswers.filter(e => e.id === Number(checklistQuestionAnswer.idAnswerPossible))[0];
                this.questionAnswerRelation.set(checklistQuestionAnswer.idQuestion, answerPossible);
            }

            let obs = null;
            if(checklistQuestionAnswer.observation && checklistQuestionAnswer.observation != null){
                obs = checklistQuestionAnswer.observation;
            }

            this.mapQuestionAnswerObservation.set(checklistQuestionAnswer.idQuestion, obs);
        }

    }
}
