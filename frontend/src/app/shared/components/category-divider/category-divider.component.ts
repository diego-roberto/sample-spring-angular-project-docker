import { Component } from '@angular/core';

@Component({
    selector: 'category-divider',
    templateUrl: 'category-divider.component.html',
    styleUrls: ['./category-divider.component.scss']
})
export class CategoryDividerComponent { }

@Component({
    selector: 'category-divider-left',
    template: '<ng-content></ng-content>'
})
export class CategoryDividerLeftComponent { }

@Component({
    selector: 'category-divider-right',
    template: '<ng-content></ng-content>'
})
export class CategoryDividerRightComponent { }

@Component({
    selector: 'category-divider-center',
    template: '<ng-content></ng-content>'
})
export class CategoryDividerCenterComponent { }
