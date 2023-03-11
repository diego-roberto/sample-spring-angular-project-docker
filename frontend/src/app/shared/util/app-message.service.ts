import { Injectable } from '@angular/core';
import { MdSnackBar } from '@angular/material';

@Injectable()
export class AppMessageService {

  constructor(
    private snackBar: MdSnackBar
  ) { }

  public showError(msg: string, config: any = { duration: 4000 }) {
    let msgDefault = 'Erro inesperado!';
    if (msg && msg.trim().length > 0) {
      msgDefault = msg.trim();
    }
    this.showMessage(msgDefault, config);
  }

  public showSuccess(msg: string, config: any = { duration: 4000 }) {
    let msgDefault = 'Operação realizada com sucesso!';
    if (msg && msg.trim().length > 0) {
      msgDefault = msg.trim();
    }
    this.showMessage(msgDefault, config);
  }

  public errorHandle(error: any, msgDefault: string) {
    let msgs = [];
    if (error._body) {
      const body = JSON.parse(error._body);

      if (body.errors) {
        body.errors.forEach((err) => {
          if (err.message) {
            msgs.push(err.message);
          }
        });
      }
    }

    if (msgs.length == 0) {
      this.showError(msgDefault);
    } else {
      msgs.forEach(msg => {
        this.showError(msg);
      });
    }
  }

  private showMessage(msg: string, config) {
    this.snackBar.open(msg, null, config);
  }

}
