import { Checklist } from 'app/shared/models/checklist.model';
import { ChecklistPossibleAnswers } from 'app/shared/models/checklist-possible-answers.model';
import { ChecklistAnswer } from 'app/shared/models/checklist-answer.model';
import { ChecklistQuestionsAnswersCount } from 'app/shared/util/json/checklist-questions-answers-count';
import { ChecklistQuestionAnswersSessionsCount } from 'app/shared/util/json/checklist-question-answers-sessions-count';
import { ChecklistInfo } from 'app/shared/models/checklist-info';
import { ChecklistSession } from 'app/shared/models/checklist-session.model';
import { ChecklistPenalty } from 'app/shared/util/json/checklist-penalty';

export class ChecklistResultReport {
    checklistQuestionsAnswersCount: ChecklistQuestionsAnswersCount;
    answerSessions: ChecklistQuestionAnswersSessionsCount[];
    checklistSessions: ChecklistSession[];
    checklistPenalty: ChecklistPenalty;
    checklistInfo: ChecklistInfo;
    checklistPossibleAnswers: ChecklistPossibleAnswers[];
    savedAnswer: ChecklistAnswer;
    checklist: Checklist;

    toJson() {
        return JSON.stringify(this);
    }

}
