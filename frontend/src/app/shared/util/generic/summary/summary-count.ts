export interface SummaryCount {
    readonly cones: number;
    readonly alerts: number;
    readonly workers: number;
}

export abstract class SumSummaryCount implements SummaryCount {

    get workers(): number {
        const summarys = this.summarys;
        return summarys ? summarys.map(summary => summary ? summary.workers : 0).reduce((previous: number, current: number) => previous + current, 0) : null;
    }

    get alerts(): number {
        const summarys = this.summarys;
        return summarys ? summarys.map(summary => summary ? summary.alerts : 0).reduce((previous: number, current: number) => previous + current, 0) : null;
    }

    get cones(): number {
        const summarys = this.summarys;
        return summarys ? summarys.map(summary => summary ? summary.cones : 0).reduce((previous: number, current: number) => previous + current, 0) : null;
    }

    protected abstract get summarys(): SummaryCount[];
}
