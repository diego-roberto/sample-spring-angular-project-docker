import { ChecklistPenalty } from '../../../../../shared/util/json/checklist-penalty';
import { AssessmentPenaltyService } from '../../../../../shared/services/assessment-penalty.service';
import { ChecklistQuestionAnswer } from '../../../../../shared/models/checklist-question-answer.model';
import { EventEmitter, Output, OnDestroy } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';

import { Checklist } from '../../../../../shared/models/checklist.model';
import { Construction } from '../../../../../shared/models/construction.model';
import { ChecklistAnswer } from '../../../../../shared/models/checklist-answer.model';
import { User } from '../../../../../shared/models/user.model';
import { ChecklistQuestion } from '../../../../../shared/models/checklist-question.model';
import { ChecklistPossibleAnswers } from '../../../../../shared/models/checklist-possible-answers.model';
import { ChecklistSession } from '../../../../../shared/models/checklist-session.model';

import { ChecklistQuestionsAnswersCount } from '../../../../../shared/util/json/checklist-questions-answers-count';
import { ChecklistQuestionAnswersSessionsCount } from '../../../../../shared/util/json/checklist-question-answers-sessions-count';

import { AppMessageService } from '../../../../../shared/util/app-message.service';
import { SessionsService } from '../../../../../shared/services/sessions.service';
import { ChecklistService } from '../../../../../shared/services/checklist.service';
import { ConstructionsService } from '../../../../../shared/services/constructions.service';
import { ChecklistAnswerService } from '../../../../../shared/services/checklist-answer.service';
import { ChecklistPossibleAnswersService } from '../../../../../shared/services/checklist-possible-answers.service';
import { ChecklistQuestionAnswerService } from '../../../../../shared/services/checklist-question-answer.service';

import { FilesService } from '../../../../../shared/services/files.service';
import { FileInfo } from '../../../../../shared/models/file-info.model';
import { Subscription } from 'rxjs/Subscription';
import { PermissionService } from '../../../../../shared/services/permission.service';
import { setChecklistSavedOnWeb } from 'app/shared/util/localStorage';

@Component({
  selector: 'checklist-component',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})

export class ChecklistComponent implements OnInit, OnDestroy {

  @Input() taskScroll;

  @Output() savedChecklist: EventEmitter<Object> = new EventEmitter();
  @Output() backParentScroll: EventEmitter<any> = new EventEmitter<any>();

  checklistsFilteredList: Checklist[];
  checklistQuestions: ChecklistQuestion[];
  checklistPossibleAnswers: ChecklistPossibleAnswers[];
  lastChecklistAnswers: ChecklistAnswer[];
  construction: Construction;
  checklist: Checklist;
  currentUser: User;
  numWorkers: number;
  savedAnswer: ChecklistAnswer;
  savedQuestionAnswers: Array<ChecklistQuestionAnswer>;
  checklistAnswer: ChecklistAnswer;
  checklistAnswers: ChecklistAnswer[];
  answersCount: ChecklistQuestionsAnswersCount;
  resultSessions: ChecklistSession[];
  answersSessionsCount: ChecklistQuestionAnswersSessionsCount[];
  checklistPenalty: ChecklistPenalty;
  checklistQuestionEditable: boolean = true;

  loading = true;
  result = false;
  questions = false;
  resultList = false;
  answers = false;
  showFloatButton = true;

  private changeConstructionSubscription: Subscription;

  spin = true;
  direction = 'up';
  animationMode = 'fling';
  fixed = false;

  constructor(
    public permissionService: PermissionService,
    private router: Router,
    private route: ActivatedRoute,
    private checklistService: ChecklistService,
    private constructionService: ConstructionsService,
    private checklistPossibleAnswersService: ChecklistPossibleAnswersService,
    private sessionsService: SessionsService,
    private checklistAnswerService: ChecklistAnswerService,
    private checklistQuestionAnswerService: ChecklistQuestionAnswerService,
    private assessmentPenaltyService: AssessmentPenaltyService,
    private fileService: FilesService,
    private appMessage: AppMessageService
  ) { }

