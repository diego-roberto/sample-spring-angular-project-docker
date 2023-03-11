import { FormArray, FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit, AfterContentChecked } from '@angular/core';
import { forEach } from '@angular/router/src/utils/collection';
import * as Moment from 'moment';
import { isNullOrUndefined } from 'util';
import { Subject } from 'rxjs/Subject';

import { UtilValidators } from 'app/shared/util/validators.util';
import { WorkerItemResolver } from 'app/resolves/worker-item.resolver';
import { MaskUtil } from 'app/shared/util/mask.util';
import { EventSave } from 'app/shared/util/generic/form/event-save';
import { ConfirmDialogHandler } from 'app/shared/util/generic/confirm-dialog/confirm-dialog.handler';
import { QualitiesService } from 'app/shared/services/qualities.service';
import { Qualities } from 'app/shared/models/qualities.model';
import { QualificationsService } from 'app/shared/services/qualifications.service';
import { Qualification } from 'app/shared/models/qualification.model';
import { Worker } from 'app/shared/models/worker.model';
import { WorkerFormBase } from '../worker-generic/worker-form-base';
import { QualificationsForm } from './worker-qualifications-form.model';
import * as _ from 'lodash/collection';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'worker-qualifications-form',
    templateUrl: './worker-qualifications-form.component.html',
    styleUrls: ['./worker-qualifications-form.component.scss'],
    providers: [
        QualitiesService
    ]
})

export class WorkerQualificationsFormComponent extends WorkerFormBase<QualificationsForm> implements OnInit {

    @Output() savedWorkerQualifications: EventEmitter<EventSave<Worker>> = new EventEmitter();

    qualificationsForm: FormGroup;

    @Input() qualities: Qualities[];

    empty = true;

    firstLoad = true;

    constructor(
        private qualificationService: QualificationsService,
        protected workerItemResolver: WorkerItemResolver,
        private confirmDialog: ConfirmDialogHandler,
        private fb: FormBuilder,
        private datePipe: DatePipe) {

        super(workerItemResolver);

        this.model.qualifications = _.orderBy(this.model.qualifications, ['nextDate']);
    }

    ngOnInit() {

        this.empty = this.model.qualifications.length > 0 ? false : true;

        this.qualificationsForm = new FormGroup({
            skills: this.fb.array(this.createForms(this.model.qualifications)),
        });

        this.firstLoad = false;
    }
    /*
     * =========================|
     * Template methods         |
     * =========================|
     */
    getQuality(quality: Qualities): Qualities {
        return quality ? this.skillById(quality.id) : null;
    }

    addSkill(
        addedByRecycling: boolean = false,
        qualification: Qualification = new Qualification().initializeWithJSON({ qualitiesId: {} }),
        position: number = this.model.qualifications.length) {

        this.addForm(qualification, addedByRecycling, position);
        this.model.qualifications.splice(position, 0, qualification);
    }

    hideQuality(i: number) {
        return this.getFormGroup(i).recyclingForm;
    }

    removeSkill(index) {
        this.confirmDialog.call('Alerta', 'Tem certeza que deseja excluir essa qualificação?').subscribe(wantsDelete => {
            if (wantsDelete) {
                this.removeForm(index);
                const removed = this.model.qualifications.splice(index, 1)[0];

                let parent: Qualification;
                if (parent = this.findParentQualification(removed)) {
                    parent.recycling = false;
                }
            }
        });
    }

    getSkillFormError(index: number, control, error): boolean {
        try {
            return this.getFormGroup(index).controls[control].hasError(error);
        } catch (e) {
            return false;
        }
    }

    getSkillFormTouched(index: number, control) {
        try {
            return this.getFormGroup(index).controls[control].touched;
        } catch (e) {
            return false;
        }
    }

    onFileSelect(file, i) {
        const fileReader = new FileReader();
        this.model.qualifications[i].attachment = file;
        fileReader.onload = ((theFile) => {
            return (e) => {
                this.model.qualifications[i].attachmentFilename = theFile.name;
            };
        })(file);
        fileReader.readAsDataURL(file);
    }

