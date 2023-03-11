import { Component, OnInit, OnDestroy, OnChanges, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, Validator, AsyncValidator, ValidationErrors } from '@angular/forms';
import { DateAdapter } from '@angular/material';
import * as Moment from 'moment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import { isNullOrUndefined } from 'util';

import { WorkerItemResolver } from 'app/resolves/worker-item.resolver';
import { WorkerWearable } from 'app/shared/models/worker-wearable.model';
import { Worker } from 'app/shared/models/worker.model';
import { MaskUtil } from 'app/shared/util/mask.util';
import { WorkerService } from 'app/shared/services/worker.service';
import { WorkerWearableService } from 'app/shared/services/worker-wearable.service';
import { UtilValidators } from 'app/shared/util/validators.util';

@Component({
    selector: 'wearable-form',
    templateUrl: 'wearable-form.component.html',
    styleUrls: ['./wearable-form.component.scss']
})

export class WearableFormComponent implements OnInit {

    @Input() workerWearableIn: WorkerWearable;
    @Input() edit: boolean;
    @Output() save: EventEmitter<WorkerWearable> = new EventEmitter();
    @Output() formUpdate: EventEmitter<FormGroup> = new EventEmitter();

    supportedFileTypes: string[] = ['image/png', 'image/jpeg'];

    wearableForm: FormGroup;

    worker: Worker = new Worker;
    cpfWorker = '';
    cpfMask = MaskUtil.cpfMask;
    idWearableMask = MaskUtil.idWearableMask;
    identification: string;
    workerWearable: WorkerWearable;

    readonly idWearableExistsMessage = 'SENSOR JÁ ESTÁ SENDO UTILIZADO POR OUTRO TRABALHADOR.';
    cpfNotExistsMessage: string;

    constructor(private fb: FormBuilder,
        public workerService: WorkerService,
        public workerWearableService: WorkerWearableService,
        protected workerItemResolver: WorkerItemResolver
    ) {
        this.wearableForm = this.fb.group({
            cpfWorker: new FormControl('', [Validators.required, UtilValidators.cpf], [this.notExistCpf.bind(this)]),
            fullname: [{ value: '', disabled: true }],
            identification: new FormControl('', [Validators.required, UtilValidators.idWearable], [this.existIdWearable.bind(this)])
        });
    }

    ngOnInit() {
        if (this.edit) {
            this.wearableForm.controls.cpfWorker.disable();
            this.wearableForm.controls.fullname.disable();
            this.wearableForm.controls.identification.disable();
        }
    }

    notExistCpf(control: FormControl) {
        return new Promise<Worker>((resolve, reject) => {
            if (isNullOrUndefined(control.value)) {
                resolve(null);
                return;
            }

            // Vai no servidor buscar se existe trabalhador cadastrado com CPF informado.
            this.workerService.getWorkerByCpf(control.value).subscribe(workerWithCPF => {
                // Se encontrou um trabalhador cadastrado com CPF informado e Sensor Ativo
                if (workerWithCPF.id != null) {
                    this.workerWearableService.getWorkerWearableByCPF(this.workerWearableIn.cpfWorker).subscribe((workerWearable) => {
                        if (workerWearable.id) {
                            this.workerWearableIn = workerWearable;
                            this.workerWearableIn.id = null;
                            this.workerWearableIn.name = workerWithCPF.name;
                            this.cpfNotExistsMessage = 'CPF JÁ ESTÁ SENDO UTILIZADO POR OUTRO SENSOR.';
                            resolve(null);
                        } else {
                            this.worker = workerWithCPF;
                            this.workerWearableIn.workerId = workerWithCPF.id;
                            this.workerWearableIn.cpfWorker = workerWithCPF.cpf;
                            this.workerWearableIn.name = workerWithCPF.name;
                        }
                    });

                } else {
                    this.cpfNotExistsMessage = 'CPF NÃO CADASTRADO';
                    resolve(null);
                }
            });
        }).then(workerResponse => {
            if (workerResponse == null) {
                return { notExistCpf: this.cpfNotExistsMessage };
            } else {

            }
        });
    }

    sendData() {

        this.formUpdate.emit(this.wearableForm);
        this.workerWearableIn.idWearable = this.workerWearableIn.idWearable;
        this.workerWearableIn.cpfWorker = this.worker.cpf;
        this.workerWearableIn.workerId = this.worker.id;

        this.save.emit(this.workerWearableIn);
    }

    existIdWearable() {
        return this.workerWearableService.getWorkerWearableByIdWearable(this.workerWearableIn.idWearable).map((workerWearable) => {
            return workerWearable == null ? null : { existIdWearable: this.idWearableExistsMessage };
        });
    }
}
