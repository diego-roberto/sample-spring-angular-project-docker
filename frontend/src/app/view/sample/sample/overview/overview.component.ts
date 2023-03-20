import { Component, OnInit, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { SampleService } from '../../../../shared/service/sample.service';


@Component({
    templateUrl: 'overview.component.html',
    styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
    @Input() sample: Sample = new Sample;

    // @ViewChild('sampleForm') sampleForm: CardComponent;
    // @ViewChild('sampleList') sampleList: CardComponent;

    ngOnInit(): void {
        // this.elements = [this.sampleForm];
        // this.elements = [this.sampleList];
    }

    constructor(
        private dialogRef: MdDialogRef<OverviewComponent>,
        private sampleService: SampleService
    ) { }

}
