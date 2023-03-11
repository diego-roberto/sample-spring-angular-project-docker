import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdDialog, MdSnackBar } from '@angular/material';

import { ConfirmDialogHandler } from 'app/shared/util/generic/confirm-dialog/confirm-dialog.handler';
import { CaEpiListResolver } from 'app/resolves/ca-epi-list.resolver';

import { IndividualEquipmentDialogComponent } from 'app/views/workers/epi/individual-equipment-dialog/individual-equipment-dialog.component';

import { CaEpiService } from 'app/shared/services/ca-epi.service';

import { CaEpi } from 'app/shared/models/ca-epi.model';
import { Epi } from 'app/shared/models/epi.model';
import { EpiTypes } from 'app/shared/models/epi-types.model';

@Component({
    selector: 'epi-line-detail',
    templateUrl: './epi-line-detail.component.html',
    styleUrls: ['./epi-line-detail.component.scss']
})
export class EpiLineDetailComponent {
    @Input() caEpi: CaEpi;
    @Input() expired: Boolean;
    @Output() removed = new EventEmitter();

    now = new Date();

    dialogConfig = {
        data: {
            caEpi: new CaEpi(),
            epi: new Epi(),
            epiType: new EpiTypes(),
            update: false
        }
    };

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public dialog: MdDialog,
        public confirmDialogHandler: ConfirmDialogHandler,
        public caEpiListResolver: CaEpiListResolver,
        public caEpiService: CaEpiService,
        public snackBar: MdSnackBar
    ) { }

    toEditEpi() {
        const dialogRef = this.dialog.open(IndividualEquipmentDialogComponent, { data: { caEpiId: this.caEpi.id }, width: '50%' });
        dialogRef.afterClosed().subscribe(() => {
            this.caEpiService.getCaEpiList().subscribe((caEpis) => {
                this.caEpiListResolver.setListCaEpiRegistered(caEpis);
            });

            this.caEpiService.getCaEpiExpiredList().subscribe((caEpisExpired) => {
                this.caEpiListResolver.setListCaEpiExpired(caEpisExpired);
            });

            this.caEpiService.getCaEpiForthComingMaturitiesList().subscribe((caEpisForthComingMaturities) => {
                this.caEpiListResolver.setListCaEpiForthComingMaturities(caEpisForthComingMaturities);
            });
        });
    }

    redirectTo(route) {
        this.router.navigate([route], { relativeTo: this.route });
    }

    toDeleteCaEpi() {
        const dialogRef = this.confirmDialogHandler.call('excluir', 'Deseja remover esse registro?').subscribe((confirm) => {
            if (confirm) {
                this.caEpiService.removeCaEpiById(this.caEpi.id).subscribe(
                    response => {
                        this.snackBar.open('EPI excluído com sucesso!', null, { duration: 3000 });
                        this.removed.emit(response.caEpiSave);
                    },
                    error => {
                        this.handleError(error);
                    }
                );
            }
        });
    }

    private handleError(error) {
        if (error.json() && error.json().errors && error.json().errors.length > 0) {
            this.snackBar.open(error.json().errors[0].message, null, { duration: 3000 });
        } else {
            this.snackBar.open('Erro no servidor!', null, { duration: 3000 });
        }
    }
}
