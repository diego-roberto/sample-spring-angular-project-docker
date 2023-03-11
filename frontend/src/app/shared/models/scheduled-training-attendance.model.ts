import { Worker } from 'app/shared/models/worker.model';

export class ScheduledTrainingAttendance {

  id: number;
  participationDate: Date;
  worker: Worker;

  public initializeWithJSON(json: any): ScheduledTrainingAttendance {
    this.id = json.id;
    this.participationDate = json.participationDate;
    this.worker = new Worker().initializeWithJSON({
      id: json.workerId,
      cpf: json.workerCpf,
      name: json.workerName
    });

    return this;
  }

  public toJSON() {
    return {
      id: this.id,
      participationDate: this.participationDate,
      workerId: this.worker.id,
      workerCpf: this.worker.cpf,
      workerName: this.worker.name
    };
  }
}
