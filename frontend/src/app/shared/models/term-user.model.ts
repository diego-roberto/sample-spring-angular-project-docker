
import { Term } from "./term.model";
import { User } from "./user.model";

export class TermUser {
    id: number;
    user: User;
    term: Term;
    acceptDate: Date;
    ipAddress: string;
    valid: boolean;

    initializeWithJSON(json: any) {
        this.id = json.id;
        this.user = json.user ? new User().initializeWithJSON(json.user) : null;
        this.term = json.term ? new Term().initializeWithJSON(json.term) : null;
        this.acceptDate = json.acceptDate;
        this.ipAddress = json.ipAddress;
        this.valid = json.valid;
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            user: this.user,
            term: this.term,
            acceptDate: this.acceptDate,
            ipAddress: this.ipAddress,
            valid: this.valid
        };
    }
}