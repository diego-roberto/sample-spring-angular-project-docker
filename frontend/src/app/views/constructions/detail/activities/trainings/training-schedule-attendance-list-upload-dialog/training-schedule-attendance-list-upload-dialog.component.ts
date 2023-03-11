import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MdDialogRef, MdSnackBar, MD_DIALOG_DATA } from '@angular/material';
import { AppMessageService } from '../../../../../../shared/util/app-message.service';
import { PermissionService } from '../../../../../../shared/services/permission.service';
import { TrainingScheduleService } from '../../../../../../shared/services/training-schedule.service';
import { TrainingScheduleConstruction } from '../../../../../../shared/models/training-schedule-construction.model';
import { SessionsService } from '../../../../../../shared/services/sessions.service';
import { FileInfo } from '../../../../../../shared/models/file-info.model';

@Component({
  selector: 'training-schedule-attendance-list-upload-dialog',
  templateUrl: './training-schedule-attendance-list-upload-dialog.component.html',
  styleUrls: ['./training-schedule-attendance-list-upload-dialog.component.scss']
})
export class TrainingScheduleAttendanceListUploadDialogComponent implements OnInit {

  theFile: File;

  public moduleForm: FormGroup;
  downloadUrl: string;
  fileName: string;
  supportedFileTypes: Array<string> = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
  limitAttachmentFiles = 1;

  constructor(
    public dialogRef: MdDialogRef<TrainingScheduleAttendanceListUploadDialogComponent>,
    public snackBar: MdSnackBar,
    private appMessage: AppMessageService,
    private fb: FormBuilder,
    private permissionService: PermissionService,
    private trainingScheduleService: TrainingScheduleService,
    private sessionsService: SessionsService,
    @Inject(MD_DIALOG_DATA) public data: any,
  ) {

  }



  ngOnInit() {
    let trainingScheduleConstruction: TrainingScheduleConstruction = this.data.trainingScheduleConstruction;

    if (trainingScheduleConstruction.attendanceFileName) {
      this.fileName = 'Baixar Assinaturas';
      this.downloadUrl = '/training-schedule/attachment/' + trainingScheduleConstruction.id + '/downloadAttendace?tenant=' + this.sessionsService.getCurrentCompany().tenantSchema;
    }

    this.moduleForm = this.fb.group({
      profile: new FormControl([], [Validators.required]),
    });


  }



  closeDialog() {
    this.dialogRef.close();
  }



  upload() {
    this.trainingScheduleService.uploadAttendanceList(this.data.trainingScheduleConstruction.id, this.theFile).subscribe(resul => {
      this.notifyUser('Lista importada  com sucesso');

      let trainingScheduleConstruction: TrainingScheduleConstruction = this.data.trainingScheduleConstruction;
      trainingScheduleConstruction.attendanceFileName = resul.fileName;
      this.closeDialog();
    },
      error => {

        this.notifyUser('Falha ao importar');

      }
    );
  }

  protected notifyUser(message: string) {
    this.snackBar.open(message, null, { duration: 3000 });
  }

  clearFile() {
    this.theFile = null;
    this.downloadUrl = null;
    this.fileName = null;
  }



  addFile(file: File) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      const fileInfo = new FileInfo();
      fileInfo.resourceFile = file;
      fileInfo.filePath = fileReader.result;

      this.theFile = file;
      this.fileName = file.name;
    };
  }

  removeFile(index: number) {
    //  this.occurrence.files.splice(index, 1);
  }

  isEditableFile(file: FileInfo): boolean {


    return true;
  }

  limitSelectionReached(): boolean {
    if (this.fileName != null) {
      return true;
    }
    // return this.occurrence.files.length >= this.limitAttachmentFiles;
    return false;
  }

}
