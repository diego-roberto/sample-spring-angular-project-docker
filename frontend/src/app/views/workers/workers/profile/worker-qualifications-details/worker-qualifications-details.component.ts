import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';

import { QualitiesService } from 'app/shared/services/qualities.service';
import { Qualification } from 'app/shared/models/qualification.model';
import { Worker } from 'app/shared/models/worker.model';


@Component({
    selector: 'worker-qualifications-details',
    templateUrl: './worker-qualifications-details.component.html',
    styleUrls: ['./worker-qualifications-details.component.scss'],
    providers: [QualitiesService]
})
export class QualificationsDetailsWorkerComponent implements OnInit {

    @Input() worker: Worker;
    @Input() skill: Qualification;

    qualitiesNames: any;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private qualitiesService: QualitiesService
    ) { }

    ngOnInit() {
        this.qualitiesService.getQualitiesList().subscribe(data => {
            this.qualitiesNames = data;
        });
    }
}
