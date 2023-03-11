import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Construction } from 'app/shared/models/construction.model';
import { ConstructionsService } from 'app/shared/services/constructions.service';

@Component({
    selector: 'constructions-dropdown',
    templateUrl: 'constructions-dropdown.component.html',
    styleUrls: ['./constructions-dropdown.component.scss'],
})
export class ConstructionsDropdownComponent implements OnInit {
    public constructions: Array<Construction> = [];
    private sub: any;

    @Output() constructionId: EventEmitter<number> = new EventEmitter();

    constructor(
        private router: Router,
        public constructionsService: ConstructionsService
    ) { }

    ngOnInit() {
        this.constructionsService.getConstructionsEssential().subscribe(
            values => {
                this.constructions = values;
            }
        );
    }

    changeConstruction(id: number) {
        this.constructionId.emit(id);
        // this.router.navigate(['/constructions/' + id]);
    }
}
