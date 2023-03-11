import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Icon } from 'app/shared/models/icon.model';

@Component({
    selector: 'app-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss']
})
export class FiltersComponent {

    @Input() icons: Icon[] = [];

    @Output() change: EventEmitter<Icon[]> = new EventEmitter();

    private readonly selected: Icon[] = [];

    click(target: Icon) {
        const index = this.findIndex(target);

        if (index < 0) {
            this.selected.push(target);
        } else {
            this.selected.splice(index, 1);
        };

        this.change.emit(this.selected);
    }

    findIndex(target: Icon): number {
        return this.selected.findIndex(filter => filter.id === target.id);
    }
}
