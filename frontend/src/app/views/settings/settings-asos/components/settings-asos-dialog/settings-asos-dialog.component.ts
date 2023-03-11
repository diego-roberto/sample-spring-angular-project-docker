import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AppMessageService } from 'app/shared/util/app-message.service';
import { AsoType } from 'app/shared/models/aso.model';
import { AsoService } from 'app/shared/services/aso.service';

@Component({
  selector: 'settings-asos-dialog',
  templateUrl: './settings-asos-dialog.component.html',
  styleUrls: ['./settings-asos-dialog.component.scss']
})
export class SettingsAsoDialogComponent implements OnInit {

  public asoForm: FormGroup;
  loading: boolean = false;
  aso: AsoType;

  constructor( public dialogRef: MdDialogRef<SettingsAsoDialogComponent>,
    private fb: FormBuilder,
    private asoService: AsoService,
    private appMessage: AppMessageService,
    @Inject(MD_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.aso = this.data.aso;

    this.asoForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
    });

    if(this.aso){
      this.asoForm.patchValue(this.aso);
    }
  }

  save(){
    if(this.asoForm.valid){
      let aso = this.asoForm.value;

      if(this.aso){
        aso.id = this.aso.id;
      }

      this.loading = true;
      this.asoService.saveAsoType(aso)
      .subscribe(() => {
        this.appMessage.showSuccess('ASO salva com sucesso!');
        this.loading = false;
        this.closeDialog();
      }, 
      (e) => {
        const body = JSON.parse(e._body);
        this.appMessage.showError(body.message);
        this.loading = false;
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
