export class FileInfo {

    id: number;
    userFileName: string;
    fileName: string;
    fileType: string;
    functionality: string;
    filePath: string;
    file: any;
    resourceFile: File;

    public initializeWithJSON(json: any): FileInfo {

        this.id = json.id;
        this.userFileName = json.userFileName;
        this.fileName = json.fileName;
        this.fileType = json.fileType;
        this.functionality = json.functionality;
        this.filePath = json.filePath;
        this.file = json.file;
        this.resourceFile = json.resourceFile;

        return this;
    }

    toJSON() {
        return {
            id: this.id,
            userFileName: this.userFileName,
            fileName: this.fileName,
            fileType: this.fileType,
            filePath: this.filePath,
            functionality: this.functionality,
            file: this.file,
            resourceFile: this.resourceFile
        };
    }

}
