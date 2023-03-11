import { isNullOrUndefined } from 'util';
import { FormControl } from '@angular/forms';

export class UtilValidators {

    static cpf(control: FormControl) {
        if (control.value === '') {
            return null;
        }
        const valid = UtilValidators.seecpf(control.value);
        return valid ? null : { cpf: true };
    }

    static cbo(control: FormControl) {
        if (isNullOrUndefined(control.value)) {
            return null;
        }
        const valid = control.value.toString().replace(/[^\d]+/g, '').length === 6;

        return valid ? null : { cbo: true };
    }

    static onlytext(control: FormControl) {
        const regEx = /^[A-Za-záàâãäÁÀÂÃÄçÇéèêëÉÈÊËíìîïÍÌÎÏóòôõöÓÒÔÕÖúùûüÚÙÛÜ\s]+$/;
        if (!control.value) {
            return null;
        }

        return !regEx.test(control.value) ? { onlytext: true } : null;
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

    static onlyPositiveNumbers(control: FormControl) {
        if (isNullOrUndefined(control.value) || control.value === '') {
            return null;
        }
        const regEx = /\d+/g;
        const numero = Number(control.value);
        const valid = (regEx.test(control.value));

        return (valid && numero >= 0) ? null : { onlyPositiveNumbers: true };
    }

    static email(control: FormControl) {
        if (isNullOrUndefined(control.value)) {
            return null;
        }
      const regEx: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        const valid = (control.value.length < 128 && regEx.test(control.value));
        return valid ? null : { email: true };
    }

    private static eliminateInvalidCPFS(cpf) {
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
            cpf === '99999999999') {
            return false;
        }
    }

    private static validateCPF(cpf) {
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

    private static cleanCPF(cpf) {
        return cpf.replace(/[^\d]+/g, '');
    }

    private static seecpf(cpf) {
        cpf = String(cpf);
        cpf = UtilValidators.cleanCPF(cpf);
        if (cpf === '') {
            return false;
        }
        if (UtilValidators.eliminateInvalidCPFS(cpf) === false) {
            return false;
        }
        return UtilValidators.validateCPF(cpf);
    }

    static cnpj(control: FormControl) {
        let cnpj: string = String(control.value);
        const invalid = { cnpj: true };

        if (control.value === '') {
            return invalid;
        }

        cnpj = cnpj.replace(/[^\d]+/g, '');

        if (cnpj === '') {
            return invalid;
        }

        if (cnpj.length !== 14) { return invalid; }

        // Elimina CNPJs invalidos conhecidos
        if (cnpj.match('^(0+|1+|2+|3+|4+|5+|6+|7+|8+|9+)$')) { return invalid; }

        // Valida DVs
        let length = cnpj.length - 2;
        let nums = cnpj.substring(0, length);
        const digits = cnpj.substring(length);
        let sum = 0;
        let pos = length - 7;
        for (let i = length; i >= 1; i--) {
            sum += Number(nums.charAt(length - i)) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }
        let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
        if (result !== Number(digits.charAt(0))) {
            return invalid;
        }

        length = length + 1;
        nums = cnpj.substring(0, length);
        sum = 0;
        pos = length - 7;
        for (let i = length; i >= 1; i--) {
            sum += Number(nums.charAt(length - i)) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }
        result = sum % 11 < 2 ? 0 : 11 - sum % 11;

        return (result !== Number(digits.charAt(1))) ? invalid : null;
    }

    static nit(control: FormControl) {
        const nit: string = String(control.value).replace(/[^\d]+/g, '');

        if ((nit === '')) {
            return { required: true };
        } else if (nit.length !== 11) {
            return { invalid: true };
        }

        return null;
    }

    static ctps(control: FormControl) {
      return control.value ? control.value.match(/[\d]/g).length >= 11 ? null : { invalid: true } : null;
    }

    /**
     * para ser usada com adapter customizado (CustomDateAdapter)
     */
    static date(control: FormControl) {
        if (!isNullOrUndefined(control.value) || !control.dirty) {
            return null;
        } else {
            return control.value === undefined ? null : { invalid: true };
        }
    }

    static birthAndAdmissionDateVerify(control: FormControl) {
        if(!control.get('birthDate').value || !control.get('admissionDate').value) {
            return;
        }
        
        const birthDate = new Date(control.get('birthDate').value);
        const admissionDate = new Date(control.get('admissionDate').value);
        const isValid = birthDate < admissionDate;

        if(!isValid) {
            return {invalidDate: true}
        }
    
        return;
    }

    static phone(control: FormControl) {
        return control.value && control.dirty ? control.value.replace(/[^\d]+/g, '').length > 9 ? null : { invalid: true } : null;
    }

    static coneId(control: FormControl) {
        if (isNullOrUndefined(control.value)) {
            return null;
        }

        return control.value.toString().replace(/[^\d]+/g, '').length === 16 ? null : { coneId: true };
    }

    static cep(control: FormControl) {
        return control.dirty && control.value && control.value.replace(/[^\d]+/g, '').length < 8 ? { invalid: true } : null;
    }

    static idWearable(control: FormControl) {
        if (isNullOrUndefined(control.value)) {
            return null;
        }
        const valid = control.value.toString().replace(/[^\da-zA-Z]+/g, '').length === 16;
        return valid ? null : { idWearable: true };
    }

}
