import { DatePipe } from "@angular/common";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
  AbstractControl
} from "@angular/forms";
import { Component, EventEmitter, Output } from "@angular/core";

import { WorkerItemResolver } from "app/resolves/worker-item.resolver";
import { isNullOrUndefined } from "util";
import { UtilValidators } from "app/shared/util/validators.util";
import { EventSave } from "app/shared/util/generic/form/event-save";
import { Worker } from "app/shared/models/worker.model";
import { Aso, NrType, AsoType, AsoNrType } from "app/shared/models/aso.model";
import { ConfirmDialogHandler } from "app/shared/util/generic/confirm-dialog/confirm-dialog.handler";
import * as _ from "lodash/collection";
import * as Moment from "moment";
import { WorkerFormBase } from "../worker-generic/worker-form-base";
import { WorkerHealth } from "./worker-health-form.model";
import { AsoService } from "app/shared/services/aso.service";

@Component({
  selector: "worker-health-form",
  templateUrl: "./worker-health-form.component.html",
  styleUrls: ["./worker-health-form.component.scss"]
})
export class WorkerHealthFormComponent extends WorkerFormBase<WorkerHealth> {
  @Output()
  savedWorkerHealth: EventEmitter<EventSave<Worker>> = new EventEmitter();
  public healthForm: FormGroup;

  asoTypesList: AsoType[];
  nrTypesList: NrType[];

  readonly bloodTypes = [
    { value: "0", viewValue: "A+" },
    { value: "1", viewValue: "A-" },
    { value: "2", viewValue: "B+" },
    { value: "3", viewValue: "B-" },
    { value: "4", viewValue: "AB+" },
    { value: "5", viewValue: "AB-" },
    { value: "6", viewValue: "O+" },
    { value: "7", viewValue: "O-" }
  ];

  readonly asoTypes = [
    { value: 1, hasAbleOption: true, nextDateDescription: "Data periódico" },
    { value: 2, hasAbleOption: false, nextDateDescription: "Data demissão" },
    { value: 3, hasAbleOption: true, nextDateDescription: "Próximo exame" },
    { value: 4, hasAbleOption: true, nextDateDescription: "Data periódico" },
    { value: 5, hasAbleOption: true, nextDateDescription: "Data periódico" },
    { value: 6, hasAbleOption: true, nextDateDescription: "Data periódico" },
  ];

  constructor(
    private fb: FormBuilder,
    protected workerItemResolver: WorkerItemResolver,
    private confirmDialog: ConfirmDialogHandler,
    private datePipe: DatePipe,
    private service: AsoService,
  ) {
    super(workerItemResolver);
    this.model.asos = _.orderBy(this.model.asos, ["nextDate"]);

    this.healthForm = this.fb.group({
      bloodType: new FormControl("", []),
      allergies: new FormControl("", [UtilValidators.onlytextAndSeparator]),
      diseases: new FormControl("", [UtilValidators.onlytextAndSeparator]),
      asos: this.fb.array(this.createForms(this.model.asos))
    });
  }

  ngOnInit() {
    this.getAsoAndNrList()
  }

  save() {
    const { integration } = this.model;
    this.setNrTypeToNullIfDismissal();
    this.setAsoNrTypes();

    this.savedWorkerHealth.emit({
      modelToSave: this.model,
      onSaved: () => {
        this.healthForm.updateValueAndValidity();

        this.model.asos.forEach((aso, i) => {
          if (aso.shelved) {
            this.getFormGroup(i).disable();
          } else if (aso.id) {
            this.getFormGroup(i).controls.asoType.disable();
            this.getFormGroup(i).controls.realizationDate.disable();
            if (!integration) {
              this.getFormGroup(i).controls.nextDate.disable();
              this.getFormGroup(i).controls.nrType.disable();
            }
          } else if (!aso.id) {
            this.getFormGroup(i).enable();
          }
        });
        this.model.asos = _.orderBy(this.model.asos, ["nextDate"]);
        this.model.integration = integration;
      }
    });
  }

  setAsoNrTypes() {
    for (let aso of this.model.asos) {
      aso.asoNrTypes = aso.asoNrIds.map(id => {

        let asoNrType = new AsoNrType();
        let nrType = new NrType();

        nrType.id = id;
        asoNrType.nrType = nrType;

        if (aso.asoNrTypes) {
          let findItem = aso.asoNrTypes.find(ant => ant.nrType && ant.nrType.id === id);
          if (findItem) {
            asoNrType.id = findItem.id;
          }
        }

        return asoNrType;
      });
    }
  }

  setNrTypeToNullIfDismissal() {
    this.model.asos.map(aso => {
      if (aso.asoType.id === 2) {
        aso.nrType = null;
        aso.asoNrTypes = null;
      }
    })
  }

