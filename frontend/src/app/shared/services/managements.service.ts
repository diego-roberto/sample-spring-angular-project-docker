import { Managements } from "app/shared/models/managements.model";
import { Injectable } from "@angular/core";
import { HttpClientService, ClientType } from "./http-client.service";
import { Observable } from "rxjs/Observable";
import { Subject, BehaviorSubject } from "rxjs";

@Injectable()
export class ManagementsService {
  private endpoint = "/managements";
  private type = ClientType.auth;
  profilesList: any[] = [];

  public actualizeList: Subject<void> = new Subject();
  constructor(private service: HttpClientService) {}

  getManagementsListByUser(id: number): Observable<Array<Managements>> {
    return this.service
      .get(this.endpoint + "/user/" + id, this.type)
      .map((response) => {
        return response.managements.map((managements) => {
          return new Managements().initializeWithJSON(managements);
        });
      });
  }

  getActiveManagementsListByUser(id: number): Observable<Array<Managements>> {
    return this.service
      .get(this.endpoint + "/user/" + id + "/active", this.type)
      .map((response) => {
        return response.managements.map((managements) => {
          return new Managements().initializeWithJSON(managements);
        });
      });
  }
  saveCompanyToUser(idCompany: number, idUser: number) {
    return this.service
      .post(
        this.endpoint + "/company/" + idCompany + "/user/" + idUser,
        JSON.stringify({}),
        this.type
      )
      .toPromise();
  }

  updateCompanyToUser(idManagement: number) {
    return this.service
      .put(
        `${this.endpoint}/${idManagement}/situation-active`,
        JSON.stringify({}),
        this.type
      )
      .toPromise();
  }

  update(management: Managements) {
    return this.service
      .put(
        this.endpoint + "/" + management.id,
        JSON.stringify(management),
        this.type
      )
      .map((response) => {
        return response;
      });
  }

  getManagementsListByCompany(managements: Managements) {
    return this.service
      .post(
        this.endpoint + "/getManagementsByCompany",
        JSON.stringify(managements.toJSON()),
        this.type
      )
      .map((response) => {
        return response.managements.map((managements) => {
          return new Managements().initializeWithJSON(managements);
        });
      });
  }

  getUserProfileListByUserAndCompany(userId, companyId) {
    return this.service
      .get(
        `${this.endpoint}/user/${userId}/company/${companyId}/profile`,
        this.type
      )
      .toPromise();
  }

  createManagements(managements: Managements): Observable<any> {
    return this.service
      .post(this.endpoint, JSON.stringify(managements.toJSON()), this.type)
      .map((response) => {
        if (response.managements) {
          this.actualizeList.next();
          return new Managements().initializeWithJSON(response.managements);
        } else {
          return response;
        }
      });
  }

  linkCompaniesToUser(
    companies: Array<Number>,
    userId: Number
  ): Observable<any> {
    return this.service
      .post(this.endpoint + "/company/user/" + userId, { companies }, this.type)
      .map((response) => {
        this.actualizeList.next();
        return new Managements().initializeWithJSON(response.managements);
      });
  }

  updateManagements(managements: Managements): Observable<any> {
    return this.service
      .put(
        this.endpoint + "/validations/" + managements.id,
        JSON.stringify(managements.toJSON()),
        this.type
      )
      .map((response) => {
        this.actualizeList.next();
        return new Managements().initializeWithJSON(response.managements);
      });
  }

  verifyEmailAlreadyExists(managements: Managements): Observable<any> {
    return this.service
      .post(
        this.endpoint + "/verifyEmail",
        { email: managements.user.email, companyId: managements.company.id },
        this.type
      )
      .map((response) => {
        return response;
      });
  }
}
