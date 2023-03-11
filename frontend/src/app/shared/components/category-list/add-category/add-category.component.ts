import { Component, EventEmitter, Output, ViewChild, Input } from '@angular/core';

@Component({
    selector: 'add-category',
    templateUrl: './add-category.component.html',
    styleUrls: ['./add-category.component.scss']
})
export class AddNewCategoryComponent {

    @Output() added = new EventEmitter();
    @Output() edited = new EventEmitter();
    @Output() removed = new EventEmitter();

    @Input() category = '';
    @Input() index = -1;
    @Input() newCategoryLabel;
    @Input() editable = true;
    @Input() deletable: boolean;
    @Input() maxLength: number;
    @Input() visualType: string;

    editing = false;

    constructor() { }

    isNew() {
        return (this.index < 0);
    }

    startEditing() {
        if (this.editable) {
            this.editing = true;
        }
    }

    addCategory(category) {
        this.added.emit(category);
        this.category = '';
    }

    editCategory(category) {
        this.edited.emit({ name: category, index: this.index });
    }

    removeCategory() {
        this.removed.emit(this.index);
    }

    submit(category) {
        if (this.isNew()) {
            this.addCategory(category);
        } else {
            this.editCategory(category);
        }
        this.editing = false;
    }
}
