import { Component, Input } from '@angular/core';
import { NotificationCount } from '../../../../shared/util/json/notification-count';
import { Construction } from '../../../../shared/models/construction.model';
import { EnumModule } from '../../../../shared/models/enum-module.model';

@Component({
    selector: 'summary',
    templateUrl: 'summary.component.html',
    styleUrls: ['./summary.component.scss']
})

export class SummaryComponent {

    @Input() construction: Construction;
    @Input() cones: Number;
    @Input() alerts: Number;
    @Input() workers: Number;
    @Input() notificationCount: NotificationCount;

    constructor() { }

    hasModule(enumModule:EnumModule){
        if(this.construction && this.construction.modules){
            let modulesId:number[]=this.construction.modules;
            let result = modulesId.filter(moduleId=>moduleId ===enumModule);
            return result.length >0;
        }
        return false;
       
    }
}
