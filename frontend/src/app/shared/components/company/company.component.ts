import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { EnumPermission } from "../../models/permission/enum-permission";
import { PermissionService } from "../../services/permission.service";
import { environment } from '../../../../environments/environment';
import { EnumEnvProfile } from '../../../../environments/EnumEnvProfile';

@Component({
  selector: "selctor-company",
  templateUrl: "./company.component.html",
  styleUrls: ["./company.component.scss"]
})
export class CompanyComponent implements OnInit {
  public previousName: string;
  routeLinks: any[];
  asyncTabs: Observable<any>;
  activeLinkIndex = 0;
  tabs: any;
  value: any;
  sub: any;
  id: number;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public permissionService: PermissionService
  ) {
    let sensorPermission = EnumPermission.COMPANY_WORKERS_WEARABLE_LIST;
    if(environment.profile == EnumEnvProfile.PROD)
        sensorPermission = EnumPermission.INACTIVATE;
    const linksTocheck = [
      {
        label: "DADOS EMPRESARIAIS",
        link: "company",
        expectedPermissions: [
          EnumPermission.COMPANY_COMPANY_CREATE,
          EnumPermission.COMPANY_COMPANY_EDIT,
          EnumPermission.COMPANY_USER_LIST
        ]
      },
      {
        label: "USUÁRIOS",
        link: "company/users",
        expectedPermissions: [
          EnumPermission.COMPANY_USER_CREATE,
          EnumPermission.COMPANY_USER_EDIT,
          EnumPermission.COMPANY_USER_CHANGE_STATUS,
          EnumPermission.COMPANY_USER_LIST
        ]
      },
      {
        label: "SENSORES",
        link: "company/sensor",
        expectedPermissions: [sensorPermission]
      }
    ];

    this.routeLinks = linksTocheck.filter(item =>
      this.permissionService.hasSomePermission(item.expectedPermissions)
    );

    this.asyncTabs = Observable.create((observer: any) => {
      setTimeout(() => {
        observer.next(this.tabs);
      }, 1000);
    });
    this.activeLinkIndex = this.routeLinks.indexOf(
      this.routeLinks.find(tab => router.url.substring(1) === tab.link)
    );
  }

  ngOnInit() {}

  redirectTo(route) {
    this.router.navigate([route]);
  }
}
