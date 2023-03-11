
import { TrainingCategory } from "app/shared/models/training-category.model";
import { TrainingMinister } from "app/shared/models/training-minister.model";

export class TrainingScheduleConstructionFilter {
    page: number = 1;
    totalPages: number = 1;
    qtdeItems: number = 30;
    constructionId: number;
    beginAt: Date;
    endAt: Date;
    text: string;
    categories: TrainingCategory[];

    public toJSON() {
        let categoriesJson = [];
        if(this.categories && this.categories.length > 0){
            this.categories.map(item => {
                categoriesJson.push({
                    id: item.id,
                    name: item.name
                });
            });
        }
        let obj = {
            page: this.page,
            qtdeItems: this.qtdeItems,
            constructionId: this.constructionId,
            beginAt: this.beginAt,
            endAt: this.endAt,
            text: this.text,
            categories: categoriesJson
        }
        return obj;
    }
}

