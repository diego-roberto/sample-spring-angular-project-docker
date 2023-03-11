import { MdSnackBar } from '@angular/material';
import { ActionPlanItemService } from './../../../../../../../shared/services/action-plan-item.service';
import { ActionPlanItemFormComponent } from './../action-form/action-plan-item-form.component';
import { ActionPlanItem } from './../../../../../../../shared/models/action-plan-item.model';
import { FormGroup } from '@angular/forms';
import { MD_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Output, Input, EventEmitter, Inject, ViewChild } from '@angular/core';
import { User } from 'app/shared/models/user.model';
import { SessionsService } from 'app/shared/services/sessions.service';

@Component({
    selector: 'action-dialog-view',
    templateUrl: './action-view.component.html',
    styleUrls: ['./action-view.component.scss']
})
export class ActionViewComponent implements OnInit {

    title = 'DADOS DA AÇÃO';
    actionPlanItem: ActionPlanItem;
    actionItemForm: FormGroup;
    @Output() savedItem: EventEmitter<ActionPlanItem> = new EventEmitter();

    @ViewChild('actionItemForm') actionItemFormView: ActionPlanItemFormComponent;
    constructor(public snackBar: MdSnackBar,
                @Inject(MD_DIALOG_DATA) public data: any) {
                    this.actionPlanItem = this.data.actionPlanItem;
                    this.actionItemForm = undefined;
    }

    ngOnInit() {
        this.actionItemFormView.form.disable();
        this.actionItemForm = this.actionItemFormView.form;
        this.actionPlanItem = this.data.actionPlanItem;
    }

    save(actionPlanItem: ActionPlanItem) {
        this.savedItem.emit(actionPlanItem);
        this.savedItem.complete();
    }

    isEditMode(): boolean {
        return (this.actionItemForm.valid && this.actionItemForm.dirty);
    }

    isEnableEdit(): boolean {
        return (this.actionItemFormView.form.disabled && (this.actionPlanItem.status !== 'completed'));
    }

    edit() {
        const config = { onlySelf: false, emitEvent: true };
        this.actionItemForm.controls.beginAt.enable(config);
        this.actionItemForm.controls.endAt.enable(config);
        this.actionItemForm.controls.responsibleUser.enable(config);
        this.actionItemForm.controls.newObservation.enable(config);
    }



}
