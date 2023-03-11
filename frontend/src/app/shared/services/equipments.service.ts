import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Equipment } from 'app/shared/models/equipment.model';
import { Construction } from 'app/shared/models/construction.model';
import { FileInfo } from "app/shared/models/file-info.model";

@Injectable()
export class EquipmentsService {
    private endpoint = '/equipments';

    constructor(private service: HttpClientService) { }

    getEquipmentList(construction: Construction) {
        return this.service.get(this.endpoint).map(jsonResponse => {
            return jsonResponse.equipment.map((jsonEquipment) => {
                return new Equipment().initializeWithJSON(jsonEquipment, construction);
            });
        });
    }

    getEquipmentById(id: number, construction: Construction) {
        return this.service.get(this.endpoint + '/' + id).map(jsonResponse => {
            return jsonResponse.equipment.map((jsonEquipment) => {
                return new Equipment().initializeWithJSON(jsonEquipment, construction);
            });
        });
    }

    toPrintEquipmentMaintenanceReport(constructionId: number, initialData: string, finalData: string): Observable<File> {
        const request = {
            initialPeriod: initialData,
            finalPeriod: finalData,
            constructionId: constructionId
        };

        return this.service.post(this.endpoint + '/printEquipmentMaintenanceReport', request).map(
            (response) => {
                    const fileInfo: FileInfo = new FileInfo().initializeWithJSON(response);
                    const sFile: string = fileInfo.file;
                    const byteCharacters = atob(sFile);
                    const byteNumbers = new Array(byteCharacters.length);

                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }

                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: fileInfo.fileType });

                    return new File([blob], fileInfo.fileName, { type: fileInfo.fileType });
            }
        );

    }

    findAllCountEquipmentMaintenanceByStatus(beginAt:Date,endAt:Date,intervalType:string,constructionIds:Array<number>): Observable<Array<any>> {
        return this.service.post(this.endpoint + '/findAllCountEquipmentMaintenanceByStatus',{
            beginAt:beginAt,
            endAt:endAt,
            intervalType:intervalType,
            constructionIds:constructionIds,
        })
            .map((jsonResponse) => {
                return jsonResponse.response;
            });
    }

}
