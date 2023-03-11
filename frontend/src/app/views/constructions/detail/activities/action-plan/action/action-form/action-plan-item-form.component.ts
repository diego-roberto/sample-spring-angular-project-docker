import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import * as Moment from 'moment';
import { ActivatedRoute } from '@angular/router';

import { ActionPlanItemObservation } from 'app/shared/models/action-plan-item-observation.model';
import { ActionPlanItem } from 'app/shared/models/action-plan-item.model';
import { User } from 'app/shared/models/user.model';
import { Worker } from 'app/shared/models/worker.model';
import { ActionPlanItemResponsible } from 'app/shared/models/action-plan-item-responsible.model';

import { SessionsService } from 'app/shared/services/sessions.service';
import { UserService } from 'app/shared/services/user.service';
import { ActionPlanItemService } from 'app/shared/services/action-plan-item.service';
import { WorkerService } from 'app/shared/services/worker.service';
import { ConstructionsService } from 'app/shared/services/constructions.service';

import { UtilValidators } from 'app/shared/util/validators.util';

@Component({
    selector: 'action-plan-item-form',
    templateUrl: 'action-plan-item-form.component.html',
    styleUrls: ['./action-plan-item-form.component.scss']
})

export class ActionPlanItemFormComponent implements OnInit {

    @Input() actionPlanItem: ActionPlanItem;
    @Output() savedItem: EventEmitter<ActionPlanItem> = new EventEmitter();

    private currentUser: User;
    actionItemForm: FormGroup;

    users: Array<User> = [];
    workers: Array<Worker> = [];
    filteredUserList: Observable<ActionPlanItemResponsible[]>;
    newObservation: ActionPlanItemObservation;

    responsibles_available: Array<ActionPlanItemResponsible> = [];

    constructor(
        private actionPlanItemService: ActionPlanItemService,
        private userService: UserService,
        private sessionsService: SessionsService,
        private workerService: WorkerService,
        private constructionsService: ConstructionsService,
        private route: ActivatedRoute
    ) {
        this.actionItemForm = new FormGroup({
            action: new FormControl(''),
            beginAt: new FormControl('', [Validators.required, UtilValidators.date, this.validateBeginAt]),
            endAt: new FormControl('', [Validators.required, UtilValidators.date, this.validateEndAt]),
            responsibleUser: new FormControl('', [Validators.required]),
            newObservation: new FormControl('')
        });
    }

    ngOnInit() {
        this.newObservation = new ActionPlanItemObservation();
        this.currentUser = this.sessionsService.getCurrent();
        this.actionItemForm.controls.action.disable({ onlySelf: true, emitEvent: false });
        const id_company = this.sessionsService.getCurrentCompany().companyId;
        this.userService.getUsersByCompanyId(id_company).subscribe(
            respUsers => {

                this.userService.getUsersAdminByCompanyId(id_company).subscribe((listUserAdmin) => {

                    this.users = this.removeUsersAdmin(listUserAdmin, respUsers);

                    this.workerService.getActiveNotUsersWorkersByConstruction(this.getConstructionId(), this.getCompanyId()).subscribe(workersNotUsers => {
                        this.workers = workersNotUsers;

                        this.responsibles_available = this.populateAvailableResponsibles(this.workers, this.users);

                        // Ordena a lista de usuarios
                        this.responsibles_available = this.responsibles_available.sort(function (a, b) {
                            return a.name.localeCompare(b.name);
                        });

                        if (this.actionPlanItem.idResponsible) { this.setResponsibleUser(); }

                        this.filteredUserList = this.actionItemForm.controls.responsibleUser.valueChanges.startWith(null)
                            .map(responsible => responsible && typeof responsible === 'object' ? responsible.name : responsible)
                            .map(name => name && name.length > 0 ? this.responsibles_available.filter(responsible => new RegExp(`^${name}`, 'gi').test(responsible.name)) : this.responsibles_available.slice());

                    });
                }, error => {
                    this.users = [];
                });
            }
        );
    }

    removeUsersAdmin(listUserAdmin, users: Array<User>): Array<User> {

        if (listUserAdmin != null && listUserAdmin.length > 0) {
            const prefixU = 'u_';
            const prefixW = 'w_';

            let adminIds = new Array();

            listUserAdmin.forEach(item => {
                adminIds.push(prefixU + item.userId);
                if (item.workerId && item.workerId != null) {
                    adminIds.push(prefixW + item.workerId);
                }
            });

            // Remove usuário ADMIN SESI e usuario MERCADO da lista
            const filtered = users.filter(
                item => !(adminIds.indexOf(prefixU + item.id) >= 0 || adminIds.indexOf(prefixW + item.workerId) >= 0)
            );

            return filtered;
        } else {
            return users;
        }

    }

