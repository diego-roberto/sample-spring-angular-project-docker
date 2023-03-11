import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { isNullOrUndefined } from 'util';
import { Worker } from 'app/shared/models/worker.model';
import { SafetyCardComponent } from 'app/shared/components/safety-card';
import { WorkerService } from 'app/shared/services/worker.service';


@Component({
    templateUrl: 'profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    @Input() worker: Worker = new Worker;

    @ViewChild('personalDetailsCard') personalDetailsCard: SafetyCardComponent;
    @ViewChild('asoDetailsCard') asoDetailsCard: SafetyCardComponent;
    @ViewChild('qualificationsDetailsCard') qualificationsDetailsCard: SafetyCardComponent;
    @ViewChild('securityDetailsCard') securityDetailsCard: SafetyCardComponent;

    cpf = '';
    elements: Array<SafetyCardComponent>;

    ngOnInit(): void {
        this.elements = [this.personalDetailsCard];
        this.elements = [this.qualificationsDetailsCard];

        this.closeAll();
    }

    updateWorkerPhoto(worker: Worker) {
        if (worker.imageFile) {
            this.workerService.updateServiceWorkerPhoto(worker).subscribe(subscribePhoto => { });
        }
    }

    // Busca os dados ao clicar no icone de editar, porem, a função worker.toJSON não é mais identificada como uma função.
    // this.route.data.subscribe(data => this.worker = data.worker);



    constructor(
        private workerService: WorkerService,
        public snackBar: MdSnackBar,
        private route: ActivatedRoute
    ) { }

    getWorkerByCpf(cpf: string) {
        this.workerService.getWorkerByCpf(cpf).subscribe(subscribedWorker => {
            if (!isNullOrUndefined(subscribedWorker.cpf)) {
                this.worker = subscribedWorker;
            }
        });
    }

    onHealthSaved(savedWorker: Worker) {
        this.workerService.saveWorker(savedWorker);

        this.closeAll();
    }

    closeAll() {
        this.elements.forEach(e => e.close());
    }

    /**
     * Verifica se o trabalhador em questao ja esta no banco de dados, em caso positivo manda mensagem de acordo.
     * @param worker Trabalhador com dados atualizados do formulario.
     */
    private updateWorker(worker: Worker) {
        if (this.validateWorker(worker)) {
            worker.cpf = worker.cpf.replace(/[^\d]+/g, '');
            if (worker.id) {
                this.saveWithSnackBar(worker);
                this.snackBar.open('Trabalhador Atualizado!', null, { duration: 3000 });
            } else {
                this.saveWithSnackBar(worker);
                this.snackBar.open('Trabalhador Cadastrado!', null, { duration: 3000 });
            }
        }
    }

    /**
     * Concentra a chamada do método em uma funcao para que possamos especificar no UpdateWorker() qual mensagem deve ser emitida.
     * @param worker Trabalhador com dados atualizados do formulario.
     */
    private saveWithSnackBar(worker: Worker) {
        this.workerService.saveWorker(worker).subscribe(
            data => {
                worker.id = data.id;
                this.updateWorkerPhoto(worker);
            },
            error => {
                if (error.json() && error.json().errors && error.json().errors.length > 0) {
                    // this.showErrorBar(error.json().errors[0].message);
                } else {
                    // this.showErrorBar('Erro no servidor!');
                    this.snackBar.open('Erro no servidor!', null, { duration: 3000 });
                }
            }
        );
    }

    /**
     * Metodo responsavel por fazer as validacoes dos campos do formulario de trabalhadores.
     * Deve ser chamado sempre antes de qualquer atualizacao no Trabalhador.
     * @param savedWorker Recebe o trabalhador com seus dados atualizados do formulario.
     */
    validateWorker(savedWorker: Worker) {
        // Variavel responsavel por determinar a validacao de todos os campos.
        let pass = true;

        // Valida apenas se o CPF e nulo ou vazio.
        if (savedWorker.cpf === null || savedWorker.cpf === '') {
            this.snackBar.open('O Campo CPF não pode ser nulo!', null, { duration: 3000 });
            pass = false;
        } else if (!this.validateCPF(savedWorker.cpf)) {
            this.snackBar.open('O CPF digitado é inválido!', null, { duration: 3000 });
            pass = false;
        }

        // Valida apenas se o Nome e nulo ou vazio.
        if (savedWorker.name === null || savedWorker.name === '') {
            this.snackBar.open('O Campo Nome não pode ser nulo!', null, { duration: 3000 });
            pass = false;
        }

        // Retorna true se passar pelas validacoes e false caso seja capturado em alguma.
        return pass;
    }

    validateCPF(cpf) {
        cpf = String(cpf);
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf === '') { return false; }
        if (cpf.length !== 11 ||
            cpf === '00000000000' ||
            cpf === '11111111111' ||
            cpf === '22222222222' ||
            cpf === '33333333333' ||
            cpf === '44444444444' ||
            cpf === '55555555555' ||
            cpf === '66666666666' ||
            cpf === '77777777777' ||
            cpf === '88888888888' ||
            cpf === '99999999999') { return false; }

        let add = 0;
        for (let i = 0; i < 9; i++) { add += parseInt(cpf.charAt(i)) * (10 - i); }
        let rev = 11 - (add % 11);
        if (rev === 10 || rev === 11) { rev = 0; }
        if (rev !== parseInt(cpf.charAt(9))) { return false; }
        add = 0;

        for (let i = 0; i < 10; i++) { add += parseInt(cpf.charAt(i)) * (11 - i); }
        rev = 11 - (add % 11);
        if (rev === 10 || rev === 11) { rev = 0; }
        if (rev !== parseInt(cpf.charAt(10))) { return false; }
        return true;
    }

    private handleError(error) {
        if (error.json() && error.json().errors && error.json().errors.length > 0) {
            this.snackBar.open(error.json().errors[0].message, null, { duration: 3000 });
        } else {
            this.snackBar.open('Erro no servidor!', null, { duration: 3000 });
        }
    }
}
