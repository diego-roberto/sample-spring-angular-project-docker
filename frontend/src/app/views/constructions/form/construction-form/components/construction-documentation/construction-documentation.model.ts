import { ConstructionDocumentation } from 'app/shared/models/construction-documentation.model';
import { CanMerge } from 'app/shared/util/generic/form/can-merge';
import { Construction } from 'app/shared/models/construction.model';

export class ConstructionDocumentationModel implements CanMerge<Construction> {

    constructionDocumentationList: ConstructionDocumentation[];
    id: number;

    initializeWithModel(model: Construction) {
        this.constructionDocumentationList = model.constructionDocumentationList;
        this.id = model.id;
    }

    merge(model: Construction) {
        model.constructionDocumentationList = this.constructionDocumentationList;
    }

}
