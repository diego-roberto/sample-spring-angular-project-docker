import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import * as Moment from 'moment';

import { EventSave } from 'app/shared/util/generic/form/event-save';
import { MaskUtil } from 'app/shared/util/mask.util';
import { UtilValidators } from 'app/shared/util/validators.util';
import { Equipment } from 'app/shared/models/equipment.model';
import { Construction } from 'app/shared//models/construction.model';
import { EquipmentCategory } from 'app/shared/models/equipment-categories.model';
import { EquipmentType } from 'app/shared/models/equipment-types.model';
import { EquipmentsService } from 'app/shared/services/equipments.service';
import { EquipmentCategoriesService } from 'app/shared/services/equipment-categories.service';
import { EquipmentTypesService } from 'app/shared/services/equipment-types.service';
import { ConfirmDialogHandler } from 'app/shared/util/generic/confirm-dialog/confirm-dialog.handler';
import { ConstructionItemResolver } from 'app/resolves/construction.item.resolver';
import { ConstructionMaintenance } from 'app/views/constructions/form/construction-form/components/construction-maintenances-form/construction-maintenances-form.model';
import { ConstructionFormBase } from 'app/views/constructions/form/construction-form/components/construction-generic/construction-form-base';

import * as _ from 'lodash/collection';

@Component({
  selector: 'construction-maintenances-form',
  templateUrl: './construction-maintenances-form.component.html',
  styleUrls: ['./construction-maintenances-form.component.scss']
})
export class ConstructionMaintenancesFormComponent extends ConstructionFormBase<ConstructionMaintenance> implements OnInit {
  types: Array<EquipmentType> = [];
  categories: Array<EquipmentCategory> = [];
  done: boolean;
  maintenancesForm: FormGroup;
  number = MaskUtil.variableLengthMask(MaskUtil.NUMBER, 2);

  @Output() saved: EventEmitter<EventSave<Construction>> = new EventEmitter();

  empty = true;

  maxDateLastMaintenance = new Date();

  constructor(
    private equipmentsService: EquipmentsService,
    private categoriesService: EquipmentCategoriesService,
    private typesService: EquipmentTypesService,
    protected constructionItemResolver: ConstructionItemResolver,
    private fb: FormBuilder,
    public confirmDialogHandler: ConfirmDialogHandler
  ) {
    super(constructionItemResolver);
    this.createForm();
  }

  ngOnInit() {
    this.maxDateLastMaintenance = new Date();

    this.typesService.getEquipmentTypesList().subscribe(types => {
      this.types = types.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    });

    this.categoriesService.getEquipmentCategoriesList().subscribe(categories => {
      this.categories = categories.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    });

    this.empty = this.model.equipments.length > 0 ? false : true;
  }

  protected create(): ConstructionMaintenance {
    return new ConstructionMaintenance();
  }

  private createForm() {
    this.maintenancesForm = new FormGroup({
      maintenance: this.fb.array([])
    });
    this.model.equipments.forEach(equipment => {
      this.addForm(equipment.hasMaintenance, equipment.maintenanceDone);
    });
  }

  private initForm(hasMaintenance?: boolean, maintenanceDone?: boolean) {
    const form = new FormGroup({
      category: new FormControl({ value: '', disabled: maintenanceDone }, [Validators.required]),
      type: new FormControl({ value: '', disabled: maintenanceDone }, [Validators.required]),
      identification: new FormControl({ value: '', disabled: maintenanceDone }, [Validators.required]),
      maintenance: new FormControl({ value: '', disabled: maintenanceDone }),
      periodicity: new FormControl({ value: '', disabled: !hasMaintenance || maintenanceDone }, [Validators.required]),
      date: new FormControl({ value: '', disabled: !hasMaintenance || maintenanceDone }, [Validators.required, UtilValidators.date, this.validateMaxDate]),
      done: new FormControl()
    });

    form.statusChanges.subscribe(() => {
      if (form.valid) {
        if (form.controls.done.value) {
          form.disable({ onlySelf: true, emitEvent: false });
        } else if (form.controls.maintenance.value) {
          form.controls.done.enable({ onlySelf: true, emitEvent: false });
        }
      } else {
        form.controls.done.disable({ onlySelf: true, emitEvent: false });
      }
    });

    return form;
  }