  ngOnInit() {
    this.onLoad();

    this.changeConstructionSubscription = this.constructionService.changeConstructionObservable.subscribe(construction => {
      this.onLoad();
      this.result = false;
      this.questions = false;
      this.resultList = false;
      this.answers = false;
    });
  }

  ngOnDestroy(): void {
    this.changeConstructionSubscription.unsubscribe();
  }

  onLoad() {
    this.currentUser = this.sessionsService.getCurrent();

    this.loadConstruction();
    this.loadLastChecklistAnswersByConstruction();
    this.loadChecklistPossibleAnswers();
    this.loadChecklists();
  }

  goBackScroll() {
    this.backParentScroll.emit();
    this.onLoad();
  }

  loadChecklists() {
    const currentUser = this.sessionsService.getCurrent();

    this.checklistService.getChecklistListWithState(currentUser.id, this.construction.id).subscribe((checklists: Checklist[]) => {
      this.checklistsFilteredList = checklists.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    }, error => {
      this.loading = false;
      this.appMessage.errorHandle(error, 'Não foi possível carregar as informações do checklist ');
    }, () => {
      this.loading = false;
    });
  }

  loadConstruction() {
    this.construction = this.constructionService.construction;
  }

  loadChecklistPossibleAnswers() {
    this.checklistPossibleAnswersService.getChecklistPossibleAnswers().subscribe(
      possibleAnswers => {
        this.checklistPossibleAnswers = possibleAnswers;
      }
    );
  }

  loadLastChecklistAnswersByConstruction() {
    this.checklistAnswerService.getLastChecklistAnswersByConstructionId(this.construction.id).subscribe((checklistAnswers: ChecklistAnswer[]) => {
      this.lastChecklistAnswers = checklistAnswers;
    },
      error => {
        this.appMessage.errorHandle(error, 'Não foi possível carregar algumas informações sobre os checklists ');
      });
  }

  toChangeResult(checklist: Checklist) {
    if (checklist) {
      this.checklist = checklist;

      if (!this.result) {
        this.result = true;
        this.questions = false;
      }
    }
  }

  toChangeQuestions({ checklistSelected, cb }) {
    this.loading = true;

    if (checklistSelected && checklistSelected.checklistToAnswerId) {
      this.checklistAnswerService.getChecklistAnswersByIdAndUser(checklistSelected.checklistToAnswerId, this.currentUser.id, this.construction.id).
        subscribe(answers => {
          this.checklistAnswers = answers;
          this.checklistService.getChecklistById(checklistSelected.checklistToAnswerId).subscribe(newChecklist => {

            let checklistQuestions = [];
            newChecklist.checklistSessions.forEach(session => {
              checklistQuestions = checklistQuestions.concat(session.checklistQuestions);
            });

            answers.forEach(answer => {
              if (checklistQuestions.length > answer.checklistQuestionAnswers.length) {
                const checkListAnswer = new ChecklistAnswer()
                  .initializeWithAnswer(checklistSelected.checklistToAnswerId, this.currentUser.id, this.construction.id, checklistQuestions);

                const missingAnswers = checkListAnswer.checklistQuestionAnswers.slice(answer.checklistQuestionAnswers.length, checkListAnswer.checklistQuestionAnswers.length);

                answer.checklistQuestionAnswers = answer.checklistQuestionAnswers.concat(missingAnswers);
              }
            });

            this.checklist = newChecklist;
            this.questions = false;
            this.result = false;
            this.answers = true;
            cb();
          });
        }, () => {
          cb();
        });
    }

    this.loading = false;
  }

  toAnswer(checklistAnswer: ChecklistAnswer) {
    this.checklistAnswer = checklistAnswer;
    this.questions = true;
    this.result = false;
    this.answers = false;
    this.loading = false;
  }

  toUpdateChecklistAnswer(checklistAnswer: ChecklistAnswer) {
    checklistAnswer.checklistQuestionAnswers.forEach(checklistQuestionAnswers => {
      if (checklistQuestionAnswers.idAnswerPossible === 0) {
        checklistQuestionAnswers.idAnswerPossible = 4;
      }
    });

    this.onLoad();
    this.saveChecklistAnswerSynchronized(checklistAnswer, true);
  }

