import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";

@Injectable()
export class CepService {

  private URL_VIACEP = "https://viacep.com.br/ws/"
  private URL_WIDENET = "https://ws.apicep.com/cep/"

  constructor(private http: Http) {}

  async cep(cep: string): Promise<CEP> {
    let callbackCep: CEP;
    try {
      callbackCep = await this.getAddressByViaCep(cep);
    } catch(e) {
      callbackCep = await this.getAddressByWIDENET(cep);
    }
    return callbackCep;
  }

  private async getAddressByViaCep(cep: string): Promise<CEP> {
    const returnCep: CEP = new CEP();
    await this.requestAddressFromViaCep(cep).then(
      response => {
        let body = response.json();
        if (body.erro) {
          throw new Error();
        } else {
          returnCep.cep = body.cep;
          returnCep.state = body.uf
          returnCep.city = body.localidade;
          returnCep.street = body.logradouro;
          returnCep.neighborhood = body.bairro;
          returnCep.service = "viacep";
        }
      }).catch((error) => {
        throw new Error("VIACEP: error nenhum retorno : " + error);
      });
    return returnCep;
  }

  private async getAddressByWIDENET(cep: string): Promise<CEP> {
    const returnCep: CEP = new CEP();
    await this.requestAddressFromWIDENET(cep).then(
      response => {
        let body = response.json();
        if (!body.ok) {
          throw new Error();
        } else {
        returnCep.cep = body.code;
        returnCep.state = body.state
        returnCep.city = body.city;
        returnCep.street = body.address;
        returnCep.neighborhood = body.district;
        returnCep.service = "WIDENET";
        }
      }).catch((error) => {
        throw new Error("WIDENET: error nenhum retorno : " + error);
      });
    return returnCep;
  }

  private async requestAddressFromViaCep(cep: string): Promise<Response> {
    const url = this.createURL(cep, true);
    return this.http.get(url).toPromise();
  }

  private async requestAddressFromWIDENET(cep: string): Promise<Response> {
    const url = this.createURL(cep, false);
    return this.http.get(url).toPromise();
  }

  private createURL(cep: string, viavep: boolean) {
    return viavep ? this.URL_VIACEP + this.formtatterToViaCep(cep) + "/json/" : this.URL_WIDENET + this.formtatterToWIDENET(cep) + ".json"
  }

  private formtatterToViaCep(cep: string): string {
    cep = cep.replace("-", "");
    cep = cep.replace(".", "");
    return cep;
  }

  private formtatterToWIDENET(cep: string): string {
    cep = cep.replace(".", "");
    return cep;
  }

}

export class CEP {
  cep: string;
  state: string;
  city: string;
  street: string;
  neighborhood: string;
  service: string;

  constructor() { 
    // 
  }

  public initializeWithJSON(json: any): CEP {
    this.cep = json.cep;
    this.state = json.state;
    this.city = json.city;
    this.street = json.street;
    this.neighborhood = json.neighborhood;
    this.service = json.service;

    return this;
  }

  public toJSON() {
      return {
          cep: this.cep,
          state: this.state,
          city: this.city,
          street: this.street,
          neighborhood: this.neighborhood,
          service: this.service
      };
  }
}