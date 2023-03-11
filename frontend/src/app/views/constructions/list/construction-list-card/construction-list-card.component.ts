import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

import { ConstructionCount } from 'app/shared/util/json/construction-count';
import { Construction } from 'app/shared/models/construction.model';
import { environment } from 'environments/environment';

@Component({
    selector: 'construction-list-card',
    templateUrl: './construction-list-card.component.html',
    styleUrls: ['./construction-list-card.component.scss']
})
export class ConstructionListCardComponent implements OnInit {

    @Input() construction: Construction;
    @Input() constructionCount: ConstructionCount;
    @Output() toEdit: EventEmitter<Construction> = new EventEmitter();
    @Output() toPrintEquipments: EventEmitter<Construction> = new EventEmitter();

    status: any = {};
    statusIcon: any = '';

    ngOnInit() {
        switch (this.construction.getStatus()) {
            case 'FINISHED':
                this.statusIcon = 'finalizadas';
                break;
            case 'PAUSED':
                this.statusIcon = 'paralisadas';
                break;
            case 'IN_PROGRESS':
                this.statusIcon = 'andamento';
                break;
        }

        this.status = {
            'success': this.construction.getStatus() === 'FINISHED',
            'warn': this.construction.getStatus() === 'IN_PROGRESS',
            'danger': this.construction.getStatus() === 'PAUSED'
        };
    }

    getLogoUrl() {
        if (this.construction.logoUrl && this.construction.logoFileName) {
            return environment.backendUrl + this.construction.logoUrl + '?t=' + this.construction.logoFileName;
        } else {
            return 'assets/no-image-placeholder.jpg';
        }
    }

}
