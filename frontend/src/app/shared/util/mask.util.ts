
/**
 * Mascaras prontas para biblioteca text-mask
 */
export class MaskUtil {

  static readonly ONLY_NUMBER = /[^\d]+/g;
  static readonly NUMBER = /\d/;

  // CPF
  static readonly cpfMask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  // CNPJ
  static readonly cnpjMask = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  // NIT/NIS/PIS/PASEP
  static readonly nitMask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/, '-', /\d/];
  // CBO
  static readonly cboMask = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  // CTPS
  static readonly ctpsMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, '-', /\d/];
  // CNAE
  static readonly cnaeMask = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, '/', /\d/, /\d/];
  // CEP
  static readonly cepMask = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  // CEI
  static readonly ceiMask = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/, /\d/, '/', /\d/, /\d/];
  // coneId
  static readonly coneIdMask = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  // CARTÃO DE ACESSO
  static readonly accessCardMask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/];

  // Somente letras(com acentos), numeros e espaço.
  static readonly noSpecialChars: RegExp = /^[0-9A-Za-záàâãäÁÀÂÃÄéèêëÉÈÊËíìîïÍÌÎÏóòôõöÓÒÔÕÖúùûüÚÙÛÜÇ ]+$/;

  // Somente letras(com acentos), numeros e espaço.
  static readonly onlyCharsNumbers: RegExp = /^[0-9A-Za-záàâãäÁÀÂÃÄéèêëÉÈÊËíìîïÍÌÎÏóòôõöÓÒÔÕÖúùûüÚÙÛÜÇ ]+$/;

  // idWearable
  static readonly idWearableMask = [/[a-zA-Z0-9]+/, /[a-zA-Z0-9]+/, /[a-zA-Z0-9]+/, /[a-zA-Z0-9]+/, ' ', /[a-zA-Z0-9]+/, /[a-zA-Z0-9]+/, /[a-zA-Z0-9]+/, /[a-zA-Z0-9]+/, ' ', /[a-zA-Z0-9]+/, /[a-zA-Z0-9]+/, /[a-zA-Z0-9]+/, /[a-zA-Z0-9]+/, ' ', /[a-zA-Z0-9]+/, /[a-zA-Z0-9]+/, /[a-zA-Z0-9]+/, /[a-zA-Z0-9]+/];

  // TIME para training
  static readonly trainingTimeMask = [/[0-2]/, /^([0-9]|2[0-3])/, ':', /[0-5]/, /[0-9]/];

  // TIME para training duration
  static readonly durationTimeMask = [/[0-2]/, /[0-9]/, ':', /[0-5]/, /[0-9]/, ':', /[0-5]/, /[0-9]/];


  // PHONE
  static phoneMask(input: string) {
    const numbers = input.match(/\d/g);
    let numberLength = 0;
    if (numbers) {
      numberLength = numbers.join('').length;
    }

    return numberLength > 10 ?
      ['(', /[1-9]/, /[1-9]/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/] :
      ['(', /[1-9]/, /[1-9]/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  }

  static numberWithoutLeadingZeros(rawValue: string): RegExp[] {
    const mask = /[0-9]/;
    const strLength = String(rawValue).length;
    const inputMask: RegExp[] = [/[1-9]/];

    for (let i = 0; i <= strLength; i++) {
      inputMask.push(mask);
    }

    return inputMask;
  }

  /**
   * Retorna mascara com tamanha e regex passado no parametro
   */
  static variableLengthMask(regex: RegExp, length: number): Array<RegExp> {
    return Array<RegExp>(length).fill(regex);
  }
}
