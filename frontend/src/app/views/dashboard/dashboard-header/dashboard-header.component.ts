import { Component, OnInit } from '@angular/core';
import { EnumPermission } from '../../../shared/models/permission/enum-permission';
import { Router, ActivatedRoute } from '@angular/router';
import { PermissionService } from '../../../shared/services/permission.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent implements OnInit {

  public previousName: string;
  routeLinks: any[];
  asyncTabs: Observable<any>;
  activeLinkIndex = 0;
  tabs: any;
  value: any;
  sub: any;
  id: number;

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
    public permissionService:PermissionService) {}

  ngOnInit() {
    let linksTocheck = [
      { label: 'GERAL', link: 'dashboard' , expectedPermissions: [
        EnumPermission.COMPANY_DASHBOARD_SHOW_OCURRENCE,
        EnumPermission.COMPANY_DASHBOARD_SHOW_CARD_TASKS,
        EnumPermission.COMPANY_DASHBOARD_SHOW_EQUIPMENT_MAINTENANCE,
        EnumPermission.COMPANY_DASHBOARD_SHOW_WORKERS
          
          
      ] },
      { label: 'FATORES ESTRATÉGICOS', link: 'dashboard/strategicFactors' , expectedPermissions: [
                  
        EnumPermission.COMPANY_DASHBOARD_SHOW_CHECKLIST_APPLIED,
        EnumPermission.COMPANY_DASHBOARD_SHOW_POTENTIAL_EMBARGO,
        EnumPermission.COMPANY_DASHBOARD_SHOW_ACTION_PLAN,
        EnumPermission.COMPANY_DASHBOARD_SHOW_POTENTIAL_PENALTY,
      ] },
      { label: 'FATORES HUMANOS', link: 'dashboard/strategicHumans' , expectedPermissions: [
                  
        EnumPermission.COMPANY_DASHBOARD_SHOW_ASO,
        EnumPermission.COMPANY_DASHBOARD_SHOW_QUALIFICATION,
        EnumPermission.COMPANY_DASHBOARD_SHOW_EPI,
    ] }
  ];

  this.routeLinks = linksTocheck.filter(item=>this.permissionService.hasSomePermission(item.expectedPermissions));
  }

  redirectTo(route) {
    this.router.navigate([route]);
 }

}
