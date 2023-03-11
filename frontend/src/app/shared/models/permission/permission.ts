
import { RulePermission } from "./rule-permission";
import { EnumPermission } from "./enum-permission";

export class Permission {
    id:number;
    type:EnumPermission;
    rule:RulePermission;
    title:string;


    constructor(type:EnumPermission,rule:RulePermission=null ){
         this.type = type;
         this.rule = rule;
    }

    public initializeWithJSON(json: any): Permission {
        this.id = json.id;
        this.type = json.name;
        this.rule =json.rule;
        this.title =json.title;
        return this;
    }
}
