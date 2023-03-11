import { isNullOrUndefined } from 'util';
import { NativeDateAdapter } from '@angular/material';
import * as Moment from 'moment';

const SUPPORTS_INTL_API = typeof Intl !== 'undefined';

export class CustomDateAdapter extends NativeDateAdapter {
    useUtcForDisplay = true;

    parse(value: any): Date | null {

        if (Object.prototype.toString.call(value) === '[object Date]') {
            return value;
        }

        if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
            const str = value.split('/');

            const year = Number(str[2]);
            const month = Number(str[1]) - 1;
            const date = Number(str[0]);

            return value.length === 10 &&
                !isNaN(date) && !isNaN(month) && !isNaN(year) &&
                str[0].length === 2 && str[1].length === 2 &&
                year.toString().length > 3 &&
                Moment(value, 'DD/MM/YYYY', true).isValid() ?
                new Date(year, month, date) : null;
        }

        if (value === '') {
            return undefined;
        }

        const timestamp = typeof value === 'number' ? value : value && value.isValid && value.isValid() ? value : NaN;
        return isNaN(timestamp) ? null : new Date(timestamp);
    }

    format(date: Date, displayFormat: Object): string {
        if (SUPPORTS_INTL_API) {
            if (this.useUtcForDisplay) {
                date = new Date(Date.UTC(
                    date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(),
                    date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
                displayFormat = Object.assign({}, displayFormat, { timeZone: 'utc' });
            }

            const dtf = new Intl.DateTimeFormat(this.locale, displayFormat);
            return dtf.format(date).replace(/[\u200e\u200f]/g, '');
        }
    }
}
