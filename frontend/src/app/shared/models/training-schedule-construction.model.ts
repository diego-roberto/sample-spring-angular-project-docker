export class TrainingScheduleConstruction {
    id: number;
    scheduledBegin: Date;
    scheduledEnd: Date;
    scheduledTime: Date;
    attendanceListAt: Date;
    description: string;
    place: string;
    totalParticipantExpected: number;
    totalParticipantReal: number;
    trainingTitle: string;
    exhibitionModeId: number;
    exhibitionMode: string;
    ministerNames: string;
    categoryNames: string;
    attendanceFileName: string;

    public initializeWithJSON(json: any): TrainingScheduleConstruction {
        this.id = json.id;
        this.scheduledBegin = json.scheduledBegin;
        this.scheduledEnd = json.scheduledEnd;
        this.scheduledTime = json.scheduledTime;
        this.attendanceListAt = json.attendanceListAt;
        this.description = json.description;
        this.place = json.place;
        this.totalParticipantExpected = json.totalParticipantExpected;
        this.totalParticipantReal = json.totalParticipantReal;
        this.trainingTitle = json.trainingTitle;
        this.exhibitionModeId = json.exhibitionModeId;
        this.exhibitionMode = json.exhibitionMode;
        this.ministerNames = json.ministerNames;
        this.categoryNames = json.categoryNames;
        this.attendanceFileName = json.attendanceFileName;

        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            scheduledBegin: this.scheduledBegin,
            scheduledEnd: this.scheduledEnd,
            scheduledTime: this.scheduledTime,
            attendanceListAt: this.attendanceListAt,
            description: this.description,
            place: this.place,
            totalParticipantExpected: this.totalParticipantExpected,
            totalParticipantReal: this.totalParticipantReal,
            trainingTitle: this.trainingTitle,
            exhibitionModeId: this.exhibitionModeId,
            exhibitionMode: this.exhibitionMode,
            ministerNames: this.ministerNames,
            categoryNames: this.categoryNames,
            attendanceFileName: this.attendanceFileName,
        };
    }
}

