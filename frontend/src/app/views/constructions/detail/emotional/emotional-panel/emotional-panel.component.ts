import { Component, ViewChild } from '@angular/core';
import { ConstructionsService } from 'app/shared/services/constructions.service';

@Component({
    selector: 'emotional-panel',
    templateUrl: 'emotional-panel.component.html',
    styleUrls: ['./emotional-panel.component.scss']
})
export class EmotionalPanelComponent {
    @ViewChild('tabGroup') tabGroup;

    canvas: any;
    ctx: any;

    constructor(
        public constructionService: ConstructionsService
    ) { }

    onSelectChange = () => {
        this.canvas = document.getElementById('cnvs');
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
    }
}
