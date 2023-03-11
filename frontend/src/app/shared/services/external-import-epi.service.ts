import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { ExternalImportEpi } from 'app/shared/models/external-import-epi.model';
import 'rxjs/add/operator/map';

@Injectable()
export class ExternalImportEpiService {
    private endpoint = '/external_import_epi';

    constructor(private service: HttpClientService) { }

    getExternalImportEpiByCa(ca: number) {
        return this.service.get(this.endpoint + '/caNumber/' + ca).map(jsonResponse => {
            if (jsonResponse.externalImportEpi) {
                return new ExternalImportEpi().initializeWithJSON(jsonResponse.externalImportEpi);
            } else {
                return new ExternalImportEpi();
            }
        });
    }
}
