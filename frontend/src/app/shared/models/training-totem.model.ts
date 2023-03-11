
export class TrainingTotem {
    trainingScheduleId:number;
    title: string;
    description: string;
    video_url: string;
    duration: Date;
    keywords: string[];

    public initializeWithJSON(json: any): TrainingTotem {
       this.trainingScheduleId = json.trainingScheduleId;
        this.title = json.title;
        this.description = json.description;
        this.video_url = json.video_url;
        this.duration = json.duration;
        this.keywords = json.keywords;

        return this;
    }

    public toJSON() {
        return {
            trainingScheduleId: this.trainingScheduleId,
            title: this.title,
            description: this.description,
            video_url: this.video_url,
            duration: this.duration,
            keywords: this.keywords
        };
    }
}
