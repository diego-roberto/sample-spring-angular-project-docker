import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'workers-landing-page',
    templateUrl: './workers-landing-page.component.html',
    styleUrls: ['./workers-landing-page.component.scss']
})
export class WorkersLandingPageComponent {
    constructor(
        public router: Router
    ) { }
}
