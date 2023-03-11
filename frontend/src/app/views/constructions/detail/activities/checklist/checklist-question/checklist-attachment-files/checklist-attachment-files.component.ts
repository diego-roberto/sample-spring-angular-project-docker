import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { FileInfo } from 'app/shared/models/file-info.model';
import { ChecklistQuestionAnswer } from 'app/shared/models/checklist-question-answer.model';

@Component({
  selector: 'checklist-attachment-files',
  templateUrl: 'checklist-attachment-files.component.html',
  styleUrls: ['./checklist-attachment-files.component.scss']
})

export class ChecklistAttachmentFilesComponent implements OnInit {

  editable = true;
  supportedFileTypes: Array<string> = ['image/png', 'image/jpeg', 'image/jpg'];
  isWaitingLoad: boolean = true;

  @Input() answers: ChecklistQuestionAnswer;
  @Input('editable') set editableFlag(editable: boolean) {
    editable ? this.editable = true : this.editable = false;
  }

  @Output() sendAttachmentValue: EventEmitter<FileInfo> = new EventEmitter<FileInfo>();
  @Output() sendLoadingFile: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit() {
    const filesToAdd = this.answers.filesChecklistQuestionAnswers
      .filter(fileChecklistQuestionAnswer => !this.answers.attachmentFiles
        .some(attachmentFile => attachmentFile.id === fileChecklistQuestionAnswer.files.id)
      );

    filesToAdd.forEach(checklistQuestionAnswer => {
      this.answers.attachmentFiles.push(checklistQuestionAnswer.files);
    });
  }

  constructor() { }

  attachmentFileAdded(imageFile: any) {
    this.sendLoadingFile.emit(true);
    const newFile = new FileInfo();
    newFile.file = imageFile;
    const fileReader = new FileReader();
    fileReader.onload = ((theFile) => {
      return (e) => {
        if (this.answers.attachmentFiles.length < 3) {
          newFile.resourceFile = fileReader.result;
          newFile.fileName = imageFile.name;
          newFile.fileType = imageFile.type;
          this.sendAttachmentValue.emit(newFile);
        }
      };
    })(imageFile);
    fileReader.readAsDataURL(imageFile);
  }

  attachmentFileEdited(attachmentFile: FileInfo, index: number, imageFile: File) {
    const updatedFile = new FileInfo();
    updatedFile.file = imageFile;

    const fileReader = new FileReader();
    fileReader.onload = ((theFile) => {
      return (e) => {
        updatedFile.resourceFile = fileReader.result;
        updatedFile.fileName = imageFile.name;
        updatedFile.fileType = imageFile.type;
        const newArray = Object.assign(new Array<FileInfo>(), this.answers.attachmentFiles.slice(), { [index]: updatedFile });
        this.answers.attachmentFiles = newArray;
      };
    })(imageFile);
    fileReader.readAsDataURL(imageFile);
  }

  downloadFile(index: number) {
    const downloadedFile = this.answers.attachmentFiles[index];
    const blob = new Blob([downloadedFile.file], { type: downloadedFile.fileType });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }

  removeFile(index: number) {
    this.answers.attachmentFiles.splice(index, 1);
    this.answers.filesChecklistQuestionAnswers.splice(index, 1);
  }

  emitFirstLoadingFile(isLoading: boolean) {
    this.sendLoadingFile.emit(isLoading);
  }

}