  private addForm(hasMaintenance?: boolean, maintenanceDone?: boolean) {
    const maintenance = <FormArray>this.maintenancesForm.controls.maintenance;
    maintenance.push(this.initForm(hasMaintenance, maintenanceDone));
  }

  private removeForm(i: number) {
    const maintenance = <FormArray>this.maintenancesForm.controls.maintenance;
    maintenance.removeAt(i);
  }

  addEquipment(equipment?: Equipment) {
    this.addForm();
    const toAdd = new Equipment();
    toAdd.category = new EquipmentCategory();
    toAdd.type = new EquipmentType();

    if (this.isEditing()) {
      toAdd.construction = this.persistedModel.id;
    }
    if (equipment) {
      this.model.equipments.push(equipment);
    } else {
      this.model.equipments.push(toAdd);
    }
  }

  removeEquipment(index) {
    this.confirmDialogHandler.call('excluir', 'Deseja realmente excluir manutenção?').subscribe((confirm) => {
      if (confirm) {
        this.removeForm(index);
        this.model.equipments.splice(index, 1);
      }
    });
  }

  save() {
    this.saved.emit({
      modelToSave: this.model, onSaved: (Construction) => {
        this.createForm();
      }
    });
  }

  filterItemsOfType(equipment: Equipment) {
    return equipment ? this.types.filter(x => x.category.id === equipment.category.id) : null;
  }

  categoryValidator(index: number) {
    const maintenance = <FormArray>this.maintenancesForm.controls.maintenance;
    const fg = <FormGroup>maintenance.controls[index];

    fg.controls.type.enable();
  }

  maintenance(checked: boolean, index: number) {
    const maintenance = <FormArray>this.maintenancesForm.controls.maintenance;
    const fg = <FormGroup>maintenance.controls[index];
    if (!checked) {
      fg.controls.periodicity.enable();
      fg.controls.date.enable();
    } else {
      fg.controls.periodicity.reset();
      fg.controls.periodicity.disable();

      fg.controls.date.reset();
      fg.controls.date.disable();
    }
    return !checked;
  }

  maintenanceDone(checked: boolean, index: number, equipment: Equipment) {
    if (!checked) {
      const eq = Object.assign(new Equipment, equipment);
      eq.id = undefined;
      eq.lastMaintenance = null;
      eq.maintenanceDone = false;

      this.addForm(eq.hasMaintenance);
      this.model.equipments.push(eq);
    }
    return !checked;
  }

  dropDownCategory(index: number) {
    const maintenance = <FormArray>this.maintenancesForm.controls.maintenance;
    const fg = <FormGroup>maintenance.controls[index];
    if (fg.untouched) {
      return false;
    } else if (fg.controls.category.errors) {
      return true;
    } else {
      return false;
    }
  }

  dropDownType(index: number) {
    const maintenance = <FormArray>this.maintenancesForm.controls.maintenance;
    const fg = <FormGroup>maintenance.controls[index];
    if (fg.untouched) {
      return false;
    } else if (fg.controls.type.errors) {
      return true;
    } else {
      return false;
    }
  }

  private addMonths(date, months: number): Date {
    return Moment(date).add({ months: months }).toDate();
  }

  due(equipment: Equipment): boolean {
    if (!equipment.lastMaintenance || !equipment.periodicity || equipment.maintenanceDone) {
      return false;
    }

    const due = this.addMonths(equipment.lastMaintenance, equipment.periodicity);

    return due && Moment(due).isBefore(new Date(), 'd');
  }

  validateMaxDate(control: AbstractControl) {

    if (!control || !control.parent || !control.parent.controls['date'] || !control.parent.controls['date'].value) {
      return null;
    }
    const date = Moment(control.parent.controls['date'].value);
    const currentDate = Moment(new Date(Moment().format('L')));

    if (currentDate.isBefore(date)) {
      return { isbefore: true };
    }

    return null;
  }
}
