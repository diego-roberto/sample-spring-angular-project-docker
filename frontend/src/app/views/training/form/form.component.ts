
import { VideoService } from 'app/shared/services/video.service';

import { Component, OnInit, ElementRef, Input, HostListener, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { TrainingGenericAssign } from 'app/shared/models/training-generic-assign.model';
import { Task } from 'app/shared/models/task.model';
import { TrainingKeyword } from 'app/shared/models/training-keyword.model';
import { MaskUtil } from 'app/shared/util/mask.util';
import { Service } from 'app/shared/models/service.model';
import { ServicesService } from 'app/shared/services/services.service';
import { TrainingKeywordService } from '../../../shared/services/training-keyword.service';
import { Training } from 'app/shared/models/training.model';
import { TrainingService } from 'app/shared/services/training.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialog, MD_DIALOG_DATA } from '@angular/material';
import { ConfirmCancelDialogComponent } from 'app/views/training/form/confirm-cancel-dialog/confirm-cancel-dialog.component';
import { InfoDialogHandler} from 'app/shared/util/generic/info-dialog/info-dialog.handler';


@Component({
    selector: 'safety-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss']
})
export class TrainingFormComponent implements OnInit {
    @Input() query: string;
    @Input() task: Task;
    @Output() bindAttachments: EventEmitter<any> = new EventEmitter();
    stateCtrl: FormControl;
    supportedFileTypes: Array<string> = ['image/png', 'image/jpeg', 'video/mp4', 'video/webm', 'video/ogg'];
    trainingForm: FormGroup;
    @ViewChild('keywords') kwElement: ElementRef;
    @Output() palavrasSelecionadas = new EventEmitter<any>();
    services: Array<Service> = new Array<Service>();
    keywords: Array<TrainingKeyword> = new Array<TrainingKeyword>();

    exhibitions: Array<any> = [{ id: 1, name: 'Presencial' }, { id: 2, name: 'Totem' }, ];

    categories = [{ id: '1', name: 'PROFISSIONALIZANTE' }, { id: '2', name: 'SST' }, { id: '3', name: 'Outros' }];
    placeHolder: string;
    filteredKeywords: any;
    selected = [];
    selectedServices: any[] = [];
    selectedKeywords: any[] = [];

    title: string;
    selectedExhibitions: number;
    category: number;
    midia: string;
    cargaHoraria: string;
    description: string;

    urlHint = 'Vídeo deve ser público.';
    trainingDescMaxLength = 1300;

    constructor(private fb: FormBuilder,
        private serviceService: ServicesService,
        private trainingService: TrainingService,
        private videoService: VideoService,
        private trainingKeywordService: TrainingKeywordService,
        private router: Router,
        private route: ActivatedRoute,
        public dialog: MdDialog,
        private infoDialogHandler: InfoDialogHandler
    ) {

        this.trainingForm = this.fb.group({
            title: new FormControl('', Validators.compose([Validators.required])),
            exhibition: new FormControl('', [Validators.required]),
            category: new FormControl('', [Validators.required]),
            selectedServices: new FormControl('', [Validators.required]),
            horario: new FormControl('', [Validators.required]),
            cargaHoraria: new FormControl('', []),
            midia: new FormControl('', Validators.compose([Validators.pattern('^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$')])),
            description: new FormControl('', []),
            exhibitionForm: new FormControl('', []),

        });

        this.stateCtrl = new FormControl();
        this.filteredKeywords = this.stateCtrl.valueChanges
            .startWith(null)
            .map(keyword => this.filterKeywords(keyword));
    }


    ngOnInit() {
        this.trainingKeywordService.getKeywords().subscribe((keyword) => {
            this.keywords = keyword;
        });

        this.serviceService.getServices().subscribe((service) => {
            this.services = service;
        });
        this.placeHolder = 'Palavras-chave';
    }

    process(item, isSelected) {
        if (isSelected) {
            this.remove(item);
        } else {
            this.insert(item);
        }

        this.palavrasSelecionadas.emit(this.selected);
    }

