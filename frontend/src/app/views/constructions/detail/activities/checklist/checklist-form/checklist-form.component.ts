import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
  AbstractControl,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  OnDestroy,
} from "@angular/core";
import { MdSnackBar } from "@angular/material";

import { ConfirmDialogHandler } from "app/shared/util/generic/confirm-dialog/confirm-dialog.handler";

import { Checklist } from "app/shared/models/checklist.model";
import { ChecklistStatus } from "app/shared/models/checklist-status.model";
import { ChecklistSession } from "app/shared/models/checklist-session.model";
import { ChecklistQuestion } from "app/shared/models/checklist-question.model";

import { SessionsService } from "app/shared/services/sessions.service";
import { ChecklistService } from "app/shared/services/checklist.service";
import { AppMessageService } from "app/shared/util/app-message.service";

import { SafetyCardComponent } from "app/shared/components/safety-card/safety-card.component";

@Component({
  selector: "checklist-form",
  templateUrl: "./checklist-form.component.html",
  styleUrls: ["./checklist-form.component.scss"],
})
export class ChecklistFormComponent implements OnInit, OnDestroy {
  readonly defaultChecklistStatusId = 1;

  @ViewChildren("sessionCardComponent") sessionCardComponentList: QueryList<
    SafetyCardComponent
  >;

  checklist: Checklist;
  checklistStatusList: ChecklistStatus[];
  checklistStatusHintMap: Map<number, string>;
  checklistForm: FormGroup;

  loadingStack: Set<string> = new Set<string>();
  checklistQuestionOnEdit: ChecklistQuestion;
  checklistTitleMaxLength = 50;
  checklistInroductionMaxLength = 2000;
  scheduleSave: any;
  scheduleSaveTimeValue = 30000;
  isSaving = false;

  constructor(
    private checklistService: ChecklistService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private sessionsService: SessionsService,
    private confirmDialogHandler: ConfirmDialogHandler,
    private appMessageService: AppMessageService,
    private snackBar: MdSnackBar
  ) { }

  ngOnInit() {
    this.initForm();
    this.doCheckChecklistToEdit();
    this.doLoadChecklistStatusList();

    this.scheduleSave = setInterval(() => {
      if (this.canSave()) {
        this.doSaveChecklist();
      }
    }, this.scheduleSaveTimeValue);
  }

  ngOnDestroy(): void {
    if (this.scheduleSave) {
      clearInterval(this.scheduleSave);
    }
  }

  initForm() {
    this.checklistForm = this.formBuilder.group({
      checklistTitle: new FormControl(undefined, [
        Validators.required,
        Validators.maxLength(this.checklistTitleMaxLength),
      ]),
      checklistStatus: new FormControl(undefined, []),
      checklistGeneratesActionPlan: new FormControl(null, []),
      checklistSessionFormList: this.formBuilder.array([]),
      introduction: new FormControl(undefined, [
        Validators.maxLength(this.checklistInroductionMaxLength),
      ]),
    });
  }

  protected notifyUser(message: string) {
    this.snackBar.open(message, null, { duration: 4000 });
  }

  goBack() {
    window.history.back();
  }

  isFormValid(): boolean {
    if (this.checklistForm) {
      return this.checklistForm.valid;
    } else {
      return false;
    }
  }

  doCheckChecklistToEdit() {
    this.addToLoadingStack("doCheckChecklistToEdit");
    this.route.params.subscribe((params) => {
      const checklistId = params["id"];

      if (checklistId) {
        this.checklistService
          .getChecklistById(checklistId)
          .subscribe((checklist) => {
            this.checklist = checklist;
            this.checklistForm.patchValue({
              checklistTitle: this.checklist.name,
              checklistStatus: this.checklist.status,
              checklistGeneratesActionPlan: this.checklist.generatesActionPlan,
              introduction: this.checklist.introduction,
            });
            setTimeout(() => {
              this.removeFromLoadingStack("doCheckChecklistToEdit");
            });
          });
      } else {
        this.checklist = new Checklist();
        this.checklist.status.id = this.defaultChecklistStatusId;
        this.checklist.generatesActionPlan = true;
        this.doAddChecklistSession("");

        const currentCompany = this.sessionsService.getCurrentCompany();
        if (currentCompany && currentCompany.companySesiBelongs) {
          this.checklist.sesiBelongs = currentCompany.companySesiBelongs;
        }
        this.removeFromLoadingStack("doCheckChecklistToEdit");
      }
    });
  }

  doLoadChecklistStatusList() {
    this.addToLoadingStack("doLoadChecklistStatusList");
    this.checklistService
      .getChecklistStatusList()
      .subscribe((checklistStatusList: ChecklistStatus[]) => {
        this.checklistStatusList = checklistStatusList;
        this.checklistStatusHintMap = new Map<number, string>();
        this.checklistStatusList.forEach((checklistStatus: ChecklistStatus) => {
          let checklistStatusHint;
          if (checklistStatus.status === "Em preenchimento") {
            checklistStatusHint =
              "salva o conteúdo sem disponibilizar o check list para ser respondido.";
          }
          if (checklistStatus.status === "Finalizado") {
            checklistStatusHint =
              "salva o conteúdo sem disponibilizar o check list para ser respondido. Indica que todas as perguntas já foram inseridas.";
          }
          if (checklistStatus.status === "Publicado") {
            checklistStatusHint =
              "salva o conteúdo e disponibiliza o check list para ser respondido.";
          }
          if (checklistStatus.status === "Inativo") {
            checklistStatusHint = "inativa o check list.";
          }
          this.checklistStatusHintMap.set(
            checklistStatus.id,
            checklistStatusHint
          );
        });
        this.removeFromLoadingStack("doLoadChecklistStatusList");
      });
  }