    clearFile(qualification) {
        qualification.attachment = null;
        qualification.attachmentUrl = null;
        qualification.attachmentFilename = null;
    }

    undoClear(qualification, oldValues) {
        qualification.attachment = oldValues.file;
        qualification.attachmentUrl = oldValues.fileUrl;
        qualification.attachmentFilename = oldValues.fileName;
    }

    saveQualifications() {
        this.savedWorkerQualifications.emit({
            modelToSave: this.model, onSaved: (worker: Worker) => {

                this.model.qualifications = _.orderBy(this.model.qualifications, ['nextDate']);

                this.qualificationsForm = new FormGroup({
                    skills: this.fb.array(this.createForms(this.model.qualifications))
                });

                this.model.qualifications.forEach((qualification, i) => {
                    if (qualification.id) {
                        this.getFormGroup(i).controls.realizationDate.disable();
                        this.getFormGroup(i).controls.nextDate.disable();
                        this.getFormGroup(i).controls.quality.disable();
                    }
                    if (!qualification.id) { this.getFormGroup(i).enable(); }
                });
            }
        });
    }

    setRealizationDate(i: number, date: Date) {
        this.model.qualifications[i].realizationDate = date;
    }

    getRecyclingOrShelved(qualification: Qualification): string {
        let recyclingOrShelved: string = null;
        if (qualification.shelved) {
            recyclingOrShelved = 'shelved';
        } else if (qualification.recycling) {
            recyclingOrShelved = 'recycling';
        }
        return recyclingOrShelved;
    }

    setRecyclingOrShelved(i: number, value: any) {
        if (value === 'recycling') {
            this.model.qualifications[i].recycling = true;
            this.model.qualifications[i].shelved = false;
            this.addRecyclingSkill(this.model.qualifications[i], this.model.qualifications.length);
        }
        if (value === 'shelved') {
            this.model.qualifications[i].recycling = false;
            this.model.qualifications[i].shelved = true;
        }
    }

    setNextDate(i: number , date: Date) {
        this.model.qualifications[i].nextDate = date;
    }

    disabledRecycling(index: number) {
        return this.getFormGroup(index).invalid;
    }

    /*
     * =========================|
     *  FormArray methods       |
     * =========================|
     */
    getFormArray(): FormArray {
        return <FormArray>this.qualificationsForm.controls.skills;
    }

    getFormGroup(index: number): QualificationFormGroup {
        return <QualificationFormGroup>this.getFormArray().controls[index];
    }

    private createForms(qualifications: Qualification[]): FormGroup[] {
        const forms: FormGroup[] = [];
        qualifications.forEach(qualification => forms.push(this.initForm(qualification)));
        return forms;
    }

    private initForm(qualification: Qualification, addedByRecycling: boolean = false): FormGroup {
        const recycling = !isNullOrUndefined(qualification.qualities.id) && (addedByRecycling || this.findMinorDate(qualification.qualities) !== qualification);

        const realizationDateValidators: ((control) => any)[] = [UtilValidators.date, this.validateRange, this.validateRealizationDate()];
        const nextDateValidators: ((control) => any)[] = [UtilValidators.date, this.validateRange];

        if (recycling) {
            realizationDateValidators.push(Validators.required);
            realizationDateValidators.push(this.validateGreaterThanLast);
            nextDateValidators.push(Validators.required);
            nextDateValidators.push(this.validateGreaterThanLast);
        }

        let isDisabled = false;
        if ((!isNullOrUndefined(qualification.qualities.id) && !recycling) || this.firstLoad) {
            isDisabled = true;
        }

        qualification.able = isNullOrUndefined(qualification.able) ? true : qualification.able;

        const form = new QualificationFormGroup({
            quality: new QualificationFormControl({ value: qualification.qualities, disabled: isDisabled || recycling }, [Validators.required].concat(recycling ? [] : [this.validateUnique])).referenceModel(this, qualification),
            realizationDate: new QualificationFormControl({ value: '', disabled: isDisabled }, realizationDateValidators).referenceModel(this, qualification),
            nextDate: new QualificationFormControl({ value: '', disabled: isDisabled }, realizationDateValidators).referenceModel(this, qualification),
            able: new QualificationFormControl({ value: qualification.able , disabled: false }, []).referenceModel(this, qualification),
            recyclingOrShelved: new QualificationFormControl({value: this.getRecyclingOrShelved(qualification), disabled: false}, []).referenceModel(this, qualification),
            searchTerm: new FormControl(),
        }).setRecycling(recycling);

        if (qualification.shelved) {
            form.disable();
        }

        return form;
    }

