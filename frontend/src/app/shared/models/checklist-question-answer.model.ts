import { FileInfo } from './file-info.model';
import { ChecklistAnswer } from './checklist-answer.model';
import { User } from './user.model';
import { environment } from 'environments/environment';

import { Checklist } from 'app/shared/models/checklist.model';
import { ChecklistQuestion } from './checklist-question.model';
import { ChecklistStatus } from './checklist-status.model';
import { ChecklistSession } from './checklist-session.model';

import * as Moment from 'moment';
import { Clonable } from '../util/generic/form/clonable';
import { FilesChecklistQuestionAnswer } from './files-checklist-question-answer.model';

export class ChecklistQuestionAnswer implements Clonable<ChecklistQuestionAnswer> {
    id: number;
    changeDate: Date;
    questionAnswered: boolean;
    observation: string;

    idAnswerPossible: number;
    idQuestion: number;
    idAnswer: number;

    cQuestionAnswerFile: File;
    attachmentFiles: Array<FileInfo> = [];

    filesChecklistQuestionAnswers: Array<FilesChecklistQuestionAnswer> = [];

    public constructor() { }

    initializeWithJSON(json) {
        this.id = json.id;
        this.changeDate = json.changeDate;
        this.questionAnswered = json.questionAnswered;
        this.observation = json.observation = json.observation != null ? json.observation : null;

        this.idAnswerPossible = json.idAnswerPossible;
        this.idQuestion = json.idQuestion;
        this.idAnswer = json.idAnswer;

        if (json.attachmentFiles) {
            this.attachmentFiles = json.attachmentFiles.map(jsonAttachmentFiles => new FileInfo().initializeWithJSON(jsonAttachmentFiles));
        }

        this.filesChecklistQuestionAnswers = json.filesChecklistQuestionAnswers ? json.filesChecklistQuestionAnswers.map(filesChecklistQuestionAnswers => new FilesChecklistQuestionAnswer().initializeWithJSON(filesChecklistQuestionAnswers)) : null;

        return this;
    }

    initializeWithQuestion(question: ChecklistQuestion) {
        this.changeDate = new Date();
        this.questionAnswered = false;
        this.idAnswerPossible = 4;
        this.idQuestion = question.id;

        return this;
    }

    initializeWithJSONChecklistAnswer(json, checklistAnswer?: ChecklistAnswer) {
        this.id = json.id;
        this.changeDate = json.changeDate;
        this.questionAnswered = json.questionAnswered;
        this.observation = json.observation = json.observation != null ? json.observation : null;

        this.idAnswerPossible = json.idAnswerPossible;
        this.idQuestion = json.idQuestion;
        this.idAnswer = json.idAnswer;

        this.attachmentFiles = json.attachmentFiles ? json.attachmentFiles.map(attachmentFiles => new FileInfo().initializeWithJSON(attachmentFiles)) : null;

        this.filesChecklistQuestionAnswers = json.filesChecklistQuestionAnswers ? json.filesChecklistQuestionAnswers.map(filesChecklistQuestionAnswers => new FilesChecklistQuestionAnswer().initializeWithJSON(filesChecklistQuestionAnswers)) : null;
        return this;
    }

    initializeWithJSONChecklistQuestion(json, checklistQuestion?: ChecklistQuestion) {
        this.id = json.id;
        this.changeDate = json.changeDate;
        this.questionAnswered = json.questionAnswered;
        this.observation = json.observation = json.observation != null ? json.observation : null;

        this.idAnswerPossible = json.idAnswerPossible;
        this.idQuestion = json.idQuestion;
        this.idAnswer = json.idAnswer;

        this.attachmentFiles = json.attachmentFiles ? json.attachmentFiles.map(attachmentFiles => new FileInfo().initializeWithJSON(attachmentFiles)) : null;

        this.filesChecklistQuestionAnswers = json.filesChecklistQuestionAnswers ? json.filesChecklistQuestionAnswers.map(filesChecklistQuestionAnswers => new FilesChecklistQuestionAnswer().initializeWithJSON(filesChecklistQuestionAnswers)) : null;
        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            changeDate: this.changeDate,
            questionAnswered: this.questionAnswered,
            observation: this.observation,

            idAnswerPossible: this.idAnswerPossible,
            idQuestion: this.idQuestion,
            idAnswer: this.idAnswer,

            attachmentFiles: this.attachmentFiles.map(file => file.toJSON()),
            filesChecklistQuestionAnswers: this.filesChecklistQuestionAnswers.map(filesChecklistQuestionAnswer => filesChecklistQuestionAnswer.toJSON())
        };
    }

    clone(): ChecklistQuestionAnswer {
        const checklistQuestionAnswer = Object.assign(new ChecklistQuestionAnswer(), this);
        return checklistQuestionAnswer;
    }
}
