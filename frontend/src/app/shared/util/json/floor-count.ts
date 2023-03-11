import { SummaryCount } from 'app/shared/util/generic/summary/summary-count';

export class FloorCount implements SummaryCount {

    floorId: number;
    alerts: number;
    workers: number;
    cones: number;

    initializeWithJSON(json: any): FloorCount {
        this.floorId = json.floorId;
        this.alerts = json.alerts;
        this.workers = json.workers;
        this.cones = json.cones;
        return this;
    }
}
