export interface AttachmentFileInterface {
    id: number;
    fileName: string;
    url: string;
    fileThumbName: string;
    thumbUrl: string;
    type: string;
    taskId: number;

    initializeWithJSON(json: any): AttachmentTaskFile;

    toJSON();
}

export class AttachmentTaskFile implements AttachmentFileInterface {
    id: number;
    fileName: string;
    url: string;
    fileThumbName: string;
    thumbUrl: string;
    type: string;
    taskId: number;
    history:boolean;

    file: File;
    resourceFile: File;
    thumbFile: File;
    resourceThumbFile: File;

    public constructor() { }

    public initializeWithJSON(json: any): AttachmentTaskFile {
        this.id = json.id;
        this.fileName = json.fileName;
        this.url = json.url;
        this.fileThumbName = json.fileThumbName;
        this.thumbUrl = json.thumbUrl;
        this.type = json.type;
        this.taskId = json.taskId;
        this.history = json.history === undefined ? false : json.history;
        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            fileName: this.fileName,
            url: this.url,
            fileThumbName: this.fileThumbName,
            thumbUrl: this.thumbUrl,
            type: this.type,
            taskId: this.taskId,
            history: this.history === undefined ? false : this.history
        };
    }
}
