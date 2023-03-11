import { CanMerge } from 'app/shared/util/generic/form/can-merge';
import { Construction } from 'app/shared/models/construction.model';

export class ConstructionDetails implements CanMerge<Construction> {

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

    initializeWithModel(model: Construction) {
        this.name = model.name;
        this.cep = model.cep;
        this.addressStreet = model.addressStreet;
        this.addressNumber = model.addressNumber;
        this.addressComplement = model.addressComplement;
        this.status = model.status;
        this.description = model.description;
        this.logoFile = model.logoFile;
        this.logoUrl = model.logoUrl;
        this.logoFileName = model.logoFileName;
        this.ceiFile = model.ceiFile;
        this.ceiCode = model.ceiCode;
        this.ceiUrl = model.ceiUrl;
        this.ceiFileName = model.ceiFileName;
        this.activated = model.activated;
    }

    merge(model: Construction) {
        model.name = this.name;
        model.cep = this.cep;
        model.addressStreet = this.addressStreet;
        model.addressNumber = this.addressNumber;
        model.addressComplement = this.addressComplement;
        model.status = this.status;
        model.description = this.description;
        model.logoFile = this.logoFile;
        model.logoUrl = this.logoUrl;
        model.logoFileName = this.logoFileName;
        model.ceiFile = this.ceiFile;
        model.ceiCode = this.ceiCode;
        model.ceiUrl = this.ceiUrl;
        model.ceiFileName = this.ceiFileName;
        model.activated = this.activated;
    }
}
