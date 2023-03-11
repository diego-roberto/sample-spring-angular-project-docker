import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material';

import { AppMessageService } from 'app/shared/util/app-message.service';

import { Connections, Connection } from 'app/shared/models/connections.model';
import { ConnectionsService } from 'app/shared/services/connections.service';
import * as moment from 'moment';

@Component({
  selector: 'connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.scss']
})
export class ConnectionsComponent implements OnInit {

  lastIntegrationCompany: string;
  lastIntegrationExam: string;
  lastIntegrationEmployee: string;

  active: boolean;
  connections: Connections;
  connectionsForm: FormGroup;
  loadingStack: Set<string> = new Set<string>();

  constructor(
    private connectionsService: ConnectionsService,
    private appMessageService: AppMessageService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.connectionsForm = this.fb.group({
      company: new FormControl(undefined, Validators.required),
      key: new FormControl(undefined, Validators.required),
      process: new FormControl(undefined, Validators.required),
      active: new FormControl(undefined, []),

      employeeCompany: new FormControl(undefined, Validators.required),
      employeeKey: new FormControl(undefined, Validators.required),
      employeeProcess: new FormControl(undefined, Validators.required),

      examCompany: new FormControl(undefined, Validators.required),
      examKey: new FormControl(undefined, Validators.required),
      examProcess: new FormControl(undefined, [Validators.required]),
    });
    this.dateAdapter.setLocale('pt-br');
  }

  ngOnInit(): void {
    this.connections = new Connections();
    this.getConnections();
  }

  parseConnectionsDateToMoment(company: Connection, employee: Connection, exam: Connection) {
    company.processamento = moment(company.processamento).locale('pt-br').format('DD/MM/YYYY');    
    employee.processamento = moment(employee.processamento).locale('pt-br').format('DD/MM/YYYY');    
    exam.processamento = moment(exam.processamento).locale('pt-br').format('DD/MM/YYYY'); 
  }

  parseConnectionsMomentToDate(connections: Connections) {
    const connectionsParsed = new Connections(connections.company, connections.employee, connections.exam);

    connectionsParsed.company.processamento = moment(connectionsParsed.company.processamento).format('YYYY-MM-DD')
    connectionsParsed.employee.processamento = moment(connectionsParsed.employee.processamento).format('YYYY-MM-DD')
    connectionsParsed.exam.processamento = moment(connectionsParsed.exam.processamento).format('YYYY-MM-DD')

    return connectionsParsed;
  }

  getConnections() {
    this.connectionsService.getConnection('empresa').subscribe((empresa: Connection) => {
      this.connectionsService.getConnection('funcionario').subscribe((funcionario: Connection) => {
        this.connectionsService.getConnection('exame').subscribe((exame: Connection) => {
                    
          this.parseConnectionsDateToMoment(empresa, funcionario, exame)
          this.connections.company = empresa;
          this.connections.employee = funcionario;
          this.connections.exam = exame;

          this.lastIntegrationCompany = moment(empresa.ultimoProcessamento).locale('pt-br').format('DD/MM/YYYY');
          this.lastIntegrationEmployee = moment(funcionario.ultimoProcessamento).locale('pt-br').format('DD/MM/YYYY');
          this.lastIntegrationExam = moment(exame.ultimoProcessamento).locale('pt-br').format('DD/MM/YYYY');

          this.active = empresa.ativo && funcionario.ativo && exame.ativo;
        });
      });
    });
  }

  onActive() {
    this.connections.company.ativo = this.active;
    this.connections.employee.ativo = this.active;
    this.connections.exam.ativo = this.active;
  }

  isUpdate() {
    const { company, employee, exam } = this.connections;
    return company.idConexao && employee.idConexao && exam.idConexao;
  }

  saveConnections(connections: Connections) {
    this.connectionsService.saveConnection(connections.company).subscribe(company => {
      this.connectionsService.saveConnection(connections.employee).subscribe(employee => {
        this.connectionsService.saveConnection(connections.exam).subscribe(exam => {
          this.appMessageService.showSuccess('Integração salva com sucesso!');
          this.redirectTo('../');
        }, () => {
          this.saveError()
          return;
        });
      }, () => {
        this.saveError()
        return;
      })
    }, () => {
      this.saveError()
      return;
    })
  }

  saveError() {
    this.appMessageService.errorHandle('Erro', 'Erro ao salvar integração!');
    this.removeFromLoadingStack('save');
    this.connectionsForm.enable();
  }

  save() {
    const connectionsParsed = this.parseConnectionsMomentToDate(this.connections);

    this.addToLoadingStack('save');
    this.connectionsForm.disable();

    this.saveConnections(connectionsParsed);
  }

  redirectTo(route) {
    this.router.navigate([route], { relativeTo: this.route });
  }

  addToLoadingStack(key: string) {
    this.loadingStack.add(key);
  }

  removeFromLoadingStack(key: string) {
    this.loadingStack.delete(key);
  }

  isLoadingActive(key?: string): boolean {
    if (key) { return this.loadingStack.has(key); }

    return this.loadingStack.size > 0;
  }

}