  toChecklistQuestions(event: any) {
    this.result = false;
    this.questions = true;

    this.onLoad();
  }

  countAnswers(id: number) {
    this.checklistAnswerService.countAnswers(id).subscribe(
      count => {
        this.answersCount = count;
      }
    );
  }

  countSessionAnswers(id: number, checklistId: number) {
    this.checklistQuestionAnswerService.countAnswersSession(id, checklistId).subscribe(
      count => {
        this.answersSessionsCount = count;
      }
    );
  }

  changeEditable(value: boolean) {
    this.checklistQuestionEditable = value;
  }

  toVisualizeResult(checklistAnswer: ChecklistAnswer) {
    checklistAnswer.checklistQuestionAnswers.forEach(checklistQuestionAnswers => {
      if (checklistQuestionAnswers.idAnswerPossible === 0) {
        checklistQuestionAnswers.idAnswerPossible = 4;
      }
    });

    this.onLoad();
    this.saveChecklistAnswerSynchronized(checklistAnswer);
  }

  accomplishChecklistAnswer(checklistAnswer: ChecklistAnswer) {
    checklistAnswer.checklistQuestionAnswers.forEach(checklistQuestionAnswers => {
      if (checklistQuestionAnswers.idAnswerPossible === 0) {
        checklistQuestionAnswers.idAnswerPossible = 4;
      }
    });

    checklistAnswer.endAnswer = new Date();
    this.onLoad();
    this.saveChecklistAnswerSynchronized(checklistAnswer, true);
  }

  async saveChecklistAnswerSynchronized(checklistAnswer: ChecklistAnswer, updating = false) {
    try {
      this.checklistQuestionEditable = false;

      const clonedChecklistAnswer = Object.assign(new ChecklistAnswer(), checklistAnswer);
      clonedChecklistAnswer.checklistQuestionAnswers = [];

      this.savedAnswer = await this.saveAnswer(clonedChecklistAnswer);
      this.checklistAnswer.id = this.savedAnswer.id;

      for (const checklistQuestionAnswers of this.checklistAnswer.checklistQuestionAnswers) {
        checklistQuestionAnswers.idAnswer = this.savedAnswer.id;

        const questionAnswer = await this.saveQuestionAnswer(checklistQuestionAnswers);
        checklistQuestionAnswers.id = questionAnswer.id;

        const filesAnswerFromDB = await this.findChecklistQuestionAnswerImages(checklistQuestionAnswers.id);

        for (const answerImage of checklistQuestionAnswers.attachmentFiles) {
          const isAlreadyOnDB = filesAnswerFromDB.some(DBFile => DBFile.files.userFileName === answerImage.userFileName);

          if (!answerImage.id && !isAlreadyOnDB) {
            const timeHash = (+new Date).toString(36);
            answerImage.userFileName = timeHash;
            answerImage.file = new File([answerImage.file], timeHash);

            let savedImage: FileInfo = await this.saveAnswerImages(answerImage, questionAnswer);
            answerImage.id = savedImage.id;
          }
        }
      }

      if (updating) {
        await this.backResult();
      } else {
        await this.returnResult();
      }

      this.appMessage.showSuccess('Resposta salva com sucesso!');

    } catch (err) {
      console.log(err);

      setChecklistSavedOnWeb(
        this.sessionsService.getCurrentCompany().companyId,
        this.sessionsService.getCurrentConstruction(),
        this.checklistAnswer.id
      );

      this.appMessage.showError(
        'Não foi possível realizar o envio das respostas, tente novamente mais tarde ou entre em contato com o suporte.',
        { duration: 6500, extraClasses: ['center-text-align'] }
      );
    } finally {
      this.checklistQuestionEditable = true;
    }
  }