    get durationTimeMask() {
        return MaskUtil.durationTimeMask;
    }

    filterKeywords(val: string) {
        return val ? this.keywords.filter(s => s.keyword.toLowerCase().indexOf(val.toLowerCase()) === 0)
            : this.keywords;
    }

    select(item) {
        this.selected.push(item);
        this.clean();
    }

    insert(item) {
        this.selected.push(item);
        this.clean();
        this.kwElement.nativeElement.blur();
    }

    remove(item) {
        this.selected.splice(this.selected.indexOf(item), 1);
        this.clean();
        this.kwElement.nativeElement.blur();
    }

    isSelected(value: string): boolean {
        let found = false;
        this.selected.forEach(item => {
            if (value === item.keyword) {
                found = true;
            }
        });
        return found;
    }

    clean() {
        this.query = '';
    }

    @HostListener('blur', ['$event'])
    blurEventHandler() {
        this.placeHolder = 'Palavras-chave';
        this.query = '';
    }

    @HostListener('focus', ['$event'])
    focusEventHandler() {
        this.stateCtrl.setValue('');
        this.placeHolder = 'Palavras-chave';
    }

    @HostListener('focusout', ['$event'])
    focusOutEventHandler() {
        this.placeHolder = '';
        let vg = ' ';
        this.selected.forEach((item) => {
            this.placeHolder = this.placeHolder + vg + item.keyword;
            vg = ', ';
        });
        if (this.placeHolder === '') {
            this.placeHolder = 'Palavras-chave';
        }

    }

    sendData() {
        // this.bindAttachments.emit(this.attachmentFiles);
    }


    confirmCancel() {
        if (typeof this.title === 'undefined' &&
            typeof this.selectedExhibitions === 'undefined' &&
            typeof this.category === 'undefined' &&
            this.selectedServices.length === 0 &&
            this.selected.length === 0 &&
            typeof this.cargaHoraria === 'undefined' &&
            typeof this.midia === 'undefined' &&
            typeof this.description === 'undefined'
        ) {
            this.redirectTo('/training/page/1/exclude/0');
        } else {
            const dialogRef = this.dialog.open(ConfirmCancelDialogComponent, { width: '400px' });
            dialogRef.afterClosed().subscribe(() => {
                this.update();
            });

            dialogRef.componentInstance.cancelInsert.subscribe(() => {
                this.title = '';
                this.selectedExhibitions = 0;
                this.category = 0;
                this.selectedServices = [];
                this.selected = [];
                this.cargaHoraria = '';
                this.midia = '';
                this.description = '';
                this.placeHolder = 'Palavras-chave';

                dialogRef.close();

            });
        }

    }

    update() { }

    hasPendingFields() {
        if (this.hasErrorForm('title', 'isnecessary')) { return true; }
        if (this.hasErrorForm('title', 'invalid')) { return true; }
        if (this.title == null || this.title === '') { return true; }
        if (this.selectedExhibitions == null || this.selectedExhibitions === 0) { return true; }
        if (this.category == null || this.category === 0) { return true; }
        if (this.selectedKeywords.length > 5) { return true; }
        if (this.selectedExhibitions === 2) {
            if (this.midia == null || this.midia === '') { return true; }
        }

        return false;
    }

    saveIt() {

        const training = new Training();

        training.global = false;
        training.title = this.title;
        training.exhibition = '' + this.selectedExhibitions;
        training.category = this.category;
        training.duration = this.cargaHoraria;
        if (this.midia) {
            const videoID = this.videoService.getVideoId(this.midia);
            if (videoID.length > 1) {
                training.videoUrl = 'https://www.youtube.com/watch?v=' + videoID;
            } else {
                this.infoDialogHandler.call('URL do Vídeo', 'Favor inserir uma URL válida.');
                return;
            }
        }
        training.description = this.description;
        training.keywords = this.selectedKeywords;
        training.services = this.selectedServices;

        let insertedId = 0;

        this.trainingService.createTraining(training).subscribe(
            res => {
                insertedId = res.id;
                this.assign_services(insertedId, this.selectedServices);
                this.assign_exhibitions(insertedId, this.selectedExhibitions);
                this.assign_categories(insertedId, this.category);
                this.assign_keywords(insertedId, this.selected);
            },
            (err) => {
                console.log(err);
            },
            () => {
                setTimeout(() => { this.redirectTo('/training/page/1/exclude/0'); } , 200);
            }
        );
    }

