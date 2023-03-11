import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Training } from 'app/shared/models/training.model';

import { EmbedVideoService } from 'ngx-embed-video';


@Component({
    selector: 'training-line-detail',
    templateUrl: './training-line-detail.component.html',
    styleUrls: ['./training-line-detail.component.scss']
})
export class TrainingLineDetailComponent implements OnInit {
    @Input() training: Training;
    @Input() step: Number;
    @Input() selectedId: Number;
    @Input() index: Number;
    thumb: Promise<string> | null = null;

    @Output() pageChanged = new EventEmitter<number>();
    @Output() previewSelected = new EventEmitter<number>();

    constructor(private router: Router,
        private route: ActivatedRoute,
        public dialog: MdDialog,
        public snackBar: MdSnackBar,
        public embedService: EmbedVideoService,
    ) { }

    ngOnInit() {
        if (this.training.videoUrl) {
            this.embedService.embed_image(this.training.videoUrl, { image: 'default' }).then(
                (image) => {
                    this.thumb = image.link;
                }
            );
        }
    }

    redirectTo(route) {
        this.router.navigate([route], { relativeTo: this.route });
    }

    selectTraining(id) {
        this.step = 2;
        this.pageChanged.emit(id);
    }

    previewTraining(id) {
        this.previewSelected.emit(id);
    }

    private handleError(error) {
        if (error.json() && error.json().errors && error.json().errors.length > 0) {
            this.snackBar.open(error.json().errors[0].message, null, { duration: 3000 });
        } else {
            this.snackBar.open('Erro no servidor!', null, { duration: 3000 });
        }
    }

    getThumbnail() {
        if (this.training.videoUrl) {
            return this.thumb;
        } else {
            return 'assets/capacitacao_presencial.jpg';
        }
    }

    getCursorStyle(text: boolean) {
        if (this.training.videoUrl) {
            return { 'cursor': 'pointer' };
        } else if (text) {
            return { 'cursor': 'text' };
        } else {
            return { 'cursor': 'default' };
        }
    }
}

