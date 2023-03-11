

export class Paginator {
    page: number;
    totalPages: number;
    totalItems: number;
    lista: Array<any> = new Array();

    public initializeWithJSON(json: any): Paginator {
        this.page       = json.page;
        this.totalPages = json.totalPages;
        this.totalItems = json.totalItems;

        return this;
    }

    public toJSON() {
        return {
            page:       this.page,
            totalPages: this.totalPages,
            totalItems: this.totalItems
        };
    }
}

