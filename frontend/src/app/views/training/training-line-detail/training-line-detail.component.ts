import { Training } from './../../../shared/models/training.model';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { PermissionService } from '../../../shared/services/permission.service';



@Component({
    selector: 'training-line-detail',
    templateUrl: './training-line-detail.component.html',
    styleUrls: ['./training-line-detail.component.scss']
})
export class TrainingLineDetailComponent implements OnInit {
    @Input() training: Training;
    
    @Output() inactivateTraining:EventEmitter<any> = new EventEmitter();
    constructor(private router: Router,
        private route: ActivatedRoute,
        public dialog: MdDialog,
        public snackBar: MdSnackBar,
        public permissionService:PermissionService,
    ) { }

    ngOnInit() {

    }

    redirectTo(route) {
        this.router.navigate([route], { relativeTo: this.route });
    }

    toInactivateTraining(training){
        this.inactivateTraining.emit(training);
        
    }

    private handleError(error) {
        if (error.json() && error.json().errors && error.json().errors.length > 0) {
            this.snackBar.open(error.json().errors[0].message, null, { duration: 3000 });
        } else {
            this.snackBar.open('Erro no servidor!', null, { duration: 3000 });
        }
    }
}
