import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { FileInfo } from 'app/shared/models/file-info.model';
import { ChecklistQuestionAnswer } from 'app/shared/models/checklist-question-answer.model';
import { ChecklistPossibleAnswers } from 'app/shared/models/checklist-possible-answers.model';

@Component({
  selector: 'checklist-answer',
  templateUrl: './checklist-answer.component.html',
  styleUrls: ['./checklist-answer.component.scss']
})
export class ChecklistAnswerComponent implements OnInit {

  @Input() checklistPossibleAnswers: ChecklistPossibleAnswers[];
  @Input('editable') set editableFlag(editable: boolean) {
    editable ? this.editable = true : this.editable = false;
  }
  @Input() answers: ChecklistQuestionAnswer;

  @Output() sendAnswerValue: EventEmitter<number> = new EventEmitter<number>();
  @Output() sendAttachmentValue: EventEmitter<FileInfo> = new EventEmitter<FileInfo>();

  supportedFileTypes: Array<string> = ['image/png', 'image/jpeg'];
  editable = true;
  isLoadingFile: boolean;

  constructor() { }

  ngOnInit() {
    this.isLoadingFile = false;
  }

  emitAnswerValue(value) {
    this.sendAnswerValue.emit(value);
  }

  emitAttachmentValue(value) {
    this.sendAttachmentValue.emit(value);
    this.loadingFile(false);
  }

  emitLoadingFile(isLoading) {
    this.loadingFile(isLoading);
  }

  loadingFile(isLoading) {
    this.isLoadingFile = isLoading;
  }

}
