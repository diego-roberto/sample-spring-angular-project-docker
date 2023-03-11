export interface IAttachmentFile {
    id: number;
    fileName: string;
    url: string;
    fileThumbName: string;
    thumbUrl: string;
    type: string;
}

export class AttachmentFile implements IAttachmentFile {
    id: number;
    fileName: string;
    url: string;
    fileThumbName: string;
    thumbUrl: string;
    type: string;
    resource: any;
    resourceFile: File;

    public constructor() { }

    public initializeWithJSON(json: any): AttachmentFile {
        this.id = json.id;
        this.fileName = json.fileName;
        this.url = json.url;
        this.fileThumbName = json.fileThumbName;
        this.thumbUrl = json.thumbUrl;
        this.type = json.type;
        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            fileName: this.fileName,
            url: this.url,
            fileThumbName: this.fileThumbName,
            thumbUrl: this.thumbUrl,
            type: this.type
        };
    }
}
