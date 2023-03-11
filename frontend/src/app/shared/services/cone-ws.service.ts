import { WebSocketService } from 'app/shared/services/web-socket.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Cone } from 'app/shared/models/cone.model';

@Injectable()
export class ConeWsService {

    constructionId = 0;

    cones = new Subject<Cone[]>();

    constructor(private webSocketService: WebSocketService) { }

    public subscribeWs(constructionsId: number) {
        this.constructionId = constructionsId;
        this.webSocketService.connect('/cone/' + constructionsId).subscribe((x: Array<any>) => {
            this.cones.next(x.map(cone => new Cone().initializeWithJSON(cone)));
        });
    }

    public endSub() {
        this.webSocketService.send('/cone/end', { constructionId: this.constructionId });
    }

    public changeConstruction(newConstructionId: number) {
        this.webSocketService.send('/cone/change', newConstructionId);
    }
}