    private addForm(qualification: Qualification, addedByRecycling: boolean, index: number = this.getFormArray().length) {
        this.getFormArray().insert(index, this.initForm(qualification, addedByRecycling));
    }

    protected create() {
        return new QualificationsForm();
    }

    private removeForm(i: number) {
        this.getFormArray().removeAt(i);
    }

    /*
     * =========================|
     *  Validators methods      |
     * =========================|
     */
    private equalsOrCorrespondent(quality1: Qualities, quality2: Qualities): boolean {
        return this.equalsQuality(quality1, quality2) || this.correspondentRecycling(quality1, quality2);
    }

    private equalsQuality(quality1: Qualities, quality2: Qualities): boolean {
        return quality1 && quality1.id && quality2 && quality2.id && quality1.id === quality2.id;
    }

    private correspondentRecycling(quality1: Qualities, quality2: Qualities): boolean {
        return quality1 && quality1.id && quality2 && quality2.id &&
            (quality1.recyclingId === quality2.id || quality2.recyclingId === quality1.id);
    }

    private validateUnique(control: QualificationFormControl): { invalidQuality: boolean } {
        if (!control.component) {
            return null;
        }
        const formArray: FormArray = control.component.getFormArray();

        const qualification = control.qualification;

        for (let i = 0; i < formArray.controls.length; i++) {
            const formGroup = <QualificationFormGroup>formArray.controls[i];

            const iteratedQualification = (<QualificationFormControl>formGroup.controls.quality).qualification;

            if (!formGroup.recyclingForm && qualification !== iteratedQualification &&
                !iteratedQualification.shelved && !iteratedQualification.recycling &&
                control.component.equalsOrCorrespondent(qualification.qualities, iteratedQualification.qualities)) {

                return { invalidQuality: true };
            }
        }

        return null;
    }

    validateRange(control: AbstractControl): any {
        // Essa validação existe para cenários onde o form chama o método de validação
        // quando ainda não instanciou todos os componentes.
        if (isNullOrUndefined(control) || isNullOrUndefined(control.parent) ||
            isNullOrUndefined(control.parent.controls['realizationDate']) ||
            isNullOrUndefined(control.parent.controls['nextDate'])) {
            return null;
        }

        let realizationDate = control.parent.controls['realizationDate'].value;
        let nextDate = control.parent.controls['nextDate'].value;
        realizationDate = (realizationDate === '' ? null : realizationDate);
        nextDate = (nextDate === '' ? null : nextDate);

        if (!isNullOrUndefined(realizationDate) && !isNullOrUndefined(nextDate) && realizationDate >= nextDate) {
            return { invalidRange: true };
        }

        return null;
    }

    due(qualification: Qualification) {
        // essa validação existe para o cenario que a qualificação
        // caso ela seja com a data menor que a do dia atual.
        if (qualification) {
            return Moment(qualification.nextDate).isBefore(new Date());
        }
        return false;
    }

    private validateGreaterThanLast(control: QualificationFormControl): { invalidRecyclingDate: boolean } {
        if (!control.component) {
            return null;
        }

        if (control.qualification.minRealization >= new Date(control.value)) {
            return { invalidRecyclingDate: true };
        }

        return null;
    }

