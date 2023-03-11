import { TermType } from "./term-type.model";

export class Term {
    id: number;
    filePath: string;
    version: string;
    termType: TermType;

    initializeWithJSON(json: any) {
        this.id = json.id;
        this.filePath = json.filePath;
        this.version = json.version;
        this.termType = json.termType ? new TermType().initializeWithJSON(json.termType) : null;
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            filePath: this.filePath,
            version: this.version,
            termType: this.termType
        };
    }
}
