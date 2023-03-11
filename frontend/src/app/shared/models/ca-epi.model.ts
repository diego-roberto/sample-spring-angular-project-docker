import { ExternalImportEpi } from './external-import-epi.model';
import { Epi } from './epi.model';

export class CaEpi {
    id: number;
    epiFile: File;
    epiFileName: string;
    epiUrl: string;
    quantity: number;
    size: string;
    createdAt: any;
    epiId: Epi = new Epi;
    ca: ExternalImportEpi = new ExternalImportEpi;

    initializeWithJSON(json: any) {
        this.id = json.id;
        this.epiFileName = json.epiFileName;
        this.epiUrl = json.epiUrl;
        this.quantity = json.quantity;
        this.size = json.size;
        this.createdAt = json.createdAt;
        this.epiId = new Epi().initializeWithJSON(json.epiId);
        this.ca = json.externalImportEpi ? new ExternalImportEpi().initializeWithJSON(json.externalImportEpi) : null;

        return this;
    }

    toJSON() {
        return {
            id: this.id,
            epiFileName: this.epiFileName,
            epiUrl: this.epiUrl,
            quantity: this.quantity,
            size: this.size,
            createdAt: this.createdAt,
            epiId: this.epiId,
            externalImportEpi: this.ca
        };
    }
}
