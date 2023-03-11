import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ConstructionCount } from '../../../../shared/util/json/construction-count';
import { Construction } from '../../../../shared/models/construction.model';

import { ConstructionsService } from '../../../../shared/services/constructions.service';
import { ConstructionUserProfileService } from '../../../../shared/services/construction-user-profile.service';
import { PermissionService } from '../../../../shared/services/permission.service';
import { EnumPermission } from '../../../../shared/models/permission/enum-permission';
import { ParamsRulePermission } from '../../../../shared/models/permission/params-rule-permission';
import { MdSnackBar } from '@angular/material';
import { EnumModule } from '../../../../shared/models/enum-module.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'construction-list-item',
  templateUrl: './construction-list-item.component.html',
  styleUrls: ['./construction-list-item.component.scss']
})
export class ConstructionListItemComponent implements OnInit {

  @Input() construction: Construction;
  @Input() constructionCount: ConstructionCount;
  @Output() toEdit: EventEmitter<Construction> = new EventEmitter();
  @Output() delete: EventEmitter<Construction> = new EventEmitter();
  @Output() toPrintEquipments: EventEmitter<Construction> = new EventEmitter();

  status: any = {};
  statusIcon: any = '';
  showSearch: boolean;


  constructor(
    public constructionsService: ConstructionsService,
    public permissionService: PermissionService,
    public snackBar: MdSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    switch (this.construction.getStatus()) {
      case 'FINISHED':
        this.statusIcon = 'finalizadas';
        break;
      case 'PAUSED':
        this.statusIcon = 'paralisadas';
        break;
      case 'IN_PROGRESS':
        this.statusIcon = 'andamento';
        break;
    }

    this.status = {
      'success': this.construction.getStatus() === 'FINISHED',
      'warn': this.construction.getStatus() === 'IN_PROGRESS',
      'danger': this.construction.getStatus() === 'PAUSED'
    };
  }

  changeConstruction(constructionId: number) {

    let paramsRulePermission: ParamsRulePermission = new ParamsRulePermission();
    paramsRulePermission.constructions = [constructionId];

    if (this.permissionService.hasPermission(EnumPermission.CONSTRUCTION_DETAILS_CONSTRUCTION, paramsRulePermission)) {


      if (!this.permissionService.hasPermission(EnumPermission.CONSTRUCTION_ACTIVITIES_TASK_LIST, paramsRulePermission)
        && this.permissionService.hasPermission(EnumPermission.CONSTRUCTION_ACTIVITIES_CHECKLIST_LIST, paramsRulePermission)) {

        this.constructionsService.getConstruction(constructionId).subscribe(construction => {
          this.router.navigate(['/constructions/' + construction.id + '/checklist']);
        });
      } else {
        this.constructionsService.getConstruction(constructionId).subscribe(construction => {
          this.router.navigate(['/constructions/' + construction.id]);
        });

      }

    } else {
      this.snackBar.open('Sem permissão!', null, { duration: 3000 });
    }
  }

  hasModule(enumModule: EnumModule) {
    if (this.construction.modules) {
      let modulesId: number[] = this.construction.modules;
      let result = modulesId.filter(moduleId => moduleId === enumModule);
      return result.length > 0;
    }
    return false;

  }

  openTotem() {
    this.toggleFullScreen();
    this.router.navigate(['/totem/construction/' + this.construction.id], { relativeTo: this.activatedRoute.parent });
  }

  toggleFullScreen() {
    let elem: any = document.body;
    let methodToBeInvoked = elem.requestFullScreen ||
      elem.webkitRequestFullScreen ||
      elem.mozRequestFullScreen ||
      elem.msRequestFullscreen;

    if (methodToBeInvoked) {
      methodToBeInvoked.call(elem);
    };
  }

  getLogoUrl() {
    if (this.construction.logoUrl && this.construction.logoFileName) {
      return environment.backendUrl + this.construction.logoUrl + '?t=' + this.construction.logoFileName;
    } else {
      return 'assets/no-image-placeholder.jpg';
    }
  }
}
