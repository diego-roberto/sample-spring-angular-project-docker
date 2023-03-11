import { HttpClientService } from './http-client.service';
import { Icon } from 'app/shared/models/icon.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { Injectable } from '@angular/core';

@Injectable()
export class IconService {

    private endpoint = '/icons';
    public icons: Array<Icon> = [];
    public icon: Icon;

    constructor(private service: HttpClientService) { }

    getIcon(name: string) {
        return this.service.get(this.endpoint + '/name/' + name).map((jsonResponse) => {
            this.icon = this.serializeIcon(jsonResponse.icon);
            return Object.assign({}, this.icon);
        });
    }

    getIcons(): Observable<Icon[]> {
        return new Observable<Icon[]>(observer => {
            observer.next([
                new Icon().initializeWithJSON({ id: 3, name: 'cone', title: 'Cone', }),
                new Icon().initializeWithJSON({ id: 5, name: 'guardrails', title: 'Guarda Corpos', }), 
                new Icon().initializeWithJSON({ id: 4, name: 'crane', title: 'Grua', }),
                new Icon().initializeWithJSON({ id: 15, name: 'water', title: 'Água', }),
                new Icon().initializeWithJSON({ id: 16, name: 'wc', title: 'Banheiro', }),
                new Icon().initializeWithJSON({ id: 7, name: 'er', title: 'Primeiros Socorros' }),
                new Icon().initializeWithJSON({ id: 14, name: 'tray', title: 'Bandejas', }),
                new Icon().initializeWithJSON({ id: 8, name: 'extinguisher', title: 'Extintor', }),
                new Icon().initializeWithJSON({ id: 1, name: 'accommodation', title: 'Alojamento', }),
                new Icon().initializeWithJSON({ id: 12, name: 'refectory', title: 'Refeitório', }),
                new Icon().initializeWithJSON({ id: 11, name: 'recreation', title: 'Lazer', }),
                new Icon().initializeWithJSON({ id: 9, name: 'laundry', title: 'Lavanderia', }),
                new Icon().initializeWithJSON({ id: 2, name: 'carpentry', title: 'Carpintaria', }),
                new Icon().initializeWithJSON({ id: 6, name: 'elevator', title: 'Elevador', }),
                new Icon().initializeWithJSON({ id: 13, name: 'totem', title: 'Totem', }),
                // new Icon().initializeWithJSON({ id: 10, name: 'others',        title:'Outros'            })
            ]);
            observer.complete();
        });
    }

    private serializeIcon(json: any) {
        const c = new Icon();
        c.initializeWithJSON(json);
        return c;
    }
}
