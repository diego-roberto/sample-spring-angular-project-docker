import { MdDialog } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConstructionsService } from 'app/shared/services/constructions.service';
import { EmotionService, FeelingsEnum } from 'app/shared/services/emotion.service';
import { HelpDialogComponent } from 'app/shared/components/help/help.component';

@Component({
    selector: 'day-status',
    templateUrl: 'day-status.component.html',
    styleUrls: ['./day-status.component.scss']
})
export class DayStatusComponent implements OnInit {
    @ViewChild('tabGroup') tabGroup;

    totalWorkers: number = this.constructionService.construction.workers.length;
    todayEmotions: any;
    yesterdayEmotions: any;
    todayResult: Result;
    yesterdayResult: Result;
    angryCount = 0;
    sadCount = 0;
    gladCount = 0;
    excitedCount = 0;
    notAnsweredCount = 0;


    constructor(
        public constructionService: ConstructionsService,
        public emotionService: EmotionService,
        public dialog: MdDialog
    ) { }

    ngOnInit(): void {
        this.emotionService.getEmotionToday(this.constructionService.construction.id).subscribe(e => {
            this.todayEmotions = e;
            this.todayResult = this.emotionCount(this.todayEmotions);
            this.resetCounts();
        });
        this.emotionService.getEmotionYesterday(this.constructionService.construction.id).subscribe(e => {
            this.yesterdayEmotions = e;
            this.yesterdayResult = this.emotionCount(this.yesterdayEmotions);
            this.resetCounts();
        });
    }

    emotionCount(emotionsList): Result {
        emotionsList.forEach(emotion => {
            if (emotion.feeling === FeelingsEnum.IRRITADO) { this.angryCount++; }
            if (emotion.feeling === FeelingsEnum.TRISTE) { this.sadCount++; }
            if (emotion.feeling === FeelingsEnum.CONTENTE) { this.gladCount++; }
            if (emotion.feeling === FeelingsEnum.EMPOLGADO) { this.excitedCount++; }
            if (emotion.feeling <= 0 || emotion.feeling === FeelingsEnum.NAO_RESPONDIDO) { this.notAnsweredCount++; }
        });

        return new Result(this.angryCount, this.sadCount, this.gladCount, this.excitedCount, this.notAnsweredCount);
    }

    resetCounts(){
        this.angryCount = this.sadCount = this.gladCount = this.excitedCount = this.notAnsweredCount = 0;
    }

    openDialog() {
        this.dialog.open(HelpDialogComponent);
    }

}

export class Result {
    angry: number;
    sad: number;
    glad: number;
    excited: number;
    notAnswered: number;

    constructor(
        angry: number,
        sad: number,
        glad: number,
        excited: number,
        notAnswered: number,
    ) {
        this.angry = angry;
        this.sad = sad;
        this.glad = glad;
        this.excited = excited;
        this.notAnswered = notAnswered;
    }
}
