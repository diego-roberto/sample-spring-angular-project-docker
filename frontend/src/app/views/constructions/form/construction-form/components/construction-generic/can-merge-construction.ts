import { CanMerge } from 'app/shared/util/generic/form/can-merge';
import { Construction } from 'app/shared/models/construction.model';

export interface CanMergeConstruction extends CanMerge<Construction> {
    merge(model: Construction);
}
