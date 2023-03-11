import { forEach } from '@angular/router/src/utils/collection';
import { UtilValidators } from 'app/shared/util/validators.util';
import { FormControl } from '@angular/forms';

// Variables
const emailInvalidated = ['Abc.example.com', 'a"b(c)d,e:f;g<h>i[j\k]l@example.com', 'just"not"right@example.com',
    'this is"not\allowed@example.com', 'this\ still\"not\\allowed@example.com', 'example@localhost',
    'john.doe@example..com', '" "@example.org', '"very.unusual.@.unusual.com"@example.com', 'Duy',
    '1234567890123456789012345678901234567890123456789012345678901234xxx@example.com' +
    '1234567890123456789012345678901234567890123456789012345678901234x+x@example.com'];

const emailValidated = ['prettyandsimple@example.com', 'very.common@example.com', 'disposable.style.email.with@example.com',
    'other.email-with-dash@example.com', 'fully-qualified-domain@example.com', 'x@example.com'];

const onlyTextInvalid = ['t3xtw1thnumb3r5', '?++text-with_char!##', 'random !$*%#!&@#&*!&@#&£§ºº'];

const onlyTextValid = ['randomTextInCamelCase', 'whatever', 'a', 'textKappa',
    'textWithoutSpace', 'snake', 'àaaçpoâôãõáá'];

const onlytextAndSeparatorpInvalid = ['23115561213213546', '@&(#&(*!@&_)(kajsdgh', 'À?}{[[]()', 'a °º',
    '*/-+.', '¹²³', '<>', 'asgdjkasdg]', '_'];

const onlytextAndSeparatorValid = ['test', 't e s t ', 'çÇéèêë', 'ú ù û üÚÙÛÜ', 't,e,s,t', 't;e;s;t;', 'test',
    'óòôõöÓÒÔÕÖ', 'áàâãäÁÀÂÃÄ', 'ÉÈÊË íìîïÍÌÎÏ,k', 'abcdefghijklmnopqrstuvwxyz'];

const onlyPositiveNumberInvalid = [-1, -1000, -50, -418, 'a', '', 'ab-1c', '1'];

const onlyPositiveNumberValid = [2, 999, 50, 0];

const cnpjInvalid = ['16512303188451', '49579215715741', '46154517412742', '99988541123654',
    '12322111554878', '66543359874122', '21210000541289', '121', '0000'];

const cnpjValid = ['63575430000151', '51268783000120', '94858211000103', '72357266000105',
    '66655153000185', '21591368000141', '21704990000119', '07335174000154', '94410252000132'];

const cpfInvalid = ['65465112354', '48132215541', '13132158451', '95589955221', '12355498663',
    '74218792189', '84551212225', '95551222451'];

const cpfValid = ['59601521500', '13735534805', '29886174730', '72026051399', '98433545752', '10784929564',
    '55699493131', '14515743040', '21938413652'];

const nitInvalid = ['654512212115', '211545451121', '000504554515', '122025513698', '554'];

const nitValid = ['37045133157', '22844488756', '19512658359', '64640103746', '82780637270'];

const cepInvalid = ['23131323213212313131231', '999999991', '12'];

const cepValid = ['77022098', '50640360', '65058492'];

const cboInvalid = ['_', '9958', 'abc', '02'];

const cboValid = ['414105', '724110', '951105', '710205'];

const ctpsInvalid = ['0', '12089966', 'asafj12'];

const ctpsValid = ['120895288791', '120021317771', '120128586452'];

const textAnNumberInvalid = [',.;;;', '!@*¨#!@¨#*&', '323131 !(@#'];

const textAnNumberValid = ['321321 ASDAJKH', '131321321', 'KASHDJ'];

//  call do formControl
const testOnlyText = (text: string) => {
    return UtilValidators.onlytext(new FormControl(text));
};

const testOnlytextAndSeparator = (text: string) => {
    return UtilValidators.onlytextAndSeparator(new FormControl(text));
};

const testOnlyPositiveNumbers = (num: number) => {
    return UtilValidators.onlyPositiveNumbers(new FormControl(num));
};

const testCbo = (cbo: string) => {
    return UtilValidators.cbo(new FormControl(cbo));
};

const testCtps = (ctps: string) => {
    return UtilValidators.ctps(new FormControl(ctps));
};

const testCnpj = (cnpj: string) => {
    return UtilValidators.cnpj(new FormControl(cnpj));
};

const testCpf = (cpf: string) => {
    return UtilValidators.cpf(new FormControl(cpf));
};

const testCep = (cep: string) => {
    return UtilValidators.cep(new FormControl(cep));
};

const testConeId = (coneId: string) => {
    return UtilValidators.coneId(new FormControl(coneId));
};

const testEmail = (email: string) => {
    return UtilValidators.email(new FormControl(email));
};

const testIdWearable = (idWearable: string) => {
    return UtilValidators.idWearable(new FormControl(idWearable));
};

