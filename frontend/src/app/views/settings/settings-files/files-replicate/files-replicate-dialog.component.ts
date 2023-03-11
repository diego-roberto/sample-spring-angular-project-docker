import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { FilesService } from '../../../../shared/services/files.service';
import { AppMessageService } from '../../../../shared/util/app-message.service';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { SessionsService } from '../../../../shared/services/sessions.service';
import { User } from '../../../../shared/models/user.model';
import { ManagementsService } from '../../../../shared/services/managements.service';

@Component({
  selector: 'files-replicate-dialog',
  templateUrl: './files-replicate-dialog.component.html',
  styleUrls: ['./files-replicate-dialog.component.scss']
})

export class FilesReplicateDialogComponent implements OnInit {

  fileId: number;
  listTenants: any[];
  currentUser: User;
  tenantList: Array<any> = new Array<any>();
  filesReplicateFormGroup: FormGroup;
  title: string = "Replicar Arquivo nas Empresas";
  loading: boolean = false;

  constructor(public dialogRef: MdDialogRef<FilesReplicateDialogComponent>,
    private filesService: FilesService,
    private appMessage: AppMessageService,
    private formBuilder: FormBuilder,
    private sessionsService: SessionsService,
    private managementsService: ManagementsService,
  ) { }

  ngOnInit() {

    this.filesReplicateFormGroup = this.formBuilder.group({
      selectedItems: this.formBuilder.array([])
    });
    this.fileId = this.dialogRef.componentInstance.fileId;
    this.getManagements();

  }


  onChange(event) {
    const selectedItems = <FormArray>this.filesReplicateFormGroup.get('selectedItems') as FormArray;

    if (event.checked) {
      selectedItems.push(new FormControl(event.source.value))
    } else {
      const i = selectedItems.controls.findIndex(x => x.value === event.source.value);
      selectedItems.removeAt(i);
    }
  }

  checkAll(event) {
    const selectedItems = <FormArray>this.filesReplicateFormGroup.get('selectedItems') as FormArray;

    while (selectedItems.length !== 0) {
      selectedItems.removeAt(0)
    }

    if (event.checked) {
      this.tenantList.forEach(i => {
        i.checked = true
        selectedItems.push(new FormControl(i.id));
      });
    } else {
      this.tenantList.forEach(i => {
        i.checked = false
      });
    }
  }

  isValidForm() {
    if (this.filesReplicateFormGroup.value.selectedItems.length > 0) {
      return true;
    }
    return false;
  }

  replicate(): any {
    this.loading = true;
    let selectedItems = this.filesReplicateFormGroup.value.selectedItems;
    this.filesService.replicate(this.fileId, selectedItems).subscribe(item => {
      this.appMessage.showSuccess("Arquivos replicados com sucesso.");
    })
    this.closeDialog();
  }

  closeDialog() {
    this.loading = false;
    this.dialogRef.close();
  }

  async getManagements() {

    this.currentUser = this.sessionsService.getCurrent();

    return await new Promise((resolve) => {
      this.managementsService.getActiveManagementsListByUser(this.currentUser.id).subscribe(
        managements => {
          managements.forEach(mg => {
            if (mg.company.id != this.currentUser.companyId) {
              this.tenantList.push({
                'id': mg.company.id,
                'company': mg.company.fakeName,
                'schema': mg.company.tenant.schema
              })
            }
          })
          resolve(true);
        }
      );
    })
  }
}
