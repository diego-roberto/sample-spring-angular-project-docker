import { Construction } from './construction.model';
import { Floor } from './floor.model';
import { Clonable } from 'app/shared/util/generic/form/clonable';
import { Summarizable } from 'app/shared/util/generic/summary/summarizable';
import { SummaryCount } from 'app/shared/util/generic/summary/summary-count';

export class Sector implements Clonable<Sector>, Summarizable {

    id: number;
    name: string;
    constructionId: number;
    construction: Construction;
    floors: Array<Floor> = [];
    active: boolean;

    summary: SummaryCount;

    initializeWithJSON(json, construction?: Construction) {
        this.id = json.id;
        this.name = json.name;
        this.constructionId = json.constructionId;
        this.floors = json.floors ? json.floors.map(jsonFloor => new Floor().initializeWithJSON(jsonFloor, this)) : null;
        this.active = json.active;

        return this;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            constructionId: this.constructionId,
            floors: this.floors ? this.floors.map(floor => floor.toJSON()) : null,
            active: this.active
        };
    }

    getSummary() {
        return this.floors.reduce((sum, floor) => {
            return {
                alerts: sum.alerts + floor.alertsNumber(),
                cones: sum.cones + floor.conesNumber(),
                workers: sum.workers + floor.workersNumber()
            };
        }, {
                alerts: 0,
                cones: 0,
                workers: 0
            });
    }

    clone(): Sector {
        const sector = Object.assign(new Sector(), this);

        if (this.construction) {
            sector.construction = new Construction();
            sector.construction.id = this.construction.id;
            sector.construction.name = this.name;
        }

        sector.floors = this.floors ? this.floors.map(floor => {
            return floor.clone();
        }) : [];

        return sector;
    }
}
