import { MdDialog } from '@angular/material';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { isNullOrUndefined } from 'util';
import { ConfirmDialogHandler } from 'app/shared/util/generic/confirm-dialog/confirm-dialog.handler';

import { IndividualEquipmentDialogComponent } from 'app/views/workers/epi/individual-equipment-dialog/individual-equipment-dialog.component';

import { IndividualEquipmentService } from 'app/shared/services/individual-equipment.service';
import { AppMessageService } from 'app/shared/util/app-message.service';

import { IndividualEquipment } from 'app/shared/models/individual-equipment.model';

@Component({
  selector: 'individual-equipment-list-item',
  templateUrl: './individual-equipment-list-item.component.html',
  styleUrls: ['./individual-equipment-list-item.component.scss']
})
export class IndividualEquipmentListItemComponent implements OnInit {

  @Input() individualEquipment: IndividualEquipment;

  @Output() individualEquipmentChange = new EventEmitter<IndividualEquipment>();
  @Output() individualEquipmentDelete = new EventEmitter<number>();

  constructor(
    private dialog: MdDialog,
    private confirmDialogHandler: ConfirmDialogHandler,
    private appMessageService: AppMessageService,
    private individualEquipmentService: IndividualEquipmentService
  ) { }

  ngOnInit() {
  }

  hasImageToShow(): boolean {
    return ! (isNullOrUndefined(this.individualEquipment.fileUrl) && isNullOrUndefined(this.individualEquipment.fileName));
  }

  editIndividualEquipment() {
    const dialogRef = this.dialog.open(IndividualEquipmentDialogComponent, { data: { individualEquipmentId: this.individualEquipment.id }, width: '50%' });
    dialogRef.afterClosed().subscribe(individualEquipment => {
      this.individualEquipmentChange.emit(individualEquipment);
    });
  }

  deleteIndividualEquipment() {
    const dialogRef = this.confirmDialogHandler.call('excluir', 'Deseja remover esse registro?').subscribe((confirm) => {
      if (confirm) {
        this.individualEquipmentService.inactivate(this.individualEquipment.id).subscribe(
          response => {
            this.appMessageService.showSuccess('Equipamento excluído com sucesso.');
            this.individualEquipmentDelete.emit(this.individualEquipment.id);
          },
          error => {
            this.appMessageService.errorHandle(error, 'Erro ao excluir este equipamento.');
          }
        );
      }
    });
  }

}
