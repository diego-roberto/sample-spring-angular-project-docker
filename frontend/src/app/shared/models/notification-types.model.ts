export class NotificationType {
    id: number;
    name: string;

    initializeWithJSON(json: any) {
        this.id = json.id;
        this.name = json.name;
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            description: this.name,
        };
    }
}

export const NotificationTypeConstant = {
    IRREGULARIDADES: 1,
    OCORRENCIAS: 2,
    MANUTENCAO: 3,
    DADOS_DE_SAUDE: 4,
    AREA_DE_RISCO: 5,
    PAINEL_EMOCIONAL: 6,
    HABILITACAO: 7,
    CAPACITACOES: 8,
    TAREFAS: 9,
    EPI: 10,
    SENSORES: 11,
    SST: 12,
    CIPA: 13
}
