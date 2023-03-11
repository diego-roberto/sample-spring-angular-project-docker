import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { EquipmentCategory } from 'app/shared/models/equipment-categories.model';

@Injectable()
export class EquipmentCategoriesService {
    private endpoint = '/equipment_categories';

    constructor(private service: HttpClientService) { }

    getEquipmentCategoriesList() {
        return this.service.get(this.endpoint).map(jsonResponse => {
            return jsonResponse.equipmentCategories.map((jsonEquipmentCategories) => {
                return new EquipmentCategory().initializeWithJSON(jsonEquipmentCategories);
            });
        });
    }

    getEquipmentCategoryById(id: number) {
        return this.service.get(this.endpoint + '/' + id).map(jsonResponse => {
            return jsonResponse.equipmentCategory.map((jsonEquipmentCategories) => {
                return new EquipmentCategory().initializeWithJSON(jsonEquipmentCategories);
            });
        });
    }
}
