import { User } from 'app/shared/models/user.model';
export class Historic {
    data: string;
    text: string;
    user: User;
    idUser: number;


    constructor() { }

    initializeWithJSON(json): Historic {
        if (! json) { return null; };

        this.data = json.data;
        this.text = json.text;
        this.idUser = json.idUser;

        if(json.user) {
            this.user = new User().initializeWithJSON(json.user);
        }

        return this;
    }


}
