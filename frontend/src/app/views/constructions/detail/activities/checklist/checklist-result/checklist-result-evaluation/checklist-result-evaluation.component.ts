import { Checklist } from 'app/shared/models/checklist.model';
import { Component, ViewChild, Input, OnInit, LOCALE_ID } from '@angular/core';
import { Color, BaseChartDirective } from 'ng2-charts';
import { ObservableMedia } from '@angular/flex-layout';

import { ChecklistAnswer } from 'app/shared/models/checklist-answer.model';
import { ChecklistSession } from 'app/shared/models/checklist-session.model';

import { ChecklistQuestionsAnswersCount } from 'app/shared/util/json/checklist-questions-answers-count';
import { ChecklistQuestionAnswersSessionsCount } from 'app/shared/util/json/checklist-question-answers-sessions-count';
import { ChecklistPenalty } from 'app/shared/util/json/checklist-penalty';

import { SafetyCardComponent } from 'app/shared/components/safety-card';

@Component({
    selector: 'checklist-result-evaluation',
    templateUrl: './checklist-result-evaluation.component.html',
    styleUrls: ['./checklist-result-evaluation.component.scss'],
    providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }]
})
export class ChecklistResultEvaluationComponent implements OnInit {

    @Input()
    set checklistPenalty(checklistPenalty: ChecklistPenalty) { this._checklistPenalty = checklistPenalty; }
    get checklistPenalty(): ChecklistPenalty { return this._checklistPenalty; }
    @Input()
    set answersCount(answersCount: ChecklistQuestionsAnswersCount) { this._answersCount = answersCount; }
    get answersCount() { return this._answersCount; }
    @Input()
    set answersSessionsCount(answersSessionsCount: ChecklistQuestionAnswersSessionsCount[]) { this._answersSessionsCount = answersSessionsCount; }
    get answersSessionsCount() { return this._answersSessionsCount; }
    @Input() savedAnswer: ChecklistAnswer;
    @Input() resultSessions: ChecklistSession[];
    @Input() checklist: Checklist;

    @ViewChild('checklistResultConstructionIntroCard') checklistResultConstructionIntroCard: SafetyCardComponent;
    @ViewChild('checklistResultEvaluationCard') checklistResultEvaluationCard: SafetyCardComponent;
    @ViewChild('checklistResultGeneralEvaluationCard') checklistResultGeneralEvaluationCard: SafetyCardComponent;
    @ViewChild('checklistResultGeneralEvaluationSectionCard') checklistResultGeneralEvaluationSectionCard: SafetyCardComponent;
    @ViewChild(BaseChartDirective) public pizzaChart: BaseChartDirective;

    readonly titleIntro = 'INTRODUÇÃO';
    readonly titleEvaluation = 'AVALIAÇÃO';
    readonly titleGeneral = 'RESULTADO GERAL DA AVALIAÇÃO';
    readonly titleSection = 'RESULTADO GERAL POR SEÇÃO';

    public pieChartLabels: string[] = ['CONFORME', 'IRREGULAR', 'PARCIALMENTE'];
    public pieChartData: number[] = [];
    public pieChartType = 'pie';
    public pieColorsEmptyObject: Array<Color> = [{}];

    pieDatasets = [];

    _answersSessionsCount: ChecklistQuestionAnswersSessionsCount[];
    _answersCount: ChecklistQuestionsAnswersCount;
    _checklistPenalty: ChecklistPenalty;

    answerAnalisys = {
        session: [],
        percentYes: [],
        percentNo: [],
        percentPartially: [],
        percentNotApplicable: [],
        percentNotAnswered: [],
    };

    constructor(private media: ObservableMedia) { }


    ngOnInit() {
        this.pieChartData = [
            this._answersCount ? this._answersCount.yesAnswer : 0,
            this._answersCount ? this._answersCount.noAnswer : 0,
            this._answersCount ? this._answersCount.partiallyAnswer : 0
        ];
        this.pieDatasets = [
            {
                data: this.pieChartData,
                backgroundColor: [
                    '#00BD87',
                    '#FF4C4C',
                    '#FFC315',
                    '#A1ABB0',
                    '#3C3C3C'
                ],
                hoverBackgroundColor: [
                    '#00976c',
                    '#cc3c3c',
                    '#cc9c10',
                    '#80888c',
                    '#303030'
                ]
            }];

        this.AnalisysAnsweres();

    }

    AnalisysAnsweres() {
        let i = 0;
        for (const session of this.resultSessions) {
            for (const answersSession of this._answersSessionsCount) {
                if (session.id === answersSession.sessionId) {
                    const fraction = (100 / answersSession.totalAnswers);

                    this.answerAnalisys.session[i] = session.session;
                    this.answerAnalisys.percentYes[i] = answersSession.yesAnswers * fraction;
                    this.answerAnalisys.percentNo[i] = answersSession.noAnswers * fraction;
                    this.answerAnalisys.percentPartially[i] = answersSession.partiallyAnswers * fraction;
                    this.answerAnalisys.percentNotApplicable[i] = answersSession.notApplyAnswers * fraction;
                    this.answerAnalisys.percentNotAnswered[i] = answersSession.unanswered * fraction;

                    i++;
                }
            }
        }
    }

    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }

    showPencentageLabelCondition(percentage: number): boolean {
        if ((percentage < 13 && this.media.isActive('lt-md')) || (percentage < 8 && this.media.isActive('gt-sm'))) {
            return false;
        }
        return true;
    }
}
