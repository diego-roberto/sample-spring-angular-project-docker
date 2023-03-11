import { Component, OnInit } from '@angular/core';
import { ChecklistService } from '../../../../../../shared/services/checklist.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppMessageService } from '../../../../../../shared/util/app-message.service';
import { ChecklistReplicateProccess } from '../../../../../../shared/models/checklist-replicate-proccess.model';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'checklist-replicate-status',
  templateUrl: './checklist-replicate-status.component.html',
  styleUrls: ['./checklist-replicate-status.component.scss']
})
export class ChecklistReplicateStatusComponent implements OnInit {

  checklistId: number;
  listChecklistReplicateProccess: ChecklistReplicateProccess[];

  checklistReplicateFormGroup: FormGroup;
  constructor(private checklistService: ChecklistService,
    private router: Router,
    private route: ActivatedRoute,
    private appMessage: AppMessageService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.checklistReplicateFormGroup = this.formBuilder.group({
      selectedItems: this.formBuilder.array([])
    });

    this.route.params.subscribe(params => {
      this.checklistId = params['id'];
      this.findAll();
    });

  }

  findAll() {
    this.checklistService.getChecklistProccessStatusList(this.checklistId).subscribe(listChecklistReplicateProccess => {
      this.listChecklistReplicateProccess = listChecklistReplicateProccess;
    });
  }

  onChange(event) {
    const selectedItems = <FormArray>this.checklistReplicateFormGroup.get('selectedItems') as FormArray;

    if (event.checked) {
      selectedItems.push(new FormControl(event.source.value))
    } else {
      const i = selectedItems.controls.findIndex(x => x.value === event.source.value);
      selectedItems.removeAt(i);
    }
  }

  isValidForm() {
    if (this.checklistReplicateFormGroup.value.selectedItems.length > 0) {
      return true;
    }
    return false;
  }

  replicate(): any {
    let selectedItems = this.checklistReplicateFormGroup.value.selectedItems;
    this.checklistService.replicate(this.checklistId, selectedItems).subscribe(item => {

      this.appMessage.showSuccess("Solicitação enviada com sucesso.");
      this.findAll();
    })
  }

}
