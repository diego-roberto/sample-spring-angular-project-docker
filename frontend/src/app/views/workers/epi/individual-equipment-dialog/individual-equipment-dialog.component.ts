import { MdRadioChange, MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Component, OnInit, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';

import { IndividualEquipment } from 'app/shared/models/individual-equipment.model';
import { CaEpi } from 'app/shared/models/ca-epi.model';

import { EpiFormComponent } from 'app/views/workers/epi/epi-form/epi-form.component';
import { IndividualEquipmentFormComponent } from 'app/views/workers/epi/individual-equipment-form/individual-equipment-form.component';

import { AppMessageService } from 'app/shared/util/app-message.service';
import { CaEpiService } from 'app/shared/services/ca-epi.service';
import { IndividualEquipmentService } from 'app/shared/services/individual-equipment.service';

import { isNullOrUndefined } from 'util';

@Component({
  selector: 'individual-equipment-dialog',
  templateUrl: './individual-equipment-dialog.component.html',
  styleUrls: ['./individual-equipment-dialog.component.scss']
})
export class IndividualEquipmentDialogComponent implements OnInit {

  readonly EPI_TYPE = '1';
  readonly OTHER_EQUIPMENT_TYPE = '2';

  @ViewChild('epiFormComponent') epiFormComponent: EpiFormComponent;
  @ViewChild('individualEquipmentFormComponent') individualEquipmentFormComponent: IndividualEquipmentFormComponent;

  title: string;
  loadingStack: Set<string> = new Set<string>();
  equipment: CaEpi | IndividualEquipment;
  equipmentCached: CaEpi | IndividualEquipment;

  constructor(
    private caEpiService: CaEpiService,
    private individualEquipmentService: IndividualEquipmentService,
    private appMessageService: AppMessageService,
    public dialogRef: MdDialogRef<IndividualEquipmentDialogComponent>,
    private changeDetector: ChangeDetectorRef,
    @Inject(MD_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.addToLoadingStack('loadEquipment');
    if (this.data && this.data.caEpiId) {
      this.loadCaEpiToEdit(this.data.caEpiId);
    } else if (this.data && this.data.individualEquipmentId) {
      this.loadIndividualEquipmentToEdit(this.data.individualEquipmentId);
    } else if (this.data && this.data.equipment) {
      this.equipment = this.data.equipment;
      this.removeFromLoadingStack('loadEquipment');
    } else {
      this.equipment = new CaEpi();
      this.removeFromLoadingStack('loadEquipment');
    }
  }

  loadCaEpiToEdit(caEpiId: number) {
    this.caEpiService.getCaEpiById(caEpiId).subscribe(caEpi => {
      this.equipment = caEpi;
      this.removeFromLoadingStack('loadEquipment');
    });
  }

  loadIndividualEquipmentToEdit(individualEquipmentId: number) {
    this.individualEquipmentService.getById(individualEquipmentId).subscribe(individualEquipment => {
      this.equipment = individualEquipment;
      this.removeFromLoadingStack('loadEquipment');
    });
  }

  getDialogTitle(): string {
    if (this.isOnEdit()) {
      if (this.equipment instanceof CaEpi) { return this.equipment.epiId.description; }
      if (this.equipment instanceof IndividualEquipment) { return this.equipment.description; }
    } else {
      if (this.equipment instanceof CaEpi) { return 'Cadastro de Epi'; }
      if (this.equipment instanceof IndividualEquipment) { return 'Cadastro de Equipamento'; }
    }
  }

  onEquipmentTypeChange(event: MdRadioChange) {
    const equipmentToCache = this.equipment;
    this.equipment = this.equipmentCached;
    this.equipmentCached = equipmentToCache;

    if (event.value === this.EPI_TYPE && this.equipment === undefined) {
      this.equipment = new CaEpi();
    }

    if (event.value === this.OTHER_EQUIPMENT_TYPE && this.equipment === undefined) {
      this.equipment = new IndividualEquipment();
    }

    this.changeDetector.detectChanges();
  }

  equipmentTypeChecked(): any {
    if (this.equipment instanceof CaEpi) {
      return this.EPI_TYPE;
    }
    if (this.equipment instanceof IndividualEquipment) {
      return this.OTHER_EQUIPMENT_TYPE;
    }
  }

  save() {
    if (this.equipmentTypeChecked() === this.EPI_TYPE) {
      this.saveCaEpi(<CaEpi>this.equipment);
    }
    if (this.equipmentTypeChecked() === this.OTHER_EQUIPMENT_TYPE) { this.saveIndividualEquipment(<IndividualEquipment>this.equipment); }
  }



  saveCaEpi(caEpi: CaEpi) {
    this.caEpiService.createCa(caEpi.ca).subscribe(
      ca => {
        caEpi.ca = ca.externalImportEpi;
        this.caEpiService.saveCaEpi(caEpi).subscribe(
          savedEpi => {
            if (this.isOnEdit()) {
              this.appMessageService.showSuccess('EPI atualizado!');
            } else {
              this.appMessageService.showSuccess('EPI cadastrado com sucesso!');
            }
            caEpi.id = savedEpi.id;
            if (caEpi.epiFile) {
              this.caEpiService.updateEpiImage(caEpi).subscribe(
                image => {
                  caEpi.epiFileName = image.epiFileName;
                  caEpi.epiUrl = image.epiUrl;
                  caEpi.epiFile = null;
                },
                error => {
                  caEpi.epiFileName = null;
                  caEpi.epiUrl = null;
                  caEpi.epiFile = null;
                  this.appMessageService.showError('Erro ao tentar salvar a imagem.');
                }
              );
            }
            this.dialogRef.close(caEpi);
          }
        );
      })
  }

  saveIndividualEquipment(individualEquipment: IndividualEquipment) {
    this.individualEquipmentService.save(individualEquipment).subscribe(savedIndividualEquipment => {
      if (this.isOnEdit()) {
        this.appMessageService.showSuccess('Equipamento atualizado!');
      } else {
        this.appMessageService.showSuccess('Equipamento cadastrado com sucesso!');
      }
      this.equipment.id = savedIndividualEquipment.id;
      this.dialogRef.close(individualEquipment);
    },
      error => {
        this.appMessageService.errorHandle(error, 'Erro ao salvar o equipamento.');
      });
  }

  isOnEdit(): boolean {
    return !isNullOrUndefined(this.equipment) && !isNullOrUndefined(this.equipment.id);
  }

  isFormValid(): boolean {
    if (this.equipmentTypeChecked() === this.EPI_TYPE && isNullOrUndefined(this.epiFormComponent)) { return false; }
    if (this.equipmentTypeChecked() === this.EPI_TYPE && isNullOrUndefined(this.epiFormComponent.epiForm)) { return false; }
    if (this.equipmentTypeChecked() === this.EPI_TYPE && !this.epiFormComponent.epiForm.valid) { return false; }

    if (this.equipmentTypeChecked() === this.OTHER_EQUIPMENT_TYPE && isNullOrUndefined(this.individualEquipmentFormComponent)) { return false; }
    if (this.equipmentTypeChecked() === this.OTHER_EQUIPMENT_TYPE && isNullOrUndefined(this.individualEquipmentFormComponent.individualEquipmentForm)) { return false; }
    if (this.equipmentTypeChecked() === this.OTHER_EQUIPMENT_TYPE && !this.individualEquipmentFormComponent.individualEquipmentForm.valid) { return false; }

    return true;
  }

  addToLoadingStack(key: string) {
    this.loadingStack.add(key);
  }

  removeFromLoadingStack(key: string) {
    this.loadingStack.delete(key);
  }

  isLoadingActive(key?: string): boolean {
    if (key) { return this.loadingStack.has(key); }

    return this.loadingStack.size > 0;
  }

}
