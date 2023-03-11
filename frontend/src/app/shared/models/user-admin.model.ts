
export interface IUserAdmin {
    userId: number;
    workerId: number;
    userName: string;
}

export class UserAdmin implements IUserAdmin {
    userId: number;
    workerId: number;
    userName: string;

    public constructor() { }

    public initializeWithJSON(json: any): UserAdmin {
        this.userId = json.userId;
        this.workerId = json.workerId;
        this.userName = json.userName;

        return this;
    }

    public toJSON() {
        return {
            userId: this.userId,
            workerId: this.workerId,
            userName: this.userName
        };
    }
}
