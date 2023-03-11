import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DegreeService } from '../../../../../shared/services/degree.service';
import { Degree } from '../../../../../shared/models/degree.model';

@Component({
  selector: 'settings-degree-dialog',
  templateUrl: './settings-degree-dialog.component.html',
  styleUrls: ['./settings-degree-dialog.component.scss']
})
export class SettingsDegreeDialogComponent implements OnInit {

  title:string= "Cadastro de Escolaridade";
  public degreeForm: FormGroup;
  degree:Degree;
  constructor( public dialogRef: MdDialogRef<SettingsDegreeDialogComponent>,
    private fb: FormBuilder,
    private degreeService:DegreeService,
    @Inject(MD_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.degree = this.data.degree;
    this.degreeForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
    });

    if(this.degree){
      this.degreeForm.patchValue(this.degree);
    }
  }

   save(){
       if(this.degreeForm.valid){
        let degree = this.degreeForm.value;
        if(this.degree){
          degree.id = this.degree.id;
        }
        this.degreeService.saveDegree(degree).subscribe(result=>{
            this.closeDialog();
        });

       }
   }



   closeDialog() {
    this.dialogRef.close();
   }

}
