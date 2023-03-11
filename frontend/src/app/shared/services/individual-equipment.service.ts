import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { IndividualEquipment } from 'app/shared/models/individual-equipment.model';

import { HttpClientService } from 'app/shared/services/http-client.service';

@Injectable()
export class IndividualEquipmentService {

  private readonly endpoint = '/individualEquipment';

  constructor(private service: HttpClientService) { }

  getAll(): Observable<IndividualEquipment[]> {
    return this.service.get(this.endpoint + '/all').map(response => {
      return response.listIndividualEquipment.map(individualEquipment => new IndividualEquipment().initializeWithJSON(individualEquipment));
    });
  }

  getByFilter(individualEquipmentRequest): Observable<IndividualEquipment[]> {
    return this.service.post(this.endpoint + '/byFilter', individualEquipmentRequest).map(response => {
      return response.listIndividualEquipment.map(individualEquipment => new IndividualEquipment().initializeWithJSON(individualEquipment));
    });
  }

  getById(individualEquipmentId: number): Observable<IndividualEquipment> {
    return this.service.get(this.endpoint + '/' + individualEquipmentId).map(response => {
      return new IndividualEquipment().initializeWithJSON(response.individualEquipment);
    });
  }

  save(individualEquipment: IndividualEquipment): Observable<IndividualEquipment> {
    const params = new FormData();

    const individualEquipmentReq = {
      id: individualEquipment.id,
      description: individualEquipment.description,
      quantity: individualEquipment.quantity,
      size: individualEquipment.size,
      registerDelivery: individualEquipment.registerDelivery,
      fileName: individualEquipment.fileName,
      fileUrl: individualEquipment.fileUrl
    };

    params.append('individualEquipment', new Blob([JSON.stringify(individualEquipmentReq)], { type: 'application/json' }));

    if (individualEquipment.file) {
      params.append('attachments', individualEquipment.file, individualEquipment.fileName);
    }

    return this.service.postWithNoHeaders(this.endpoint, params).map(response => {
      return new IndividualEquipment().initializeWithJSON(response.individualEquipment);
    });
  }

  inactivate(individualEquipmentId: number): Observable<any> {
    return this.service.delete(this.endpoint + '/' + individualEquipmentId).map(response => { });
  }

}
