import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { EquipmentType } from 'app/shared/models/equipment-types.model';

@Injectable()
export class EquipmentTypesService {
    public equipmentType: EquipmentType;
    private endpoint = '/equipment_types';

    constructor(private service: HttpClientService) { }

    getEquipmentTypesList() {
        return this.service.get(this.endpoint).map(jsonResponse => {
            return jsonResponse.equipmentTypes.map((jsonEquipmentTypes) => {
                return new EquipmentType().initializeWithJSON(jsonEquipmentTypes);
            });
        });
    }

    getEquipmentTypeById(id: number) {
        return this.service.get(this.endpoint + '/' + id).map(jsonResponse => {
            return jsonResponse.equipmentType.map((jsonEquipmentType) => {
                return new EquipmentType().initializeWithJSON(jsonEquipmentType);
            });
        });
    }
}
