import { Construction } from './construction.model';
import { FileInfo } from './file-info.model';
import { Sector } from 'app/shared/models/sector.model';
import { Floor } from './floor.model';
import { User } from './user.model';
import { Worker } from './worker.model';

export interface IOccurrence {
    id: number;
    typeId: number;
    floor: Floor;
    local: string;
    type: TypeOccurrence;
    title: string;
    relatedBy: string;
    scheduleTo: Date;
    createdAt: Date;
    author: User;
    occurrenceType: TypeOccurrence;
    eventDestination: string;
    sector: Sector;
    workers: Worker[];
    files: Array<FileInfo>;
    active: boolean;
    isToday(): boolean;
}

export class Occurrence implements IOccurrence {
    id: number;
    typeId: number;
    floor: Floor;
    type: TypeOccurrence;
    title: string;
    relatedBy: string;
    scheduleTo: Date;
    createdAt: Date;
    author: User;
    workerAuthor: Worker;
    construction: Construction;
    constructionId: number;
    companyId: number;
    occurrenceType: TypeOccurrence;
    occurrenceSubType: OccurrenceSubType;
    eventDestination: string;
    local: string;
    sector: Sector;
    sectorStr: string;
    workers: Worker[];
    files: Array<FileInfo>;
    active: boolean;

    public constructor() { }

    public initializeWithJSON(json: any): Occurrence {

        this.id = json.id;
        this.scheduleTo = new Date(json.scheduleTo);
        this.floor = json.floor;
        this.local = json.local;
        this.title = json.title;
        this.type = json.type;
        this.relatedBy = json.relatedBy;
        this.createdAt = new Date(json.createdAt);
        this.eventDestination = json.eventDestination;
        if (json.author) {
            this.author = new User().initializeWithJSON(json.author);
        }

        if (json.workerAuthor) {
            this.workerAuthor = new Worker().initializeWithJSON(json.workerAuthor);
        }

        if (json.constructionId) {
            this.constructionId = json.constructionId;
        }

        if (json.construction) {
            this.construction = new Construction().initializeWithJSON(json.construction);
        }

        if (json.sector) {
            this.sector = new Sector().initializeWithJSON(json.sector);
        }

        if (json.occurrenceType) {
            this.occurrenceType = new TypeOccurrence().initializeWithJSON(json.occurrenceType);
        }

        if (json.occurrenceSubType) {
            this.occurrenceSubType = new OccurrenceSubType().initializeWithJSON(json.occurrenceSubType);
        }

        if (json.workers) {
            this.workers = json.workers;
        }

        if (json.files) {
            this.files = json.files.map(file => new FileInfo().initializeWithJSON(file));
        }

        this.createdAt = json.createdAt;
        this.active = true;

        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            dateTimeOccurrence: this.scheduleTo,
            eventDestination: this.eventDestination,
            author: this.author ? this.author.toJSON() : null,
            workerAuthor: this.workerAuthor ? this.workerAuthor.toJSON() : null,
            construction: this.construction ? this.construction.toJSON() : null,
            occurrenceType: this.occurrenceType ? this.occurrenceType.toJSON() : null,
            occurrenceSubType: this.occurrenceSubType ? this.occurrenceSubType.toJSON() : null,
            // TODO fazer tratamento quando for um objeto setor ou uma string
            // sector: this.sector ? this.sector.toJSON() : null,
            createdAt: this.createdAt,
            description: this.title,
            type: this.type,
            updateAt: new Date(),
            relatedBy: this.relatedBy,
            workers: this.workers ? this.workers : null,
            files: this.files ? this.files.map(file => file.toJSON()) : null,
            active: true,

            constructionId: this.constructionId
        };
    }

    public isToday(): boolean {
        const now = new Date();
        return (this.scheduleTo.getDay() === now.getDay() &&
            this.scheduleTo.getMonth() === now.getMonth() &&
            this.scheduleTo.getFullYear() === now.getFullYear());
    }
}


export class TypeOccurrence {
    id: number;
    description: string;


    public constructor(_id?: number, _description?: string) {
        this.id = _id;
        this.description = _description;
    }

    public initializeWithJSON(json: any): TypeOccurrence {
        this.id = json.id;
        this.description = json.description;

        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            description: this.description
        };
    }
}


export class OccurrenceSubType {
    id: number;
    description: string;

    public constructor(_id?: number, _description?: string) {
        this.id = _id;
        this.description = _description;
    }

    public initializeWithJSON(json: any): TypeOccurrence {
        this.id = json.id;
        this.description = json.description;

        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            description: this.description
        };
    }
}