  backResult(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.checklistAnswerService.getChecklistAnswerById(this.savedAnswer.id).subscribe((answer) => {
        this.checklistAnswer = answer;
        this.result = this.questions = false;
        this.onLoad();

        resolve(true);
      }, error => {
        reject(error);
      });
    });
  }

  returnResult(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.checklistService.getChecklistById(this.checklist.id).subscribe((checklist) => {
        this.checklist = checklist;

        this.resultSessions = this.checklist.checklistSessions;
        this.assessmentPenaltyService.getChecklistPenalty(this.resultSessions, this.savedAnswer.id, this.savedAnswer.numberWorkers).subscribe((penalty) => {
          this.checklistPenalty = penalty;

          this.countAnswers(this.savedAnswer.id);
          this.countSessionAnswers(this.savedAnswer.id, this.checklist.id);

          this.questions = false;
          this.result = true;

          resolve(true);
        },
          error => {
            this.appMessage.errorHandle(error, 'Erro ao salvar resposta! ');
            reject(error);
          }
        );
      },
        error => {
          this.appMessage.errorHandle(error, 'Erro ao salvar resposta! ');
          reject(error);
        });
    });
  }

  saveAnswer(checklistAnswer: ChecklistAnswer): Promise<ChecklistAnswer> {
    return new Promise<ChecklistAnswer>((resolve, reject) => {
      this.checklistAnswerService.saveChecklistAnswer(checklistAnswer).subscribe(
        savedAnswer => {
          resolve(savedAnswer);
        },
        error => {
          reject(error);
        }
      );
    });
  }

  saveQuestionAnswer(questionAnswer: ChecklistQuestionAnswer): Promise<ChecklistQuestionAnswer> {
    return new Promise<ChecklistQuestionAnswer>((resolve, reject) => {
      this.checklistQuestionAnswerService.saveChecklistQuestionAnswer(questionAnswer).subscribe(
        savedQuestionAnswer => {
          resolve(savedQuestionAnswer);
        },
        error => {
          reject(error);
        }
      );
    });
  }

  saveAnswerImages(answerFile: FileInfo, questionAnswer: ChecklistQuestionAnswer): Promise<FileInfo> {
    return new Promise<FileInfo>((resolve, reject) => {
      this.fileService.uploadFileChecklistQuestionAnswer('checklist', answerFile.file, questionAnswer.id as any).subscribe(
        savedImage => {
          resolve(savedImage);
        },
        error => {
          reject(error);
        }
      );
    });
  }

  findChecklistQuestionAnswerImages(id: number) {
    return new Promise<any>((resolve, reject) => {
      this.checklistQuestionAnswerService
        .findChecklistQuestionAnswerImages(id).subscribe(response => {
          resolve(response);
        }, error => {
          reject(error);
        });
    });
  }


  toVerifyChecklist({ checklistSelected, cb }) {
    this.checklistService.getChecklistById(checklistSelected.checklistToAnswerId).subscribe((checklist) => {

      this.checklist = checklist;
      this.checklistQuestions = [];
      checklist.checklistSessions.forEach(session => {
        this.checklistQuestions = this.checklistQuestions.concat(session.checklistQuestions);
      });

      this.checklistAnswer = new ChecklistAnswer().initializeWithAnswer(checklist.id, this.currentUser.id, this.construction.id, this.checklistQuestions);
      this.questions = true;
      this.result = false;

      cb && cb();
      this.onLoad();
    },
      error => {
        cb && cb();
        this.appMessage.errorHandle(error, 'Erro ao recupear o checklist! ');
      });
  }

  toChangeResultList(checklist: Checklist) {
    if (checklist) {
      this.checklist = checklist;

      this.checklistQuestions = [];
      this.checklist.checklistSessions.forEach(session => {
        this.checklistQuestions = this.checklistQuestions.concat(session.checklistQuestions);
      });

      if (!this.resultList) {
        this.resultList = true;
        this.result = false;
        this.questions = false;
      }
    }

    this.onLoad();
  }

  getLastChecklistAnswer(checklist: Checklist): ChecklistAnswer {
    return this.lastChecklistAnswers.find(checklistAnswer => checklistAnswer.idChecklist === checklist.id);
  }

  redirectToChecklistCreate() {
    this.router.navigate(['./new'], { relativeTo: this.route });
  }

  toChecklistList() {
    this.answers = false;
    this.resultList = false;
    this.result = false;
    this.questions = false;
    this.showFloatButton = true;

    this.onLoad();
  }

  hideFloatButton() {
    this.showFloatButton = false;
  }
}