    set saveActionItem(actionPlanItem: ActionPlanItem) {
        this.savedItem.emit(actionPlanItem);
    }

    get form() {
        return this.actionItemForm;
    }

    displayFilteredUserFunction(responsible: ActionPlanItemResponsible): any {
        return responsible ? responsible.name : responsible;
    }

    isEnabledDate(atributo: string): boolean {
        return this.actionItemForm.controls[atributo].disabled;
    }

    hasErrorForm(attr: string, type: string): boolean {
        if (this.actionItemForm.controls[attr].touched) {
            return this.actionItemForm.controls[attr].hasError(type);
        } else {
            return false;
        }
    }

    private setResponsibleUser() {
        this.responsibles_available.forEach(responsible => {
            if (this.actionPlanItem.idResponsible === responsible.id) {
                this.actionPlanItem.responsibleUserName = responsible.name;
                this.actionPlanItem.responsibleType = responsible.type;
                this.actionPlanItem.responsibleUser = responsible;
            }
        });
    }

    public addObservation(): void {
        this.newObservation.actionPlanItemId = this.actionPlanItem.id;
        this.newObservation.user = this.currentUser;

        this.actionPlanItemService.addObservation(this.newObservation).subscribe(actionPlanItemObservation => {
            if (!actionPlanItemObservation.user.name) {
                actionPlanItemObservation.user.name = this.currentUser.name;
            }

            this.actionPlanItem.observationList.push(actionPlanItemObservation);
            this.newObservation = new ActionPlanItemObservation();
        });
    }

    public isAddObservationEnable(): boolean {
        return this.newObservation.observation && this.newObservation.observation !== '';
    }

    validateBeginAt(control: AbstractControl) {
        if (!control || !control.parent || !control.parent.controls['beginAt'] || !control.parent.controls['beginAt'].value) {
            return null;
        }

        const dateBegin = Moment(control.parent.controls['beginAt'].value);
        const currentDate = Moment(new Date(Moment().format('L')));
        if (dateBegin.isBefore(currentDate)) {
            return { isbefore: true };
        }
        return null;
    }

    validateEndAt(control: AbstractControl) {
        if ((!control || !control.parent) || (!control.parent.controls['beginAt'] || !control.parent.controls['beginAt'].value)
            || (!control.parent.controls['endAt'] || !control.parent.controls['endAt'].value)) {
            return null;
        }

        const dateBegin = Moment(control.parent.controls['beginAt'].value);
        const dateEnd = Moment(control.parent.controls['endAt'].value);
        const currentDate = Moment(new Date(Moment().format('L')));
        if (dateEnd.isBefore(dateBegin) || dateEnd.isBefore(currentDate)) {
            return { isbeforeEnd: true };
        }
        return null;
    }

    getConstructionId(): number {
        const construction = this.constructionsService.construction;
        if (construction && construction != null && construction.id && construction.id != null) {
            return construction.id;
        }

        const paramId = this.route.snapshot.parent.params['id'];
        if (paramId && paramId != 'undefined') {
            return paramId;
        }

        return null;
    }

    					
    getCompanyId(): number {
        let companyId = null;

        const currentCompany = this.sessionsService.getCurrentCompany();
        if(currentCompany && currentCompany.companyId){
            companyId = currentCompany.companyId;
        }

        return companyId;
    }


    populateAvailableResponsibles(workers: Array<Worker>, users: Array<User>) {
        let available_responsibles: Array<ActionPlanItemResponsible> = [];

        if (users) {
            users.forEach(user => {
                let responsible_temp: ActionPlanItemResponsible = new ActionPlanItemResponsible();
                responsible_temp.id = user.id;
                responsible_temp.name = user.name;
                responsible_temp.type = 'user';
                available_responsibles.push(responsible_temp);
            });
        }

        if (workers) {
            workers.forEach(worker => {
                let responsible_temp: ActionPlanItemResponsible = new ActionPlanItemResponsible();
                responsible_temp.id = worker.id;
                responsible_temp.name = worker.name;
                responsible_temp.type = 'worker';
                available_responsibles.push(responsible_temp);
            });
        }

        return available_responsibles;
    }
}
