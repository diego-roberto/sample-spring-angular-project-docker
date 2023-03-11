import { Sector } from './sector.model';
import { ResponsibleEngineer } from './responsible-engineer';
import { ResponsibleSafety } from './responsible-safety';
import { Equipment } from './equipment.model';
import { Worker } from './worker.model';
import { Clonable } from '../util/generic/form/clonable';
import { ConstructionDocumentation } from 'app/shared/models/construction-documentation.model';

const statuses = {
    0: 'IN_PROGRESS',
    1: 'PAUSED',
    2: 'FINISHED'
};

export class Construction implements Clonable<Construction> {
    id: number;
    name: string;
    cep: string;
    addressStreet: string;
    addressNumber: string;
    addressComplement: string;
    status: number;
    description: string;
    logoFile: File;
    logoUrl: string;
    logoFileName: string;
    ceiFile: File;
    ceiCode: string;
    ceiUrl: string;
    ceiFileName: string;
    activated: boolean;

    createdAt: Date;
    updatedAt: Date;

    responsibleEngineer: ResponsibleEngineer;
    responsibleSafety: ResponsibleSafety;

    constructionDocumentationList: ConstructionDocumentation[] = [];

    sectors: Array<Sector> = [];
    equipments: Array<Equipment> = [];
    workers: Array<Worker> = [];

    notifications = 0;
    modules: Array<number> = [];

    static getStatus(value: number) {
        return statuses[value];
    }

    public getStatus() {
        return Construction.getStatus(this.status);
    }

    public initializeWithJSON(json: any): Construction {
        this.id = json.id;
        this.name = json.name;
        this.cep = json.cep;
        this.addressStreet = json.addressStreet;
        this.addressNumber = json.addressNumber;
        this.addressComplement = json.addressComplement;
        this.status = json.status;
        this.description = json.description;
        this.logoUrl = json.logoUrl;
        this.logoFileName = json.logoFileName;
        this.ceiCode = json.ceiCode;
        this.ceiUrl = json.ceiUrl;
        this.ceiFileName = json.ceiFileName;
        this.createdAt = json.createdAt ? new Date(json.createdAt) : null;
        this.updatedAt = json.updatedAt ? new Date(json.updatedAt) : null;

        if (json.responsibleEngineer) {
            this.responsibleEngineer = new ResponsibleEngineer().initializeWithJSON(json.responsibleEngineer);
        }
        if (json.responsibleSafety) {
            this.responsibleSafety = new ResponsibleSafety().initializeWithJSON(json.responsibleSafety);
        }
        if (json.sectors) {
            this.sectors = json.sectors.map(jsonSector => new Sector().initializeWithJSON(jsonSector, this));
        }
        if (json.equipments) {
            this.equipments = json.equipments.map(jsonEquipment => new Equipment().initializeWithJSON(jsonEquipment, this));
        }
        if (json.workers) {
            this.workers = json.workers.map(jsonWorker => new Worker().initializeWithJSON(jsonWorker));
        }

        this.constructionDocumentationList = json.listConstructionDocumentation ? json.listConstructionDocumentation.map(contructionDocumentation => { return new ConstructionDocumentation().initializeWithJSON(contructionDocumentation); }) : [];

        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            cep: this.cep,
            addressStreet: this.addressStreet,
            addressNumber: this.addressNumber,
            addressComplement: this.addressComplement,
            status: this.status,
            description: this.description,
            logoUrl: this.logoUrl,
            logoFileName: this.logoFileName,
            ceiCode: this.ceiCode,
            ceiUrl: this.ceiUrl,
            ceiFileName: this.ceiFileName,
            responsibleEngineer: this.responsibleEngineer ? this.responsibleEngineer : null,
            responsibleSafety: this.responsibleSafety ? this.responsibleSafety : null,
            sectors: this.sectors.map(sector => sector.toJSON()),
            equipments: this.equipments ? this.equipments.map(equipment => equipment.toJSON()) : null,
            workers: this.workers.map(worker => worker.toJSON())
        };
    }

    clone(): Construction {
        const construction = Object.assign(new Construction(), this);
        construction.sectors = this.sectors ? this.sectors.map(sector => Object.assign(new Sector(), sector)) : null;
        construction.equipments = this.equipments ? this.equipments.map(equipment => Object.assign(new Equipment(), equipment)) : null;
        construction.workers = this.workers ? this.workers.map(worker => worker.clone()) : null;
        return construction;
    }
}