    private validateRealizationDate(): any {
        return (control: QualificationFormControl) => {
            if (
                isNullOrUndefined(control) ||
                isNullOrUndefined(control.parent)
            ) {
                return null;
            }

            const today = new Date(this.datePipe.transform(new Date(), 'MM/dd/yyyy'));
            const realizationDate = new Date(this.datePipe.transform(control.qualification.realizationDate, 'MM/dd/yyyy'));

            if (realizationDate > today) {
                return { afterToday: true };
            }

            return null;
        };
    }

    showLateClock(qualification: Qualification) {
        const shelvedOrRecycling = qualification.shelved || qualification.recycling;
        return this.due(qualification) && !shelvedOrRecycling;
    }

    /*
     * =========================|
     *  Auxiliar methods        |
     * =========================|
     */
    private skillById(id: number): Qualities {
        if (!this.qualities || !id) {
            return null;
        }

        let found: Qualities = null;
        this.qualities.forEach(skill => {
            if (skill.id === id) {
                found = skill;
            }
        });

        return found;
    }

    private findMinorDate(quality: Qualities) {
        let minor: Qualification = null;
        this.model.qualifications.forEach(iterated => {
            if (this.equalsOrCorrespondent(quality, iterated.qualities)) {
                if (!minor || (iterated.realizationDate && iterated.realizationDate < minor.realizationDate)) {
                    minor = iterated;
                }
            }
        });
        return minor;
    }


    private findParentQualification(qualification: Qualification) {

        // Try to find the qualification with the greater realization date
        // desconsidering the own qualification.
        let parent = this.findGreaterRealizationDate(qualification);

        // If the qualification was not found, so it searchs for some qualification with
        // null realization date, because the root qualification can be null.
        if (!parent) {
            parent = this.findNullRealizationDate(qualification);
        }

        return parent;
    }

    private findGreaterRealizationDate(qualification: Qualification): Qualification {
        let greater: Qualification = null;
        this.model.qualifications.forEach(iterated => {
            if (iterated !== qualification && this.equalsOrCorrespondent(qualification.qualities, iterated.qualities)) {
                if (iterated.realizationDate && (!greater || iterated.realizationDate > greater.realizationDate)) {
                    greater = iterated;
                }
            }
        });
        return greater;
    }

    private findNullRealizationDate(qualification: Qualification): Qualification {
        let nullRealization: Qualification = null;
        this.model.qualifications.forEach(iterated => {
            if (iterated !== qualification && this.equalsOrCorrespondent(qualification.qualities, iterated.qualities)) {
                if (!iterated.realizationDate) {
                    nullRealization = iterated;
                }
            }
        });
        return nullRealization;
    }

    private addRecyclingSkill(qualification: Qualification, index: number) {
        if (qualification && qualification.recycling) {
            const copy = new Qualification();
            copy.qualities = qualification.qualities.recyclingId ? this.skillById(qualification.qualities.recyclingId) : qualification.qualities;
            copy.recycling = false;
            copy.minRealization = new Date(qualification.realizationDate);
            copy.realizationDate = null;
            copy.nextDate = null;
            this.addSkill(true, copy, index);
        }
    }

    private addMonths(date, months: number): Date {
        return Moment(date).add({ months: months }).toDate();
    }

}

class QualificationFormControl extends FormControl {

    component: WorkerQualificationsFormComponent;

    qualification: Qualification;

    referenceModel(formBase: WorkerQualificationsFormComponent, qualification: Qualification) {
        this.component = formBase;
        this.qualification = qualification;
        return this;
    }
}

class QualificationFormGroup extends FormGroup {

    recyclingForm: boolean;
    recyclingOrShelved: any = 'shelved';

    setRecycling(recycling: boolean): QualificationFormGroup {
        this.recyclingForm = recycling;
        return this;
    }
}
