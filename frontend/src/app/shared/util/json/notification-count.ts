export class NotificationCount {
    asos: number;
    equipments: number;
    tasks: number;

    initializeWithJSON(json: any): NotificationCount {
        this.asos = json.asos;
        this.equipments = json.equipments;
        this.tasks = json.tasks;
        return this;
    }

    sum() {
        return this.asos + this.equipments + this.tasks;
    }

    description() {
        return `ASO's: ` + this.asos + '\n' +
            'Equipamentos: ' + this.equipments + '\n' +
            'Tarefas: ' + this.tasks;
    }
}
