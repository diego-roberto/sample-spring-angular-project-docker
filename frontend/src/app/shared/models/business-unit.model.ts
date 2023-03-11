import { CompanyContact } from './company-contact.model';
import { Cnae } from './cnae.model';
import { Tenant } from './tenant.model';
import { CompanyDocumentation } from 'app/shared/models/company-documentation.model';


export class BusinessUnit  {
    id: number;
    name: string;
    businessLevelType: string;
    parentId: number;

    children: BusinessUnit[];

   
   

   
}
