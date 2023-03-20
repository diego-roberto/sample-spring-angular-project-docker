export class MaskUtil {

  static readonly ONLY_NUMBER = /[^\d]+/g;
  static readonly NUMBER = /\d/;

  static readonly cpfMask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  
  static readonly noSpecialChars: RegExp = /^[0-9A-Za-záàâãäÁÀÂÃÄéèêëÉÈÊËíìîïÍÌÎÏóòôõöÓÒÔÕÖúùûüÚÙÛÜÇ ]+$/;

  static readonly onlyCharsNumbers: RegExp = /^[0-9A-Za-záàâãäÁÀÂÃÄéèêëÉÈÊËíìîïÍÌÎÏóòôõöÓÒÔÕÖúùûüÚÙÛÜÇ ]+$/;

  static variableLengthMask(regex: RegExp, length: number): Array<RegExp> {
    return Array<RegExp>(length).fill(regex);
  }
  
}
