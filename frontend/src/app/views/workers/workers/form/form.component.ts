import { MdSnackBar } from '@angular/material';
import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { WorkerItemResolver } from 'app/resolves/worker-item.resolver';
import { EventSave } from 'app/shared/util/generic/form/event-save';
import { GeneralFormBase } from 'app/shared/util/generic/form/general-form-base';
import { Worker } from 'app/shared/models/worker.model';
import { SafetyCardComponent } from 'app/shared/components/safety-card';
import { Qualities } from 'app/shared/models/qualities.model';
import { WorkerService } from 'app/shared/services/worker.service';
import { QualificationsService } from 'app/shared/services/qualifications.service';
import { HttpClientService } from 'app/shared/services/http-client.service';
import { WorkerDetails } from 'app/views/workers/workers/form/worker-details-form/worker-details-form.model';

@Component({
    templateUrl: 'form.component.html',
    styleUrls: ['./form.component.scss'],
})
export class WorkerFormComponent extends GeneralFormBase<Worker> implements OnInit {

    /**
     * Instância dos componentes de todas as toggles para controlar o momento em que
     * cada uma estará aberta.
     */
    @ViewChild('datailsCard') datailsCard: SafetyCardComponent;
    @ViewChild('qualificationsCard') qualificationsCard: SafetyCardComponent;
    @ViewChild('securityCard') securityCard: SafetyCardComponent;
    @ViewChild('healthCard') healthCard: SafetyCardComponent;
    private elements: Array<SafetyCardComponent>;

    qualities: Qualities[];

    constructor(
        protected workerItemResolver: WorkerItemResolver,
        private workerService: WorkerService,
        public snackBar: MdSnackBar,
        private route: ActivatedRoute,
        private qualificationService: QualificationsService,
        private service: HttpClientService
    ) {
        super(workerItemResolver);

        this.route.data.subscribe(data => {
            this.qualities = data.qualities;
        });

        this.loadInitialInstance();
    }

    ngOnInit(): void {
        this.elements = [this.securityCard, this.healthCard, this.qualificationsCard /*,  this.datailsCard */];
        this.open(this.datailsCard);
    }

    /*
     * =========================|
     * Template methods         |
     * =========================|
     */
    onDetailsSaved(event: EventSave<Worker>) {
        this.genericSave(event, this.saveDetailWorker,
            (persistedWorker: Worker) => {
                const worker = <WorkerDetails>event.modelToSave;
                return worker.imageFile ? this.updateWorkerPhoto({ id: persistedWorker.id, imageFile: worker.imageFile }) : null;
            },

            () => {
                this.notifyUser('Detalhes do trabalhador salvos com sucesso!');
                this.open(this.qualificationsCard);
            });
    }

    onQualificationsSaved(event: EventSave<Worker>) {
        this.genericSave(event, this.saveWorkerWithQualificationAttachment, () => {
            this.notifyUser('Habilitações salvas com sucesso!');
            this.open(this.securityCard);
        });
    }

    onSecuritySaved(event: EventSave<Worker>) {
        this.genericSave(event, this.saveWorker, () => {
            this.notifyUser('Dados de segurança salvos com sucesso!');
            this.open(this.healthCard);
        });
    }

    onHealthSaved(event: EventSave<Worker>) {
        this.genericSave(event, this.saveWorkerWithAsoAttachment, () => {
            this.notifyUser('Dados de saúde salvos com sucesso!');
        });
    }

    /*
     * =========================|
     * Saving methods           |
     * =========================|
     */
    private saveWorker(self: WorkerFormComponent, workerToSave: Worker): Observable<Worker> {
        return self.workerService.saveWorker(workerToSave);
    }

    private saveDetailWorker(self: WorkerFormComponent, workerToSave: Worker): Observable<Worker> {
        return self.workerService.saveDetailWorker(workerToSave);
    }

    private saveWorkerWithAsoAttachment(self: WorkerFormComponent, workerToSave: Worker): Observable<Worker> {
        return self.workerService.updateWorkerWithAsoAttachment(workerToSave);
    }

    private saveWorkerWithQualificationAttachment(self: WorkerFormComponent, workerToSave: Worker): Observable<Worker> {
        return self.workerService.updateWorkerWithQualificationAttachment(workerToSave);
    }

    private updateWorkerPhoto(workerDefinition: { id: number, imageFile: File }): Observable<Response> {
        return this.workerService.updateServiceWorkerPhoto(workerDefinition);
    }

    /*
     * =========================|
     * Override methods         |
     * =========================|
     */
    protected getInitialInstance(): Worker {
        let worker: Worker;
        this.route.data.subscribe(routeData => {
            worker = routeData.worker;
        });
        return worker;
    }

    protected handleModelBeforeSave(worker: Worker): void {
        worker.ctps = worker.ctps && worker.ctps.replace(/[^\w]+/g, '');
        worker.cpf = worker.cpf && worker.cpf.replace(/[^\d]+/g, '');
        worker.nit = worker.nit && worker.nit.replace(/[^\d]+/g, '');
        worker.cep = worker.cep && worker.cep.replace(/[^\d]+/g, '');
        worker.contact = worker.contact && worker.contact.replace(/[^\d]+/g, '');
    }

    protected handleModelAfterSave(sentWorker: Worker, receivedWorker: Worker): void {
        receivedWorker.cbos = sentWorker.cbos;
    }

    protected handleSaveError(err) {
      const error = err.json();

      if(error){
        if(error.status == 400){
          if (error.errors && error.errors.length > 0) {
            this.notifyUser(error.errors[0].message);
          } else if (error.message){
            this.notifyUser(error.message);
          }
        } else {
          this.notifyUser('Erro no servidor!');
        }
      } else {
        this.notifyUser('Erro no servidor!');
      }
    }

    protected handleAfterSaveError() {
        this.notifyUser('Falha ao salvar foto do perfil.');
    }

    protected notifyUser(message: string) {
        this.snackBar.open(message, null, { duration: 3000 });
    }

    /*
     * =========================|
     * Auxiliar methods         |
     * =========================|
     */
    private closeAll() {
        this.elements.forEach(e => e.close());
    }

    private open(toggle) {
        this.closeAll();
        toggle.open();
    }
}
