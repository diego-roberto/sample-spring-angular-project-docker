import { Worker } from './worker.model';
import { environment } from 'environments/environment';
import * as Moment from 'moment';

import { Occurrence } from './occurrence.model';
import { AttachmentTaskFile } from './attachmentTaskFile.model';
import { User } from './user.model';

export class Task {
  id: number;
  createAt: any;
  deadline: any;
  title: string;
  description: string;
  checkedAt: any;
  authorId: number;
  author: User;
  authorEmail: string;
  responsibleId: number;
  responsible: User;
  responsibleEmail: string;
  responsibleName: string;
  responsibleIsUserSystem: boolean;
  checked: boolean;
  attachmentFiles: Array<AttachmentTaskFile> = [];
  constructionId: number;
  occurrence: Occurrence;
  checkedObservation: string;

  // 0: atrasado, 1: para hoje, 2: depois de hoje, 3: concluida
  status: 0 | 1 | 2 | 3;
  statusName: 'in-time' | 'late' | 'ending';

  public constructor() { }

  public initializeWithJSON(json: any): Task {
    this.id = json.id;
    this.createAt = json.createAt;
    this.deadline = json.deadline;
    this.checkedAt = json.checkedAt;
    this.title = json.title;
    this.description = json.description;
    this.authorId = json.authorId;
    this.authorEmail = json.authorEmail;
    this.author = new User();
    this.author.id = json.authorId;
    this.author.email = json.authorEmail;
    this.responsibleId = json.responsibleId;
    this.responsibleEmail = json.responsibleEmail;
    this.responsibleName = json.responsibleName;
    if (json.attachmentFiles) {
      this.attachmentFiles = json.attachmentFiles.map(jsonAttachmentFiles => new AttachmentTaskFile().initializeWithJSON(jsonAttachmentFiles));
    }
    this.constructionId = json.constructionId;
    this.responsibleIsUserSystem = json.responsibleIsUserSystem;
    this.checked = json.checked === undefined ? false : json.checked;
    this.checkedObservation = json.checkedObservation;

    this.status = this.checkStatus();
    this.statusName = this.getStatus();

    return this;
  }

  public toJSON() {

    return {
      id: this.id,
      createAt: this.createAt,
      deadline: this.deadline,
      checkedAt: this.checkedAt,
      title: this.title,
      description: this.description,
      authorId: this.author.id,
      authorEmail: this.author.email,
      responsibleId: this.responsible.id,
      responsibleEmail: this.responsible ? this.responsible.email : undefined,
      responsibleName: this.responsibleName,
      checked: this.checked === undefined ? false : this.checked,
      attachmentFiles: this.attachmentFiles.map(file => file.toJSON()),
      constructionId: this.constructionId,
      occurrenceId: this.occurrence ? this.occurrence.id : undefined,
      responsibleIsUserSystem: this.responsibleIsUserSystem,
      checkedObservation: this.checkedObservation
    };
  }

  public toUpdateJSON() {
    return {
      id: this.id,
      createAt: this.createAt,
      deadline: this.deadline,
      checkedAt: this.checkedAt,
      title: this.title,
      description: this.description,
      authorId: this.authorId,
      authorEmail: this.author.email,
      responsibleId: this.responsibleId,
      responsibleEmail: this.responsible ? this.responsible.email : undefined,
      responsibleName: this.responsibleName,
      checked: this.checked === undefined ? false : this.checked,
      attachmentFiles: this.attachmentFiles.map(file => file.toJSON()),
      constructionId: this.constructionId,
      checkedObservation: this.checkedObservation,
      responsibleIsUserSystem: this.responsibleIsUserSystem
    };
  }

  public toCompleteJSON(){
    return {
        id: this.id,
        attachmentFiles: this.attachmentFiles.map(file => file.toJSON()),
        checkedObservation: this.checkedObservation,
        checkedAt: this.checkedAt
    };
  }

  private checkStatus() {
    const deadline = Moment(this.deadline);
    const now = new Date();
    if (!this.checked) {
      if (deadline.isBefore(now, 'day')) {
        return 0;
      }
      if (deadline.isSame(now, 'day')) {
        return 1;
      }
      return 2;
    }
    return 3;
  }

  private getStatus() {
    if (this.status === 3) {
      return 'in-time';
    }
    if (this.status === 0) {
      return 'late';
    }
    const deadline = Moment(this.deadline);
    if (deadline.diff(new Date()) < deadline.diff(Moment(this.createAt)) * 0.3) {
      return 'ending';
    }

    return 'in-time';
  }
}