  addAso() {
    const aso = new Aso();
    aso.asoType = new AsoType();

    this.addForm(aso);
    const toAdd = aso;
    this.model.asos.push(toAdd);
  }

  removeAso(index) {
    const deleteFunction = () => {
      this.removeForm(index);
      this.model.asos.splice(index, 1);
      this.model.asos = _.orderBy(this.model.asos, ["nextDate"]);

      if (!this.isCreating() && this.healthForm.valid) {
        this.save()
      }

      this.updateAsosValidation();
    };

    if (!isNullOrUndefined(this.model.asos[index].asoType)) {
      this.confirmDialog
        .call("Alerta", "Tem certeza que deseja excluir esse ASO?")
        .subscribe(wantsDelete => {
          if (wantsDelete) {
            this.setNrTypeToNullIfDismissal();
            deleteFunction();
          }
        });
    } else {
      deleteFunction();
    }
  }


  disableAble(index: number) {
    const disabled = this.disabledAble(this.model.asos[index]);

    if (this.model.asos[index].asoType.id === 2) {
      this.getFormGroup(index).controls.nrType.disable();
    } else {
      this.getFormGroup(index).controls.nrType.enable();
    }

    if (disabled) {
      this.getFormGroup(index).controls.able.reset({
        value: null,
        disabled: true
      });
    } else {
      this.getFormGroup(index).controls.able.enable();
    }
  }

  disabledAble(aso: Aso) {
    return (
      isNullOrUndefined(aso.asoType.id) ||
      !this.getTypeByCode(aso.asoType.id).hasAbleOption
    );
  }

  nextDateDescription(index: number): string {
    const typeCode = this.model.asos[index].asoType.id;
    return !isNullOrUndefined(typeCode)
      ? this.getTypeByCode(typeCode).nextDateDescription
      : "";
  }

  isTypeSelected(index: number): boolean {
    return !isNullOrUndefined(this.model.asos[index].asoType);
  }

  private getTypeByCode(code: number): any {
    let asoType = this.asoTypes.find(type => {
      return type.value === code;
    });

    if (!isNullOrUndefined(asoType)) {
      return asoType;
    }

    return { value: 1, hasAbleOption: true, nextDateDescription: "Data periódico" };
  }

  onFileSelect(file, i) {
    const fileReader = new FileReader();
    fileReader.onload = ((readFile: File) => {
      return e => {
        this.model.asos[i].attachment = readFile;
        this.model.asos[i].attachmentFilename = readFile.name;
      };
    })(file);
    fileReader.readAsDataURL(file);
  }

  clearFile(aso) {
    aso.attachment = null;
    aso.attachmentFilename = null;
    aso.attachmentUrl = null;
  }

  undoClear(aso, oldValues) {
    aso.attachment = oldValues.file;
    aso.attachmentFilename = oldValues.fileName;
    aso.attachmentUrl = oldValues.fileUrl;
  }

  due(aso: Aso): boolean {
    if (!aso.nextDate || aso.asoType.id === 2) {
      return false;
    } else {

      if (this.model.asos.find(asoItem => asoItem.id === aso.id)) {
        return new Date() > aso.nextDate;
      }
    }

    return false;
  }

  warningToday(aso: Aso): boolean {
    return aso && !aso.id && aso.realizationDate < new Date();
  }

  expired(aso: Aso): boolean {
    if (aso.shelved) {
      return true;
    }

    if (Moment(aso.nextDate).isBefore(new Date())) {
      return true;
    }

    return false;
  }

  getFormArray(): FormArray {
    return <FormArray>this.healthForm.controls.asos;
  }

  getFormGroup(index: number): FormGroup {
    return <FormGroup>this.getFormArray().controls[index];
  }

  getAsoAndNrList() {
    this.service.getAsoTypesList().subscribe(asoTypesList => {
      this.service.getNrTypesList().subscribe(nrTypesList => {
        this.asoTypesList = asoTypesList;
        this.nrTypesList = nrTypesList;
      }, error => {
        console.log(error)
      })
    }, error => {
      console.log(error)
    })
  }