const testNit = (nit: string) => {
    return UtilValidators.nit(new FormControl(nit));
};

const TestTextAnNumber = (text: string) => {
    return UtilValidators.textAnNumber(new FormControl(text));
};

// testes
describe('Testing invalid OnlyText', () => {
    onlyTextInvalid.forEach(text => {
        it('Text: ' + text, () => {
            expect(testOnlyText(text)).toEqual({ onlytext: true });
        });
    });
});

describe('Testing valid OnlyText', () => {
    onlyTextValid.forEach(text => {
        it('Text: ' + text, () => {
            expect(testOnlyText(text)).toBeNull();
        });
    });
});

describe('Testing invalid Text with separator', () => {
    onlytextAndSeparatorpInvalid.forEach(text => {
        it('Text: ' + text, () => {
            expect(testOnlytextAndSeparator(text)).toEqual({ onlytext: true });
        });
    });
});

describe('Testing valid Text with separator', () => {
    onlytextAndSeparatorValid.forEach(text => {
        it('Text: ' + text, () => {
            expect(testOnlytextAndSeparator(text)).toBeNull();
        });
    });
});

describe('Testing invalid emails', () => {
    emailInvalidated.forEach(email => {
        it('Email: ' + email, () => {
            expect(testEmail(email)).toEqual({ email: true });
        });
    });
});

describe('Testing valid emails', () => {
    emailValidated.forEach(email => {
        it('Email: ' + email, () => {
            expect(testEmail(email)).toBeNull();
        });
    });
});

describe('Testing invalid Number', () => {
    onlyPositiveNumberInvalid.forEach(num => {
        it('Number: ' + num.toString(), () => {
            expect(testOnlyPositiveNumbers(num)).toEqual({ onlyPositiveNumbers: true });
        });
    });
});

describe('Testing valid Number', () => {
    onlyPositiveNumberValid.forEach(num => {
        it('Number: ' + num.toString(), () => {
            expect(testOnlyPositiveNumbers(num)).toBeNull();
        });
    });
});

describe('Testing invalid CNPJ', () => {
    cnpjInvalid.forEach(cnpj => {
        it('CNPJ: ' + cnpj, () => {
            expect(testCnpj(cnpj)).toEqual({ cnpj: true });
        });
    });
});

describe('Testing valid CNPJ', () => {
    cnpjValid.forEach(cnpj => {
        it('CNPJ: ' + cnpj, () => {
            expect(testCnpj(cnpj)).toBeNull();
        });
    });
});

describe('Testing invalid CPF', () => {
    cpfInvalid.forEach(cpf => {
        it('CPF: ' + cpf, () => {
            expect(testCpf(cpf)).toEqual({ cpf: true });
        });
    });
});

describe('Testing valid CPF', () => {
    cpfValid.forEach(cpf => {
        it('CPF: ' + cpf, () => {
            expect(testCpf(cpf)).toBeNull();
        });
    });
});

describe('Testing invalid NIT', () => {
    nitInvalid.forEach(nit => {
        it('NIT: ' + nit, () => {
            expect(testNit(nit)).toEqual({ invalid: true });
        });
    });
});

describe('Testing valid NIT', () => {
    nitValid.forEach(nit => {
        it('NIT: ' + nit, () => {
            expect(testNit(nit)).toBeNull();
        });
    });
});

describe('Testing invalid CEP', () => {
    cepInvalid.forEach(cep => {
        it('CEP: ' + cep, () => {
            expect(testCep(cep)).toBeNull();
        });
    });
});

describe('Testing valid CEP', () => {
    cepValid.forEach(cep => {
        it('CEP: ' + cep, () => {
            expect(testCep(cep));
        });
    });
});

describe('Testing invalid CBO', () => {
    cboInvalid.forEach(cbo => {
        it('CBO: ' + cbo, () => {
            expect(testCbo(cbo)).toEqual({ cbo: true });
        });
    });
});

describe('Testing valid CBO', () => {
    cboValid.forEach(cbo => {
        it('CBO: ' + cbo, () => {
            expect(testCbo(cbo)).toBeNull();
        });
    });
});

describe('Testing invalid CTPS', () => {
    ctpsInvalid.forEach(ctps => {
        it('CTPS: ' + ctps, () => {
            expect(testCtps(ctps)).toEqual({ invalid: true });
        });
    });
});

describe('Testing valid CTPS', () => {
    ctpsValid.forEach(ctps => {
        it('CTPS: ' + ctps, () => {
            expect(testCtps(ctps)).toBeNull();
        });
    });
});

describe('Testing invalid textAnNumber', () => {
    textAnNumberInvalid.forEach(text => {
        it('Text: ' + text, () => {
            expect(TestTextAnNumber(text)).toEqual({ textAnNumber: true });
        });
    });
});

describe('Testing invalid textAnNumber', () => {
    textAnNumberValid.forEach(text => {
        it('Text: ' + text, () => {
            expect(TestTextAnNumber(text)).toBeNull();
        });
    });
});
