import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { EnumPermission } from '../../models/permission/enum-permission';
import { PermissionService } from '../../services/permission.service';
import { environment } from '../../../../environments/environment';
import { EnumEnvProfile } from '../../../../environments/EnumEnvProfile';


@Component({
    selector: 'workers-management',
    templateUrl: './workers-management.component.html',
    styleUrls: ['./workers-management.component.scss']
})
export class WorkersManagementComponent implements OnInit {
    public previousName: string;
    routeLinks: any[];
    asyncTabs: Observable<any>;
    activeLinkIndex = 0;
    tabs: any;
    value: any;
    sub: any;
    id: number;

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private permissionService: PermissionService) {
        let sensorPermission = EnumPermission.COMPANY_WORKERS_WEARABLE_LIST;
        if(environment.profile == EnumEnvProfile.PROD)
            sensorPermission = EnumPermission.INACTIVATE;

        const paramRouteLinks = [
            {
                label: 'Gerenciamento', link: 'workers',
                expectedPermissions: [
                    EnumPermission.COMPANY_WORKERS_LIST,
                ]
            },
            {
                label: 'EPI', link: 'workers/epi',
                expectedPermissions: [
                    EnumPermission.COMPANY_WORKERS_EPI_LIST,
                ]
            },
            {
                label: 'SENSORES', link: 'workers/wearable',
                expectedPermissions: [
                    sensorPermission,
                ]
            },
        ];
        this.routeLinks = [];
        paramRouteLinks.forEach(element => {
            if (element.expectedPermissions.length === 0) {
                this.routeLinks.push(element);
            } else {
                if (this.permissionService.hasSomePermission(element.expectedPermissions)) {
                    this.routeLinks.push(element);
                }
            }
        });
        this.asyncTabs = Observable.create((observer: any) => {
            setTimeout(() => {
                observer.next(this.tabs);
            }, 1000);

        });
        this.activeLinkIndex =
        this.routeLinks.indexOf(this.routeLinks.find(tab => router.url.substring(1, 12) === tab.link.substring(0, 11)));
    }

    ngOnInit() {

    }

    redirectTo(route) {
        this.router.navigate([route]);
    }
}
