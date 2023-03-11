export class CompanyDocumentation {

    id: number;
    description: string;
    dueDate: Date;
    accessBlocked: boolean;
    shelved: boolean;
    shelvedAt: Date;
    originRenew: CompanyDocumentation;
    fileUrl: string;
    fileName: string;
    file: File;

    constructor() { }

    public initializeWithJSON(json: any): CompanyDocumentation {
        this.id = json.id;
        this.description = json.description;
        this.dueDate = json.dueDate ? new Date(json.dueDate) : undefined;
        this.accessBlocked = json.accessBlocked;
        this.shelved = json.shelved;
        this.shelvedAt = json.shelvedAt;
        this.originRenew = json.originRenew ? new CompanyDocumentation().initializeWithJSON(json.originRenew) : undefined;
        this.fileUrl = json.fileUrl;
        this.fileName = json.fileName;

        return this;
    }

}
