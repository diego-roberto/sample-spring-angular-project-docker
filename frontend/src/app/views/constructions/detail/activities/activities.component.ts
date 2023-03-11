import { ConstructionsService } from 'app/shared/services/constructions.service';
import { Occurrence } from 'app/shared/models/occurrence.model';
import { ChecklistComponent } from './checklist/checklist.component';
import { OnInit, Component, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { MdTabGroup, MdTabChangeEvent, MdTab } from '@angular/material';

import { Task } from 'app/shared/models/task.model';
import { PermissionService } from '../../../../shared/services/permission.service';

@Component({
    selector: 'activities-component',
    templateUrl: 'activities.component.html',
    styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {
    @ViewChild('tabGroup') tabGroup: MdTabGroup;
    @ViewChild('taskScroll') taskScroll;
    @ViewChild('checklistcomponent') checklistComponent: ChecklistComponent;

    changeTask: Subject<Task> = new Subject<Task>();
    changeOccurrence: Subject<Occurrence> = new Subject<Occurrence>();
    tabIndex = 0;

    opennedByLink = {urlOppened: null};

    constructor(
        private route: ActivatedRoute,
        public permissionService:PermissionService
    ) { }

    ngOnInit() {
        this.route.fragment.subscribe(fragment => {
            if (this.route.snapshot.params.task) {
                this.openTasksList();
            } else if (this.route.snapshot.params.occurrence) {
                this.openOccurrenceList();
            }
        });
    }

    goBackParentScroll() {
        document.getElementById('taskScroll').scrollTo(0, 0);
    }

    onAddTask(task: Task) {
        this.changeTask.next(task);
    }

    onAddOccurrence(occurrence: Occurrence) {
        this.changeOccurrence.next(occurrence);
    }

    openTasksList(){
        this.changeTab(1);
    }

    openOccurrenceList(){
        this.changeTab(0);
    }

    changeTab(index: number){
        this.tabGroup.selectedIndex = index;
        const tabChange = new MdTabChangeEvent();
        tabChange.index = index;
        this.tabGroup.selectChange.emit(tabChange);
    }
}
