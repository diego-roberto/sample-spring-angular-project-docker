import { VirtualScrollComponent } from 'angular2-virtual-scroll';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import { WorkerService } from 'app/shared/services/worker.service';
import { UserService } from 'app/shared/services/user.service';
import { SessionsService } from 'app/shared/services/sessions.service';

import { Occurrence } from 'app/shared/models/occurrence.model';
import { Worker } from 'app/shared/models/worker.model';

@Component({
  selector: 'occurrences-workers',
  templateUrl: './occurrences-workers.component.html',
  styleUrls: ['./occurrences-workers.component.scss']
})
export class OccurrencesWorkersComponent implements OnInit {

  @Input() occurrence: Occurrence;
  @Input() onEdit: boolean;

  @ViewChild('filter') filter: ElementRef;
  @ViewChild('workersVirtualScroll') workersVirtualScroll: VirtualScrollComponent;
  @ViewChild('workersSelectedVirtualScroll') workersSelectedVirtualScroll: VirtualScrollComponent;

  companyWorkers: Worker[];

  occurrenceWorkersFiltered: Worker[];
  companyWorkersFiltered: Worker[];

  workersVirtualScrollItems: Worker[];
  workersSelectedVirtualScrollItems: Worker[];

  selectedToAdd = [];
  selectedToRemove = [];

  limitSelection = 5;

  constructor(
    private workerService: WorkerService,
    private userService: UserService,
    private sessionsService: SessionsService
  ) { }

  ngOnInit() {
    this.workerService.getWorkerList().subscribe(workers => {

        this.userService.getUsersAdminByCompanyId(this.sessionsService.getCurrentCompany().companyId).subscribe((listUserAdmin) => {
            this.companyWorkers = this.removeUsersAdmin(listUserAdmin, workers);

            this.doCompanyWorkersOrderByName();

            if (this.occurrence.workers && this.occurrence.workers.length > 0) {
              this.companyWorkers = this.companyWorkers.filter(item => ! this.occurrence.workers.find(item2 => item.id == item2.id));
            } else {
              this.occurrence.workers = [];
            }
            this.doOccurrenceWorkersOrderByName();

        }, error => {
            this.companyWorkers = [];
        });

    });
  }

  removeUsersAdmin(listUserAdmin, workers: Array<Worker>) : Array<Worker> {

      if(listUserAdmin != null && listUserAdmin.length > 0){
          const prefixU = 'u_';
          const prefixW = 'w_';

          let adminIds = new Array();

          listUserAdmin.forEach(item => {
              adminIds.push(prefixU + item.userId);
              if(item.workerId && item.workerId != null){
                  adminIds.push(prefixW + item.workerId);
              }
          });
          
          // Remove usuário ADMIN SESI e usuario MERCADO da lista
          let filtered = workers.filter(
                  item => !(adminIds.indexOf(prefixW + item.id) >= 0)
              );

          return filtered;          
      }
      
      return workers
  }

  setSelectedToAdd(worker: Worker) {
    if (! this.selectedToAdd.includes(worker)) {
      this.selectedToAdd.push(worker);
    } else {
      this.selectedToAdd = this.selectedToAdd.filter(item => item !== worker);
    }
  }

  setSelectedToRemove(worker: Worker) {
    if (! this.selectedToRemove.includes(worker)) {
      this.selectedToRemove.push(worker);
    } else {
      this.selectedToRemove = this.selectedToRemove.filter(item => item !== worker);
    }
  }

  doAdd() {
    this.occurrence.workers = this.occurrence.workers.concat(this.selectedToAdd);
    this.companyWorkers = this.companyWorkers.filter(item => ! this.selectedToAdd.includes(item));
    this.selectedToAdd = [];
    this.doOccurrenceWorkersOrderByName();
  }

  doRemove() {
    this.companyWorkers = this.companyWorkers.concat(this.selectedToRemove);
    this.occurrence.workers = this.occurrence.workers.filter(item => ! this.selectedToRemove.includes(item));
    this.selectedToRemove = [];
    this.doCompanyWorkersOrderByName();
  }

  limitSelectionReached(): boolean {
    return this.selectedToAdd.length + this.occurrence.workers.length >= this.limitSelection;
  }

  doClearFilterWorkers() {
    this.filter.nativeElement.value = '';
    this.doFilterWorkers(this.filter.nativeElement.value);
  }

  doFilterWorkers(filterValue: string) {
    this.doFilterCompanyWorkers(filterValue);
    this.doFilterOccurenceWorkers(filterValue);
  }

  doFilterOccurenceWorkers(filterValue: string) {
    if (! filterValue || filterValue === '') {
      this.occurrenceWorkersFiltered = this.occurrence.workers;
    } else {
      this.occurrenceWorkersFiltered = this.occurrence.workers.filter(worker =>
        worker.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        worker.cbos.title.toLowerCase().includes(filterValue.toLowerCase()) ||
        worker.cpf.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
  }

  doFilterCompanyWorkers(filterValue: string) {
    if (! filterValue || filterValue === '') {
      this.companyWorkersFiltered = this.companyWorkers;
    } else {
      this.companyWorkersFiltered = this.companyWorkers.filter(worker =>
        worker.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        worker.cbos.title.toLowerCase().includes(filterValue.toLowerCase()) ||
        worker.cpf.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
  }

  doCompanyWorkersOrderByName() {
    this.companyWorkers = this.companyWorkers.sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });
    this.doFilterWorkers(this.filter.nativeElement.value);
  }

  doOccurrenceWorkersOrderByName() {
    this.occurrence.workers = this.occurrence.workers.sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });
    this.doFilterWorkers(this.filter.nativeElement.value);
  }

  isDoAddDisabled(): boolean {
    return ! (this.selectedToAdd && this.selectedToAdd.length > 0);
  }

  isDoRemoveDisabled(): boolean {
    return ! (this.selectedToRemove && this.selectedToRemove.length > 0);
  }

}
