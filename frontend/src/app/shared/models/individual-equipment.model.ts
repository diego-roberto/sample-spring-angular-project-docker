export class IndividualEquipment {
    id: number;
    description: string;
    quantity: number;
    size: string;
    registerDelivery: boolean;
    fileName: string;
    fileUrl: string;

    file: File;

    initializeWithJSON(json: any): IndividualEquipment {
        this.id = json.id;
        this.description = json.description;
        this.quantity = json.quantity;
        this.size = json.size;
        this.registerDelivery = json.registerDelivery;
        this.fileName = json.fileName;
        this.fileUrl = json.fileUrl;

        return this;
    }
}
