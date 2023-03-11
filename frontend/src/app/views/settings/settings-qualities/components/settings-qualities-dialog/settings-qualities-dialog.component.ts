import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { QualitiesService } from '../../../../../shared/services/qualities.service';
import { Qualities } from '../../../../../shared/models/qualities.model';
import { AppMessageService } from 'app/shared/util/app-message.service';

@Component({
  selector: 'settings-qualities-dialog',
  templateUrl: './settings-qualities-dialog.component.html',
  styleUrls: ['./settings-qualities-dialog.component.scss']
})
export class SettingsQualitiesDialogComponent implements OnInit {

  public qualitiesForm: FormGroup;
  title: string = "Cadastro de Habilitações";
  loading: boolean = false;
  quality: Qualities;

  constructor( public dialogRef: MdDialogRef<SettingsQualitiesDialogComponent>,
    private fb: FormBuilder,
    private qualitiesService: QualitiesService,
    private appMessage: AppMessageService,
    @Inject(MD_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.quality = this.data.quality;

    this.qualitiesForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
    });

    if(this.quality){
      this.qualitiesForm.patchValue(this.quality);
    }
  }

  save(){
    if(this.qualitiesForm.valid){
      let quality = this.qualitiesForm.value;

      if(this.quality){
        quality.id = this.quality.id;
      }

      this.loading = true;
      this.qualitiesService.saveQuality(quality)
      .subscribe(() => {
        this.appMessage.showSuccess('Habilitação salva com sucesso!');
        this.loading = false;
        this.closeDialog();
      }, (e) => {
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
