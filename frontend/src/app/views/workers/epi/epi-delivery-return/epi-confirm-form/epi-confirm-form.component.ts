import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Moment } from 'moment/moment';

import { SessionsService } from 'app/shared/services/sessions.service';
import { WorkerService } from 'app/shared/services/worker.service';

import { Worker } from 'app/shared/models/worker.model';
import { CaEpi } from 'app/shared/models/ca-epi.model';
import { IndividualEquipment } from 'app/shared/models/individual-equipment.model';

@Component({
  selector: 'epi-confirm-form',
  templateUrl: './epi-confirm-form.component.html',
  styleUrls: ['./epi-confirm-form.component.scss']
})
export class EpiConfirmFormComponent implements OnInit {

  readonly workerPasswordConfirmationInfoParamId = 1;
  readonly passwordMinLength = 4;
  readonly passwordMaxLength = 8;
  readonly birthDateConfirmPattern = '^[0-9]{0,2}$';
  readonly dateFields = [{ type: 1, text: 'dia', pattern: 'DD' }, { type: 2, text: 'mês', pattern: 'MM' }, { type: 3, text: 'ano', pattern: 'YY' }];

  @Input() worker: Worker;
  @Input() episData = {
        deliver: new Array<CaEpi>(),
        return: new Array<CaEpi>(),
        form: new FormGroup({}),
        availableDeliverEpi: new Map<Number, any>(),
        availableReturnEpi: new Map<Number, any>(),

        returnIndividualEquipmentList: new Array<IndividualEquipment>(),
        deliveryIndividualEquipmentList: new Array<IndividualEquipment>(),
        availableReturnIndividualEquipment: new Map<Number, any>(),
        availableDeliveryIndividualEquipment: new Map<Number, any>(),
    };

  dateFieldToValidate: any;
  onChangePassword: boolean;
  workerPasswordConfirmationInfoLabel: string;

  workerPasswordConfirmationForm: FormGroup;
  workerPasswordChangeForm: FormGroup;

  constructor(
    private sessionsService: SessionsService,
    private workerService: WorkerService
  ) { }

  ngOnInit() {
    this.onChangePassword = ! this.worker.hasPassword;

    this.dateFieldToValidate = this.getDateFieldToValidate();

    this.workerPasswordConfirmationForm = new FormGroup({
        password: new FormControl('', [Validators.required]),
    });

    this.workerPasswordChangeForm = new FormGroup({
        newPassword: new FormControl('', [Validators.required, Validators.minLength(this.passwordMinLength), Validators.maxLength(this.passwordMaxLength)]),
        newPasswordConfirm: new FormControl('', [Validators.required]),
        birthDateConfirm: new FormControl('', [Validators.required, Validators.pattern(this.birthDateConfirmPattern), this.getFunctionValidateBirthDateConfirm()]),
    }, this.functionValidatePasswordMatch);

    this.sessionsService.getParam(this.workerPasswordConfirmationInfoParamId).subscribe(
      param => {
        this.workerPasswordConfirmationInfoLabel = param.paramLabel;
      }
    );
  }

  private getDateFieldToValidate() {
    return this.dateFields[Math.floor(Math.random() * this.dateFields.length)];
  }

  functionValidatePasswordMatch(formGroup: FormGroup) {
    const passwordMatch = formGroup.controls.newPassword.value === formGroup.controls.newPasswordConfirm.value;
    if (! passwordMatch && ! formGroup.controls.newPassword.errors) {
      formGroup.controls.newPasswordConfirm.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    if (formGroup.controls.newPasswordConfirm.hasError('mismatch')) {
      formGroup.controls.newPasswordConfirm.setErrors(null);
      formGroup.controls.newPasswordConfirm.updateValueAndValidity();
    }
    return null;
  }

  getFunctionValidateBirthDateConfirm() {
    return (control: FormControl) => {
      let valueFilledWithZero = control.value;
      while (valueFilledWithZero.length < 2) { valueFilledWithZero = '0' + valueFilledWithZero; }
      if (valueFilledWithZero !== this.worker.birthDate.format(this.dateFieldToValidate.pattern)) {
        return { invalid: true };
      }
      return null;
    };
  }

  doChangePassword() {
    this.onChangePassword = true;
  }

  doCancelChangePassword() {
    this.onChangePassword = false;
  }

  doSubmitWorkerPasswordForm(): Observable<any> {
    if (this.onChangePassword) {
      return this.doSubmitWorkerPasswordChangeForm();
    }

    return this.doSubmitWorkerPasswordConfirmationForm();
  }

  doSubmitWorkerPasswordConfirmationForm(): Observable<any> {
    const params = {
      workerId: this.worker.id,
      password: this.workerPasswordConfirmationForm.controls.password.value,
    };
    return this.workerService.validatePassword(params);
  }

  doSubmitWorkerPasswordChangeForm(): Observable<any> {
    const params = {
      workerId: this.worker.id,
      password: this.workerPasswordChangeForm.controls.newPassword.value,
      validationType: this.dateFieldToValidate.type,
      validationValue: this.workerPasswordChangeForm.controls.birthDateConfirm.value,
    };
    return this.workerService.updatePassword(params);
  }

}
