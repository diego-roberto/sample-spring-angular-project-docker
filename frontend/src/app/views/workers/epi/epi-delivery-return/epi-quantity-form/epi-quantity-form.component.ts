import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { arraysAreEqual } from 'tslint/lib/utils';

import { CaEpi } from 'app/shared/models/ca-epi.model';
import { MaskUtil } from 'app/shared/util/mask.util';
import { IndividualEquipment } from 'app/shared/models/individual-equipment.model';

@Component({
  selector: 'epi-quantity-form',
  templateUrl: 'epi-quantity-form.component.html',
  styleUrls: ['./epi-quantity-form.component.scss']
})

export class EpiQuantityFormComponent {

  @Input() set data(data) {
    this.deliveryEpis = data.deliver;
    this.returnEpis = data.return;
    this.availableReturnEpi = data.availableReturnEpi;
    this.availableDeliverEpi = data.availableDeliverEpi;

    this.returnIndividualEquipmentList = data.returnIndividualEquipmentList;
    this.deliveryIndividualEquipmentList = data.deliveryIndividualEquipmentList;
    this.availableReturnIndividualEquipment = data.availableReturnIndividualEquipment;
    this.availableDeliveryIndividualEquipment = data.availableDeliveryIndividualEquipment;

    this.quantityEpiForm = data.form;
    this.quantityEpiForm.statusChanges.subscribe(status => {
      this.statusChange.emit({ valid: this.quantityEpiForm.valid });
    })

    this.quantityEpiForm.valueChanges.subscribe(x => {
      this.dataChange.emit({
        deliver: this.deliveryEpis,
        return: this.returnEpis,
        availableReturnEpi: this.availableReturnEpi,
        availableDeliverEpi: this.availableDeliverEpi,
        returnIndividualEquipmentList: this.returnIndividualEquipmentList,
        deliveryIndividualEquipmentList: this.deliveryIndividualEquipmentList,
        availableReturnIndividualEquipment: this.availableReturnIndividualEquipment,
        availableDeliveryIndividualEquipment: this.availableDeliveryIndividualEquipment,
        form: this.quantityEpiForm
      });
    });

    if (this.availableReturnEpi && this.availableReturnEpi.size > 0) {
      let index = 0;
      for (const epi of this.returnEpis) {
        const i = index;
        this.setFormValidator(this.quantityEpiForm, this.returnControl, index, epi, this.availableReturnEpi);
        index++;
      }
    }
    if (this.availableDeliverEpi && this.availableDeliverEpi.size > 0) {
      let index = 0;
      for (const epi of this.deliveryEpis) {
        const i = index;
        this.setFormValidator(this.quantityEpiForm, this.deliverControl, index, epi, this.availableDeliverEpi);

        index++;
      }
    }

    if (this.availableReturnIndividualEquipment && this.availableReturnIndividualEquipment.size > 0) {
      for (const individualEquipment of this.returnIndividualEquipmentList) {
        const index = this.returnIndividualEquipmentList.indexOf(individualEquipment);
        this.setFormValidator(this.quantityEpiForm, this.returnIndividualEquipmentControl, index, individualEquipment, this.availableReturnIndividualEquipment);

      }
    }

    if (this.availableDeliveryIndividualEquipment && this.availableDeliveryIndividualEquipment.size > 0) {
      for (const individualEquipment of this.deliveryIndividualEquipmentList) {
        const index = this.deliveryIndividualEquipmentList.indexOf(individualEquipment);
        this.setFormValidator(this.quantityEpiForm, this.deliveryIndividualEquipmentControl, index, individualEquipment, this.availableDeliveryIndividualEquipment);

      }
    }
  }
  @Output() dataChange = new EventEmitter<any>();
  @Output() statusChange = new EventEmitter<any>();

  readonly returnControl = 'returnAmount';
  readonly deliverControl = 'deliverAmount';
  readonly returnIndividualEquipmentControl = 'returnIndividualEquipmentAmount';
  readonly deliveryIndividualEquipmentControl = 'deliveryIndividualEquipmentAmount';

  returnEpis: Array<CaEpi>;
  deliveryEpis: Array<CaEpi>;
  availableReturnEpi: Map<Number, any>;
  availableDeliverEpi: Map<Number, any>;
  quantityEpiForm: FormGroup = new FormGroup({});

  returnIndividualEquipmentList: Array<IndividualEquipment>;
  deliveryIndividualEquipmentList: Array<IndividualEquipment>;
  availableReturnIndividualEquipment: Map<Number, any>;
  availableDeliveryIndividualEquipment: Map<Number, any>;

  amountMask = MaskUtil.variableLengthMask(/\d/, 6);

  constructor() { }


  setFormValidator(quantityEpiForm, deliveryIndividualEquipmentControl, index, itemForm, availableDeliveryIndividualEquipment) {
    quantityEpiForm.controls[deliveryIndividualEquipmentControl + index].setValidators([(control: FormControl) => {
      return control.value > availableDeliveryIndividualEquipment.get(itemForm.id).available ? { insufficient: true } : null;
    }, Validators.required, (x) => x.value && Number(x.value) < 1 ? { required: true } : null]);
  }
  getFormError(control, equipment: CaEpi | IndividualEquipment, error) {
    control = this.quantityEpiForm.controls[this.getControlName(control, equipment)];
    if (!control) { return false; }
    return control.hasError(error);
  }

  getControlName(control: string, equipment: CaEpi | IndividualEquipment) {
    if (control === this.deliverControl) { return control + this.deliveryEpis.indexOf(<CaEpi>equipment); }
    if (control === this.returnControl) { return control + this.returnEpis.indexOf(<CaEpi>equipment); }
    if (control === this.deliveryIndividualEquipmentControl) { return control + this.deliveryIndividualEquipmentList.indexOf(<IndividualEquipment>equipment); }
    if (control === this.returnIndividualEquipmentControl) { return control + this.returnIndividualEquipmentList.indexOf(<IndividualEquipment>equipment); }
  }
}
