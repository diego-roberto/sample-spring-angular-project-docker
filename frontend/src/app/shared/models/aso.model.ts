export class AsoType {
  id: number;
  name: string;
}

export class NrType {
  id: number;
  nome: string;
}

export class AsoNrType {
  id: number;
  nrType: NrType;
}

export class Aso {
  id: number;
  asoType: AsoType;
  nrType: NrType;
  asoNrTypes: AsoNrType[];
  asoNrIds: number[];
  able = true;
  realizationDate: Date;
  nextDate: Date;
  attachment: File;
  attachmentUrl: string;
  attachmentFilename: string;
  workerId: number;
  workerName: string;
  shelved = false;

  public initializeWithJSON(json: any) {
    this.id = json.id;
    this.asoType = json.asoType;
    this.asoNrTypes = json.asoNrTypes;
    this.nrType = json.nrType ? json.nrType : new NrType();
    this.realizationDate = new Date(json.realizationDate);
    this.nextDate = new Date(json.nextDate);
    this.able = json.able;
    this.attachmentUrl = json.attachmentUrl;
    this.attachmentFilename = json.attachmentFilename;
    if (json.worker) {
      this.workerId = json.worker.id;
      this.workerName = json.worker.name;
    }
    this.shelved = json.shelved;
    this.asoNrIds = json.asoNrTypes
      .map((nr: AsoNrType) => nr.nrType && nr.nrType.id)
      .filter((item) => !!item);

    return this;
  }

  public toJSON() {
    return {
      id: this.id,
      asoType: this.asoType,
      asoNrTypes: this.asoNrTypes,
      nrType: this.nrType,
      realizationDate: this.realizationDate,
      able: this.able,
      nextDate: this.nextDate,
      attachmentUrl: this.attachmentUrl,
      attachmentFilename: this.attachmentFilename,
      shelved: this.shelved
    };
  }
}
