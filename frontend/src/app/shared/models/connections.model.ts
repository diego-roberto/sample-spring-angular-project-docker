import * as moment from "moment";

export class Connection {
  idConexao: number;
  ativo: boolean;
  chave: string;
  empresa: string;
  processamento: string | moment.Moment;
  tipo: string;
  ultimoProcessamento: string;

  constructor(tipo?: string, ativo?: boolean, connection?: Connection) {
    this.tipo = tipo;
    this.ativo = ativo;

    if (connection) {
      this.ativo = connection.ativo;
      this.chave = connection.chave;
      this.empresa = connection.empresa;
      this.idConexao = connection.idConexao;
      this.processamento = connection.processamento;
      this.tipo = connection.tipo;
    }
  }
}

export class Connections {
  company: Connection;
  employee: Connection;
  exam: Connection;

  constructor(company?: Connection, employee?: Connection, exam?: Connection) {
    this.company = new Connection('empresa', false, company);
    this.employee = new Connection('funcionario', false, employee);
    this.exam = new Connection('exame', false, exam);
  }
}