    redirectTo(path) {
        this.router.navigate([path], { relativeTo: this.route });
    }

    assign_services(insertedId, selectedServices) {
        selectedServices.forEach(item => {
            const params: TrainingGenericAssign = new TrainingGenericAssign();
            params.idTraining = insertedId;
            params.idRelationship = item;
            this.trainingService.assign_services(params).subscribe();
        });

    }

    assign_exhibitions(insertedId, selectedExhibitions) {
        const params: TrainingGenericAssign = new TrainingGenericAssign();
        params.idTraining = insertedId;
        params.idRelationship = selectedExhibitions;
        this.trainingService.assign_exhibitions(params).subscribe();
    }

    assign_categories(insertedId, category) {
        const params: TrainingGenericAssign = new TrainingGenericAssign();
        params.idTraining = insertedId;
        params.idRelationship = category;
        this.trainingService.assign_categories(params).subscribe();
    }

    assign_keywords(insertedId, selected) {
        selected.forEach(item => {
            const params: TrainingGenericAssign = new TrainingGenericAssign();
            params.idTraining = insertedId;
            params.idRelationship = item.id;
            this.trainingService.assign_keywords(params).subscribe();

        });
    }

    hasErrorForm(attr: string, type: string): boolean {
        if (this.trainingForm.controls[attr].touched || this.trainingForm.controls[attr].dirty) {
            return this.trainingForm.controls[attr].hasError(type);
        } else {
            return false;
        }
    }

    hasKeywords(selectedKeywords) {
        this.selectedKeywords = selectedKeywords;
    }

    checkDuration() {
        // ex: https://youtu.be/_3EZYjp8Emw
        if (this.videoService.getVideoType(this.midia) === 'youtube') {
            this.videoService.getYoutubeInfo(this.videoService.getVideoId(this.midia)).subscribe(
                (res: any) => {
                    const duration = res.items[0].contentDetails.duration;
                    const reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
                    let hours = 0, minutes = 0, seconds = 0;

                    const matches = reptms.exec(duration);
                    if (matches[1]) {
                        hours = 0 + Number(matches[1]);
                    }
                    if (matches[2]) {
                        minutes = 0 + Number(matches[2]);
                    }
                    if (matches[3]) {
                        seconds = 0 + Number(matches[3]);
                    }
                    this.cargaHoraria = hours.toLocaleString('pt-Br', { minimumIntegerDigits: 2 }) + ':' + minutes.toLocaleString('pt-Br', { minimumIntegerDigits: 2 }) + ':' + seconds.toLocaleString('pt-Br', { minimumIntegerDigits: 2 });
                }
            );
        }
        // ex: https://vimeo.com/303699808
        if (this.videoService.getVideoType(this.midia) === 'vimeo') {
            this.videoService.getVimeoInfo(this.videoService.getVideoId(this.midia)).subscribe(
                (res: any) => {
                    const duration = res[0].duration;
                    let hours = 0, minutes = 0, seconds = 0;
                    const date = new Date(duration * 1000);
                    hours = date.getUTCHours();
                    minutes = date.getUTCMinutes();
                    seconds = date.getSeconds();
                    this.cargaHoraria = hours.toLocaleString('pt-Br', { minimumIntegerDigits: 2 }) + ':' + minutes.toLocaleString('pt-Br', { minimumIntegerDigits: 2 }) + ':' + seconds.toLocaleString('pt-Br', { minimumIntegerDigits: 2 });
                }
            );
        }
    }
}
