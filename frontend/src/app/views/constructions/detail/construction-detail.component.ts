import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Construction } from 'app/shared/models/construction.model';
import { ConstructionsService } from 'app/shared/services/constructions.service';
import { ConstructionItemResolver } from 'app/resolves/construction.item.resolver';
import { NotificationSidenavService } from 'app/shared/services/notification-sidenav.service';
import { ConeWsService } from 'app/shared/services/cone-ws.service';
import { EnumPermission } from '../../../shared/models/permission/enum-permission';
import { PermissionService } from '../../../shared/services/permission.service';


@Component({
    selector: 'construction-detail',
    templateUrl: './construction-detail.component.html',
    styleUrls: ['./construction-detail.component.scss']
})
export class ConstructionDetailComponent implements OnInit, OnDestroy {
    public previousName: string;

    asyncTabs: Observable<any>;
    tabs: any;
    value: any;
    sub: any;
    id: number;

    construction: Construction;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public constructionsService: ConstructionsService,
        public constructionItemResolver: ConstructionItemResolver,
        private notificationSidenavService: NotificationSidenavService,
        private coneWsService: ConeWsService,
        public permissionService:PermissionService
    ) {
         }

    ngOnInit() {

        this.asyncTabs = Observable.create((observer: any) => {
            setTimeout(() => {
                observer.next(this.tabs);
            }, 1000);
 
        });
       

        this.activatedRoute
            .params
            .subscribe(params => {
                this.construction = new Construction();
                this.construction.id = params['id'] || undefined;
                this.id = this.construction.id;
                this.loadConstruction(this.construction.id);
              
            });

     

    }

    ngOnDestroy() {
        this.notificationSidenavService.setConstruction(null);
        this.coneWsService.endSub();
    }

    redirectTo(route) {
        this.router.navigate([route]);
    }

    changeConstruction(id: number) {
        const url =this.router.url.replace('/constructions/'+this.activatedRoute.snapshot.params.id,'/constructions/'+id);
        this.router.navigate([url],{relativeTo: this.activatedRoute.parent});
    }

    loadConstruction(id: number) {
        this.constructionsService.getConstruction(id).subscribe(
            values => {
                this.construction = values;
                this.notificationSidenavService.setConstruction(this.construction);
                this.constructionItemResolver.setConstruction(this.construction);
                this.coneWsService.subscribeWs(this.construction.id);      
                this.id = this.construction.id;
            }
        );
    }

    
}
