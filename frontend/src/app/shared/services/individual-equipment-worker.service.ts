import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClientService } from 'app/shared/services/http-client.service';
import { IndividualEquipmentWorker } from 'app/shared/models/individual-equipment-worker.model';

@Injectable()
export class IndividualEquipmentWorkerService {

  private readonly endpoint = '/individual_equipment_worker';

  constructor(private service: HttpClientService) { }

  getIndividualEquipmentsLoanedByWorker(workerId: number) {
    return this.service.get(this.endpoint + '/loaned/' + workerId).map(response => {
      return response.individualEquipmentWorkerList.map(individualEquipmentWorker => new IndividualEquipmentWorker().initializeWithJSON(individualEquipmentWorker));
    });
  }

  save(individualEquipmentWorkerList: IndividualEquipmentWorker[]): Observable<IndividualEquipmentWorker[]> {
    return this.service.post(this.endpoint, individualEquipmentWorkerList).map(response => {
      return response.individualEquipmentWorkerList.map(individualEquipmentWorker => new IndividualEquipmentWorker().initializeWithJSON(individualEquipmentWorker));
    });
  }

}
