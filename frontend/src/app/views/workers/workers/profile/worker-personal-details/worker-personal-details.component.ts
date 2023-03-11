import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';

import { Worker } from 'app/shared/models/worker.model';
import { MaskUtil } from 'app/shared/util/mask.util';

@Component({
    selector: 'worker-personal-details',
    templateUrl: './worker-personal-details.component.html',
    styleUrls: ['./worker-personal-details.component.scss'],
})
export class PersonalDetailsWorkerComponent {

    @Input() worker: Worker;

    phoneMask = MaskUtil.phoneMask;
    cepMask = MaskUtil.cepMask;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public dialog: MdDialog
    ) { }

    redirectTo() {
        const dialogRef = this.dialog;
        dialogRef.closeAll();
        this.router.navigate(['/workers/' + this.worker.id + '/edit']);
    }
}

