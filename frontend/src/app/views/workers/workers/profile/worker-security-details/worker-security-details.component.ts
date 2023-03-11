import { Worker } from 'app/shared/models/worker.model';
import { Component, Input, EventEmitter, Output, ViewChild, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'worker-security-details',
    templateUrl: './worker-security-details.component.html',
    styleUrls: ['./worker-security-details.component.scss'],
})
export class SecurityDetailsWorkerComponent {

    @Input() worker: Worker;

    laborsInCipa = new Map([
        ['1', 'Membro Suplente'],
        ['2', 'Membro Efetivo'],
        ['3', 'Presidente'],
        ['4', 'Vice Presidente'],
        ['5', 'Secretário']
    ]);
}

