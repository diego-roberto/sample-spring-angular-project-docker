import { Component, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
    selector: 'worker-cpf-exists-dialog',
    templateUrl: 'worker-cpf-exists-dialog.component.html',
    styleUrls: ['./worker-cpf-exists-dialog.component.scss'],
})
export class WorkerCpfExistsDialogComponent implements OnInit {

  @Output()
  removed = new EventEmitter();

  name: string;
  cpf: string;
  sameCompany: boolean;

  confirmLabel = "Editar existente";
  cancelLabel = "Cancelar";

  constructor() {
  }

  ngOnInit(): void {
    console.log({sameCompany: this.sameCompany});

    if(!this.sameCompany) {
      this.cancelLabel = "Cadastrar novo";
    }
  }

  proceedEditing() {
      this.removed.emit({ wantToEdit: true });
      this.removed.complete();
  }

  proceedWithoutEditing() {
      this.removed.emit({ wantToEdit: false });
      this.removed.complete();
  }
}
