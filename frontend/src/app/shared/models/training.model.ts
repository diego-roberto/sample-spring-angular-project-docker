
import { TrainingKeyword } from 'app/shared/models/training-keyword.model';

export class Training {
    id: number;
    title: string;
    category: number;
    exhibition: string;
    exhibitions: any[];
    services: string[];
    stringServices: string;
    videoThumbnail: string;
    videoId: string;
    videoUrl: string;
    description: string;
    keywords: TrainingKeyword[];
    global: boolean;
    duration: string;

    public initializeWithJSON(json: any): Training {

        this.id                  = json.id;
        this.title               = json.title;
        this.category            = json.category;
        this.exhibition          = json.exhibition;
        this.exhibitions         = json.exhibitions;
        this.services            = json.services;
        this.stringServices      = json.stringServices;
        this.videoThumbnail      = json.videoThumbnail;
        this.videoId             = json.videoId;
        this.videoUrl            = json.videoUrl;
        this.description         = json.description;
        this.keywords            = json.keywords;
        this.global              = json.global;
        this.duration            = json.duration;
        return this;
    }

    public toJSON() {
        return {
            id:                  this.id,
            title:               this.title,
            category:            this.category,
            exhibition:          this.exhibition,
            exhibitions:         this.exhibitions,
            services:            this.services,
            stringServices:      this.stringServices,
            videoThumbnail:      this.videoThumbnail,
            videoId:             this.videoId,
            videoUrl:            this.videoUrl,
            description:         this.description,
            keywords:            this.keywords,
            global:              this.global,
            duration:            this.duration,
        };
    }

    constains(value: string) {

    }
}
