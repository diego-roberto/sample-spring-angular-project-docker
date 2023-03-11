import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

import { OccurrenceService } from 'app/shared/services/occurrence.service';

import {
  Occurrence,
  TypeOccurrence,
  OccurrenceSubType,
} from './../../../../../../shared/models/occurrence.model';

@Component({
  selector: 'occurrences-data-form',
  templateUrl: './occurrences-data-form.component.html',
  styleUrls: ['./occurrences-data-form.component.scss'],
})
export class OccurrencesDataFormComponent implements OnInit {
  @Input() occurrence: Occurrence;
  @Input() disabled: boolean;
  @Input() onEdit: boolean;

  oneStepFormGroup: FormGroup;
  limitMaxDate: Date = new Date();
  types: Array<TypeOccurrence>;
  occurrencesSubTypes: Map<number, OccurrenceSubType[]> = new Map<
    number,
    OccurrenceSubType[]
  >();

  descOccurrenceMaxLength = 400;

  constructor(
    private _formBuilder: FormBuilder,
    public occurrenceService: OccurrenceService,
  ) { }

  ngOnInit() {
    this.createListTypesOccurrence();
    this.oneStepFormGroup = this._formBuilder.group({
      typeOcurrence: ['', Validators.required],
      subTypeOcurrence: [],
      descOcurrence: ['', Validators.required],
      sector: [{ value: '', disabled: this.onEdit }, Validators.required],
      locale: [{ value: '', disabled: this.onEdit }, Validators.required],
      dateOcurrence: [
        { value: '', disabled: this.onEdit },
        Validators.required,
      ],
    });
  }

  createListTypesOccurrence(): void {
    this.types = new Array<TypeOccurrence>();
    this.types.push(new TypeOccurrence(1, 'acidente'));
    this.types.push(new TypeOccurrence(2, 'incidente'));
    this.types.push(new TypeOccurrence(3, 'irregularidades'));
    this.types.push(new TypeOccurrence(4, 'boas práticas'));
  }

  setOccurrenceSubTypes(occurrenceType: TypeOccurrence) {
    if (!occurrenceType) {
      return;
    }

    if (!this.occurrencesSubTypes.has(occurrenceType.id)) {
      this.occurrenceService
        .getOccurrenceSubTypeList(occurrenceType.id)
        .subscribe(
          subTypes => {
            this.occurrencesSubTypes.set(occurrenceType.id, subTypes);
          },
          error => { },
        );
    }
  }

  getOccurrenceSubTypes(occurrenceType: TypeOccurrence): OccurrenceSubType[] {
    if (!occurrenceType) {
      return [];
    }

    if (this.occurrencesSubTypes.has(occurrenceType.id)) {
      return this.occurrencesSubTypes.get(occurrenceType.id);
    }

    return [];
  }

  occurrenceTypeHasSubTypes(): boolean {
    return (
      this.occurrence.occurrenceType &&
      this.occurrencesSubTypes.has(this.occurrence.occurrenceType.id) &&
      this.occurrencesSubTypes.get(this.occurrence.occurrenceType.id).length > 0
    );
  }

  clearRequiredValidatorFromOccurrenceSubTypes() {
    this.oneStepFormGroup.controls.subTypeOcurrence.clearValidators();
    this.oneStepFormGroup.controls.subTypeOcurrence.reset();
  }

  get occurrenceSubTypeSelected(): number {
    if (this.occurrence.occurrenceSubType) {
      return this.occurrence.occurrenceSubType.id;
    }
    return undefined;
  }

  set occurrenceSubTypeSelected(id: number) {
    const occurrenceSubTypeFound = this.getOccurrenceSubTypes(
      this.occurrence.occurrenceType,
    ).find(e => e.id == id);
    if (occurrenceSubTypeFound) {
      this.occurrence.occurrenceSubType = occurrenceSubTypeFound;
    }
  }

  get occurrenceTypeSelected(): string {
    if (this.occurrence.occurrenceType) {
      return this.occurrence.occurrenceType.id.toString();
    }
    return undefined;
  }

  set occurrenceTypeSelected(id: string) {
    if (
      this.occurrence.occurrenceType &&
      this.occurrence.occurrenceType.id != Number(id)
    ) {
      this.occurrence.occurrenceSubType = undefined;
    }
    this.occurrence.occurrenceType = this.types.find(e => e.id == Number(id));
    this.clearRequiredValidatorFromOccurrenceSubTypes();
    this.setOccurrenceSubTypes(this.occurrence.occurrenceType);
  }
}
