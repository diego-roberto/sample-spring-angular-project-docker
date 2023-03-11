import { FileInfo } from 'app/shared/models/file-info.model';
export class FilesChecklistQuestionAnswer {

    id: number;
    idFiles: number;
    idChecklistQuestionAnswer: number;

    files: FileInfo;

    public initializeWithJSON(json: any): FilesChecklistQuestionAnswer {
        this.id = json.id;
        this.idFiles = json.idFiles;
        this.idChecklistQuestionAnswer = json.idChecklistQuestionAnswer;

        this.files = json.files ? new FileInfo().initializeWithJSON(json.files) : null;

        return this;
    }

    toJSON() {
        return {
            id: this.id,
            idFiles: this.idFiles,
            idChecklistQuestionAnswer: this.idChecklistQuestionAnswer,

            files: this.files
        };
    }
}
