import { CanMergeWorker } from '../worker-generic/can-merge-worker';
import { Cbos } from 'app/shared/models/cbos.model';
import { Worker } from 'app/shared/models/worker.model';
import { Supplier } from 'app/shared/models/supplier.model';
import {Profile} from '../../../../../shared/models/profile.model';

export class WorkerDetails implements CanMergeWorker {

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
    cbos: Cbos = new Cbos();
    supplier: Supplier = new Supplier();
    additionalFunction: string;
    integration: boolean;
    register: string;
    profile: number;
    accessCard: string;
    contract: string;
    contractCnpj: string;

    initializeWithModel(model: Worker) {
        this.cep = model.cep;
        this.completeAddress = model.completeAddress;
        this.complement = model.complement;
        this.name = model.name;
        this.cpf = model.cpf;
        this.gender = model.gender;
        this.scholarity = model.scholarity;
        this.nit = model.nit;
        this.contact = model.contact;
        this.cboDescription = model.cboDescription;
        this.specialNeeds = model.specialNeeds;
        this.status = model.status;
        this.contractType = model.contractType;
        this.company = model.company;
        this.photoUrl = model.photoUrl;
        this.photoFilename = model.photoFilename;
        this.imageFile = model.imageFile;
        this.admissionDate = model.admissionDate;
        this.birthDate = model.birthDate;
        this.ctps = model.ctps;
        this.age = model.age;
        this.cbos = model.cbos;
        this.supplier = model.supplier;
        this.additionalFunction = model.additionalFunction;
        this.integration = model.integration;
        this.register = model.register;
        this.profile = model.profile;
        this.accessCard = model.accessCard;
        this.contract = model.contract;
        this.contractCnpj = model.contractCnpj;
    }

    merge(model: Worker) {
        model.cep = this.cep;
        model.completeAddress = this.completeAddress;
        model.complement = this.complement;
        model.name = this.name;
        model.cpf = this.cpf;
        model.gender = this.gender;
        model.scholarity = this.scholarity;
        model.nit = this.nit;
        model.contact = this.contact;
        model.cboDescription = this.cboDescription;
        model.specialNeeds = this.specialNeeds;
        model.status = this.status;
        model.contractType = this.contractType;
        model.company = this.company;
        model.photoUrl = this.photoUrl;
        model.photoFilename = this.photoFilename;
        model.imageFile = this.imageFile;
        model.admissionDate = this.admissionDate;
        model.birthDate = this.birthDate;
        model.ctps = this.ctps;
        model.age = this.age;
        model.cbos = this.cbos;
        model.supplier = this.supplier;
        model.additionalFunction = this.additionalFunction;
        model.integration = this.integration;
        model.register = this.register;
        model.profile = this.profile;
        model.accessCard = this.accessCard;
        model.contract = this.contract;
        model.contractCnpj = this.contractCnpj;
    }
}
