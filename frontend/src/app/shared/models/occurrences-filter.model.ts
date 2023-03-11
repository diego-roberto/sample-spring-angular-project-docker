export class OccurrencesFilter {

    page: number = 1;
    totalPages: number = 1;
    qtdeItems: number = 30;
    constructionId: number;
    beginAt: Date;
    endAt: Date;

    public toJSON() {

        let obj = {
            page: this.page,
            qtdeItems: this.qtdeItems,
            constructionId: this.constructionId,
            beginAt: this.beginAt,
            endAt: this.endAt
        }

        return obj;

    }
    
}
