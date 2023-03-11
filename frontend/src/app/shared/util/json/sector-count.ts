import { SumSummaryCount, SummaryCount } from 'app/shared/util/generic/summary/summary-count';
import { FloorCount } from 'app/shared/util/json/floor-count';


export class SectorCount extends SumSummaryCount {

    sectorId: number;

    floorsCount: FloorCount[];


    initializeWithJSON(json: any): SectorCount {
        this.sectorId = json.sectorId;
        this.floorsCount = json.floorsCount ? json.floorsCount.map(floor => new FloorCount().initializeWithJSON(floor)) : null;
        return this;
    }

    protected get summarys(): SummaryCount[] {
        return this.floorsCount;
    }
}
