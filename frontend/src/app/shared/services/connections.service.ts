import { Injectable } from "@angular/core";

import { HttpClientService, ClientType } from "./http-client.service";
import { Connection } from "../models/connections.model";

@Injectable()
export class ConnectionsService {
  private endpoint = "/s/conexao";
  private type: ClientType = ClientType.backend;

  constructor(
    private service: HttpClientService
  ) { }

  getConnection(tipo: string) {
    return this.service.get(`${this.endpoint}?tipo=${tipo}`);
  }

  saveConnection(connection: Connection) {
    return this.service
      .put(this.endpoint, connection, this.type);
  }

  hasConnection() {
    return this.service.get(`${this.endpoint}/ativa`);
  }
}
