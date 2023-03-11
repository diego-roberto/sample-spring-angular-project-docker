import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialog } from '@angular/material';
import { UserAddComponent } from '../../user-add/user-add.component';
import { UserService } from '../../../../../shared/services/user.service';
import { ManagementsService } from '../../../../../shared/services/managements.service';
import { SessionsService } from '../../../../../shared/services/sessions.service';
import { Managements } from '../../../../../shared/models/managements.model';
import * as _c from 'lodash/collection';
import { ignoreElements } from 'rxjs/operator/ignoreElements';

@Component({
  templateUrl: 'user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements OnInit {

  private managements: Managements = new Managements();
  public managementsList: Managements[] = new Array<Managements>();
  public managementsFilteredList: Managements[];
  public scrollManagements: Managements[] = new Array<Managements>();

  public fixed = false;
  public spin = true;
  public direction = 'up';
  public animationMode = 'fling';
  public status: string;
  public activeFilter: boolean;
  public inactiveFilter: boolean;
  public waiting: boolean;
  public showFabButton: boolean = false;
  public searchValue: string = '';

  @ViewChild('bodyContent') bodyContent: ElementRef;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private _dialog: MdDialog,
    private sessionsService: SessionsService,
    private userService: UserService,
    private managementsService: ManagementsService) {
    this.status = 'loading';
    this.activeFilter = true;
    this.inactiveFilter = false;
    this.waiting = true;

  }

  ngOnInit() {
    this.waiting = true;
    this.managements.company.id = this.sessionsService.getCurrent().companyId;
    this.managementsFilteredList = [];
    this.reloadList();
    this.managementsService.actualizeList.subscribe(() => {
      this.reloadList();
    });

    this.setShowFabButton()
  }

  setShowFabButton() {
    let stateCheck = setInterval(() => {
      if (document.readyState === 'complete') {
        clearInterval(stateCheck);
        this.showFabButton = true;
      }
    }, 200);
  }

  reloadList(): void {
    this.managementsService.getManagementsListByCompany(this.managements).subscribe((listManagements: Managements[]) => {
      listManagements = listManagements
        .sort(function (a, b) {
          return a.user.name.localeCompare(b.user.name);
        });

      this.managementsFilteredList = this.managementsList = listManagements;
      this.status = 'active';
      this.applySortAndFilter();
    });
  }

  removeUsersAdmin(listUserAdmin, users: Array<Managements>): Array<Managements> {

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
      let filtered = users.filter(
        item => !(adminIds.indexOf(prefixU + item.user.id) >= 0 || adminIds.indexOf(prefixW + item.workerId) >= 0)
      );

      return filtered;
    }

    return users;
  }

  redirectTo(path) {
    this.router.navigate([path], { relativeTo: this.route });
  }

  onSearchValueChange(text: string) {
    this.searchValue = text;
  }

  filterByText() {
    this.sortAndFilterManagementsFilteredList();
  }

  filterListUsers() {
    this.managementsFilteredList = this.managementsList.filter(managements => {
      if (this.activeFilter && !this.inactiveFilter) {
        if (managements.active == 0) {
          return false;
        }
      }
      if (!this.activeFilter && this.inactiveFilter) {
        if (managements.active == 1) {
          return false;
        }
      }
      if (!this.activeFilter && !this.inactiveFilter) {
        return false;
      }
      return !((this.searchValue.length > 0) && (
        managements.user.name.trim().toLowerCase()
          .indexOf(this.searchValue.trim().toLowerCase()) === -1)
      ) ||
        !(
          (this.searchValue.length > 0) && (managements.user.email.trim().toLowerCase()
            .indexOf(this.searchValue.trim().toLowerCase()) === -1)
        );
    });
  }

  getParentScroll() {
    return this.bodyContent.nativeElement;
  }

  openDialogCadastro() {
    const dialogRef = this._dialog.open(UserAddComponent);
  }

  sortAndFilterManagementsFilteredList() {
    this.filterListUsers();
    this.managementsFilteredList = _c.orderBy(this.managementsFilteredList, [item => item.user.name.toLowerCase()], ['asc']);
  }

  toggleActiveFilter() {
    this.activeFilter = !this.activeFilter;
    this.sortAndFilterManagementsFilteredList()
  }

  toggleInactiveFilter() {
    this.inactiveFilter = !this.inactiveFilter;
    this.sortAndFilterManagementsFilteredList()
  }

  applySortAndFilter() {
    this.filterListUsers();
    this.managementsFilteredList = _c.orderBy(this.managementsFilteredList, [item => item.user.name.toLowerCase()], ['asc']);
    this.waiting = false;
  }

}
