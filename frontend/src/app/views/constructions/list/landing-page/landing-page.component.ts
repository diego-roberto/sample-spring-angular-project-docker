import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionService } from 'app/shared/services/permission.service';

@Component({
    selector: 'constructions-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss']
})
export class ConstructionsLandingPageComponent {
    constructor(
        public router: Router,
        public permissionService: PermissionService
    ) { }
}
