import { EnumRulePermission } from "./enum-rule-permission";

export class RulePermission {
    type:EnumRulePermission
    params:any

    constructor( type:EnumRulePermission,
        params:any){
       this.type = type;
       this.params = params;  
    }
}
