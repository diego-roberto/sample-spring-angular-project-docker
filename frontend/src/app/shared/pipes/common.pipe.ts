import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'environments/environment';

@Pipe({
  name: 'cpfMask'
})
export class CpfPipe implements PipeTransform {

  transform(value) {
    if (value) {
      value = value.toString();
      if (value.length === 11) {
        return value.substring(0, 3).concat('.')
          .concat(value.substring(3, 6))
          .concat('.')
          .concat(value.substring(6, 9))
          .concat('-')
          .concat(value.substring(9, 11));
      }
    }
    return value;
  }
}

@Pipe({ name: 'cnpjMask' })
export class CnpjPipe implements PipeTransform {

  transform(value: string) {
    if (value) {
      value = value.toString();
      if (value.length === 14) {
        return value.substring(0, 2).concat('.')
          .concat(value.substring(2, 5))
          .concat('.')
          .concat(value.substring(5, 8))
          .concat('/')
          .concat(value.substring(8, 12))
          .concat('-')
          .concat(value.substring(12, 14));
      }
    }
    return value;
  }
}

@Pipe({
  name: 'phoneMask'
})
export class PhonePipe implements PipeTransform {
  transform(value) {
    if (value) {
      if (value.length === 11) {
        return '(' + value.substring(0, 2).concat(') ').concat(value.substring(2, 7)).concat('-').concat(value.substring(7, 11));
      }
      if (value.length === 10) {
        return '(' + value.substring(0, 2).concat(') ').concat(value.substring(2, 6)).concat('-').concat(value.substring(6, 10));
      }
    }
    return value;
  }
}

@Pipe({
  name: 'backendPath'
})
export class BackendPathPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value) {
      return environment.backendUrl + value;
    } else {
      return false;
    }
  }
}

@Pipe({
  name: 'authPath'
})
export class AuthPathPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value) {
      return environment.authUrl + value;
    } else {
      return false;
    }
  }
}

@Pipe({ name: 'coneIdPipe' })
export class ConeIdPipe implements PipeTransform {
  transform(value) {
    if (value.length === 16) {
      return value.substring(0, 4).concat('-').concat(value.substring(4, 8)).concat('-').concat(value.substring(8, 12)).concat('-').concat(value.substring(12, 16));
    }
    return value;
  }

  parse(value) {
    return value && value.replace(/[\D\s\._\-]+/g, '');
  }
}

@Pipe({
  name: 'Limit'
})
export class LimitPipe implements PipeTransform {
  transform(value: string, size: number, overflowEllipsis?: boolean) {
    if (overflowEllipsis === undefined) { overflowEllipsis = true; }

    if (value && value.length > size && overflowEllipsis) {
      return value.substring(0, size).concat('...');
    }

    if (value && value.length > size && !overflowEllipsis) {
      return value.substring(0, size);
    }

    return value;
  }
}

@Pipe({
  name: 'idWearablePipe'
})
export class IdWearablePipe implements PipeTransform {
  transform(value) {
    if (value) {
      if (value.length === 16) {
        return value.substring(0, 4).concat(' ').concat(value.substring(4, 8)).concat(' ').concat(value.substring(8, 12).concat(' ').concat(value.substring(12, 16)));
      }
    }
    return value;
  }
}

@Pipe({
  name: 'cbosRemoveSynonymLetter'
})
export class CbosRemoveSynonymLetterPipe implements PipeTransform {
  transform(value) {
    return value && value.replace(/[^-\d]/g, '');
  }
}


@Pipe({
  name: 'myfilter',
  pure: false
})
export class MyFilterPipe implements PipeTransform {
  transform(items: any[], filter: any): any {
    if (!items || !filter) {
      return items;
    }

    return items.filter(item => item.company.fakeName.toLowerCase().indexOf(filter) !== -1);
  }
}

@Pipe({
  name: 'myQualityfilter',
  pure: false
})
export class MyFilterQualityPipe implements PipeTransform {
  transform(items: any[], filter: any): any {
    if (!items || !filter) {
      return items;
    }

    return items.filter(item => item.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));
  }
}
