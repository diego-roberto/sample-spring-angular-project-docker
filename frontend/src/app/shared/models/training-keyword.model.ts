
export class TrainingKeyword {
    id: number;
    keyword: string;


    public initializeWithJSON(json: any): TrainingKeyword {
        this.id                  = json.id;
        this.keyword             = json.keyword;
        return this;
    }

    public toJSON() {
        return {
            id:                  this.id,
            keyword:             this.keyword,
        };
    }

    constains(value: string) {

    }
}