  initForm(aso: Aso): FormGroup {
    const formGroup = new AsoFormGroup({
      asoType: new FormControl("", [Validators.required]),
      nrType: new FormControl("", [Validators.required]),
      realizationDate: new FormControl("", [
        UtilValidators.date,
        this.validateRealizationDate()
      ]),
      nextDate: new FormControl("", [UtilValidators.date, this.validateRange]),
      able: new FormControl({
        value: aso.able,
        disabled: this.disabledAble(aso)
      }),
      shelved: new FormControl({ value: aso.shelved, disabled: false })
    }).referenceModel(aso);

    if (aso.shelved) {
      formGroup.disable();

    } else if (aso.id) {

      formGroup.controls.asoType.disable();

      if (
        (aso.asoNrTypes.map(item => !!item.id).find(item => item === true))
        && !this.model.integration
      ) {
        formGroup.controls.nrType.disable();
      }

      formGroup.controls.realizationDate.disable();

      if (!this.model.integration) {
        formGroup.controls.nextDate.disable();
      }
    }

    this.synchronizeRangeValidation(
      formGroup.controls.realizationDate,
      formGroup.controls.nextDate
    );
    this.synchronizeAsoValidation(formGroup.controls.asoType);

    return formGroup;
  }

  private createForms(asos: Aso[]): FormGroup[] {
    const forms: FormGroup[] = [];

    asos.forEach(aso => forms.push(this.initForm(aso)));
    return forms;
  }

  private addForm(aso: Aso) {
    this.getFormArray().push(this.initForm(aso));
  }

  private removeForm(i: number) {
    this.getFormArray().removeAt(i);
  }

  protected create(): WorkerHealth {
    return new WorkerHealth();
  }

  private validateRange(control: AbstractControl): any {
    if (
      isNullOrUndefined(control) ||
      isNullOrUndefined(control.parent) ||
      isNullOrUndefined(control.parent.controls["realizationDate"]) ||
      isNullOrUndefined(control.parent.controls["nextDate"]) ||
      isNullOrUndefined(control.parent.controls["asoType"])
    ) {
      return null;
    }

    let realizationDate = control.parent.controls["realizationDate"].value;
    let nextDate = control.parent.controls["nextDate"].value;
    const asoType = control.parent.controls["asoType"].value;

    realizationDate = realizationDate === "" ? null : realizationDate;
    nextDate = nextDate === "" ? null : nextDate;

    if (
      !isNullOrUndefined(realizationDate) &&
      !isNullOrUndefined(nextDate) &&
      realizationDate >= nextDate &&
      asoType !== 1
    ) {
      return { invalidRange: true };
    }

    if (
      !isNullOrUndefined(realizationDate) &&
      !isNullOrUndefined(nextDate) &&
      realizationDate > nextDate &&
      asoType === 1
    ) {
      return { invalidRange: true };
    }

    return null;
  }

  private validateRealizationDate(): any {
    return (control: FormControl) => {
      if (isNullOrUndefined(control) || isNullOrUndefined(control.parent)) {
        return null;
      }

      const today = new Date(this.datePipe.transform(new Date(), "MM/dd/yyyy"));
      const realizationDate = new Date(
        this.datePipe.transform(control.value, "MM/dd/yyyy")
      );

      if (realizationDate > today) {
        return { afterToday: true };
      }

      return null;
    };
  }

  private synchronizeAsoValidation(asoTypeControl: AbstractControl): void {
    asoTypeControl.statusChanges.subscribe(status => {
      this.updateAsosValidation();

      if (
        asoTypeControl.parent.controls["realizationDate"] !== undefined &&
        asoTypeControl.parent.controls["realizationDate"].value !== undefined
      ) {
        asoTypeControl.parent.controls[
          "realizationDate"
        ].updateValueAndValidity({ emitEvent: false });
      }

      if (
        asoTypeControl.parent.controls["nextDate"] !== undefined &&
        asoTypeControl.parent.controls["nextDate"].value !== undefined
      ) {
        asoTypeControl.parent.controls["nextDate"].updateValueAndValidity({
          emitEvent: false
        });
      }
    });
  }

  private updateAsosValidation() {
    this.getFormArray().controls.forEach((asoForm: FormGroup) => {
      asoForm.controls.asoType.updateValueAndValidity({ emitEvent: false });
    });
  }
  private showNameOfNrTypesAso(aso: Aso){
    if(aso.asoNrTypes === undefined){
      return "";
    }
    let tooltip = "";
    aso.asoNrTypes.forEach(element => {
      tooltip += element.nrType['name']+" - ";
    });
    tooltip = tooltip.slice(0, -3); //Remove - no final da frase
    return tooltip;
  }

  private synchronizeRangeValidation(
    initialDateControl: AbstractControl,
    endDateControl: AbstractControl
  ): void {
    initialDateControl.statusChanges.subscribe(status => {
      endDateControl.updateValueAndValidity({ emitEvent: false });
    });

    endDateControl.statusChanges.subscribe(status => {
      initialDateControl.updateValueAndValidity({ emitEvent: false });
    });
  }

}

class AsoFormGroup extends FormGroup {
  aso: Aso;

  referenceModel(aso: Aso): AsoFormGroup {
    this.aso = aso;
    return this;
  }
}

