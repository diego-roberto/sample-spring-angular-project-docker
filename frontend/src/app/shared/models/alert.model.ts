const AVAILABLE_TYPES = [
    'LOW_BATTERY',
    'WRONG_ACCESS'
];

export class Alert {

    id: number;

    worker: any;
    cone: any;
    type: string;
    time: Date;

    constructor(data: any) {
        this.id = data.id;
        this.worker = data.worker;
        this.cone = data.cone;
        this.type = data.type;
        this.time = data.time;
    }
}
