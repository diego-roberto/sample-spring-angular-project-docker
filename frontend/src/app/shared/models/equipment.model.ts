import { Construction } from './construction.model';
import { EquipmentType } from './equipment-types.model';
import { EquipmentCategory } from './equipment-categories.model';

export class Equipment {

    id: number;

    identification: string;
    hasMaintenance: boolean;
    periodicity: number;
    lastMaintenance: any;
    category: EquipmentCategory;
    type: EquipmentType;
    construction: number;
    createdAt: any;
    maintenanceDone: boolean;

    public initializeWithJSON(json, construction: Construction): Equipment {
        this.id = json.id;
        this.identification = json.identification;
        this.hasMaintenance = json.maintenance;
        this.periodicity = json.periodicity;
        this.lastMaintenance = json.lastMaintenance;
        this.category = json.category;
        this.type = json.type;
        this.construction = json.constructionId;
        this.createdAt = json.createdAt;
        this.maintenanceDone = json.maintenanceDone;

        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            identification: this.identification,
            maintenance: this.hasMaintenance,
            periodicity: this.periodicity,
            lastMaintenance: this.lastMaintenance,
            category: this.category,
            type: this.type,
            constructionId: this.construction,
            createdAt: this.createdAt,
            maintenanceDone: this.maintenanceDone
        };
    }
}