  addChecklistSessionHandler(event: string) {
    this.doAddChecklistSession(event);
  }

  doAddChecklistSession(name: string) {
    const newChecklistSession = new ChecklistSession();
    newChecklistSession.session = name;
    newChecklistSession.checklistQuestions.push(new ChecklistQuestion());
    this.checklist.checklistSessions.push(newChecklistSession);
    this.setChecklistQuestionOnEdit(newChecklistSession.checklistQuestions[0]);
  }

  editChecklistSessionHandle(event: { name: string; index: number }) {
    const checklistSessionFormList = this.checklistForm.get(
      "checklistSessionFormList"
    ) as FormArray;
    checklistSessionFormList.controls[event.index].patchValue({
      sessionTitle: event.name,
    });
    this.checklist.checklistSessions[event.index].session = event.name;
  }

  removeChecklistSessionHandle(event: number) {
    this.confirmDialogHandler
      .call(
        "Excluir Seção",
        "Esta ação irá excluir todas as perguntas desta seção. Deseja continuar?",
        { trueValue: "Sim", falseValue: "Não" }
      )
      .subscribe((confirm) => {
        if (confirm) {
          const removedChecklistSessionList = this.checklist.checklistSessions.splice(
            event,
            1
          );
          if (
            removedChecklistSessionList[0].checklistQuestions.includes(
              this.checklistQuestionOnEdit
            )
          ) {
            const previousChecklistQuestionList = this.checklist
              .checklistSessions[event - 1].checklistQuestions;
            const previousChecklistQuestionListLength =
              previousChecklistQuestionList.length;
            this.setChecklistQuestionOnEdit(
              previousChecklistQuestionList[
              previousChecklistQuestionList.length - 1
              ]
            );
          }
          this.doRemoveChecklistSessionForm(event);
        }
      });
  }

  doAddChecklistSessionForm(event: FormGroup, index: any) {
    setTimeout(() => {
      const checklistSessionFormList = this.checklistForm.get(
        "checklistSessionFormList"
      ) as FormArray;
      this.doRemoveChecklistSessionForm(index);
      checklistSessionFormList.insert(index, event);
    });
  }

  doRemoveChecklistSessionForm(index: any) {
    const checklistSessionFormList = this.checklistForm.get(
      "checklistSessionFormList"
    ) as FormArray;
    checklistSessionFormList.removeAt(index);
  }

  setChecklistQuestionOnEdit(checklistQuestion: ChecklistQuestion) {
    this.checklistQuestionOnEdit = checklistQuestion;
  }

  sessionRequired(): boolean {
    return !(
      this.checklist.checklistSessions &&
      this.checklist.checklistSessions.length > 1
    );
  }

  canSave(): boolean {
    return (
      this.checklistForm.valid && !this.checklistForm.pristine && !this.isSaving
    );
  }

  notifyForm() {
    if (this.checklistForm.controls.checklistTitle.valid) {
      this.notifyUser("PREENCHA O TÍTULO DA SEÇÃO E TODAS AS QUESTÕES!");
    } else {
      this.notifyUser("PREENCHA O TÍTULO DO CHECKLIST!");
    }
  }

  doSaveChecklist() {
    if (!this.isFormValid()) {
      this.notifyForm();
      return;
    }

    this.isSaving = true;
    this.checklist.userChange = this.sessionsService.getCurrent();
    this.checklist.userChangeId = this.sessionsService.getCurrent().id;

    this.checklistService.saveChecklist(this.checklist).subscribe(
      (checklist: Checklist) => {
        this.updateChecklistIds(checklist);
        this.isSaving = false;
        this.checklistForm.markAsPristine();
        this.appMessageService.showSuccess("Checklist salvo com sucesso!");
      },
      (error) => {
        this.isSaving = false;
        this.appMessageService.errorHandle(
          error,
          "Erro ao salvar o checklist!"
        );
      }
    );
  }

  updateChecklistIds(newChecklist: Checklist) {
    this.checklist.id = newChecklist.id;
    for (const newSession of newChecklist.checklistSessions) {
      const newSessionIndex = newChecklist.checklistSessions.indexOf(
        newSession
      );
      this.checklist.checklistSessions[newSessionIndex].id = newSession.id;
      for (const newQuestion of newSession.checklistQuestions) {
        const newQuestionIndex = newSession.checklistQuestions.indexOf(
          newQuestion
        );
        this.checklist.checklistSessions[newSessionIndex].checklistQuestions[
          newQuestionIndex
        ].id = newQuestion.id;
      }
    }
  }

  addToLoadingStack(key: string) {
    this.loadingStack.add(key);
  }

  removeFromLoadingStack(key: string) {
    this.loadingStack.delete(key);
  }

  isLoadingActive(key?: string): boolean {
    if (key) {
      return this.loadingStack.has(key);
    }

    return this.loadingStack.size > 0;
  }
}
