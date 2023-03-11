import { EquipmentCategory } from './equipment-categories.model';

export class EquipmentType {

    id: number;
    name: string;
    category: EquipmentCategory;

    initializeWithJSON(json) {
        this.id = json.id;
        this.name = json.name;
        this.category = new EquipmentCategory().initializeWithJSON(json.equipmentCategory);
        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            category: this.category
        };
    }
}
