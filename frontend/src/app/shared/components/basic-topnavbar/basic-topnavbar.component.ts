import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET } from '@angular/router';

const ROUTE_DATA_BREADCRUMB = 'breadcrumb';

@Component({
    selector: 'basic-topnavbar',
    templateUrl: './basic-topnavbar.component.html',
    styleUrls: ['./basic-topnavbar.component.scss']
})
export class BasicTopNavBarLayoutComponent {
    breadcrumb = '';

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
            const root: ActivatedRoute = this.activatedRoute.root;
            this.getBreadcrumbs(root);
        });
    }

    private getBreadcrumbs(route: ActivatedRoute) {
        const children: ActivatedRoute[] = route.children;

        if (children.length === 0) { return; };

        for (const child of children) {
            const childHasBreadCrumb = child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB);

            if (child.outlet !== PRIMARY_OUTLET) {
                continue;
            }

            if (childHasBreadCrumb) {
                this.breadcrumb = child.snapshot.data[ROUTE_DATA_BREADCRUMB];
            };

            return this.getBreadcrumbs(child);
        }
    }
}
