import { FormControl } from '@angular/forms';

export class UtilValidators {

    static cpf(control: FormControl) {
        if (control.value === '') {
            return null;
        }
        const valid = UtilValidators.seecpf(control.value);
        return valid ? null : { cpf: true };
    }

    static onlytext(control: FormControl) {
        const regEx = /^[A-Za-záàâãäÁÀÂÃÄçÇéèêëÉÈÊËíìîïÍÌÎÏóòôõöÓÒÔÕÖúùûüÚÙÛÜ\s]+$/;
        if (!control.value) {
            return null;
        }

        return !regEx.test(control.value) ? { onlytext: true } : null;
    }

    static onlynumber(control: FormControl) {
        const regEx = /^[0-9]+$/;
        if (!control.value) {
          return null;
        }
      
        return !regEx.test(control.value) ? { onlynumber: true } : null;
      }

    static textAnNumber(control: FormControl) {
        const regEx = /^[a-zA-Z0-9áàâãäÁÀÂÃÄçÇéèêëÉÈÊËíìîïÍÌÎÏóòôõöÓÒÔÕÖúùûüÚÙÛÜ\s]+$/;
        if (!control.value) {
            return null;
        }

        return !regEx.test(control.value) ? { textAnNumber: true } : null;
    }

    static onlytextAndSeparator(control: FormControl) {
        const regEx = /^[A-Za-záàâãäÁÀÂÃÄçÇéèêëÉÈÊËíìîïÍÌÎÏóòôõöÓÒÔÕÖúùûüÚÙÛÜ,;\s ]+$/;
        if (!control.value) {
            return null;
        }

        return !regEx.test(control.value) ? { onlytext: true } : null;
    }

    private static validateCPF(cpf: string) {
        cpf = String(cpf);
        let add = 0;
        for (let i = 0; i < 9; i++) {
            add += Number(cpf.charAt(i)) * (10 - i);
        }
        let rev = 11 - (add % 11);
        if (rev === 10 || rev === 11) {
            rev = 0;
        }
        if (rev !== Number(cpf.charAt(9))) {
            return false;
        }
        add = 0;

        for (let i = 0; i < 10; i++) {
            add += Number(cpf.charAt(i)) * (11 - i);
        }
        rev = 11 - (add % 11);
        if (rev === 10 || rev === 11) {
            rev = 0;
        }
        if (rev !== Number(cpf.charAt(10))) {
            return false;
        }
        return true;
    }

    private static cleanCPF(cpf: string) {
        return cpf.replace(/[^\d]+/g, '');
    }

    private static seecpf(cpf: string) {
        cpf = String(cpf);
        cpf = UtilValidators.cleanCPF(cpf);
        if (cpf === '') {
            return false;
        }
        return UtilValidators.validateCPF(cpf);
    }

}
