import { Component, OnInit, ViewChild } from '@angular/core';
import { WorkerService } from '../../../../shared/services/worker.service';
import { MdSnackBar } from '@angular/material';
import { SessionsService } from '../../../../shared/services/sessions.service';
import { ConfirmDialogHandler } from '../../../../shared/util/generic/confirm-dialog/confirm-dialog.handler';
import { TestBed } from '@angular/core/testing';

@Component({
  selector: 'upload-workers',
  templateUrl: './upload-workers.component.html',
  styleUrls: ['./upload-workers.component.scss']
})
export class UploadWorkersComponent implements OnInit {

  theFile: File;
  messageError: string[];
  downloadUrl: string;
  messageSuccess: string;
  loading: boolean = false;

  @ViewChild('inputFile') inputFile;

  constructor(private workerService: WorkerService, public snackBar: MdSnackBar,
    private confirmDialogHandler: ConfirmDialogHandler,
    private sessionsService: SessionsService) { }

  ngOnInit() {
    this.downloadUrl = '/workers/attachment/workers_template?tenant=' + this.sessionsService.getCurrentCompany().tenantSchema;
  }

  onFileSelect(file) {
    const fileReader = new FileReader();

    fileReader.onload = ((fileRead) => {
      return (e) => {
        this.theFile = fileRead;
      };
    })(file);
    fileReader.readAsDataURL(file);
  }

  confirmUpload() {
    this.confirmDialogHandler.call('Atenção!', 'Os dados de trabalhadores já cadastrados serão atualizadas com a realização da importação. Deseja realmente continuar?', { trueValue: "Confirmar", falseValue: "Cancelar" }).subscribe((confirm) => {
      if (confirm) {
        this.uploadWorker();
      }
    });
  }

  uploadWorker() {
    this.messageSuccess = null;
    this.messageError = null;
    this.loading = true;
    this.workerService.uploadWorkers(this.theFile).subscribe(result => {
      this.loading = false;

      if (result.message.indexOf('/')) {
        result.message = result.message.split('/')
      } else {
        result.message = [result.message]
      }

      this.messageSuccess = result.message;
      this.notifyUser("Trabalhadores importados com sucesso!");
      this.inputFile.clearFile();
    },
      error => {
        this.loading = false;
        console.log(error);
        this.notifyUser("Falha ao importar trabalhadores");
        let errorBody = JSON.parse(error._body);
        if (errorBody.errors && errorBody.errors.length > 0) {
          this.messageError = errorBody.errors;
        }
      }
    )
  }

  protected notifyUser(message: string) {
    this.snackBar.open(message, null, { duration: 5000 });
  }

  clearFile() {
    this.theFile = null;
  }
}
