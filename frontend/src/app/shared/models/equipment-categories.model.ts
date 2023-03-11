export class EquipmentCategory {

    id: number;
    name: string;

    initializeWithJSON(json) {
        this.id = json.id;
        this.name = json.name;
        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
        };
    }
}
