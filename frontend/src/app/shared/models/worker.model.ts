import { Qualification } from './qualification.model';
import { Cbos } from './cbos.model';
import { Security } from './security.model';
import { Aso } from './aso.model';
import * as Moment from 'moment';
import { Clonable } from 'app/shared/util/generic/form/clonable';
import { EpiWorkers } from './epi-workers.model';
import { Supplier } from 'app/shared/models/supplier.model';
import { Profile } from './profile.model';
import { worker } from 'cluster';

export class Worker implements Clonable<Worker> {
  id: number;

  cep: string;
  completeAddress: string;
  complement: string;
  name: string;
  cpf: string;
  gender = true;
  scholarity: string;
  nit: string;
  contact: string;
  cboDescription: string;
  specialNeeds = false;
  status = true;
  contractType: string;
  company: string;
  photoUrl: string;
  photoFilename: string;
  imageFile: File;
  admissionDate: any;
  birthDate: any;
  ctps: string;
  age: string;
  occupation: string;
  allergies: string;
  diseases: string;
  bloodType: string;
  createdAt: any;
  updatedAt: any;
  selected: boolean;
  hasPassword: boolean;
  additionalFunction: string;
  integration: boolean;
  cbos: Cbos = new Cbos();
  security: Security = new Security();
  register: string;
  accessCard: string;
  profile: number;
  contract: string = "CLT";
  contractCnpj: string;

  aso: Array<Aso> = [];
  qualifications: Array<Qualification> = [];
  epis: Array<EpiWorkers> = [];

  supplier: Supplier = new Supplier();

  public initializeWithJSON(json: any): Worker {

    const moment = Moment();

    this.id = json.id;
    this.name = json.name;
    this.cpf = json.cpf;
    this.scholarity = json.degreeId;
    this.nit = json.nit;
    this.cep = json.cep;
    this.completeAddress = json.address;
    this.complement = json.complement;
    this.contact = json.contact;
    this.cboDescription = json.functionDescription;
    this.specialNeeds = json.specialNeeds;
    this.status = json.status;
    this.contractType = json.contractType;
    this.company = json.company;
    this.photoUrl = json.photoUrl;
    this.photoFilename = json.photoFilename;
    this.admissionDate = json.admissionAt;
    this.contract = json.contract;
    this.contractCnpj = json.contractCnpj;
    if (json.birthDate || json.birthDate === 0) {
      this.birthDate = Moment(json.birthDate).add({ minute: -Moment().utcOffset() });
    }
    this.ctps = json.ctps;
    this.age = this.birthDate && this.birthDate.isValid() ? moment.diff(this.birthDate, 'y').toString() : null;
    this.occupation = json.occupation;
    this.gender = json.gender === 'true' ? true : false;

    this.createdAt = json.createdAt;
    this.updatedAt = json.updatedAt;

    this.allergies = json.allergies;
    this.diseases = json.diseases;
    this.bloodType = json.bloodType;

    if (json.qualifications) {
      this.qualifications = json.qualifications.map(qualification => new Qualification().initializeWithJSON(qualification));
    }

    if (json.asos) {
      this.aso = json.asos.map(aso => new Aso().initializeWithJSON(aso));
    }

    if (json.cbo) {
      this.cbos = new Cbos().initializeWithJSON(json.cbo);
    }

    this.security = new Security().initializeWithJSON(json);

    this.hasPassword = json.password ? true : false;

    if (json.supplier) {
      this.supplier = new Supplier().initializeWithJSON(json.supplier);
    }
    this.additionalFunction = json.additionalFunction;
    this.integration = json.integration;
    this.register = json.register;
    this.accessCard = json.accessCard;
    if (json.profile) {
      this.profile = json.profile.id;
    }

    return this;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      cpf: this.cpf,
      degreeId: this.scholarity,
      nit: this.nit,
      cep: this.cep,
      address: this.completeAddress,
      complement: this.complement,
      contact: this.contact,
      functionDescription: this.cboDescription,
      specialNeeds: this.specialNeeds,
      status: this.status,
      contractType: this.contractType,
      company: this.company,
      photoUrl: this.photoUrl,
      photoFilename: this.photoFilename,
      admissionAt: this.admissionDate ? Moment(this.admissionDate) : null,
      contract: this.contract,
      contractCnpj: this.contractCnpj,
      ctps: this.ctps,
      birthDate: this.birthDate ? Moment(this.birthDate) : null,
      ocupation: this.occupation,
      gender: this.gender,
      qualifications: this.qualifications ? this.qualifications.map(jsonQualifications => jsonQualifications.toJSON()) : null,
      cbo: this.cbos.id ? {
        id: this.cbos.id
      } : null,
      asos: this.aso ? this.aso.map(aso => aso.toJSON()) : null,
      allergies: this.allergies,
      diseases: this.diseases,
      bloodType: this.bloodType,
      laborCipa: this.security.laborsInCipa,
      cipeiro: this.security.cipeiro,
      mandateBegin: this.security.mandateBegin,
      mandateEnd: this.security.mandateEnd,
      brigade: this.security.brigade,
      supplier: {
        id: this.supplier ? this.supplier.id : null
      },
      additionalFunction: this.additionalFunction,
      integration: this.integration,
      register: this.register,
      profile: { id: this.profile ? this.profile : null },
      accessCard: this.accessCard,
    };
  }

  clone(): Worker {
    const worker = Object.assign(new Worker(), this);
    worker.aso = this.aso ? this.aso.map(aso => Object.assign(new Aso(), aso)) : null;
    worker.qualifications = this.qualifications ? this.qualifications.map(qualif => Object.assign(new Qualification(), qualif)) : null;
    return worker;
  }
}
