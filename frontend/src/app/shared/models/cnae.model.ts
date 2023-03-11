export class Cnae {
    id: number;
    code: string;
    description: string;

    initializeWithJson(json: any) {
        this.id = json.id;
        this.code = json.code;
        this.description = json.description;
        return this;
    }
}
