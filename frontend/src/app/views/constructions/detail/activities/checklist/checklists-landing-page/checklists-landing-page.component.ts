import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'checklists-landing-page',
    templateUrl: './checklists-landing-page.component.html',
    styleUrls: ['./checklists-landing-page.component.scss']
})
export class ChecklistsLandingPageComponent {
    constructor(
        public router: Router
    ) { }
}
