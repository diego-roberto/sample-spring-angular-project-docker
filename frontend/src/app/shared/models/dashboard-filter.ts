import * as Moment from 'moment';

export class DashboardFilter {
    beginAt: Date;
    endAt: Date;
    intervalType: string;
    constructionIds: Array<number>;
}
