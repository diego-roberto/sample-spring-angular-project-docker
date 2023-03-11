import { Component, Inject, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ConfirmDialogHandler } from 'app/shared/util/generic/confirm-dialog/confirm-dialog.handler';
import * as Moment from 'moment';
import { UtilValidators } from 'app/shared/util/validators.util';
import { AppMessageService } from 'app/shared/util/app-message.service';
import { EquipmentsService } from "app/shared/services/equipments.service";
import { openNewTab } from 'app/shared/util/open-new-tab';

@Component({
  selector: 'equipment-report-modal',
  templateUrl: './equipment-report-modal.component.html',
  styleUrls: ['./equipment-report-modal.component.scss']
})
export class EquipmentReportModalComponent implements OnInit {

    equipmentScheduleForm: FormGroup;

    equipmentStartDate: '';
    equipmentEndDate: '';
    loading = false;
    constructionId: number;

    constructor(
        @Inject(MD_DIALOG_DATA) public dialogData: any,
        private equipmentsService: EquipmentsService,
        public dialogRef: MdDialogRef<EquipmentReportModalComponent>,
        private appMessage: AppMessageService,
        public confirmDialogHandler: ConfirmDialogHandler,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.constructionId = this.dialogData.constructionId;

        this.equipmentScheduleForm = this.fb.group({
            startDate: new FormControl('', [Validators.required, UtilValidators.date, this.validateBeginDate]),
            endDate: new FormControl('', [Validators.required, UtilValidators.date, this.validateEndDate]),
        });

        this.equipmentStartDate = null;
        this.equipmentEndDate = null;

    }

    verifyPrintEquipments(){
        this.loading = true;
        this.equipmentsService.toPrintEquipmentMaintenanceReport(this.constructionId, this.equipmentStartDate, this.equipmentEndDate).subscribe((response) => {
            openNewTab(URL.createObjectURL(response));
      
            this.loading = false;
            this.dialogRef.close();
        },
        (error) => {
            this.loading = false;
            this.appMessage.errorHandle(error, 'Não foi possível carregar as informações do relatório');
        });

    }

    hasErrorForm(attr: string, type: string): boolean {
        if (this.equipmentScheduleForm.controls[attr].touched || this.equipmentScheduleForm.controls[attr].dirty) {
            return this.equipmentScheduleForm.controls[attr].hasError(type);
        } else {
            return false;
        }
    }

    validateBeginDate(control: AbstractControl) {
        if (!control || !control.parent || !control.parent.controls['startDate'] || !control.parent.controls['startDate'].value) {
            return null;
        }
        const dateEnd = Moment(control.parent.controls['endDate'].value);
        const dateBegin = Moment(control.parent.controls['startDate'].value);
        const currentDate = Moment(new Date(Moment().format('L')));

        const endDateNotInput = (!control.parent.controls['endDate'] || !control.parent.controls['endDate'].value);
        if(!endDateNotInput){
            if (dateEnd.isBefore(dateBegin)) {
                return { isbefore: true };
            }
        }

        return null;
    }

    validateEndDate(control: AbstractControl) {
        if ((!control || !control.parent) || (!control.parent.controls['startDate'] || !control.parent.controls['startDate'].value)
            || (!control.parent.controls['endDate'] || !control.parent.controls['endDate'].value)) {
            return null;
        }

        const dateBegin = Moment(control.parent.controls['startDate'].value);
        const dateEnd = Moment(control.parent.controls['endDate'].value);
        const currentDate = Moment(new Date(Moment().format('L')));
        if (dateEnd.isBefore(dateBegin)) {
            return { isbefore: true };
        }
        return null;
    }

    hasPendingFields(){
        if (this.equipmentEndDate == null){return true; }
        if (this.equipmentStartDate == null){return true; }
        if (this.hasErrorForm('startDate', 'invalid')){return true; }
        if (this.hasErrorForm('startDate', 'isbefore')){return true; }
        if (this.hasErrorForm('startDate', 'isnecessary')){return true; }
        if (this.hasErrorForm('endDate', 'invalid')){return true; }
        if (this.hasErrorForm('endDate', 'isbefore')){return true; }
        if (this.hasErrorForm('endDate', 'isnecessary')){return true; }

        return false;
    }
    

}
